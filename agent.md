# Mundo das Frações --- AGENTS.md

> **Projeto:** Mundo das Frações\
> **Tipo:** jogo educativo 2D para navegador\
> **Público-alvo:** aprendizagem introdutória de frações, com foco em
> acessibilidade para pessoas autistas\
> **Stack alvo:** HTML5 + TypeScript + Phaser 3 + Vite\
> **Status:** pré-desenvolvimento / primeiro vertical slice\
> **Idioma inicial:** pt-BR

------------------------------------------------------------------------

## 1. Missão do projeto

Construir um jogo 2D educativo, acessível e visualmente intuitivo no
qual o jogador aprende frações e operações matemáticas **por meio da
própria mecânica do jogo**, e não por meio de uma sequência de
exercícios disfarçados.

A ideia central é:

> **O jogador constrói pontes usando frações.**

Cada ponte conecta dois lados de um abismo. O jogador recebe um conjunto
de cartas contendo frações e operações e precisa montar uma expressão
cuja representação corresponda ao comprimento necessário da ponte. Ao
pressionar **PLAY**, o personagem atravessa a ponte se ela estiver
matematicamente correta.

O jogo deve tornar a matemática uma propriedade do mundo:

-   frações correspondem a pedaços físicos da ponte;
-   operações combinam, alteram ou transformam esses pedaços;
-   uma expressão correta produz uma ponte funcional;
-   uma expressão incorreta produz feedback visual compreensível;
-   novas operações e relações matemáticas são **descobertas durante o
    jogo** e depois explicadas.

O objetivo não é criar um "quiz de matemática". O objetivo é criar uma
experiência de descoberta semelhante, em filosofia, a jogos como
*DragonBox*, *Beltmatic*, *The Farmer Was Replaced*, *Human Resource
Machine* e *Poly Bridge*: a matemática deve ser uma ferramenta
necessária para resolver problemas dentro do mundo do jogo.

------------------------------------------------------------------------

## 2. Referência visual principal

Existe um esboço de design criado antes do início do desenvolvimento:

`design-sketch.png`

O arquivo está no mesmo diretório deste documento.

**Importante:** o esboço é uma referência de composição e identidade
visual, não uma especificação rígida de implementação.

Elementos principais do esboço:

-   título "MUNDO DAS FRAÇÕES";
-   cenário 2D com dois lados de um abismo;
-   dois personagens dinossauros, um de cada lado;
-   água no fundo;
-   ponte formada por blocos;
-   cartas de frações e operações;
-   botão PLAY;
-   botão REFAZER;
-   contador de balastro/cartas;
-   painel lateral de explicação;
-   exemplo visual de adição de frações;
-   carta especial de "borboleta";
-   mapa de progressão;
-   exemplos de cartas;
-   pequena história sobre dois dinossauros separados por abismos;
-   controles de acessibilidade, incluindo TTS, contraste, animações e
    ritmo ajustável.

A arte final não deve ser simplesmente colocada como um único
background. Os elementos deverão ser separados em sprites/componentes
sempre que possível.

------------------------------------------------------------------------

## 3. Direção tecnológica

### 3.1 Stack

Usar:

-   **TypeScript**
-   **Phaser 3**
-   **Vite**
-   HTML5/CSS
-   Web APIs do navegador quando apropriado
-   `localStorage` para progresso local inicialmente

Não usar Godot ou Unity nesta primeira implementação.

A razão é que o jogo será distribuído diretamente pelo navegador e
possui características muito adequadas à web:

-   2D;
-   drag-and-drop;
-   interface rica;
-   animações simples;
-   texto;
-   TTS;
-   funcionamento em desktop e dispositivos touch;
-   facilidade de publicar como site estático.

### 3.2 Princípio importante

A lógica matemática deve ser independente do Phaser.

Não espalhar operações de frações pelos arquivos de cena.

A arquitetura deve separar:

``` text
Matemática
    ↓
Estado do jogo
    ↓
Renderização / interação Phaser
    ↓
Acessibilidade / áudio
```

Isso permite testar a matemática sem executar o jogo.

------------------------------------------------------------------------

## 4. Arquitetura inicial recomendada

Estrutura sugerida:

