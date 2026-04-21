

## Plano — Foto lado a lado com texto no mobile (igual à referência desktop)

A referência (IMG-0043-3) mostra **texto à esquerda + foto à direita lado a lado**, ambos visíveis na mesma altura. Hoje no mobile (518px) a foto fica empilhada embaixo do texto, criando aquele desencaixe. Vou trazer o layout side-by-side da referência também pro mobile, ajustando só as proporções.

### O que muda em `src/routes/index.tsx` — `HeroIntro` (linhas 454-534)

**1. Layout — virar 2 colunas desde mobile (em vez de 1 coluna empilhada):**

- Linha 484: trocar `grid-cols-1 md:grid-cols-2` por `grid-cols-[1.05fr_0.95fr] md:grid-cols-2` — duas colunas já no mobile, texto ocupando ~52% e foto ~48%.
- Reduzir padding mobile: `p-4 md:p-12` (era `p-6`) pra dar mais respiro pro texto na coluna estreita.
- Reduzir `min-h` mobile: `min-h-[420px] md:min-h-[640px]` (era 560px) — proporção mais próxima da referência (16:9).

**2. Foto — passa a ocupar a coluna direita inteira, não mais sangrar como fundo:**

- Linha 463-469: reescrever as classes do `<img>`:
  - Mobile: `absolute right-0 top-0 h-full w-[48%] object-cover object-left-center opacity-100`  
    (foto cobre a metade direita inteira, do topo ao fundo, com âncora no rosto à esquerda da imagem pra garantir que o rosto fique visível em pouca largura)
  - Desktop: mantém `md:right-0 md:top-0 md:h-full md:w-[60%] md:object-right`
- Resultado: a foto fica do mesmo tamanho que o bloco de texto à esquerda, alinhada no topo — exatamente como na referência.

**3. Vinheta — simplificar pra só fusão horizontal (igual desktop e mobile):**

- Remover a vinheta vertical mobile (linhas 477-481) — não é mais necessária porque a foto não está mais embaixo.
- Manter só a horizontal (linhas 471-475), mas ativar em mobile também: trocar `hidden md:block` por bloco visível sempre, com largura adaptativa: `w-[58%] md:w-[55%]`. Garante a fusão preto→glow logo onde o texto encosta na foto.

**4. Texto — reduzir tamanhos no mobile pra caber na coluna mais estreita:**

- Linha 494 (subtítulo): trocar `text-[clamp(15px,2.2vw,20px)]` por `text-[clamp(12px,3vw,20px)]`.
- Linha 498 (manchete "OS NOVOS NORDESTINOS"): trocar `text-[clamp(28px,5.2vw,52px)]` por `text-[clamp(20px,5.5vw,52px)]` e adicionar `break-words` — quebra natural em 2 linhas no mobile estreito (igual à referência desktop que mostra em 1 linha, mas o mobile precisa quebrar).
- Linha 502 (parágrafo): trocar `text-[clamp(13px,2vw,17px)]` por `text-[clamp(11px,2.6vw,17px)]`.
- Linha 487 (pill "O Movimento"): adicionar `text-[10px] md:text-xs` pra reduzir no mobile.
- Linha 514 (BrutalistButton): manter `size="lg"` mas reduzir gap `mt-6 md:mt-8`.

**5. Remover** a coluna direita vazia (linha 527 `<div className="hidden md:block" />`) — não precisa mais já que o grid já reserva o espaço por proporção.

### Resultado visual no mobile (518px)

```text
┌─────────────────────────────────┐
│ ─── O MOVIMENTO       ░▒▓██▓░  │
│                      ░▒▓████▓░ │
│ Chegou a hora       ░▒▓██👤█▓░ │
│ do Brasil conhecer  ░▒▓██👤█▓░ │
│ OS NOVOS            ░▒▓██👤█▓░ │
│ NORDESTINOS         ░▒▓████▓░  │
│                      ░▒▓███▓░  │
│ Empresário e prof... ░▒▓██▓░   │
│                                 │
│ [INICIAR AVALIAÇÃO ▶]           │
└─────────────────────────────────┘
   52% texto         48% foto
```

Idêntico à hierarquia da referência: pill → subtítulo branco → manchete laranja → parágrafo → CTA, tudo à esquerda; foto à direita ocupando a coluna inteira com o glow integrando naturalmente.

### Arquivo alterado

- `src/routes/index.tsx` — ajustes nas linhas 461, 463-469, 471-481, 484, 487, 494, 498, 502, 514, 527 (todas dentro da função `HeroIntro`).

