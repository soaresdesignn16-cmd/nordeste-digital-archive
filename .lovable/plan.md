

## Mais respiro nos cards do "Audience" no mobile

Ajuste apenas no bloco `@media (max-width: 540px)` em `src/styles.css` (linhas 736–760). Não toco em desktop, low-gpu, reduced-motion, nem na lógica de animação.

### Mudanças

1. **`.fan-stack-wrap`** — padding lateral 24px → **32px**, padding inferior 60px → **88px**. Cria margem visível em volta do palco e separa melhor da próxima seção.
2. **`.fan-stack`** — largura `min(320px, 82vw)` → **`min(300px, 76vw)`**, altura `min(420px, 115vw)` → **`min(400px, 108vw)`**. Card menor = mais ar em volta = lead aparece destacado, sem encostar nas bordas.
3. **`.audience-pin__header`** — `padding-top` 60px → **48px**, `padding-bottom` 16px → **12px**. Recupera ~16px de altura útil pro palco, compensando a folga extra acima/abaixo do leque.
4. **`.fan-card`** — padding `28px 24px 32px` → **`26px 22px 30px`**. Sutil, pra acompanhar a redução do card e manter respiração interna proporcional.

### Sem mudança

- Altura do pin (`360vh`) — fases de scroll preservadas.
- Tipografia dos cards (h3 16px, p 13px).
- Rotações, z-index, slide-out, ordem direita/esquerda/direita — intactos.
- Desktop, `.low-gpu`, `prefers-reduced-motion` — intactos.

### Arquivo editado

- `src/styles.css` — apenas linhas 740–753 (dentro do `@media (max-width: 540px)`).

