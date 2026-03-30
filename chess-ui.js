(function(){

let boardEl;
let arrowsLayer;
let selected = null;
let pieces = [];
let correctTargets = [];

let selectedSquareEl = null;
let playerPiece = null;

function init(el) {
  boardEl = el;

  // слой для стрелок
  arrowsLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrowsLayer.style.position = "absolute";
  arrowsLayer.style.top = 0;
  arrowsLayer.style.left = 0;
  arrowsLayer.style.width = "100%";
  arrowsLayer.style.height = "100%";
  arrowsLayer.style.pointerEvents = "none";

  boardEl.style.position = "relative";
  boardEl.appendChild(arrowsLayer);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  marker.setAttribute("markerUnits", "strokeWidth");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M0,0 L0,6 L6,3 z");
  path.setAttribute("fill", "#60a5fa");
  path.setAttribute("opacity", "0.85");

  marker.appendChild(path);
  defs.appendChild(marker);
  arrowsLayer.appendChild(defs);
}

function animateMove(from, to, callback) {
  const fromEl = boardEl.querySelector(
    `[data-file="${from.file}"][data-rank="${from.rank}"]`
  );

  const toEl = boardEl.querySelector(
    `[data-file="${to.file}"][data-rank="${to.rank}"]`
  );

  if (!fromEl || !toEl) return;

  const piece = fromEl.innerHTML;
  if (!piece) return;

  const b = boardEl.getBoundingClientRect();
  const r1 = fromEl.getBoundingClientRect();
  const r2 = toEl.getBoundingClientRect();

  const size = r1.width;

  const ghost = document.createElement("div");
  ghost.innerHTML = piece;

  ghost.style.position = "absolute";
  ghost.style.width = size + "px";
  ghost.style.height = size + "px";
  ghost.style.display = "flex";
  ghost.style.alignItems = "center";
  ghost.style.justifyContent = "center";
  ghost.style.pointerEvents = "none";
  ghost.style.transition = "all 0.2s ease";

  ghost.style.left = (r1.left - b.left) + "px";
  ghost.style.top  = (r1.top  - b.top) + "px";

  boardEl.appendChild(ghost);

  fromEl.innerHTML = "";

  requestAnimationFrame(() => {
    ghost.style.left = (r2.left - b.left) + "px";
    ghost.style.top  = (r2.top  - b.top) + "px";
  });

  setTimeout(() => {
    ghost.remove();
    callback && callback(fromEl, toEl, piece);
  }, 200);
}

function renderBoard(problem) {

  currentProblem = problem;
  
  pieces = problem.position.pieces || [];
  playerPiece = pieces.find(p => (p.color || "white") === "white");
  correctTargets = problem.legalMoves || [];

  selected = null;

  boardEl.innerHTML = "";
  if (arrowsLayer) {
    boardEl.appendChild(arrowsLayer);
  }
  boardEl.style.display = "grid";
  boardEl.style.gridTemplateColumns = "repeat(8, 40px)";

  for(let r=7;r>=0;r--){
    for(let f=0;f<8;f++){

      const sq = document.createElement("div");

      const light = (r+f)%2===0;

      sq.dataset.file = f;
      sq.dataset.rank = r;

      sq.style.width="40px";
      sq.style.height="40px";
      sq.style.background = light ? "#f0d9b5" : "#b58863";

      const piece = pieces.find(
      p => p.square.file === f && p.square.rank === r
      );

      if(piece){
        const pieceImages = {
          white: {
            pawn: "chesspieces/wP.png",
            knight: "chesspieces/wN.png",
            bishop: "chesspieces/wB.png",
            rook: "chesspieces/wR.png",
            queen: "chesspieces/wQ.png",
            king: "chesspieces/wK.png"
          },
          black: {
            pawn: "chesspieces/bP.png",
            knight: "chesspieces/bN.png",
            bishop: "chesspieces/bB.png",
            rook: "chesspieces/bR.png",
            queen: "chesspieces/bQ.png",
            king: "chesspieces/bK.png"
          }
        };

        const color = piece.color || "white";

        const img = document.createElement("img");
        img.src = pieceImages[color][piece.type];
        img.style.width = "32px";
        img.style.height = "32px";
        img.style.pointerEvents = "none";

        sq.innerHTML = "";
        sq.appendChild(img);
        sq.style.fontSize="28px";
        sq.style.display="flex";
        sq.style.alignItems="center";
        sq.style.justifyContent="center";
      }

      sq.addEventListener("click", onSquareClick);

      boardEl.appendChild(sq);
    }
  }
}

function clearHints() {
  if (!arrowsLayer) return;

  // удалить только линии, но не defs
  arrowsLayer.querySelectorAll("line").forEach(el => el.remove());
}

function showHints(moves) {
  if (!boardEl || !arrowsLayer) return;

  clearHints();

  const boardRect = boardEl.getBoundingClientRect();

  moves.forEach(move => {
    const fromEl = boardEl.querySelector(
      `[data-file="${move.from.file}"][data-rank="${move.from.rank}"]`
    );

    const toEl = boardEl.querySelector(
      `[data-file="${move.to.file}"][data-rank="${move.to.rank}"]`
    );

    if (!fromEl || !toEl) return;

    const r1 = fromEl.getBoundingClientRect();
    const r2 = toEl.getBoundingClientRect();

    const x1 = r1.left + r1.width / 2 - boardRect.left;
    const y1 = r1.top  + r1.height / 2 - boardRect.top;

    const x2 = r2.left + r2.width / 2 - boardRect.left;
    const y2 = r2.top  + r2.height / 2 - boardRect.top;

    drawArrow(x1, y1, x2, y2);
  });
}

function drawArrow(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);

  line.setAttribute("stroke", "#60a5fa");
  line.setAttribute("stroke-width", "5");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("opacity", "0.7");

  // 🔥 вот это делает стрелку
  line.setAttribute("marker-end", "url(#arrowhead)");

  arrowsLayer.appendChild(line);
}

function onSquareClick(e){

  const f = parseInt(e.currentTarget.dataset.file);
  const r = parseInt(e.currentTarget.dataset.rank);

  const piece = pieces.find(p =>
    p.square.file === f &&
    p.square.rank === r &&
    (p.color || "white") === "white"
  );

  // --- если фигура ещё не выбрана ---
  if (selected === null) {

    if (piece) {
      selected = {file:f, rank:r};

      if (selectedSquareEl) {
        selectedSquareEl.classList.remove("selected-piece");
      }

      selectedSquareEl = e.currentTarget;
      selectedSquareEl.classList.add("selected-piece");
    }

    return;
  }

  // --- если уже выбрана фигура ---

  // клик по другой своей фигуре → смена выбора
  if (piece) {
    selected = {file:f, rank:r};

    if (selectedSquareEl) {
      selectedSquareEl.classList.remove("selected-piece");
    }

    selectedSquareEl = e.currentTarget;
    selectedSquareEl.classList.add("selected-piece");

    return;
  }

  // иначе — это попытка хода
  checkMove(f, r);
}

function checkMove(f,r){

  const from = selected;
  const to = {file:f, rank:r};

  const ok = correctTargets.some(
    m =>
      m.from.file === from.file &&
      m.from.rank === from.rank &&
      m.to.file === to.file &&
      m.to.rank === to.rank
  );

  animateMove(from, to, (fromEl, toEl, piece) => {

    if (ok) {
      // сначала визуально ставим фигуру
      toEl.innerHTML = piece;

      // маленькая пауза → убирает "сжатие"
      setTimeout(() => {

        if (window.errorsInRow >= 2) {
          Stats.recordAttempt(true, 0);
          window.successWithHint();
        } else {
          Stats.recordAttempt(true, 5);
          window.success();
        }

      }, 50);

    } else {
      // откат как раньше — без изменений
      fromEl.innerHTML = piece;

      Stats.recordAttempt(false);
      window.unsuccess();
    }

  });
}

window.ChessUI = {
  init,
  renderBoard,
  showHints,
  clearHints
};

})();