import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Crown,
  Lightbulb,
  RotateCcw,
  Undo2,
  Zap,
} from "lucide-react";
import {
  cloneState,
  createInitialState,
  DEPTH,
  Difficulty,
  findKing,
  formatMove,
  getAIMove,
  getCapturedPieces,
  getGameStatus,
  getHintMove,
  getLegalMovesForPiece,
  getPromotionMoves,
  isInCheck,
  isWhite,
  makeChessMove,
  PIECE_UNICODE,
  type ChessMove,
  type ChessState,
  type Pos,
  type PromotionPiece,
} from "./chessEngine";

type HistoryEntry = {
  state: ChessState;
  notation: string;
};

const PROMOTION_OPTIONS: PromotionPiece[] = ["q", "r", "b", "n"];

export default function ChessGame() {
  const [gameState, setGameState] = useState<ChessState>(createInitialState);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<ChessMove[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [history, setHistory] = useState<string[]>([]);
  const [stateHistory, setStateHistory] = useState<HistoryEntry[]>([]);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [lastAIMove, setLastAIMove] = useState<ChessMove | null>(null);
  const [hintMove, setHintMove] = useState<ChessMove | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Pos;
    to: Pos;
  } | null>(null);

  const board = gameState.board;
  const playerTurn = gameState.whiteToMove;

  const whiteKing = useMemo(() => findKing(board, true), [board]);
  const blackKing = useMemo(() => findKing(board, false), [board]);
  const whiteInCheck = useMemo(() => isInCheck(board, true), [board]);
  const blackInCheck = useMemo(() => isInCheck(board, false), [board]);
  const captured = useMemo(() => getCapturedPieces(board), [board]);

  const reset = () => {
    setGameState(createInitialState());
    setSelected(null);
    setValidMoves([]);
    setHistory([]);
    setStateHistory([]);
    setGameOver(null);
    setThinking(false);
    setLastAIMove(null);
    setHintMove(null);
    setPendingPromotion(null);
  };

  const finishGame = useCallback(
    (message: string, winner?: "player" | "ai" | "draw") => {
      setGameOver(message);
      setSelected(null);
      setValidMoves([]);
      setHintMove(null);
      setPendingPromotion(null);

      if (winner === "player") {
        setScore((s) => ({ ...s, player: s.player + 1 }));
      } else if (winner === "ai") {
        setScore((s) => ({ ...s, ai: s.ai + 1 }));
      }
    },
    [],
  );

  const resolveGameState = useCallback(
    (state: ChessState) => {
      const status = getGameStatus(state);
      if (status === "checkmate") {
        finishGame(
          state.whiteToMove ? "AI wins by checkmate!" : "You win by checkmate!",
          state.whiteToMove ? "ai" : "player",
        );
        return true;
      }
      if (status === "stalemate") {
        finishGame("Stalemate — draw.", "draw");
        return true;
      }
      return false;
    },
    [finishGame],
  );

  const applyMove = useCallback(
    (state: ChessState, move: ChessMove, isPlayerMove: boolean) => {
      const nextState = makeChessMove(state, move);
      const notation = formatMove(state, move);

      setGameState(nextState);
      setStateHistory((entries) => [
        ...entries,
        { state: cloneState(nextState), notation },
      ]);
      setHistory((entries) => [...entries, notation]);
      setSelected(null);
      setValidMoves([]);
      setHintMove(null);
      setPendingPromotion(null);

      if (isPlayerMove) {
        setLastAIMove(null);
      }

      if (resolveGameState(nextState)) return;

      if (isPlayerMove) {
        setThinking(true);
        window.setTimeout(() => {
          const aiMove = getAIMove(nextState, DEPTH[difficulty]);
          if (!aiMove) {
            resolveGameState(nextState);
            setThinking(false);
            return;
          }

          const aiState = makeChessMove(nextState, aiMove);
          setGameState(aiState);
          setLastAIMove(aiMove);
          setStateHistory((entries) => [
            ...entries,
            {
              state: cloneState(aiState),
              notation: formatMove(nextState, aiMove),
            },
          ]);
          setHistory((entries) => [
            ...entries,
            formatMove(nextState, aiMove),
          ]);

          resolveGameState(aiState);
          setThinking(false);
        }, 350);
      }
    },
    [difficulty, resolveGameState],
  );

  const handlePromotion = (piece: PromotionPiece) => {
    if (!pendingPromotion) return;

    const move = getPromotionMoves(
      gameState,
      pendingPromotion.from,
      pendingPromotion.to,
    ).find((candidate) => candidate.promotion === piece);

    if (!move) return;
    applyMove(gameState, move, true);
  };

  const handleClick = useCallback(
    (r: number, c: number) => {
      if (gameOver || thinking || !playerTurn || pendingPromotion) return;

      const piece = board[r][c];

      if (selected) {
        const move = validMoves.find(
          (candidate) => candidate.to[0] === r && candidate.to[1] === c,
        );

        if (move) {
          if (move.promotion) {
            setPendingPromotion({ from: selected, to: [r, c] });
            return;
          }
          applyMove(gameState, move, true);
        } else if (piece && isWhite(piece)) {
          setSelected([r, c]);
          setValidMoves(getLegalMovesForPiece(gameState, r, c));
          setHintMove(null);
        } else {
          setSelected(null);
          setValidMoves([]);
        }
      } else if (piece && isWhite(piece)) {
        setSelected([r, c]);
        setValidMoves(getLegalMovesForPiece(gameState, r, c));
        setHintMove(null);
      }
    },
    [
      applyMove,
      board,
      gameOver,
      gameState,
      pendingPromotion,
      playerTurn,
      selected,
      thinking,
      validMoves,
    ],
  );

  const handleUndo = () => {
    if (thinking || gameOver || stateHistory.length === 0) return;

    const steps = stateHistory.length >= 2 ? 2 : 1;
    const nextHistory = stateHistory.slice(0, -steps);
    const notationHistory = history.slice(0, -steps);

    if (nextHistory.length === 0) {
      reset();
      return;
    }

    const previous = nextHistory[nextHistory.length - 1].state;
    setGameState(cloneState(previous));
    setStateHistory(nextHistory);
    setHistory(notationHistory);
    setSelected(null);
    setValidMoves([]);
    setLastAIMove(null);
    setHintMove(null);
    setPendingPromotion(null);
    setGameOver(null);
  };

  const handleHint = () => {
    if (gameOver || thinking || !playerTurn) return;
    const move = getHintMove(gameState, DEPTH[difficulty]);
    setHintMove(move);
    if (move) {
      setSelected(move.from);
      setValidMoves(getLegalMovesForPiece(gameState, move.from[0], move.from[1]));
    }
  };

  const isHighlighted = (r: number, c: number) =>
    validMoves.some((move) => move.to[0] === r && move.to[1] === c);
  const isSelected = (r: number, c: number) =>
    selected?.[0] === r && selected?.[1] === c;
  const isLastAI = (r: number, c: number) =>
    lastAIMove &&
    ((lastAIMove.from[0] === r && lastAIMove.from[1] === c) ||
      (lastAIMove.to[0] === r && lastAIMove.to[1] === c));
  const isHintSquare = (r: number, c: number) =>
    hintMove &&
    ((hintMove.from[0] === r && hintMove.from[1] === c) ||
      (hintMove.to[0] === r && hintMove.to[1] === c));
  const isKingInCheckSquare = (r: number, c: number) =>
    (whiteInCheck &&
      whiteKing &&
      whiteKing[0] === r &&
      whiteKing[1] === c) ||
    (blackInCheck &&
      blackKing &&
      blackKing[0] === r &&
      blackKing[1] === c);

  const statusMessage = gameOver
    ? gameOver
    : pendingPromotion
      ? "Choose a promotion piece"
      : thinking
        ? "AI is thinking..."
        : !playerTurn
          ? "Waiting for AI..."
          : whiteInCheck
            ? "You are in check!"
            : "Your move (White)";

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Crown size={16} className="text-primary" /> Advanced AI Chess
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleHint}
            disabled={Boolean(gameOver) || thinking || !playerTurn}
            className="p-2 text-muted-foreground hover:text-accent transition-colors disabled:opacity-40"
            title="Hint"
          >
            <Lightbulb size={16} />
          </button>
          <button
            onClick={handleUndo}
            disabled={thinking || stateHistory.length === 0}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
            title="Undo last turn"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={reset}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="Reset game"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="flex gap-1 flex-wrap">
          {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => {
                setDifficulty(level);
                reset();
              }}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${difficulty === level ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"}`}
            >
              {level === "easy" && <Zap size={10} className="inline mr-1" />}
              {level === "medium" && <Brain size={10} className="inline mr-1" />}
              {level === "hard" && <Crown size={10} className="inline mr-1" />}
              {level}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono shrink-0">
          <span className="text-primary">You:{score.player}</span>
          <span className="text-muted-foreground mx-2">|</span>
          <span className="text-accent">AI:{score.ai}</span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap gap-1 min-h-[18px]">
          {captured.black.map((piece, index) => (
            <span key={`cap-b-${piece}-${index}`} className="text-primary">
              {PIECE_UNICODE[piece]}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 min-h-[18px] justify-end">
          {captured.white.map((piece, index) => (
            <span key={`cap-w-${piece}-${index}`} className="text-foreground/70">
              {PIECE_UNICODE[piece]}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`mb-3 text-center text-xs font-mono rounded-lg px-3 py-2 ${
          gameOver
            ? "bg-accent/10 text-accent border border-accent/20"
            : whiteInCheck && !gameOver
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-background/50 text-muted-foreground border border-border/50"
        }`}
      >
        {statusMessage}
      </div>

      <div
        className="relative aspect-square w-full max-w-[320px] mx-auto mb-3"
        style={{ perspective: "800px" }}
      >
        <div
          className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden border border-border shadow-lg"
          style={{ transform: "rotateX(2deg)", transformStyle: "preserve-3d" }}
        >
          {board.map((row, r) =>
            row.map((piece, c) => {
              const dark = (r + c) % 2 === 1;
              const highlighted = isHighlighted(r, c);
              const sel = isSelected(r, c);
              const aiHL = isLastAI(r, c);
              const hintHL = isHintSquare(r, c);
              const kingCheck = isKingInCheckSquare(r, c);

              return (
                <motion.button
                  key={`${r}-${c}`}
                  onClick={() => handleClick(r, c)}
                  whileHover={
                    !gameOver && !thinking && !pendingPromotion
                      ? { scale: 1.05, zIndex: 10 }
                      : {}
                  }
                  className={`relative flex items-center justify-center text-lg sm:text-2xl transition-colors duration-150
                  ${dark ? "bg-secondary" : "bg-muted/30"}
                  ${sel ? "ring-2 ring-primary ring-inset bg-primary/20" : ""}
                  ${highlighted ? "bg-accent/20" : ""}
                  ${aiHL ? "bg-destructive/10" : ""}
                  ${hintHL ? "bg-yellow-500/10 ring-1 ring-yellow-500/30 ring-inset" : ""}
                  ${kingCheck ? "bg-destructive/20 ring-1 ring-destructive/40 ring-inset" : ""}
                `}
                >
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
                      className={`relative z-10 drop-shadow-md ${isWhite(piece) ? "text-foreground" : "text-primary"}`}
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {PIECE_UNICODE[piece]}
                    </motion.span>
                  )}
                </motion.button>
              );
            }),
          )}
        </div>

        {thinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Brain size={24} className="text-primary" />
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {pendingPromotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg"
            >
              <div className="glass rounded-xl p-4 border border-border/50">
                <p className="text-xs font-mono text-muted-foreground mb-3 text-center">
                  Promote pawn to
                </p>
                <div className="flex gap-2">
                  {PROMOTION_OPTIONS.map((piece) => (
                    <button
                      key={piece}
                      onClick={() => handlePromotion(piece)}
                      className="w-12 h-12 rounded-lg bg-secondary hover:bg-primary/20 text-2xl transition-colors"
                    >
                      {PIECE_UNICODE[piece.toUpperCase()]}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-16 overflow-y-auto bg-background/50 rounded-lg p-2 text-xs font-mono text-muted-foreground scrollbar-thin">
        {history.length === 0 ? (
          <span className="text-muted-foreground/50">
            Full rules enabled: castling, en passant, promotion, checkmate, and
            stalemate.
          </span>
        ) : (
          history.map((move, index) => (
            <span
              key={index}
              className={`inline-block mr-2 ${index % 2 === 0 ? "text-foreground" : "text-primary"}`}
            >
              {Math.floor(index / 2) + 1}
              {index % 2 === 0 ? "." : "..."}
              {move}
            </span>
          ))
        )}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center font-display font-semibold text-sm"
          >
            <span
              className={
                gameOver.includes("You win")
                  ? "text-accent"
                  : gameOver.includes("draw")
                    ? "text-muted-foreground"
                    : "text-primary"
              }
            >
              {gameOver}{" "}
              {gameOver.includes("You win")
                ? "🎉"
                : gameOver.includes("draw")
                  ? "🤝"
                  : "🤖"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
