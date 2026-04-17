// course.js
window.Course = [

  // --- 1+1 (UU) ---

  {
    id: "simpleUU",
    name: "1+1 без перехода",
    prereq: []
  },
  {
    id: "unoUU",
    name: "1+1 с переходом",
    prereq: ["simpleUU"]
  },

  // --- 1+2 (UB) ---

  {
    id: "simpleUB",
    name: "1+2 без перехода",
    prereq: ["simpleUU"]
  },
  {
    id: "undecUB",
    name: "1+2 = 10x",
    prereq: ["simpleUB", "unoUU"]
  },
  {
    id: "unoUB",
    name: "1+2 с переходом",
    prereq: ["undecUB", "unoUU"]
  },
  {
    id: "hardUB",
    name: "1+2 двойной переход",
    prereq: ["unoUB", "unoUU"]
  },

  // --- 2+2 (BB, двойная зависимость) ---

  {
    id: "simpleBB",
    name: "2+2 без перехода",
    prereq: ["simpleUB"]
  },
  {
    id: "undecBB",
    name: "2+2 = 10x",
    prereq: ["simpleBB", "undecUB"]
  },
  {
    id: "unoBB",
    name: "2+2 с переходом",
    prereq: ["undecBB", "unoUB"]
  },
  {
    id: "tensBB",
    name: "десятки → 100",
    prereq: ["unoBB"]
  },
  {
    id: "hardBB",
    name: "2+2 двойной переход",
    prereq: ["tensBB", "hardUB"]
  },

  // --- шахматы: ходы (без prereq) ---

  {
    id: "king_moves",
    name: "♔ король (ходы)",
    prereq: []
  },
  {
    id: "rook_moves",
    name: "Ладья (ходы)",
    prereq: []
  },
  {
    id: "bishop_moves",
    name: "Слон (ходы)",
    prereq: []
  },
  {
    id: "queen_moves",
    name: "Ферзь (ходы)",
    prereq: []
  },
  {
    id: "knight_moves",
    name: "Конь (ходы)",
    prereq: []
  },
  {
    id: "pawn_moves",
    name: "Пешка (ходы)",
    prereq: []
  },

  // --- шахматы: взятия ---

  {
    id: "king_capture",
    name: "Король (взятие)",
    prereq: ["king_moves"]
  },
  {
    id: "rook_capture",
    name: "Ладья (взятие)",
    prereq: ["rook_moves"]
  },
  {
    id: "bishop_capture",
    name: "Слон (взятие)",
    prereq: ["bishop_moves"]
  },
  {
    id: "queen_capture",
    name: "Ферзь (взятие)",
    prereq: ["queen_moves"]
  },
  {
    id: "knight_capture",
    name: "Конь (взятие)",
    prereq: ["knight_moves"]
  },
  {
    id: "pawn_capture",
    name: "Пешка (взятие)",
    prereq: ["pawn_moves"]
  },

  // --- маты ---

  {
    id: "rook_mate",
    name: "Мат ♔ + ♖ у края",
    prereq: ["rook_capture", "king_capture"]
  },
  {
    id: "queen_mate",
    name: "Мат ♔ + ♕ у края",
    prereq: ["queen_capture", "king_capture"]
  },

  {
    id: "linear_mate_rook",
    name: "Линейный мат ♕ + ♖",
    prereq: ["rook_mate"]
  },
  {
      id: "kq_squeeze",
      name: "Мат ♔ + ♕, техника прижатия (1)",
      prereq: ["queen_mate"]
  },
  {
      id: "kq_squeeze2",
      name: "Мат ♔ + ♕, техника прижатия (2)",
      prereq: ["queen_mate"]
  },
  {
      id: "kq_squeeze3",
      name: "Мат ♔ + ♕, техника прижатия (3)",
      prereq: ["queen_mate"]
  },

  { id:"knight_fork", name:"Вилка конём", prereq:["knight_capture"] },

  { id:"rookendgame_mate1", name:"Мат в 1 ход (Ладейник-1)", prereq:["rook_mate"] },
  { id:"rookendgame_mate1_level2", name:"Мат в 1 ход (Ладейник-2)", prereq:["rookendgame_mate1"] },
];
