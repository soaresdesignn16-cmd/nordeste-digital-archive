

## Otimizar foto da seção "Muito Prazer" para telas pequenas

Hoje em telas pequenas a foto fica com `aspect-ratio: 4/5` + `object-fit: cover` + `object-position: center top`, o que **corta as laterais** (mãos/ombros) para encaixar na proporção retrato. No mobile real (≤543px) o stage também fica capado em `420px` desnecessariamente, deixando margem lateral grande e a foto pequena no meio do espaço.

### Ajustes em `src/styles.css` (bloco `.founder-stage*`, linhas 874–900)

**1. Stage — usar todo o espaço disponível no mobile**

- Remover o cap `max-width: 420px` em ≤640px → passar a usar `100%` da coluna (já há `padding` lateral da seção que dá respiro natural).
- Manter `max-width: 560px` apenas em desktop (centralizado).
- Adicionar `padding-inline: 0` para garantir que ocupe a largura total da coluna.

**2. Foto — preservar detalhes (mãos, enquadramento) no mobile**

- Trocar `object-fit: cover` por `object-fit: contain` **apenas em mobile (≤640px)** — a imagem inteira aparece, sem corte; fundo preto da seção complementa naturalmente as laterais.
- Em desktop manter `cover` com `object-position: center top` (enquadramento mais editorial, já funciona bem).
- Ajustar `aspect-ratio` no mobile para `3 / 4` (em vez de `4 / 5`) — proporção um pouco mais larga, melhor uso do espaço horizontal disponível em telas estreitas e evita altura excessiva.
- Adicionar `background-color: #000` na imagem para que, com `contain`, qualquer faixa lateral case com o fundo preto da seção (sem visível "letterbox").
- Reduzir intensidade da `box-shadow` no mobile (`0 18px 48px rgba(0,0,0,0.45)`) — sombra grande demais em tela pequena fica artificial.
- Manter `border-radius: 12px` (em mobile, considerar `14px` para acompanhar a leve mudança de proporção).

**3. Espaçamento vertical no mobile**

- Reduzir `margin-top` do stage de `64px` para `40px` em ≤640px — encurta a distância entre o parágrafo e a foto, mantém o ritmo da leitura.
- Garantir `margin-inline: auto` para alinhamento central perfeito.

### Resultado esperado

- **Desktop (>640px):** sem mudanças visuais — foto editorial recortada de cima, max 560px centralizada.
- **Mobile (≤640px):** foto **inteira visível** (sem corte de mãos/ombros), ocupando toda a largura útil da coluna, com proporção 3:4 mais natural para retratos completos em tela estreita, alinhada ao centro, com sombra mais sutil e respiro vertical otimizado.

### Sem mudanças

- JSX em `src/routes/index.tsx` — nenhuma alteração necessária.
- Paleta, tipografia, animações de reveal, o botão CTA logo abaixo — preservados.
- Imagem-fonte (`founderPortrait`) — a mesma; muda só o enquadramento responsivo.

### Arquivos editados

- `src/styles.css` — bloco `.founder-stage` / `.founder-stage__photo` + media query `(max-width: 640px)`.

