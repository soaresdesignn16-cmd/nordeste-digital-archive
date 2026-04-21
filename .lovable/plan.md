

## Plano — Ajustes finais: foto do idealizador, blocos, scroll-reveal, tipografia e CTAs

São 6 ajustes objetivos, todos focados em encaixe visual e hierarquia.

### 1. Foto do idealizador (mobile + desktop) — IMG-0043-4 e IMG-0046-2

**Problema atual:** a foto está cortando só o ombro porque `objectPosition: "30% center"` puxa pra esquerda da imagem e não centraliza o homem. Coluna de 48% no mobile também tá estreita demais.

**Ajustes em `src/routes/index.tsx` — `HeroIntro` (linhas 457-525):**
- **Subir a seção pra colar na VSL:** trocar `pt-16 pb-12` por `pt-4 pb-8` e remover o `<ArrowDivider />` interno (linha 458) — a foto fica logo abaixo do "DESLIZE PARA BAIXO" da VSL, igual à IMG-0046-2.
- **Foto no enquadramento certo:** trocar `objectPosition: "30% center"` por `objectPosition: "center 30%"` (mostra o rosto + corpo + mãos cruzadas, não corta no ombro).
- **Largura da coluna da foto:** mobile vai de `w-[48%]` → `w-[55%]`, desktop mantém `md:w-[60%]`. Texto vira `grid-cols-[0.95fr_1.05fr] md:grid-cols-2`.
- **Vinheta:** acompanha — `w-[50%] md:w-[55%]` (deixa mais foto visível à direita).
- **Botão "Iniciar avaliação" menor:** trocar `size="lg"` → `size="md"` (botão padrão, não esticado, libera espaço pra foto).

### 2. Reveal lateral alternado em `ImpactSection` ("Essa foi feita pra você que…")

**Comportamento:** ao rolar pra baixo, cada card entra de um lado alternado (1º esquerda, 2º direita, 3º esquerda, 4º direita); ao rolar pra cima e sair da viewport, somem (efeito reverso).

**Ajustes em `src/routes/index.tsx` — `ImpactSection` (linhas 794-808):**
- Substituir `<Reveal key={i} delay={i * 0.08}>` por um `<motion.div>` direto com:
  - `initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}`
  - `whileInView={{ opacity: 1, x: 0 }}`
  - `exit={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}` 
  - `viewport={{ amount: 0.3 }}` (sem `once: true`, pra reaparecer/sumir nos dois sentidos)
  - `transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}`

### 3. Reduzir espaço vazio entre seções

**Ajustes em `src/routes/index.tsx`:**
- `StepsSection` (linha 550): `py-20` → `py-12`.
- `AudienceSection` (linha 635): `py-20` → `py-12`.
- `FounderSection` (linha 687): `py-20` → `py-12`.
- `ImpactSection` (linha 784): `py-24` → `py-14`.
- `DuranteAnosHeadline` (linha 415): `py-24 md:py-32` → `py-14 md:py-20`.
- `FinalCTA` (linha 838): `py-24` → `py-16`.
- `ArrowDivider` (linha 444): `py-10` → `py-4`.
- `SectionDivider` (linha 753): `py-2` → mantém.

### 4. Cor dos blocos — gradiente preto um pouco mais claro

**Ajuste em `src/styles.css`:**
- `.card-premium` (linhas 337-352): clarear o gradiente, indo de `hsl(0, 0%, 6%) → hsl(0, 0%, 10%) → hsl(0, 0%, 18%)` para `hsl(24, 12%, 10%) → hsl(24, 10%, 14%) → hsl(24, 8%, 22%)` (preto morno, mais claro, com leve tom quente que combina com o laranja).
- `.stack-card-inner` (linha 535): trocar `background-color: hsl(24 18% 8%)` por `background: linear-gradient(140deg, hsl(24, 12%, 11%) 0%, hsl(24, 10%, 16%) 60%, hsl(24, 9%, 22%) 100%)`.

