

## Efeito Scroll-Zoom Frase a Frase — Seção "Durante anos tentaram contar a nossa história"

Transformar `DuranteAnosHeadline()` (linhas 1195–1215 de `src/routes/index.tsx`) em uma seção pinned com efeito de **parallax de escala** atrelado ao scroll: cada frase entra grande, encolhe e desaparece "indo para o fundo" antes da próxima frase aparecer.

### Comportamento

Três frases em sequência, controladas por scroll progress:

1. `Durante anos tentaram` (frase 1)
2. `contar a nossa história.` (frase 2, com `nossa história` em accent)
3. `Agora é a nossa vez.` (frase 3, accent)

Para cada frase: começa em `scale: 1.6, opacity: 0`, vai a `scale: 1, opacity: 1` (estado neutro centralizado), depois encolhe para `scale: 0.5, opacity: 0` (recua para o fundo). Curvas com easing suave (smoothstep), sem motion blur.

```text
progress  0 ─── 0.33 ─── 0.66 ─── 1
frase1    █████░░░░░░░░░░░░░░░░░░░
frase2    ░░░░░██████░░░░░░░░░░░░░
frase3    ░░░░░░░░░░░░░██████░░░░░
```

Cada frase tem 3 fases dentro da sua janela: enter (grande+invisível → tamanho neutro), hold curto (legível), exit (encolhe+fade para o fundo). Levemente sobrepostas para fluidez.

### Implementação

**Sem nova dependência** — segue padrão já usado em `AudienceSection` (pin via `position: sticky` + `useScroll`/`requestAnimationFrame` calculando progress local). Não introduz GSAP/Framer (o projeto não usa, e o pattern de scroll já existe).

Estrutura nova:

```tsx
<section className="durante-anos-pin">
  <div className="durante-anos-stage">           // sticky, h:100vh, flex center
    <h2 className="durante-anos-phrase" data-i="0">Durante anos tentaram</h2>
    <h2 className="durante-anos-phrase" data-i="1">contar a <span class="highlight-word">nossa história.</span></h2>
    <h2 className="durante-anos-phrase durante-anos-phrase--accent" data-i="2">Agora é a nossa vez.</h2>
  </div>
</section>
```

- `.durante-anos-pin`: `position: relative; height: 280vh;` (desktop) / `220vh` (mobile) — distância scrollável que dá tempo para as 3 frases.
- `.durante-anos-stage`: `position: sticky; top: 0; height: 100vh; display: flex; align-items: center; justify-content: center;`
- `.durante-anos-phrase`: `position: absolute; will-change: transform, opacity; transform: scale(var(--s, 1)); opacity: var(--o, 0);` — todas empilhadas no centro.

Hook de scroll (inline na função, igual ao `AudienceSection`):
- `useEffect` com listener `scroll` + `rAF` calcula `progress = (window.scrollY - sectionTop) / (sectionHeight - vh)`, clampado 0–1.
- Para cada frase `i ∈ {0,1,2}`, janela: `start = i / 3`, `end = (i+1) / 3`, com overlap de `0.05` nas bordas para crossfade.
- Dentro da janela calcula `local = (progress - start) / (end - start)`:
  - `0 → 0.4`: enter — `scale 1.6 → 1`, `opacity 0 → 1`
  - `0.4 → 0.6`: hold — `scale 1`, `opacity 1`
  - `0.6 → 1`: exit — `scale 1 → 0.5`, `opacity 1 → 0`
- Aplica via CSS vars `--s` e `--o` em cada `<h2>` por `ref`. Easing smoothstep `t*t*(3-2t)` (mesmo já usado no projeto).

### Performance

- Sem `filter: blur`. Apenas `transform: scale` + `opacity` (composited, GPU-friendly).
- `rAF` throttle, `passive: true` no listener.
- `prefers-reduced-motion`: desativa o pin e renderiza as 3 frases empilhadas estáticas (`scale: 1, opacity: 1`).
- Mobile: mesma lógica, altura reduzida (220vh) e `font-size` clamp menor.

### Estilos novos em `src/styles.css`

Bloco `.durante-anos-pin`, `.durante-anos-stage`, `.durante-anos-phrase`, `.durante-anos-phrase--accent` com tipografia herdando de `.typo-display` (mantém `clamp(48px, 7vw, 88px)`).

### O que NÃO muda

- Seções vizinhas (`FounderSection` antes, `FinalCTA` depois) — intactas.
- `Footer`, header, CTAs.
- Cores e tokens (`var(--accent)`, `.highlight-word`).
- A frase "Agora é a nossa vez de ocupar o lugar certo." dentro do `FinalCTA` (linha 1264) permanece como assinatura final.

### Arquivos editados

- `src/routes/index.tsx` — reescrever `DuranteAnosHeadline()` com hook de scroll e três frases pinned.
- `src/styles.css` — adicionar bloco `.durante-anos-*` (~30 linhas).

