

## Plano — Sticky Stack Scroll nos cards de "Esse movimento faz sentido pra você se:"

### O efeito (baseado no vídeo)
Conforme o usuário rola, cada card dos 4 perfis **gruda no topo** (sticky) e o próximo card sobe por cima dele, criando uma pilha cinematográfica — a pessoa lê **um bloco por vez**, no ritmo do scroll. Quando chega no último, a pilha toda libera e a página segue.

Isso dá pausa editorial, força a leitura completa de cada perfil (aumenta comprehension/conversão) e comunica autoridade.

### Escopo preservado
- ✅ O título **"Esse movimento faz sentido pra você se:"** + subtítulo ficam **exatamente como estão** (fora do efeito, acima da pilha).
- ✅ Copy, ícones, ordem e estilo dos 4 cards preservados.
- ✅ Efeitos atuais (TiltCard/spotlight) continuam funcionando em cada card.

### Implementação (CSS puro `position: sticky` — sem JS, performático)

No `AudienceSection` (linhas 619-636):
- Envolver a lista `.flex.flex-col.gap-5` em uma **"stack zone"** com `position: relative` e altura suficiente para acomodar o scroll de todos os cards (`~ 4 × 90vh`).
- Cada card vira um wrapper com `position: sticky; top: 100px` (abaixo do navbar) e `height: calc(100vh - 140px)` ou altura fixa confortável.
- Cada card recebe `z-index` crescente (`1, 2, 3, 4`) para que o próximo sempre cubra o anterior.
- Adicionar um leve `scale-down` + offset progressivo ao card "de baixo" via CSS var por índice, pra parecer que ele "afunda" quando o próximo chega (efeito de deck de cartas).
- Transição sutil de `transform`/`opacity` ligada ao progresso do scroll via `animation-timeline: view()` (suportado no Chrome/Edge/Safari 26+) com fallback graceful: quem não suporta vê simples sticky sem deck-depth, e ainda funciona perfeito.

### Mobile (484px atual)
- Mantém sticky stack (funciona igual), mas com `top: 72px` e altura menor (`calc(100svh - 100px)`) pra caber no viewport do celular.
- `gap` zerado dentro da stack zone (os cards se sobrepõem, não se empilham com espaço).

### Acessibilidade
- `@media (prefers-reduced-motion: reduce)` → desativa sticky e cai pro layout atual (flex column normal com gap).

### Arquivos afetados
- `src/routes/index.tsx` — refatorar o `<div className="flex flex-col gap-5">` do `AudienceSection` para a "sticky stack zone" com wrappers por card.
- `src/styles.css` — adicionar utilitários `.stack-zone`, `.stack-card`, animation-timeline com `view()` pra deck-depth, e fallback.

### Garantias
- ✅ Copy 100% preservada
- ✅ Título e subtítulo intactos (efeito começa só nos cards)
- ✅ 4 cards lidos um por vez conforme scroll
- ✅ Compatível com TiltCard/spotlight existentes
- ✅ Mobile e desktop
- ✅ Reduced-motion desativa

