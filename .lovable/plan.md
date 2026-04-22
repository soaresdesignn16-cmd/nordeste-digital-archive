

## Reordenar FinalCTA + efeito word-reveal na headline final

### Problema atual

1. **Ordem errada**: hoje renderiza `DuranteAnosHeadline` → `CTABlock` (com botão "Solicitar avaliação estratégica" + frase "Agora é a nossa vez de ocupar o lugar certo") → `FinalCTA` (headline "Pronto para ser visto…" + botão "A Sua Chance"). O botão "A Sua Chance" aparece **depois** do CTA principal e tenta linkar para `#cta-block` que está **acima** dele — fica solto, parecendo "em cima da CTA".
2. **Efeito de scale não acontece no espaço vazio**: como o `FinalCTA` vem depois do `CTABlock`, o scroll-zoom da headline acontece já no fim da página, sem o "respiro" entre o "Durante anos…" e o CTA.
3. **Falta efeito word-reveal**: a headline "Pronto para ser visto de verdade?" hoje aparece já colorida; o usuário quer que apareça transparente e ganhe cor palavra por palavra (mesmo efeito do `RevealWords` já usado nos parágrafos).

### Mudanças

#### 1. Reordenar componentes — `src/routes/index.tsx` (linhas 444–446)

Trocar a ordem para: `DuranteAnosHeadline` → `FinalCTA` → `CTABlock` → `Footer`.

```
<DuranteAnosHeadline />
<FinalCTA />
<CTABlock />
<Footer />
```

Agora o `FinalCTA` ocupa o "espaço vazio" entre as duas seções de texto pesado, o efeito de scale acontece naturalmente nesse intervalo, e o botão "A Sua Chance" linka para `#cta-block` que fica **abaixo** (faz sentido como funil descendente).

#### 2. Aumentar scale inicial e ajustar curva — `src/routes/index.tsx` (linhas 1332–1338, dentro de `FinalCTA`)

Hoje começa em 1.4/1.6/1.9 e termina em 1.0. Para "começar bem grande e diminuir até caber certinho" em ambos breakpoints, aumentar valor inicial:

- Mobile (`≤768px`): start 2.2 → end 1.0
- Tablet (`769–1024`): start 2.6 → end 1.0
- Desktop (`≥1025`): start 3.2 → end 1.0

Atualizar também o `scale()` default no CSS (`.final-cta-headline` e media queries) para bater com os novos valores iniciais — evita "pulo" no primeiro frame antes do JS rodar.

#### 3. Efeito word-reveal na headline final — `src/routes/index.tsx` (linhas 1380–1383)

Substituir o `<h2>` atual por uma versão que separa cada palavra num `<span class="reveal-word">` (mesmo padrão do `RevealWords` já existente). Como precisamos manter o `<h2>` (display heading, não `<p>`), criar a estrutura inline:

```
<h2 ref={headlineRef} className="typo-display final-cta-headline">
  <span className="reveal-word">Pronto</span>{" "}
  <span className="reveal-word">para</span>{" "}
  <span className="reveal-word">ser</span>
  <br />
  <span className="reveal-word accent-text">visto</span>{" "}
  <span className="reveal-word accent-text">de</span>{" "}
  <span className="reveal-word accent-text">verdade?</span>
</h2>
```

Adicionar dentro do `useEffect` do `FinalCTA` uma chamada ao mesmo hook usado pelo `RevealWords`:

```
useScrollProgressReveal(headlineRef, ".reveal-word", { activeRatio: 0.6, deactivate: false });
```

`activeRatio: 0.6` = palavras ganham cor quando passam pelos 60% da viewport (mais cedo, casa com o sticky). `deactivate: false` = uma vez coloridas, ficam coloridas (não desbotam ao continuar rolando).

#### 4. Garantir que `.reveal-word` funcione dentro de `.final-cta-headline` — `src/styles.css`

Hoje `.reveal-word` herda `color: var(--text-ghost)` e `opacity: 0.25`. Para a headline final isso está correto — começa apagada e ganha cor. Adicionar regra específica para preservar o `accent-text` (laranja) nas palavras "visto de verdade?" quando ativas:

```
.final-cta-headline .reveal-word.accent-text.is-active {
  color: var(--accent);
}
```

E remover a sobrescrita `color: var(--text-primary)` da regra global `.reveal-word.is-active` quando dentro de `.final-cta-headline .accent-text` (já resolvido pela regra acima com especificidade maior).

### Resultado esperado

- Ordem: "Agora é a nossa vez" (DuranteAnos) → espaço com headline gigante encolhendo → "A Hora É Agora" / "Solicitar avaliação estratégica" (CTABlock) → footer.
- "Pronto para ser visto de verdade?" começa **enorme e transparente**, vai diminuindo conforme rola, e cada palavra ganha cor uma a uma (branco → "visto de verdade?" em laranja).
- Botão "A Sua Chance" embaixo da headline aponta para o CTA principal logo abaixo (funil natural).
- Efeito acontece no respiro entre as duas seções, não no fim morto da página.

### Arquivos editados

- `src/routes/index.tsx`:
  - Linhas 444–446: reordenar para `<FinalCTA />` antes de `<CTABlock />`.
  - Linhas 1335–1337: ajustar `startScale` (2.2 / 2.6 / 3.2).
  - Linhas 1380–1383: substituir headline plain por `<span class="reveal-word">` por palavra.
  - Após linha 1374 (dentro do `useEffect` ou logo após): adicionar `useScrollProgressReveal(headlineRef, ".reveal-word", { activeRatio: 0.6, deactivate: false })` chamado no nível do componente (fora do useEffect).
- `src/styles.css`:
  - Linhas 1626, 1644, 1657, 1667: atualizar default do `transform: scale()` para bater com novos valores (2.2 / 2.6 / 3.2).
  - Após linha 1669: adicionar regra `.final-cta-headline .reveal-word.accent-text.is-active { color: var(--accent); }`.

### O que NÃO muda

- Heights `70dvh` da `.section-cta` / `.final-cta-sticky` — preservados.
- Lógica do `.final-cta-actions` (botão "A Sua Chance") — preservada.
- `CTABlock`, `Footer`, `DuranteAnosHeadline` — intactos (só muda a posição do FinalCTA).

