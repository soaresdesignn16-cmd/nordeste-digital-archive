

## Plano — Stack 100% opaco + Final CTA com logo de fundo e frases-pílula

### 1. Corrigir empilhamento na seção "Esse movimento faz sentido pra você se"

**Problema atual:** Os cards são `position: sticky` mas o `card-premium` tem fundo translúcido — por isso as letras aparecem sobrepostas e o visual fica "bugado". No vídeo de referência, cada card cobre 100% o anterior.

**Mudanças em `src/styles.css` (`.stack-card-inner`):**
- Forçar fundo **100% opaco** usando `--color-card` sólido (`hsl(24, 18%, 8%)`) com `background-color` direto, sem transparência.
- Adicionar `border: 1px solid` na cor brasa suave para criar uma "lâmina" definida entre os cards.
- Adicionar shadow forte por cima (`box-shadow: 0 -20px 40px -10px rgba(0,0,0,0.9)`) para criar a sensação de profundidade quando um card sobe sobre o outro.
- Remover o `min-height: 85vh` excessivo do `.stack-card` e padronizar para que cada card preencha exatamente uma "tela" (`min-height: 100svh` no desktop, `90svh` mobile) e o sticky `top` seja calculado para centralizar verticalmente (`top: 50%; transform: translateY(-50%)` via wrapper, mantendo o sticky funcional).
- Garantir `border-radius` consistente para que ao subir um card sobre o outro a borda superior fique arredondada e visível.

**Mudanças em `src/routes/index.tsx` (AudienceSection):**
- No mapping dos cards, remover o `TiltCard` (o tilt + spotlight quebra a sensação de "cards rígidos empilhados") e usar uma `<div className="stack-card-inner card-solid p-7">` simples.
- Centralizar verticalmente o card dentro do viewport durante a fixação.
- Aumentar levemente o spacing interno (mais ar nas tipografias) para evitar leitura sobreposta enquanto a transição acontece.

Resultado: cada card desce no centro, fica fixo, e o próximo entra por baixo cobrindo 100% — sem ver letra do anterior atrás.

---

### 2. Reescrever FinalCTA — logo ONN como fundo + frases-pílula passando por cima

**Inspirado no segundo vídeo** (a parte em que o nome "Work" fica como background gigante e cards passam por cima dele).

**Estrutura em `src/routes/index.tsx` (substituindo a função `FinalCTA`):**

```text
┌──────────────────────────────────────────────┐
│  [LOGO ONN GIGANTE de fundo, opacidade ~12%] │
│                                              │
│   "Durante anos tentaram contar               │  ← título FIXO (sticky)
│    a nossa história"                          │     no topo da seção
│                                              │
│   ┌──────────────────────────┐                │
│   │  ⬤ Cobrar mais            │  ← pílula 1   │  scroll-stack
│   └──────────────────────────┘                │     pílulas sobem
│   ┌──────────────────────────┐                │     uma por uma
│   │  ⬤ Atender menos          │  ← pílula 2   │     por cima do
│   └──────────────────────────┘                │     título/logo
│   ┌──────────────────────────┐                │
│   │  ⬤ Ter mais tempo         │  ← pílula 3   │
│   └──────────────────────────┘                │
│   ┌──────────────────────────┐                │
│   │  ⬤ Ser reconhecido        │  ← pílula 4   │
│   └──────────────────────────┘                │
│                                              │
│   ┌──────────────────────────────┐            │
│   │  Solicitar minha avaliação → │  ← CTA      │
│   └──────────────────────────────┘            │
└──────────────────────────────────────────────┘
```

**Implementação:**
- Container da seção com `min-height: ~250vh` para dar comprimento de scroll suficiente.
- Camada **fundo absoluto fixed dentro da seção**: `<LogoIcon>` em escala gigante (`width: 90vw; max-width: 900px`), centralizado, opacidade 0.10–0.15, com `position: sticky; top: 50%; transform: translateY(-50%)` — fica fixo enquanto a seção é rolada.
- Sobre o fundo da logo, **título sticky** "Durante anos tentaram contar a nossa história" centralizado, em Poppins Black, fixado no topo (~`top: 20%`) durante toda a seção.
- **Track de pílulas**: cada frase ("Cobrar mais", "Atender menos", "Ter mais tempo", "Ser reconhecido", "Posicionamento real", "Autoridade construída") em uma `<div>` pílula compacta (rounded-full, fundo brasa, borda brasa, padding `px-6 py-3`, font-bold) — separadas por `min-height: 60vh` para que cada uma entre em cena via scroll, atravessando o título e a logo de fundo.
- Animação de entrada de cada pílula via `framer-motion` `whileInView` com `y: 80 → 0` e `opacity: 0 → 1`, easing suave.
- **CTA final** centralizado depois das pílulas, na parte estática inferior da seção: botão `BrutalistButton` size xl + parágrafo de apoio.

**Adições em `src/styles.css`:**
- `.logo-watermark` — classe utilitária para a logo de fundo (fixa via sticky + opacidade baixa + filtro drop-shadow brasa).
- `.cta-pill` — pílula brasa com shadow + tracking, pronta para receber motion.
- `.cta-stack` — wrapper com `min-height` controlado para o efeito de scroll-through.

---

### Arquivos afetados
- `src/styles.css` — atualizar `.stack-card-inner` (fundo opaco), adicionar `.logo-watermark`, `.cta-pill`, `.cta-stack`.
- `src/routes/index.tsx` — limpar `AudienceSection` (remover TiltCard interno, ajustar wrapper sticky) e reescrever `FinalCTA` com logo de fundo + pílulas em scroll + CTA centralizado.

### Garantias
- ✅ Cards da seção "Esse movimento faz sentido…" cobrem 100% o anterior, sem texto fantasma sobreposto.
- ✅ Última seção: logo ONN como marca d'água gigante de fundo, título fixo "Durante anos tentaram contar a nossa história", pílulas passando por cima uma a uma no scroll, e CTA final centralizado embaixo.
- ✅ Mobile-first: tudo funciona com `svh` e `prefers-reduced-motion`.