``` text
mundo-das-fracoes/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
│
├── public/
│   ├── assets/
│   │   ├── characters/
│   │   ├── environment/
│   │   ├── cards/
│   │   ├── ui/
│   │   ├── worlds/
│   │   └── audio/
│   └── data/
│       └── levels/
│
├── src/
│   ├── main.ts
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── MenuScene.ts
│   │   ├── LevelScene.ts
│   │   └── ExplanationScene.ts
│   │
│   ├── math/
│   │   ├── Fraction.ts
│   │   ├── FractionOperations.ts
│   │   └── MathValidator.ts
│   │
│   ├── game/
│   │   ├── GameState.ts
│   │   ├── LevelLoader.ts
│   │   ├── Card.ts
│   │   ├── Bridge.ts
│   │   └── Character.ts
│   │
│   ├── accessibility/
│   │   ├── AccessibilitySettings.ts
│   │   └── TTS.ts
│   │
│   ├── data/
│   │   └── types.ts
│   │
│   └── utils/
│       └── ...
│
├── tests/
│   ├── math/
│   └── levels/
│
└── design/
    └── design-sketch.png
```

A estrutura pode mudar se houver uma razão técnica clara, mas a
separação entre matemática, jogo e acessibilidade deve ser preservada.

------------------------------------------------------------------------

# 5. Conceito de gameplay

## 5.1 Loop principal

Cada nível segue aproximadamente:

``` text
1. Mostrar objetivo
2. Mostrar cartas disponíveis
3. Jogador escolhe/arrasta cartas
4. Cartas formam uma expressão
5. Expressão determina a composição da ponte
6. Jogador pode REFAZER
7. Jogador pressiona PLAY
8. Personagem tenta atravessar
9. Se correto: travessia bem-sucedida
10. Mostrar descoberta/explicação quando aplicável
11. Registrar progresso
12. Avançar
```

O fluxo deve ser previsível entre níveis.

Isso é propositalmente importante para acessibilidade.

------------------------------------------------------------------------

## 5.2 Mecânica da ponte

A ponte representa uma quantidade matemática.

Por exemplo, se o objetivo é `1`:

``` text
1/2 + 1/2
```

deve produzir uma ponte equivalente a um inteiro.

Visualmente:

``` text
[ 1/2 ][ 1/2 ]
```

representa:

``` text
[       1       ]
```

A representação visual deve deixar claro que as duas metades completam o
espaço.

Uma solução como:

``` text
1/4 + 1/4 + 1/4 + 1/4
```

também pode ser matematicamente válida, mas utilizar quatro cartas pode
ser menos eficiente que utilizar duas.

------------------------------------------------------------------------

## 5.3 Balastro / eficiência

O conjunto de cartas disponíveis funciona como o "balastro" do nível.

O jogador deve tentar completar a ponte utilizando o menor número de
cartas possível, mas **eficiência não deve punir a aprendizagem**.

Exemplo:

``` text
Objetivo: 1

Solução A:
1/2 + 1/2
2 cartas

Solução B:
1/4 + 1/4 + 1/4 + 1/4
4 cartas
```

Ambas podem ser corretas.

A solução de 2 cartas recebe uma avaliação de eficiência melhor.

Não usar contagem regressiva nem pressão de tempo como requisito
central.

------------------------------------------------------------------------

# 6. Cartas

As cartas são os principais elementos interativos.

Categorias planejadas:

### Frações

``` text
1/2
1/3
1/4
1/5
...
```

### Operações

``` text
+
-
×
÷
=
```

### Relações

``` text
>
<
=
```

### Cartas especiais

``` text
Borboleta
Simplificar
```

As cartas especiais devem ser desbloqueadas progressivamente e
introduzidas por descoberta.

------------------------------------------------------------------------

# 7. Frações como objetos visuais

A representação visual é tão importante quanto a representação
simbólica.

Uma carta `1/2` não deve ser apenas texto.

Sempre que possível, o jogo deve permitir que o jogador associe:

``` text
1/2
```

a:

``` text
████░░
```

ou a duas partes físicas de uma mesma unidade.

Para `3/4`:

``` text
██████░░
```

O jogador deve poder compreender a quantidade antes de depender da
notação.

A representação visual pode ser usada:

-   na carta;
-   na ponte;
-   nas explicações;
-   nas animações;
-   nas dicas.

------------------------------------------------------------------------

# 8. Progressão pedagógica

A progressão deve partir do concreto e avançar gradualmente para a
abstração.

## Mundo 1 --- Partes de um inteiro

Conceitos:

-   inteiro;
-   metade;
-   terço;
-   quarto;
-   frações simples.

Exemplos:

