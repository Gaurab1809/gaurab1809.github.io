import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID = 20;
const CELL = 15;
const SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const FOOD_ICONS = ['🐍', '⚛️', '🐍', '💎', '🔥', '⚡', '🧠', '🚀'];

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [foodIcon, setFoodIcon] = useState('⚛️');
  const dirRef = useRef<Direction>('RIGHT');
  const gameRef = useRef<HTMLDivElement>(null);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let pos: Point;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (currentSnake.some(s => s.x === pos.x && s.y === pos.y));
    setFoodIcon(FOOD_ICONS[Math.floor(Math.random() * FOOD_ICONS.length)]);
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setStarted(false);
  }, [spawnFood]);

  const changeDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposites[newDir] !== dirRef.current) {
      dirRef.current = newDir;
      setDirection(newDir);
      if (!started) setStarted(true);
    }
  }, [started]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT'
      };
      if (map[e.key]) {
        e.preventDefault();
        changeDirection(map[e.key]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDirection]);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        const dir = dirRef.current;
        if (dir === 'UP') head.y--;
        if (dir === 'DOWN') head.y++;
        if (dir === 'LEFT') head.x--;
        if (dir === 'RIGHT') head.x++;

        // Wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setGameOver(true);
          setHighScore(hs => Math.max(hs, score));
          return prev;
        }

        // Self collision
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setHighScore(hs => Math.max(hs, score));
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(interval);
  }, [started, gameOver, food, spawnFood, score]);

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground">🐍 Code Snake</h3>
        <button onClick={resetGame} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-3 text-xs font-mono">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">Length: {snake.length}</span>
        <span className="text-muted-foreground">Best: {highScore}</span>
      </div>

      <div
        ref={gameRef}
        className="relative mx-auto border border-border rounded-lg bg-background/80 overflow-hidden"
        style={{ width: GRID * CELL, height: GRID * CELL }}
        tabIndex={0}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`
        }} />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-75 ${i === 0 ? 'bg-primary shadow-[0_0_6px_hsl(190_100%_50%/0.5)]' : 'bg-primary/60'}`}
            style={{
              left: segment.x * CELL,
              top: segment.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute flex items-center justify-center text-xs animate-pulse"
          style={{ left: food.x * CELL, top: food.y * CELL, width: CELL, height: CELL }}
        >
          {foodIcon}
        </div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-primary font-display font-semibold mb-1">Code Snake</p>
              <p className="text-muted-foreground text-[10px] font-mono">Arrow keys or WASD to move</p>
              <p className="text-muted-foreground/60 text-[10px] font-mono">or use buttons below</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-destructive font-display font-bold text-lg mb-1">Game Over!</p>
              <p className="text-primary text-sm font-mono">Score: {score}</p>
              <button onClick={resetGame} className="mt-2 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-mono">
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 flex flex-col items-center gap-1 md:hidden">
        <button onClick={() => changeDirection('UP')} className="p-2 bg-secondary rounded-lg active:bg-primary/20">
          <ArrowUp size={18} className="text-primary" />
        </button>
        <div className="flex gap-1">
          <button onClick={() => changeDirection('LEFT')} className="p-2 bg-secondary rounded-lg active:bg-primary/20">
            <ArrowLeft size={18} className="text-primary" />
          </button>
          <button onClick={() => changeDirection('DOWN')} className="p-2 bg-secondary rounded-lg active:bg-primary/20">
            <ArrowDown size={18} className="text-primary" />
          </button>
          <button onClick={() => changeDirection('RIGHT')} className="p-2 bg-secondary rounded-lg active:bg-primary/20">
            <ArrowRight size={18} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
