

## Redesign editorial da seção "Quem Somos" — pixel-perfect à referência

Trocar o layout atual da `ManifestoSection` (que hoje é grid 2 colunas com texto à esquerda + 4 cards à direita) por um **layout editorial single-column mobile-first**, com background architectural sutil mascarado à direita, fiel à referência enviada.

Os 4 cards do Manifesto (Diagnóstico, Mapeamento, Arquitetura, Implementação) **permanecem**, mas movem pra **abaixo** do bloco editorial — como uma segunda fileira dentro da mesma seção, separados por respiro vertical. Assim nada se perde.

### 1. Asset — imagem de fundo

- Copiar `user-uploads://image-2.png` para `src/assets/quem-somos-bg.jpg` e importar como módulo ES6 (`import quemSomosBg from "@/assets/quem-somos-bg.jpg"`).
- A imagem já é a foto arquitetônica escura (escadaria + figura solitária) — usar como `background-image` da seção, posicionada `right center`, com gradient mask `linear-gradient(to right, #0a0a0a 40%, transparent 100%)` por cima e `opacity: 0.25`.

### 2. Estrutura JSX — `ManifestoSection` reescrita

Layout mobile-first single column, todos os blocos stack vertical, left-aligned, dentro de um `max-w-[640px]`:

```text
┌─────────────────────────────────────┐
│ ▬ QUEM SOMOS                        │  ← BLOCK 1 (line + label)
│                                     │
│ O NORDESTE                          │  ← BLOCK 2 (italic white 800)
│ SEMPRE                              │      (upright white 900)
│ PRODUZIU.                           │      (upright white 900)
│ AGORA É VISTO.                      │      (orange 900)
│ ─────────────────────               │  ← orange divider
│                                     │
│ ▰ Nascemos com um propósito:        │  ← BLOCK 3 (orange box)
│                                     │
│ Mostrar para o Brasil que           │  ← BLOCK 4 (intro text)
│ o nordeste produz                   │
│                                     │
│ ┌─ Empresários sofisticados ─┐     │  ← BLOCK 5 (3 outlined cards)
│ ┌─ Negócios milionários ─────┐     │
│ ┌─ Marcas no nível das ──────┐     │
│ └─  maiores do país. ────────┘     │
│                                     │
│ Hoje, à frente do movimento,        │  ← BLOCK 6
│ ajudamos                            │
│                                     │
│ ▰ EMPRESÁRIOS NORDESTINOS           │  ← BLOCK 7 (orange box)
│                                     │
│ a implementar uma                   │  ← BLOCK 8 (closing)
│ Arquitetura de Posicionamento       │
│ Digital de ponta a ponta.           │
│ Transformando autoridade em…        │
└─────────────────────────────────────┘
       ↓ (separador, 80px gap)
┌─ 4 cards do Manifesto (preservados, grid 2×2) ─┐
```

### 3. Estilos CSS — novo bloco `.quem-somos-*` em `src/styles.css`

Adicionar antes do bloco `.founder-stage` (em torno da linha 1036). Override local da cor primária pra `#D4861A` (variante exata pedida) sem mexer no design system global:

```css
.quem-somos {
  --qs-accent: #D4861A;
  --qs-bg: #0a0a0a;
  position: relative;
  background: var(--qs-bg);
  padding: 60px 24px;
  overflow: hidden;
}
.quem-somos::before {                /* imagem arquitetural mascarada */
  content: "";
  position: absolute; inset: 0;
  background: url('@/assets/quem-somos-bg.jpg') right center / cover no-repeat;
  opacity: 0.25;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 100%);
  pointer-events: none;
}
.quem-somos__content { position: relative; z-index: 1; max-width: 640px; }

/* BLOCK 1 — eyebrow */
.qs-eyebrow {
  display: flex; align-items: center; gap: 12px;
  font: 500 11px/1 'Poppins'; color: var(--qs-accent);
  letter-spacing: 0.2em; text-transform: uppercase;
  margin-bottom: 28px;
}
.qs-eyebrow::before { content:""; width: 28px; height: 2px; background: var(--qs-accent); }

/* BLOCK 2 — headline */
.qs-headline {
  font-family: 'Poppins'; font-size: clamp(42px, 8vw, 56px);
  line-height: 1.05; color: #fff; margin: 0;
}
.qs-headline .l1 { font-style: italic; font-weight: 800; display: block; }
.qs-headline .l2,
.qs-headline .l3 { font-style: normal; font-weight: 900; display: block; }
.qs-headline .l4 { font-weight: 900; color: var(--qs-accent); display: block; }
.qs-divider { height: 2px; background: var(--qs-accent); border: 0;
  margin: 16px 0 24px; width: 100%; }

/* BLOCK 3 / 7 — orange highlight */
.qs-highlight {
  display: inline-block;
  background: var(--qs-accent); color: var(--qs-bg);
  border-radius: 4px; padding: 10px 14px;
  font: 600 italic 17px/1.2 'Poppins';
  margin-bottom: 12px;
}
.qs-highlight--upper { font-weight: 700; text-transform: uppercase; }

/* BLOCK 4 / 6 / 8 — body paragraphs */
.qs-body { color: #fff; font: 400 16px/1.5 'Poppins'; margin: 0 0 20px; }
.qs-body--close { line-height: 1.7; margin-bottom: 0; }
.qs-body em { font-style: italic; font-weight: 500; }
.qs-body strong { font-weight: 700; }

/* BLOCK 5 — outlined cards */
.qs-cards { display: flex; flex-direction: column; gap: 10px;
  margin: 8px 0 28px; }
.qs-card {
  border: 1.5px solid var(--qs-accent); border-radius: 6px;
  padding: 14px 18px; color: #fff;
  font: 500 15px/1.4 'Poppins'; background: transparent;
}

/* Spacing entre Block 6 → 7 → 8 */
.qs-block-6 { margin-bottom: 8px; }
.qs-spacer-top { margin-top: 28px; }

/* Manifesto cards (preservados) — gap acima */
.quem-somos__manifesto-cards { margin-top: 80px; }

@media (min-width: 768px) {
  .quem-somos { padding: 96px 48px; }
  .quem-somos__content { margin-inline: auto; }
}
```

