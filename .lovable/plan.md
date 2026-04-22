

## Scroll Reveal — Word-by-word + Block-by-block

Adicionar um efeito de "Scroll Reveal" no estilo Wadada Run Club em duas seções, mantendo a paleta atual (cinza escuro `var(--text-ghost)` → cinza claro `var(--text-primary)` com toque do laranja `var(--accent)` nas palavras-chave).

### 1. Seção "Muito Prazer, Os Novos Nordestinos" (FounderSection)

**Efeito:** Texto começa esmaecido (`var(--text-ghost)`, opacity ~0.25) e cada **palavra** acende individualmente conforme o scroll passa por ela, criando uma leitura progressiva.

- Aplicar no parágrafo principal (linhas 814–822) — o bloco de texto longo ("Nascemos com um propósito…").
- Quebrar o texto em `<span>` por palavra (preservando `<strong>Arquitetura de Posicionamento Digital</strong>` que mantém o destaque laranja final).
- Cada palavra ganha classes `word` + `word--active` quando entra na zona de leitura (centro da viewport).

### 2. Seção "O que muda na sua vida" (ImpactSection)

**Efeito:** Cada um dos 4 **blocos** (`.ganho-item`) começa esmaecido (opacity 0.25, leve translateY) e acende inteiro quando entra no centro da viewport ao rolar — um por vez, sem alterar layout/cores existentes.

- Trocar a animação atual `Reveal` (que dispara uma única vez ao entrar) por um sistema baseado em scroll-progress que mantém o item esmaecido até passar pelo viewport-center e o "acende".
- Não tocar nos textos internos (apenas o container `.ganho-item` muda de opacidade/cor base).

### Implementação técnica

**`src/styles.css`** — adicionar:
```css
.reveal-word {
  color: var(--text-ghost);
  opacity: 0.25;
  transition: color 0.45s ease, opacity 0.45s ease;
  display: inline;
}
.reveal-word.is-active {
  color: var(--text-primary);
  opacity: 1;
}

.scroll-fade {
  opacity: 0.25;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateY(8px);
}
.scroll-fade.is-active {
  opacity: 1;
  transform: translateY(0);
}
```

**`src/routes/index.tsx`** — adicionar:

1. **Hook `useWordReveal(ref)`** — usa `IntersectionObserver` + `scroll` listener com `requestAnimationFrame` throttled. Para cada `.reveal-word` dentro do ref, calcula sua posição em relação à linha "ativa" (60% da viewport) e adiciona/remove `is-active`.

2. **Componente `RevealWords({ children })`** — recebe uma string ou ReactNode, divide o texto por espaço em `<span class="reveal-word">palavra </span>`, preservando elementos filhos como `<strong>` (split apenas em nós de texto).

3. **Hook `useScrollFade()`** — versão similar mas para blocos inteiros: aplica/remove `is-active` em elementos `.scroll-fade` baseado no centro da viewport.

4. **Integração FounderSection (linha 814–822):** envolver o `<p>` com `<RevealWords>...</RevealWords>` mantendo o `<strong>` interno.

5. **Integração ImpactSection (linha 891–902):** adicionar `scroll-fade` à classe do `.ganho-item` e ativar o hook `useScrollFade` no componente. Manter o `Reveal` externo apenas para a entrada inicial OU substituí-lo pelo novo hook (preferência: substituir nos `.ganho-item` para evitar conflito de transições).

### Cores (sem mudança de paleta)

- Estado inativo: `var(--text-ghost)` com opacity 0.25
- Estado ativo (palavras normais): `var(--text-primary)` (#F2F0EB)
- `<strong>` interno mantém `accent-text` laranja já existente
- Blocos `.ganho-item`: estilos atuais preservados; só muda opacity do container

### Performance

- Um único listener de scroll global (rAF throttled) compartilhado por ambos hooks.
- `IntersectionObserver` para ativar/desativar o cálculo apenas quando a seção está visível.
- Sem re-renders React — manipulação direta de `classList`.

### Arquivos editados

- `src/routes/index.tsx` — novos hooks + componente `RevealWords`, integração nas duas seções.
- `src/styles.css` — classes `.reveal-word` e `.scroll-fade`.

