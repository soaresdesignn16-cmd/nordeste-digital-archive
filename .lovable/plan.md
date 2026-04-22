

## Reverter ordem do FinalCTA + fallback de cor para o reveal

### 1. Reverter ordem (FinalCTA volta a ser o último)

**`src/routes/index.tsx`** linhas 444–446 — voltar para a ordem anterior:

```
<DuranteAnosHeadline />
<CTABlock />
<FinalCTA />
<Footer />
```

Agora "Pronto para ser visto de verdade?" volta a ser o fechamento da página, logo antes do footer.

### 2. Remover/ajustar o botão para não ficar "em cima do CTA"

Como o `FinalCTA` agora vem **depois** do `CTABlock`, manter um botão "A Sua Chance" linkando para `#cta-block` faria scroll **para cima** — confuso e redundante (o usuário acabou de passar por lá).

**`src/routes/index.tsx`** linhas 1391–1396 — remover o `<div className="final-cta-actions">` por completo. A headline final fica sozinha como fechamento visual da página (mesmo padrão de antes da última iteração).

**`src/styles.css`** — manter as regras `.final-cta-actions` (não atrapalham), mas podem ser deixadas; opcionalmente removidas para limpeza. Vou deixar inertes (sem uso) para não mexer em mais nada.

### 3. Fallback para o efeito de reveal palavra-por-palavra

**Problema**: hoje as palavras começam com `color: var(--text-ghost)` + `opacity: 0.25` e só ganham cor quando o JS adiciona `.is-active`. Se algo falhar (IntersectionObserver indisponível em browser legado, erro no `requestAnimationFrame`, JS desabilitado, navegador que ignora `passive: true`), as palavras ficam **permanentemente transparentes** — texto invisível.

**Solução em 3 camadas de defesa:**

#### a) CSS-first fallback (`src/styles.css`)

Adicionar regra que ativa as palavras automaticamente quando o JS **não** marcou o root com `data-reveal-ready="true"`. Combinada com uma `@supports`/feature detection:

```css
/* Fallback: se IO não disponível OU JS não rodou, mostra todas as palavras com cor */
.no-js .reveal-word,
.no-io .reveal-word,
html:not(.reveal-ready) .final-cta-headline .reveal-word {
  color: var(--text-primary);
  opacity: 1;
}
html:not(.reveal-ready) .final-cta-headline .reveal-word.accent-text {
  color: var(--accent);
}
```

E garantir que após a hidratação, se o JS rodou OK, o `<html>` ganha a classe `reveal-ready` (que devolve o controle ao hook).

#### b) Feature detection no hook (`src/routes/index.tsx`, linhas 82–151)

No início do `useScrollProgressReveal`, antes de criar o IntersectionObserver:

```ts
// Fallback se IntersectionObserver não existir
if (typeof IntersectionObserver === "undefined") {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => el.classList.add("is-active"));
  return;
}
```

E envolver o setup do IO em `try/catch` — se algo lançar, ativar todas as palavras como fallback:

```ts
try {
  const io = new IntersectionObserver(...);
  io.observe(root);
  ...
} catch {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => el.classList.add("is-active"));
  return;
}
```

#### c) Watchdog timer (segurança extra)

Após 1.5s do mount, se nenhuma palavra dentro do root tiver `.is-active`, ativar todas — garante que mesmo em condições estranhas (scroll preso, viewport bizarro, headline acima do trigger), o texto sempre aparece:

```ts
const watchdog = setTimeout(() => {
  const els = root.querySelectorAll<HTMLElement>(selector);
  const anyActive = Array.from(els).some((el) => el.classList.contains("is-active"));
  if (!anyActive) els.forEach((el) => el.classList.add("is-active"));
}, 1500);
// limpar no cleanup
```

#### d) Marcar `<html>` como reveal-ready

No mount do hook (uma vez), adicionar `document.documentElement.classList.add("reveal-ready")` — sinaliza ao CSS que o JS está vivo e o hook assumiu controle. Sem isso, o CSS fallback mantém as palavras visíveis.

### Resultado esperado

- Ordem volta a ser: DuranteAnos → CTABlock ("Solicitar avaliação estratégica") → FinalCTA ("Pronto para ser visto de verdade?") → Footer.
- `FinalCTA` fecha a página apenas com a headline (sem botão duplicado em cima do CTA).
- Efeito de scale gigante → encolhendo + word-reveal continuam funcionando normalmente.
- **Se o JS / IntersectionObserver falhar por qualquer motivo**, as palavras aparecem com cor automaticamente — texto nunca fica invisível.

### Arquivos editados

- `src/routes/index.tsx`:
  - Linhas 444–446: trocar para `<CTABlock /> <FinalCTA />`.
  - Linhas 1391–1396: remover o `<div className="final-cta-actions">…</div>`.
  - Linhas 82–151: adicionar feature detection (IO disponível?), `try/catch` no setup, watchdog de 1.5s, e `document.documentElement.classList.add("reveal-ready")` no mount.
- `src/styles.css`:
  - Após linha 1673: adicionar bloco de fallback `html:not(.reveal-ready) .final-cta-headline .reveal-word { color/opacity }` para garantir cor quando JS não rodou.

### O que NÃO muda

- Heights `70dvh`, scale (2.2/2.6/3.2), classes `accent-text`, lógica de scroll-zoom — preservados.
- `CTABlock`, `Footer`, `DuranteAnosHeadline` — intactos.
- Hook `useScrollProgressReveal` continua sendo usado nos outros lugares (RevealWords, ganhos) — fallback beneficia todos.

