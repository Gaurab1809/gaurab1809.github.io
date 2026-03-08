import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Zap } from 'lucide-react';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'too-early';

export default function ReactionSpeed() {
  const [state, setState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const [times, setTimes] = useState<number[]>([]);
  const readyAt = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const start = useCallback(() => {
    setState('waiting');
    const delay = 1500 + Math.random() * 4000;
    timeoutRef.current = setTimeout(() => {
      readyAt.current = Date.now();
      setState('ready');
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'idle') {
      start();
    } else if (state === 'waiting') {
      clearTimeout(timeoutRef.current);
      setState('too-early');
    } else if (state === 'ready') {
      const rt = Date.now() - readyAt.current;
      setReactionTime(rt);
      setBestTime(prev => Math.min(prev, rt));
      setTimes(prev => [...prev.slice(-9), rt]);
      setState('result');
    } else if (state === 'too-early' || state === 'result') {
      start();
    }
  }, [state, start]);

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  const getMessage = (ms: number) => {
    if (ms < 200) return { text: '⚡ Superhuman!', color: 'text-accent' };
    if (ms < 300) return { text: '🔥 Lightning Fast!', color: 'text-primary' };
    if (ms < 400) return { text: '👍 Good Reflexes!', color: 'text-primary' };
    return { text: '💪 Keep Practicing!', color: 'text-muted-foreground' };
  };

  const bgClass = {
    idle: 'bg-primary/10 border-primary/30',
    waiting: 'bg-destructive/10 border-destructive/30',
    ready: 'bg-accent/20 border-accent/40',
    result: 'bg-primary/10 border-primary/30',
    'too-early': 'bg-destructive/10 border-destructive/30',
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Zap size={16} className="text-accent" /> Reaction Speed
        </h3>
        <button
          onClick={() => { setState('idle'); setTimes([]); setBestTime(Infinity); }}
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">Avg: {avg || '—'}ms</span>
        <span className="text-accent">Best: {bestTime < Infinity ? `${bestTime}ms` : '—'}</span>
        <span className="text-muted-foreground">Tries: {times.length}</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`w-full h-64 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${bgClass[state]}`}
      >
        <div className="text-center">
          {state === 'idle' && (
            <>
              <p className="text-primary font-display font-semibold text-lg mb-1">Click to Start</p>
              <p className="text-muted-foreground text-xs font-mono">Test your reaction time</p>
            </>
          )}
          {state === 'waiting' && (
            <>
              <p className="text-destructive font-display font-semibold text-lg mb-1">Wait for green...</p>
              <p className="text-destructive/60 text-xs font-mono">Don't click yet!</p>
            </>
          )}
          {state === 'ready' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              <p className="text-accent font-display font-bold text-3xl mb-1">CLICK NOW!</p>
              <p className="text-accent/70 text-xs font-mono">As fast as you can!</p>
            </motion.div>
          )}
          {state === 'too-early' && (
            <>
              <p className="text-destructive font-display font-semibold text-lg mb-1">Too Early! 😅</p>
              <p className="text-muted-foreground text-xs font-mono">Click to try again</p>
            </>
          )}
          {state === 'result' && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <p className="text-4xl font-display font-bold text-primary mb-1">{reactionTime}ms</p>
              <p className={`text-sm font-display font-medium ${getMessage(reactionTime).color}`}>
                {getMessage(reactionTime).text}
              </p>
              <p className="text-muted-foreground text-xs font-mono mt-2">Click to try again</p>
            </motion.div>
          )}
        </div>
      </motion.button>

      {times.length > 0 && (
        <div className="mt-4 flex gap-1 justify-center">
          {times.map((t, i) => (
            <div
              key={i}
              className="w-6 rounded-t-sm bg-primary/30"
              style={{ height: `${Math.max(8, Math.min(40, (500 - t) / 10))}px` }}
              title={`${t}ms`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
