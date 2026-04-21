

## Plano — Subir a foto do idealizador no mobile

No mobile (viewport ~518px) a foto hoje fica colada no `bottom-0` da seção, ocupando só a metade inferior. Isso deixa um buraco visual entre o texto e a foto, e a foto parece "deslocada pra baixo", fora do enquadramento.

### O que ajustar

**Arquivo:** `src/routes/index.tsx` — `HeroIntro` (linha 468)

**Ajustes só na variante mobile do `<img>` (classes sem prefixo `md:`):**

1. **Subir a foto**: trocar `bottom-0` por `top-[42%]` (a foto passa a começar na metade da seção, ficando mais alta e encaixando logo abaixo do bloco de texto/CTA).
2. **Aumentar a área visível**: trocar `h-[55%]` por `h-[60%]` pra foto não ficar cortada depois de subir.
3. **Recentralizar horizontalmente**: trocar `right-[-15%] w-[110%]` por `right-[-8%] w-[108%]` — fica menos sangrada pro lado direito, mais centralizada no enquadramento.
4. **Ajustar âncora de recorte**: trocar `object-right-bottom` por `object-right-top` — assim, ao subir a foto, a parte de cima do rosto/glow fica em destaque em vez do tronco.

**Ajuste correspondente na vinheta mobile (linha 480):**

- Trocar `bottom-0 h-[55%]` por `top-[42%] h-[58%]` — a vinheta acompanha a nova posição da foto, garantindo que a transição suave fique alinhada com onde a foto começa, não no fim da seção.

**Desktop (classes `md:`)** — não muda nada, continua igual.

### Resultado

No mobile a foto sobe ~40% e fica encaixada logo abaixo do CTA "Iniciar avaliação", sem aquele espaço vazio entre texto e foto. O glow laranja da foto aparece mais alto, integrando melhor com o título "OS NOVOS NORDESTINOS" laranja em cima — fica uma seção 1 coesa, exatamente como nas referências.

### Arquivo alterado

- `src/routes/index.tsx` — duas classes ajustadas (linhas 468 e 480), só variantes mobile.

