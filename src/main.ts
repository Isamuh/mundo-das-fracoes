import "./style.css";
import { Fraction } from "./math/Fraction";

type Settings = {
  reducedMotion: boolean;
  highContrast: boolean;
  tts: boolean;
  sound: boolean;
  darkTheme: boolean;
  volume: number;
};
const defaults: Settings = {
  reducedMotion: false,
  highContrast: false,
  tts: true,
  sound: true,
  darkTheme: false,
  volume: 12,
};
let settings: Settings = {
  ...defaults,
  ...JSON.parse(localStorage.getItem("mdf-settings") ?? "{}"),
};
let cards: string[] = [];
let currentLevel: 1 | 2 | 3 = 1;
let deckOrder: string[] = [];
const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const orderedDeckKeys = (keys: string[]): string[] => {
  const sameSet =
    deckOrder.length === keys.length &&
    keys.every((key) => deckOrder.includes(key));
  if (!sameSet) deckOrder = shuffle(keys);
  return deckOrder;
};
const app = document.querySelector<HTMLDivElement>("#app")!;
const backgroundMusic = new Audio("/assets/audio/heavenly-loop.ogg");
backgroundMusic.loop = true;
backgroundMusic.volume = settings.volume / 100;
const startMusic = () => {
  if (settings.sound) backgroundMusic.play().catch(() => undefined);
};
const say = (text: string) => {
  if (!settings.tts || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = 0.93;
  speechSynthesis.speak(u);
};
const save = () => {
  localStorage.setItem("mdf-settings", JSON.stringify(settings));
  document.body.classList.toggle("contrast", settings.highContrast);
  document.body.classList.toggle("reduced-motion", settings.reducedMotion);
  document.body.classList.toggle("dark-theme", settings.darkTheme);
  backgroundMusic.volume = settings.volume / 100;
};
const fraction = (text: string) => {
  const [a, b] = text.split("/");
  return b === undefined
    ? `<span class="whole-number">${a}</span>`
    : `<span class="fraction"><b>${a}</b><i class="fraction-line"></i><b>${b}</b><em class="fraction-bar"><u style="width:${Math.min(100, (Number(a) / Number(b)) * 100)}%"></u></em></span>`;
};
const cardFraction = (id: string) =>
  id === "threeQuarter"
    ? new Fraction(3, 4)
    : id.startsWith("third")
      ? new Fraction(1, 3)
      : id.startsWith("quarter") || id === "quarter"
        ? new Fraction(1, 4)
        : id === "fifth"
          ? new Fraction(1, 5)
          : new Fraction(1, 2);
const isOperator = (id: string) => id.startsWith("plus") || id === "minus";
type ExpressionState = {
  valid: boolean;
  complete: boolean;
  result: Fraction;
  message: string;
};
const evaluateExpression = (tokens: string[]): ExpressionState => {
  if (!tokens.length)
    return {
      valid: true,
      complete: false,
      result: new Fraction(0, 1),
      message: "Escolha uma peça para começar.",
    };
  let expectsFraction = true;
  let result = new Fraction(0, 1);
  let operation: "+" | "-" = "+";
  for (const token of tokens) {
    if (expectsFraction) {
      if (isOperator(token))
        return {
          valid: false,
          complete: false,
          result,
          message: "Falta uma fração antes deste operador.",
        };
      const value = cardFraction(token);
      result = operation === "+" ? result.add(value) : result.subtract(value);
      expectsFraction = false;
    } else {
      if (!isOperator(token))
        return {
          valid: false,
          complete: false,
          result,
          message: "Use + ou − entre cada par de frações.",
        };
      operation = token.startsWith("plus") ? "+" : "-";
      expectsFraction = true;
    }
  }
  return {
    valid: true,
    complete: !expectsFraction,
    result,
    message: expectsFraction ? "A expressão ainda precisa de uma fração." : "",
  };
};
const shell = (content: string) => {
  app.innerHTML = `<div class="game-shell">${content}</div>`;
  save();
};
const header = (back?: string) =>
  `<header class="topbar"><button class="brand" data-go="home" aria-label="Voltar ao início"><span>✦</span> MUNDO DAS <strong>FRAÇÕES</strong></button>${back ? `<button class="back" data-go="${back}">← Voltar</button>` : `<div class="progress-pill">Mundo 1 • Fase ${currentLevel} de 3</div>`}</header>`;
const guideCopy: Record<
  string,
  { before: string; after: string; result: string }
> = {
  join: {
    before: "Toque para ver duas metades se juntando.",
    after: "Duas metades se juntaram e formaram um inteiro completo.",
    result: "1 inteiro",
  },
  remove: {
    before: "Toque para ver um quarto sendo retirado de três quartos.",
    after: "Um quarto saiu de três quartos. Sobrou uma metade da ponte.",
    result: "1/2",
  },
  multiply: {
    before: "Toque para ver uma metade se repetindo.",
    after: "A metade se repetiu duas vezes e formou um inteiro completo.",
    result: "1 inteiro",
  },
  divide: {
    before: "Toque para ver uma metade sendo dividida.",
    after:
      "A metade foi dividida em duas partes iguais. Cada parte é um quarto.",
    result: "1/4",
  },
};
function toggleGuide(key: string): void {
  const entry = guideCopy[key];
  const bar = document.querySelector<HTMLElement>(
    `.guide-bar[data-guide="${key}"]`,
  );
  const btn = document.querySelector<HTMLButtonElement>(
    `.guide-toggle[data-guide="${key}"]`,
  );
  const result = document.querySelector<HTMLElement>(
    `[data-guide-result="${key}"]`,
  );
  if (!entry || !bar || !btn || !result) return;
  bar.classList.toggle("active");
  const active = bar.classList.contains("active");
  result.textContent = active ? entry.result : "?";
  btn.textContent = active ? "↺ Refazer" : (btn.dataset.label ?? "");
  say(active ? entry.after : entry.before);
}
function speakGuide(key: string): void {
  const entry = guideCopy[key];
  const bar = document.querySelector<HTMLElement>(
    `.guide-bar[data-guide="${key}"]`,
  );
  if (!entry) return;
  say(bar?.classList.contains("active") ? entry.after : entry.before);
}

function home(): void {
  shell(
    `${header()}<main class="hero"><section class="hero-copy"><p class="eyebrow">UMA AVENTURA PARA DESCOBRIR</p><h1>Construa pontes.<br/><em>Conecte ideias.</em></h1><p class="lead">Frações viram peças de um mundo encantado. Experimente, construa e descubra matemática no seu ritmo.</p><div class="hero-actions"><button class="button primary" data-go="operations-guide">Começar aventura <span>→</span></button><button class="button ghost" data-go="about">Conheça o projeto</button></div><div class="feature-row"><span>◉ Sem tempo limite</span><span>♬ Ritmo tranquilo</span><span>◌ Feito para explorar</span></div></section><section class="hero-art"><div class="sun"></div><div class="bridge-preview"><div></div><div></div><div></div></div><img class="red-dino hero-dino" src="/assets/dinos/dino_red_idle.png" alt="Dinossauro vermelho"/><img class="blue-dino hero-friend" src="/assets/dinos/dino_blue_idle.png" alt="Dinossauro azul"/><div class="chapter-card"><span>PRIMEIRO DESAFIO</span><strong>Partes de um inteiro</strong><small>Aprenda com duas metades</small></div></section></main><nav class="bottom-nav"><button data-go="accessibility">♿ <span>Acessibilidade</span></button><button data-go="settings">⚙ <span>Configurações</span></button><button data-go="about">ⓘ <span>Sobre o projeto</span></button><button data-go="credits">✦ <span>Créditos</span></button></nav>`,
  );
}
function operationsGuide(): void {
  shell(
    `${header("home")}<main class="guide-page"><p class="eyebrow">GUIA DO MUNDO 1</p><h1>Juntar e retirar partes</h1><p class="page-lead">Toque nas peças abaixo para ver o que <b>+</b> e <b>−</b> fazem com uma ponte.</p><section class="guide-grid"><article class="guide-card"><span class="guide-symbol">+</span><h2>Juntar</h2><div class="guide-bar" data-guide="join"><span class="guide-piece piece-a"></span><span class="guide-piece piece-b"></span></div><div class="guide-caption" aria-live="polite">${fraction("1/2")}<b>+</b>${fraction("1/2")}<b>=</b><strong data-guide-result="join">?</strong></div><p>Duas metades do mesmo tamanho se encaixam e completam a unidade.</p><div class="guide-actions"><button class="button ghost guide-toggle" data-action="guide-toggle" data-guide="join" data-label="Toque para juntar">Toque para juntar</button><button class="icon-btn" data-action="guide-speak" data-guide="join" aria-label="Ouvir explicação de juntar">🔊</button></div></article><article class="guide-card"><span class="guide-symbol minus-symbol">−</span><h2>Retirar</h2><div class="guide-bar quarters" data-guide="remove"><span class="guide-piece"></span><span class="guide-piece"></span><span class="guide-piece removable"></span><span class="guide-piece"></span></div><div class="guide-caption" aria-live="polite">${fraction("3/4")}<b>−</b>${fraction("1/4")}<b>=</b><strong data-guide-result="remove">?</strong></div><p>Ao tirar um quarto de três quartos, sobra uma metade da ponte.</p><div class="guide-actions"><button class="button ghost guide-toggle" data-action="guide-toggle" data-guide="remove" data-label="Toque para retirar">Toque para retirar</button><button class="icon-btn" data-action="guide-speak" data-guide="remove" aria-label="Ouvir explicação de retirar">🔊</button></div></article></section><aside class="guide-note">✦ Primeiro, use peças do mesmo tamanho. Mais tarde, o jogo mostrará como combinar tamanhos diferentes.</aside><button class="button primary" data-go="map">Ir para as fases <span>→</span></button></main>`,
  );
}
function map(): void {
  const phaseTwo = localStorage.getItem("mdf-level-1-complete") === "true";
  const phaseThree = localStorage.getItem("mdf-level-2-complete") === "true";
  shell(
    `${header("home")}<main class="map-page"><div class="map-intro"><p class="eyebrow">MUNDO 1</p><h1>Partes de um inteiro</h1><p>Ajude Tico a atravessar o vale. Cada ponte precisa ter o tamanho exato.</p></div><div class="level-path"><button class="level-node unlocked" data-go="level"><span>1</span><strong>Duas metades</strong><small>Jogar</small></button><div class="path-line"></div>${phaseTwo ? '<button class="level-node unlocked" data-action="open-level-two"><span>2</span><strong>Três terços</strong><small>Jogar</small></button>' : '<div class="level-node locked"><span>2</span><strong>Três terços</strong><small>Complete a fase 1</small></div>'}<div class="path-line"></div>${phaseThree ? '<button class="level-node unlocked" data-action="open-level-three"><span>3</span><strong>Juntar e retirar</strong><small>Novo!</small></button>' : '<div class="level-node locked"><span>3</span><strong>Juntar e retirar</strong><small>Complete a fase 2</small></div>'}</div><aside class="map-tip"><span>✦</span><p><strong>Sua missão:</strong> experimente as peças. Uma ponte que alcança o outro lado revela uma descoberta.</p></aside></main>`,
  );
}
function level(): void {
  lessonIntro();
}
function lessonIntro(): void {
  shell(
    `${header("map")}<main class="lesson-intro"><section class="lesson-card"><div class="lesson-icon">½</div><p class="eyebrow">ANTES DE COMEÇAR</p><h1>O que é uma metade?</h1><p>Imagine uma ponte inteira dividida em <strong>duas partes iguais</strong>. Cada uma dessas partes é uma metade: <b>${fraction("1/2")}</b>.</p><div class="lesson-visual"><span class="half filled"></span><span class="half filled"></span><strong>1 inteiro</strong></div><div class="lesson-steps"><span><b>1</b> Escolha peças</span><span><b>2</b> Monte a expressão</span><span><b>3</b> Teste a ponte</span></div><button class="button primary" data-action="start-level">Entendi, vamos jogar <span>→</span></button></section></main>`,
  );
}
function startLevel(): void {
  currentLevel = 1;
  cards = [];
  deckOrder = [];
  renderLevel();
  say(
    "Fase um: Duas metades. Use as cartas para construir uma ponte que complete um inteiro.",
  );
}
function startLevelTwo(): void {
  if (localStorage.getItem("mdf-level-1-complete") !== "true") {
    map();
    return;
  }
  currentLevel = 2;
  cards = [];
  deckOrder = [];
  renderLevel();
  say(
    "Fase dois: Três terços. Use três partes iguais para completar um inteiro.",
  );
}
function startLevelThree(): void {
  if (localStorage.getItem("mdf-level-2-complete") !== "true") {
    map();
    return;
  }
  currentLevel = 3;
  cards = [];
  deckOrder = [];
  renderLevel();
  say(
    "Fase três: Juntar e retirar. Use mais e menos para completar um inteiro.",
  );
}
function renderLevel(
  message = "Arraste ou toque nas cartas para construir a expressão.",
): void {
  const levelTwo = currentLevel === 2;
  const levelThree = currentLevel === 3;
  const values: Record<string, string> = levelThree
    ? {
        halfA: fraction("1/2"),
        plusA: "+",
        threeQuarter: fraction("3/4"),
        minus: "−",
        quarterA: fraction("1/4"),
        third: fraction("1/3"),
      }
    : levelTwo
      ? {
          thirdA: fraction("1/3"),
          plusA: "+",
          thirdB: fraction("1/3"),
          plusB: "+",
          thirdC: fraction("1/3"),
          minus: "−",
          half: fraction("1/2"),
          quarter: fraction("1/4"),
        }
      : {
          halfA: fraction("1/2"),
          plus: "+",
          halfB: fraction("1/2"),
          minus: "−",
          third: fraction("1/3"),
          quarterA: fraction("1/4"),
          quarterB: fraction("1/4"),
          fifth: fraction("1/5"),
        };
  const expression = evaluateExpression(cards);
  const total = expression.valid ? expression.result : new Fraction(0, 1);
  const numericTotal = Math.max(0, total.toNumber());
  const coverage = Math.min(numericTotal, 1) * 100;
  const bridgeWidth = Math.max(1, numericTotal * 25);
  const fillWidth = expression.valid ? 100 : coverage;
  const phaseName = levelThree
    ? "Juntar e retirar"
    : levelTwo
      ? "Três terços"
      : "Duas metades";
  const phaseDescription = levelThree
    ? "Use + e − para formar exatamente 1 inteiro."
    : levelTwo
      ? "Use três partes iguais para completar 1 inteiro."
      : "Complete 1 inteiro para encontrar a Luma.";
  const shownMessage = expression.valid
    ? expression.message || message
    : expression.message;
  shell(
    `${header("map")}<main class="level-page"><section class="level-title"><div><p class="eyebrow">FASE ${currentLevel} • ${levelThree ? "DUAS OPERAÇÕES" : levelTwo ? "PARTES EM TRÊS" : "PRIMEIRA PONTE"}</p><h1>${phaseName} <span class="star-meter">★ ☆ ☆</span></h1><p>${phaseDescription}</p></div><div class="quest-chip">✦ MISSÃO: criar uma ponte inteira</div><button class="listen" data-action="listen">🔊 Ouvir instrução</button></section><section class="world" aria-label="Vale da ponte"><img class="world-bg" src="/assets/background/background.png" alt="Vale com dois penhascos"/><div class="world-shade"></div><div class="goal-badge">OBJETIVO <strong>${fraction("1/1")}</strong></div><div class="character-tag tag-tico">TICO</div><div class="character-tag tag-luma">LUMA</div><img class="dino tico" src="/assets/dinos/dino_red_idle.png" alt="Tico"/><img class="dino luma" src="/assets/dinos/dino_blue_idle.png" alt="Luma"/><div class="bridge" style="width:${bridgeWidth}%"><div class="bridge-fill" style="width:${fillWidth}%"></div>${cards
      .filter((x) => !isOperator(x))
      .map(
        (_, i) =>
          `<i style="left:${(i + 1) * (100 / Math.max(1, cards.filter((x) => !isOperator(x)).length))}%"></i>`,
      )
      .join(
        "",
      )}</div><div class="measure">Sua ponte: <b>${expression.valid ? fraction(total.toString()) : "—"}</b> de 1 inteiro</div></section><section class="workbench"><div class="expression"><span class="label">SUA EXPRESSÃO</span><div class="dropzone">${cards.length ? cards.map((id) => `<button class="mini-card" data-remove="${id}">${values[id]}</button>`).join("") : '<span class="placeholder">Escolha as peças que formam a ponte</span>'}</div><p class="feedback">${shownMessage}</p></div><div class="deck"><span class="label">PEÇAS MÁGICAS</span><div class="card-list">${orderedDeckKeys(
      Object.keys(values),
    )
      .map(
        (id) =>
          `<button class="math-card ${cards.includes(id) ? "used" : ""}" data-card="${id}" ${cards.includes(id) ? "disabled" : ""}>${values[id]}</button>`,
      )
      .join(
        "",
      )}</div></div><div class="play-actions"><button class="button reset" data-action="reset">↻ Refazer</button><button class="button primary" data-action="play">Testar ponte <span>▶</span></button></div></section><aside class="operation-guide"><div><strong>＋ Juntar</strong><span>${fraction("1/2")} + ${fraction("1/2")} = 1</span><small>Partes iguais: junte os numeradores.</small></div><div><strong>− Retirar</strong><span>${fraction("3/4")} − ${fraction("1/4")} = ${fraction("1/2")}</span><small>Retire partes do mesmo tamanho.</small></div></aside></main>`,
  );
}
function assess(): void {
  const isFraction = (id: string) => !isOperator(id);
  const sameCards = (a: string[], b: string[]): boolean =>
    a.length === b.length &&
    [...a].sort().join("|") === [...b].sort().join("|");
  const correctShape =
    currentLevel === 1
      ? cards.length === 3 &&
        isFraction(cards[0]) &&
        cards[1] === "plus" &&
        isFraction(cards[2])
      : currentLevel === 2
        ? cards.length === 5 &&
          isFraction(cards[0]) &&
          isOperator(cards[1]) &&
          isFraction(cards[2]) &&
          isOperator(cards[3]) &&
          isFraction(cards[4]) &&
          sameCards(
            [cards[0], cards[2], cards[4]],
            ["thirdA", "thirdB", "thirdC"],
          ) &&
          sameCards([cards[1], cards[3]], ["plusA", "plusB"])
        : cards.length === 5 &&
          sameCards([cards[0], cards[2]], ["halfA", "threeQuarter"]) &&
          cards[1] === "plusA" &&
          cards[3] === "minus" &&
          cards[4] === "quarterA";
  const evaluated = evaluateExpression(cards);
  const sum = evaluated.result;
  const correct =
    evaluated.valid &&
    evaluated.complete &&
    correctShape &&
    sum.equals(new Fraction(1, 1));
  if (!correct) {
    const feedback =
      !evaluated.valid || !evaluated.complete
        ? evaluated.message
        : cards.length
          ? sum.toNumber() > 1
            ? `A ponte mede ${sum.toString()}: ela ultrapassa o outro lado. Tente formar exatamente 1 inteiro.`
            : "A ponte ainda não alcança o outro lado. Observe a medida e tente de novo."
          : "Escolha as peças primeiro.";
    renderLevel(feedback);
    say(feedback);
    return;
  }
  renderLevel("A ponte está pronta! Tico consegue atravessar.");
  animateTico();
}
function animateTico(): void {
  const dino = document.querySelector<HTMLImageElement>(".tico");
  const tag = document.querySelector<HTMLElement>(".tag-tico");
  if (!dino) {
    discovery();
    return;
  }
  const frames = [
    "/assets/dinos/dino_red_running_1.png",
    "/assets/dinos/dino_red_running_2.png",
    "/assets/dinos/dino_red_running_3.png",
  ];
  let index = 0;
  void dino.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dino.classList.add("walking");
      tag?.classList.add("walking");
    });
  });
  const cycle = window.setInterval(() => {
    dino.src = frames[index++ % frames.length];
  }, 150);
  window.setTimeout(
    () => {
      window.clearInterval(cycle);
      discovery();
    },
    settings.reducedMotion ? 0 : 1800,
  );
}
function discovery(): void {
  const level = currentLevel;
  const title =
    level === 3
      ? "Você dominou duas operações!"
      : level === 2
        ? "Você juntou três terços!"
        : "Você completou um inteiro!";
  const explanation =
    level === 3
      ? "Você juntou três quartos e uma metade, depois retirou um quarto. O resultado encaixou exatamente no inteiro."
      : level === 2
        ? "Três terços do mesmo tamanho se juntam para formar um inteiro completo."
        : "Duas metades do mesmo tamanho se juntam para formar um inteiro completo.";
  const equation =
    level === 3
      ? `${fraction("1/2")} <strong>+</strong> ${fraction("3/4")} <strong>−</strong> ${fraction("1/4")} <strong>=</strong> <b>1</b>`
      : level === 2
        ? `${fraction("1/3")} <strong>+</strong> ${fraction("1/3")} <strong>+</strong> ${fraction("1/3")} <strong>=</strong> <b>1</b>`
        : `${fraction("1/2")} <strong>+</strong> ${fraction("1/2")} <strong>=</strong> ${fraction("2/2")} <strong>=</strong> <b>1</b>`;
  const modal = document.createElement("div");
  modal.className = "modal-wrap";
  modal.innerHTML = `<div class="discovery"><span class="spark">✦</span><p class="eyebrow">NOVA DESCOBERTA</p><h2>${title}</h2><div class="equation">${equation}</div><p>${explanation}</p><div><button class="button ghost" data-modal="listen">🔊 Ouvir</button><button class="button primary" data-modal="close">${level === 3 ? "Ir ao Mundo 2" : "Próxima fase"} →</button></div></div>`;
  document.body.append(modal);
  modal.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button",
    );
    if (!button) return;
    if (button.dataset.modal === "listen") say(`${title}. ${explanation}`);
    if (button.dataset.modal === "close") {
      modal.remove();
      if (level === 1) {
        localStorage.setItem("mdf-level-1-complete", "true");
        nextLevel();
      } else if (level === 2) {
        localStorage.setItem("mdf-level-2-complete", "true");
        nextLevelThree();
      } else worldTwoGuide();
    }
  });
  say(`${title}. ${explanation}`);
}
function nextLevel(): void {
  shell(
    `${header("map")}<main class="lesson-intro"><section class="lesson-card"><div class="lesson-icon">⅓</div><p class="eyebrow">FASE 2 • NOVA DESCOBERTA</p><h1>Três partes iguais</h1><p>Agora a ponte será dividida em três partes do mesmo tamanho. Cada parte é um terço: <b>${fraction("1/3")}</b>.</p><div class="lesson-visual thirds"><span class="half filled"></span><span class="half filled"></span><span class="half filled"></span><strong>1 inteiro</strong></div><div class="lesson-steps"><span><b>✦</b> Fase 1 concluída</span><span><b>2</b> Pronto para jogar</span></div><button class="button primary" data-action="start-level-two">Começar Fase 2 <span>→</span></button></section></main>`,
  );
}
function nextLevelThree(): void {
  shell(
    `${header("map")}<main class="lesson-intro"><section class="lesson-card"><div class="lesson-icon">+−</div><p class="eyebrow">FASE 3 • DESAFIO DUPLO</p><h1>Juntar e retirar</h1><p>Use as duas ferramentas para construir uma ponte que encaixe exatamente no destino.</p><div class="lesson-steps"><span><b>＋</b> Junte partes</span><span><b>−</b> Retire partes</span></div><button class="button primary" data-action="start-level-three">Começar Fase 3 <span>→</span></button></section></main>`,
  );
}
function worldTwoGuide(): void {
  shell(
    `${header("map")}<main class="guide-page"><p class="eyebrow">PRÓXIMO CAPÍTULO • MUNDO 2</p><h1>Transformar partes</h1><p class="page-lead">Toque nas peças abaixo para ver o que <b>×</b> e <b>÷</b> fazem com uma ponte.</p><section class="guide-grid"><article class="guide-card"><span class="guide-symbol">×</span><h2>Multiplicar</h2><div class="guide-bar" data-guide="multiply"><span class="guide-piece piece-a"></span><span class="guide-piece piece-b"></span></div><div class="guide-caption" aria-live="polite">${fraction("1/2")}<b>×</b><span>2</span><b>=</b><strong data-guide-result="multiply">?</strong></div><p>Repetir a mesma parte pode completar a unidade.</p><div class="guide-actions"><button class="button ghost guide-toggle" data-action="guide-toggle" data-guide="multiply" data-label="Toque para multiplicar">Toque para multiplicar</button><button class="icon-btn" data-action="guide-speak" data-guide="multiply" aria-label="Ouvir explicação de multiplicar">🔊</button></div></article><article class="guide-card"><span class="guide-symbol minus-symbol">÷</span><h2>Dividir</h2><div class="guide-bar" data-guide="divide"><span class="guide-piece piece-a"></span></div><div class="guide-caption" aria-live="polite">${fraction("1/2")}<b>÷</b><span>2</span><b>=</b><strong data-guide-result="divide">?</strong></div><p>Dividir uma parte cria pedaços ainda menores.</p><div class="guide-actions"><button class="button ghost guide-toggle" data-action="guide-toggle" data-guide="divide" data-label="Toque para dividir">Toque para dividir</button><button class="icon-btn" data-action="guide-speak" data-guide="divide" aria-label="Ouvir explicação de dividir">🔊</button></div></article></section><aside class="guide-note">✦ As fases do Mundo 2 serão liberadas quando as novas pontes estiverem prontas.</aside><button class="button ghost" data-go="map">Voltar ao mapa do Mundo 1</button></main>`,
  );
}
function settingsPage(accessibility = false): void {
  const title = accessibility ? "Acessibilidade" : "Configurações";
  const items = accessibility
    ? [
        ["tts", "Narrador por voz", "Lê instruções, feedbacks e descobertas."],
        [
          "reducedMotion",
          "Reduzir movimento",
          "Diminui animações e transições.",
        ],
        [
          "highContrast",
          "Alto contraste",
          "Aumenta a diferença entre cores e textos.",
        ],
      ]
    : [
        ["darkTheme", "Tema escuro", "Usa uma paleta escura e confortável."],
        ["sound", "Sons do jogo", "Ativa os sons de interação."],
        ["tts", "Narrador por voz", "Ativa explicações narradas."],
        [
          "reducedMotion",
          "Ritmo visual tranquilo",
          "Reduz movimentos decorativos.",
        ],
      ];
  const volumeRow = accessibility
    ? ""
    : `<label class="setting setting-slider"><span><strong>Volume</strong><small>Ajusta o volume da música e dos sons do jogo.</small></span><span class="volume-control"><input type="range" min="0" max="100" step="1" value="${settings.volume}" style="--val:${settings.volume}%" data-setting="volume" aria-label="Volume" ${settings.sound ? "" : "disabled"}/><b>${settings.volume}%</b></span></label>`;
  shell(
    `${header("home")}<main class="simple-page"><p class="eyebrow">SEU JEITO DE JOGAR</p><h1>${title}</h1><p class="page-lead">Você pode mudar estas opções a qualquer momento. Elas são salvas apenas neste dispositivo.</p><section class="settings-card">${items.map(([key, name, desc]) => `<label class="setting"><span><strong>${name}</strong><small>${desc}</small></span><input type="checkbox" data-setting="${key}" ${settings[key as keyof Settings] ? "checked" : ""}/><i></i></label>`).join("")}${volumeRow}</section></main>`,
  );
}
function about(): void {
  shell(
    `${header("home")}<main class="simple-page about"><p class="eyebrow">SOBRE O PROJETO</p><h1>Um mundo onde a matemática ganha forma.</h1><p class="page-lead">Mundo das Frações é um jogo educativo brasileiro para apresentar frações por meio de exploração, construção e descobertas visuais.</p><section class="about-grid"><article><span>◈</span><h3>Aprender fazendo</h3><p>Em vez de responder a um quiz, a pessoa joga e observa as consequências das suas escolhas.</p></article><article><span>♿</span><h3>Ritmo respeitoso</h3><p>Sem cronômetros, com linguagem acolhedora e controles de estímulos desde o começo.</p></article><article><span>✦</span><h3>Primeiro slice</h3><p>Esta versão demonstra o primeiro desafio: compreender que duas metades formam um inteiro.</p></article></section><section class="project-details"><span>TECNOLOGIAS</span><strong>TypeScript · Vite · Web Speech API</strong><span>TIPOGRAFIA</span><strong>Fraunces e DM Sans</strong><span>REPOSITÓRIO</span><strong><a href="https://github.com/Isamuh/mundo-das-fracoes.git" target="_blank" rel="noreferrer noopener">github.com/Isamuh/mundo-das-fracoes</a></strong></section></main>`,
  );
}
function credits(): void {
  shell(
    `${header("home")}<main class="simple-page credits"><p class="eyebrow">CRÉDITOS</p><h1>Feito para criar conexões.</h1><section class="credits-card"><div><span>PROGRAMAÇÃO</span><strong>David Isamu (Github: @Isamuh), Leonardo Tudela</strong></div><div><span>ARTE</span><strong>Pedro Henrique</strong></div><div><span>CONCEITO E DESIGN</span><strong>Leonardo Tudela, Daniel Cezar</strong></div><div><span>DESIGN EDUCACIONAL</span><strong>Ismael Prado</strong></div><p>Obrigado por ajudar a tornar a matemática mais concreta, curiosa e acolhedora.</p></section></main>`,
  );
}

