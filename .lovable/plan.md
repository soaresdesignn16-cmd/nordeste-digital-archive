

## Scroll mais leve, rápido e reativo (estilo premium UI/UX)

Objetivo: matar a sensação de "arrasto"/blur e deixar o feedback do scroll instantâneo, como Linear, Vercel, Awwwards top-tier. Sem mudar layout, conteúdo ou a animação do leque (Audience).

### Mudanças em `src/styles.css`

1. **Remover `filter: blur()` das revelações** (linhas 392–407 e 410–413).
   - `.reveal`: `transform: translateY(32px) → translateY(16px)`, sem blur, duração `0.75s → 0.45s`, easing `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out forte, "snappy").
   - `@keyframes fadeInUp`: remover `filter: blur()`, encurtar translate para `16px`.
   - `.hero-anim`: duração `0.85s → 0.5s`. Delays compactados: `0/60/120/200/280/360ms` (era até 580ms).

2. **Reveal-words mais rápidos** (linhas 1046–1056).
   - `transition: color 0.45s → 0.22s, opacity 0.45s → 0.22s`. Texto acompanha o scroll sem "rastro".
   - Mesma coisa em `.scroll-fade`: `0.5s → 0.28s`, translate `8px → 4px`.

3. **Cortar transições longas espalhadas**.
   - `.highlight-word::after`: `width 0.8s → 0.4s`, sem delay de 0.3s (linha 459).
   - Cards/botões com `0.35s cubic-bezier(0.16,1,0.3,1)` (linhas 537, 585) → `0.22s ease-out`. Mantém o hover suave mas sem inércia.

4. **Reduzir altura do pin do Audience no mobile**: `360vh → 280vh` (linha 738). Menos scroll preso na mesma seção = sensação geral de site mais ágil. Ranges das fases já são proporcionais (`progress / total`), nada quebra.

### Mudanças em `src/routes/index.tsx`

5. **Remover o atraso artificial do cursor custom** (linhas 236–243).
   - Trocar o `setTimeout(80ms)` por movimento direto do `outer` (segue o mouse no mesmo frame). Cursor premium é instantâneo, não "perseguidor lento".

6. **Otimizar `CustomCursor`**:
   - Trocar `MutationObserver` em `document.body` (subtree completo) por **event delegation**: um único listener `mouseover`/`mouseout` no `document` que checa `e.target.closest("a, button, [role='button']")`. Elimina re-binds constantes durante renders do React.

7. **Tornar `useScrollProgressReveal` mais reativo** (linhas 81–149).
   - `activeRatio: 0.75 → 0.85` (palavras "acendem" mais cedo, não esperam chegar quase no topo).
   - Já usa rAF + IO — manter.

8. **Throttle do header `scrolled`** (linhas 586–591): envolver em rAF pra não disparar setState a cada pixel de scroll.

### O que NÃO muda

- Animação do leque (Audience cards) — ordem direita/esquerda/direita, rotações, easings dela: intactos.
- Layout, cores, tipografia, conteúdo.
- VSL, accordion, navegação, formulários.
- `prefers-reduced-motion` e `low-gpu` continuam funcionando.

### Resultado esperado

- Scroll responde no frame, sem blur custoso na GPU.
- Revelações ~40% mais curtas → sensação de "site que acompanha você" em vez de "site que termina depois de você".
- Cursor desktop gruda no mouse (estilo Vercel/Linear).
- Menos handlers e menos work por scroll event.

### Arquivos editados

- `src/styles.css` — durações, easings, remoção de blur, altura mobile do pin.
- `src/routes/index.tsx` — cursor sem delay + delegation, header throttled, `activeRatio` reveal.

