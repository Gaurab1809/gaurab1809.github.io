import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowDownUp } from 'lucide-react';

export default function DataSorting() {
  const [array, setArray] = useState<number[]>([]);
  const [sorted, setSorted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [bestMoves, setBestMoves] = useState(Infinity);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const generateArray = useCallback(() => {
    let arr: number[];
    do {
      arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1);
    } while (arr.every((v, i, a) => i === 0 || a[i - 1] <= v));
    setArray(arr);
    setSorted(false);
    setMoves(0);
    setSelected(null);
    setStarted(false);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => { generateArray(); }, [generateArray]);

  useEffect(() => {
    if (started && !sorted) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [started, sorted]);

  const checkSorted = (arr: number[]) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  const handleTap = (idx: number) => {
    if (sorted) return;
    if (!started) setStarted(true);

    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const newArr = [...array];
      [newArr[selected], newArr[idx]] = [newArr[idx], newArr[selected]];
      setArray(newArr);
      setMoves(m => m + 1);
      setSelected(null);
      if (checkSorted(newArr)) {
        setSorted(true);
        setBestMoves(prev => Math.min(prev, moves + 1));
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const maxVal = Math.max(...array, 1);

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <ArrowDownUp size={16} className="text-primary" /> Data Sorter
        </h3>
        <button onClick={generateArray} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">Moves: {moves}</span>
        <span className="text-muted-foreground">⏱ {timer}s</span>
        <span className="text-accent">Best: {bestMoves < Infinity ? bestMoves : '—'}</span>
      </div>

      <p className="text-xs text-muted-foreground font-mono mb-4 text-center">
        Tap two bars to swap. Sort ascending! ↑
      </p>

      <div className="flex items-end justify-center gap-1.5 h-48 mb-4">
        {array.map((val, i) => (
          <motion.button
            key={i}
            layout
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(i)}
            className={`relative flex-1 rounded-t-md transition-colors cursor-pointer flex flex-col items-center justify-end ${
              sorted
                ? 'bg-accent/40 border border-accent/30'
                : selected === i
                ? 'bg-primary border border-primary/60 shadow-[0_0_10px_hsl(190_100%_50%/0.3)]'
                : 'bg-primary/20 border border-primary/10 hover:bg-primary/30'
            }`}
            style={{ height: `${(val / maxVal) * 100}%` }}
          >
            <span className="text-[10px] font-mono text-foreground/80 mb-1">{val}</span>
          </motion.button>
        ))}
      </div>

      {sorted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-accent font-display font-semibold text-lg">🎉 Sorted!</p>
          <p className="text-xs font-mono text-muted-foreground">{moves} moves in {timer}s</p>
          <button onClick={generateArray} className="mt-3 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-mono">
            New Array
          </button>
        </motion.div>
      )}
    </div>
  );
}
