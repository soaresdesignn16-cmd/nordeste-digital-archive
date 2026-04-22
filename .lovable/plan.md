

## Reorganizar fim da página: CTA sai da FinalCTA e vai para o fim da DuranteAnos

Hoje a `FinalCTA` tem:
1. Eyebrow "A Hora É Agora"
2. Headline gigante "Pronto para ser visto de verdade?" (efeito recede)
3. Parágrafo de apoio
4. CTA primário "Solicitar avaliação estratégica" + CTA secundário "Conhecer o manifesto"
5. Quote final "Agora é a nossa vez de ocupar o lugar certo."

O efeito recede sobrepõe a headline em cima do parágrafo/CTA porque o `scale` chega a 1.9 e ocupa quase toda a tela. Resultado: letras embaralhadas em cima dos botões, e ainda sobra um vazio preto ao final da `DuranteAnosHeadline` antes da `FinalCTA` começar.

### Solução

**Separar o CTA do efeito recede em dois blocos sequenciais distintos:**

1. **Mover o bloco eyebrow + parágrafo + botões + quote** para imediatamente após a `DuranteAnosHeadline` (preenche o vazio preto que aparece logo após a frase "Agora é a nossa vez").
2. **Manter a `FinalCTA` apenas com a headline gigante** "Pronto para ser visto de verdade?" e seu efeito recede — sem nada por baixo para sobrepor.

### Mudanças em `src/routes/index.tsx`

**Novo componente `CTABlock`** (extraído do conteúdo atual de `FinalCTA`, linhas 1383–1418):
- Eyebrow "A Hora É Agora"
- Parágrafo "Entre para o movimento exclusivo…"
- Botões "Solicitar avaliação estratégica" + "Conhecer o manifesto"
- Quote "Agora é a nossa vez de ocupar o lugar certo."
- Renderizado dentro de uma `<section>` com `background: var(--bg)`, padding vertical generoso (~120px top/bottom) e `id="cta-block"`.
- Mantém watermark `ONN` e SVG dos círculos como pano de fundo (movidos junto, são decorativos).

**`FinalCTA` simplificado** (linhas 1303–1421):
- Mantém `sectionRef` + `headlineRef` + todo o `useEffect` do efeito recede (sem mexer na lógica que já foi aprovada).
- Renderiza apenas a `<section>` com a `<h2 className="final-cta-headline">Pronto para ser<br/><span class="accent-text">visto de verdade?</span></h2>` centralizada.
- Remove eyebrow, parágrafo, botões e quote.
- Padding vertical mantido em ~150px para dar espaço ao recede.
- Sem watermark/SVG (vão para o `CTABlock`).

**Reordenar em `App` (linhas 444–446):**
```
<DuranteAnosHeadline />
<CTABlock />        ← novo, preenche o vazio
<FinalCTA />        ← só a headline recede, isolada
<Footer />
```

### CSS — `src/styles.css`

- **Adicionar `.section-cta-block`** (~10 linhas no fim do arquivo): mesma base de `.section-cta` (position relative, `background: var(--bg)`, overflow hidden) + um `::before` opcional com radial âmbar suave para dar profundidade. Preserva visual do bloco original.
- **Manter `.section-cta`** intacta (já está em `var(--bg)` sem border-top, perfeita para a headline recede isolada).
- **Garantir continuidade de fundo preto** na sequência DuranteAnos → CTABlock → FinalCTA → Footer (todos `var(--bg)`), eliminando qualquer "vazio" visual.

### O que NÃO muda

- Lógica do efeito recede (curva 1.9 → 0.55, opacity 1 → 0.2, todos os listeners robustos) — preservada.
- Lógica do scroll-zoom de `DuranteAnosHeadline` — intacta.
- Conteúdo textual (eyebrow, headline, parágrafo, labels dos botões, quote) — preservado palavra por palavra.
- Watermark `ONN` e SVG dos círculos — apenas migram do `FinalCTA` para o `CTABlock`.
- `Footer` — intacto.
- Tokens CSS — intactos.

### Arquivos editados

- `src/routes/index.tsx` —
  - Criar componente `CTABlock` com o conteúdo extraído (eyebrow, parágrafo, botões, quote, watermark, SVG).
  - Simplificar `FinalCTA` para conter apenas a headline gigante + efeito recede (lógica do `useEffect` preservada).
  - Inserir `<CTABlock />` entre `<DuranteAnosHeadline />` e `<FinalCTA />` na lista de seções (linha 444–446).
- `src/styles.css` — adicionar bloco `.section-cta-block` (~10 linhas) no final; nenhuma regra existente removida.

