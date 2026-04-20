

## Plano — VSL como landing page (single-page contínua, sem fundo, loader 1x)

### O que muda

**1. Remover o fundo da VSL**
Tira completamente a `<div>` com `backgroundImage: url(${heroBgFlame})` e o overlay escuro extra na seção `#vsl-gate`. Mantém só o glow laranja central (`MouseParallax` com blur) que já existia antes — visual limpo como no início. Também remove o `preload` da imagem `heroBgFlame` no `head()` da rota (não é mais usada na primeira dobra).

**2. VSL permanece no DOM como parte da landing page**
Hoje, quando `isUnlocked === true`, o código faz `return` antecipado e desmonta a VSL inteira, renderizando só o `<main>` com `HeroIntro`, `Steps`, etc. Isso quebra a sensação de página única.

Novo comportamento: **um único return** que renderiza sempre, na ordem:
```
<VslNavbar />  (ou Navbar dependendo do estado — ver item 4)
<section id="vsl-gate"> ...VSL com prompt "Role para baixo"... </section>
{isLoading && <section id="brand-loader-inline">...</section>}
{isUnlocked && (
  <>
    <PremiumBackground />
    <main>
      <HeroIntro />
      <StepsSection />
      ...
      <Footer />
    </main>
  </>
)}
```
Assim, depois de carregar, o lead pode rolar pra cima e **continua vendo a VSL no topo da mesma página**, exatamente como uma landing page.

**3. Remover o auto-scroll-to-top no unlock**
O `useEffect` que faz `window.scrollTo({ top: 0 })` quando `isUnlocked` vira `true` precisa sair. Em vez disso, quando o loader chega a 100%, rola suavemente até o início do `<main>` (`#hero-intro`), preservando a VSL acima. Ao voltar pra cima, o lead encontra a VSL intacta.

**4. Loader dispara só UMA vez**
Hoje, o `useEffect` de detecção de scroll já tem guarda `if (!scrollPrompt || isLoading || isUnlocked) return` — então uma vez `isUnlocked === true`, o listener nunca mais dispara. Ótimo. Só precisa garantir que `scrollPrompt` permaneça `true` (não resetar) e que `isLoading` não volte a ser disparado. Já está coberto pelas guardas — apenas confirmar que não há regressão.

**5. Navbar**
- Antes do unlock: continua mostrando `VslNavbar` (logo grande, CTA "Solicitar Avaliação").
- Depois do unlock: troca para `Navbar` (compacto), mas como a VSL ainda está no DOM em cima, o `Navbar` fixo no topo cobre os dois conteúdos. O CTA do `Navbar` aponta para `#cta-final` (final da página) — comportamento de landing.

**6. Loader inline**
Continua como `<section>` inline (não fullscreen), aparece entre a VSL e o conteúdo principal, e some quando `isUnlocked` vira `true` (ao desmontar, o conteúdo aparece logo abaixo, mantendo o scroll fluido).

### Arquivo afetado
- `src/routes/index.tsx` — unificar o return, remover background da VSL, remover scroll-to-top, ajustar navbar trocando após unlock.

### Garantias
- ✅ VSL sem fundo (limpa como antes)
- ✅ Tudo em uma página só — pode rolar pra cima depois e ver a VSL
- ✅ Loader só roda na primeira descida; rolar pra cima depois não reinicia nada
- ✅ Sensação de landing page contínua: VSL → Loader (1x) → Conteúdo → Footer

