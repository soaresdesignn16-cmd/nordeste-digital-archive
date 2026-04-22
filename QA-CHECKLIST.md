# QA — Scroll, Reveal & Cursor

Bateria rápida de testes manuais para validar a sensação "premium" (estilo Linear / Vercel / Awwwards) em navegadores e dispositivos diferentes.

**Tempo total estimado:** ~25 min para a matriz completa, ~8 min para o smoke test.

---

## 0. Setup

- [ ] Build de produção rodando (não dev) — `bun run build && bun run preview`
- [ ] DevTools fechado durante os testes de performance (DevTools penaliza FPS)
- [ ] Reduzir motion DESLIGADO no SO antes de começar (testar com motion ativo)
- [ ] Throttle de rede e CPU OFF (testar em condições normais primeiro)

---

## 1. Matriz de cobertura

Marcar ✅ / ❌ por combinação. Mínimo: 1 navegador desktop + 1 mobile real.

| Combo | Smoke | Scroll | Reveal | Cursor | Audience |
|---|---|---|---|---|---|
| Chrome desktop (macOS/Win) | | | | | |
| Safari desktop (macOS) | | | | | |
| Firefox desktop | | | | | |
| Safari iOS (iPhone real) | | | | | n/a cursor |
| Chrome Android (real) | | | | | n/a cursor |
| Chrome DevTools — iPhone 12 Pro emulado | | | | | n/a cursor |

> **iOS Safari** e **Android Chrome real** são obrigatórios — emulador desktop não captura jank de scroll touch nem comportamento da barra de URL.

---

## 2. Smoke test (8 min) — rodar sempre

1. [ ] Abrir `/` — hero aparece em < 1s, sem flash de conteúdo deslocado.
2. [ ] Hero: textos animam de baixo pra cima em cascata (~0/60/120/200/280/360ms), **sem blur**.
3. [ ] Scroll lento até o final — nenhuma seção "trava" ou pula.
4. [ ] Scroll rápido (flick) até o fim e volta — sem jank perceptível.
5. [ ] Cursor desktop gruda no mouse, sem lag de ~80ms (era o bug).
6. [ ] Hover em botão/link — círculo externo do cursor reage instantâneo.
7. [ ] Audience (mobile) — leque abre suave conforme scroll, cards saem em ordem.
8. [ ] Console limpo — zero erros, zero warnings de React.

---

## 3. Scroll — fluidez geral

### 3.1 Desktop (todos os navegadores)
- [ ] Scroll com trackpad: movimento contínuo, sem stutter visível.
- [ ] Scroll com roda do mouse: cada "tick" responde imediatamente.
- [ ] Scroll para cima/baixo várias vezes seguidas — sem acúmulo de lag.
- [ ] Header fica `scrolled` (background opaco) ao passar de 60px, sem piscar.
- [ ] DevTools → Performance: gravar 5s de scroll na home. **FPS médio ≥ 55**, sem long tasks > 50ms recorrentes.

### 3.2 Mobile (real)
- [ ] Scroll com dedo: segue o dedo sem "borracha" extra além do nativo.
- [ ] Flick longo: deceleração nativa do iOS/Android preservada.
- [ ] Pinch-zoom desabilitado funciona (ou tap-zoom não dispara erro).
- [ ] Barra de URL do iOS Safari recolhe normalmente (sem layout shift que trava o pin).
- [ ] Sem "freeze" ao entrar/sair da seção Audience.

### 3.3 Stress
- [ ] DevTools → Performance → CPU 4× slowdown: scroll ainda navegável (>30 FPS).
- [ ] Throttle "Slow 4G" + reload: hero aparece sem layout shift gigante.

---

## 4. Reveal (palavras + blocos)

### 4.1 `.reveal` (blocos)
- [ ] Cada bloco aparece com `translateY(16px) → 0` em **~0.45s**.
- [ ] **Sem blur** durante a transição (regressão do plano anterior).
- [ ] Easing `ease-out` snappy, não "elástico".
- [ ] Scroll de volta para cima: bloco continua visível (não regride salvo IO desativar).

### 4.2 `.reveal-word` (manifesto, palavra-por-palavra)
- [ ] Palavras "acendem" da cor `text-ghost` → `text-primary` quando passam de ~85% da viewport.
- [ ] Transição de 0.22s, **sem rastro** longo.
- [ ] Scroll rápido: palavras acendem em onda, sem ficar "uma por vez atrasada".
- [ ] Scroll de volta: palavras voltam ao estado ghost (deactivate ON).