app.addEventListener("click", (event) => {
  const element = (event.target as HTMLElement).closest<HTMLElement>("button");
  if (!element) return;
  const go = element.dataset.go;
  if (go)
    (
      ({
        home,
        map,
        level,
        "operations-guide": operationsGuide,
        accessibility: () => settingsPage(true),
        settings: () => settingsPage(false),
        about,
        credits,
      }) as Record<string, () => void>
    )[go]?.();
  startMusic();
  const id = element.dataset.card;
  if (id && !cards.includes(id)) {
    if (
      isOperator(id) &&
      cards.length > 0 &&
      isOperator(cards[cards.length - 1])
    )
      return;
    cards.push(id);
    renderLevel();
  }
  const remove = element.dataset.remove;
  if (remove) {
    cards = cards.filter((x) => x !== remove);
    renderLevel();
  }
  if (element.dataset.action === "reset") {
    cards = [];
    renderLevel("Tudo bem recomeçar. Escolha as peças com calma.");
  }
  if (element.dataset.action === "play") assess();
  if (element.dataset.action === "listen")
    say(
      currentLevel === 3
        ? "Fase três. Use mais e menos para construir exatamente um inteiro."
        : currentLevel === 2
          ? "Fase dois. Use três terços e duas cartas de mais para construir um inteiro."
          : "Fase um. Use as cartas para construir uma ponte que complete um inteiro.",
    );
  if (element.dataset.action === "guide-toggle" && element.dataset.guide)
    toggleGuide(element.dataset.guide);
  if (element.dataset.action === "guide-speak" && element.dataset.guide)
    speakGuide(element.dataset.guide);
  if (element.dataset.action === "start-level") startLevel();
  if (
    element.dataset.action === "start-level-two" ||
    element.dataset.action === "open-level-two"
  )
    startLevelTwo();
  if (
    element.dataset.action === "start-level-three" ||
    element.dataset.action === "open-level-three"
  )
    startLevelThree();
  if (element.dataset.modal === "close") {
    localStorage.setItem("mdf-level-1-complete", "true");
    map();
  }
  if (element.dataset.modal === "listen")
    say(
      "Duas metades do mesmo tamanho se juntam para formar um inteiro completo.",
    );
});
app.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.dataset.setting !== "volume") return;
  const value = Number(input.value);
  backgroundMusic.volume = value / 100;
  input.style.setProperty("--val", `${value}%`);
  const output = input.nextElementSibling;
  if (output) output.textContent = `${value}%`;
});
app.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  const key = input.dataset.setting as keyof Settings | undefined;
  if (!key) return;
  if (key === "volume") {
    settings.volume = Number(input.value);
    save();
    return;
  }
  settings[key] = input.checked;
  if (key === "sound") {
    if (!input.checked) backgroundMusic.pause();
    if (app.querySelector(".settings-card"))
      settingsPage(app.querySelector("h1")?.textContent === "Acessibilidade");
  }
  save();
});
home();
