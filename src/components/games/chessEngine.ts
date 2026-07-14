export type Piece = string | null;
export type Board = Piece[][];
export type Pos = [number, number];
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
export type PromotionPiece = "q" | "r" | "b" | "n";
export type CastleSide = "K" | "Q";
export type Difficulty = "easy" | "medium" | "hard";
export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export interface CastlingRights {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
}

export interface ChessState {
  board: Board;
  whiteToMove: boolean;
  castling: CastlingRights;
  enPassant: Pos | null;
  halfmoveClock: number;
}

export interface ChessMove {
  from: Pos;
  to: Pos;
  promotion?: PromotionPiece;
  castle?: CastleSide;
  enPassant?: boolean;
}

export const INIT_BOARD: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const PIECE_UNICODE: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const PIECE_VALUE: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
  P: 100,
  N: 320,
  B: 330,
  R: 500,
  Q: 900,
  K: 20000,
};

const KNIGHT_DELTAS: Pos[] = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const KING_DELTAS: Pos[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const PST: Record<string, number[]> = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, -20, -20, 10, 10, 5, 5, -5, -10, 0, 0,
    -10, -5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, 5, 10, 25, 25, 10, 5, 5, 10, 10,
    20, 30, 30, 20, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0,
    0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 5, 5, 0, -20, -40, -30,
    5, 10, 15, 15, 10, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 15, 20,
    20, 15, 5, -30, -30, 0, 10, 15, 15, 10, 0, -30, -40, -20, 0, 0, 0, 0, -20,
    -40, -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 5, 0, 0, 0, 0, 5, -10, -10,
    10, 10, 10, 10, 10, 10, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 5, 5,
    10, 10, 5, 5, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0,
    -10, -20, -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 5, 5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
    -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0,
    0, 0, -5, 5, 10, 10, 10, 10, 10, 10, 5,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0,
    5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5,
    -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5,
    -5, -10, -10, -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
    -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
    -40, -30, -20, -30, -30, -40, -40, -30, -20, -20, -10, -20, -20, -30, -30,
    -20, -10, -20, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
  ],
};

export const DEPTH: Record<Difficulty, number> = { easy: 2, medium: 3, hard: 4 };

export const isWhite = (piece: string) => piece === piece.toUpperCase();
export const inBounds = (r: number, c: number) =>
  r >= 0 && r < 8 && c >= 0 && c < 8;
const isKing = (piece: Piece) => piece === "K" || piece === "k";
const pieceType = (piece: string): PieceType => piece.toLowerCase() as PieceType;

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function createInitialState(): ChessState {
  return {
    board: cloneBoard(INIT_BOARD),
    whiteToMove: true,
    castling: {
      whiteKingside: true,
      whiteQueenside: true,
      blackKingside: true,
      blackQueenside: true,
    },
    enPassant: null,
    halfmoveClock: 0,
  };
}

export function cloneState(state: ChessState): ChessState {
  return {
    board: cloneBoard(state.board),
    whiteToMove: state.whiteToMove,
    castling: { ...state.castling },
    enPassant: state.enPassant ? ([...state.enPassant] as Pos) : null,
    halfmoveClock: state.halfmoveClock,
  };
}

export function findKing(board: Board, white: boolean): Pos | null {
  const king = white ? "K" : "k";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) return [r, c];
    }
  }
  return null;
}

function pstValue(piece: string, r: number, c: number): number {
  const type = pieceType(piece);
  const table = PST[type];
  if (!table) return 0;
  const index = isWhite(piece) ? r * 8 + c : (7 - r) * 8 + c;
  return table[index] ?? 0;
}

