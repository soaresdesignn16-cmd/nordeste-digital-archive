

## Plano — Pós-VSL: "Role para baixo" → carregamento contínuo na mesma página

### Comportamento atual (o que tira)
Hoje, quando os 30s acabam:
1. Aparece "Liberando acesso…"
2. Tela inteira vira o **brand-loader fullscreen** (overlay preto com "ONN" preenchendo + barra 0-100%)
3. Quando bate 100%, troca pra tela do conteúdo

Isso **parece que abriu outra página** — é o que você quer eliminar.

### Comportamento novo (o que faz)

**Etapa 1 — VSL acaba (≥30s):**
- Em vez de "Liberando acesso…" + loader fullscreen automático, aparece **logo abaixo da VSL**, dentro da mesma seção:
  - Texto chamativo de tamanho médio: **"Role para baixo"** (estilo dourado, com seta animada ↓ pulsando suavemente)
  - Subtexto pequeno: "O conteúdo foi liberado"
- A página **continua a mesma** — sem overlay, sem troca de tela.

**Etapa 2 — Lead rola para baixo:**
- Ao detectar o primeiro scroll significativo (ex: 80px abaixo do topo da VSL), **dispara o loader inline**:
  - Aparece **uma seção de altura ~100vh** logo após a VSL, com o mesmo visual atual do loader (ONN gigante + barra 0→100% + "Carregando experiência")
  - Mas agora **inline, não fullscreen** — faz parte do fluxo natural do scroll
  - A barra anima 0→100% em ~1.5s

**Etapa 3 — Loader chega a 100%:**
- A seção do loader **dá fade-out suave** (ou colapsa altura) e o conteúdo do site (`HeroIntro`, `StepsSection`, etc.) aparece logo abaixo, **na mesma rolagem contínua**.
- Sensação final: tudo numa página só, sem corte, sem flash de "outra página".

### Mudanças técnicas

**Arquivo: `src/routes/index.tsx`**

1. **Novo state**: `scrollPrompt` (boolean) — vira `true` quando VSL termina
2. **Modificar `unlockContent()`**: em vez de disparar o loader imediatamente, só seta `scrollPrompt = true` (mostra o "Role para baixo")
3. **Adicionar `useEffect` de scroll**: quando `scrollPrompt === true` e o usuário rolar > 80px, dispara o `setIsLoading(true)` que começa a barra 0→100%
4. **Trocar bloco de "Liberando acesso…"** por:
   ```
   - Ícone seta ↓ pulsante grande
   - "Role para baixo" (clamp 28-40px, peso 900, gradient dourado)
   - "O conteúdo foi liberado" (cream-muted pequeno)
   ```
5. **Mudar o loader de fullscreen → inline**:
   - Trocar `fixed inset-0 z-[100]` por uma `<section>` normal (`min-h-[100svh] flex flex-col items-center justify-center`)
   - Renderizar **junto** com a VSL (não substituir): VSL fica em cima, loader-section fica logo abaixo
6. **Quando `isUnlocked === true`**: a loader-section sai com fade/collapse e o conteúdo principal fica visível na sequência

**Estrutura do render quando `vslStatus === "finished"`:**
```
<VslNavbar />
<section id="vsl-gate"> ... VSL com prompt "Role para baixo" embaixo ... </section>
{scrollPrompt && (
  <section id="brand-loader-inline"> ... ONN + barra 0-100% ... </section>
)}
{isUnlocked && <main>...HeroIntro, Steps, Audience...</main>}
```

### Mobile (488px atual)
- "Role para baixo": tamanho responsivo (clamp 24-36px), seta 32px, com bom espaçamento (`mt-8 mb-6`)
- Loader inline mantém `min-h-[100svh]` pra ocupar a tela e forçar sensação de carregamento real

### Acessibilidade
- Seta pulsante respeita `prefers-reduced-motion`
- Loader inline tem `aria-live="polite"` + `aria-busy`

### Garantias
- ✅ Visual atual do loader (ONN + barra) **100% preservado** — só muda de fullscreen pra inline
- ✅ VSL e fluxo dos 30s **intactos**
- ✅ Sem troca de página — tudo num scroll contínuo
- ✅ Mobile e desktop
- ✅ Funciona mesmo se o usuário rolar antes de terminar a VSL (o prompt só aparece após `finished`)

### Arquivos afetados
- `src/routes/index.tsx` — lógica do gate, novo prompt, loader inline

