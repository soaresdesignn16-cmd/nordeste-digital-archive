

## Reativar máscaras e glow da foto do hero

Substituir o bloco CSS `.hero-photo-wrap` + helpers desativados em `src/styles.css` (linhas 491–513) pelo CSS fornecido (com `object-position: center top`, filtro de cor, máscaras de fade esquerda/inferior e glow laranja radial), e adicionar três `<div>` filhos (`hero-photo-glow`, `hero-photo-mask-left`, `hero-photo-mask-bottom`) ao redor da `<img>` em `src/routes/index.tsx` (linhas 778–785).

### Mudanças

**`src/styles.css` (linhas 491–513)** — substituir bloco inteiro por:
- `.hero-photo-wrap` mantém posição/overflow/background.
- `.hero-photo-wrap img` ganha `object-position: center top` e `filter: brightness(1) contrast(1.05) saturate(1.1)`.
- `.hero-photo-mask-left` — gradient horizontal preto→transparente (z-index 2) que funde a borda esquerda da foto com o fundo escuro do texto ao lado.
- `.hero-photo-mask-bottom` — gradient vertical na base (35% de altura, z-index 2) que escurece o pé da foto.
- `.hero-photo-glow` — `radial-gradient` âmbar atrás da foto (z-index 1) posicionado em 70% 40%, simulando luz quente lateral.

**`src/routes/index.tsx` (linhas 778–785)** — manter o wrapper e o bloco "ONN / 2K26" como estão; inserir três divs decorativos:
- `<div className="hero-photo-glow" aria-hidden="true" />` antes da `<img>` (fica atrás).
- `<div className="hero-photo-mask-left" aria-hidden="true" />` depois da `<img>`.
- `<div className="hero-photo-mask-bottom" aria-hidden="true" />` em seguida.

Resultado: empilhamento `glow (z1) → img → mask-left (z2) → mask-bottom (z2) → ONN/2K26 (z10)`.

### O que NÃO muda

- `style={{ minHeight: "55vw", maxHeight: "100vh" }}` no wrapper — preservado.
- `<img src={founderHeroGlow} ...>` com `loading="eager"` e `decoding="async"` — preservado.
- Bloco "ONN / 2K26" no canto superior direito — preservado integralmente (mantém os `style` inline atuais; o snippet do usuário simplificou, mas vamos manter os inline styles existentes para não perder tipografia/cor).
- Resto do `HeroIntro`, do `styles.css` e demais seções — intactos.

### Arquivos editados

- `src/styles.css` — substituir linhas 491–513 (bloco `.hero-photo-wrap` + 3 helpers `display:none`) pelo novo CSS com máscaras e glow ativos.
- `src/routes/index.tsx` — adicionar 3 divs decorativos dentro de `.hero-photo-wrap` (linhas 778–785), preservando o `<img>` e o bloco "ONN / 2K26" com seus estilos inline atuais.