``` text
1/2
1/3
1/4
1/5
```

Objetivo principal: perceber fração como parte de uma unidade.

------------------------------------------------------------------------

## Mundo 2 --- Frações equivalentes

Introduzir:

``` text
1/2 = 2/4 = 3/6
1/3 = 2/6
```

Usar visualização de subdivisões.

O jogo deve permitir observar que o tamanho/quantidade total não muda
quando numerador e denominador são multiplicados pelo mesmo número.

------------------------------------------------------------------------

## Mundo 3 --- Adição com denominadores iguais

Exemplo:

``` text
1/2 + 1/2 = 2/2 = 1
```

A explicação deve mostrar que, quando as partes têm o mesmo tamanho,
podemos combinar os numeradores mantendo o denominador.

------------------------------------------------------------------------

## Mundo 4 --- Adição com denominadores diferentes

Exemplo:

``` text
1/2 + 1/3
```

Aqui surge a necessidade de encontrar uma representação comum.

Pode ser introduzida a "Borboleta" como ferramenta visual.

### Importante

A fórmula da borboleta deve ser tratada como um **recurso/mnemônico
visual**, não como uma regra mágica.

Para:

``` text
a/b + c/d
```

a transformação correta é:

``` text
(ad + bc) / bd
```

Exemplo:

``` text
1/2 + 1/3
= (1×3 + 1×2)/(2×3)
= 5/6
```

A animação da borboleta pode tornar os cruzamentos visíveis.

Não ensinar que "borboleta" é uma operação matemática fundamental.

------------------------------------------------------------------------

## Mundo 5 --- Outras operações

Progressivamente:

``` text
+
-
×
÷
```

A ordem e o ritmo devem depender da dificuldade observada.

------------------------------------------------------------------------

## Mundo 6 --- Razão e proporção

Introduzir relações como:

``` text
a/b = c/d
```

e posteriormente conectar isso a proporções e outras aplicações.

------------------------------------------------------------------------

## Possíveis extensões futuras

Depois do núcleo de frações:

-   porcentagem;
-   razão;
-   proporção;
-   regra de três;
-   números mistos;
-   comparação de frações;
-   simplificação;
-   problemas geométricos.

Não implementar tudo antes de validar o núcleo do jogo.

------------------------------------------------------------------------

# 9. Sistema de descoberta

Uma característica importante do projeto é:

> **O jogador deve descobrir a regra antes de receber a explicação
> formal.**

Exemplo:

O jogador tenta:

``` text
1/2 + 1/3
```

A mecânica mostra que simplesmente juntar os numeradores não produz uma
ponte correta.

Depois o jogo apresenta uma nova possibilidade:

**Borboleta.**

O jogador experimenta.

Após conseguir:

``` text
5/6
```

aparece:

> **Você descobriu uma nova relação!**

Então:

``` text
1/2 + 1/3
```

é transformado visualmente em:

``` text
(1×3 + 1×2)/(2×3)
```

e finalmente:

``` text
5/6
```

O jogador pode pressionar:

``` text
ENTENDI
```

e também pode ouvir a explicação por TTS.

------------------------------------------------------------------------

# 10. Acessibilidade

A acessibilidade é parte do design central, não um recurso opcional
adicionado no final.

## 10.1 TTS

Utilizar inicialmente a Web Speech API:

``` javascript
window.speechSynthesis
```

O sistema deve permitir narrar:

-   objetivo;
-   cartas;
-   instruções;
-   explicações;
-   resultados;
-   dicas.

Criar uma abstração `TTSService` para que o mecanismo possa ser
substituído futuramente.

------------------------------------------------------------------------

## 10.2 Estímulos

Criar configurações para:

``` text
Animações
Sons
Movimento
```

Cada um pode ter intensidade ajustável ou ser desligado.

------------------------------------------------------------------------

## 10.3 Visual

Priorizar:

-   alto contraste;
-   fontes legíveis;
-   textos curtos;
-   elementos bem separados;
-   ícones acompanhados de texto quando necessário;
-   não depender apenas de cor para transmitir informação;
-   animações previsíveis;
-   evitar flashes;
-   evitar excesso de partículas.

------------------------------------------------------------------------

## 10.4 Ritmo

Não utilizar tempo limite como requisito básico.

O jogador deve poder:

-   pensar;
-   repetir;
-   desfazer;
-   tentar novamente;
-   ouvir a explicação novamente.

------------------------------------------------------------------------

## 10.5 Feedback

