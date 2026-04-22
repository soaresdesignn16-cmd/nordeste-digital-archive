

## Reorganizar FounderSection: foto à direita, conteúdo à esquerda + logo preta no botão

Hoje a seção (em desktop ≥900px) usa layout full-bleed: a foto cobre 100% da largura com object-position 60% center, e o conteúdo fica sobreposto com overlay escuro à esquerda. Em viewports ~1000px isso ainda corta a foto (mostra só o ombro/braço) e a hierarquia "texto em cima da foto" fica confusa.

Solução: **layout split em duas colunas no desktop** (texto à esquerda, foto à direita, sem sobreposição), mantendo o full-bleed apenas no mobile.

### Mudanças

**`src/styles.css`** — reescrever o bloco desktop `@media (min-width: 900px)` (linhas 1418–1462):

- `.founder-bleed`: vira `display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; min-height: 100vh; padding: 0;` (duas colunas iguais, lado a lado).
- `.founder-bleed__bg`: muda de `position: absolute` full-width para `position: relative; grid-column: 2; width: 100%; height: 100%; object-position: center center;` — a foto fica contida na coluna direita inteira, mostrando o fundador completo (cabeça + torso + poltrona) sem corte.
- `.founder-bleed__overlay`: simplifica para um leve gradient vertical apenas dentro da coluna da foto (`grid-column: 2; background: linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(0,0,0,0.4) 100%)`) — só para fundir a base com o footer, sem escurecer o rosto.
- `.founder-bleed__content`: vira `grid-column: 1; padding: 0 60px; display: flex; flex-direction: column; justify-content: center; max-width: none;` — texto centralizado verticalmente na coluna esquerda, sobre fundo preto sólido.
- Adicionar breakpoint intermediário `@media (min-width: 900px) and (max-width: 1199px)`: ajustar `padding: 0 40px` no content e reduzir headline para `clamp(34px, 4.5vw, 46px)` para caber bem em ~1000px.
- Adicionar `@media (min-width: 1200px)`: padding `0 80px` no content e voltar à headline maior.

**`src/styles.css`** — logo preta no botão (linha 1375–1381):

- Em `.founder-cta__icon`, adicionar `filter: brightness(0);` — converte o PNG do logo (que é branco/laranja) em silhueta 100% preta, contrastando com o fundo laranja `#C8780A` do botão. Solução pura CSS, sem precisar de novo asset.

**Mobile (max-width: 640px)** — não muda a estrutura, mas:
- Reverter `.founder-bleed__bg` e `.founder-bleed__overlay` para `position: absolute` (resetar o grid-column do desktop) com `width: 100%; height: 62%`. Já está praticamente ok como está.

**`src/routes/index.tsx`** — sem mudanças estruturais. A ordem do JSX (`<img>` → `<overlay>` → `<content>`) já funciona com grid: o CSS coloca a img na coluna 2 e o content na coluna 1 via `grid-column`.

### Resultado esperado

- **Desktop (≥900px)**: tela dividida 50/50 — esquerda preta com label "Quem Está Por Trás", headline "MUITO PRAZER / OS NOVOS / NORDESTINOS", subtítulo, e botão laranja com logo preta. Direita com a foto inteira do fundador na poltrona, sem cortes, sem overlay escuro lavando o rosto.
- **Mobile (≤640px)**: layout vertical mantido (foto em cima, texto embaixo) — já funcional.
- **Logo no botão**: silhueta preta nítida sobre o laranja `#C8780A`, batendo com o tema do botão.

### O que NÃO muda

- Conteúdo textual (label, headline, subtítulo, texto do botão) — preservado.
- Cor laranja `#C8780A` do botão, hover shine, transições — preservados.
- Lógica do `Reveal` e demais seções — intacta.
- Asset `founder-armchair.jpg` continua o mesmo, só o enquadramento muda (cabe inteiro na coluna direita).
- Asset `logo-onn.png` continua o mesmo (apenas filtro CSS aplicado para virar preto no contexto do botão).

### Arquivos editados

- `src/styles.css`:
  - Linhas 1375–1381 (`.founder-cta__icon`): adicionar `filter: brightness(0);`.
  - Linhas 1418–1462 (bloco desktop): reescrever para grid 2 colunas (texto esquerda, foto direita).
  - Adicionar media query intermediária `(min-width: 900px) and (max-width: 1199px)` para ajustar padding/headline em viewports tablet-desktop.
  - Linhas 1464–1483 (mobile): garantir reset do grid (foto volta a `position: absolute` no mobile).

