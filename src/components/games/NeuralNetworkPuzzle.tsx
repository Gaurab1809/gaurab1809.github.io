import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Brain } from 'lucide-react';

interface Layer { weights: number[]; bias: number }

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
function relu(x: number) { return Math.max(0, x); }

interface Puzzle {
  title: string;
  inputs: number[];
  layers: Layer[];
  activation: 'sigmoid' | 'relu';
  answer: number;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    title: 'Single Neuron - ReLU',
    inputs: [2, 3],
    layers: [{ weights: [1, -1], bias: 0 }],
    activation: 'relu',
    answer: 0,
    explanation: '2×1 + 3×(-1) + 0 = -1. ReLU(-1) = max(0,-1) = 0'
  },
  {
    title: 'Single Neuron - Sigmoid',
    inputs: [0, 0],
    layers: [{ weights: [1, 1], bias: 0 }],
    activation: 'sigmoid',
    answer: 0.5,
    explanation: '0×1 + 0×1 + 0 = 0. Sigmoid(0) = 0.5'
  },
  {
    title: 'Weighted Sum',
    inputs: [1, 2],
    layers: [{ weights: [3, 4], bias: 1 }],
    activation: 'relu',
    answer: 12,
    explanation: '1×3 + 2×4 + 1 = 12. ReLU(12) = 12'
  },
  {
    title: 'Negative Bias',
    inputs: [5, 1],
    layers: [{ weights: [1, 1], bias: -10 }],
    activation: 'relu',
    answer: 0,
    explanation: '5×1 + 1×1 + (-10) = -4. ReLU(-4) = 0'
  },
  {
    title: 'Large Input',
    inputs: [10],
    layers: [{ weights: [1], bias: 0 }],
    activation: 'sigmoid',
    answer: 1,
    explanation: 'Sigmoid(10) ≈ 0.99995 ≈ 1'
  },
  {
    title: 'Zero Weights',
    inputs: [100, 200],
    layers: [{ weights: [0, 0], bias: 5 }],
    activation: 'relu',
    answer: 5,
    explanation: '100×0 + 200×0 + 5 = 5. ReLU(5) = 5'
  },
];

export default function NeuralNetworkPuzzle() {
  const [idx, setIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const puzzle = PUZZLES[idx];

  const check = useCallback(() => {
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) return;
    setTotal(t => t + 1);
    const correct = Math.abs(parsed - puzzle.answer) < 0.1;
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  }, [userAnswer, puzzle]);

  const next = () => {
    setIdx((idx + 1) % PUZZLES.length);
    setUserAnswer('');
    setResult(null);
  };

  const reset = () => {
    setIdx(0);
    setUserAnswer('');
    setResult(null);
    setScore(0);
    setTotal(0);
  };

  const layer = puzzle.layers[0];

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Brain size={16} className="text-accent" /> Neural Puzzle
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">{score}/{total} correct</span>
        <span className="text-muted-foreground">{idx + 1}/{PUZZLES.length}</span>
      </div>

      <p className="text-xs font-display font-medium text-accent mb-3">{puzzle.title}</p>

      {/* Visual neural network */}
      <div className="bg-background/80 rounded-lg p-4 mb-4 border border-border">
        <div className="flex items-center justify-between">
          {/* Inputs */}
          <div className="flex flex-col gap-2">
            {puzzle.inputs.map((inp, i) => (
              <div key={i} className="px-3 py-1.5 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary text-center">
                x{i + 1}={inp}
              </div>
            ))}
          </div>

          {/* Weights */}
          <div className="flex flex-col gap-1 text-[10px] font-mono text-muted-foreground">
            {layer.weights.map((w, i) => (
              <span key={i}>w{i + 1}={w}</span>
            ))}
            <span className="text-accent/70">b={layer.bias}</span>
          </div>

          {/* Neuron */}
          <div className="w-12 h-12 rounded-full border-2 border-primary/40 flex items-center justify-center">
            <span className="text-[10px] font-mono text-primary">{puzzle.activation === 'sigmoid' ? 'σ' : 'R'}</span>
          </div>

          {/* Arrow */}
          <span className="text-muted-foreground">→</span>

          {/* Output */}
          <div className="px-3 py-1.5 rounded bg-accent/10 border border-accent/20 text-xs font-mono text-accent text-center">
            ?
          </div>
        </div>

        <p className="text-[10px] font-mono text-muted-foreground/60 mt-3 text-center">
          f(Σ(xi × wi) + b) using {puzzle.activation === 'sigmoid' ? 'Sigmoid' : 'ReLU'}
        </p>
      </div>

      {result === null ? (
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && userAnswer && check()}
            className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-center"
            placeholder="Output?"
            autoFocus
          />
          <button
            onClick={check}
            disabled={!userAnswer}
            className="px-4 py-3 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Check
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`p-3 rounded-lg mb-3 text-center ${
            result === 'correct' ? 'bg-accent/10 border border-accent/20' : 'bg-destructive/10 border border-destructive/20'
          }`}>
            <p className="font-display font-semibold text-sm mb-1">
              {result === 'correct' ? '✅ Correct!' : `❌ Answer: ${puzzle.answer}`}
            </p>
            <p className="text-xs font-mono text-muted-foreground">{puzzle.explanation}</p>
          </div>
          <button onClick={next} className="w-full py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90">
            Next Puzzle →
          </button>
        </motion.div>
      )}
    </div>
  );
}
