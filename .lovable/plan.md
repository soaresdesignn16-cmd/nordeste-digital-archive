

## Plano — Ajustes finos do site

### 1. Loader "ONN 100%" mais cinematográfico (~3.5s)
- Em `src/routes/index.tsx`, no `useEffect` do loader, mudar o ritmo de incremento: hoje `progress += 8` a cada `40ms` (≈0.5s total). Vou para `progress += 1` a cada `35ms` (≈3.5s) com easing visual (incremento ligeiramente acelerado no fim para sensação cinematográfica).
- Ajustar a barra para uma transição mais suave (`transition-[width] duration-200` em vez de `duration-75`).
- Resultado: o "ONN" gigante preenche de preto para o degradê laranja em ~3.5s, criando momento dramático antes do conteúdo aparecer.

### 2. Restaurar a manchete "DURANTE ANOS TENTARAM CONTAR A NOSSA HISTÓRIA"
- Adicionar uma nova seção estática (sem scroll horizontal, sem colagem de fotos, sem efeitos pesados) **antes** da `FinalCTA`.
- Tipografia: Poppins Black, caixa alta, gradiente pergaminho→brasa (`headline-gradient`), `text-[clamp(34px,7vw,68px)]`, com leve fade-in via `Reveal`.
- Layout limpo: centralizado, fundo do `PremiumBackground` (já existente). Sem fotos de fundo.
- Pequeno subtítulo opcional embaixo: "Agora é a nossa vez."

### 3. Botões iguais à imagem de referência (laranja sólido + seta ▶)
- Atualizar `.btn-gold` em `src/styles.css`:
  - Trocar `background: linear-gradient(135deg, #C97326, #E08C32)` por **degradê laranja vivo mais uniforme** (`linear-gradient(180deg, #F39238, #D97324)`) que reproduz o look "laranja chapado" da foto.
  - Aumentar `border-radius` para `12px` (cantos mais arredondados como no botão da foto).
  - Texto preto puro, Poppins Black, caixa alta, tracking apertado.
  - Sombra mais difusa por baixo (`box-shadow: 0 12px 30px -8px rgba(217, 115, 36, 0.55)`).
  - Remover o efeito "shine" que cruza o botão (mantém o look chapado).
- Trocar a seta `→` / `<ArrowRight>` por um símbolo `▶` (triangular preto) nos 3 CTAs (`Quero ser selecionado ▶`, `Quero entrar para o movimento ▶`, `Solicitar minha avaliação estratégica ▶`), igual à referência.

### 4. Reescrever o `FounderSection` (Muito prazer / Os Novos Nordestinos)
- Inverter a ordem do título:
  - **Linha 1 (em cima, grande):** `OS NOVOS NORDESTINOS` — Poppins Black 900, caixa alta, cor **brasa** (`#E08C32`) com leve glow dourado, tipografia oficial do site.
  - **Linha 2 (embaixo, menor):** `Muito prazer,` — Poppins Regular itálico em Caladea, cor pergaminho off-white (`#F2F0E6`), sem caixa alta, tom de assinatura editorial.
- Hierarquia: o nome do movimento vira a estrela visual, "Muito prazer" vira a assinatura abaixo.

### 5. Performance geral (carregamento mais leve)
- Adicionar `loading="lazy"` e `decoding="async"` em todos `<img>` que não são críticos (logo do footer, logo do FounderSection, etc.). O logo do hero permanece com `fetchpriority="high"` (já está no `head()`).
- Adicionar `will-change: transform` apenas onde necessário (já tem em `.tilt-card` e `.will-parallax`) — remover de elementos que não animam.
- Em `ParallaxLayer`, reduzir `stiffness` do spring (80 → 60) e aumentar `damping` (25 → 28) para reduzir trabalho de scroll, e desativar parallax quando `prefers-reduced-motion` (verificação leve via `useEffect`).
- Garantir que o iframe da Vimeo só carrega após clique (já está garantido pelo `VSLPlayer`, sem mudança).
- Resultado: scroll mais suave em mobile, menos jank, render inicial mais leve.

### Resumo das alterações por arquivo
- `src/routes/index.tsx`:
  - Loader (mudança do ritmo de progresso).
  - Nova seção `<DuranteAnosHeadline />` antes do `FinalCTA`.
  - Reescrita do título do `FounderSection`.
  - Trocar `<ArrowRight>` por símbolo `▶` nos botões.
  - Adicionar `loading="lazy"` em imagens não-críticas.
  - Ajuste fino do `ParallaxLayer` (spring) e respeito a `prefers-reduced-motion`.
- `src/styles.css`:
  - Reescrever `.btn-gold` (degradê chapado, mais arredondado, sem shine, sombra difusa).
  - Pequeno tweak de `transition` no loader.

### Resultado final
- Loader cinematográfico de ~3.5s com o "ONN" preenchendo lentamente.
- Manchete "DURANTE ANOS TENTARAM CONTAR A NOSSA HISTÓRIA" de volta, limpa, sem efeitos pesados.
- Botões idênticos à referência: laranja sólido, cantos arredondados, seta ▶ preta, texto Poppins Black.
- Seção "Os Novos Nordestinos" com hierarquia invertida e cor brasa premium.
- Site mais leve e fluido em mobile.

