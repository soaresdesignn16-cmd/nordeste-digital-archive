

# Ajustes — Hero, Audience desktop, Durante Anos e Final CTA

## 1. Hero (foto do fundador colada no topo no mobile)

**Problema:** Há uma faixa preta visível acima da foto antes do conteúdo (entre a status bar do celular e o início da foto), porque o `<section className="hero">` herda o `padding-top: 90px` global do mobile.

**Solução em `src/styles.css`:**
- No `@media (max-width: 767px)` global, **excluir** `.hero` (e `#hero-intro > section`) do padding-top de 90px, já mantendo `.hero { padding-top: 0 }` que existe na linha 573–575.
- Garantir `margin-top: 0` no container interno mobile do hero (`#hero-intro` e `.hero` no mobile recebem `padding-top: 0 !important`).
- Aumentar a altura da foto mobile de `70vh` para `100svh` (com fade pro preto começando em ~60%) — assim a foto preenche a tela inteira até o topo, sem espaço escuro sobrando, exatamente como no screenshot enviado.

**Solução em `src/routes/index.tsx` (HeroIntro mobile):**
- Trocar `style={{ height: "70vh" }}` por `style={{ height: "100svh" }}` no wrapper da imagem.
- Ajustar o gradiente bottom para começar mais embaixo (height 35% em vez de 45%), para o rosto não ficar coberto.

---

## 2. Audience desktop ("Esse movimento é pra você") — scroll travando

**Problema:** No desktop, a seção tem `height: 300vh` com pin, e a animação fan-out exige rolar 3 viewports só pra ver os 4 cards. O usuário sente como se a página "travasse".

**Solução em `src/styles.css` (linhas 747–784):**
- Reduzir `.audience-pin { height: 300vh }` → **`height: 200vh`** (1 viewport extra é suficiente para mostrar o leque + o destaque dos 4 cards).
- Manter o `audience-pin__sticky` em 100vh.

**Solução em `src/routes/index.tsx` (useEffect do AudienceSection, linhas 1252–1260):**
- Comprimir o timeline dos `seg(...)` para acabar perto de `progress = 1` mais rápido, mantendo as transições suaves:
  - `--focus`: `seg(0.18, 0.30)`
  - `--slide`: `seg(0.28, 0.40)`
  - `--focus-3`: `seg(0.38, 0.50)`
  - `--slide-3`: `seg(0.48, 0.60)`
  - `--focus-2`: `seg(0.58, 0.70)`
  - `--slide-2`: `seg(0.68, 0.80)`
  - `--focus-1`: `seg(0.78, 0.90)`
  - `--slide-1`: `seg(0.88, 1)`
- `FAN_END` desktop continua `0.25` (leque abre cedo, depois cards individuais fluem rápido).

Resultado: o pin some 33% mais rápido, sem perder a animação.

---

## 3. "Durante anos tentaram…" — terceira frase passa direto

**Problema:** O componente `DuranteAnosHeadline` divide o scroll em 3 segmentos (cada um = 33% do progresso), e a frase 3 (`Agora é a nossa vez`) tem o pico em `local = 0.5` do segmento, mas o segmento 3 termina exatamente quando o pin acaba — então no momento em que ela atinge `opacity: 1` o sticky já está soltando, e ela some imediatamente.

**Solução em `src/routes/index.tsx` (linhas 1518–1549):**
- Aumentar o tempo de leitura da frase final adicionando uma **fase de "hold"** no último segmento:
  - Para `i === N - 1` (última frase), expandir o platô central de `0.4–0.6` para `0.35–0.85` (frase fica visível por 50% do segmento, em vez de 20%).
  - A saída (`local > 0.85`) usa o restante 0.15 do segmento.

**Solução em `src/styles.css` (linhas 1823–1875):**
- Aumentar `.durante-anos-pin { height: 280vh }` → **`height: 320vh`** desktop e `220vh` → `260vh` mobile, dando margem extra de scroll para a frase final ficar fixa antes de soltar.

Resultado: a frase "Agora é a nossa vez" fica congelada no centro da tela por ~1 viewport antes de o pin liberar.

---

## 4. Final CTA — espaço vazio no desktop

**Problema:** `.final-cta-sticky { height: 100dvh }` força a seção a ocupar a viewport inteira, e como o conteúdo (eyebrow + headline + descrição + botão + nota + citação) ocupa só ~70% da altura no desktop, sobra muito preto. Além disso `.final-cta-actions { margin-top: clamp(120px, 18vh, 220px) }` empurra o botão pra muito longe da headline.

**Solução em `src/styles.css`:**
- `.final-cta-sticky`:
  - Desktop (≥ 768px): trocar `height: 100dvh` por `min-height: auto; height: auto;` — o sticky deixa de ser sticky de viewport cheia e vira fluxo normal.
  - Mobile mantém o comportamento atual.
- `.section-cta` (linhas 1211–1224):
  - Desktop: trocar `padding: 120px 0` por **`padding: 96px 0`**.
- `.final-cta-actions` (linha 1941–1948):
  - Reduzir `margin-top: clamp(120px, 18vh, 220px)` → **`margin-top: clamp(40px, 6vh, 80px)`**.
  - Mobile (linha 1958–1960): `margin-top: clamp(32px, 5vh, 56px)`.
- `.final-cta-quote` (linha 1265–1276):
  - Reduzir `margin: 80px auto 0; padding-top: 56px;` → **`margin: 56px auto 0; padding-top: 40px;`**.

Resultado: a seção fica proporcional ao conteúdo, sem 30% de preto vazio embaixo do botão.

---

## Arquivos editados

- `src/routes/index.tsx` — hero mobile (height 100svh), useEffect AudienceSection (timeline comprimido), useEffect DuranteAnosHeadline (hold da última frase).
- `src/styles.css` — `.hero` mobile padding override, `.audience-pin` height, `.durante-anos-pin` height, `.section-cta` / `.final-cta-sticky` / `.final-cta-actions` / `.final-cta-quote` espaçamentos desktop.

Nenhum texto, imagem, cor ou logomarca é alterado.

