

## Plano — Foto do idealizador "saindo de dentro da página" (sem card flutuante)

Remover totalmente o aspecto de "card" da seção e integrar a foto ao fundo da página, com o texto convivendo no mesmo plano — exatamente como nas duas referências (O Grande Salto / Posturologia).

### O que muda visualmente

```text
ANTES (card flutuante):                  DEPOIS (integrado ao fundo):
┌─────────────────────────┐
│▓ foto + gradiente ▓▓▓▓▓│              [ O MOVIMENTO ]
│▓                       ▓│              Chegou a hora do Brasil conhecer
│▓     [pill]            ▓│                                    ╱▔▔▔▔▔╲
│▓     OS NOVOS          ▓│              OS NOVOS             │ rosto │
│▓     NORDESTINOS       ▓│              NORDESTINOS          │idealiz│
│▓     descrição         ▓│              descrição…             ╲___╱  (sem borda,
└─────────────────────────┘              (texto à esquerda)            funde no preto)
   ↑ borda + shadow + bg                 ↑ sem card, sem borda, sem shadow
```

### 1. Remover o "card" em volta da foto (`src/routes/index.tsx`, linhas 459–515)

- Remover o `<TiltCard tilt spotlight>` que envolve a foto.
- Remover `border`, `rounded-[24px]`, `shadow-[…]`, `min-h-[…]` do container.
- Substituir por um `<div className="relative">` simples (sem moldura).

### 2. Foto fundida ao fundo

- A imagem deixa de ser `object-cover` esticada num retângulo.
- Vira uma figura recortada à direita (desktop) / topo (mobile), com `object-contain` e máscara CSS pra fundir as bordas no preto:
  ```tsx
  <img
    src={founderHero}
    className="
      absolute pointer-events-none select-none
      /* desktop: à direita, ocupa 55% da largura */
      md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-[55%] md:h-[120%] md:object-contain md:object-right
      /* mobile: topo, centralizada */
      right-1/2 translate-x-1/2 top-0 w-[110%] h-[60%] object-contain object-top
      [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]
      [-webkit-mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]
    "
  />
  ```
- Máscara radial faz o cabelo/ombros desaparecerem suavemente no fundo preto da página — efeito "saindo de dentro da página".
- Sem `object-cover` e sem container fechado, a foto não parece mais "recortada num card".

### 3. Layout do texto ao lado da foto (igual às referências)

- **Desktop (≥768px)**: grid 2 colunas — texto à esquerda (col 1, `text-left`), foto à direita (col 2). Texto alinhado à esquerda, manchete `OS NOVOS / NORDESTINOS` continua bicolor (cream + brasa) em Poppins Black.
- **Mobile**: stack vertical — foto no topo (50–60vh, fundindo no preto embaixo via máscara), texto centralizado abaixo.
- Container externo: `max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 relative` — sem borda, sem fundo, sem shadow.

### 4. Profundidade real (sem virar card de novo)

- Glow laranja sutil atrás da foto: `<div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/10 blur-[120px] rounded-full" />` — dá luz cinematográfica vinda de trás do retrato, igual ao verde da ref 1.
- Manter `ParallaxLayer` no wrapper externo (já existente em `index.tsx` linha 345).
- Drop shadow no texto da manchete continua, mas o container não tem shadow — só a foto "respira" no fundo.
- "OWN" já embutido na foto continua aparecendo naturalmente atrás do rosto (sem CSS extra).

### 5. Card "clientes melhores"

- Permanece como está (já está fora do bloco visual desde o último ajuste), apenas mantido com `mt-12`.

### Resultado

A foto do idealizador deixa de parecer um "banner retangular dentro da página" e passa a parecer parte da página — como se ele estivesse saindo do fundo preto. O texto convive ao lado (desktop) ou abaixo (mobile), no mesmo plano, sem moldura. Estética idêntica às referências enviadas, mantendo a identidade premium da LP (cream + brasa + Poppins Black).

### Arquivo alterado

- `src/routes/index.tsx` — reescrita do componente `HeroIntro` (linhas 455–534).

