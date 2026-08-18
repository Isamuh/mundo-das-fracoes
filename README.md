# Mundo das Frações

**Um jogo educativo 2D para aprendizagem introdutória de frações, com ênfase em acessibilidade para pessoas autistas.**

![Status](https://img.shields.io/badge/status-em%20desenvolvimento%20%2F%202%20mundos-orange)
![Stack](https://img.shields.io/badge/stack-TypeScript%20%2B%20Vite-blue)
![Versão](https://img.shields.io/badge/vers%C3%A3o-0.2.0-lightgrey)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://mundo-das-fracoes.vercel.app)

---

## Resumo

_Mundo das Frações_ é um jogo educativo baseado em navegador cuja hipótese central é que **representar frações como objetos espaciais manipuláveis, e fazer com que operações matemáticas tenham consequências visíveis no mundo do jogo, pode reduzir a distância entre a compreensão concreta e a representação simbólica de frações**. O jogador controla dois personagens, Tico e Luma, separados por abismos que só podem ser cruzados construindo pontes a partir de cartas de frações e operações. Uma ponte só é atravessável quando a expressão matemática associada a ela é correta.

O projeto é desenvolvido como um artefato de pesquisa em tecnologia educacional, com atenção explícita a critérios de acessibilidade (ritmo ajustável, ausência de pressão de tempo, narração por voz, feedback não punitivo) e à separação entre lógica matemática e apresentação visual, de modo a permitir validação e, futuramente, avaliação experimental com estudantes.

Esta hipótese de design é tratada como uma proposição a ser investigada, não como um fato comprovado, e deve ser avaliada empiricamente antes de qualquer generalização sobre sua eficácia pedagógica.

---

## Sumário

1. [Motivação e fundamentação pedagógica](#motivação-e-fundamentação-pedagógica)
2. [Mecânica do jogo](#mecânica-do-jogo)
3. [Progressão pedagógica](#progressão-pedagógica)
4. [Capturas de tela](#capturas-de-tela)
5. [Acessibilidade](#acessibilidade)
6. [Arquitetura técnica](#arquitetura-técnica)
7. [Estado atual de desenvolvimento](#estado-atual-de-desenvolvimento)
8. [Estrutura do repositório](#estrutura-do-repositório)
9. [Instalação e execução](#instalação-e-execução)
10. [Testes](#testes)
11. [Roadmap](#roadmap)
12. [Métricas e possibilidades de pesquisa](#métricas-e-possibilidades-de-pesquisa)
13. [Referências conceituais](#referências-conceituais)
14. [Como contribuir](#como-contribuir)
15. [Licença](#licença)

---

## Motivação e fundamentação pedagógica

O ensino de frações é reconhecido na literatura de educação matemática como um dos pontos de maior dificuldade na transição do pensamento aritmético concreto para o pensamento proporcional e algébrico. Abordagens centradas exclusivamente em notação simbólica (`a/b`) tendem a dissociar o conceito de fração de sua referência intuitiva como _parte de um todo_, especialmente para estudantes neurodivergentes que se beneficiam de representações visuais, previsíveis e multimodais.

_Mundo das Frações_ parte do princípio de que a matemática deve ser **uma propriedade do mundo do jogo**, e não uma sequência de exercícios disfarçados de mecânica lúdica:

- frações correspondem a pedaços físicos de uma ponte;
- operações combinam, alteram ou transformam esses pedaços;
- uma expressão correta produz uma ponte funcional e atravessável;
- uma expressão incorreta produz feedback visual interpretável, não punitivo;
- novas relações matemáticas são **descobertas pela experimentação do jogador** antes de receberem uma explicação formal.

Essa filosofia de design é inspirada — sem reprodução de conteúdo, arte ou identidade visual — em jogos como _DragonBox_, _Beltmatic_, _The Farmer Was Replaced_, _Human Resource Machine_ e _Poly Bridge_, nos quais conceitos abstratos se tornam ferramentas necessárias para resolver problemas do mundo, e não respostas a perguntas explícitas.

---

## Mecânica do jogo

O jogador recebe um conjunto de **cartas** (frações e operadores) e deve combiná-las para formar uma expressão cujo valor corresponda ao comprimento necessário de uma ponte entre dois penhascos. Ao pressionar **Testar ponte**, o personagem tenta atravessar; se a expressão for matematicamente correta, a travessia é bem-sucedida.

Loop principal de uma fase:

1. apresentação do objetivo (ex.: completar `1` inteiro);
2. apresentação das cartas disponíveis (o "balastro" da fase);
3. o jogador seleciona cartas para montar uma expressão;
4. a expressão determina visualmente a composição parcial da ponte;
5. o jogador pode **Refazer** a qualquer momento, sem penalidade;
6. o jogador pressiona **Testar ponte**;
7. o personagem tenta a travessia;
8. em caso de sucesso, a travessia se completa e uma descoberta é exibida;
9. o progresso é registrado localmente e o jogador avança.

A validação compara a estrutura e o valor matemático da expressão montada com o padrão esperado da fase. O jogo não utiliza contagem regressiva nem qualquer forma de pressão temporal.

---

## Progressão pedagógica

O conteúdo é organizado em mundos, do concreto para o abstrato. Atualmente dois mundos estão implementados:

| Mundo | Conceito                        | Fases                                                     |
| ----- | ------------------------------- | --------------------------------------------------------- |
| 1     | Partes de um inteiro            | Duas metades · Três terços · Juntar e retirar             |
| 2     | Multiplicar e dividir           | Repetir uma metade · Metade da metade · Repartir o inteiro · Quantas vezes cabe · Transformar partes |

Cada fase possui um **modo normal** e um **modo difícil**, que varia as cartas e as combinações esperadas (ex.: no modo difícil, `2/3 × 3/2` substitui `1/2 × 2`).

Mundos planejados, condicionados à validação do núcleo do jogo:

| Mundo | Conceito                            | Exemplo             |
| ----- | ----------------------------------- | ------------------- |
| 3     | Frações equivalentes                | `1/2 = 2/4 = 3/6`   |
| 4     | Adição com denominadores iguais     | `1/2 + 1/2 = 1`     |
| 5     | Adição com denominadores diferentes | `1/2 + 1/3 = 5/6`   |
| 6     | Outras operações e razão            | `+`, `−`, `×`, `÷`, `a/b = c/d` |

No Mundo 5, está prevista a técnica mnemônica popularmente chamada de "borboleta" (`a/b + c/d = (ad + bc)/bd`), explicitamente apresentada ao jogador como um **recurso visual auxiliar**, e não como uma propriedade matemática fundamental — decisão de design registrada como regra obrigatória para o time de desenvolvimento (ver [Como contribuir](#como-contribuir)).

Extensões futuras possíveis, condicionadas à validação do núcleo do jogo, incluem porcentagem, razão, proporção, regra de três, números mistos, comparação de frações e problemas geométricos.

---

## Capturas de tela

As imagens abaixo ilustram o protótipo de interface do Mundo 1 ("Partes de um inteiro"), incluindo a tela inicial, o guia introdutório de operações e a fase "Duas metades", em diferentes estados de progresso.

### Tela inicial

![Tela inicial do Mundo das Frações](docs/screenshots/01-landing.png)

A tela de abertura apresenta a proposta do projeto ("Construa pontes. Conecte ideias.") e uma pré-visualização do cenário do Mundo 1, com os personagens Tico e Luma em lados opostos de uma ponte incompleta.

### Guia introdutório do Mundo 1

![Guia de operações Juntar e Retirar](docs/screenshots/02-guia-mundo1.png)

Antes da primeira fase, um painel interativo apresenta as operações de **Juntar** (adição) e **Retirar** (subtração) de frações com denominadores iguais, usando representação visual de blocos ao lado da notação simbólica.

### Fase "Duas metades" — estado inicial

![Fase 1, estado inicial, ponte vazia](docs/screenshots/03-fase1-inicio.png)

O objetivo da fase (`1/1`) é exibido junto ao cenário. A ponte começa vazia ("Sua ponte: 0 de 1 inteiro") e o jogador dispõe de cartas de frações (`1/5`, `1/3`, `1/4`, `1/2`, `1/2`, `1/4`) e do operador `+`.

### Fase "Duas metades" — em progresso

![Fase 1, em progresso, uma carta de 1/2 posicionada](docs/screenshots/04-fase1-progresso.png)

Após o jogador posicionar a carta `1/2` e o operador `+`, a ponte reflete visualmente a fração acumulada (`1/2` de `1` inteiro), e a interface indica que a expressão ainda precisa de uma fração adicional para ser avaliada.

---

## Acessibilidade

A acessibilidade é tratada como parte do design central do projeto, não como um recurso adicionado posteriormente. Configurações persistidas no dispositivo (`localStorage`):

- **Narrador por voz (TTS):** narração de objetivos, instruções, resultados e descobertas, via Web Speech API (`pt-BR`).
- **Redução de movimento:** reduz ou desativa animações e transições decorativas.
- **Alto contraste:** aumenta a diferença entre cores e textos.
- **Tema escuro:** paleta escura e confortável.
- **Sons do jogo e volume:** música e sons de interação com volume ajustável (ou desativáveis).
- **Ritmo:** ausência de tempo limite; o jogador pode pensar, repetir, desfazer e ouvir explicações novamente sem penalidade.
- **Feedback não agressivo:** mensagens de erro descritivas e neutras (ex.: _"A ponte ainda não alcança o outro lado"_), em vez de indicadores punitivos de erro/acerto.
- **Design visual:** alto contraste, fontes legíveis, textos curtos, elementos bem separados, ícones acompanhados de texto e nenhuma informação transmitida exclusivamente por cor.

---

## Arquitetura técnica

### Stack

- **TypeScript**
- **Vite**
- **HTML5 / CSS3** (renderização via DOM, com animações em CSS)
- **Web Speech API** (narração por voz)
- **`localStorage`** para persistência local de configurações e progresso
- **Vitest** para testes unitários
- Phaser 3 aparece no `package.json` como dependência declarada, mas o código atual do jogo não o utiliza — a renderização é feita diretamente em HTML/CSS.

### Princípio arquitetural

A lógica matemática é independente da camada de renderização, seguindo o fluxo:

```
Matemática → Dados do nível (JSON) → Estado do jogo → Renderização / interação → Acessibilidade / áudio
```

Essa separação permite testar a corretude matemática sem executar o jogo, e é tratada como restrição de arquitetura não negociável (ver regra 2 em [Como contribuir](#como-contribuir)).

### Sistema matemático

O núcleo do jogo é a classe `Fraction` (`src/math/Fraction.ts`), com as operações `add`, `subtract`, `multiply`, `divide`, `equals`, `toNumber` e `toString`, com as seguintes garantias:

- denominador nunca pode ser zero;
- sinais são normalizados;
- frações são simplificadas por MDC (máximo divisor comum);
- comparações de igualdade evitam depender de aritmética de ponto flutuante, preferindo aritmética inteira.

A avaliação de expressões é feita por `evaluateExpression` (`src/main.ts`), que valida a alternância entre frações e operadores e acumula o resultado. A validação de cada fase separa explicitamente **estrutura esperada** (padrão de cartas, definido no JSON do nível) de **valor matemático** (resultado da expressão comparado ao objetivo).

### Níveis declarativos

Os níveis são dados declarativos em JSON (`public/data/levels/*.json`), carregados por `LevelLoader` e adaptados pela `LevelAdapter`. Cada nível define cartas (`deck`/`hardDeck`), objetivo, layout da cena (`sceneLayout`) e padrão de validação (`validationPattern`/`validationPatternHard`). A geometria da ponte é calculada automaticamente entre as bordas internas dos penhascos por `resolveBridgeGeometry` (`src/game/SceneGeometry.ts`).

---

## Estado atual de desenvolvimento

> Versão 0.2.0 — o jogo é executável e jogável no navegador. Jogue a versão publicada em <https://mundo-das-fracoes.vercel.app>.

Implementação atual, concentrada em `src/main.ts` (lógica de jogo e telas) e `src/style.css` (visual e animações), com os dados de nível em `public/data/levels/`:

- **Dois mundos completos:** Mundo 1 (3 fases) e Mundo 2 (5 fases), cada uma com modo normal e modo difícil.
- **Carregamento declarativo de níveis:** JSONs validados pelo schema em `src/data/types.ts`, com cena configurável (penhascos, rio animado, ponte, personagens).
- **Cartas:** seleção por toque, embaralhamento estável por fase (Fisher-Yates), construção e avaliação da expressão, botões **Refazer** e **Testar ponte**.
- **Ponte visual:** preenchimento proporcional à soma matemática, com geometria recalculada ao redimensionar a tela (`ResizeObserver`).
- **Personagens:** Tico (vermelho) e Luma (azul), com sprites de corrida e travessia animada da ponte.
- **Guia de operações:** painéis interativos para `+`, `−` (Mundo 1) e `×`, `÷` (Mundo 2), com animação visual dos blocos e narração.
- **Descobertas:** após cada travessia correta, um modal explica a relação matemática encontrada, com opção de ouvir por TTS.
- **Progresso e configurações:** níveis concluídos (`mdf-level-{n}-complete`) e configurações (`mdf-settings`) persistidos em `localStorage`.
- **Telas extras:** mapa de progressão, "Sobre o projeto" e "Créditos".

---

## Estrutura do repositório

```
mundo-das-fracoes/
├── index.html
├── package.json
├── tsconfig.json
├── agent.md              # (raiz) especificação de referência do projeto
├── README.md
├── LICENSE               # licença MIT
│
├── public/
│   ├── assets/
│   │   ├── audio/        # música de fundo (heavenly-loop.ogg)
│   │   ├── background/   # céu, penhascos e frames do rio
│   │   └── dinos/        # sprites de Tico e Luma (parado/correndo)
│   └── data/
│       └── levels/       # nível-1-1.json … nível-2-5.json
│
├── src/
│   ├── main.ts           # lógica do jogo e todas as telas
│   ├── style.css         # visual, temas e animações
│   ├── data/
│   │   ├── types.ts      # schema dos níveis (Level, Card, SceneLayout…)
│   │   └── homeScene.ts  # layout da tela inicial
│   ├── game/
│   │   ├── LevelLoader.ts    # carregamento dos JSONs de níveis
│   │   ├── LevelAdapter.ts   # adapta dados do nível para a renderização
│   │   └── SceneGeometry.ts  # geometria da ponte entre os penhascos
│   └── math/
│       └── Fraction.ts   # aritmética exata de frações
│
├── tests/
│   ├── math/
│   │   └── Fraction.test.ts
│   └── game/
│       └── SceneGeometry.test.ts
│
├── docs/
│   ├── AGENTS.md            # especificação completa do projeto
│   ├── LEVEL_ARCHITECTURE.md# arquitetura dos níveis JSON
│   └── screenshots/         # capturas da interface
│
└── design/
    └── design-sketch.png    # esboço visual de referência
```

---

## Instalação e execução

A versão publicada está disponível em: <https://mundo-das-fracoes.vercel.app>.

```bash
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev

# gerar build de produção
npm run build

# rodar a suíte de testes
npm test
```

---

## Testes

A suíte é executada com Vitest (`npm test`) e não depende de executar o jogo:

- `tests/math/Fraction.test.ts` — aritmética exata: soma (`1/2 + 1/2 = 1`, `1/2 + 1/3 = 5/6`), equivalência (`2/4 = 1/2`), subtração, multiplicação, divisão e rejeição de denominador zero.
- `tests/game/SceneGeometry.test.ts` — cálculo da ponte entre as bordas dos penhascos, incluindo ajustes finos e alturas de encaixe.

---

## Roadmap

| Fase                     | Status                | Escopo                                                                                 |
| ------------------------ | --------------------- | -------------------------------------------------------------------------------------- |
| 0 — Setup                | Concluída             | projeto Vite + TypeScript, estrutura de diretórios, referência visual                  |
| 1 — Vertical slice       | Concluída             | fase 1-01 completa e funcional, ponta a ponta                                          |
| 2 — Sistema de níveis    | Concluída             | loader de JSON, múltiplos níveis, progresso, mapa simples                              |
| 3 — Conteúdo pedagógico  | Parcial               | Mundo 1 (partes de um inteiro) e Mundo 2 (multiplicar e dividir) concluídos; equivalência, denominadores diferentes e borboleta planejados |
| 4 — Acessibilidade       | Parcial               | TTS, redução de movimento, contraste, tema escuro, sons e configurações persistentes; tamanho de texto planejado |
| 5 — História e polimento | Em andamento          | telas de apresentação, guias, descobertas, créditos; narrativa adicional planejada     |
| 6 — Avaliação            | Futuro                | métricas locais, instrumentos de avaliação, documentação, preparação para estudo com usuários |

Itens pendentes registrados no repositório (`.TODO`): suporte a pontes maiores que 1 inteiro, ponte com valores verticais e considerações sobre gravidade.

---

## Métricas e possibilidades de pesquisa

Uma das motivações de médio prazo do projeto é permitir avaliação da experiência de aprendizagem. Caso métricas venham a ser coletadas no futuro, o projeto se compromete a:

- registrar **somente o necessário**, de forma **não identificável**;
- não implementar coleta externa de dados de estudantes **sem definição prévia** de requisitos de consentimento, privacidade e, quando aplicável, aprovação institucional (comitê de ética em pesquisa);
- manter, no MVP, quaisquer métricas restritas ao dispositivo local (`localStorage`), sem envio a servidores externos.

Métricas potencialmente relevantes para pesquisa futura incluem: tempo de resolução, número de tentativas, cartas utilizadas, distância até a solução mínima, uso de dicas, nível alcançado, repetições e tipos de erro cometidos.

---

## Referências conceituais

O design do projeto é informado, em nível de princípios (não de conteúdo, arte ou identidade visual), pelos seguintes jogos:

- **DragonBox** — aprendizagem da regra pela mecânica, antes da abstração formal.
- **Beltmatic** — operações matemáticas como objetos e ferramentas manipuláveis do mundo.
- **The Farmer Was Replaced** — aprendizagem motivada pela necessidade de resolver um problema, não pela obrigação de responder a uma pergunta.
- **Human Resource Machine** — tradução de conceitos abstratos em ações concretas.
- **Poly Bridge** — o estado do mundo como fonte primária de feedback sobre a solução.
- **Baba Is You** — inspiração pontual para a ideia de manipulação de regras, quando pertinente.

---

## Como contribuir

O desenvolvimento é orientado por um conjunto explícito de regras (ver `docs/AGENTS.md`), das quais se destacam:

1. Não construir sistemas grandes antes de validar o vertical slice.
2. Não colocar lógica matemática diretamente na camada de renderização.
3. Não hardcodar níveis quando eles puderem ser representados como dados.
4. Não reduzir cada conceito a uma pergunta de múltipla escolha.
5. Priorizar visualização sobre texto.
6. Manter o jogador no controle do ritmo da experiência.
7. Evitar punições desnecessárias.
8. Toda nova operação deve ter representação visual e explicação associada.
9. Toda funcionalidade de acessibilidade deve ser configurável/desativável quando apropriado.
10. Testar a matemática separadamente da interface.
11. Manter o projeto executável no navegador a cada etapa de desenvolvimento.
12. Evitar dependências externas desnecessárias.
13. Não adicionar backend antes de uma necessidade concreta e justificada.
14. Não coletar dados pessoais de jogadores.
15. Tratar a "fórmula da borboleta" como recurso visual/mnemônico, nunca como propriedade matemática fundamental.
16. Preservar a referência visual original do projeto sem impedir sua evolução.
17. Em decisões de design não especificadas, priorizar simplicidade, previsibilidade, acessibilidade e legibilidade.

A especificação completa do projeto, incluindo modelo de dados de níveis, estrutura de estado de jogo e critérios pedagógicos detalhados, está documentada em [`docs/AGENTS.md`](./docs/AGENTS.md). A arquitetura dos níveis JSON é detalhada em [`docs/LEVEL_ARCHITECTURE.md`](./docs/LEVEL_ARCHITECTURE.md).

---

## Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](./LICENSE) para os termos completos.

---

## Citação

Caso este projeto seja referenciado em contexto acadêmico, sugere-se citá-lo como um artefato de pesquisa em desenvolvimento (design em andamento, sem avaliação experimental concluída até o momento desta versão do documento).