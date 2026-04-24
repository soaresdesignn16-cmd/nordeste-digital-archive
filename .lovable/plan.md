

## Problema

Na seção **"Para Quem É"**, no mobile, só aparece **1 card** ("Donos de negócios do mundo físico") e parece que ao deslizar (swipe lateral) nada acontece. Os outros 3 perfis (Empresários em escala, Profissionais liberais, Especialistas e autoridades) ficam invisíveis.

### Por que acontece

A seção foi construída como um **stack animado por scroll vertical**: os 4 cards estão sobrepostos (`position: absolute; inset: 0`) e a animação só dispara conforme o usuário **rola a página verticalmente** dentro de uma área "pinada" de 280vh de altura. Isso causa dois problemas no mobile:

1. **Expectativa quebrada**: o usuário tenta deslizar para o lado (gesto natural mobile para "ver mais cards") e nada acontece — o efeito só responde ao scroll vertical.
2. **Sensação de travamento**: a área pinada de 280vh segura a tela e a animação fan-out é sutil em telas pequenas, dando impressão de bug.

## Solução

**Substituir o comportamento no mobile (≤ 767px) por um carrossel horizontal nativo com snap-scroll**, mantendo os 4 cards visíveis e deslizáveis. No desktop/tablet, **manter a animação fan-out** que já funciona bem.

### Mudanças

**1. `src/routes/index.tsx` — `AudienceSection`**
- Detectar mobile (`max-width: 767px`) e renderizar em paralelo:
  - **Desktop/tablet**: estrutura atual (`.fan-stack` com cards absolutos + scroll pin).
  - **Mobile**: novo container `.audience-carousel` com os **4 cards** lado a lado, usando scroll horizontal nativo + `scroll-snap`.
- No mobile, **desativar o pin** (`audience-pin` vira altura automática) e o `useEffect` do scroll-driven animation faz early-return.

**2. `src/styles.css` — bloco `@media (max-width: 767px)` da audience**
- `.audience-pin { height: auto; }` e `.audience-pin__sticky { position: static; height: auto; overflow: visible; }`
- Esconder `.fan-stack-wrap` no mobile.
- Novo `.audience-carousel`:
  - `display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;`
  - `scroll-padding: 24px; padding: 8px 24px 32px;`
  - `-webkit-overflow-scrolling: touch;`
  - Esconder scrollbar (`::-webkit-scrollbar { display: none }`).
- `.audience-carousel__card`:
  - `flex: 0 0 82%; max-width: 320px; scroll-snap-align: center;`
  - Mesmo visual do `.fan-card` (borda laranja, padding, ícone, tipografia) para manter consistência visual com o screenshot.
- **Indicador de swipe**: pequena linha de texto abaixo do carrossel ("← deslize para ver mais →") com `font-size: 11px; color: var(--onn-dim); letter-spacing: 0.18em; text-align: center;`. Some após o usuário rolar.

**3. Ajuste no `useEffect`**
- Logo no início, adicionar:
  ```ts
  const isMobileCarousel = window.matchMedia("(max-width: 767px)").matches;
  if (isMobileCarousel) return;
  ```
- Assim, no mobile o JS de scroll-pin nem roda — performance melhor e zero conflito com o carrossel.

### Resultado esperado

- **Mobile**: usuário vê o primeiro card e desliza horizontalmente para ver os outros 3 — gesto natural, com snap em cada card.
- **Tablet/Desktop**: comportamento atual (fan-out animado por scroll) intacto.
- Nenhum texto, ícone ou cor é alterado.

### Arquivos editados

- `src/routes/index.tsx` (componente `AudienceSection`)
- `src/styles.css` (bloco mobile da audience + novas classes do carrossel)

