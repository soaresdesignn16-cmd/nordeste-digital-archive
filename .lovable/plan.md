

## Ajustar animação do leque: pilha de "pasta" inicial → leque abre no scroll

O JSX e o hook de scroll já estão certos, mas hoje os 4 cards começam **perfeitamente sobrepostos** (você só vê 1 card) e o leque que abre atrás fica **escondido** pelo card da frente até a fase 2 do slide. Resultado: parece que nada acontece até o card principal sair. Vou corrigir só o **CSS** (`src/styles.css`, bloco `.fan-card*`) pra que:

1. **Estado inicial = pasta empilhada** com cards "espiando" por trás (igual papel numa pasta).
2. **Durante o scroll** o leque abre **visivelmente** atrás do card da frente (vê os 3 saindo em ângulo enquanto o principal ainda está no centro).
3. **Final do scroll** o card principal desliza pra esquerda e o leque já aberto fica todo à mostra.

### 1. Estado inicial — visual de pasta

Cada card de fundo recebe um leve **offset vertical + escala decrescente + sombra empilhada** quando `--fan = 0`, criando o look de pasta:

```css
.fan-card--bg-1 {            /* card mais ao fundo */
  transform:
    translateY(calc(12px - var(--fan) * 12px))
    scale(calc(0.94 + var(--fan) * 0.06))
    rotate(calc(var(--fan) * -22deg));
}
.fan-card--bg-2 {
  transform:
    translateY(calc(8px - var(--fan) * 8px))
    scale(calc(0.96 + var(--fan) * 0.04))
    rotate(calc(var(--fan) * -14deg));
}
.fan-card--bg-3 {
  transform:
    translateY(calc(4px - var(--fan) * 4px))
    scale(calc(0.98 + var(--fan) * 0.02))
    rotate(calc(var(--fan) * -7deg));
}
.fan-card--lead {            /* card da frente, sempre reto */
  transform:
    translateX(calc(var(--slide) * -135%))
    rotate(calc(var(--slide) * -4deg));
  opacity: calc(1 - var(--slide) * 0.1);
}
```

Resultado visual quando `--fan=0` e `--slide=0`:
- Card 1 (fundo): 12px abaixo, 94% de tamanho → aparece como uma "borda" embaixo do principal.
- Card 2: 8px abaixo, 96% → segunda borda peek.
- Card 3: 4px abaixo, 98% → terceira borda peek.
- Lead: tamanho cheio, em cima, no centro — exatamente como uma pasta de papéis empilhados.

### 2. Ângulos do leque mais abertos

Aumento os ângulos finais (`-22°`, `-14°`, `-7°` em vez de `-18°/-12°/-6°`) pra o leque abrir mais visível e os cards "vazarem" pelos lados do principal **antes** do slide acontecer, dando o efeito de leque do vídeo.

### 3. Origem da rotação centralizada na base

Trocar `transform-origin: bottom left` por `transform-origin: bottom center` no `.fan-card` — assim o leque abre simétrico em torno do eixo central da pilha (não pra um canto só), igual ao gesto natural de abrir um leque de cartas.

### 4. Sombra empilhada no estado pasta

Adicionar transição suave da sombra: quando empilhado, sombras mais leves e curtas (look de pasta); quando o leque abre, sombras dramáticas (look de cards individuais).

```css
.fan-card {
  box-shadow:
    0 calc(8px + var(--fan) * 14px) calc(20px + var(--fan) * 30px) rgba(0,0,0,0.45),
    0 4px 10px rgba(0,0,0,0.3);
}
```

### 5. z-index — manter ordem correta

`bg-1 < bg-2 < bg-3 < lead` (já está assim). Confirmar que mesmo com translate/scale a ordem de empilhamento não muda — z-index resolve isso.

### Sem mudanças

- JSX em `src/routes/index.tsx` — intocado (4 cards: 3 bg + 1 lead, refs e hook idênticos).
- Lógica de fases (A: 0–55% leque, B: 55–100% slide) — preservada.
- Mobile e `prefers-reduced-motion` — fallback de lista vertical empilhada continua igual.
- Cores, ícones, tipografia e textos dos perfis — preservados.

### Arquivo editado

- `src/styles.css` — só o bloco `.fan-card*` (linhas 651–707): novas fórmulas de transform com `translateY + scale + rotate` combinados, `transform-origin: bottom center`, sombra dinâmica em função de `--fan`.

