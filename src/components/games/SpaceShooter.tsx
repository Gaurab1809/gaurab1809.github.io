import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Crosshair } from 'lucide-react';

interface Bug {
  id: number;
  x: number;
  y: number;
  speed: number;
  label: string;
  hp: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

const BUG_LABELS = ['NullPtr', 'TypeError', '404', 'SEGFAULT', 'Undefined', 'StackOverflow', 'MemLeak', 'Deadlock', 'RaceCondition', 'InfiniteLoop'];

export default function SpaceShooter() {
  const [shipX, setShipX] = useState(50);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const bulletId = useRef(0);
  const bugId = useRef(0);
  const lastSpawn = useRef(0);

  const resetGame = useCallback(() => {
    setBullets([]);
    setBugs([]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setLevel(1);
    setShipX(50);
    bugId.current = 0;
    bulletId.current = 0;
    lastSpawn.current = 0;
  }, []);

  const shoot = useCallback(() => {
    if (gameOver) return;
    if (!started) setStarted(true);
    setBullets((prev) => [...prev, { id: bulletId.current++, x: shipX, y: 85 }]);
  }, [shipX, gameOver, started]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    setShipX(Math.max(5, Math.min(95, x)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width * 100;
    setShipX(Math.max(5, Math.min(95, x)));
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const spawnRate = Math.max(600, 1500 - level * 100);

      if (now - lastSpawn.current > spawnRate) {
        lastSpawn.current = now;
        setBugs((prev) => [...prev, {
          id: bugId.current++,
          x: Math.random() * 85 + 5,
          y: -5,
          speed: 0.3 + Math.random() * 0.3 + level * 0.05,
          label: BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)],
          hp: 1
        }]);
      }

      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 2 })).filter((b) => b.y > -5));
      setBugs((prev) => {
        const updated = prev.map((b) => ({ ...b, y: b.y + b.speed }));
        if (updated.some((b) => b.y > 92)) {
          setGameOver(true);
          setHighScore((hs) => Math.max(hs, score));
          return [];
        }
        return updated;
      });

      // Collision detection
      setBullets((prevBullets) => {
        const remainingBullets = [...prevBullets];
        setBugs((prevBugs) => {
          const remainingBugs = [...prevBugs];
          for (let bi = remainingBullets.length - 1; bi >= 0; bi--) {
            for (let ei = remainingBugs.length - 1; ei >= 0; ei--) {
              const bullet = remainingBullets[bi];
              const bug = remainingBugs[ei];
              if (Math.abs(bullet.x - bug.x) < 6 && Math.abs(bullet.y - bug.y) < 6) {
                remainingBullets.splice(bi, 1);
                remainingBugs.splice(ei, 1);
                setScore((s) => {
                  const newScore = s + 10;
                  if (newScore % 100 === 0) setLevel((l) => l + 1);
                  return newScore;
                });
                break;
              }
            }
          }
          return remainingBugs;
        });
        return remainingBullets;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [started, gameOver, level, score]);

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto px-[24px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Crosshair size={16} className="text-accent" /> Bug Blaster
        </h3>
        <button onClick={resetGame} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-3 text-xs font-mono">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">Level: {level}</span>
        <span className="text-muted-foreground">Best: {highScore}</span>
      </div>

      <div
        ref={gameRef}
        className="relative w-full h-80 bg-background/80 rounded-lg border border-border overflow-hidden cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={shoot}
        onTouchStart={shoot}>
        
        {/* Stars background */}
        {Array.from({ length: 20 }).map((_, i) =>
        <div
          key={`star-${i}`}
          className="absolute w-px h-px bg-foreground/30 rounded-full animate-pulse"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.2}s` }} />

        )}

        {/* Ship */}
        <div
          className="absolute bottom-4 w-8 h-8 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${shipX}%` }}>
          
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-primary mx-auto drop-shadow-[0_0_8px_hsl(190_100%_50%/0.6)]" />
          <div className="w-2 h-3 bg-accent/60 mx-auto -mt-1 rounded-b-full" />
        </div>

        {/* Bullets */}
        {bullets.map((b) =>
        <div
          key={b.id}
          className="absolute w-1 h-3 bg-primary rounded-full shadow-[0_0_6px_hsl(190_100%_50%/0.8)]"
          style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translateX(-50%)' }} />

        )}

        {/* Bugs */}
        {bugs.map((b) =>
        <div
          key={b.id}
          className="absolute -translate-x-1/2 text-center"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          
            <div className="px-2 py-1 bg-destructive/20 border border-destructive/40 rounded text-[9px] font-mono text-destructive whitespace-nowrap">
              🐛 {b.label}
            </div>
          </div>
        )}

        {/* Game Over / Start */}
        {!started && !gameOver &&
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-primary font-display font-semibold text-lg mb-1">Bug Blaster</p>
              <p className="text-muted-foreground text-xs font-mono">Click/tap to shoot bugs!</p>
              <p className="text-muted-foreground/60 text-[10px] font-mono mt-1">Move mouse to control ship</p>
            </div>
          </div>
        }

        {gameOver &&
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-destructive font-display font-bold text-xl mb-1">SYSTEM CRASH</p>
              <p className="text-muted-foreground text-xs font-mono mb-2">Bugs reached your codebase!</p>
              <p className="text-primary text-sm font-mono">Final Score: {score}</p>
              <button onClick={resetGame} className="mt-3 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-mono">
                Reboot
              </button>
            </div>
          </div>
        }
      </div>
    </div>);

}