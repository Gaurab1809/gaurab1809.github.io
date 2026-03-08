import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, HelpCircle, CheckCircle, XCircle, Timer } from 'lucide-react';

interface Question {
  q: string;
  options: string[];
  correct: number;
  fact: string;
  category: string;
}

const QUESTIONS: Question[] = [
  { q: 'What does "HTTP" stand for?', options: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'HyperText Transmission Program', 'Home Tool Transfer Protocol'], correct: 0, fact: 'HTTP was invented by Tim Berners-Lee at CERN in 1989.', category: 'Web' },
  { q: 'Which sorting algorithm has O(n log n) average case?', options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'], correct: 1, fact: 'Merge Sort guarantees O(n log n) in all cases — worst, average, and best.', category: 'DSA' },
  { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correct: 2, fact: 'Binary search halves the search space with each comparison.', category: 'DSA' },
  { q: 'Which language is PyTorch written in?', options: ['Python only', 'C++ and Python', 'Java and Python', 'Rust and Python'], correct: 1, fact: 'PyTorch\'s core is written in C++ for performance, with Python bindings.', category: 'AI/ML' },
  { q: 'What does CNN stand for in deep learning?', options: ['Computer Neural Network', 'Convolutional Neural Network', 'Connected Node Network', 'Core Neural Net'], correct: 1, fact: 'CNNs are inspired by the visual cortex and excel at image tasks.', category: 'AI/ML' },
  { q: 'Which company created React?', options: ['Google', 'Microsoft', 'Facebook (Meta)', 'Amazon'], correct: 2, fact: 'React was created by Jordan Walke at Facebook in 2013.', category: 'Web' },
  { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], correct: 0, fact: 'SQL was developed at IBM in the 1970s by Donald Chamberlin.', category: 'Database' },
  { q: 'Which Git command creates a new branch?', options: ['git new', 'git branch', 'git create', 'git fork'], correct: 1, fact: 'You can also use "git checkout -b" to create and switch in one step.', category: 'DevOps' },
  { q: 'What activation function outputs values between 0 and 1?', options: ['ReLU', 'Tanh', 'Sigmoid', 'Softmax'], correct: 2, fact: 'Sigmoid maps any real number to (0, 1), useful for binary classification.', category: 'AI/ML' },
  { q: 'What does Docker containerize?', options: ['Hardware', 'Applications', 'Networks', 'Databases only'], correct: 1, fact: 'Docker packages apps with their dependencies into portable containers.', category: 'DevOps' },
  { q: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1, fact: 'FIFO = First In, First Out. Think of a line at a store!', category: 'DSA' },
  { q: 'What is the vanishing gradient problem?', options: ['Gradients become too large', 'Gradients approach zero', 'Gradients oscillate', 'No gradients computed'], correct: 1, fact: 'This was a major issue in deep networks before ReLU and skip connections.', category: 'AI/ML' },
  { q: 'What is a RESTful API?', options: ['A sleeping program', 'An architectural style for APIs', 'A testing framework', 'A database query'], correct: 1, fact: 'REST was defined by Roy Fielding in his 2000 doctoral dissertation.', category: 'Web' },
  { q: 'Which AWS service is used for serverless computing?', options: ['EC2', 'S3', 'Lambda', 'RDS'], correct: 2, fact: 'AWS Lambda runs code without provisioning servers, scaling automatically.', category: 'DevOps' },
  { q: 'What does NLP stand for?', options: ['New Language Processing', 'Natural Language Processing', 'Neural Logic Programming', 'Native Language Protocol'], correct: 1, fact: 'NLP enables machines to understand and generate human language.', category: 'AI/ML' },
];

export default function DevTrivia() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const shuffle = useCallback(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTimer(15);
    setGameOver(false);
    setStreak(0);
  }, []);

  useEffect(() => { shuffle(); }, [shuffle]);

  useEffect(() => {
    if (showResult || gameOver || questions.length === 0) return;
    if (timer <= 0) {
      setShowResult(true);
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, showResult, gameOver, questions.length]);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[current].correct) {
      setScore(s => s + (timer > 10 ? 15 : timer > 5 ? 10 : 5));
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
      setTimer(15);
    }
  };

  if (questions.length === 0) return null;

  const q = questions[current];

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <HelpCircle size={16} className="text-primary" /> Dev Trivia
        </h3>
        <button onClick={shuffle} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">🔥 {streak}</span>
        <span className={`flex items-center gap-1 ${timer <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
          <Timer size={12} /> {timer}s
        </span>
        <span className="text-muted-foreground">{current + 1}/{questions.length}</span>
      </div>

      {!gameOver ? (
        <>
          <div className="mb-1 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '100%' }}
              animate={{ width: `${(timer / 15) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="bg-background/80 rounded-lg p-4 my-4 border border-border">
            <span className="text-[10px] font-mono text-primary/60 uppercase">{q.category}</span>
            <p className="text-sm font-display font-medium text-foreground mt-1">{q.q}</p>
          </div>

          <div className="space-y-2 mb-4">
            {q.options.map((opt, i) => {
              let cls = 'bg-secondary/50 hover:bg-primary/10 border-border';
              if (showResult) {
                if (i === q.correct) cls = 'bg-accent/10 border-accent/40';
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
                  <span className="text-foreground/90 text-xs">{opt}</span>
                  {showResult && i === q.correct && <CheckCircle size={14} className="ml-auto text-accent" />}
                  {showResult && i === selected && i !== q.correct && <XCircle size={14} className="ml-auto text-destructive" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="p-3 rounded-lg mb-3 text-xs font-mono bg-primary/5 border border-primary/10 text-muted-foreground">
                  💡 {q.fact}
                </div>
                <button onClick={next} className="w-full py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                  {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <p className="text-4xl mb-2">{score >= 100 ? '🏆' : score >= 70 ? '⭐' : score >= 40 ? '👍' : '📚'}</p>
          <p className="text-2xl font-display font-bold text-primary mb-1">{score} points</p>
          <p className="text-sm text-muted-foreground font-mono mb-4">
            {score >= 100 ? 'Dev Master!' : score >= 70 ? 'Great Knowledge!' : score >= 40 ? 'Not Bad!' : 'Keep Learning!'}
          </p>
          <button onClick={shuffle} className="px-6 py-2.5 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
