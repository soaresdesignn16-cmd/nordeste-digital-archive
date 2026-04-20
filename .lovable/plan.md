

## Plano — Redesign da seção "Chegou a hora do Brasil conhecer Os Novos Nordestinos"

A foto enviada (1366×768, retrato do idealizador com "OWN" já embutido como marca d'água na própria imagem) será usada como fundo principal da seção. Como o "OWN" já está na foto, **não vou adicionar texto de marca d'água via CSS** — apenas reforçar a profundidade com gradiente preto.

### 1. Adicionar a foto como asset
- Copiar `user-uploads://IMG-20260420-WA0105-2.jpg` para `src/assets/founder-hero.jpg`.
- Importar no topo de `src/routes/index.tsx`: `import founderHero from "@/assets/founder-hero.jpg"`.

### 2. Reescrever o componente `HeroIntro` (linhas 458–491 de `src/routes/index.tsx`)

**Camadas (de trás pra frente):**

```text
┌─────────────────────────────────────────────┐
│ Foto do idealizador (já tem "OWN" embutido) │ camada 1
│ ▓ Gradiente preto vertical top→bottom ▓▓▓▓ │ camada 2 (profundidade)
│                                             │
│              [ O MOVIMENTO ]                │ camada 3 (conteúdo)
│  Chegou a hora do Brasil conhecer           │  cream
│        Os Novos Nordestinos                 │  brasa
│  Empresários e profissionais que…           │  cream-muted
└─────────────────────────────────────────────┘
```

**Especificações:**
- **Container**: `relative overflow-hidden rounded-[24px] max-w-[1100px] mx-auto border border-primary-custom/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]`.
- **Altura**: `min-h-[520px] sm:min-h-[600px] md:min-h-[680px]` — espaço suficiente pro retrato + texto sem cortar nada no mobile (515px de largura).
- **Foto (camada 1)**: `<img src={founderHero} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover object-[center_30%]">`. No mobile, o `object-position: center 30%` mantém o rosto visível.
- **Gradiente (camada 2)**: `absolute inset-0 bg-gradient-to-b from-black/15 via-black/50 to-black` — leve no topo (mostra o ambiente e o "OWN" da foto), forte embaixo (funde no fundo preto e dá legibilidade pro texto).
- **Vinheta lateral sutil opcional**: `absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]` — dá foco no rosto, profundidade extra.
- **Conteúdo (camada 3)**: `absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10 md:pb-14 text-center`.
  - `SectionPill` "O MOVIMENTO" centralizado, `mb-5`.
  - Headline `<h1>` Poppins Black `text-[clamp(26px,4.8vw,52px)] leading-[1.1]`:
    - Linha 1: "Chegou a hora do Brasil conhecer" — `text-cream-base`.
    - Linha 2: "Os Novos Nordestinos" — `text-primary-custom drop-shadow-[0_2px_20px_rgba(224,140,50,0.5)]`.
  - Parágrafo: `text-cream-muted text-[clamp(14px,2.2vw,18px)] leading-relaxed max-w-[680px] mx-auto mt-5` mantendo `<strong>vistos, valorizados e respeitados</strong>`.
- **Card "clientes melhores"** (`TiltCard` que hoje está dentro do `HeroIntro`): mover pra fora, abaixo do card visual com `mt-10`. Continua sendo um remate forte sem poluir a foto.

### 3. Profundidade real (mobile + desktop)
- Envolver o card com `TiltCard tilt spotlight` (já existente) — leve resposta 3D no desktop, neutro no mobile.
- Manter o `ParallaxLayer offset={40}` no wrapper externo — sensação de "subir flutuando" ao rolar.
- Drop shadow grande no container faz o card descolar do fundo escuro do site.
- No mobile (515px), o gradiente vertical garante legibilidade do texto sem blur (zero custo de performance).

### 4. Performance
- Foto importada como ES module (`@/assets/...`) → Vite hash + otimização automática.
- `loading="eager" decoding="async"` (primeira dobra após VSL).
- Zero texto de marca d'água via CSS (já está na foto) — economia de render.

### Resumo das alterações
- **`src/assets/founder-hero.jpg`** (novo) — foto enviada (idealizador com "OWN" já embutido).
- **`src/routes/index.tsx`** — import no topo + reescrita do componente `HeroIntro` (linhas 458–491). Card "clientes melhores" movido pra fora do card visual.

### Resultado final
Seção com retrato do idealizador como fundo cinematográfico (com o "OWN" da própria foto aparecendo atrás), gradiente preto fundindo a foto no fundo do site, pill laranja, headline bicolor (cream + brasa) e descrição clara — profundidade real e idêntica em mobile (515px) e desktop, dentro da estética premium editorial da LP.

