

## Ajustar fundo "Quem Somos" no mobile — escada à esquerda, igual à referência

A nova foto enviada (`IMG-20260422-WA0012-2.jpg`) é a versão correta da escadaria pro mobile. Na referência (`IMG-20260422-WA0010-3.jpg`), a **escada e o homem aparecem do lado direito**, com texto/cards à esquerda. Vou substituir o asset mobile e ajustar o `::before` pra reproduzir exatamente essa composição.

### 1. Asset — substituir imagem mobile

- `user-uploads://IMG-20260422-WA0012-2.jpg` → `src/assets/quem-somos-bg-mobile.jpg` (sobrescreve a atual).
- Imagem desktop permanece intacta.

### 2. CSS — `src/styles.css`, bloco `.quem-somos::before` (mobile)

Reescrever os parâmetros pra: escada encostada na borda direita, fade da esquerda pra direita protegendo texto e cards.

```css
.quem-somos::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--qs-bg-image-mobile);
  background-position: right center;     /* escada/homem ancorados à direita */
  background-size: cover;                /* preenche altura sem deixar gap */
  background-repeat: no-repeat;
  opacity: 0.5;                          /* visível mas subordinado ao texto */
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 35%, transparent 95%);
          mask-image: linear-gradient(to right, #000 0%, #000 35%, transparent 95%);
  pointer-events: none;
  z-index: 0;
}
```

**Por que cada parâmetro:**
- `background-position: right center` — encosta a foto na borda direita, mantendo a escadaria e a figura humana visíveis no lado direito da seção (igual referência).
- `background-size: cover` — garante que a foto ocupe toda a altura sem faixas pretas; a parte mais à esquerda da imagem (que é totalmente preta) cobre o lado esquerdo naturalmente.
- `opacity: 0.5` — escada visível mas sem competir com texto branco e cards laranja.
- `mask-image` `to right, #000 0%, #000 35%, transparent 95%` — primeiros 35% da largura à esquerda ficam **100% pretos puros** (sem nenhuma foto por baixo do texto e cards), foto fica clara entre 35% e 95% da largura (ali aparece a escada e o homem), fade suave nos últimos 5%.

### 3. Sem mudanças

- Bloco desktop (`@media min-width: 768px`) — preservado intacto.
- JSX, imports, custom properties, texto, cards, headline, cor accent — todos preservados.
- Asset desktop (`quem-somos-bg-desktop.jpg`) — não tocado.

### Arquivos editados

- `src/assets/quem-somos-bg-mobile.jpg` — sobrescrito com `IMG-20260422-WA0012-2.jpg`.
- `src/styles.css` — ajustar 4 propriedades do `.quem-somos::before` base (mobile): `background-position`, `background-size`, `opacity`, `mask-image`.

