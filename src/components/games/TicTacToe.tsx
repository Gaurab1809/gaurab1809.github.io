import { useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board: Player[]): Player {
  for (const [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function minimax(board: Player[], isMax: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (board.every(c => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getAIMove(board: Player[]): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, false);
      board[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [score, setScore] = useState({ player: 0, ai: 0, draw: 0 });

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(c => c !== null);

  const handleClick = useCallback((idx: number) => {
    if (board[idx] || winner || isDraw || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) { setScore(s => ({ ...s, player: s.player + 1 })); return; }
    if (newBoard.every(c => c !== null)) { setScore(s => ({ ...s, draw: s.draw + 1 })); return; }

    setIsPlayerTurn(false);
    setTimeout(() => {
      const aiMove = getAIMove([...newBoard]);
      if (aiMove >= 0) {
        newBoard[aiMove] = 'O';
        setBoard([...newBoard]);
        const aw = checkWinner(newBoard);
        if (aw) setScore(s => ({ ...s, ai: s.ai + 1 }));
        else if (newBoard.every(c => c !== null)) setScore(s => ({ ...s, draw: s.draw + 1 }));
      }
      setIsPlayerTurn(true);
    }, 400);
  }, [board, winner, isDraw, isPlayerTurn]);

  const reset = () => { setBoard(Array(9).fill(null)); setIsPlayerTurn(true); };

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">AI Tic Tac Toe</h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-center gap-6 mb-4 text-xs font-mono">
        <span className="text-primary">You: {score.player}</span>
        <span className="text-muted-foreground">Draw: {score.draw}</span>
        <span className="text-accent">AI: {score.ai}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(i)}
            className={`aspect-square rounded-lg font-display font-bold text-2xl flex items-center justify-center transition-all ${
              cell ? 'bg-secondary' : 'bg-secondary/50 hover:bg-primary/10 cursor-pointer'
            } ${cell === 'X' ? 'text-primary' : 'text-accent'}`}
          >
            {cell && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {cell}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {(winner || isDraw) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-mono"
        >
          {winner === 'X' && <span className="text-primary">You win! 🎉</span>}
          {winner === 'O' && <span className="text-accent">AI wins! 🤖</span>}
          {isDraw && <span className="text-muted-foreground">It's a draw!</span>}
        </motion.div>
      )}
    </div>
  );
}