Evitar feedback agressivo como:

``` text
ERRADO!!!
```

Preferir:

> "A ponte ainda não alcança o outro lado."

ou:

> "Essa quantidade é menor que a necessária."

O erro deve ser interpretável pelo estado do mundo.

------------------------------------------------------------------------

# 11. Interação

A interação principal deve ser:

**clicar/pressionar + arrastar + soltar.**

Também deve funcionar com touch.

Controles principais:

``` text
PLAY
REFAZER
```

O botão REFAZER retorna o nível ao estado inicial.

O botão PLAY executa a solução atual.

Durante o PLAY:

-   impedir alterações nas cartas enquanto a animação estiver ocorrendo;
-   animar o personagem atravessando a ponte;
-   se a ponte estiver correta, completar a travessia;
-   se estiver incorreta, mostrar claramente o motivo visualmente e
    permitir tentar novamente.

------------------------------------------------------------------------

# 12. Modelo de dados dos níveis

Os níveis devem ser declarativos.

Exemplo conceitual:

``` json
{
  "id": "1-01",
  "world": 1,
  "title": "Duas metades",
  "objective": {
    "type": "fraction",
    "numerator": 1,
    "denominator": 1
  },
  "cards": [
    {
      "type": "fraction",
      "numerator": 1,
      "denominator": 2
    },
    {
      "type": "fraction",
      "numerator": 1,
      "denominator": 2
    },
    {
      "type": "fraction",
      "numerator": 1,
      "denominator": 3
    },
    {
      "type": "operation",
      "value": "+"
    }
  ],
  "allowedOperations": ["+"],
  "minimumCards": 3,
  "discovery": null
}
```

A estrutura final pode ser ajustada durante a implementação.

O objetivo é que adicionar um nível não exija escrever lógica nova.

------------------------------------------------------------------------

# 13. Sistema matemático

Criar uma classe/estrutura `Fraction`.

Requisitos mínimos:

``` text
constructor(numerator, denominator)

add(other)
subtract(other)
multiply(other)
divide(other)

simplify()

equals(other)

compare(other)

toNumber()

toString()
```

Regras:

-   denominador nunca pode ser zero;
-   normalizar sinal;
-   simplificar por MDC;
-   evitar depender de ponto flutuante para determinar igualdade;
-   preferir aritmética inteira para frações.

Exemplo:

``` text
2/4
```

deve ser reconhecido como equivalente a:

``` text
1/2
```

mas o sistema deve poder preservar a representação original quando isso
for útil para a visualização.

------------------------------------------------------------------------

# 14. Validação de nível

Separar:

``` text
valor matemático
```

de:

``` text
representação visual
```

Por exemplo, a expressão:

``` text
1/2 + 1/2
```

é avaliada matematicamente como:

``` text
1
```

A ponte então pergunta:

``` text
resultado === objetivo
```

A eficiência pode ser calculada separadamente:

``` text
cartasUsadas / cartasMinimas
```

Não misturar essas duas responsabilidades.

------------------------------------------------------------------------

# 15. Estado do jogo

O estado de uma fase deve conter, no mínimo:

``` text
levelId
availableCards
placedCards
currentExpression
bridgeState
attempts
hintsUsed
startTime
elapsedTime
isPlaying
isCompleted
```

Para acessibilidade:

``` text
ttsEnabled
soundEnabled
animationIntensity
highContrast
reducedMotion
```

------------------------------------------------------------------------

# 16. Progressão e salvamento

Inicialmente utilizar `localStorage`.

Salvar:

``` text
níveis concluídos
melhor eficiência
quantidade de tentativas
configurações de acessibilidade
```

Não criar backend no MVP.

Um backend pode ser adicionado posteriormente se o projeto precisar de
coleta de métricas para pesquisa.

------------------------------------------------------------------------

# 17. Métricas para possível pesquisa

Uma das ambições acadêmicas do projeto é poder avaliar a experiência de
aprendizagem.

Se futuramente houver coleta de dados, registrar somente o necessário e
de forma não identificável.

Possíveis métricas:

``` text
tempo de resolução
número de tentativas
cartas utilizadas
solução mínima
uso de dicas
nível alcançado
repetições
erros por tipo
```

Não implementar coleta externa de dados de estudantes sem definir
primeiro requisitos de consentimento, privacidade e aprovação
institucional apropriados.

No MVP, métricas podem permanecer somente no dispositivo.

------------------------------------------------------------------------

