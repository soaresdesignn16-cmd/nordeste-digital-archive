

## Remover marquees + foto maior + efeito reveal de palavras em todo o site

### 1. Remover o efeito marquee (faixas correndo)

Na seção "Muito Prazer" (`FounderSection` em `src/routes/index.tsx`, linhas 946-983):

- Remover os dois `<div className="marquee marquee--back">` e `<div className="marquee marquee--front">` (faixas de texto correndo na frente e atrás).
- Manter apenas o wrapper `.founder-stage` com a `<img>` da foto do fundador.
- A foto passa a ocupar **todo o espaço** do `.founder-stage` (atualmente limitada a `max-width: 380px`).

**CSS (`src/styles.css`, linhas 874-956):**

- Apagar todas as classes `.marquee`, `.marquee--back`, `.marquee--front`, `.marquee__track`, e os `@keyframes marquee-rtl` / `marquee-ltr`.
- Atualizar `.founder-stage__photo`:
  - `max-width: 100%` (em vez de 380px) — ocupa o stage inteiro.
  - `aspect-ratio: 4 / 5` mantido para proporção retrato.
  - Mantém `border-radius: 12px`, `box-shadow`, `object-fit: cover`.
- `.founder-stage`: remover altura fixa (`height: 560px`); deixar a altura ser ditada pela foto via `aspect-ratio`. `max-width: 560px` para enquadramento elegante centralizado.
- Mobile: `.founder-stage { max-width: 420px }`.

### 2. Aplicar o efeito "Scroll Reveal" (palavra-por-palavra) em **todos os textos corridos** do site

Atualmente o efeito está só no parágrafo da seção "Muito Prazer" (via componente `RevealWords`). Vou estender para todos os parágrafos longos / subjacentes (descrições) das demais seções, usando o mesmo componente já existente — sem mudar cor nem paleta (cinza ghost → branco primário, igual ao atual).

**Locais que recebem `<RevealWords>`** (substituem `<p className="typo-body">`):

- **Hero (mobile + desktop)** — linhas 704-708 e 744-748: parágrafo "Empresário e profissionais nordestinos…".
- **VSL Section** — linha 489: parágrafo "…" (descrição abaixo do título).
- **Manifesto** — linhas 821-825 e 826-831: dois parágrafos "Nascemos com um propósito…" e "Hoje, à frente do movimento…".
- **Audience** — linha 891-894: "Você se encaixa em um desses perfis…".
- **Audience cards** — linha 905 (`<p>{p.desc}</p>`): descrição de cada perfil → trocar por `<RevealWords>`.
- **Manifesto cards** — linha 855 (`<p>{c.desc}</p>`): descrição de cada card.
- **Impact (Ganhos)** — linhas 1037-1038: `ganho-titulo` e `ganho-desc` de cada bloco. *Observação: já tem `scroll-fade` no container — o `RevealWords` aplica nos textos por dentro, mantendo ambos os efeitos compatíveis.*
- **Final CTA** — linha 1109: "Entre para o movimento exclusivo…".

**Não recebem o efeito** (mantêm-se como estão):
- Headlines (`typo-headline`, `typo-display`, `pre-display`) — são títulos com animação própria (`hero-anim`, `Reveal`).
- Eyebrows e labels (`eyebrow`, `typo-label`) — rótulos curtos.
- Quotes (`quote-block`, `quote-author`) — já têm tratamento próprio.
- Botões e números (`Stat`, `ganho-numero`).
- Footer.

### 3. Ajuste técnico no componente `RevealWords`

O componente atualmente renderiza sempre como `<p>`. Para suportar substituir parágrafos com classes específicas (ex.: `ganho-titulo`, `ganho-desc`) sem quebrar estilos, mantém-se renderizando como `<p>` e apenas se passa a `className` original. Isso já funciona — sem mudanças necessárias no componente.

### 4. Comportamento e paleta (sem alteração de cores)

- Estado inicial: `var(--text-ghost)` opacity `0.25` (já definido).
- Estado ativo conforme scroll passa pela linha (75% da viewport): `var(--text-primary)` opacity `1`.
- `<strong>` e `.accent-text` internos preservam o destaque laranja existente (o `splitNodeIntoWords` já preserva nós filhos React).
- Performance: hook `useScrollProgressReveal` já existe, throttled via `requestAnimationFrame` + `IntersectionObserver` — nenhum custo extra.
- `prefers-reduced-motion`: já tratado (palavras viram totalmente visíveis sem transição).

### Arquivos editados

- `src/routes/index.tsx` — remover JSX dos 2 marquees na `FounderSection`; trocar `<p className="typo-body">` (e `<p>` de cards/ganhos) por `<RevealWords className="…">` nas seções listadas.
- `src/styles.css` — remover blocos `.marquee*` + keyframes `marquee-ltr`/`marquee-rtl`; ajustar `.founder-stage` (sem altura fixa, max-width 560px) e `.founder-stage__photo` (max-width 100%).