Isso afeta todos os blocos das seções (Steps, Audience, Impact) de uma vez.

### 5. Tipografia/hierarquia em `FounderSection` ("Quem está por trás" + "Muito prazer")

**Ajustes em `src/routes/index.tsx` — `FounderSection` (linhas 694-704):**
- **"Muito prazer," vira destaque (Poppins, não itálico):** trocar a span por:
  ```text
  text-cream-base font-extrabold uppercase tracking-[0.4em] text-xs
  ```
  e mover pra ANTES da manchete (sobe na hierarquia), com uma linha decorativa à esquerda (igual ao "O MOVIMENTO" do hero). Remove `italic` e `font-normal`.
- **Manchete "Os Novos Nordestinos":** mantém o `headline-gradient`, mas reduz pra `text-[clamp(32px,6vw,60px)]` (tava grande demais).
- **Subtítulo (linha 702-704):** trocar `text-sm font-semibold tracking-[0.15em]` por `text-[11px] font-bold tracking-[0.3em]` — vira micro-legenda elegante, não compete com a manchete.
- Toda a seção já usa `font-sans` que é Poppins (default do projeto), só garantindo a remoção do `italic` em "Muito prazer,".

### 6. CTA final em `FinalCTA` — botão menor + redesign igual à IMG-0114

**Imagem de referência:** botão laranja sólido, retangular largo, texto preto bold, seta preta cheia (▶) à direita.

**Ajustes:**

**6a. `src/routes/index.tsx` — `FinalCTA` (linhas 879-891):**
- Trocar `size="xl"` → `size="lg"` no botão "Solicitar minha avaliação estratégica".
- Reduzir o texto: "Solicitar avaliação estratégica" (sem "minha" — fica mais curto e cabe melhor).
- Aumentar gap entre blockquote/botão/parágrafo: `gap-6` → `gap-5` (compacta).
- Centralizar e limitar largura do botão pra não esticar: adicionar `className="max-w-[420px] w-full justify-center"` no `BrutalistButton`.

**6b. `src/styles.css` — `.btn-gold-lg` e `.btn-gold` (linhas ~280-322):**
- Garantir que o botão tenha o look da referência (laranja sólido vibrante, texto preto, seta preta sólida, cantos suavemente arredondados ~12px). Conferir e ajustar `.btn-gold-lg` pra `padding: 18px 36px; font-size: 16px; border-radius: 12px;` se estiver maior.
- O `<span aria-hidden>▶</span>` já vira preto via `.btn-gold > span[aria-hidden] { color: #0A0A0A }` — manter.

### Resultado visual

- **HeroIntro mobile:** texto à esquerda + foto do idealizador à direita com rosto + mãos visíveis, encostada na VSL acima sem espaço vazio. Botão "Iniciar avaliação" compacto, não compete com a foto.
- **Cards das seções:** preto-quente um tom mais claro, mantendo a borda laranja — mais legível e premium.
- **ImpactSection:** cards entram alternados esquerda/direita ao rolar pra baixo e somem ao rolar pra cima.
- **FounderSection:** "MUITO PRAZER," vira pill superior em Poppins extrabold; manchete reduzida; subtítulo virou micro-legenda. Hierarquia clara: kicker → manchete → micro-legenda → corpo.
- **FinalCTA:** botão menor centralizado, hierarquia respira, igual à referência IMG-0114.
- **Espaços entre seções:** ~40% menores, página fica mais densa e ritmada.

### Arquivos alterados

- `src/routes/index.tsx` — `HeroIntro`, `ImpactSection`, `FounderSection`, `FinalCTA`, `DuranteAnosHeadline`, `StepsSection`, `AudienceSection`, `ArrowDivider`.
- `src/styles.css` — `.card-premium`, `.stack-card-inner`, `.btn-gold-lg`.