### 4. JSX — substituir corpo de `ManifestoSection`

Manter o nome `ManifestoSection` e o `id="manifesto"` (links âncora continuam funcionando). Substituir o grid 2 colunas por:

```tsx
<section id="manifesto" className="quem-somos"
  style={{ borderTop: "1px solid var(--border-subtle)" }}>
  <div className="quem-somos__content mx-auto">
    {/* BLOCK 1 */}
    <Reveal><div className="qs-eyebrow">Quem Somos</div></Reveal>

    {/* BLOCK 2 */}
    <Reveal delay={80}>
      <h2 className="qs-headline">
        <span className="l1">O Nordeste</span>
        <span className="l2">Sempre</span>
        <span className="l3">Produziu.</span>
        <span className="l4">Agora é visto.</span>
      </h2>
      <hr className="qs-divider" />
    </Reveal>

    {/* BLOCK 3 */}
    <Reveal delay={140}>
      <div className="qs-highlight">Nascemos com um propósito:</div>
    </Reveal>

    {/* BLOCK 4 */}
    <Reveal delay={180}>
      <p className="qs-body">
        Mostrar para o <em>Brasil</em> que o <strong>nordeste produz</strong>
      </p>
    </Reveal>

    {/* BLOCK 5 */}
    <Reveal delay={220}>
      <div className="qs-cards">
        <div className="qs-card">Empresários sofisticados</div>
        <div className="qs-card">Negócios milionários</div>
        <div className="qs-card">Marcas no nível das maiores do país.</div>
      </div>
    </Reveal>

    {/* BLOCK 6 */}
    <Reveal delay={260}>
      <p className="qs-body qs-block-6">Hoje, à frente do movimento, ajudamos</p>
    </Reveal>

    {/* BLOCK 7 */}
    <Reveal delay={300}>
      <div className="qs-highlight qs-highlight--upper">EMPRESÁRIOS NORDESTINOS</div>
    </Reveal>

    {/* BLOCK 8 */}
    <Reveal delay={340}>
      <p className="qs-body qs-body--close">
        a implementar uma <strong>Arquitetura de Posicionamento Digital</strong> de ponta a ponta.
        <br />
        <em>Transformando autoridade</em> em ticket maior, mais tempo livre e respeito de mercado.
      </p>
    </Reveal>

    {/* 4 cards do Manifesto (preservados) */}
    <div className="quem-somos__manifesto-cards grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
      {cards.map((c, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="card h-full">
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <h4>{c.title}</h4>
            <RevealWords>{c.desc}</RevealWords>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
```

Removemos o `<blockquote className="quote-block">` e o botão "Fazer parte do movimento" do bloco antigo — a referência não pede esses elementos e o CTA já está repetido na `FounderSection` logo abaixo.

### 5. Sem mudanças

- `AudienceSection`, `FounderSection`, `ImpactSection`, `HeroSection` — intocadas.
- Cor accent global do design system (`--accent: #E08C32`) — preservada; o override `#D4861A` é **escopado** apenas dentro de `.quem-somos`.
- Fonte Poppins — já carregada, sem mudança.
- Os 4 cards do Manifesto e seu conteúdo — preservados, só re-posicionados abaixo do bloco editorial.

### Arquivos editados

- `src/assets/quem-somos-bg.jpg` — novo asset (cópia de `user-uploads://image-2.png`).
- `src/routes/index.tsx` — refatorar JSX da `ManifestoSection` (linhas 796–863) para o layout single-column editorial; importar o novo asset.
- `src/styles.css` — adicionar bloco `.quem-somos`, `.qs-eyebrow`, `.qs-headline`, `.qs-divider`, `.qs-highlight`, `.qs-body`, `.qs-card` antes da seção `.founder-stage` (~linha 1036).

