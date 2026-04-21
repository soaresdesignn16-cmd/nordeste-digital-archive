

## Plano — Efeito 3D nos cilindros (pílulas) antes do CTA final

A seção `FinalCTA` tem 6 pílulas ("Cobrar mais", "Atender menos", "Ter mais tempo", "Ser reconhecido", "Posicionamento real", "Autoridade construída") que aparecem logo depois da manchete *"Durante anos tentaram contar a nossa história"*. Hoje elas só fazem fade-in e ficam estáticas — vou transformá-las em **cilindros vivos com profundidade** pra dar respiração visual antes da CTA final.

### O efeito (referência do vídeo Pinterest)

Cada pílula vai parecer um **cilindro metálico flutuando**, com 3 camadas de movimento:

1. **Levitação contínua** — sobe e desce 6px num ciclo de 3.5s, cada pílula com delay diferente (0.2s entre elas) → cria onda orgânica.
2. **Brilho especular viajando** — uma faixa de luz branca translúcida atravessa a superfície da esquerda pra direita a cada 4s, simulando reflexo metálico de cilindro polido.
3. **Inclinação 3D no hover/scroll** — leve `rotateX(8deg)` permanente + `rotateY` reagindo ao mouse (desktop). Sombra projetada embaixo pulsa junto com a levitação, dando ilusão de "objeto solto no espaço".

```text
ANTES (pílula chapada):              DEPOIS (cilindro 3D flutuante):
                                      ╱─────────────╲   ← brilho viajando
  [• COBRAR MAIS]                    │ ●  COBRAR MAIS │  ← inclinada, com volume
                                      ╲─────────────╱
   sombra simples                       ▒▒▒▒▒▒▒▒▒▒▒    ← sombra que pulsa
                                       (sobe/desce 6px)
```

### Mudanças técnicas

**1. `src/styles.css` — classe `.cta-pill` (linhas 599–624)**

- Adicionar `transform-style: preserve-3d` + `perspective: 600px` no container pai.
- Aplicar `rotateX(6deg)` permanente pra dar inclinação de cilindro visto de cima.
- Gradiente reforçado com 3 stops pra sugerir curvatura cilíndrica:
  `linear-gradient(180deg, #F5A24A 0%, #E07A28 50%, #A04D12 100%)`.
- Sombra dupla: sombra projetada abaixo (`0 24px 40px -12px`) + glow ambiente.
- Pseudo-elemento `::before` com faixa branca translúcida em `skewX(-20deg)` + animação `pill-shimmer 4s infinite` (delay escalonado por pílula via `--shimmer-delay`).
- Pseudo-elemento `::after` com gradiente top→bottom pra simular highlight de cilindro polido (linha de luz no topo).
- `overflow: hidden` no pill pra clipar o shimmer.

**2. Novas keyframes em `src/styles.css`**

```css
@keyframes pill-float {
  0%, 100% { transform: perspective(600px) rotateX(6deg) translateY(0); }
  50%      { transform: perspective(600px) rotateX(6deg) translateY(-6px); }
}
@keyframes pill-shimmer {
  0%, 60%  { transform: translateX(-120%) skewX(-20deg); }
  100%     { transform: translateX(220%) skewX(-20deg); }
}
@keyframes pill-shadow-pulse {
  0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
  50%      { opacity: 0.8;  transform: translateX(-50%) scale(1.08); }
}
```

**3. `src/routes/index.tsx` — `FinalCTA` (linhas 849–865)**

- Adicionar wrapper `<div className="pill-3d-stage">` em volta da pílula pra aplicar `perspective` e a sombra projetada (div absoluta separada animada com `pill-shadow-pulse`).
- Passar `style={{ "--shimmer-delay": ${i * 0.6}s, "--float-delay": ${i * 0.2}s }}` em cada pílula → cada cilindro brilha e flutua em momentos levemente diferentes (efeito onda).
- Manter o `motion.div` de entrada (fade-in inicial), animação contínua via CSS depois.

### Resultado

As 6 pílulas deixam de ser tags chapadas e viram **cilindros vivos** que respiram, refletem luz e flutuam — exatamente o efeito de profundidade que o vídeo de referência mostra. Cria tensão visual e movimento crescente que conduz naturalmente o olho até a CTA final ("Solicitar minha avaliação estratégica"), aumentando o impacto do fechamento.

### Arquivos alterados

- `src/styles.css` — atualizar `.cta-pill`, adicionar keyframes e `.pill-3d-stage`.
- `src/routes/index.tsx` — wrapper das pílulas no `FinalCTA` com delays escalonados.

