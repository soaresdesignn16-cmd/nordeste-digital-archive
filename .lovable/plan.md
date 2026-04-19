

## Plano: Refinamento visual editorial dourado da ONN

Vou aplicar a estética **dark luxury / âmbar editorial** já definida em `src/styles.css` (paleta preto + dourado #C97B2A/#E08C32 + cream #F2F0EB, Poppins 400/600/900, noise overlay, gradiente radial) em **todos os componentes visuais** de `src/routes/index.tsx`, sem tocar em copy, ordem, hierarquia ou estrutura semântica.

### 1. Substituir botões brutalistas por CTA dourado editorial
- Trocar todo o `BrutalistButton` (estilo neo-brutalist com sombra dura deslocada) por um novo **`GoldCTA`** baseado em `.btn-gold` do styles.css:
  - Gradiente `linear-gradient(135deg, #C97B2A, #E08C32)`, texto `#0A0A0A`, Poppins Black
  - `text-transform: uppercase`, letter-spacing 0.08em, padding 18×40, radius 4px
  - Glow base `0 0 32px rgba(201,123,42,0.35)` → hover `0 0 48px rgba(224,140,50,0.6)` + `translateY(-2px)`
  - Microinteração: shimmer dourado sutil no hover (gradient animado opcional)
  - 3 variantes: `md` (CTA navbar), `lg` (CTA seções), `xl` (CTA final hero/footer)

### 2. Hero / VSL Gate (pré-desbloqueio)
- Logo ONN com glow âmbar reforçado
- VSL frame: trocar a borda atual pela classe `.vsl-frame` (borda dourada 2px + box-shadow dourado, radius 8px)
- Botão Play: anel dourado com pulso, ícone Play em preto sobre dourado quente
- Barra de progresso: gradiente C97B2A → E08C32 com shimmer animado
- Hint "Liberando acesso…" com fade dourado

### 3. Loader ONN
- Texto "ONN" com gradiente cream → dourado (`.headline-gradient`)
- Drop-shadow dourado mais quente, barra de progresso com shimmer

### 4. Navbar (Navbar + VslNavbar)
- Backdrop blur + borda inferior dourada 25% opacity
- Tipografia uppercase tracking editorial
- CTA navbar com versão `md` do GoldCTA

### 5. HeroIntro (pós-desbloqueio)
- Aplicar `.headline-gradient` (cream → dourado) no H1 (única exceção da regra)
- Card de quote interno: classe `.card-premium` (rgba branco 3% + borda dourada 20% + blur 4px)
- SectionPill com glow dourado refinado

### 6. StepsSection (4 passos)
- Cards: `.card-premium` com hover lift sutil (translateY -4px + glow dourado intensificado)
- Badge "PASSO N": pílula dourada gradient, font-weight 900, glow
- Numeração tipográfica gigante em outline dourado de fundo (ghost number 01/02/03/04) — profundidade editorial
- Stagger reveal 0.1s entre cards

### 7. AudienceSection (perfis)
- Cards `.card-premium`, ícones em quadrado dourado translúcido com glow
- Linha dourada decorativa horizontal em cada card (microdetalhe editorial)

### 8. FounderSection
- Aplicar `.blockquote-gold` na frase de destaque interna (border-left dourado + bg dourado 6% + itálico)
- Card visual com logo: borda dourada + glow cinematográfico 60px + gradiente radial interno
- Tag "Movimento ONN" com pílula dourada

### 9. ImpactSection
- Bloco de 4 checks: `.icon-gold-glow` nos ícones ✔ (text-shadow dourado quente)
- Cards com hover scale + glow
- Card final com `.blockquote-gold`

### 10. FinalCTA
- Background: gradient radial dourado mais cinematográfico + scanlines sutis
- "N" badge: trocar por LogoIcon com glow dourado 40px
- Frase em itálico com `.blockquote-gold`
- Linha de checks com `.icon-gold-glow`
- CTA principal: GoldCTA tamanho `xl`

### 11. Footer
- Tags "Autoridade / Liberdade / etc": pílulas douradas com glow sutil
- Separador superior dourado 25%
- Logo final com glow contido

### 12. Microinterações globais
- Hover lift padrão em todos cards (`hover:-translate-y-1` + glow expand)
- Reveal com stagger 0.1s
- Mantém o `ParallaxLayer` existente (já dá cinematicidade)
- Adicionar `.animate-section-rise` opcional em pills

### Arquivos afetados
- `src/routes/index.tsx` — refatoração visual completa (sem mudar copy/estrutura)
- `src/styles.css` — adicionar variantes `.btn-gold-lg`, `.btn-gold-xl` e keyframe shimmer no botão; adicionar `.ghost-number` para numeração outline gigante dos passos

### Garantias
- ✅ Copy 100% preservada (nenhum texto alterado)
- ✅ Ordem das seções preservada
- ✅ Hierarquia H1/H2/H3 preservada
- ✅ Componentes/lógica VSL e parallax preservados
- ✅ Apenas paleta, efeitos, botões e microinterações mudam

