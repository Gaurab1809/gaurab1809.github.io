import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Keyboard } from 'lucide-react';

const CODE_SNIPPETS = [
  'const result = data.filter(x => x.active).map(x => x.name);',
  'function fibonacci(n) { return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); }',
  'const [state, setState] = useState(initialValue);',
  'app.get("/api/users", async (req, res) => { const users = await db.query("SELECT * FROM users"); });',
  'import torch\nmodel = torch.nn.Sequential(torch.nn.Linear(784, 128), torch.nn.ReLU())',
  'docker run -d --name web -p 80:80 -v ./html:/usr/share/nginx/html nginx:latest',
  'git checkout -b feature/auth && git push origin feature/auth',
  'SELECT u.name, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name;',
  'const express = require("express"); const app = express(); app.listen(3000);',
  'pip install tensorflow numpy pandas scikit-learn matplotlib',
];

export default function TypingTest() {
  const [snippet, setSnippet] = useState('');
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const newSnippet = useCallback(() => {
    setSnippet(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
    setTyped('');
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => { newSnippet(); }, [newSnippet]);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      if (elapsed > 0) {
        const words = typed.length / 5;
        setWpm(Math.round(words / elapsed));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [started, finished, startTime, typed]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setTyped(value);

    // Count errors
    let errs = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== snippet[i]) errs++;
    }
    setErrors(errs);
    setAccuracy(value.length > 0 ? Math.round(((value.length - errs) / value.length) * 100) : 100);

    if (value.length >= snippet.length) {
      setFinished(true);
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const finalWpm = Math.round((snippet.length / 5) / elapsed);
      setWpm(finalWpm);
      setBestWpm(prev => Math.max(prev, finalWpm));
    }
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Keyboard size={16} className="text-primary" /> Code Typer
        </h3>
        <button onClick={newSnippet} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">{wpm} WPM</span>
        <span className={`${accuracy >= 90 ? 'text-accent' : 'text-destructive'}`}>{accuracy}% acc</span>
        <span className="text-muted-foreground">Best: {bestWpm} WPM</span>
      </div>

      {/* Code display */}
      <div className="bg-background/80 rounded-lg p-4 mb-4 border border-border font-mono text-sm leading-relaxed min-h-[80px] select-none">
        {snippet.split('').map((char, i) => {
          let color = 'text-muted-foreground/50';
          if (i < typed.length) {
            color = typed[i] === char ? 'text-accent' : 'text-destructive bg-destructive/10';
          } else if (i === typed.length) {
            color = 'text-foreground bg-primary/20';
          }
          return (
            <span key={i} className={`${color} ${char === '\n' ? 'block' : ''}`}>
              {char === ' ' && i === typed.length ? '·' : char === '\n' ? '↵\n' : char}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        disabled={finished}
        className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        placeholder={started ? 'Keep typing...' : 'Start typing the code above...'}
        autoComplete="off"
        spellCheck={false}
      />

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-accent font-display font-semibold">
            {wpm >= 60 ? '🚀 Speed Demon!' : wpm >= 40 ? '⚡ Nice Speed!' : '💪 Keep Practicing!'}
          </p>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {wpm} WPM · {accuracy}% accuracy · {errors} errors
          </p>
        </motion.div>
      )}
    </div>
  );
}