### 4.3 `.scroll-fade`
- [ ] Bloco entra com translate de 4px, opacidade 0.25 → 1, em 0.28s.
- [ ] Não há "pop" abrupto.

### 4.4 Reduced motion
- [ ] SO/Browser com "Reduce motion" ativo: todas as palavras já chegam ativas, sem animação.
- [ ] `.reveal` ainda fica visível (não fica zerado opacity).

---

## 5. Cursor custom (desktop, hover: fine)

- [ ] Cursor segue o mouse **no mesmo frame** (sem o setTimeout de 80ms).
- [ ] Mover o mouse rápido em zigue-zague: sem rastro/atraso visível.
- [ ] Hover em `<a>`, `<button>`, `[role="button"]`: classe `.hovered` aplicada (mudança visual).
- [ ] Mouseout: classe `.hovered` removida imediatamente.
- [ ] Navegar entre rotas / abrir/fechar menu: cursor continua reagindo a elementos novos (event delegation funcionando, sem precisar do MutationObserver antigo).
- [ ] Touch device: cursor custom **não aparece** (media query `(hover: hover) and (pointer: fine)`).
- [ ] iPad com Magic Keyboard + trackpad: cursor pode aparecer — verificar se não atrapalha.

---

## 6. Audience pin (regressão crítica)

### 6.1 Desktop
- [ ] Entrar na seção: leque abre de 0 → 100% no range `progress 0 → 0.25`.
- [ ] Ordem de saída: lead (centro) → bg-3 (direita) → bg-2 (esquerda) → bg-1 (direita).
- [ ] Cada card: focus (~0.09 do progress) → slide out (~0.09).
- [ ] Sair da seção: tudo limpo, próxima seção começa sem overlap.

### 6.2 Mobile
- [ ] Pin ocupa 280vh (era 360vh) — seção termina mais cedo.
- [ ] Leque abre suave com easing ease-out (chega em ~0.30 do progress).
- [ ] Sem stutter durante o scroll do pin.
- [ ] Cards têm respiro lateral (padding 32px).

### 6.3 Otimizações (verificar via Performance)
- [ ] DevTools → Performance → gravar scroll dentro do pin.
- [ ] **Custom properties só atualizam quando valor muda** (esperado: setProperty raro).
- [ ] **Sem chamadas a `update` quando o pin está fora da viewport** (IO funcionando).
- [ ] FPS ≥ 55 dentro do pin, em mobile real (iPhone 12+ / Android mid-range).

---

## 7. Edge cases

- [ ] Recarregar no meio da página (scroll restoration): reveal volta ao estado correto, sem flash.
- [ ] Resize da janela durante scroll no Audience: pin recalcula `total` (sem travar).
- [ ] Tab em background por 30s e voltar: nada quebrado, animações retomam.
- [ ] Navegação back/forward do browser: estado de scroll consistente.
- [ ] Zoom 150% / 200% no browser: layout não quebra, reveal ainda dispara.

---

## 8. Performance — números de referência

Coletar com `browser--performance_profile` ou DevTools → Performance:

| Métrica | Alvo | Crítico |
|---|---|---|
| FPS médio (scroll home) | ≥ 58 | < 45 |
| FPS dentro do Audience pin | ≥ 55 | < 40 |
| Long tasks > 50ms (em 5s de scroll) | 0 | ≥ 3 |
| LCP | < 2.5s | > 4s |
| CLS | < 0.05 | > 0.15 |
| JS heap após 1min de uso | < 60MB | > 120MB |

---

## 9. Reportar bugs

Para cada falha, registrar:

1. Combo (browser + device + OS).
2. Passos para reproduzir.
3. Esperado vs. observado.
4. Screenshot ou screen recording (mobile real: usar gravação nativa).
5. Console + Network (anexar HAR se relevante).

---

## 10. Sign-off

- [ ] Smoke test passou em pelo menos: 1 desktop Chrome + 1 mobile real (iOS **ou** Android).
- [ ] Matriz completa preenchida.
- [ ] Zero regressões em Audience pin.
- [ ] Cursor instantâneo confirmado.
- [ ] Sem blur em revelações.

**Aprovado por:** ___________  **Data:** ___________
