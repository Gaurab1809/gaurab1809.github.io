import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Swords, Shield, Zap, Heart } from 'lucide-react';

interface Question {
  q: string;
  options: string[];
  correct: number;
  skill: string;
}

const QUESTIONS: Question[] = [
  { q: 'Which hook manages side effects in React?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correct: 1, skill: 'React' },
  { q: 'What does CSS "position: sticky" do?', options: ['Fixed to viewport', 'Relative then fixed on scroll', 'Absolute to parent', 'Static'], correct: 1, skill: 'CSS' },
  { q: 'Time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, skill: 'Algorithms' },
  { q: 'What is a closure in JavaScript?', options: ['A CSS property', 'Function + lexical scope', 'A loop construct', 'Error handler'], correct: 1, skill: 'JavaScript' },
  { q: 'Which HTTP method is idempotent?', options: ['POST', 'PATCH', 'PUT', 'None'], correct: 2, skill: 'Backend' },
  { q: 'What does Docker containerize?', options: ['Hardware', 'Applications', 'Networks', 'Databases only'], correct: 1, skill: 'DevOps' },
  { q: 'SQL JOIN that returns all rows from both tables?', options: ['INNER', 'LEFT', 'FULL OUTER', 'CROSS'], correct: 2, skill: 'Database' },
  { q: 'What activation function outputs 0-1?', options: ['ReLU', 'Sigmoid', 'Tanh', 'Linear'], correct: 1, skill: 'AI/ML' },
  { q: 'Git command to save uncommitted changes?', options: ['git save', 'git stash', 'git cache', 'git store'], correct: 1, skill: 'Git' },
  { q: 'What is Big O of quicksort average case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 1, skill: 'Algorithms' },
  { q: 'TypeScript "interface" vs "type"?', options: ['Same thing', 'Interface is extendable', 'Type is faster', 'Interface is deprecated'], correct: 1, skill: 'TypeScript' },
  { q: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Client-Origin Request System', 'Cross-Object Render Service', 'None'], correct: 0, skill: 'Web Security' },
];

const BOSS_ATTACKS = [
  { name: 'Syntax Error Storm', emoji: '⚡', damage: 15 },
  { name: 'Memory Leak Drain', emoji: '💀', damage: 20 },
  { name: 'Infinite Loop Trap', emoji: '🌀', damage: 25 },
  { name: 'Null Pointer Strike', emoji: '💥', damage: 18 },
];

const PLAYER_ATTACKS = [
  { name: 'Debug Strike', emoji: '🔍', damage: 20 },
  { name: 'Refactor Slash', emoji: '⚔️', damage: 25 },
  { name: 'Unit Test Shield', emoji: '🛡️', damage: 15 },
  { name: 'Deploy Blast', emoji: '🚀', damage: 30 },
];

export default function BossFight() {
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [phase, setPhase] = useState<'idle' | 'question' | 'attack' | 'bossAttack' | 'result'>('idle');
  const [message, setMessage] = useState('Challenge the Bug Lord!');
  const [effect, setEffect] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [streak, setStreak] = useState(0);
  const usedQs = useRef<Set<number>>(new Set());

  const reset = () => {
    setPlayerHP(100);
    setBossHP(100);
    setPhase('idle');
    setMessage('Challenge the Bug Lord!');
    setCurrentQ(null);
    setEffect(null);
    setRound(0);
    setStreak(0);
    usedQs.current.clear();
  };

  const nextQuestion = useCallback(() => {
    const available = QUESTIONS.filter((_, i) => !usedQs.current.has(i));
    if (available.length === 0) usedQs.current.clear();
    const pool = available.length > 0 ? available : QUESTIONS;
    const idx = QUESTIONS.indexOf(pool[Math.floor(Math.random() * pool.length)]);
    usedQs.current.add(idx);
    setCurrentQ(QUESTIONS[idx]);
    setPhase('question');
    setRound(r => r + 1);
  }, []);

  const handleAnswer = (idx: number) => {
    if (!currentQ || phase !== 'question') return;

    if (idx === currentQ.correct) {
      const atk = PLAYER_ATTACKS[Math.floor(Math.random() * PLAYER_ATTACKS.length)];
      const bonus = Math.min(streak * 5, 20);
      const dmg = atk.damage + bonus;
      setEffect(atk.emoji);
      setMessage(`${atk.name}! -${dmg}HP ${bonus > 0 ? `(+${bonus} streak bonus!)` : ''}`);
      setBossHP(h => Math.max(0, h - dmg));
      setStreak(s => s + 1);
      setPhase('attack');
    } else {
      const atk = BOSS_ATTACKS[Math.floor(Math.random() * BOSS_ATTACKS.length)];
      setEffect(atk.emoji);
      setMessage(`Wrong! ${atk.name}! -${atk.damage}HP`);
      setPlayerHP(h => Math.max(0, h - atk.damage));
      setStreak(0);
      setPhase('bossAttack');
    }

    setTimeout(() => {
      setEffect(null);
      setPhase('idle');
    }, 1500);
  };

  useEffect(() => {
    if (playerHP <= 0) {
      setPhase('result');
      setMessage('The Bug Lord wins... Try again!');
      setScore(s => ({ ...s, losses: s.losses + 1 }));
    } else if (bossHP <= 0) {
      setPhase('result');
      setMessage('You defeated the Bug Lord! 🎉');
      setScore(s => ({ ...s, wins: s.wins + 1 }));
    }
  }, [playerHP, bossHP]);

  const hpColor = (hp: number) => hp > 60 ? 'bg-accent' : hp > 30 ? 'bg-yellow-500' : 'bg-destructive';

  return (
    <div className="glass rounded-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Swords size={16} className="text-primary" /> Boss Fight
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">W:{score.wins} L:{score.losses}</span>
          <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Arena */}
      <div className="relative bg-background/60 rounded-lg p-4 mb-3 border border-border min-h-[200px] overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/20"
              animate={{ y: [0, -100], x: [0, Math.sin(i) * 30], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              style={{ left: `${15 + i * 15}%`, bottom: '10%' }} />
          ))}
        </div>

        {/* Boss */}
        <div className="text-center mb-4">
          <div className="text-xs font-mono text-destructive mb-1 flex items-center justify-center gap-1">
            <Shield size={10} /> BUG LORD
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
            <motion.div className={`h-full rounded-full ${hpColor(bossHP)}`}
              animate={{ width: `${bossHP}%` }} transition={{ type: 'spring' }} />
          </div>
          <motion.div className="text-4xl"
            animate={phase === 'attack' ? { x: [0, -10, 10, -5, 0], scale: [1, 0.9, 1] } : {}}
            transition={{ duration: 0.5 }}>
            {bossHP <= 0 ? '💀' : '👾'}
          </motion.div>
        </div>

        {/* Effect */}
        <AnimatePresence>
          {effect && (
            <motion.div className="absolute inset-0 flex items-center justify-center text-6xl z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0, opacity: [1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}>
              {effect}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player */}
        <div className="text-center mt-4">
          <motion.div className="text-3xl mb-2"
            animate={phase === 'bossAttack' ? { x: [0, 10, -10, 5, 0], scale: [1, 0.9, 1] } : {}}>
            {playerHP <= 0 ? '😵' : '🧑‍💻'}
          </motion.div>
          <div className="w-full bg-secondary rounded-full h-2.5 mb-1">
            <motion.div className={`h-full rounded-full ${hpColor(playerHP)}`}
              animate={{ width: `${playerHP}%` }} transition={{ type: 'spring' }} />
          </div>
          <div className="text-xs font-mono text-primary flex items-center justify-center gap-1">
            <Heart size={10} /> YOU {streak > 1 && <span className="text-accent">🔥×{streak}</span>}
          </div>
        </div>
      </div>

      {/* Message */}
      <motion.p key={message} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-center text-sm font-mono text-muted-foreground mb-3 min-h-[20px]">
        {message}
      </motion.p>

      {/* Question or Action */}
      {phase === 'idle' && bossHP > 0 && playerHP > 0 && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={nextQuestion}
          className="w-full py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-display font-medium text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
          <Zap size={14} /> Attack (Round {round + 1})
        </motion.button>
      )}

      {phase === 'question' && currentQ && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-accent font-mono mb-1">[{currentQ.skill}]</p>
          <p className="text-sm font-display text-foreground mb-3">{currentQ.q}</p>
          <div className="grid grid-cols-1 gap-1.5">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)}
                className="text-left px-3 py-2 rounded-lg bg-secondary/50 text-sm text-foreground hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all font-mono">
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={reset}
          className="w-full py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent font-display font-medium text-sm hover:bg-accent/20 transition-all">
          Play Again
        </motion.button>
      )}
    </div>
  );
}
