/* Set Detective — JavaScript puro, sem dependências ou requisições externas. */
(() => {
  "use strict";

  /* Cada região é disjunta: ab, ac e bc excluem a interseção tripla. */
  const REGIONS = {
    a: { short: "Só A", xy2: [27, 48], xy3: [29, 27] },
    b: { short: "Só B", xy2: [73, 48], xy3: [71, 27] },
    c: { short: "Só C", xy3: [50, 77] },
    ab: { short: "A ∩ B", xy2: [50, 48], xy3: [50, 21] },
    ac: { short: "A ∩ C", xy3: [35.5, 55] },
    bc: { short: "B ∩ C", xy3: [64.5, 55] },
    abc: { short: "A ∩ B ∩ C", xy3: [50, 46] },
    none: { short: "Nenhum", xy2: [87, 86], xy3: [89, 88] }
  };
  const keysFor = count => count === 2 ? ["a", "ab", "b", "none"] : ["a", "b", "c", "ab", "ac", "bc", "abc", "none"];
  const sum = values => values.reduce((total, value) => total + value, 0);

  function derive(count, regions) {
    const r = { c: 0, ac: 0, bc: 0, abc: 0, ...regions };
    const union = sum(keysFor(count).filter(k => k !== "none").map(k => r[k]));
    return {
      count, solution: { ...regions, union }, universe: union + r.none,
      totals: {
        a: r.a + r.ab + r.ac + r.abc,
        b: r.b + r.ab + r.bc + r.abc,
        c: r.c + r.ac + r.bc + r.abc,
        ab: r.ab + r.abc, ac: r.ac + r.abc, bc: r.bc + r.abc, abc: r.abc
      }
    };
  }

  const MISSIONS = [
    {
      ...derive(2, { a: 15, ab: 10, b: 8, none: 7 }),
      title: "Clube Escolar", storyTitle: "O mistério da quadra", sets: ["Futebol", "Basquete"],
      story: "A lista dos clubes da escola ficou confusa: alguns nomes aparecem em dois esportes. Investigue uma turma de 40 estudantes e descubra quantos estão em cada grupo.",
      clues: [[40, "estudantes na turma"], [25, "jogam futebol"], [18, "jogam basquete"], [10, "jogam os dois esportes"]],
      labels: { a: "Só futebol", b: "Só basquete", ab: "Os dois esportes", none: "Nenhum esporte", union: "Pelo menos um esporte" },
      note: "Os 10 que jogam os dois já estão incluídos nos 25 do futebol e nos 18 do basquete.",
      hints: ["Comece pela interseção: a pista já informa quantos estudantes praticam os dois esportes.", "Só futebol = 25 − 10. Para só basquete, use o mesmo raciocínio com o total do basquete.", "Para a união, some os totais dos esportes e subtraia a interseção: 25 + 18 − 10.", "Quem não pratica nenhum esporte está fora dos dois círculos: universo − união. Confira se as quatro regiões somam 40."]
    },
    {
      ...derive(2, { a: 34, ab: 28, b: 27, none: 11 }),
      title: "Redes Sociais", storyTitle: "Perfis duplicados", sets: ["Instagram", "TikTok"],
      story: "Uma pesquisa com 100 estudantes encontrou usuários de Instagram e TikTok. Há gente nas duas redes e gente fora delas. Reconstrua o mapa sem duplicar nenhum perfil.",
      clues: [[100, "estudantes na pesquisa"], [62, "usam Instagram"], [55, "usam TikTok"], [28, "usam as duas redes"]],
      labels: { a: "Só Instagram", b: "Só TikTok", ab: "As duas redes", none: "Nenhuma rede", union: "Pelo menos uma rede" },
      note: "Uma pessoa com dois perfis continua sendo uma única pessoa na união.",
      hints: ["Quem usa as duas redes ocupa a região de encontro dos círculos. Essa pista não precisa ser calculada.", "Só Instagram = 62 − 28. Desconte os usuários das duas redes também do total do TikTok.", "A união é 62 + 55 − 28: a interseção foi somada duas vezes e deve ser descontada uma vez.", "O grupo de nenhuma rede é 100 menos a união. As quatro regiões disjuntas devem somar 100."]
    },
    {
      ...derive(3, { a: 40, b: 30, c: 25, ab: 30, ac: 25, bc: 20, abc: 25, none: 5 }),
      title: "Festa de Lançamento", storyTitle: "Três gostos, um caso", sets: ["Jogos", "Filmes", "Música"],
      story: "Entre 200 convidados de uma festa de lançamento, há fãs de jogos, filmes e música. As listas se cruzam. Encontre o lugar de cada convidado e descubra quem não gosta de nenhuma opção.",
      clues: [[200, "convidados no universo"], [120, "gostam de jogos"], [105, "gostam de filmes"], [95, "gostam de música"], [55, "gostam de jogos e filmes"], [50, "gostam de jogos e música"], [45, "gostam de filmes e música"], [25, "gostam dos três"]],
      labels: { a: "Só jogos", b: "Só filmes", c: "Só música", ab: "Jogos e filmes, sem música", ac: "Jogos e música, sem filmes", bc: "Filmes e música, sem jogos", abc: "Os três gostos", none: "Nenhum dos três", union: "Pelo menos uma opção" },
      note: "Atenção: as pistas de cada par incluem os 25 convidados que gostam dos três.",
      hints: ["Comece pelo centro: 25 gostam dos três. Nas pistas dos pares, esses 25 também estão incluídos.", "Jogos e filmes, sem música = 55 − 25. Faça o mesmo nos outros pares antes de calcular as regiões de um só gosto.", "Só jogos = 120 − (55 − 25) − (50 − 25) − 25. Aplique o mesmo raciocínio a filmes e música.", "União = 120 + 105 + 95 − 55 − 50 − 45 + 25. Some a tripla no fim porque ela foi descontada demais. Nenhum = 200 − união."]
    }
  ];

  const THEORY = [
    ["{ }", "Conjunto", "Uma coleção de elementos com alguma característica em comum.", "A = {Ana, Bia, Caio}: um conjunto de três pessoas."],
    ["U", "Universo", "O grupo completo considerado no problema. Todos os conjuntos do caso estão dentro dele.", "Se a pesquisa é com uma turma de 40 alunos, n(U) = 40."],
    ["n(A)", "Cardinalidade", "É a quantidade de elementos distintos de um conjunto. Cada elemento entra uma única vez.", "Se A = {2, 4, 6}, então n(A) = 3."],
    ["A ∪ B", "União", "Reúne quem pertence a A, a B ou a ambos. É a expressão “pelo menos um”.", "{1, 2} ∪ {2, 3} = {1, 2, 3}."],
    ["A ∩ B", "Interseção", "Reúne apenas os elementos que pertencem aos dois conjuntos ao mesmo tempo.", "{1, 2} ∩ {2, 3} = {2}."],
    ["A − B", "Diferença", "Reúne os elementos de A que não pertencem a B. A ordem dos conjuntos importa.", "{1, 2} − {2, 3} = {1}. Já B − A = {3}."],
    ["Aᶜ", "Complementar", "É tudo que está no universo, mas não está em A. O universo precisa ser conhecido.", "Se U = {1, 2, 3, 4} e A = {1, 2}, então Aᶜ = {3, 4}."],
    ["◯◯", "Diagrama de Venn", "Um mapa dos conjuntos. Os círculos mostram os grupos; as partes sobrepostas mostram as interseções.", "O retângulo representa o universo. Fora dos círculos fica quem não está em nenhum deles."],
    ["+ − +", "Inclusão-exclusão", "Some os conjuntos e corrija as repetições. Para dois, subtraia a interseção. Para três, subtraia os pares e some a tripla.", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Para três: A + B + C − AB − AC − BC + ABC, usando as cardinalidades."]
  ];

  const CONTEXTS = [
    { title: "Intervalo cultural", sets: ["Leitura", "Cinema", "Teatro"], verb: "participam de", group: "estudantes", story: "A escola mapeou as atividades culturais dos estudantes. Os nomes aparecem em mais de uma lista. Investigue as preferências." },
    { title: "Feira de tecnologia", sets: ["Robótica", "Programação", "Design"], verb: "se interessam por", group: "visitantes", story: "Na feira de tecnologia, visitantes escolheram áreas de interesse. Uma pessoa pode escolher várias áreas. Organize os dados da pesquisa." },
    { title: "Festival da escola", sets: ["Dança", "Música", "Fotografia"], verb: "escolheram", group: "participantes", story: "As inscrições do festival chegaram misturadas. Há participantes em várias oficinas e outros que ainda não escolheram nenhuma. Reconstrua as listas." },
    { title: "Biblioteca em movimento", sets: ["Aventura", "Fantasia", "Mistério"], verb: "leem", group: "leitores", story: "A biblioteca pesquisou os gêneros favoritos de seus leitores. Alguns leem mais de um gênero. Descubra o que as listas revelam." },
    { title: "Clube de ciências", sets: ["Astronomia", "Biologia", "Química"], verb: "estudam", group: "integrantes", story: "O clube de ciências reuniu as escolhas de estudo dos integrantes. As listas têm nomes repetidos. Use as pistas para separar os grupos." }
  ];

  function randomInt(min, max, rng = Math.random) { return Math.floor(rng() * (max - min + 1)) + min; }
  function makeChallenge(index, rng = Math.random) {
    const context = CONTEXTS[index % CONTEXTS.length];
    const count = randomInt(2, 3, rng);
    const regions = {};
    keysFor(count).forEach(k => { regions[k] = randomInt(k === "none" ? 0 : 2, 24, rng); });
    const data = derive(count, regions);
    const [a, b, c] = context.sets;
    const labels = { a: `Só ${a.toLowerCase()}`, b: `Só ${b.toLowerCase()}`, c: `Só ${c.toLowerCase()}`, ab: count === 2 ? `${a} e ${b}` : `${a} e ${b}, sem ${c.toLowerCase()}`, ac: `${a} e ${c}, sem ${b.toLowerCase()}`, bc: `${b} e ${c}, sem ${a.toLowerCase()}`, abc: "As três opções", none: "Nenhuma opção", union: "Pelo menos uma opção" };
    const clues = [[data.universe, `${context.group} na pesquisa`], [data.totals.a, `${context.verb} ${a.toLowerCase()}`], [data.totals.b, `${context.verb} ${b.toLowerCase()}`]];
    if (count === 3) clues.push([data.totals.c, `${context.verb} ${c.toLowerCase()}`]);
    clues.push([data.totals.ab, `${context.verb} ${a.toLowerCase()} e ${b.toLowerCase()}`]);
    if (count === 3) clues.push([data.totals.ac, `${context.verb} ${a.toLowerCase()} e ${c.toLowerCase()}`], [data.totals.bc, `${context.verb} ${b.toLowerCase()} e ${c.toLowerCase()}`], [data.totals.abc, "escolheram as três opções"]);
    const questions = [
      { type: "union", text: "Quantas pessoas escolheram pelo menos uma opção?", answer: data.solution.union, explanation: "Use a inclusão-exclusão para contar a união, corrigindo as repetições." },
      { type: "none", text: "Quantas pessoas não escolheram nenhuma das opções?", answer: regions.none, explanation: `Nenhuma = universo − união = ${data.universe} − ${data.solution.union} = ${regions.none}.` },
      { type: "a", text: `Quantas pessoas escolheram somente ${a.toLowerCase()}?`, answer: regions.a, explanation: count === 2 ? `Só A = n(A) − n(A ∩ B) = ${data.totals.a} − ${data.totals.ab} = ${regions.a}.` : `Só A = n(A) − n(A ∩ B) − n(A ∩ C) + n(A ∩ B ∩ C) = ${data.totals.a} − ${data.totals.ab} − ${data.totals.ac} + ${data.totals.abc} = ${regions.a}.` },
      { type: "one", text: "Quantas pessoas escolheram exatamente uma opção?", answer: regions.a + regions.b + (regions.c || 0), explanation: `Exatamente uma = soma das regiões de um só conjunto = ${regions.a} + ${regions.b}${count === 3 ? ` + ${regions.c}` : ""} = ${regions.a + regions.b + (regions.c || 0)}.` }
    ];
    if (count === 3) questions.push({ type: "ab", text: `Quantas pessoas escolheram ${a.toLowerCase()} e ${b.toLowerCase()}, mas não ${c.toLowerCase()}?`, answer: regions.ab, explanation: `A e B, sem C = n(A ∩ B) − n(A ∩ B ∩ C) = ${data.totals.ab} − ${data.totals.abc} = ${regions.ab}.` });
    return {
      ...data, title: context.title, storyTitle: "Um novo indício", story: context.story,
      sets: context.sets.slice(0, count), labels, clues,
      note: count === 3 ? "Os pares incluem a região dos três. O rascunho é opcional: responda à pergunta final." : "O rascunho é opcional. Apenas a resposta da pergunta final vale pontos.",
      question: questions[randomInt(0, questions.length - 1, rng)],
      hints: ["Observe o que a pergunta pede: “pelo menos uma” é união; “nenhuma” fica fora dos círculos; “somente” exclui as interseções.", count === 3 ? "Comece pelo centro e desconte a interseção tripla dos pares. Depois encontre as regiões de um só conjunto." : "Desconte a interseção de cada conjunto para achar suas regiões exclusivas.", "Para a união, some os conjuntos e subtraia os pares. Se houver três conjuntos, some a interseção tripla no fim."]
    };
  }

  function makeChallengeSet(rng = Math.random) {
    const list = Array.from({ length: 5 }, (_, index) => makeChallenge(index, rng));
    // A sequência é aleatória; não há obrigação de alternar dois e três conjuntos.
    return list;
  }

  function parseAnswer(value, max) {
    const text = String(value ?? "").trim();
    if (!/^\d+$/.test(text)) return null;
    const number = Number(text);
    return Number.isSafeInteger(number) && number >= 0 && number <= max ? number : null;
  }

  function assess(problem, values, challenge = false) {
    if (challenge) {
      const parsed = parseAnswer(values.final, problem.universe);
      return { valid: parsed !== null, correct: parsed === problem.question.answer, wrong: parsed === problem.question.answer ? [] : ["final"] };
    }
    const wrong = [...keysFor(problem.count), "union"].filter(k => parseAnswer(values[k], problem.universe) !== problem.solution[k]);
    return { valid: [...keysFor(problem.count), "union"].every(k => parseAnswer(values[k], problem.universe) !== null), correct: wrong.length === 0, wrong };
  }

  const missionPoints = (attempts, hints) => Math.max(100, 300 - attempts * 30 - hints * 20);
  // API de cálculo pura para verificação automatizada, sem estado do jogador.
  const core = { derive, keysFor, makeChallenge, makeChallengeSet, parseAnswer, assess, missionPoints, missions: MISSIONS };
  if (typeof module !== "undefined" && module.exports) module.exports = core;
  if (typeof document === "undefined") return;

  const $ = id => document.getElementById(id);
  const state = {
    screen: "start", returnScreen: "start", active: false, finished: false,
    stage: "mission", mission: 0, challenge: 0, challenges: [],
    score: 0, attempts: 0, hits: 0, completedMissions: [], completedChallenges: [],
    values: {}, hintCount: 0, errors: 0, resolved: false,
    elapsed: 0, remaining: 60000, deadline: 0, startedAt: 0, clockRunning: false,
    timer: null, celebrationTimer: null
  };
  const current = () => state.stage === "mission" ? MISSIONS[state.mission] : state.challenges[state.challenge];
  const isChallenge = () => state.stage === "challenge";
  const formatTime = ms => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const escapeHTML = text => String(text).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function stopClock() {
    if (state.clockRunning) {
      if (isChallenge()) state.remaining = Math.max(0, state.deadline - Date.now());
      else state.elapsed += Date.now() - state.startedAt;
    }
    state.clockRunning = false;
    clearInterval(state.timer);
    state.timer = null;
  }

  function startClock() {
    if (state.resolved || state.screen !== "game" || state.clockRunning) return;
    state.startedAt = Date.now();
    state.deadline = Date.now() + state.remaining;
    state.clockRunning = true;
    tick();
    if (!state.resolved) state.timer = setInterval(tick, 200);
  }

  function tick() {
    const ms = isChallenge() ? state.deadline - Date.now() : state.elapsed + Date.now() - state.startedAt;
    $("timer").textContent = isChallenge() ? formatTime(Math.max(0, Math.ceil(ms / 1000)) * 1000) : formatTime(ms);
    document.querySelector(".timer-stat").classList.toggle("urgent", isChallenge() && ms <= 10000 && !state.resolved);
    if (isChallenge() && ms <= 0 && !state.resolved) resolveChallenge(false, true);
  }

  function showScreen(name, remember = false) {
    if (remember && state.screen !== "how" && state.screen !== "theory") state.returnScreen = state.screen;
    if (state.screen === "game") stopClock();
    state.screen = name;
    document.querySelectorAll(".screen").forEach(screen => { screen.hidden = screen.id !== `${name}-screen`; });
    if (name === "start") {
      $("play-button").innerHTML = `${state.active && !state.finished ? "Continuar investigação" : "Jogar"} <span aria-hidden="true">↗</span>`;
      $("restart-button").hidden = !state.active || state.finished;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    $("main").focus({ preventScroll: true });
    if (name === "game") startClock();
  }

  function begin() {
    stopClock();
    Object.assign(state, { active: true, finished: false, stage: "mission", mission: 0, challenge: 0, score: 0, attempts: 0, hits: 0, completedMissions: [], completedChallenges: [], challenges: [], returnScreen: "start" });
    prepareCase();
    showScreen("game");
  }

  function prepareCase() {
    stopClock();
    Object.assign(state, { values: {}, hintCount: 0, errors: 0, resolved: false, elapsed: 0, remaining: 60000 });
    renderCase();
  }

  function inputMarkup(key, extraClass = "", idPrefix = "side") {
    const p = current();
    return `<input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="6" id="${idPrefix}-${key}" data-region="${key}" class="${extraClass}" aria-label="${escapeHTML(p.labels[key])}${idPrefix === "diagram" ? " no diagrama" : " no painel"}" placeholder="?" aria-invalid="false" aria-describedby="feedback">`;
  }

  function renderVenn() {
    const p = current(), three = p.count === 3;
    const venn = $("venn");
    venn.classList.toggle("three", three);
    const height = three ? 450 : 400;
    const circles = three ? [
      [206, 159, 125, "#72ebd9"], [334, 159, 125, "#b0b5ff"], [270, 269, 125, "#f3da79"]
    ] : [[185, 190, 132, "#72ebd9"], [355, 190, 132, "#b0b5ff"]];
    venn.innerHTML = `<svg viewBox="0 0 540 ${height}" aria-hidden="true"><rect x="14" y="14" width="512" height="${height - 28}" rx="15" fill="#0b1729" stroke="#344a65"/><text x="32" y="39">U = ${p.universe}</text>${circles.map(([x, y, r, color]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity=".09" stroke="${color}" stroke-width="1.5" stroke-opacity=".85"/>`).join("")}</svg>${keysFor(p.count).map(key => {
      const region = REGIONS[key], xy = three ? region.xy3 : region.xy2;
      const short = three && ["ab", "ac", "bc"].includes(key) ? `${region.short} sem ${key === "ab" ? "C" : key === "ac" ? "B" : "A"}` : region.short;
      return `<label class="region-field" style="left:${xy[0]}%;top:${xy[1]}%" title="${escapeHTML(p.labels[key])}">${inputMarkup(key, "", "diagram")}<span class="region-short">${short}</span></label>`;
    }).join("")}`;
    $("venn-legend").innerHTML = p.sets.map((set, i) => `<span class="legend-item"><span class="legend-dot" aria-hidden="true"></span><strong>${String.fromCharCode(65 + i)}</strong> ${escapeHTML(set)}</span>`).join("");
    $("union-slot").innerHTML = isChallenge()
      ? `<div class="challenge-prompt"><strong>PERGUNTA DO CASO</strong><br>${escapeHTML(p.question.text)}</div>`
      : `<div class="union-row"><label for="diagram-union">${escapeHTML(p.labels.union)}<small>Total da união ${three ? "A ∪ B ∪ C" : "A ∪ B"}</small></label>${inputMarkup("union", "union-input", "diagram")}</div>`;
  }

  function renderCase() {
    const p = current();
    $("mission-kicker").textContent = isChallenge() ? `DESAFIO FINAL / CASO ${state.challenge + 1} DE 5` : `DOSSIÊ ${String(state.mission + 1).padStart(2, "0")} / 03`;
    $("case-title").textContent = p.title;
    $("score").textContent = state.score;
    $("timer-label").textContent = isChallenge() ? "TEMPO RESTANTE" : "TEMPO DE CASO";
    $("timer").textContent = isChallenge() ? "01:00" : "00:00";
    $("timer").setAttribute("aria-label", isChallenge() ? "Tempo restante nesta questão" : "Tempo decorrido nesta missão");
    document.querySelector(".timer-stat").classList.remove("urgent");
    $("mission-track").innerHTML = ["Clube Escolar", "Redes Sociais", "Festa de Lançamento", "Desafio final"].map((title, i) => {
      const active = isChallenge() ? 3 : state.mission;
      return `<li class="${i === active ? "active" : i < active ? "done" : ""}" ${i === active ? 'aria-current="step"' : ""}><span>${i < active ? "✓" : String(i + 1).padStart(2, "0")}</span>${title}</li>`;
    }).join("");
    $("story-title").textContent = p.storyTitle;
    $("story").textContent = p.story;
    $("clues").innerHTML = p.clues.map(([n, clue]) => `<li><strong>${n}</strong><span>${escapeHTML(clue)}</span></li>`).join("");
    $("detective-note").textContent = p.note;
    $("diagram-mode").textContent = `${p.count} CONJUNTOS`;
    $("diagram-instruction").textContent = isChallenge() ? "Use as regiões como rascunho e responda à pergunta final." : "Digite uma quantidade em cada região.";
    renderVenn();
    $("answers-title").textContent = isChallenge() ? "A pergunta final" : "Feche a contagem";
    $("answer-fields").innerHTML = isChallenge() ? "" : [...keysFor(p.count), "union"].map(key => `<div class="answer-row" data-row="${key}"><label for="side-${key}"><span class="answer-dot" aria-hidden="true"></span>${escapeHTML(p.labels[key])}</label>${inputMarkup(key)}</div>`).join("");
    $("challenge-question").hidden = !isChallenge();
    $("challenge-question").innerHTML = isChallenge() ? `<label for="final-answer">${escapeHTML(p.question.text)}</label><input id="final-answer" class="final-answer" data-region="final" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" placeholder="Sua resposta" aria-invalid="false" aria-describedby="final-answer-help feedback"><small id="final-answer-help">Uma tentativa · 100 pontos · ${p.universe} pessoas no universo</small>` : "";
    $("feedback").className = "feedback";
    $("feedback").textContent = isChallenge() ? "O tempo começou. O rascunho é opcional; só a resposta final será avaliada." : "As pistas estão na mesa. Qual é a sua dedução?";
    $("hint-area").hidden = true;
    $("hint-area").innerHTML = "";
    $("explanation").hidden = true;
    $("explanation").innerHTML = "";
    $("next-button").disabled = true;
    $("next-button").innerHTML = `${isChallenge() ? (state.challenge === 4 ? "Ver Resultado" : "Próximo Caso") : (state.mission === 2 ? "Iniciar Desafio Final" : "Próxima Missão")} <span aria-hidden="true">→</span>`;
    ["verify-side", "verify-bottom", "hint-side", "hint-bottom"].forEach(id => { $(id).disabled = false; });
    $("bottom-note").textContent = isChallenge() ? "Cada questão certa vale 100 pontos." : "Toda pessoa conta. Uma vez só.";
  }

  function syncInput(input) {
    const key = input.dataset.region;
    state.values[key] = input.value;
    document.querySelectorAll(`[data-region="${key}"]`).forEach(field => {
      if (field !== input) field.value = input.value;
      field.setAttribute("aria-invalid", "false");
      field.classList.remove("correct");
      field.closest(".region-field, .answer-row")?.classList.remove("correct");
    });
  }

  function setFeedback(message, mode) {
    $("feedback").textContent = message;
    $("feedback").className = `feedback ${mode || ""}`;
  }

  function markFields(wrong, keys) {
    keys.forEach(key => {
      document.querySelectorAll(`[data-region="${key}"]`).forEach(input => {
        const incorrect = wrong.includes(key);
        input.setAttribute("aria-invalid", String(incorrect));
        input.classList.toggle("correct", !incorrect);
        input.closest(".region-field, .answer-row")?.classList.toggle("correct", !incorrect);
      });
    });
  }

  function lockCase() {
    stopClock();
    state.resolved = true;
    document.querySelectorAll("#game-screen input").forEach(input => { input.disabled = true; });
    ["verify-side", "verify-bottom", "hint-side", "hint-bottom"].forEach(id => { $(id).disabled = true; });
    $("next-button").disabled = false;
    document.querySelector(".timer-stat").classList.remove("urgent");
  }

  function verify() {
    if (state.screen !== "game" || state.resolved) return;
    // Date.now impede que uma aba em segundo plano conceda tempo extra.
    if (isChallenge() && state.clockRunning && Date.now() >= state.deadline) { resolveChallenge(false, true); return; }
    const p = current();
    const result = assess(p, state.values, isChallenge());
    if (isChallenge()) {
      if (!result.valid) {
        markFields(["final"], ["final"]);
        setFeedback(`Digite um número inteiro de 0 a ${p.universe} na resposta final. O relógio continua correndo.`, "error");
        $("final-answer").focus();
        return;
      }
      resolveChallenge(result.correct, false);
      return;
    }
    state.attempts++;
    markFields(result.wrong, [...keysFor(p.count), "union"]);
    if (result.correct) {
      state.hits++;
      const points = missionPoints(state.errors, state.hintCount);
      state.score += points;
      lockCase();
      state.completedMissions.push({ title: p.title, points, time: state.elapsed, errors: state.errors, hints: state.hintCount });
      $("score").textContent = state.score;
      setFeedback(`Caso resolvido! +${points} pontos. Você encontrou todas as regiões sem repetir ninguém. A explicação está logo abaixo do mapa.`, "success");
      showExplanation(p, "Uma contagem impecável.");
      celebrate();
    } else {
      state.errors++;
      const first = result.wrong[0];
      const guidance = first === "none" ? "Fora dos círculos: universo menos a união." : first === "union" ? "Na união, corrija as interseções contadas mais de uma vez." : first === "abc" ? "O centro é a quantidade de pessoas que pertencem aos três grupos." : ["ab", "ac", "bc"].includes(first) ? (p.count === 3 ? "A pista do par inclui os três: desconte a interseção tripla." : "A pista informa diretamente quantas pessoas pertencem aos dois grupos.") : "Para achar quem está em um só grupo, retire as regiões compartilhadas do total desse grupo.";
      setFeedback(`${result.wrong.length} ${result.wrong.length === 1 ? "campo precisa" : "campos precisam"} de revisão: ${p.labels[first]}. ${result.valid ? "" : `Use apenas números inteiros de 0 a ${p.universe}. `}${guidance} −30 pontos no valor da missão (mínimo de 100 ao resolver).`, "error");
      document.querySelector(`[data-region="${first}"]`)?.focus({ preventScroll: true });
    }
  }

  function resolveChallenge(correct, timedOut) {
    if (state.resolved || !isChallenge()) return;
    const p = current();
    state.attempts++;
    if (correct) { state.hits++; state.score += 100; }
    markFields(correct ? [] : ["final"], ["final"]);
    lockCase();
    if (timedOut) { state.remaining = 0; $("timer").textContent = "00:00"; }
    $("score").textContent = state.score;
    state.completedChallenges.push({ correct, timedOut, title: p.title });
    setFeedback(correct ? "Dedução correta! +100 pontos. Confira a explicação e avance para o próximo caso." : `${timedOut ? "Tempo esgotado." : "Essa dedução não fechou."} A resposta correta é ${p.question.answer}. Veja como chegar a ela na explicação abaixo.`, correct ? "success" : "error");
    showExplanation(p, correct ? "Mais um mistério resolvido." : "Toda pista ensina alguma coisa.");
    if (correct) celebrate();
  }

  function formulaFor(p) {
    const t = p.totals;
    return p.count === 2
      ? `n(A ∪ B) = ${t.a} + ${t.b} − ${t.ab} = ${p.solution.union}`
      : `n(A ∪ B ∪ C) = ${t.a} + ${t.b} + ${t.c} − ${t.ab} − ${t.ac} − ${t.bc} + ${t.abc} = ${p.solution.union}`;
  }

  function showExplanation(p, title) {
    const explanation = $("explanation");
    explanation.hidden = false;
    explanation.innerHTML = `<p class="eyebrow">CASO EXPLICADO / INCLUSÃO-EXCLUSÃO</p><h2 id="explanation-title">${title}</h2>${isChallenge() ? `<p><strong>${escapeHTML(p.question.text)} Resposta: ${p.question.answer}.</strong><br>${escapeHTML(p.question.explanation)}</p>` : ""}<p>${p.count === 2 ? "Somamos os dois conjuntos e subtraímos a interseção, que apareceu duas vezes." : "Somamos os três conjuntos, subtraímos as interseções dos pares e somamos a tripla. Os elementos do centro foram somados três vezes e subtraídos três vezes; é preciso incluí-los uma vez."}</p><strong class="calculation">${formulaFor(p)}</strong><p>Nenhum = ${p.universe} − ${p.solution.union} = ${p.solution.none}. As regiões abaixo são disjuntas: juntas, incluindo “nenhum”, somam ${p.universe}.</p><div class="solution-grid">${keysFor(p.count).map(key => `<span>${escapeHTML(p.labels[key])}: <b>${p.solution[key]}</b></span>`).join("")}</div>`;
  }

  function hint() {
    if (state.screen !== "game" || state.resolved) return;
    const p = current();
    if (state.hintCount < p.hints.length) state.hintCount++;
    $("hint-area").hidden = false;
    $("hint-area").innerHTML = `<strong>Dica ${state.hintCount} de ${p.hints.length}${isChallenge() ? " · sem desconto" : " · −20 pontos por dica nova"}</strong>${escapeHTML(p.hints[state.hintCount - 1])}`;
  }

  function next() {
    if (!state.resolved) return;
    if (isChallenge()) {
      if (state.challenge === 4) { results(); return; }
      state.challenge++;
    } else if (state.mission === 2) {
      state.stage = "challenge";
      state.challenges = makeChallengeSet();
      state.challenge = 0;
    } else state.mission++;
    prepareCase();
    window.scrollTo({ top: 0, behavior: "instant" });
    $("main").focus({ preventScroll: true });
    startClock();
  }

  function results() {
    stopClock();
    state.finished = true;
    const accuracy = state.attempts ? Math.round(state.hits / state.attempts * 100) : 0;
    const best = [...state.completedMissions].sort((a, b) => b.points - a.points || a.time - b.time)[0];
    const finalHits = state.completedChallenges.filter(item => item.correct).length;
    $("final-score").textContent = state.score.toLocaleString("pt-BR");
    $("final-accuracy").textContent = `${accuracy}%`;
    $("accuracy-detail").textContent = `${state.hits} acertos em ${state.attempts} verificações`;
    $("best-mission").textContent = best.title;
    $("best-detail").textContent = `${best.points} pontos · ${formatTime(best.time)}`;
    $("personal-message").textContent = finalHits === 5 && accuracy >= 80
      ? "Olhar de mestre, detetive! Você acertou os cinco casos finais e mostrou precisão nas deduções. Os conjuntos não escondem mais nada de você."
      : finalHits >= 3 ? `Boa investigação, detetive! Você resolveu ${finalHits} dos 5 casos finais. Seu ponto forte foi ${best.title}. Continue praticando as interseções para ganhar ainda mais precisão.`
      : `Você concluiu as três missões e enfrentou todos os casos, detetive. Sua melhor missão foi ${best.title}. Revise as explicações, comece pelo centro do diagrama e tente superar sua pontuação!`;
    $("result-breakdown").innerHTML = `${state.completedMissions.map(item => `<span>${escapeHTML(item.title)} <strong>${item.points} pts</strong></span>`).join("")}<span>Desafio final <strong>${finalHits}/5 · ${finalHits * 100} pts</strong></span>`;
    showScreen("results");
    celebrate();
  }

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearTimeout(state.celebrationTimer);
    $("celebration").innerHTML = Array.from({ length: 36 }, (_, i) => `<span class="confetti" style="left:${(i * 2.79) % 100}%;animation-delay:${(i % 6) * .05}s;transform:rotate(${i * 23}deg)"></span>`).join("");
    state.celebrationTimer = setTimeout(() => { $("celebration").innerHTML = ""; }, 2300);
  }

  function openHelp() {
    if (state.screen !== "game") return;
    stopClock();
    $("help-dialog").showModal();
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    switch (button.dataset.action) {
      case "play": state.active && !state.finished ? showScreen("game") : begin(); break;
      case "restart": begin(); break;
      case "home": showScreen("start"); break;
      case "how": showScreen("how", true); break;
      case "theory": showScreen("theory", true); break;
      case "back": showScreen(state.returnScreen); break;
      case "verify": verify(); break;
      case "hint": hint(); break;
      case "next": next(); break;
      case "help": openHelp(); break;
      case "close-help": $("help-dialog").close(); break;
    }
  });
  $("answer-form").addEventListener("submit", event => { event.preventDefault(); verify(); });
  $("venn").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); verify(); } });
  $("union-slot").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); verify(); } });
  $("game-screen").addEventListener("input", event => { if (event.target.matches("input[data-region]")) syncInput(event.target); });
  $("help-dialog").addEventListener("close", () => { if (state.screen === "game") startClock(); });
  // Ao voltar de uma aba em segundo plano, confira o prazo real imediatamente.
  document.addEventListener("visibilitychange", () => { if (!document.hidden && state.screen === "game" && state.clockRunning) tick(); });
  window.addEventListener("pagehide", stopClock);
  window.addEventListener("pageshow", () => { if (state.screen === "game" && !$("help-dialog").open) startClock(); });
  $("theory-cards").innerHTML = THEORY.map(([symbol, title, text, example]) => `<article class="info-card theory-card"><span class="symbol" aria-hidden="true">${symbol}</span><h2>${title}</h2><p>${text}</p><small>${example}</small></article>`).join("");
})();
