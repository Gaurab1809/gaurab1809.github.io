import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Crown, Zap, Brain } from 'lucide-react';

type Piece = string | null;
type Board = Piece[][];
type Pos = [number, number];

const INIT: Board = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
];

const U: Record<string, string> = {
  K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',
  k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟',
};

const VAL: Record<string, number> = { p:100,n:320,b:330,r:500,q:900,k:20000,P:100,N:320,B:330,R:500,Q:900,K:20000 };

const isWhite = (p: string) => p === p.toUpperCase();
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

function getMoves(board: Board, r: number, c: number): Pos[] {
  const p = board[r][c];
  if (!p) return [];
  const moves: Pos[] = [];
  const white = isWhite(p);
  const type = p.toLowerCase();

  const addIfValid = (tr: number, tc: number) => {
    if (!inBounds(tr, tc)) return false;
    const target = board[tr][tc];
    if (target && isWhite(target) === white) return false;
    moves.push([tr, tc]);
    return !target;
  };

  const slide = (dirs: Pos[]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        if (!addIfValid(r + dr * i, c + dc * i)) break;
      }
    }
  };

  if (type === 'p') {
    const dir = white ? -1 : 1;
    const start = white ? 6 : 1;
    if (inBounds(r+dir, c) && !board[r+dir][c]) {
      moves.push([r+dir, c]);
      if (r === start && !board[r+dir*2][c]) moves.push([r+dir*2, c]);
    }
    for (const dc of [-1, 1]) {
      if (inBounds(r+dir, c+dc) && board[r+dir][c+dc] && isWhite(board[r+dir][c+dc]!) !== white)
        moves.push([r+dir, c+dc]);
    }
  } else if (type === 'n') {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as Pos[])
      addIfValid(r+dr, c+dc);
  } else if (type === 'b') {
    slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
  } else if (type === 'r') {
    slide([[-1,0],[1,0],[0,-1],[0,1]]);
  } else if (type === 'q') {
    slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
  } else if (type === 'k') {
    for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as Pos[])
      addIfValid(r+dr, c+dc);
  }
  return moves;
}

function cloneBoard(b: Board): Board { return b.map(r => [...r]); }

function makeMove(board: Board, fr: number, fc: number, tr: number, tc: number): Board {
  const b = cloneBoard(board);
  const piece = b[fr][fc];
  b[tr][tc] = piece;
  b[fr][fc] = null;
  // Auto-promote pawns
  if (piece === 'P' && tr === 0) b[tr][tc] = 'Q';
  if (piece === 'p' && tr === 7) b[tr][tc] = 'q';
  return b;
}

function evaluate(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) score += (isWhite(p) ? -1 : 1) * VAL[p]; // AI is black
    }
  return score;
}

function isKingAlive(board: Board, white: boolean): boolean {
  const king = white ? 'K' : 'k';
  for (const row of board) for (const cell of row) if (cell === king) return true;
  return false;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (!isKingAlive(board, true)) return 100000;
  if (!isKingAlive(board, false)) return -100000;
  if (depth === 0) return evaluate(board);

  const isBlack = maximizing;
  let best = maximizing ? -Infinity : Infinity;

  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || isWhite(p) === isBlack) continue;
      for (const [tr, tc] of getMoves(board, r, c)) {
        const nb = makeMove(board, r, c, tr, tc);
        const val = minimax(nb, depth - 1, alpha, beta, !maximizing);
        if (maximizing) { best = Math.max(best, val); alpha = Math.max(alpha, val); }
        else { best = Math.min(best, val); beta = Math.min(beta, val); }
        if (beta <= alpha) return best;
      }
    }
  return best;
}

function getAIMove(board: Board, depth: number): { from: Pos; to: Pos } | null {
  let bestVal = -Infinity;
  let bestMove: { from: Pos; to: Pos } | null = null;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      if (!board[r][c] || isWhite(board[r][c]!)) continue;
      for (const [tr, tc] of getMoves(board, r, c)) {
        const nb = makeMove(board, r, c, tr, tc);
        const val = minimax(nb, depth - 1, -Infinity, Infinity, false);
        if (val > bestVal) { bestVal = val; bestMove = { from: [r, c], to: [tr, tc] }; }
      }
    }
  return bestMove;
}

