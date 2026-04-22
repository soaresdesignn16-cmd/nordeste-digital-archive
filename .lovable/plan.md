

## Trocar fundo da seção "Quem Somos" — 2 imagens diferentes (mobile vs desktop)

A seção `.quem-somos` já existe e tem o layout/texto/cards conforme a referência. Só falta **substituir a imagem de fundo** por **duas imagens distintas**: uma vertical (mobile, escadaria centralizada) e outra horizontal (desktop, escadaria à direita), trocadas via media query.

### 1. Assets — copiar as 2 novas imagens

- `user-uploads://IMG-20260422-WA0012.jpg` → `src/assets/quem-somos-bg-mobile.jpg` (vertical, usada em telas até 767px)
- `user-uploads://IMG-20260422-WA0011_1.jpg` → `src/assets/quem-somos-bg-desktop.jpg` (horizontal, usada em telas ≥768px)
- O asset antigo `src/assets/quem-somos-bg.jpg` será removido do import (substituído pelos dois novos).

### 2. JSX — `src/routes/index.tsx` (linhas 19–22 e 807–814)

- Remover `import quemSomosBg from "@/assets/quem-somos-bg.jpg"`.
- Adicionar:
  ```ts
  import quemSomosBgMobile from "@/assets/quem-somos-bg-mobile.jpg";
  import quemSomosBgDesktop from "@/assets/quem-somos-bg-desktop.jpg";
  ```
- Substituir o style inline da `<section>` por **duas custom properties** (uma para cada breakpoint), em vez de uma só:
  ```tsx
  style={{
    borderTop: "1px solid var(--border-subtle)",
    ["--qs-bg-image-mobile" as string]: `url(${quemSomosBgMobile})`,
    ["--qs-bg-image-desktop" as string]: `url(${quemSomosBgDesktop})`,
  } as React.CSSProperties}
  ```

### 3. CSS — `src/styles.css` (bloco `.quem-somos::before`, linhas 1046–1059 + media query 1162)

Reescrever o `::before` pra usar a variável mobile por padrão, com diferentes posicionamentos pra cada formato:

```css
.quem-somos::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--qs-bg-image-mobile);
  background-position: center center;   /* mobile: imagem vertical centralizada */
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.35;                         /* sutil mas visível */
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

@media (min-width: 768px) {
  .quem-somos::before {
    background-image: var(--qs-bg-image-desktop);
    background-position: right center;   /* desktop: imagem horizontal à direita */
    -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 60%);
            mask-image: linear-gradient(to right, transparent 0%, #000 60%);
  }
  .quem-somos { padding: 96px 48px; }
  .quem-somos__content { margin-inline: auto; }
}
```

**Mudanças-chave:**
- **Mobile (<768px)**: usa a imagem vertical, centralizada, com mask vertical (fade no topo e base) — texto fica legível por cima do fundo escuro.
- **Desktop (≥768px)**: usa a imagem horizontal, posicionada à direita, com mask horizontal (texto à esquerda totalmente preto, imagem aparece à direita) — igual à composição da referência.
- Opacidade subiu de `0.25` → `0.35` pra a foto aparecer um pouco mais sem competir com o texto.

### 4. Sem mudanças

- Texto, blocos editoriais, cards laranja, headline, eyebrow, divider, manifesto cards — **todos preservados intactos**.
- Cor accent `#D4861A`, fonte Poppins, padding, max-width — preservados.
- Resto da página (`HeroSection`, `AudienceSection`, `FounderSection`, `ImpactSection`) — intocados.

### Arquivos editados

- `src/assets/quem-somos-bg-mobile.jpg` — novo (cópia de `IMG-20260422-WA0012.jpg`).
- `src/assets/quem-somos-bg-desktop.jpg` — novo (cópia de `IMG-20260422-WA0011_1.jpg`).
- `src/routes/index.tsx` — trocar imports e style inline da `ManifestoSection`.
- `src/styles.css` — reescrever `.quem-somos::before` e ajustar media query `@media (min-width: 768px)`.

