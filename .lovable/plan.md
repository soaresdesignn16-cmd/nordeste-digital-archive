

## Efeito Recede — Apenas na Headline "Pronto para ser visto de verdade?"

Ajuste do plano anterior: o efeito de scroll-zoom (recede/profundidade) é aplicado **somente na frase grande** "Pronto para ser visto de verdade?" — o restante da seção `FinalCTA` continua **intacto** (eyebrow "A Hora É Agora", parágrafo, CTA principal, CTA secundário, quote final, watermark, SVG).

### Comportamento

- A headline `Pronto para ser visto de verdade?` vira o elemento animado.
- Começa em `scale: 1.15` com `opacity: 1` quando entra na viewport.
- Conforme o scroll desce, encolhe até `scale: 0.6` e opacidade cai para `0.25` — sensação de "ir para o fundo".
- Tudo ao redor (eyebrow acima, parágrafo abaixo, botões, quote) **não se move e não muda**.

```text
scroll progress  0 ─────────────── 1
headline scale   1.15 ─────────── 0.6
headline opacity 1.0 ──────────── 0.25
resto da seção   sem mudança
```

### Mudanças no `FinalCTA` (`src/routes/index.tsx`, linhas 1300–1353)

- Adicionar `useRef` no elemento `<h2>` da headline `Pronto para ser visto de verdade?` e `useRef` na `<section>`.
- Adicionar `useEffect` com listener `scroll` passivo + `requestAnimationFrame` throttle.
- Cálculo do progresso: `progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1)` com easing smoothstep `t*t*(3-2t)`.
- Aplicar via CSS variables no ref da headline:
  - `--headline-scale: ${(1.15 - 0.55 * t).toFixed(3)}` (1.15 → 0.6)
  - `--headline-opacity: ${(1 - 0.75 * t).toFixed(3)}` (1.0 → 0.25)
- Cleanup do listener no unmount.
- Respeitar `prefers-reduced-motion`: pula o listener, headline fica estática.
- Adicionar `className="final-cta-headline"` no `<h2>` existente.

**Nada mais é removido ou alterado** — eyebrow, parágrafo, watermark `ONN`, SVG dos círculos, botão primário, botão secundário "Conhecer o manifesto" e quote final permanecem como estão.

### CSS novo em `src/styles.css`

Adicionar bloco no final do arquivo (não substitui nada):

```css
.final-cta-headline {
  display: inline-block;
  transform: scale(var(--headline-scale, 1.15));
  opacity: var(--headline-opacity, 1);
  transform-origin: 50% 50%;
  transition: transform 0.1s linear, opacity 0.1s linear;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .final-cta-headline {
    transform: none;
    opacity: 1;
    transition: none;
  }
}
```

A seção `.section-cta` precisa de `overflow: hidden` para evitar scrollbar horizontal quando a headline estiver em `scale: 1.15` — adicionar essa propriedade caso ainda não exista.

### O que NÃO muda

- Estrutura visual da seção (eyebrow, parágrafo, watermark, SVG, ambos os CTAs, quote).
- `DuranteAnosHeadline` antes — intacto.
- `Footer` depois — intacto.
- Tokens (`--accent`, `--bg-surface`, `--font`).
- Nenhum bloco CSS existente é removido.

### Arquivos editados

- `src/routes/index.tsx` — adicionar `useRef` + `useEffect` em `FinalCTA`; aplicar `className="final-cta-headline"` no `<h2>` da frase "Pronto para ser visto de verdade?".
- `src/styles.css` — adicionar bloco `.final-cta-headline` (~15 linhas) e garantir `overflow: hidden` em `.section-cta`.

