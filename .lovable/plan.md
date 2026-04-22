

## Padronizar heights do FinalCTA (768/1024) + adicionar botão "A Sua Chance" abaixo da headline final

### 1. Padronizar heights entre 768px e 1024px

Hoje há 3 fontes de altura conflitantes (inline 70vh, mobile 70svh, tablet/desktop 70vh) que causam salto perceptível ao cruzar 768→769px e ao mostrar/esconder a barra de endereço mobile.

**`src/routes/index.tsx`** (linhas 1377–1378):
- Remover o `style={{ minHeight: "70vh", paddingTop: 0, paddingBottom: 0 }}` do `<section>` — passa a ser controlado pelo CSS.

**`src/styles.css`**:
- `.section-cta` (regra base): adicionar `min-height: 70dvh; padding-top: 0; padding-bottom: 0;`.
- `.final-cta-sticky` (regra base): trocar `height: 70vh` por `height: 70dvh`.
- Remover `height: 70svh` do bloco `@media (max-width: 768px)`.
- Remover `height: 70vh` do bloco `@media (min-width: 769px) and (max-width: 1024px)`.
- Remover `height: 70vh` do bloco `@media (min-width: 1025px)`.

Resultado: altura única `70dvh` em todos os breakpoints — sem salto entre tablet e desktop, sem glitch da barra do navegador mobile (o `dvh` se adapta automaticamente). As media queries continuam controlando apenas scale da headline e gradient.

### 2. Botão "A Sua Chance" abaixo da headline

**`src/routes/index.tsx`** (dentro de `FinalCTA`, após o `<h2>` na linha 1384):

Adicionar wrapper com botão laranja de destaque centralizado abaixo da headline:

```
<div className="final-cta-actions">
  <a href="#cta-block" className="btn-primary btn-primary--lg">
    A Sua Chance
    <ArrowRight size={14} />
  </a>
</div>
```

O botão usa as mesmas classes `btn-primary btn-primary--lg` já usadas no `CTABlock` (consistência visual com os outros CTAs primários da página). O `href="#cta-block"` faz scroll suave até o bloco final onde está o "Solicitar avaliação estratégica".

**`src/styles.css`** — adicionar regra `.final-cta-actions`:
- `margin-top: 40px; display: flex; justify-content: center;`
- Mobile (`max-width: 768px`): `margin-top: 28px`.

O botão fica dentro do `.final-cta-sticky` junto com a headline — quando a section pina no centro do viewport, headline + botão aparecem juntos centralizados verticalmente. O `dvh: 70` continua acomodando ambos confortavelmente em todos os tamanhos.

### Resultado esperado

- Transição suave entre 768/769/1024/1025px sem nenhum salto visual.
- Headline "Pronto para ser visto de verdade?" + botão laranja "A Sua Chance" aparecem juntos, centralizados, fixos por 70dvh.
- Botão clicável leva ao bloco de CTA logo abaixo (mantém o funil natural).

### O que NÃO muda

- Texto da headline, lógica de scale, isolation/z-index, gradient — preservados.
- `CTABlock`, `Footer`, demais seções — intactos.
- Espaçamento final reduzido (já em 70dvh) — mantido.

### Arquivos editados

- `src/routes/index.tsx`:
  - Linhas 1377–1378: remover prop `style` inline da `<section>`.
  - Após linha 1384: adicionar `<div className="final-cta-actions">` com botão "A Sua Chance".
- `src/styles.css`:
  - `.section-cta` base: adicionar `min-height: 70dvh; padding-top: 0; padding-bottom: 0`.
  - `.final-cta-sticky` base: `70vh` → `70dvh`.
  - Remover `height` duplicado das 3 media queries (768, 769–1024, 1025+).
  - Adicionar `.final-cta-actions` (desktop + mobile).

