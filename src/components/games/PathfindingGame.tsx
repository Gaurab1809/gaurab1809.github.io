import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Route } from 'lucide-react';

const ROWS = 12;
const COLS = 16;

type Cell = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited';

interface Point { r: number; c: number }

export default function PathfindingGame() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [start, setStart] = useState<Point>({ r: 1, c: 1 });
  const [end, setEnd] = useState<Point>({ r: ROWS - 2, c: COLS - 2 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState<boolean | null>(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const cancelRef = useRef(false);

  const initGrid = useCallback(() => {
    cancelRef.current = true;
    const g: Cell[][] = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
    // random walls
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.25) g[r][c] = 'wall';
      }
    }
    g[start.r][start.c] = 'start';
    g[end.r][end.c] = 'end';
    setGrid(g);
    setRunning(false);
    setFound(null);
    setVisitedCount(0);
  }, [start, end]);

  useEffect(() => { initGrid(); }, [initGrid]);

  const toggleWall = (r: number, c: number) => {
    if (running) return;
    if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === 'wall' ? 'empty' : 'wall';
    setGrid(newGrid);
  };

  const runBFS = async () => {
    cancelRef.current = false;
    setRunning(true);
    setFound(null);
    setVisitedCount(0);

    const g = grid.map(row => row.map(c => (c === 'visited' || c === 'path') ? 'empty' : c));
    setGrid(g);

    const queue: Point[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, Point>();
    visited.add(`${start.r},${start.c}`);
    let count = 0;

    while (queue.length > 0) {
      if (cancelRef.current) return;
      const curr = queue.shift()!;

      if (curr.r === end.r && curr.c === end.c) {
        // trace path
        let p: Point | undefined = curr;
        const pathCells: Point[] = [];
        while (p && !(p.r === start.r && p.c === start.c)) {
          pathCells.push(p);
          p = parent.get(`${p.r},${p.c}`);
        }
        const finalGrid = g.map(row => [...row]);
        for (const cell of pathCells) {
          if (finalGrid[cell.r][cell.c] !== 'end') finalGrid[cell.r][cell.c] = 'path';
        }
        setGrid(finalGrid);
        setFound(true);
        setRunning(false);
        return;
      }

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = curr.r + dr, nc = curr.c + dc;
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(key) && g[nr][nc] !== 'wall') {
          visited.add(key);
          parent.set(key, curr);
          queue.push({ r: nr, c: nc });
          if (!(nr === end.r && nc === end.c)) {
            g[nr][nc] = 'visited';
          }
          count++;
        }
      }

      if (count % 3 === 0) {
        setGrid(g.map(row => [...row]));
        setVisitedCount(count);
        await new Promise(res => setTimeout(res, 20));
      }
    }

    setFound(false);
    setRunning(false);
  };

  const cellColor: Record<Cell, string> = {
    empty: 'bg-secondary/30',
    wall: 'bg-foreground/20',
    start: 'bg-accent',
    end: 'bg-destructive',
    path: 'bg-primary shadow-[0_0_4px_hsl(190_100%_50%/0.5)]',
    visited: 'bg-primary/20',
  };

  return (
    <div className="glass rounded-xl p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Route size={16} className="text-primary" /> Pathfinder
        </h3>
        <button onClick={initGrid} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-3 text-xs font-mono">
        <span className="text-primary">Visited: {visitedCount}</span>
        <span className="text-muted-foreground">Click cells to toggle walls</span>
      </div>

      <div className="border border-border rounded-lg overflow-hidden mb-4"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={c}
                className={`w-full aspect-square ${cellColor[cell]} border border-border/10 transition-colors duration-100 cursor-pointer`}
                style={{ width: `${100 / COLS}%` }}
                onClick={() => toggleWall(r, c)}
                onMouseEnter={() => isDrawing && toggleWall(r, c)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={runBFS}
          disabled={running}
          className="flex-1 py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {running ? 'Searching...' : 'Run BFS'}
        </button>
        <div className="flex gap-2 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent" /> Start</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-destructive" /> End</span>
        </div>
      </div>

      {found !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center text-sm font-display font-semibold mt-3 ${found ? 'text-accent' : 'text-destructive'}`}
        >
          {found ? '✅ Path found!' : '❌ No path exists!'}
        </motion.p>
      )}
    </div>
  );
}
