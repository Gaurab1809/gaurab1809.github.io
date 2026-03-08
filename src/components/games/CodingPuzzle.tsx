import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Code2, CheckCircle, XCircle } from 'lucide-react';

interface Puzzle {
  code: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const PUZZLES: Puzzle[] = [
  {
    code: `let x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x.length);`,
    question: 'What is the output?',
    options: ['3', '4', 'undefined', 'Error'],
    correct: 1,
    explanation: 'Arrays are reference types in JS. y and x point to the same array, so pushing to y also affects x.',
    difficulty: 'Easy'
  },
  {
    code: `console.log(typeof null);`,
    question: 'What does this print?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correct: 2,
    explanation: 'This is a well-known JavaScript bug. typeof null returns "object" due to a legacy implementation detail.',
    difficulty: 'Easy'
  },
  {
    code: `const a = [1, 2, 3];\nconst b = [1, 2, 3];\nconsole.log(a === b);`,
    question: 'What is the output?',
    options: ['true', 'false', 'undefined', 'Error'],
    correct: 1,
    explanation: 'Arrays are objects compared by reference, not value. a and b are different objects in memory.',
    difficulty: 'Easy'
  },
  {
    code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
    question: 'What is printed?',
    options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'undefined x3'],
    correct: 1,
    explanation: 'var is function-scoped. By the time setTimeout fires, the loop is done and i is 3. Use let for block scoping.',
    difficulty: 'Medium'
  },
  {
    code: `const obj = { a: 1 };\nObject.freeze(obj);\nobj.a = 2;\nconsole.log(obj.a);`,
    question: 'What is the output?',
    options: ['1', '2', 'undefined', 'Error'],
    correct: 0,
    explanation: 'Object.freeze() prevents modification. In non-strict mode, the assignment silently fails.',
    difficulty: 'Medium'
  },
  {
    code: `console.log(0.1 + 0.2 === 0.3);`,
    question: 'What does this evaluate to?',
    options: ['true', 'false', 'NaN', 'Error'],
    correct: 1,
    explanation: 'Floating-point arithmetic! 0.1 + 0.2 = 0.30000000000000004 in IEEE 754.',
    difficulty: 'Medium'
  },
  {
    code: `function foo() {\n  return\n  { bar: "hello" };\n}\nconsole.log(foo());`,
    question: 'What is the output?',
    options: ['{ bar: "hello" }', 'undefined', 'null', 'Error'],
    correct: 1,
    explanation: 'ASI (Automatic Semicolon Insertion) adds a semicolon after return, making it return undefined.',
    difficulty: 'Hard'
  },
  {
    code: `const arr = [10, 20, 30];\narr[10] = 100;\nconsole.log(arr.length);`,
    question: 'What is the array length?',
    options: ['3', '4', '11', '100'],
    correct: 2,
    explanation: 'Setting index 10 creates a sparse array with empty slots from index 3-9. Length becomes 11.',
    difficulty: 'Hard'
  },
  {
    code: `Promise.resolve(1)\n  .then(x => x + 1)\n  .then(x => { throw x })\n  .then(x => x + 1)\n  .catch(x => x)\n  .then(x => console.log(x));`,
    question: 'What is logged?',
    options: ['1', '2', '3', '4'],
    correct: 1,
    explanation: 'resolve(1) → then(2) → throw(2) skips next then → catch(2) → then logs 2.',
    difficulty: 'Hard'
  },
];

export default function CodingPuzzle() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const puzzle = PUZZLES[currentIdx];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    setTotal(t => t + 1);
    if (idx === puzzle.correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextPuzzle = () => {
    setCurrentIdx((currentIdx + 1) % PUZZLES.length);
    setSelected(null);
    setShowResult(false);
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTotal(0);
    setStreak(0);
  };

  const diffColor = {
    Easy: 'text-accent',
    Medium: 'text-primary',
    Hard: 'text-destructive',
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Code2 size={16} className="text-primary" /> Code Puzzle
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">{score}/{total} correct</span>
        <span className={diffColor[puzzle.difficulty]}>{puzzle.difficulty}</span>
        <span className="text-accent">🔥 {streak} streak</span>
      </div>

      {/* Code block */}
      <div className="bg-background/80 rounded-lg p-4 mb-4 border border-border">
        <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {puzzle.code}
        </pre>
      </div>

      <p className="text-sm font-display font-medium text-foreground mb-3">{puzzle.question}</p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {puzzle.options.map((opt, i) => {
          let cls = 'bg-secondary/50 hover:bg-primary/10 border-border';
          if (showResult) {
            if (i === puzzle.correct) cls = 'bg-accent/10 border-accent/40';
            else if (i === selected) cls = 'bg-destructive/10 border-destructive/40';
            else cls = 'bg-secondary/30 border-border/50 opacity-50';
          }
          return (
            <motion.button
              key={i}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono transition-all flex items-center gap-2 ${cls}`}
            >
              <span className="text-muted-foreground text-xs w-5">{String.fromCharCode(65 + i)}.</span>
              <span className="text-foreground/90">{opt}</span>
              {showResult && i === puzzle.correct && <CheckCircle size={14} className="ml-auto text-accent" />}
              {showResult && i === selected && i !== puzzle.correct && <XCircle size={14} className="ml-auto text-destructive" />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={`p-3 rounded-lg mb-3 text-xs font-mono ${
              selected === puzzle.correct ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              <p className="font-display font-semibold text-sm mb-1">
                {selected === puzzle.correct ? '✅ Correct!' : '❌ Wrong!'}
              </p>
              <p className="text-muted-foreground">{puzzle.explanation}</p>
            </div>
            <button
              onClick={nextPuzzle}
              className="w-full py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Next Puzzle →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
