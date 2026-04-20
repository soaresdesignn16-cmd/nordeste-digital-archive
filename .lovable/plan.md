

## Plano — Limpar topo da VSL e recriar a marca "ONN" sobre o fundo

### O que muda
- A **navbar fixa preta no topo** (com ícone da logo + texto "ONN") será **removida** quando o lead estiver na VSL.
- A marca "ONN" que aparece grande na parte de baixo da tela (hoje embutida na imagem `vsl-bg.png`) será **recriada como elemento HTML** sobre o fundo, usando **a mesma tipografia da navbar antiga** (`font-black`, `tracking-tight`, `uppercase`, branca).
- A imagem de fundo permanece, mas deixaremos a marca HTML por cima dela na mesma posição/tamanho aparente — assim podemos controlar a tipografia.

### Mudanças técnicas

**`src/routes/index.tsx`**
1. Trocar `{isUnlocked ? <Navbar /> : <VslNavbar />}` por `{isUnlocked && <Navbar />}` — sem navbar durante a VSL.
2. Remover a função `VslNavbar` (não é mais usada).
3. Ajustar o padding do topo da seção `#vsl-gate`: `pt-36 md:pt-32` → `pt-12 md:pt-16` (sem navbar não precisa do espaço).
4. Adicionar dentro da seção `.vsl-hero`, logo antes do conteúdo central, um novo elemento:
   ```tsx
   <div className="vsl-hero__brand" aria-hidden="true">
     <span>ONN</span>
   </div>
   ```
   Posicionado absolutamente no rodapé da seção, centralizado, com a tipografia da navbar antiga: `font-black tracking-tight uppercase text-white`, tamanho responsivo grande (`clamp(120px, 28vw, 320px)`), opacidade média para parecer marca d'água sobre o fundo.

**`src/styles.css`**
- Adicionar regra `.vsl-hero__brand` com:
  - `position: absolute; bottom: 4%; left: 50%; transform: translateX(-50%);`
  - `font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase;`
  - `font-size: clamp(120px, 28vw, 320px); line-height: 0.85;`
  - `color: rgba(255,255,255,0.92);`
  - `pointer-events: none; z-index: 2;` (acima do fundo, abaixo do conteúdo `z-10`)
- Corrigir também o erro de hidratação do React (className mismatch entre `vsl-hero__watermark` antigo e o novo wrapper) garantindo que o markup seja consistente.

### Resultado
- Topo da VSL completamente limpo, sem navbar.
- A marca "ONN" continua aparecendo grande no rodapé do hero, mas agora renderizada em HTML com a mesma tipografia que a navbar usava — controlável, nítida em qualquer densidade de tela, e consistente com o resto do site.

