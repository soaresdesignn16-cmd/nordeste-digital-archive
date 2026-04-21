

## Plano — Padronizar todos os botões CTA igual à referência

A referência mostra um botão laranja vibrante (gradiente amarelo-âmbar → laranja queimado), cantos bem arredondados, texto preto grande em **Poppins Black** e uma seta ▶ preta sólida à direita. Todos os CTAs do site (`BrutalistButton`) já usam a classe `.btn-gold`, então basta atualizar a classe em `src/styles.css` para todos os botões herdarem o novo visual automaticamente — sem mexer em cada chamada individual.

### Mudanças em `src/styles.css` (linhas 275–309)

**`.btn-gold` (base):**
- Gradiente mais vibrante e quente: `linear-gradient(180deg, #F5A24A 0%, #E07A28 55%, #C8631A 100%)` — replica o tom amarelo/âmbar no topo descendo pro laranja queimado da referência.
- `border-radius: 14px` (mais arredondado, igual à imagem).
- `padding: 18px 34px` (base maior, mais "presença").
- `font-size: 15px`, `letter-spacing: 0.04em`.
- Mantém `font-family: var(--font-display)`, `font-weight: 900`, `text-transform: uppercase`, `color: #0A0A0A`.
- Sombra mais cinematográfica: `box-shadow: 0 14px 32px -10px rgba(224, 122, 40, 0.55), inset 0 1px 0 rgba(255, 220, 170, 0.6), inset 0 -2px 0 rgba(140, 60, 10, 0.25)` — dá leve relevo (highlight no topo + sombra interna embaixo) igual à referência.
- Hover: leve `translateY(-2px)` + sombra reforçada (mantido).

**`.btn-gold-lg`:**
- `padding: 22px 44px`, `font-size: 17px`, `border-radius: 16px`.

**`.btn-gold-xl`:**
- `padding: 26px 56px`, `font-size: 19px`, `border-radius: 18px`, `letter-spacing: 0.06em`.

**Seta ▶:**
- A seta já é renderizada inline em cada chamada (`<span aria-hidden>▶</span>`). Para garantir que fique igual à referência (preta, sólida, alinhada), aumento o tamanho relativo no CSS: adicionar regra `.btn-gold > span[aria-hidden]` com `font-size: 1em; line-height: 1; transform: translateY(0);` e `gap: 0.8rem` no `.btn-gold` para dar respiro entre o texto e a seta.

### Resultado

Todos os 3 CTAs principais da LP — "Quero ser selecionado", "Quero entrar para o movimento", "Solicitar minha avaliação estratégica" — passam automaticamente a usar o visual da referência: laranja vibrante, mais arredondado, texto Poppins Black grande e seta preta destacada. Mobile e desktop herdam o mesmo estilo (o tamanho é controlado pela prop `size` que já está em uso).

### Arquivo alterado

- `src/styles.css` — atualização das classes `.btn-gold`, `.btn-gold-lg`, `.btn-gold-xl` (linhas 275–309).