# 18. Filosofia de design

O jogo deve seguir estas referências conceituais:

### DragonBox

Aprender a regra através da mecânica antes de apresentar a abstração
formal.

### Beltmatic

Operações matemáticas são objetos e ferramentas do mundo.

### The Farmer Was Replaced

O jogador aprende porque precisa de um conceito para resolver um
problema, e não porque o jogo pede que ele responda uma questão.

### Human Resource Machine

Transformar conceitos abstratos em ações concretas.

### Poly Bridge

O estado do mundo fornece feedback sobre a solução.

### Baba Is You

Explorar a ideia de manipulação de regras, quando isso fizer sentido.

Não copiar conteúdo, arte, personagens ou identidade visual desses
jogos. Usar apenas os princípios de design como inspiração.

------------------------------------------------------------------------

# 19. História

A história deve ser simples e secundária à mecânica.

Conceito atual:

> Dois amigos dinossauros vivem em regiões separadas por abismos criados
> por uma tempestade mágica. Ao descobrir o poder das frações, o jogador
> ajuda a reconstruir as pontes e conectar os mundos novamente.

A história deve:

-   motivar a construção das pontes;
-   fornecer contexto;
-   introduzir novos mundos;
-   não interromper excessivamente o gameplay.

Não transformar o projeto em um RPG narrativo.

------------------------------------------------------------------------

# 20. Direção visual

A referência atual utiliza:

-   azul predominante;
-   branco;
-   cinza;
-   detalhes coloridos nos personagens;
-   cartões grandes e legíveis;
-   estética de material didático moderno;
-   linhas e separações claras;
-   fundo claro;
-   baixa densidade visual.

Manter a interface limpa.

O foco visual deve estar em:

1.  objetivo;
2.  ponte;
3.  cartas;
4.  resultado.

Evitar excesso de HUD.

------------------------------------------------------------------------

# 21. Primeiro vertical slice

**Não começar produzindo o jogo completo.**

Implementar primeiro apenas um nível funcional.

### Nível 1-01

Objetivo:

``` text
1
```

Cartas:

``` text
1/2
1/2
1/3
+
```

Solução esperada:

``` text
1/2 + 1/2 = 1
```

O nível deve demonstrar:

-   carregamento do JSON;
-   renderização do cenário;
-   personagem em um lado;
-   destino no outro;
-   cartas;
-   drag-and-drop;
-   construção da ponte;
-   operação de adição;
-   validação da fração;
-   botão REFAZER;
-   botão PLAY;
-   animação da travessia;
-   conclusão;
-   explicação simples;
-   TTS.

Não implementar ainda:

-   dezenas de níveis;
-   mapa completo;
-   backend;
-   sistema complexo de IA adaptativa;
-   todas as operações;
-   sistema de conquistas.

Primeiro fazer **um nível excelente**.

------------------------------------------------------------------------

# 22. Critérios de aceitação do primeiro vertical slice

O MVP inicial só deve ser considerado pronto quando:

-   [ ] O jogo abre no navegador.
-   [ ] O nível é carregado de dados externos.
-   [ ] As cartas podem ser arrastadas.
-   [ ] O jogador consegue montar uma expressão.
-   [ ] A ponte reflete a quantidade matemática.
-   [ ] `1/2 + 1/2` é reconhecido como `1`.
-   [ ] O botão PLAY inicia a tentativa.
-   [ ] O personagem atravessa quando a solução está correta.
-   [ ] O botão REFAZER restaura o estado.
-   [ ] Uma solução incorreta produz feedback compreensível.
-   [ ] A explicação aparece após a descoberta.
-   [ ] A explicação pode ser lida por TTS.
-   [ ] O layout funciona em desktop.
-   [ ] O código matemático possui testes automatizados.
-   [ ] Não existem erros no console durante o fluxo normal.

------------------------------------------------------------------------

# 23. Testes

Criar testes para:

``` text
1/2 + 1/2 = 1
1/2 + 1/3 = 5/6
2/4 = 1/2
1/3 + 1/3 = 2/3
1/2 × 2 = 1
1/2 ÷ 2 = 1/4
```

Também testar casos inválidos:

``` text
denominador = 0
divisão por zero
fração negativa
simplificação
sinais
```

Os testes matemáticos não devem depender do Phaser.

------------------------------------------------------------------------

# 24. Roadmap

## Fase 0 --- Setup

