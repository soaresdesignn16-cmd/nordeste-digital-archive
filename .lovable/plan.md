

## Marquee infinito + foto do fundador na seção "Muito Prazer"

### 1. Adicionar a foto enviada

- Copiar `user-uploads://IMG-20260422-WA0000.jpg` para `src/assets/founder-portrait.jpg`.
- Importar como `founderPortrait` em `src/routes/index.tsx`.
- Substituir o atual `div.founder-photo-placeholder` (linhas 946-964) por um wrapper real contendo `<img src={founderPortrait} />` com `aspect-ratio: 4/5`, `object-fit: cover`, `border-radius: 12px`, e `box-shadow` sutil.

### 2. Marquee infinito horizontal sobreposto à foto

Estilo "The Branding People" (referência do vídeo): tipografia gigante em outline/sólido cruzando horizontalmente, passando **na frente E atrás** da foto.

**Estrutura visual** (no wrapper da foto):

```text
┌─────────────────────────────────────────┐
│ POSICIONAMENTO • AUTORIDADE • ... ──►   │  ← marquee atrás (z-0, opacity baixa, outline)
│        ┌──────────────┐                 │
│        │              │                 │
│        │    FOTO      │                 │  ← foto (z-10)
│        │              │                 │
│        └──────────────┘                 │
│   ◄── NORDESTE • PREMIUM • LEGADO ...   │  ← marquee na frente (z-20, accent laranja, sólido)
└─────────────────────────────────────────┘
```

- Container `.founder-stage`: `position: relative`, altura ≈ 560px desktop / 480px mobile, overflow visível horizontal mas controlado pelas faixas.
- Foto centralizada com `max-width: 380px`, `z-index: 10`.
- **Faixa 1 (atrás)**: `position: absolute; top: 18%; left: 0; right: 0; z-index: 1;` — texto outline (`-webkit-text-stroke: 1px var(--text-ghost)`, `color: transparent`), tamanho `clamp(72px, 12vw, 140px)`, anima da esquerda → direita.
- **Faixa 2 (frente)**: `position: absolute; bottom: 14%; left: 0; right: 0; z-index: 20;` — texto sólido `var(--accent)` com leve `mix-blend-mode: screen` ou opacity 0.85, tamanho igual, anima direita → esquerda (sentido inverso).

**Conteúdo das faixas** (combinando com o site):

- Faixa 1: `POSICIONAMENTO • AUTORIDADE • LEGADO • PRESENÇA • ESTRATÉGIA • MARCA •`
- Faixa 2: `NORDESTE • PREMIUM • EMPRESÁRIO • TICKET ALTO • RESPEITO • MOVIMENTO •`

Cada faixa duplica a string 2× internamente (`<div class="marquee-track">` com `display: inline-flex` e `width: max-content`) para loop perfeito sem corte.

### 3. CSS (em `src/styles.css`)

```css
.founder-stage { 
  position: relative; 
  margin: 64px auto 0; 
  max-width: 720px; 
  height: 560px;
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.founder-stage__photo {
  position: relative; z-index: 10;
  width: 100%; max-width: 380px;
  aspect-ratio: 4 / 5; object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}
.marquee {
  position: absolute; left: 0; right: 0;
  overflow: hidden; pointer-events: none;
  white-space: nowrap;
}
.marquee--back  { top: 14%;    z-index: 1;  }
.marquee--front { bottom: 10%; z-index: 20; }
.marquee__track { 
  display: inline-flex; width: max-content;
  font-family: var(--font-display);
  font-weight: 800; letter-spacing: -0.02em;
  font-size: clamp(64px, 11vw, 132px);
  line-height: 1;
}
.marquee--back  .marquee__track { 
  -webkit-text-stroke: 1px var(--text-ghost); 
  color: transparent;
  animation: marquee-ltr 38s linear infinite;
}
.marquee--front .marquee__track { 
  color: var(--accent); opacity: 0.92;
  animation: marquee-rtl 28s linear infinite;
}
.marquee__track > span { padding-right: 48px; }

@keyframes marquee-rtl { 
  0% { transform: translateX(0); } 
  100% { transform: translateX(-50%); } 
}
@keyframes marquee-ltr { 
  0% { transform: translateX(-50%); } 
  100% { transform: translateX(0); } 
}

@media (max-width: 640px) {
  .founder-stage { height: 480px; }
  .founder-stage__photo { max-width: 280px; }
}
@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
```

### 4. JSX (substituir o placeholder em `FounderSection`)

```tsx
<Reveal delay={280}>
  <div className="founder-stage">
    <div className="marquee marquee--back" aria-hidden="true">
      <div className="marquee__track">
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <span>POSICIONAMENTO •</span><span>AUTORIDADE •</span>
            <span>LEGADO •</span><span>PRESENÇA •</span>
            <span>ESTRATÉGIA •</span><span>MARCA •</span>
          </React.Fragment>
        ))}
      </div>
    </div>
    <img src={founderPortrait} alt="Fundador — Os Novos Nordestinos" className="founder-stage__photo" />
    <div className="marquee marquee--front" aria-hidden="true">
      <div className="marquee__track">
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <span>NORDESTE •</span><span>PREMIUM •</span>
            <span>EMPRESÁRIO •</span><span>TICKET ALTO •</span>
            <span>RESPEITO •</span><span>MOVIMENTO •</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
</Reveal>
```

### Arquivos editados

- `src/assets/founder-portrait.jpg` — novo (cópia da imagem enviada).
- `src/routes/index.tsx` — novo import + substituição do placeholder pelo `.founder-stage` com 2 marquees + foto.
- `src/styles.css` — classes `.founder-stage`, `.marquee`, `.marquee__track` + keyframes `marquee-ltr` / `marquee-rtl`.

### Paleta (sem mudanças)

- Marquee de fundo: outline em `var(--text-ghost)` (cinza) — ar de profundidade.
- Marquee da frente: `var(--accent)` (laranja já do site) — energia e destaque.
- Foto: sombra escura natural no fundo preto existente.

