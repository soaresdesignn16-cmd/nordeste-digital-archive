# Corrigir scroll reverso na seção "Durante anos"

## Problema (verificado no código)

Quando o usuário desce pela seção, a animação completa, `unlockScroll(1)` é chamado e a página avança para a próxima seção (CTA). Porém, ao tentar **subir** de volta, a trava reaparece e o scroll fica preso porque:

1. `progressRef.current` permanece em `1` após a conclusão. Quando o usuário rola para cima e a seção entra em vista de novo, `shouldLock(delta < 0)` retorna `true` (rect.top ≤ 12% e rect.bottom ≥ 42%), e `lockScroll()` é chamado — mas como o progresso já está em `1`, a animação fica no estado final ("Agora é a nossa vez" desaparecido) e o usuário precisa rolar pra cima a animação inteira de novo só para conseguir sair.
2. Pior: na linha 1386 `--durante-anos-lock-distance` é setado, mas em `driveProgress` (linha 1509) ainda se usa `Math.max(viewportHeight * 1.05, 620)` em pixels, e como `unlockScroll(1)` move a página para `nextSection.top + 2`, ao subir 2px a trava engata novamente sem dar espaço para escapar.
3. `shouldLock` para `delta < 0` exige `rect.bottom >= viewportHeight * 0.42`. Quando vindo de baixo (CTA), a seção entra com `rect.bottom` crescendo a partir de 0 → assim que passa de 42% da viewport, trava — o que é correto, mas ao travar o progresso deveria ser **1** (estado final visível) e ao rolar pra cima deveria reverter a animação até `0` e liberar para cima. Hoje a reversão funciona em teoria (`driveProgress` aceita delta negativo), mas o problema é que o usuário rolou só um pouquinho e já fica preso na animação inversa inteira antes de poder ir para Seletividade.

## Solução

**Permitir desbloqueio também na direção reversa, simétrico ao que já existe pra frente**, e evitar re-travamento imediato logo após desbloquear.

### 1. Re-travamento ao subir após sair pra frente (causa #1 e #2)

Adicionar um "cooldown" curto após `unlockScroll`: durante ~400ms ignora `shouldLock`, dando tempo do scroll natural sair da zona de detecção. Sem isso, o `scrollTo(nextTop + 2)` deixa a seção a apenas 2px de distância, e qualquer wheel pra cima re-trava.

```ts
const unlockedUntilRef = useRef(0);

const unlockScroll = (direction) => {
  // ...código atual...
  unlockedUntilRef.current = performance.now() + 400;
};

const shouldLock = (delta) => {
  if (lockedRef.current) return true;
  if (performance.now() < unlockedUntilRef.current) return false;
  // ...resto igual...
};
```

E aumentar o offset de saída de `+2` para `+ viewportHeight * 0.05` (≈ 5% da tela), para o usuário ter espaço real de scroll antes de re-entrar na zona de detecção.

### 2. Desbloqueio simétrico ao subir (causa #3)

No `driveProgress` já existe a lógica para `next <= 0.001 && delta < 0` → chama `unlockScroll(-1)`. Está correta. Mas falta o caso espelhado em `tickSmoothing`: hoje só desbloqueia para frente (`target >= 0.999`), nunca para trás após o lerp suavizar. Adicionar:

```ts
if (target <= 0.001 && lockedRef.current) {
  applyProgress(0);
  unlockScroll(-1);
  return;
}
```

### 3. Resetar progresso quando a seção sai completamente da viewport

Quando a seção fica totalmente acima ou abaixo do viewport, resetar `progressRef` e `targetProgressRef` para o estado correspondente (0 se seção está abaixo, 1 se está acima). Isso evita o "estado fantasma" onde o usuário voltou para uma seção anterior, depois desce de novo, e a animação começa do meio.

Na função `update` (atualmente só ativa quando não está locked), adicionar:

```ts
const rect = section.getBoundingClientRect();
if (rect.bottom < 0) {
  // Seção totalmente acima — usuário está abaixo dela
  if (progressRef.current !== 1) {
    progressRef.current = 1;
    targetProgressRef.current = 1;
    applyProgress(1);
  }
} else if (rect.top > viewportHeight) {
  // Seção totalmente abaixo — usuário está acima dela
  if (progressRef.current !== 0) {
    progressRef.current = 0;
    targetProgressRef.current = 0;
    applyProgress(0);
  }
}
```

## Comportamento resultante

- Descendo: trava na seção, animação roda, ao concluir libera e avança para CTA.
- **Subindo a partir do CTA**: trava na seção (animação no estado final), ao continuar rolando pra cima a animação reverte, e ao chegar em 0 libera para Seletividade. Hoje isso já existia parcialmente — ficará confiável.
- **Subindo logo após ter descido pela primeira vez**: o cooldown de 400ms permite voltar para a seção anterior sem ficar preso de novo na "Durante anos".
- Trava no descer continua firme, conforme pedido.

## Arquivos editados

- `src/routes/index.tsx` — apenas dentro do `useEffect` de `DuranteAnosHeadline` (linhas ~1320–1633): adiciona `unlockedUntilRef`, ajusta `unlockScroll`, `shouldLock`, `tickSmoothing` e `update`. Nenhuma mudança em CSS, JSX ou em outras seções.
