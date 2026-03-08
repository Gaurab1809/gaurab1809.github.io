import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Binary } from 'lucide-react';

interface Challenge {
  type: 'to-decimal' | 'to-binary' | 'operation';
  question: string;
  answer: string;
  hint: string;
}

function generateChallenge(): Challenge {
  const types: Challenge['type'][] = ['to-decimal', 'to-binary', 'operation'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'to-decimal') {
    const num = Math.floor(Math.random() * 256);
    const binary = num.toString(2).padStart(8, '0');
    return { type, question: `Convert binary ${binary} to decimal`, answer: String(num), hint: `Hint: Start from right. Each bit is 2^n` };
  } else if (type === 'to-binary') {
    const num = Math.floor(Math.random() * 64);
    return { type, question: `Convert decimal ${num} to binary`, answer: num.toString(2), hint: `Hint: Divide by 2 repeatedly, read remainders bottom-up` };
  } else {
    const a = Math.floor(Math.random() * 16);
    const b = Math.floor(Math.random() * 16);
    const ops = [
      { symbol: 'AND', fn: (x: number, y: number) => x & y },
      { symbol: 'OR', fn: (x: number, y: number) => x | y },
      { symbol: 'XOR', fn: (x: number, y: number) => x ^ y },
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const result = op.fn(a, b);
    return {
      type: 'operation',
      question: `${a.toString(2).padStart(4, '0')} ${op.symbol} ${b.toString(2).padStart(4, '0')} = ?`,
      answer: result.toString(2).padStart(4, '0'),
      hint: `${op.symbol}: ${op.symbol === 'AND' ? '1 only if both 1' : op.symbol === 'OR' ? '1 if either 1' : '1 if different'}`
    };
  }
}

export default function BinaryPuzzle() {
  const [challenge, setChallenge] = useState<Challenge>(generateChallenge);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const check = useCallback(() => {
    const userAnswer = input.trim().replace(/^0+/, '') || '0';
    const correctAnswer = challenge.answer.replace(/^0+/, '') || '0';
    setTotal(t => t + 1);
    if (userAnswer === correctAnswer) {
      setResult('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setResult('wrong');
      setStreak(0);
    }
  }, [input, challenge]);

  const next = () => {
    setChallenge(generateChallenge());
    setInput('');
    setResult(null);
    setShowHint(false);
  };

  const reset = () => {
    next();
    setScore(0);
    setTotal(0);
    setStreak(0);
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Binary size={16} className="text-primary" /> Binary Puzzle
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">{score}/{total} correct</span>
        <span className="text-accent">🔥 {streak}</span>
      </div>

      <div className="bg-background/80 rounded-lg p-4 mb-4 border border-border">
        <p className="font-mono text-sm text-foreground text-center">{challenge.question}</p>
      </div>

      {result === null ? (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input.trim() && check()}
              className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-center"
              placeholder="Your answer..."
              autoFocus
            />
            <button
              onClick={check}
              disabled={!input.trim()}
              className="px-4 py-3 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              Check
            </button>
          </div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {showHint ? '🙈 Hide hint' : '💡 Show hint'}
          </button>
          {showHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-mono text-muted-foreground/70 mt-2"
            >
              {challenge.hint}
            </motion.p>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`p-3 rounded-lg mb-3 text-center ${
            result === 'correct' ? 'bg-accent/10 border border-accent/20' : 'bg-destructive/10 border border-destructive/20'
          }`}>
            <p className="font-display font-semibold text-sm mb-1">
              {result === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
            </p>
            {result === 'wrong' && (
              <p className="text-xs font-mono text-muted-foreground">Answer: {challenge.answer}</p>
            )}
          </div>
          <button
            onClick={next}
            className="w-full py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Next Challenge →
          </button>
        </motion.div>
      )}
    </div>
  );
}
