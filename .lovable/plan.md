
O usuário quer adicionar efeito parallax em todo o site. Já existe um `ParallaxLayer` no `src/routes/index.tsx` (mencionado em mensagens anteriores). Preciso verificar o estado atual para reforçar/expandir o parallax em todas as seções.

## Plano: Parallax cinematográfico em toda a landing page

Vou intensificar e aplicar o efeito parallax de forma consistente em todas as seções do site, criando profundidade cinematográfica sem comprometer performance ou legibilidade.

### 1. Sistema de parallax unificado
- Refinar o componente `ParallaxLayer` existente para suportar múltiplas velocidades (slow / medium / fast) e direções (up / down)
- Usar `transform: translate3d()` com `will-change: transform` para aceleração GPU
- Throttle via `requestAnimationFrame` para 60fps suaves
- Detectar `prefers-reduced-motion` e desativar automaticamente para acessibilidade

### 2. Camadas de profundidade por seção
Cada seção ganhará 3 camadas parallax:
- **Background layer (lento, -0.3x)**: gradientes radiais dourados, noise, grid sutil
- **Mid layer (médio, -0.15x)**: ghost numbers, decorações, blockquotes
- **Foreground layer (rápido, +0.05x ou estático)**: títulos, CTAs, conteúdo principal

### 3. Aplicação por seção
- **Hero/VSL**: VSL frame com leve translate (foreground), glow dourado se movendo mais lento (background)
- **HeroIntro**: Headline com parallax suave, ghost decoração ao fundo
- **StepsSection**: Ghost numbers (01/02/03/04) movendo a -0.4x — efeito editorial dramático
- **AudienceSection**: Cards com parallax escalonado por índice
- **FounderSection**: Logo central com glow parallax, blockquote em camada média
- **ImpactSection**: Checks foreground, gradientes background lentos
- **FinalCTA**: Background radial com forte parallax, CTA fixo no foreground
- **Footer**: Tags em parallax leve

### 4. Microinterações complementares
- **Mouse parallax sutil** no hero (logo ONN reage 5-10px ao movimento do mouse) — opcional, só desktop
- **Tilt 3D leve** nos cards premium ao hover (rotateX/rotateY 2-3deg seguindo cursor)
- Manter as transições `.animate-section-rise` já existentes

### 5. Performance
- IntersectionObserver para só animar seções visíveis
- `transform` apenas (nunca `top`/`left`)
- Desabilitar parallax abaixo de 768px se causar jank (testar)
- Respeitar `prefers-reduced-motion: reduce`

### Arquivos afetados
- `src/routes/index.tsx` — refinar `ParallaxLayer`, adicionar hook `useMouseParallax` (hero), aplicar camadas em todas as seções
- `src/styles.css` — adicionar utilitários `.parallax-slow`, `.parallax-mid`, `.parallax-fast` e `@media (prefers-reduced-motion)` global

### Garantias
- ✅ Copy 100% preservada
- ✅ Estrutura/hierarquia preservada
- ✅ Paleta dourada e estilos atuais preservados
- ✅ Acessibilidade respeitada (reduced motion)
- ✅ Performance GPU-accelerated, 60fps
