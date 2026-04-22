

## Replace FounderSection CSS

Substituir integralmente o bloco CSS da `FounderSection` em `src/styles.css` (linhas ~1213–1439) pelo CSS fornecido pelo usuário. JSX/React fica intacto.

### Escopo

- **Arquivo**: `src/styles.css`
- **Classes substituídas** (todas as regras existentes destas classes, incluindo as variantes em media queries):
  - `.founder-bleed`
  - `.founder-bleed__bg`
  - `.founder-bleed__overlay`
  - `.founder-bleed__content`
  - `.founder-bleed__label`
  - `.founder-bleed__dash`
  - `.founder-bleed__line`, `.founder-bleed__line--white`, `.founder-bleed__line--gold`
  - `.founder-bleed__sub`
  - `.founder-cta`, `.founder-cta::before`, `.founder-cta__icon`, `.founder-cta__text`
  - Hover rules dentro de `@media (hover: hover) and (pointer: fine)` referentes a `.founder-cta`
  - Overrides dentro de `@media (min-width: 1024px)` e `@media (max-width: 640px)` referentes a `.founder-bleed*` / `.founder-cta`

### Mudanças de comportamento que o novo CSS introduz

- Foto agora ocupa **55%** do topo (mobile), não mais 50%.
- Overlay mobile reescrito (transparente até 40%, escurece progressivamente).
- Padding bottom mobile = **56px**; conteúdo ancorado ao fundo via `margin-top: auto` em flex-column.
- Botão CTA: largura **88% / max 520px**, altura **68px**, alinhamento `flex-start`, ícone 38×38, texto em coluna.
- Shine sweep mais largo (55%) e mais brilhante (0.38 alpha), curva 115°, transição 0.45s.
- Desktop: overlay duplo (gradient horizontal + vertical), `object-position: 65% top` (homem mais à direita), `max-width: 580px`, CTA `max-width: 460px`.
- Texto sub: cor `#7a6e58`, font-size 10.5px, letter-spacing 0.13em.
- Label: cor `#C8780A` (já estava), font-weight 400 (antes podia ser maior), gap 10px.

### O que NÃO muda

- JSX/estrutura de `FounderSection` em `src/routes/index.tsx`.
- Nenhuma outra seção, classe, ou variável global em `src/styles.css`.
- Tokens (`--border-subtle`, `--accent`) — o novo CSS continua usando `var(--border-subtle)`.

### Implementação

1. Localizar o bloco `/* ─────────── Founder Bleed ─────────── */` em `src/styles.css` e identificar o final exato do bloco (última regra `.founder-cta` em `@media (max-width: 640px)` ou similar, atualmente terminando ~linha 1439).
2. Usar `code--line_replace` para substituir todo o intervalo pelo novo CSS exatamente como fornecido.
3. Verificar com `code--view` que regras vizinhas (próxima seção CSS depois do bloco substituído) permanecem intactas.

### Arquivos editados

- `src/styles.css` — substituir bloco da FounderSection (~226 linhas → ~200 linhas).

