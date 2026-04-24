

# Corrigir seção "Durante anos" — pin firme, sem deixar texto subir

## Diagnóstico (verificado no código)

`.durante-anos-pin` tem `height: 380svh` e `.durante-anos-stage` é `position: sticky; top: 0; height: 100svh`. Isso significa:

- Área total de scroll dentro da seção: `380svh − 100svh = 280svh` de "trilho" para a animação.
- A animação JS divide o progresso em 3 frases (N=3), cada uma ocupa ~33% do progresso.
- A última frase (`Agora é a nossa vez`) tem `outStart: 1.01` — ou seja, **nunca sai**: fica em `opacity: 1` até `local === 1`, que coincide exatamente com `progress === 1` (fim absoluto do pin).
- **No instante em que `progress` chega a 1, o sticky solta e o `.durante-anos-stage` começa a subir junto com o scroll** — a última frase ainda está visível em opacity 1, então o usuário vê o texto deslizando pra cima e em seguida só o fundo escuro até a próxima seção entrar.

Esse é exatamente o bug descrito: "as palavras sobem e fica só o escuro".

## Solução

Reservar uma **fase de saída pinada** ANTES de o sticky soltar. A última frase fade-out termina enquanto o sticky ainda está grudado, e quando o pin libera, a tela já está limpa (escura) por **um instante curto** antes da próxima seção entrar — sem o efeito de "texto fugindo pra cima".

### 1. `src/routes/index.tsx` — `DuranteAnosHeadline` (useEffect)

Reorganizar o timeline para reservar os últimos 15% do progresso só para o fade-out da frase final:

- Dividir os 3 segmentos em **0 → 0.85** do progresso (cada frase ocupa ~28%), deixando **0.85 → 1.0** como "tail" onde a última frase já saiu (opacity 0) mas o pin ainda segura.
- Para a última frase: `inEnd: 0.30`, `outStart: 0.70` (mapeado dentro do segmento). Assim ela entra, fica visível ~40% do segmento dela, e sai suavemente — terminando o fade ANTES do pin soltar.
- Remover a lógica especial `isLast ? 1.01 : 0.6` que causa o "trava em opacity 1 até o fim".

Pseudo-código do novo cálculo:

```ts
const N = 3;
const tail = 0.15;            // últimos 15% só pin segurando, frase já saiu
const usable = 1 - tail;       // 0.85 do progresso para as 3 frases
const overlap = 0.04;
for (let i = 0; i < N; i++) {
  const start = (i / N) * usable - (i > 0 ? overlap : 0);
  const end = ((i + 1) / N) * usable + (i < N - 1 ? overlap : 0);
  const local = (progress - start) / (end - start);
  // mesmo smoothstep, sem caso especial para isLast:
  // inEnd = 0.30, outStart = 0.70
  ...
}
```

### 2. `src/styles.css`

- Reduzir `.durante-anos-pin` de `380svh` → **`260svh`** (desktop) e `320svh` → **`230svh`** (mobile). Trilho de scroll fica `160svh` desktop / `130svh` mobile — suficiente para 3 frases respirarem sem cansar.
- Adicionar `background: var(--bg)` em `.durante-anos-stage` para evitar qualquer translucidez visual quando soltar.
- Adicionar `contain: paint` em `.durante-anos-pin` para isolar o stacking context e evitar que o sticky vaze visualmente.
- Garantir que a próxima seção (`#sobre` ou o que vier depois) não tenha `margin-top` negativo nem sobreposição.

### 3. Resultado esperado

- Usuário rola → frase 1 entra/sai, frase 2 entra/sai, frase 3 entra → **sai com fade enquanto ainda está pinada** → pin libera com a tela já vazia → próxima seção entra normalmente.
- Nada de texto "subindo junto com o scroll".
- Trilho de scroll ~38% mais curto, então a sensação de "travou" some.

## Arquivos editados

- `src/routes/index.tsx` — reescrever o cálculo do `useEffect` de `DuranteAnosHeadline` (linhas 1487–1576) com `tail` e remoção do caso especial `isLast`.
- `src/styles.css` — `.durante-anos-pin` height (linhas 1823–1829 e 1870–1878) + `background` em `.durante-anos-stage` (linhas 1831–1841).

Nenhum texto, cor ou ícone é alterado.

