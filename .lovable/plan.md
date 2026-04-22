

## Ajuste do Efeito Recede — começa GRANDE, encolhe ao descer + sem pulo ao voltar

Dois ajustes no efeito da headline `Pronto para ser visto de verdade?` na seção `FinalCTA`.

### 1. Headline começa MAIOR e encolhe mais (igual ao vídeo)

Hoje: `scale 1.15 → 0.6`, `opacity 1 → 0.25`. Visualmente quase não muda no início.
Novo: `scale 1.9 → 0.55`, `opacity 1 → 0.2` — assim que a seção entra na viewport pelo fundo, a frase aparece **bem grande** preenchendo a tela, e vai recuando para o fundo conforme o scroll desce, exatamente como o vídeo de referência.

```text
scroll progress  0 ─────────────── 1
headline scale   1.9 ──────────── 0.55
headline opacity 1.0 ──────────── 0.20
```

A faixa de scroll usada para mapear o progresso passa a cobrir toda a travessia da seção pela viewport (entrada pelo fundo até saída pelo topo), garantindo curva suave e contínua.

### 2. Continuidade visual com a seção anterior (fundo preto)

A `DuranteAnosHeadline` termina em fundo escuro. Hoje a `FinalCTA` usa `background: var(--bg-surface)` (mais claro) com `border-top` e um `radial-gradient` âmbar — gera quebra visual.

Mudança no CSS de `.section-cta` (linhas 950–963 de `src/styles.css`):
- Trocar o `background` para `var(--bg)` (mesmo preto da seção `DuranteAnos`) para a transição ficar contínua, igual o vídeo onde a frase grande nasce no mesmo plano escuro.
- Remover o `border-top` (some a linha de divisão).
- Manter o `::before` com o radial âmbar suave (dá profundidade no fundo da headline grande).

Nada na ordem das seções muda — `DuranteAnosHeadline` continua antes de `FinalCTA` em `index.tsx` linha 444–445.

### 3. Sem pulo ao rolar para cima — recálculo robusto

O `useEffect` atual já chama `update()` no mount e escuta `scroll`/`resize`, mas existem duas falhas que causam o "pulo":

a) O `update()` inicial roda antes do layout estabilizar (fontes/imagens carregando acima da seção mudam o `rect.top` depois). Resultado: ao primeiro scroll, a headline "salta" para a posição correta.
b) Não há recálculo quando a aba volta a ficar visível ou quando o load completa.

Correções no `useEffect` do `FinalCTA` (linhas 1305–1345 de `src/routes/index.tsx`):

- Manter `update()` síncrono no mount.
- Adicionar segundo `update()` agendado via `requestAnimationFrame` duplo (após primeiro paint) para pegar o layout final.
- Adicionar listener `window.addEventListener("load", update)` — recalcula quando todas as imagens carregaram.
- Adicionar `ResizeObserver` no `section.current` — recalcula quando seções acima mudam de altura (ex.: imagem do `FounderSection` carrega tarde e empurra o offset).
- Adicionar `document.addEventListener("visibilitychange", ...)` para recálculo ao voltar para a aba.
- Garantir que `update()` rode também quando `rect.top > vh` (acima da viewport) e fixe `scale` no valor inicial máximo (1.9) e opacidade 1 — hoje o `clamp` já faz isso, mas o cálculo cobre a faixa nova corretamente.
- Cleanup completo de todos os listeners + `ResizeObserver.disconnect()`.

Curva nova (substitui linhas 1325–1326):
```
scale   = 1.9  - 1.35 * t   // 1.9 → 0.55
opacity = 1.0  - 0.80 * t   // 1.0 → 0.20
```

### 4. CSS atualizado para a headline

Em `src/styles.css` (bloco `.final-cta-headline`, linhas 1515–1530), atualizar o default para o novo valor inicial grande, evitando flash de tamanho errado antes do JS rodar:

```css
.final-cta-headline {
  display: inline-block;
  transform: scale(var(--headline-scale, 1.9));
  opacity: var(--headline-opacity, 1);
  transform-origin: 50% 50%;
  transition: transform 0.08s linear, opacity 0.08s linear;
  will-change: transform, opacity;
}
```

A `.section-cta` já tem `overflow: hidden` (linha 955), então o `scale 1.9` não cria scrollbar horizontal.

### O que NÃO muda

- Estrutura JSX: eyebrow, parágrafo, ambos os botões, quote, watermark `ONN` e SVG dos círculos permanecem.
- Ordem das seções (`DuranteAnos` → `FinalCTA` → `Footer`).
- `Footer` intacto.
- Tokens (`--accent`, `--bg`, `--font`, `--border-subtle`).
- Outras seções (`HeroIntro`, `FounderSection`, etc.) intactas.
- `prefers-reduced-motion` continua sendo respeitado (sem listener, headline fica estática em `scale 1`).

### Arquivos editados

- `src/routes/index.tsx` — atualizar `useEffect` do `FinalCTA` (linhas 1305–1345): nova curva (1.9→0.55 / 1.0→0.20), recálculo robusto com `rAF` duplo, listener `load`, `ResizeObserver`, `visibilitychange` e cleanup completo.
- `src/styles.css` — em `.section-cta` (linhas 950–963): trocar `background` para `var(--bg)`, remover `border-top`. Em `.final-cta-headline` (linhas 1515–1530): atualizar default `--headline-scale` para `1.9`.

