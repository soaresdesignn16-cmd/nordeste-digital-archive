

## Plano — Reconstruir a seção "Chegou a hora" do zero (efeito sol/brasa em CSS puro)

Analisando as 5 imagens de referência, fica claro o que o usuário quer:

1. **IMG-0048** = só o fundo: preto à esquerda → grande sol laranja/amarelo brilhante à direita (puro glow radial)
2. **IMG-0049** = só a foto do idealizador, recortada limpa em fundo preto
3. **IMG-0047** = foto do idealizador sobreposta ao fundo da imagem 0048
4. **IMG-0043 / 0050** = composição final desktop: texto à esquerda + sol no centro-direita + foto sobreposta
5. **IMG-0046** = versão mobile (mesma ideia, foto à direita-baixo)

Vou **reconstruir tudo em CSS puro** — sem usar nenhuma das imagens de referência como fundo. O "sol" laranja vai ser feito com **gradientes radiais empilhados**, e a foto atual (`founder-hero.jpg`) entra por cima.

### Composição visual (camada por camada)

```text
Camada 4 (frente):  [ Foto do idealizador, recortada, à direita ]
Camada 3:           [ Sol/brasa CSS — núcleo amarelo intenso ]
Camada 2:           [ Halo laranja médio + halo externo escuro ]
Camada 1 (fundo):   [ Preto sólido com leve textura escura ]

         ┌──────────────────────────────────────────────────┐
         │  ─── O MOVIMENTO                                 │
         │                                  ☀ ← sol CSS    │
         │  Chegou a hora do Brasil       ░░░▒▒▓▓██▓▓▒▒░░  │
         │  conhecer                     ░░▒▓██🟡██▓▒░░    │
         │  OS NOVOS                     ░▒▓██🟡🟡██▓▒░    │
         │  NORDESTINOS  (laranja)       ░▒▓██🟠🟠██▓▒░ ← foto
         │                                ░▒▓██🟠██▓▒░     │ aqui
         │  texto descritivo...            ░░▒▓██▓▒░░       │
         │                                                  │
         │  [ INICIAR AVALIAÇÃO ▶ ]                        │
         └──────────────────────────────────────────────────┘
```

### Mudanças em `src/routes/index.tsx` — função `HeroIntro` (linhas 454–525)

**1. Reescrever todo o bloco do `<Reveal>` com nova estrutura de camadas:**

- **Container externo**: `relative overflow-hidden bg-[#0a0606]` com `min-h-[640px] md:min-h-[680px]`.
- **Camada do "sol" (puro CSS)** — div absoluta posicionada à direita, criada com 3 gradientes radiais empilhados via `background-image`:
  ```
  radial-gradient(circle at 70% 55%, #FFD24A 0%, #FFA528 8%, transparent 18%),  /* núcleo amarelo intenso */
  radial-gradient(circle at 70% 55%, #E07A28 0%, #A04510 25%, transparent 45%), /* halo laranja médio */
  radial-gradient(circle at 70% 55%, #5a2410 0%, transparent 70%)               /* halo externo marrom-escuro */
  ```
  - `filter: blur(8px)` pra suavizar as bordas dos círculos.
  - Mobile: sol mais centralizado e menor (`w-[80%] right-[-10%]`); desktop: sol maior à direita (`w-[60%] right-[-5%]`).
  - Animação sutil `pulse-sun 6s ease-in-out infinite` (escala de 1.0→1.04 e opacidade 0.95→1.0) → dá vida sem distrair.

- **Camada de vinheta escura** — gradiente preto radial nas bordas pra fundir o sol no fundo:
  `bg-[radial-gradient(ellipse_at_70%_55%,transparent_30%,#0a0606_85%)]`.

- **Foto do idealizador** — sobreposta ao sol, à direita:
  - Desktop: `absolute right-0 bottom-0 w-[55%] h-[105%] object-contain object-bottom-right`.
  - Mobile: `absolute right-[-10%] bottom-0 w-[85%] h-[60%] object-contain object-bottom-right`.
  - Máscara mais sutil que a atual (só nas bordas externas, pra não apagar o rosto): `[mask-image:linear-gradient(to_left,black_60%,transparent_100%)]` no desktop, mantendo o rosto totalmente visível e fundindo apenas a lateral esquerda da foto no fundo.

- **Texto à esquerda** — bloco posicionado em coluna 1 do grid, alinhado à esquerda:
  - Pill "O MOVIMENTO" laranja com linha decorativa à esquerda (igual à referência: `─── O MOVIMENTO`).
  - "Chegou a hora do Brasil conhecer" em branco, peso médio.
  - "OS NOVOS / NORDESTINOS" em laranja `#E07A28` Poppins Black.
  - Parágrafo descritivo com palavras-chave em itálico negrito.
  - **CTA "INICIAR AVALIAÇÃO ▶"** abaixo do texto (usando o `BrutalistButton` existente com `.btn-gold` que já foi padronizado) — isso é novo, antes não tinha CTA aqui.

**2. Pill "O MOVIMENTO" estilizado** — substituir o `<SectionPill>` por uma versão com linha decorativa:
```jsx
<div className="flex items-center gap-3">
  <span className="h-px w-10 bg-primary-custom" />
  <span className="text-primary-custom uppercase tracking-[0.3em] text-xs font-semibold">O Movimento</span>
</div>
```

**3. Remover** o card `TiltCard` "Você não precisa de mais clientes / Você precisa de clientes melhores" (linhas 509–520) — não aparece nas referências dessa seção. Pode ser movido pra outra seção depois se o usuário quiser, mas pra ficar igual às fotos sai daqui.

**4. Remover** o glow externo antigo (`absolute right-[-10%] ... blur-[120px]` linha 462–465) — substituído pelo sol CSS novo.

### Mudanças em `src/styles.css`

Adicionar a keyframe da pulsação do sol:
```css
@keyframes pulse-sun {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50%      { transform: scale(1.04); opacity: 1; }
}
.animate-pulse-sun { animation: pulse-sun 6s ease-in-out infinite; }
```

### Resultado

A seção fica **idêntica às referências**: fundo preto profundo com um sol laranja-amarelo brilhante atrás do idealizador, texto à esquerda alinhado, CTA logo abaixo. Tudo reconstruído em CSS — nenhuma das imagens enviadas é usada como asset, só servem como referência visual. A foto atual do idealizador (`founder-hero.jpg`) permanece, agora posicionada com máscara lateral suave pra fundir naturalmente no glow.

### Arquivos alterados

- `src/routes/index.tsx` — reescrita da função `HeroIntro` (linhas 454–525), removendo o TiltCard final.
- `src/styles.css` — adicionar keyframe `pulse-sun` e classe utilitária.

