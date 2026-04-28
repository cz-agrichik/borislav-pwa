// course.js
window.Course = [

  // --- 1+1 (UU) ---

  {
    id: "simpleUU",
    name: "1+1 без перехода",
    type: "math",
    prereq: []
  },
  {
    id: "unoUU",
    name: "1+1 с переходом",
    type: "math",
    prereq: ["simpleUU"]
  },

  // --- 1+2 (UB) ---

  {
    id: "simpleUB",
    name: "1+2 без перехода",
    type: "math",
    prereq: ["simpleUU"]
  },
  {
    id: "undecUB",
    name: "1+2 = 10x",
    type: "math",
    prereq: ["simpleUB", "unoUU"]
  },
  {
    id: "unoUB",
    name: "1+2 с переходом",
    type: "math",
    prereq: ["undecUB", "unoUU"]
  },
  {
    id: "hardUB",
    name: "1+2 двойной переход",
    type: "math",
    prereq: ["unoUB", "unoUU"]
  },

  // --- 2+2 (BB) ---

  {
    id: "simpleBB",
    name: "2+2 без перехода",
    type: "math",
    prereq: ["simpleUB"]
  },
  {
    id: "undecBB",
    name: "2+2 = 10x",
    type: "math",
    prereq: ["simpleBB", "undecUB"]
  },
  {
    id: "unoBB",
    name: "2+2 с переходом",
    type: "math",
    prereq: ["undecBB", "unoUB"]
  },
  {
    id: "tensBB",
    name: "десятки → 100",
    type: "math",
    prereq: ["unoBB"]
  },
  {
    id: "hardBB",
    name: "2+2 двойной переход",
    type: "math",
    prereq: ["tensBB", "hardUB"]
  },

  // --- шахматы: ходы ---

  {
    id: "king_moves",
    name: "♔ король (ходы)",
    type: "chess",
    prereq: []
  },
  {
    id: "rook_moves",
    name: "Ладья (ходы)",
    type: "chess",
    prereq: []
  },
  {
    id: "bishop_moves",
    name: "Слон (ходы)",
    type: "chess",
    prereq: []
  },
  {
    id: "queen_moves",
    name: "Ферзь (ходы)",
    type: "chess",
    prereq: []
  },
  {
    id: "knight_moves",
    name: "Конь (ходы)",
    type: "chess",
    prereq: []
  },
  {
    id: "pawn_moves",
    name: "Пешка (ходы)",
    type: "chess",
    prereq: []
  },

  // --- шахматы: взятия ---

  {
    id: "king_capture",
    name: "Король (взятие)",
    type: "chess",
    prereq: ["king_moves"]
  },
  {
    id: "rook_capture",
    name: "Ладья (взятие)",
    type: "chess",
    prereq: ["rook_moves"]
  },
  {
    id: "bishop_capture",
    name: "Слон (взятие)",
    type: "chess",
    prereq: ["bishop_moves"]
  },
  {
    id: "queen_capture",
    name: "Ферзь (взятие)",
    type: "chess",
    prereq: ["queen_moves"]
  },
  {
    id: "knight_capture",
    name: "Конь (взятие)",
    type: "chess",
    prereq: ["knight_moves"]
  },
  {
    id: "pawn_capture",
    name: "Пешка (взятие)",
    type: "chess",
    prereq: ["pawn_moves"]
  },

  // --- маты ---

  {
    id: "rook_mate",
    name: "Мат ♔ + ♖ у края",
    type: "chess",
    prereq: ["rook_capture", "king_capture"]
  },
  {
    id: "queen_mate",
    name: "Мат ♔ + ♕ у края",
    type: "chess",
    prereq: ["queen_capture", "king_capture"]
  },

  {
    id: "linear_mate_rook",
    name: "Линейный мат ♕ + ♖",
    type: "chess",
    prereq: ["rook_mate"]
  },
  {
    id: "kq_squeeze",
    name: "Мат ♔ + ♕, техника прижатия (1)",
    type: "chess",
    prereq: ["queen_mate"]
  },
  {
    id: "kq_squeeze2",
    name: "Мат ♔ + ♕, техника прижатия (2)",
    type: "chess",
    prereq: ["queen_mate"]
  },
  {
    id: "kq_squeeze3",
    name: "Мат ♔ + ♕, техника прижатия (3)",
    type: "chess",
    prereq: ["queen_mate"]
  },

  {
    id: "knight_fork",
    name: "Вилка конём",
    type: "chess",
    prereq: ["knight_capture"]
  },

  {
    id: "rookendgame_mate1",
    name: "Мат в 1 ход (Ладейник-1)",
    type: "chess",
    prereq: ["rook_mate"]
  },
  {
    id: "rookendgame_mate1_level2",
    name: "Мат в 1 ход (Ладейник-2)",
    type: "chess",
    prereq: ["rookendgame_mate1"]
  },

  {
    id: "puzzle_promotion_level1",
    name: "Пешечник-1",
    type: "chess",
    prereq: ["pawn_moves"]
  },
  {
    id: "kingside_mate1_lvl1",
    name: "Мат в 1 ход (Королевский фланг-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "opera_mate1_lvl1",
    name: "Мат в 1 ход (Опера-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "backrank_mate1_lvl1",
    name: "Мат в 1 ход (Вторжение на 8ую-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "pillsburys_mate1_lvl1",
    name: "Мат в 1 ход (Пильсбери-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "f2f7_mate1_lvl1",
    name: "Мат в 1 ход (F2 или F7-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "hanging_mate1_lvl1",
    name: "Мат в 1 ход (Висячая-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "queenside_mate1_lvl1",
    name: "Мат в 1 ход (Ферзевый фланг-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "queenrooken_mate1_lvl1",
    name: "Мат в 1 ход (Ферзево-ладейное-1)",
    type: "chess",
    prereq: ["rook_capture", "king_capture", "bishop_capture", "knight_capture", "queen_capture", "pawn_capture"]
  },
  {
    id: "fork_lvl2",
    name: "Вилка-2",
    type: "chess",
    prereq: ["knight_fork"]
  }
];