export function getAttackSquares(board: Board, r: number, c: number): Pos[] {
  const piece = board[r][c];
  if (!piece) return [];

  const white = isWhite(piece);
  const type = pieceType(piece);
  const attacks: Pos[] = [];

  const addAttack = (tr: number, tc: number) => {
    if (inBounds(tr, tc)) attacks.push([tr, tc]);
  };

  const slideAttacks = (dirs: Pos[]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        const tr = r + dr * i;
        const tc = c + dc * i;
        if (!inBounds(tr, tc)) break;
        addAttack(tr, tc);
        if (board[tr][tc]) break;
      }
    }
  };

  if (type === "p") {
    const dir = white ? -1 : 1;
    addAttack(r + dir, c - 1);
    addAttack(r + dir, c + 1);
  } else if (type === "n") {
    for (const [dr, dc] of KNIGHT_DELTAS) addAttack(r + dr, c + dc);
  } else if (type === "b") {
    slideAttacks([
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]);
  } else if (type === "r") {
    slideAttacks([
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  } else if (type === "q") {
    slideAttacks([
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  } else if (type === "k") {
    for (const [dr, dc] of KING_DELTAS) addAttack(r + dr, c + dc);
  }

  return attacks;
}

export function isSquareAttacked(
  board: Board,
  r: number,
  c: number,
  byWhite: boolean,
): boolean {
  for (let rr = 0; rr < 8; rr++) {
    for (let cc = 0; cc < 8; cc++) {
      const piece = board[rr][cc];
      if (!piece || isWhite(piece) !== byWhite) continue;
      if (
        getAttackSquares(board, rr, cc).some(([ar, ac]) => ar === r && ac === c)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function isInCheck(board: Board, white: boolean): boolean {
  const king = findKing(board, white);
  if (!king) return false;
  return isSquareAttacked(board, king[0], king[1], !white);
}

function canCastle(
  state: ChessState,
  white: boolean,
  side: CastleSide,
): boolean {
  const row = white ? 7 : 0;
  const rights = state.castling;
  if (white) {
    if (side === "K" && !rights.whiteKingside) return false;
    if (side === "Q" && !rights.whiteQueenside) return false;
  } else {
    if (side === "K" && !rights.blackKingside) return false;
    if (side === "Q" && !rights.blackQueenside) return false;
  }

  if (isInCheck(state.board, white)) return false;

  const kingCol = 4;
  const path =
    side === "K"
      ? [
          [row, 5],
          [row, 6],
        ]
      : [
          [row, 3],
          [row, 2],
          [row, 1],
        ];

  for (const [pr, pc] of path) {
    if (isSquareAttacked(state.board, pr, pc, !white)) return false;
  }

  if (side === "K") {
    return (
      state.board[row][kingCol] === (white ? "K" : "k") &&
      state.board[row][7] === (white ? "R" : "r") &&
      !state.board[row][5] &&
      !state.board[row][6]
    );
  }

  return (
    state.board[row][kingCol] === (white ? "K" : "k") &&
    state.board[row][0] === (white ? "R" : "r") &&
    !state.board[row][1] &&
    !state.board[row][2] &&
    !state.board[row][3]
  );
}

function getPseudoLegalMoves(
  state: ChessState,
  r: number,
  c: number,
): ChessMove[] {
  const board = state.board;
  const piece = board[r][c];
  if (!piece) return [];

  const moves: ChessMove[] = [];
  const white = isWhite(piece);
  const type = pieceType(piece);

  const push = (tr: number, tc: number, extra: Partial<ChessMove> = {}) => {
    moves.push({ from: [r, c], to: [tr, tc], ...extra });
  };

  const addIfValid = (tr: number, tc: number) => {
    if (!inBounds(tr, tc)) return false;
    const target = board[tr][tc];
    if (isKing(target)) return false;
    if (target && isWhite(target) === white) return false;
    push(tr, tc);
    return !target;
  };

  const slide = (dirs: Pos[]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        if (!addIfValid(r + dr * i, c + dc * i)) break;
      }
    }
  };

  if (type === "p") {
    const dir = white ? -1 : 1;
    const start = white ? 6 : 1;
    const promoRank = white ? 0 : 7;

    if (inBounds(r + dir, c) && !board[r + dir][c]) {
      if (r + dir === promoRank) {
        for (const promo of ["q", "r", "b", "n"] as PromotionPiece[]) {
          push(r + dir, c, { promotion: promo });
        }
      } else {
        push(r + dir, c);
        if (r === start && !board[r + dir * 2][c]) push(r + dir * 2, c);
      }
    }

    for (const dc of [-1, 1]) {
      const tr = r + dir;
      const tc = c + dc;
      if (!inBounds(tr, tc)) continue;

      if (
        board[tr][tc] &&
        !isKing(board[tr][tc]) &&
        isWhite(board[tr][tc]!) !== white
      ) {
        if (tr === promoRank) {
          for (const promo of ["q", "r", "b", "n"] as PromotionPiece[]) {
            push(tr, tc, { promotion: promo });
          }
        } else {
          push(tr, tc);
        }
      } else if (
        state.enPassant &&
        state.enPassant[0] === tr &&
        state.enPassant[1] === tc
      ) {
        push(tr, tc, { enPassant: true });
      }
    }
  } else if (type === "n") {
    for (const [dr, dc] of KNIGHT_DELTAS) addIfValid(r + dr, c + dc);
  } else if (type === "b") {
    slide([
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]);
  } else if (type === "r") {
    slide([
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  } else if (type === "q") {
    slide([
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  } else if (type === "k") {
    for (const [dr, dc] of KING_DELTAS) addIfValid(r + dr, c + dc);

    if (canCastle(state, white, "K")) {
      push(white ? 7 : 0, 6, { castle: "K" });
    }
    if (canCastle(state, white, "Q")) {
      push(white ? 7 : 0, 2, { castle: "Q" });
    }
  }

  return moves;
}

export function makeChessMove(state: ChessState, move: ChessMove): ChessState {
  const next = cloneState(state);
  const board = next.board;
  const piece = board[move.from[0]][move.from[1]];
  if (!piece) return next;

  const white = isWhite(piece);
  const type = pieceType(piece);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;

  next.enPassant = null;
  next.halfmoveClock += 1;

  if (move.castle === "K") {
    const row = white ? 7 : 0;
    board[row][6] = piece;
    board[row][5] = white ? "R" : "r";
    board[row][4] = null;
    board[row][7] = null;
  } else if (move.castle === "Q") {
    const row = white ? 7 : 0;
    board[row][2] = piece;
    board[row][3] = white ? "R" : "r";
    board[row][4] = null;
    board[row][0] = null;
  } else if (move.enPassant) {
    board[tr][tc] = piece;
    board[fr][fc] = null;
    board[fr][tc] = null;
  } else {
    board[tr][tc] = piece;
    board[fr][fc] = null;

    if (type === "p" && Math.abs(tr - fr) === 2) {
      next.enPassant = [fr + (white ? -1 : 1), fc];
    }

    if (move.promotion) {
      board[tr][tc] = white
        ? move.promotion.toUpperCase()
        : move.promotion.toLowerCase();
    }
  }

  if (type === "p" || board[tr][tc]) next.halfmoveClock = 0;

  if (type === "k") {
    if (white) {
      next.castling.whiteKingside = false;
      next.castling.whiteQueenside = false;
    } else {
      next.castling.blackKingside = false;
      next.castling.blackQueenside = false;
    }
  }

  if (type === "r") {
    if (white && fr === 7 && fc === 0) next.castling.whiteQueenside = false;
    if (white && fr === 7 && fc === 7) next.castling.whiteKingside = false;
    if (!white && fr === 0 && fc === 0) next.castling.blackQueenside = false;
    if (!white && fr === 0 && fc === 7) next.castling.blackKingside = false;
  }

  if (board[7][0] !== "R") next.castling.whiteQueenside = false;
  if (board[7][7] !== "R") next.castling.whiteKingside = false;
  if (board[0][0] !== "r") next.castling.blackQueenside = false;
  if (board[0][7] !== "r") next.castling.blackKingside = false;

  next.whiteToMove = !state.whiteToMove;
  return next;
}

function isLegalMove(state: ChessState, move: ChessMove): boolean {
  const piece = state.board[move.from[0]][move.from[1]];
  if (!piece || isWhite(piece) !== state.whiteToMove) return false;

  const pseudo = getPseudoLegalMoves(state, move.from[0], move.from[1]);
  const matches = pseudo.some(
    (candidate) =>
      candidate.to[0] === move.to[0] &&
      candidate.to[1] === move.to[1] &&
      candidate.promotion === move.promotion &&
      candidate.castle === move.castle &&
      candidate.enPassant === move.enPassant,
  );
  if (!matches) return false;

  const next = makeChessMove(state, move);
  return !isInCheck(next.board, state.whiteToMove);
}

export function getLegalMovesForPiece(
  state: ChessState,
  r: number,
  c: number,
): ChessMove[] {
  return getPseudoLegalMoves(state, r, c).filter((move) =>
    isLegalMove(state, move),
  );
}

export function getAllLegalMoves(state: ChessState): ChessMove[] {
  const moves: ChessMove[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (!piece || isWhite(piece) !== state.whiteToMove) continue;
      moves.push(...getLegalMovesForPiece(state, r, c));
    }
  }
  return moves;
}

export function getGameStatus(state: ChessState): GameStatus {
  const legalMoves = getAllLegalMoves(state);
  const inCheck = isInCheck(state.board, state.whiteToMove);
  if (legalMoves.length === 0) return inCheck ? "checkmate" : "stalemate";
  if (inCheck) return "check";
  return "playing";
}

function isCapture(state: ChessState, move: ChessMove): boolean {
  if (move.enPassant) return true;
  const target = state.board[move.to[0]][move.to[1]];
  return Boolean(target);
}

function moveScore(state: ChessState, move: ChessMove): number {
  let score = 0;
  if (isCapture(state, move)) {
    const victim = move.enPassant
      ? state.board[move.from[0]][move.to[1]]
      : state.board[move.to[0]][move.to[1]];
    const attacker = state.board[move.from[0]][move.from[1]];
    score +=
      (victim ? PIECE_VALUE[victim] : 100) -
      (attacker ? PIECE_VALUE[attacker] / 10 : 0);
  }
  if (move.promotion) score += 800;
  if (move.castle) score += 60;
  return score;
}

function orderMoves(state: ChessState, moves: ChessMove[]): ChessMove[] {
  return [...moves].sort((a, b) => moveScore(state, b) - moveScore(state, a));
}

export function evaluateState(state: ChessState): number {
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (!piece) continue;
      const sign = isWhite(piece) ? -1 : 1;
      score += sign * (PIECE_VALUE[piece] + pstValue(piece, r, c));
    }
  }

  const whiteMoves = getAllLegalMoves({ ...state, whiteToMove: true }).length;
  const blackMoves = getAllLegalMoves({ ...state, whiteToMove: false }).length;
  score += (blackMoves - whiteMoves) * 4;

  if (isInCheck(state.board, true)) score += 35;
  if (isInCheck(state.board, false)) score -= 35;

  return score;
}

function terminalScore(state: ChessState): number | null {
  const status = getGameStatus(state);
  if (status === "checkmate") {
    return state.whiteToMove ? 100000 : -100000;
  }
  if (status === "stalemate") return 0;
  return null;
}

function quiescence(
  state: ChessState,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  const standPat = evaluateState(state);
  if (maximizing) {
    if (standPat >= beta) return beta;
    alpha = Math.max(alpha, standPat);
  } else {
    if (standPat <= alpha) return alpha;
    beta = Math.min(beta, standPat);
  }

  const captures = orderMoves(
    state,
    getAllLegalMoves(state).filter((move) => isCapture(state, move)),
  );

  for (const move of captures) {
    const next = makeChessMove(state, move);
    const value = quiescence(next, alpha, beta, !maximizing);
    if (maximizing) {
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    } else {
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
  }

  return maximizing ? alpha : beta;
}

function minimax(
  state: ChessState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  const terminal = terminalScore(state);
  if (terminal !== null) return terminal;
  if (depth === 0) return quiescence(state, alpha, beta, maximizing);

  const moves = orderMoves(state, getAllLegalMoves(state));
  let best = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const next = makeChessMove(state, move);
    const value = minimax(next, depth - 1, alpha, beta, !maximizing);
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha) break;
  }

  return best;
}

export function getAIMove(
  state: ChessState,
  depth: number,
): ChessMove | null {
  if (state.whiteToMove) return null;

  const moves = orderMoves(state, getAllLegalMoves(state));
  if (moves.length === 0) return null;

  let bestVal = -Infinity;
  let bestMove: ChessMove | null = null;

  for (const move of moves) {
    const next = makeChessMove(state, move);
    const value = minimax(next, depth - 1, -Infinity, Infinity, false);
    if (value > bestVal) {
      bestVal = value;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getHintMove(
  state: ChessState,
  depth: number,
): ChessMove | null {
  if (!state.whiteToMove) return null;

  const moves = orderMoves(state, getAllLegalMoves(state));
  if (moves.length === 0) return null;

  let bestVal = Infinity;
  let bestMove: ChessMove | null = null;

  for (const move of moves) {
    const next = makeChessMove(state, move);
    const value = minimax(next, Math.max(1, depth - 1), -Infinity, Infinity, true);
    if (value < bestVal) {
      bestVal = value;
      bestMove = move;
    }
  }

  return bestMove;
}

const cols = "abcdefgh";
const square = (r: number, c: number) => `${cols[c]}${8 - r}`;

export function formatMove(state: ChessState, move: ChessMove): string {
  const piece = state.board[move.from[0]][move.from[1]];
  if (!piece) return "";

  if (move.castle === "K") return "O-O";
  if (move.castle === "Q") return "O-O-O";

  const captured = move.enPassant
    ? state.board[move.from[0]][move.to[1]]
    : state.board[move.to[0]][move.to[1]];

  const promo = move.promotion ? `=${move.promotion.toUpperCase()}` : "";
  const ep = move.enPassant ? " e.p." : "";
  const checkMark = (() => {
    const next = makeChessMove(state, move);
    return getGameStatus(next) === "check" ? "+" : "";
  })();

  return `${PIECE_UNICODE[piece]} ${square(move.from[0], move.from[1])}→${square(move.to[0], move.to[1])}${captured ? " ×" + PIECE_UNICODE[captured] : ""}${promo}${ep}${checkMark}`;
}

export function moveKey(move: ChessMove): string {
  return `${move.from[0]},${move.from[1]}-${move.to[0]},${move.to[1]}-${move.promotion ?? ""}-${move.castle ?? ""}-${move.enPassant ? 1 : 0}`;
}

export function isSameMove(a: ChessMove, b: ChessMove): boolean {
  return moveKey(a) === moveKey(b);
}

export function getCapturedPieces(
  current: Board,
  initial: Board = INIT_BOARD,
): { white: string[]; black: string[] } {
  const counts: Record<string, number> = {};
  for (const row of initial) {
    for (const piece of row) {
      if (piece) counts[piece] = (counts[piece] ?? 0) + 1;
    }
  }
  for (const row of current) {
    for (const piece of row) {
      if (piece) counts[piece] = (counts[piece] ?? 0) - 1;
    }
  }

  const white: string[] = [];
  const black: string[] = [];
  for (const [piece, missing] of Object.entries(counts)) {
    for (let i = 0; i < missing; i++) {
      if (isWhite(piece)) white.push(piece);
      else black.push(piece);
    }
  }

  return { white, black };
}

export function getPromotionMoves(
  state: ChessState,
  from: Pos,
  to: Pos,
): ChessMove[] {
  return getLegalMovesForPiece(state, from[0], from[1]).filter(
    (move) => move.to[0] === to[0] && move.to[1] === to[1] && move.promotion,
  );
}
