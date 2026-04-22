

## Substituir polaroid horizontal por **fan-out de cards (efeito leque) controlado por scroll**

Trocar o efeito atual da seção "Esse movimento é para você se…" por uma **pilha de cards** (4 cards empilhados no centro) que **abre como um leque enquanto o usuário rola a página**. Quando o leque está totalmente aberto, o card principal (no topo) **desliza para a esquerda**, revelando os outros 3 cards atrás, em forma de leque inclinado. Tudo dirigido pelo scroll, sem mouse, sem `setTimeout`.

### 1. Estrutura JSX (nova `AudienceSection`)

Manter o wrapper `.audience-pin` (sticky com altura grande pro scroll dirigir a animação), mas o conteúdo interno vira uma **pilha de 4 cards**:

```text
┌──────────────────────────────────┐  sticky top: 0, height: 100vh
│   PARA QUEM É                    │
│   Esse movimento é para você se… │
│                                  │
│        ┌─────────┐               │
│        │ Card 4  │  ← principal (topo, na frente)
│        │ Card 3  │               │
│        │ Card 2  │               │
│        │ Card 1  │  ← fundo da pilha
│        └─────────┘               │
└──────────────────────────────────┘
```

- 4 cards de perfil com mesma cor/estilo dos atuais (preserva a paleta — **fundo `var(--bg-card)`, borda sutil, ícone laranja, título branco, descrição cinza** — como pedido: "deixa o card nas cores e formato que estão").
- Os 3 cards de trás recebem classe `.fan-card` (vão abrir em leque).
- O card da frente recebe classe `.fan-card fan-card--lead` (vai deslizar pra esquerda).

### 2. Animação dirigida 100% pelo scroll (sem `setTimeout`)

O hook atual já calcula `progress` (0 → 1) conforme o usuário rola dentro do wrapper sticky. Vou aproveitar isso e dividir o progresso em **2 fases**:

| Fase | Range de progress | O que acontece |
|------|-------------------|----------------|
| **Fase A — Leque abre** | 0 → 0.55 | Os 3 cards de trás giram do `0deg` até seus ângulos finais (`-18deg`, `-12deg`, `-6deg`), cada um com leve translação X negativa pra abrir o leque. O card principal fica reto no topo. |
| **Fase B — Card principal desliza** | 0.55 → 1 | O card principal translada de `0` até `translateX(-130%) rotate(-3deg)`, revelando os 3 cards do leque já abertos atrás. |

Implementação no `useEffect`: em vez de aplicar `translateX` no track, calcula `progress` e aplica via CSS custom properties no container `.fan-stack`:

```ts
const fanProgress = Math.min(1, progress / 0.55);        // 0 → 1 na fase A
const slideProgress = Math.max(0, (progress - 0.55) / 0.45); // 0 → 1 na fase B
stack.style.setProperty("--fan", String(fanProgress));
stack.style.setProperty("--slide", String(slideProgress));
```

E no CSS, cada card lê essas variáveis:

```css
.fan-card { transform-origin: bottom left; transition: none; }
.fan-card--bg-1 { transform: rotate(calc(var(--fan) * -18deg)); }
.fan-card--bg-2 { transform: rotate(calc(var(--fan) * -12deg)); }
.fan-card--bg-3 { transform: rotate(calc(var(--fan) * -6deg)); }
.fan-card--lead {
  transform: translateX(calc(var(--slide) * -130%)) rotate(calc(var(--slide) * -3deg));
  opacity: calc(1 - var(--slide) * 0.15);
}
```

Resultado: o usuário **rola uma vez** e vê o leque abrir + o card principal sair da frente, exatamente como pedido ("ao rolar scroll faz com que os cards do conteiner saia e fique tudo reto"). Quando `progress === 1`, o sticky se solta e a próxima seção (`FounderSection`) entra normalmente.

### 3. CSS — substituir bloco `.polaroid-*` por `.fan-stack` / `.fan-card`

Em `src/styles.css` (linhas 619–745), apagar todo o bloco `.audience-pin / .polaroid-*` antigo e adicionar:

```css
.audience-pin { position: relative; height: 260vh; }     /* trilho vertical */
.audience-pin__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden;
  display: flex; flex-direction: column; }
.audience-pin__header { padding: 80px 24px 24px; flex-shrink: 0; }

.fan-stack {
  position: relative;
  width: 360px; height: 440px;
  margin: 24px auto 0;
  --fan: 0; --slide: 0;
}
.fan-card {
  position: absolute; inset: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  padding: 32px 28px;
  box-shadow: 0 22px 50px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.35);
  transform-origin: bottom left;
  display: flex; flex-direction: column; gap: 16px;
}
.fan-card--bg-1 { z-index: 1; transform: rotate(calc(var(--fan) * -18deg)); }
.fan-card--bg-2 { z-index: 2; transform: rotate(calc(var(--fan) * -12deg)); }
.fan-card--bg-3 { z-index: 3; transform: rotate(calc(var(--fan) *  -6deg)); }
.fan-card--lead {
  z-index: 4;
  transform: translateX(calc(var(--slide) * -130%)) rotate(calc(var(--slide) * -3deg));
  opacity: calc(1 - var(--slide) * 0.15);
}
.fan-card .icon-box { width: 48px; height: 48px; border-radius: 12px;
  background: rgba(var(--accent-rgb)/0.1); display: grid; place-items: center;
  color: var(--accent); }
.fan-card h3 { font-family: var(--font); font-weight: 700; font-size: 20px;
  line-height: 1.25; color: var(--text-primary); }
.fan-card p { font-family: var(--font); font-size: 14px; line-height: 1.5;
  color: var(--text-secondary); }
```

**Mobile (≤ 768px)** — pin fica desconfortável em tela pequena: vira lista vertical empilhada simples, sem leque, sem sticky:
```css
@media (max-width: 768px) {
  .audience-pin { height: auto; }
  .audience-pin__sticky { position: static; height: auto; overflow: visible; }
  .fan-stack { width: 100%; max-width: 360px; height: auto; display: flex;
    flex-direction: column; gap: 20px; margin-top: 32px; }
  .fan-card { position: relative; inset: auto; transform: none !important;
    opacity: 1 !important; }
}
```

**`prefers-reduced-motion`** — desliga sticky e leque, vira grid 2×2 estático.

### 4. Hook do `useEffect` — atualizar lógica

Substituir o cálculo `track.style.transform = translate3d(...)` por:

```ts
const stack = stackRef.current;          // novo ref pro .fan-stack
const fanProgress = Math.min(1, progress / 0.55);
const slideProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));
stack.style.setProperty("--fan", fanProgress.toFixed(3));
stack.style.setProperty("--slide", slideProgress.toFixed(3));
```

Mantém `requestAnimationFrame` throttling, listener `scroll` + `resize`, early-return em mobile e reduced-motion.

### 5. Sem mudanças

- Paleta, ícones, textos dos 4 perfis — preservados.
- Header da seção (eyebrow + título + parágrafo) — continua sticky no topo durante a animação.
- `FounderSection` e demais seções — intocadas; o pin termina exatamente antes dela.

### Arquivos editados

- `src/routes/index.tsx` — refatorar `AudienceSection`: novo `stackRef`, nova lógica de `progress` em 2 fases, JSX com `.fan-stack` + 4 `.fan-card` (3 de fundo + 1 lead).
- `src/styles.css` — remover bloco `.polaroid-*`; adicionar `.fan-stack`, `.fan-card`, variantes `--bg-1/2/3`, `--lead`, media queries mobile e reduced-motion.

