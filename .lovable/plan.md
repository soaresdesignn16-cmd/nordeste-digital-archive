

## Substituir seção "Quem Está Por Trás" — full-bleed com foto de fundo

Reformular o `FounderSection()` em `src/routes/index.tsx` (linhas 1079–1131) para uma seção full-width com a foto enviada como background, gradient overlay forte para preto, e texto + CTA na metade inferior.

### Asset

- Copiar `user-uploads://image-3.png` para `src/assets/founder-armchair.jpg` e importar no topo do `index.tsx` junto aos outros assets.
- Remover o import `founder-portrait.jpg` se não for mais usado (vou checar — está usado só nesta seção).

### Estrutura da nova seção

```text
<section class="founder-bleed">
  <div class="founder-bleed__bg" />        ← <img> da foto, position absolute
  <div class="founder-bleed__overlay" />   ← gradient transparente → #000
  <div class="founder-bleed__content">     ← texto na metade inferior
     [— QUEM ESTÁ POR TRÁS]
     <h2>MUITO PRAZER,
         <span class="accent">OS NOVOS<br/>NORDESTINOS</span></h2>
     <p>MOVIMENTO DE POSICIONAMENTO DIGITAL.<br/>
        ESPECIALISTAS EM AUTORIDADE DE MARCA.</p>
     <a class="founder-cta">[logo] QUERO ENTRAR PARA O MOVIMENTO →</a>
  </div>
</section>
```

- Mantém `Reveal` wrappers para preservar entrada animada já usada no resto do site.
- Mantém o link âncora `#cta-final` no botão.
- Remove o bloco `RevealWords` com o parágrafo longo "Nascemos com um propósito…" e o `<div class="founder-stage">` antigo (substituídos pela foto de fundo + texto enxuto pedido).

### Estilos novos (em `src/styles.css`, após o bloco `.founder-stage` linha ~1235)

- `.founder-bleed`: `position: relative; width: 100%; min-height: 100vh; background:#000; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; padding: 0 24px 80px;`
- `.founder-bleed__bg`: `position:absolute; inset:0 0 auto 0; height:65%; object-fit:cover; object-position:center top; z-index:0;` — em mobile `height:55%`.
- `.founder-bleed__overlay`: `position:absolute; inset:0; background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 30%, #000 55%, #000 100%); z-index:1;`
- `.founder-bleed__content`: `position:relative; z-index:2; max-width: 720px; margin: 0 auto; width:100%; padding-top: 55vh;` — empurra o texto pra metade inferior. Em mobile `padding-top: 50vh`.
- Label gold com traço: `.founder-bleed__label` — flex com `<span class="dash">` (linha 24px gold) + texto uppercase tracking 0.18em, 12px, cor `var(--accent)`.
- Heading: reusa `.typo-headline` mas com `font-weight: 900; line-height: 1; text-transform: uppercase; letter-spacing: -0.01em;`. Inline style ou modifier `.typo-headline--display`.
- Subtext: `.founder-bleed__sub` — uppercase, 12px, letter-spacing 0.18em, color `rgba(255,255,255,0.55)`, line-height 1.9.
- `.founder-cta`: variante do `.btn-primary`, `width:100%; max-width:500px; padding:18px 28px; border-radius:10px; font-size:13px;` com `<img src={logoOnn} class="founder-cta__icon">` (24px) à esquerda. Em desktop centralizado.

### Desktop (≥ 1024px)

Mantém o mesmo layout full-bleed centralizado (opção mais limpa do que dividir 50/50 com a foto — combina mais com o resto do site, que é centered). A foto cobre os ~60% superiores em widescreen, texto centralizado abaixo. Min-height vira `min-height: 92vh`.

### Animações / performance

- Reuso dos componentes `Reveal` existentes para fade-in (sem novo CSS).
- Sem `filter: blur`, mantém a regra do projeto de scroll snappy.
- `loading="eager"` + `fetchpriority="high"` na foto (seção crítica acima do CTA final) e adicionar preload no `head().links` como já é feito com `founderHeroGlow`.

### O que NÃO muda

- Nada antes (`AudienceSection`) ou depois (`ImpactSection`) é alterado.
- Variáveis CSS, tokens, accent color (`var(--accent)` ≈ gold já existente — confere com o `#c8861a` pedido).
- Header, footer, nav.

### Arquivos editados

- `src/routes/index.tsx` — adicionar import da nova foto, reescrever `FounderSection`, adicionar preload no `head()`. Remover import `founderPortrait` se não usado em outro lugar (vou conferir antes).
- `src/styles.css` — adicionar bloco `.founder-bleed*` e `.founder-cta`. Remover `.founder-stage` antigo (não será mais usado).
- `src/assets/founder-armchair.jpg` — novo asset (copiado do upload).

