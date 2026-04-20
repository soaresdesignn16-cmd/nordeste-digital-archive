

## Diagnóstico

O efeito está implementado mas **invisível no mobile** — os fragmentos têm `hidden md:block`, e o usuário está em viewport 474px. Por isso "não pegou".

Além disso, mesmo no desktop os fragmentos atuais são apenas 2 mini-badges sutis posicionados perto do ghost number. O vídeo do Pinterest mostra uma composição **mais densa e editorial**: vários elementos pequenos espalhados criando colagem.

## Plano: Reforçar a colagem editorial e ativar no mobile

### 1. Mostrar fragmentos no mobile
Remover `hidden md:block` e adaptar tamanho/posições para caber no card pequeno. Usar escala menor no mobile (`scale-75`) e posições ajustadas.

### 2. Aumentar densidade da colagem (3-4 fragmentos por passo)
Adicionar 1-2 fragmentos extras em cada passo: além das mini-badges, incluir:
- **Linha de dados** (ex: "01.04 / SISTEMA"), tipo timestamp editorial
- **Ponto/glyph dourado** com pulse sutil (estilo "live data")
- Manter os 2 ícone+label existentes

Isso cria a sensação de "dashboard/colagem viva" do vídeo, sem virar bagunça (apenas elementos pequenos, transparentes, em cantos opostos).

### 3. Reposicionar para não conflitar com texto
Usar cantos: top-right (perto do ghost number), top-left, bottom-right. Deixar o lado esquerdo (onde fica o título) limpo. No mobile, posicionar só nos cantos superiores com escala reduzida.

### 4. Refinar visual dos fragmentos
- Adicionar leve `animate-pulse` no glyph dourado (heartbeat editorial)
- Aumentar contraste do `backdrop-blur` para destacar sobre o card
- Garantir `z-index` correto (atrás do título, na frente do ghost number)

### Arquivos afetados
- `src/routes/index.tsx` — atualizar array `fragments` (3-4 itens por passo) e o JSX do map (remover `hidden md:block`, adicionar variantes `meta`/`pulse`)
- `src/styles.css` — adicionar `.editorial-glyph` (ponto dourado pulsante) e `.editorial-meta` (texto monoespaçado tipo timestamp)

### Garantias
- ✅ Copy 100% preservada
- ✅ Estrutura/hierarquia preservada
- ✅ Visível em mobile e desktop
- ✅ Sem sobreposição com título/descrição (apenas cantos)
- ✅ Composição editorial densa mas controlada — autoridade, não bagunça