type Difficulty = 'easy' | 'medium' | 'hard';
const DEPTH: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(cloneBoard(INIT));
  const [selected, setSelected] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<Pos[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [history, setHistory] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [lastAIMove, setLastAIMove] = useState<{ from: Pos; to: Pos } | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });

  const cols = 'abcdefgh';
  const notation = (r: number, c: number) => `${cols[c]}${8-r}`;

  const reset = () => {
    setBoard(cloneBoard(INIT));
    setSelected(null);
    setValidMoves([]);
    setHistory([]);
    setGameOver(null);
    setThinking(false);
    setLastAIMove(null);
  };

  const handleClick = useCallback((r: number, c: number) => {
    if (gameOver || thinking) return;
    const piece = board[r][c];

    if (selected) {
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
      if (isValid) {
        const from = selected;
        const captured = board[r][c];
        const nb = makeMove(board, from[0], from[1], r, c);
        setBoard(nb);
        setSelected(null);
        setValidMoves([]);
        const moveStr = `${U[board[from[0]][from[1]]!]} ${notation(from[0], from[1])}→${notation(r, c)}${captured ? ' ×'+U[captured] : ''}`;
        setHistory(h => [...h, moveStr]);

        if (!isKingAlive(nb, false)) {
          setGameOver('You win!');
          setScore(s => ({ ...s, player: s.player + 1 }));
          return;
        }

        setThinking(true);
        setTimeout(() => {
          const aiMove = getAIMove(nb, DEPTH[difficulty]);
          if (aiMove) {
            const { from: af, to: at } = aiMove;
            const aiCaptured = nb[at[0]][at[1]];
            const ab = makeMove(nb, af[0], af[1], at[0], at[1]);
            setBoard(ab);
            setLastAIMove(aiMove);
            const aiStr = `${U[nb[af[0]][af[1]]!]} ${notation(af[0], af[1])}→${notation(at[0], at[1])}${aiCaptured ? ' ×'+U[aiCaptured] : ''}`;
            setHistory(h => [...h, aiStr]);
            if (!isKingAlive(ab, true)) {
              setGameOver('AI wins!');
              setScore(s => ({ ...s, ai: s.ai + 1 }));
            }
          }
          setThinking(false);
        }, 300);
      } else {
        if (piece && isWhite(piece)) {
          setSelected([r, c]);
          setValidMoves(getMoves(board, r, c));
        } else {
          setSelected(null);
          setValidMoves([]);
        }
      }
    } else {
      if (piece && isWhite(piece)) {
        setSelected([r, c]);
        setValidMoves(getMoves(board, r, c));
      }
    }
  }, [board, selected, validMoves, gameOver, thinking, difficulty]);

  const isHighlighted = (r: number, c: number) => validMoves.some(([vr, vc]) => vr === r && vc === c);
  const isSelected = (r: number, c: number) => selected?.[0] === r && selected?.[1] === c;
  const isLastAI = (r: number, c: number) => lastAIMove && ((lastAIMove.from[0] === r && lastAIMove.from[1] === c) || (lastAIMove.to[0] === r && lastAIMove.to[1] === c));

  return (
    <div className="glass rounded-xl p-4 sm:p-6 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Crown size={16} className="text-primary" /> AI Chess
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-1">
          {(['easy','medium','hard'] as Difficulty[]).map(d => (
            <button key={d} onClick={() => { setDifficulty(d); reset(); }}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${difficulty === d ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
              {d === 'easy' && <Zap size={10} className="inline mr-1" />}
              {d === 'medium' && <Brain size={10} className="inline mr-1" />}
              {d === 'hard' && <Crown size={10} className="inline mr-1" />}
              {d}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono">
          <span className="text-primary">You:{score.player}</span>
          <span className="text-muted-foreground mx-2">|</span>
          <span className="text-accent">AI:{score.ai}</span>
        </div>
      </div>

      {/* Board */}
      <div className="relative aspect-square w-full max-w-[320px] mx-auto mb-3" style={{ perspective: '800px' }}>
        <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden border border-border shadow-lg"
          style={{ transform: 'rotateX(2deg)', transformStyle: 'preserve-3d' }}>
          {board.map((row, r) => row.map((piece, c) => {
            const dark = (r + c) % 2 === 1;
            const highlighted = isHighlighted(r, c);
            const sel = isSelected(r, c);
            const aiHL = isLastAI(r, c);
            return (
              <motion.button key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`relative flex items-center justify-center text-lg sm:text-2xl transition-colors duration-150
                  ${dark ? 'bg-secondary' : 'bg-muted/30'}
                  ${sel ? 'ring-2 ring-primary ring-inset bg-primary/20' : ''}
                  ${highlighted ? 'bg-accent/20' : ''}
                  ${aiHL ? 'bg-destructive/10' : ''}
                `}>
                {highlighted && !piece && (
                  <div className="absolute w-2 h-2 rounded-full bg-accent/50" />
                )}
                {highlighted && piece && (
                  <div className="absolute inset-0 border-2 border-accent/50 rounded-sm" />
                )}
                {piece && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`relative z-10 drop-shadow-md ${isWhite(piece) ? 'text-foreground' : 'text-primary'}`}
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {U[piece]}
                  </motion.span>
                )}
              </motion.button>
            );
          }))}
        </div>
        {thinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Brain size={24} className="text-primary" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Move history */}
      <div className="h-16 overflow-y-auto bg-background/50 rounded-lg p-2 text-xs font-mono text-muted-foreground scrollbar-thin">
        {history.length === 0 ? (
          <span className="text-muted-foreground/50">Play white pieces. Move history appears here...</span>
        ) : (
          history.map((m, i) => (
            <span key={i} className={`inline-block mr-2 ${i % 2 === 0 ? 'text-foreground' : 'text-primary'}`}>
              {Math.floor(i/2)+1}{i%2===0?'.':'...'}{m}
            </span>
          ))
        )}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 text-center font-display font-semibold text-sm">
            <span className={gameOver.includes('You') ? 'text-accent' : 'text-primary'}>{gameOver} {gameOver.includes('You') ? '🎉' : '🤖'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
