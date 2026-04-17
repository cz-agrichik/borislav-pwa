// problems.js
(function () {

  const LEVEL_WEIGHTS = {
    not_started: 0,
    touch: 1,
    active: 3,
    progress: 2,
    repeat: 1,
    test: 1000,
    complete: 0
  };

  // --- Утилиты генерации ---
  function randInt(min, maxInclusive) {
    return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
  }

  function pickWeighted(items) {
    const total = items.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of items) {
      r -= x.w;
      if (r <= 0) return x.item;
    }
    return items[items.length - 1].item;
  }

  function ones(x) {
    return x % 10;
  }

  function tens(x) {
    return Math.floor(x / 10);
  }

  // --- Генераторы задач ---
  

  function genSimplestSubtraction() {
    let a, b;
    do {
      a = randInt(2, 9);
      b = randInt(1, 8);
    } while (b >= a);

    return { text: `${a} − ${b} = ?`, correct: a - b };
  }

  function genThreeSingleAddMax19() {
    let a, b, c;
    do {
      a = randInt(1, 9);
      b = randInt(1, 9);
      c = randInt(1, 9);
    } while (a + b + c > 19);

    return { text: `${a} + ${b} + ${c} = ?`, correct: a + b + c };
  }

  function genMinusBorrowOneDigit() {
    let a, b;
    do {
      a = randInt(10, 99);
      b = randInt(1, 9);
    } while (
      ones(a) >= b ||   // есть перенос
      a - b >= 10       // ответ однозначный
    );

    return { text: `${a} − ${b} = ?`, correct: a - b };
  }

  function genDoubleMinusDoubleNoBorrow() {
    let a, b;
    do {
      a = randInt(10, 99);
      b = randInt(10, 99);
    } while (
      ones(a) < ones(b) ||     // без займа единиц
      tens(a) < tens(b)        // без отрицательных десятков
    );

    return { text: `${a} − ${b} = ?`, correct: a - b };
  }

    

  function genFromDataset(list, typeId){
    if (list == null) {
      console.log("list is null");
      console.log(typeId);
    }

    const p = list[Math.floor(Math.random() * list.length)];

    return {
      type: "chess",

      text: p.title,
      title: taskTypeTitle(typeId),
      id: typeId,

      position: ChessUtils.fenToPosition(p.fen),
      legalMoves: ChessUtils.movesToSquares(p.moves)
    };
  }

function genMathFromDataset(list, tag, typeId) {
  console.log("genmath");
  console.log(tag);
  const filtered = list.filter(p => p.tags=== tag);

  const p = filtered[Math.floor(Math.random() * filtered.length)];
  console.log(p);

  return {
    type: "math",
    text: p.text,
    correct: p.answer,
    title: taskTypeTitle(typeId),
    id: typeId
  };
}

  const problemTypes = [    
    {id:"simplest_sub", gen:genSimplestSubtraction},
    {id:"add_3x1d_max19", gen:genThreeSingleAddMax19},
    {id:"minus_borrow_1d", gen:genMinusBorrowOneDigit},
    {id:"double_minus_double_no_borrow", gen:genDoubleMinusDoubleNoBorrow},

    {id:"simpleUU", gen:()=>genMathFromDataset(window.AdditionProblems,"simpleUU","simpleUU")},
    {id:"unoUU", gen:()=>genMathFromDataset(window.AdditionProblems,"unoUU","unoUU")},

    {id:"simpleUB", gen:()=>genMathFromDataset(window.AdditionProblems,"simpleUB","simpleUB")},
    {id:"undecUB", gen:()=>genMathFromDataset(window.AdditionProblems,"undecUB","undecUB")},
    {id:"unoUB", gen:()=>genMathFromDataset(window.AdditionProblems,"unoUB","unoUB")},
    {id:"hardUB", gen:()=>genMathFromDataset(window.AdditionProblems,"hardUB","hardUB")},

    {id:"simpleBB", gen:()=>genMathFromDataset(window.AdditionProblems,"simpleBB","simpleBB")},
    {id:"undecBB", gen:()=>genMathFromDataset(window.AdditionProblems,"undecBB","undecBB")},
    {id:"unoBB", gen:()=>genMathFromDataset(window.AdditionProblems,"unoBB","unoBB")},
    {id:"tensBB", gen:()=>genMathFromDataset(window.AdditionProblems,"tensBB","tensBB")},
    {id:"hardBB", gen:()=>genMathFromDataset(window.AdditionProblems,"hardBB","hardBB")},

    {id:"queen_moves", gen:()=>genFromDataset(window.QueenMovesProblems, "queen_moves")},
    {id:"rook_moves", gen:()=>genFromDataset(window.RookMovesProblems, "rook_moves")},
    {id:"bishop_moves", gen:()=>genFromDataset(window.BishopMovesProblems, "bishop_moves")},
    {id:"knight_moves", gen:()=>genFromDataset(window.KnightMovesProblems, "knight_moves")},
    {id:"king_moves", gen:()=>genFromDataset(window.KingMovesProblems, "king_moves")},
    {id:"pawn_moves", gen:()=>genFromDataset(window.PawnMovesProblems, "pawn_moves")},

    {id:"queen_capture", gen:()=>genFromDataset(window.QueenCaptureProblems, "queen_capture")},
    {id:"rook_capture", gen:()=>genFromDataset(window.RookCaptureProblems, "rook_capture")},
    {id:"bishop_capture", gen:()=>genFromDataset(window.BishopCaptureProblems, "bishop_capture")},
    {id:"knight_capture", gen:()=>genFromDataset(window.KnightCaptureProblems, "knight_capture")},
    {id:"king_capture", gen:()=>genFromDataset(window.KingCaptureProblems, "king_capture")},
    {id:"pawn_capture", gen:()=>genFromDataset(window.PawnCaptureProblems, "pawn_capture")},

    {id:"rook_mate", gen:()=>genFromDataset(window.RookMateProblems, "rook_mate")},
    {id:"queen_mate", gen:()=>genFromDataset(window.QueenMateProblems, "queen_mate")},

    {id:"linear_mate_rook", gen:()=>genFromDataset(window.LinearMateRookProblems, "linear_mate_rook")},

    {id:"kq_squeeze", gen:()=>genFromDataset(window.KQSqueezeProblems, "kq_squeeze")},
    {id:"kq_squeeze2", gen:()=>genFromDataset(window.KQSqueezeV2Problems, "kq_squeeze2")},
    {id:"kq_squeeze3", gen:()=>genFromDataset(window.KQSqueezeV3Problems, "kq_squeeze3")},

    {id:"knight_fork", gen:()=>genFromDataset(window.KnightForkProblems, "knight_fork")},

    {id:"rookendgame_mate1", gen:()=>genFromDataset(window.MateIn1Problems, "rookendgame_mate1")},
    {id:"rookendgame_mate1_level2", gen:()=>genFromDataset(window.MateIn1Level2Problems, "rookendgame_mate1_level2")},
    {id:"puzzle_promotion_level1", gen:()=>genFromDataset(window.PuzzlePromotionLevel1Problems, "puzzle_promotion_level1")},
  ];

  function taskTypeTitle(typeId) {
    const node = window.Course.find(c => c.id === typeId);
    return node ? node.name : typeId;
  }

  function maxLevel(a, b) {
    const order = ["not_started", "touch", "active", "progress", "repeat", "complete"];
    return order[Math.max(order.indexOf(a), order.indexOf(b))];
  }

  const PRESET_LEVELS = {
    add_3x1d_max19: "complete",
    simplest_sub: "complete",
    minus_borrow_1d: "complete",
    round_tens_minus: "complete",
    double_minus_double_no_borrow: "complete",

    simpleUU: "complete",
    undecUU: "complete",
    unoUU: "complete",

    simpleUB: "complete",
    undecUB: "complete",
    unoUB: "repeat",
    hardUB: "complete",

    simpleBB: "repeat",
    undecBB: "complete",
    unoBB: "repeat",
    tensBB: "complete",
    hardBB: "repeat",

    queen_moves: "complete",
    rook_moves: "complete",
    bishop_moves: "repeat",
    knight_moves: "repeat",
    king_moves: "complete",
    pawn_moves: "repeat",

    queen_capture: "progress",
    rook_capture: "repeat",
    bishop_capture: "repeat",
    knight_capture: "repeat",
    king_capture: "complete",
    pawn_capture: "repeat",

    rook_mate: "repeat",
    queen_mate: "repeat",

    linear_mate_rook: "progress",
    kq_squeeze: "active",
    kq_squeeze2: "active",
  };

  let difficultyPolicy = getDifficultyPolicy();

  function resolveLevel(node) {
    if (node.test) {
      return "test";
    }

    const stats = window.User.getTopicStats(node.id);
    const ms = stats.maxStreak;

    const learnSpeed = window.User.getLearnSpeed();

    let level;

    // --- по прогрессу ---
    if (ms >= 3 * learnSpeed) {
      level = "complete";
    } else if (ms >= 2 * learnSpeed) {
      level = "repeat";
    } else if (ms >= 1 * learnSpeed) {
      level = "progress";
    } else {
      // --- базово active ---
      level = "active";

      const prereq = node.prereq || [];

      for (const id of prereq) {
        console.log("checking prerequisite", id);
        const pNode = window.Course.find(c => c.id === id);
        if (!pNode) continue;

        console.log("Course found!", pNode);
        const pLevel = resolveLevel(pNode);

        // если встретили слабые статусы → сразу not_started
        if (pLevel === "not_started" || pLevel === "touch" || pLevel === "active") {
          level = "not_started";
          break;
        }

        // если встретили progress → понижаем до touch (если ещё не хуже)
        if (pLevel === "progress" && level !== "not_started") {
          level = "touch";
        }
      }
    }

    // --- применяем preset (берём максимум с вычисленным уровнем) ---
    let preset = null;
    if (window.User.get().baseLevel === "borislav") {
      preset = PRESET_LEVELS[node.id];
    }
    if (preset) {
      level = maxLevel(level, preset);
    }

    return level;
  }

  function getDifficultyPolicy() {
    return window.Course.map(node => ({
      item: node.id,
      level: resolveLevel(node)
    }));
  }
  

  function chooseProblem() {   
    difficultyPolicy = getDifficultyPolicy();

    const weightedPolicy = difficultyPolicy.map(p => ({
      item: p.item,
      w: LEVEL_WEIGHTS[p.level] ?? 0
    }));

    const id = pickWeighted(weightedPolicy);

    const type = problemTypes.find(t => t.id === id) || problemTypes[0];

    const p = type.gen();

    // если генератор уже вернул готовую шахматную задачу
    if (p.type === "chess") {
      return p;
    }

    // обычная математическая задача
    return {
      type: "math",
      text: p.text,
      correct: p.correct,
      title: taskTypeTitle(type.id),
      id: type.id
    };
  }

  // Экспорт в глобал (без модулей)
  window.ProblemGen = {
    chooseProblem,
    // на будущее — удобно иметь доступ к спискам
    problemTypes,
    getDifficultyPolicy,
    taskTypeTitle
  };
})();