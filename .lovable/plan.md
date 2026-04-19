

## Plano: Tilt 3D + Spotlight cinematográfico nos cards

Vou adicionar **dois efeitos de microinteração premium** que conversam com o sistema visual dourado da ONN, sem alterar copy ou estrutura.

### Efeito 1 — Tilt 3D sutil (rotateX/rotateY 2-3°)
Card inclina seguindo o cursor com `perspective(1000px)` + `rotateX/rotateY` máx. ±3°. Spring suave de retorno ao sair. GPU-accelerated, desativado em mobile e em `prefers-reduced-motion`.

### Efeito 2 — Spotlight dourado seguindo o cursor (estilo Pinterest)
Os vídeos do Pinterest mostram tipicamente um **brilho radial que segue o mouse** sobre o card (efeito "shine on hover"). Vou implementar como gradiente radial dourado translúcido posicionado dinamicamente em `--mx`/`--my`, aparecendo só no hover. Isso dá a sensação de luz cinematográfica passando sobre o card — perfeito para o mood âmbar editorial.

### Componente único: `<TiltCard spotlight>`
Wrapper que combina os dois efeitos (ambos opcionais via prop). Reutiliza `.card-premium`. Implementação:
- `useRef` + listener `mousemove` no card
- Calcula posição relativa (0-1) → aplica rotação + atualiza CSS vars `--mx`/`--my`
- `transform-style: preserve-3d`, `transition` no `transform` para retorno suave
- Pseudo-elemento `::after` com `radial-gradient(circle at var(--mx) var(--my), rgba(224,140,50,0.18), transparent 40%)` aparecendo no hover

### Onde aplicar (escolha estratégica)

| Local | Tilt 3D | Spotlight | Por quê |
|---|---|---|---|
| **StepsSection** (4 passos) | ✅ | ✅ | Cards principais de conversão — merecem o efeito completo. Spotlight realça os ghost numbers. |
| **AudienceSection** (perfis) | ✅ | ✅ | Cards lado a lado — tilt cria diferenciação ao hover, spotlight chama atenção ao ícone. |
| **ImpactSection** (4 checks) | ❌ | ✅ | Cards horizontais finos — tilt fica estranho em formato wide. Só spotlight para "iluminar" o check ao passar. |
| **FounderSection** (card do logo central) | ✅ (mais intenso, ±4°) | ✅ | Card grande e isolado — tilt mais pronunciado fica cinematográfico. |
| **HeroIntro** (card de quote pós-VSL) | ❌ | ✅ | Card pequeno e textual — só luz suave passando, sem tilt. |
| **FinalCTA** (card final) | ❌ | ✅ (intenso) | Foco no CTA, mas spotlight reforça a aura premium do bloco. |

### Arquivos afetados
- `src/routes/index.tsx` — criar `<TiltCard>` e envolver os cards listados acima
- `src/styles.css` — adicionar `.tilt-card` (perspective + transform-style) e `.spotlight-card::after` (radial gradient com CSS vars `--mx`/`--my`)

### Garantias
- ✅ Copy 100% preservada
- ✅ Estrutura/hierarquia preservada
- ✅ Paleta dourada respeitada (spotlight em #E08C32 translúcido)
- ✅ `prefers-reduced-motion` desativa ambos efeitos
- ✅ Tilt desativado abaixo de 768px (touch sem cursor)
- ✅ Performance GPU (apenas `transform` + CSS vars)

