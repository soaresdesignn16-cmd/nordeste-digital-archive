

## Ajustar a sessão "Muito Prazer" para desktop/tablet + colocar logo real no botão

Dois problemas na seção `FounderSection`:

1. **Imagem cortada / quase invisível em ~1000px**: o breakpoint desktop só ativa em `min-width: 1024px`. No viewport atual (1002px) entra o layout mobile/tablet, que mostra a imagem só nos `55%` superiores com `object-position: center top` — corta a cabeça do fundador e quase não aparece nada (o overlay escuro consome o resto).
2. **Botão "Quero Entrar" usa um "N" desenhado em SVG** em vez do `logo-onn.png` real (já importado no topo do arquivo, linha 17).

### Mudanças

**`src/styles.css`** — ajustar breakpoint e enquadramento:

- **Baixar o breakpoint desktop de `1024px` para `900px`** (linha 1417: `@media (min-width: 1024px)` → `@media (min-width: 900px)`). Isso faz o layout full-bleed com gradient lateral começar antes, cobrindo viewports tablet/desktop pequenos como o do usuário (1002px).
- **No bloco desktop (linha 1424–1428)**: ajustar `object-position` de `65% top` para `60% center` para mostrar o rosto/torso do fundador (não só o topo da cabeça). A imagem ocupa 100% da altura (já está `height: 100%`).
- **No bloco mobile (linha 1467–1473)**: aumentar a área da foto de `height: 55%` para `height: 62%` e mudar `object-position` para `center 25%` — mostra mais do fundador antes do fade preto começar. Aplicar mesma altura no `__overlay` e ajustar o gradient para começar a escurecer só a partir de 50% (não 40%) para a imagem aparecer de verdade.

**`src/routes/index.tsx`** — substituir o SVG "N" pelo logo real (linhas 1122–1125):

- Remover o `<svg className="founder-cta__icon">...</svg>` e substituir por `<img src={logoOnn} alt="" className="founder-cta__icon" />`.
- Em `src/styles.css` no bloco `.founder-cta__icon` (linha 1374–1379): manter `width: 38px`, `height: 38px`, `margin-right: 14px`, `flex-shrink: 0`; adicionar `object-fit: contain` para garantir que o PNG não distorça.

### O que NÃO muda

- Texto do botão ("Quero Entrar / Para o Movimento") — preservado.
- Cor laranja `#C8780A` do botão, hover, shine sweep — preservados.
- Conteúdo do `FounderSection` (label "Quem Está Por Trás", headline "Muito Prazer / Os Novos / Nordestinos", subtítulo) — preservado.
- Outras seções, ordem, e a lógica do scroll-zoom — intactas.
- Asset `founder-armchair.jpg` continua o mesmo; só o enquadramento via `object-position` muda.

### Arquivos editados

- `src/styles.css`:
  - Linha 1417: `@media (min-width: 1024px)` → `@media (min-width: 900px)`.
  - Linha 1427: `object-position: 65% top` → `object-position: 60% center`.
  - Linhas 1467–1473 (bloco mobile): `height: 55%` → `height: 62%` em `__bg` e `__overlay`; `object-position: center top` → `center 25%`.
  - Linha 1374–1379 (`.founder-cta__icon`): adicionar `object-fit: contain`.
- `src/routes/index.tsx` (linhas 1122–1125): substituir o `<svg>` inline por `<img src={logoOnn} alt="" className="founder-cta__icon" />`.

