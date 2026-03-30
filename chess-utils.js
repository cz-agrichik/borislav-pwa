(function(){

function fenToPosition(fen) {
  const [boardPart] = fen.split(" ");
  const rows = boardPart.split("/");

  const pieces = [];

  for (let r = 0; r < 8; r++) {
    let file = 0;

    const row = rows[7 - r]; // важно: FEN сверху вниз

    for (const ch of row) {
      if (!isNaN(ch)) {
        file += parseInt(ch, 10);
      } else {
        const isWhite = ch === ch.toUpperCase();

        const map = {
          q: "queen",
          r: "rook",
          b: "bishop",
          n: "knight",
          p: "pawn",
          k: "king"
        };

        pieces.push({
          type: map[ch.toLowerCase()],
          color: isWhite ? "white" : "black",
          square: { file, rank: r }
        });

        file++;
      }
    }
  }

  return { pieces };
}

function movesToSquares(movesStr) {
  return movesStr.split(" ").map(m => {
    return {
      from: {
        file: m.charCodeAt(0) - 97,
        rank: parseInt(m[1]) - 1
      },
      to: {
        file: m.charCodeAt(2) - 97,
        rank: parseInt(m[3]) - 1
      }
    };
  });
}

window.ChessUtils = {
  fenToPosition,
  movesToSquares
  
};

})();