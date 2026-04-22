

## Polaroid Cards + Scroll Horizontal "pin" na seção "Para Quem É"

Transformar os 4 cards de perfil em **cartões estilo polaroid** espalhados (rotações leves, sombras), e fazer o usuário **rolar a seção horizontalmente enquanto a página fica "presa"** (pin scroll). Ao terminar os 4 cards, o scroll volta ao normal e segue pra próxima seção (FounderSection).

### 1. Layout dos cards — estilo Polaroid espalhado

Cada card de perfil ganha:

- Fundo `var(--bg-card)` com leve borda `var(--border-subtle)`, `border-radius: 14px`.
- `padding: 36px 32px 40px`, `width: 320px`, altura ~360px (proporção retrato tipo polaroid).
- Caixa do ícone no topo (mantém estilo atual com `accent-glow`).
- Título + descrição abaixo (mesma tipografia atual).
- **Rotação aleatória** entre `-4deg` e `+4deg` por card (definida via `--rotation` no inline style, alternando sinal por índice para parecer "jogado na mesa").
- **Sombra dramática**: `box-shadow: 0 18px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3);`
- **Hover**: `transform: scale(1.06) rotate(0deg)`, `z-index: 10`, sombra mais forte, transição `0.4s cubic-bezier(0.16,1,0.3,1)`.

### 2. Posicionamento "imitando o vídeo" (alternado em cima/baixo)

Os 4 cards ficam dispostos em **uma faixa horizontal larga** (≈ 1800px), com offsets verticais alternados:

```text
┌───────────────────────────────────────────────────────────────┐
│  [Card 1]              [Card 3]                                │   ← topo  (margin-top: 0)
│         tilt -3°              tilt -2°                         │
│                                                                │
│              [Card 2]              [Card 4]                    │   ← base  (margin-top: ~140px)
│              tilt +4°              tilt +3°                    │
└───────────────────────────────────────────────────────────────┘
```

- Card 1: top-left,  rotate `-3deg`
- Card 2: bottom-left (deslocado),  rotate `+4deg`
- Card 3: top-right (deslocado),  rotate `-2deg`
- Card 4: bottom-right,  rotate `+3deg`

Container interno `.polaroid-track` com `display: flex; gap: 80px; padding: 60px 8vw;` — cada card recebe `margin-top` alternado (0 ou 140px) para criar o efeito zig-zag vertical.

### 3. Scroll horizontal "pin" (página presa enquanto rola horizontalmente)

Implementação **CSS-only via `position: sticky`** (sem libs, performático, sem GSAP):

- Wrapper externo `.audience-pin` com **altura grande** (`height: 320vh`) — esse é o "trilho" que o usuário rola verticalmente.
- Dentro, `.audience-pin__sticky` com `position: sticky; top: 0; height: 100vh; overflow: hidden;`.
- Dentro do sticky, `.polaroid-track` com `display: flex` recebe `transform: translateX(...)` calculado via JS conforme o progresso do scroll dentro do wrapper.

**Lógica JS** (hook leve no componente, ~20 linhas):

```ts
useEffect(() => {
  const wrapper = wrapperRef.current;
  const track = trackRef.current;
  if (!wrapper || !track) return;
  const onScroll = () => {
    const rect = wrapper.getBoundingClientRect();
    const total = wrapper.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / total));
    const maxX = track.scrollWidth - window.innerWidth;
    track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

- Quando o usuário começa a rolar e o sticky encosta no topo da viewport, a página **para verticalmente** (parece travada) e os cards desfilam horizontalmente.
- Quando `progress === 1`, o sticky se solta e a próxima seção (`FounderSection`) entra normalmente — exatamente o pedido "depois que acabar, a scroll volta ao normal".

### 4. Fallback mobile (≤ 768px)

Em telas estreitas o pin horizontal fica desconfortável. No mobile:

- Desativa o pin: wrapper vira `height: auto`, sticky vira `position: static`.
- Cards viram **scroll horizontal nativo** (`overflow-x: auto; scroll-snap-type: x mandatory;`) — o usuário arrasta com o dedo. Mantém as rotações polaroid.
- Eyebrow + título + parágrafo continuam aparecendo antes da faixa de cards.

### 5. Acessibilidade & performance

- `prefers-reduced-motion`: desativa pin e zig-zag, cards viram grid simples sem rotação.
- Listener de scroll throttled via `requestAnimationFrame`.
- `will-change: transform` no `.polaroid-track` apenas enquanto o sticky está ativo.
- Cards mantêm `<RevealWords>` interno desativado dentro do pin (texto já visível ao entrar) — usa `<p>` simples no card pra não conflitar com o scroll horizontal.

### 6. Cabeçalho da seção (eyebrow + título + parágrafo)

Permanece **antes** do trilho horizontal, dentro do mesmo sticky no topo (modo "header fixo durante o pin") — assim quando o usuário começa o scroll horizontal, o título "Esse movimento é para você se…" continua visível acima dos cards desfilando, igual ao vídeo de referência.

```text
┌──────────────────────────────────────┐  ← sticky top: 0
│   PARA QUEM É                        │
│   Esse movimento é para você se…     │
│   Você se encaixa em um desses…      │
│                                      │
│   [polaroid-track desliza →]         │
└──────────────────────────────────────┘
```

### Arquivos editados

- `src/routes/index.tsx` — refatorar `AudienceSection`: novo wrapper `.audience-pin` + sticky + track com refs, hook de scroll, cards individuais com `--rotation` inline e classe `.polaroid-card`.
- `src/styles.css` — adicionar `.audience-pin`, `.audience-pin__sticky`, `.polaroid-track`, `.polaroid-card` (com hover/rotation/shadow), media query mobile (fallback para scroll-snap nativo), bloco `prefers-reduced-motion`.

### Sem mudanças

- Paleta, tipografia, ícones, textos dos perfis — todos preservados.
- Demais seções intocadas; o "pin" termina exatamente antes da `FounderSection`.

