

## Plano — Substituir foto do idealizador e refazer a seção "Chegou a hora" do zero

As 3 novas referências mostram que **o glow laranja agora vem embutido na própria foto do idealizador** (IMG-0047-2). A IMG-0043-2 é o resultado final desejado: fundo preto + foto com glow integrado à direita + texto à esquerda + CTA "INICIAR AVALIAÇÃO ▶". Muito mais simples e cinematográfico do que a versão atual (que empilha sol CSS + foto separada + máscaras).

### Composição final (igual à IMG-0043-2)

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│   ─── O MOVIMENTO                                │
│                                    ░░▒▒▓▓██▓▓░░  │
│   Chegou a hora do Brasil       ░░▒▓▓██🟠██▓▓░░  │
│   conhecer                     ░▒▓██🟠👤🟠██▓░  │
│   OS NOVOS                     ░▒▓██🟠👤🟠██▓░  │
│   NORDESTINOS  (laranja)       ░▒▓██🟠👤🟠██▓░  │
│                                 ░▒▓██🟠🟠██▓▒░   │
│   Empresários e profissionais... │ ░▒▓████▓▒░│   │
│                                                  │
│   [ INICIAR AVALIAÇÃO ▶ ]                       │
│                                                  │
└──────────────────────────────────────────────────┘
   fundo preto profundo (#0a0606)
```

### Passo 1 — Trocar o asset da foto

- Copiar `user-uploads://IMG-20260421-WA0047-2.jpg` → `src/assets/founder-hero-glow.jpg` (a foto nova já vem com o glow laranja embutido, fundo preto à esquerda).
- Manter `founder-hero.jpg` antigo no repo (não remover) — apenas deixar de importar. O novo import será `founderHeroGlow`.

### Passo 2 — Remover o sol CSS (não é mais necessário)

Em `src/styles.css` (linhas 940–956), **deletar** o bloco `.hero-sun` + keyframe `pulse-sun` + classe `.animate-pulse-sun`. O glow agora vive dentro da imagem, então essas regras viram código morto.

### Passo 3 — Reescrever `HeroIntro` do zero (`src/routes/index.tsx`, linhas 454–535)

Estrutura nova, bem mais limpa, sem máscaras nem camadas empilhadas:

- **Container externo**: `<section>` com `bg-[#0a0606]` (preto profundo idêntico à referência), padding vertical generoso, sem `rounded-[28px]` no card interno (a foto sangra até a borda igual à referência).
- **Container interno**: `max-w-[1280px] mx-auto`, `relative overflow-hidden`, `min-h-[560px] md:min-h-[640px]`.
- **Foto nova com glow embutido**: 
  - Desktop: `absolute right-0 top-0 h-full w-[60%] object-cover object-right` — sangra na borda direita, alinhada ao topo/base.
  - Mobile: `absolute right-[-15%] bottom-0 w-[110%] h-[55%] object-cover object-right-bottom opacity-90` — fica como "fundo" da metade inferior, texto sobrepondo no topo.
  - **Sem máscara CSS** — a própria foto já tem fade preto à esquerda embutido.
- **Vinheta de fusão à esquerda** (só desktop, garante leitura do texto): `absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#0a0606] via-[#0a0606]/85 to-transparent`. No mobile, gradiente vertical de baixo: `bg-gradient-to-t from-[#0a0606] via-[#0a0606]/70 to-transparent` cobrindo a metade inferior.
- **Bloco de texto** (z-10, à esquerda no desktop, em cima no mobile):
  - Pill com linha decorativa: `─── O MOVIMENTO` em laranja `#E07A28`, uppercase, `tracking-[0.32em]`, `text-xs font-semibold`.
  - Subtítulo branco: "Chegou a hora do Brasil conhecer" — Poppins 600, `text-[clamp(15px,2.2vw,20px)]`.
  - Manchete: "OS NOVOS NORDESTINOS" em **uma linha só** no desktop (igual à IMG-0050-2/0043-2), Poppins Black 900, laranja `#E08C32`, `text-[clamp(28px,5.2vw,52px)]`, `tracking-[-0.01em]`. Quebra natural só em mobile estreito.
  - Parágrafo: "**Empresário e profissionais nordestinos** que já constroem resultado, mas agora decidiram ser **vistos, valorizados e respeitados** no nível que realmente são." — palavras em destaque com `font-bold italic` (cream) e laranja respectivamente, exatamente como na referência.
  - CTA `<BrutalistButton>` com classe `.btn-gold` (já padronizado): "INICIAR AVALIAÇÃO ▶".

### Passo 4 — Limpeza dos imports

- Remover `import founderHero from "@/assets/founder-hero.jpg"` (linha 28).
- Adicionar `import founderHeroGlow from "@/assets/founder-hero-glow.jpg"`.

### Resultado

Seção fica **idêntica à IMG-0043-2**: fundo preto, foto do idealizador com glow laranja natural à direita, texto cream/laranja à esquerda, CTA destacado abaixo. Mobile fica igual à IMG-0050-2 (texto + CTA na metade superior, foto sangrando no fundo da metade inferior). Código muito mais simples — 1 imagem, 1 vinheta, 1 bloco de texto. Sem sol CSS, sem máscaras, sem camadas duplicadas.

### Arquivos alterados

- `src/assets/founder-hero-glow.jpg` — nova imagem (copiada do upload).
- `src/routes/index.tsx` — reescrita de `HeroIntro` (linhas 454–535) + troca de import.
- `src/styles.css` — remover bloco `.hero-sun` e `pulse-sun` (linhas 940–956).

