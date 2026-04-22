

## Remover o "fade out" da headline final + padronizar desktop/mobile

Dois problemas no `FinalCTA`:

1. **Texto "ofuscado"**: a headline usa `opacity: 1 → 0.15` durante o scroll (linha 1329 em `index.tsx`: `opacity = 1 - 0.85 * t`). Isso somado ao `radial-gradient` laranja do `.section-cta::before` faz a frase parecer apagada/ofuscada conforme rola.
2. **Sticky não funciona**: a classe `.final-cta-sticky` é usada no JSX mas **não existe no CSS**. Sem `position: sticky`, a headline rola junto com a página em vez de "encolher fixa" no centro — desktop e mobile ficam fora do padrão.

### Mudanças

**`src/routes/index.tsx`** (função `FinalCTA`, linhas 1320–1332):
- Remover a linha de opacidade (`const opacity = ...` e `setProperty("--headline-opacity", opacity)`).
- Manter apenas o `scale` (1.9 → 0.4) — a headline encolhe sem desaparecer.
- Headline fica com opacidade fixa em `1` o tempo todo.

**`src/styles.css`**:
- **Adicionar regra `.final-cta-sticky`** (depois da linha 1574):
  ```
  .final-cta-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ```
- **`.final-cta-headline` (linhas 1560–1567)**: remover `opacity: var(--headline-opacity, 1)` (fica sempre 1). Manter `transform: scale(...)`, `transform-origin: 50% 50%`, transição suave.
- **`.section-cta::before` (linhas 993–999)**: reduzir o gradient radial laranja de `rgba(224,140,50,0.12)` para `rgba(224,140,50,0.05)` e mudar a posição de `50% 0%` para `50% 50%` para parar de "lavar" o texto por cima e dar leve profundidade ao redor.
- **Padding mobile**: adicionar dentro de `@media (max-width: 768px)` regra para `.final-cta-sticky { height: 100svh; }` (usa `svh` no mobile pra não ter glitch com a barra de endereço do Safari/Chrome).
- **Headline mobile**: garantir que `.final-cta-headline` no mobile inicie em `scale(1.4)` em vez de `1.9` (telas pequenas não comportam 1.9x sem cortar). Usar media query `@media (max-width: 768px)` ajustando a curva via CSS variable default — ou mais simples, no `useEffect` detectar `window.innerWidth < 768` e usar `1.4 - 1.0 * t` em vez de `1.9 - 1.5 * t`.

### Resultado esperado

- Desktop: headline aparece grande (1.9x), centralizada, fixa por 1 viewport, encolhe suavemente para 0.4x sem nunca perder opacidade — texto sempre 100% legível, sem "fade ofuscante".
- Mobile: headline aparece em 1.4x (cabe na tela), mesmo comportamento sticky, encolhe para 0.4x, sem cortar nas laterais.
- Gradient laranja fica como halo sutil ambiente, não mais como camada que apaga o texto.

### O que NÃO muda

- Texto "Pronto para ser / visto de verdade?" — preservado.
- Toda a lógica de listeners robustos do `useEffect` (scroll, resize, load, ResizeObserver, visibilitychange) — preservada.
- `CTABlock` (eyebrow + parágrafo + botões + quote) acima da `FinalCTA` — intacto.
- `DuranteAnosHeadline`, `Footer`, demais seções — intactos.
- Tokens de cor e tipografia — intactos.

### Arquivos editados

- `src/routes/index.tsx` (linhas 1320–1332): remover lógica de opacidade; adicionar branch mobile na curva de scale.
- `src/styles.css`:
  - Linhas 993–999: suavizar gradient do `.section-cta::before`.
  - Linhas 1560–1567: remover `opacity` variável da `.final-cta-headline`.
  - Após linha 1574: adicionar `.final-cta-sticky` com `position: sticky; top: 0; height: 100vh; display: flex; align/justify center`.
  - Adicionar media query mobile (`max-width: 768px`) ajustando `.final-cta-sticky { height: 100svh }`.