-   criar projeto Vite + TypeScript;
-   instalar Phaser;
-   configurar lint/testes;
-   criar estrutura de diretórios;
-   adicionar referência visual.

## Fase 1 --- Vertical slice

Implementar o nível 1-01 completo.

## Fase 2 --- Sistema de níveis

-   loader JSON;
-   múltiplos níveis;
-   progresso;
-   mapa simples.

## Fase 3 --- Conteúdo pedagógico

-   equivalência;
-   adição;
-   denominadores diferentes;
-   borboleta;
-   simplificação.

## Fase 4 --- Acessibilidade

-   TTS;
-   reduced motion;
-   contraste;
-   tamanho de texto;
-   sons;
-   configurações persistentes.

## Fase 5 --- História e polimento

-   mundos;
-   personagens;
-   transições;
-   narrativa;
-   animações.

## Fase 6 --- Avaliação

-   métricas locais;
-   instrumentos de avaliação;
-   documentação;
-   preparação para eventual estudo com usuários.

------------------------------------------------------------------------

# 25. Regras para o agente de desenvolvimento

1.  **Não construir sistemas grandes antes do vertical slice.**
2.  **Não colocar lógica matemática diretamente dentro das cenas.**
3.  **Não hardcodar níveis quando eles puderem ser dados.**
4.  **Não transformar cada conceito em uma pergunta de múltipla
    escolha.**
5.  **Priorizar visualização sobre texto.**
6.  **Manter o jogador no controle do ritmo.**
7.  **Evitar punições desnecessárias.**
8.  **Toda nova operação deve possuir uma representação visual e uma
    explicação.**
9.  **Toda funcionalidade de acessibilidade deve poder ser
    desativada/configurada quando apropriado.**
10. **Testar a matemática separadamente da interface.**
11. **Manter o projeto executável em navegador a cada etapa.**
12. **Evitar dependências externas desnecessárias.**
13. **Não adicionar backend antes que exista uma necessidade concreta.**
14. **Não coletar dados pessoais de jogadores.**
15. **Não usar a expressão "fórmula da borboleta" como se fosse uma
    propriedade matemática fundamental; tratá-la como recurso
    visual/mnemônico.**
16. **Preservar a referência visual do esboço sem impedir evolução do
    design.**
17. **Ao tomar decisões de design não especificadas, preferir
    simplicidade, previsibilidade, acessibilidade e legibilidade.**

------------------------------------------------------------------------

# 26. Critério de sucesso do projeto

O projeto não deve ser avaliado apenas pela quantidade de conteúdo.

Uma versão pequena que:

-   funciona bem;
-   é visualmente clara;
-   é acessível;
-   torna frações manipuláveis;
-   possui uma mecânica realmente baseada em matemática;
-   explica descobertas;
-   funciona diretamente no navegador;
-   possui arquitetura testável;
-   e pode ser estudada academicamente

é preferível a um jogo enorme com muitos níveis, mas pouca profundidade
pedagógica.

A hipótese de design que orienta o projeto é:

> **Representar frações como objetos espaciais manipuláveis e fazer com
> que as operações matemáticas tenham consequências visíveis no mundo
> pode reduzir a distância entre a compreensão concreta e a
> representação simbólica, oferecendo uma experiência particularmente
> adequada a uma abordagem previsível, visual e multimodal de
> aprendizagem.**

Essa hipótese deve orientar o desenvolvimento, mas **não deve ser
apresentada como fato científico comprovado sem avaliação
experimental**.

------------------------------------------------------------------------

# 27. Primeira tarefa do agente

Ao iniciar o desenvolvimento:

1.  Inspecionar o repositório.
2.  Criar/configurar o projeto Vite + TypeScript + Phaser.
3.  Garantir que `npm install` e `npm run dev` funcionem.
4.  Criar a estrutura inicial de pastas.
5.  Implementar `Fraction` e testes unitários.
6.  Implementar carregamento de um primeiro JSON de nível.
7.  Criar o cenário mínimo do nível 1-01.
8.  Implementar cartas arrastáveis.
9.  Implementar construção visual da ponte.
10. Implementar REFAZER e PLAY.
11. Implementar validação matemática.
12. Implementar a travessia do personagem.
13. Implementar a primeira explicação e TTS.
14. Rodar os testes e verificar o jogo no navegador.
15. Somente depois disso começar a polir arte e adicionar conteúdo.

**Não avançar para o próximo mundo enquanto o vertical slice não estiver
sólido.**
