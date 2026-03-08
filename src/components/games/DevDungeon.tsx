import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, DoorOpen, Star, Code, Skull } from 'lucide-react';

interface Room {
  name: string;
  description: string;
  emoji: string;
  challenge: { code: string; question: string; options: string[]; correct: number };
  xp: number;
}

const ROOMS: Room[] = [
  {
    name: 'The Entry Hall', description: 'A dimly lit hall with glowing runes...', emoji: '🏚️',
    challenge: { code: 'console.log(typeof null)', question: 'What does this output?', options: ['"null"', '"object"', '"undefined"', 'Error'], correct: 1 },
    xp: 10,
  },
  {
    name: 'Array Cavern', description: 'Arrays float in mid-air like crystals...', emoji: '💎',
    challenge: { code: '[1,2,3].map(x => x*2).filter(x => x>3)', question: 'What is the result?', options: ['[4, 6]', '[2, 4, 6]', '[6]', '[4]'], correct: 0 },
    xp: 15,
  },
  {
    name: 'Promise Chamber', description: 'Doors open only when promises resolve...', emoji: '⏳',
    challenge: { code: 'Promise.resolve(1).then(x => x + 1).then(x => x * 3)', question: 'Final resolved value?', options: ['3', '6', '4', '9'], correct: 1 },
    xp: 20,
  },
  {
    name: 'Closure Crypt', description: 'Variables are trapped within walls...', emoji: '🔒',
    challenge: {
      code: 'function f() { let a=1; return ()=>a++; }\nconst g=f(); g(); console.log(g())',
      question: 'What is logged?', options: ['1', '2', '3', 'undefined'], correct: 1,
    },
    xp: 25,
  },
  {
    name: 'Recursion Abyss', description: 'The room contains smaller copies of itself...', emoji: '🌀',
    challenge: {
      code: 'const f = n => n <= 1 ? 1 : n * f(n-1);\nf(5)',
      question: 'What does f(5) return?', options: ['25', '120', '15', '60'], correct: 1,
    },
    xp: 30,
  },
  {
    name: 'Regex Labyrinth', description: 'Patterns guard every passage...', emoji: '🧩',
    challenge: { code: '/^[a-z]+@[a-z]+\\.[a-z]{2,}$/', question: 'What does this regex validate?', options: ['URL', 'Email', 'Phone', 'IP address'], correct: 1 },
    xp: 25,
  },
  {
    name: 'Algorithm Arena', description: 'Sorting swords clash against searching shields...', emoji: '⚔️',
    challenge: { code: 'A sorted array of 1 million elements', question: 'Max comparisons for binary search?', options: ['20', '100', '1000', '500000'], correct: 0 },
    xp: 35,
  },
  {
    name: 'Boss Room: The Debugger', description: 'The final challenge awaits...', emoji: '👹',
    challenge: {
      code: 'const a={x:1}; const b=a; b.x=2;\nconsole.log(a.x)',
      question: 'What is logged and why?', options: ['1 (copy)', '2 (reference)', 'undefined', 'Error'], correct: 1,
    },
    xp: 50,
  },
];

export default function DevDungeon() {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<'explore' | 'challenge' | 'victory' | 'defeat' | 'complete'>('explore');
  const [feedback, setFeedback] = useState('');
  const [lives, setLives] = useState(3);
  const [roomsCleared, setRoomsCleared] = useState<Set<number>>(new Set());

  const room = ROOMS[currentRoom];

  const reset = () => {
    setCurrentRoom(0);
    setXp(0);
    setLevel(1);
    setPhase('explore');
    setFeedback('');
    setLives(3);
    setRoomsCleared(new Set());
  };

  const handleAnswer = useCallback((idx: number) => {
    if (idx === room.challenge.correct) {
      const newXp = xp + room.xp;
      setXp(newXp);
      setLevel(Math.floor(newXp / 50) + 1);
      setRoomsCleared(s => new Set(s).add(currentRoom));
      setFeedback(`✅ Correct! +${room.xp} XP`);
      setPhase('victory');
    } else {
      setLives(l => l - 1);
      if (lives <= 1) {
        setFeedback('💀 No lives left! The dungeon claims another soul...');
        setPhase('defeat');
      } else {
        setFeedback(`❌ Wrong! ${lives - 1} ${lives - 1 === 1 ? 'life' : 'lives'} remaining`);
        setPhase('explore');
      }
    }
  }, [room, xp, currentRoom, lives]);

  const nextRoom = () => {
    if (currentRoom + 1 >= ROOMS.length) {
      setPhase('complete');
    } else {
      setCurrentRoom(r => r + 1);
      setPhase('explore');
      setFeedback('');
    }
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <DoorOpen size={16} className="text-primary" /> Dev Dungeon
        </h3>
        <button onClick={reset} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-3 text-xs font-mono">
        <span className="text-primary flex items-center gap-1"><Star size={10} /> Lv.{level}</span>
        <span className="text-accent">{xp} XP</span>
        <span className="text-destructive flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={i < lives ? 'opacity-100' : 'opacity-20'}>❤️</span>
          ))}
        </span>
        <span className="text-muted-foreground">{roomsCleared.size}/{ROOMS.length}</span>
      </div>

      {/* Room progress */}
      <div className="flex gap-1 mb-4">
        {ROOMS.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
            roomsCleared.has(i) ? 'bg-accent' : i === currentRoom ? 'bg-primary animate-pulse' : 'bg-secondary'
          }`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-background/60 rounded-lg p-4 border border-border mb-3 text-center">
              <div className="text-4xl mb-2">{room.emoji}</div>
              <h4 className="font-display font-semibold text-foreground text-sm">{room.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{room.description}</p>
            </div>
            {feedback && (
              <p className="text-xs text-center font-mono text-destructive mb-2">{feedback}</p>
            )}
            <button onClick={() => setPhase('challenge')}
              className="w-full py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-display font-medium text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
              <Code size={14} /> Enter Challenge
            </button>
          </motion.div>
        )}

        {phase === 'challenge' && (
          <motion.div key="challenge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-background/80 rounded-lg p-3 border border-border mb-3 font-mono text-xs leading-relaxed">
              <div className="text-muted-foreground/50 mb-1">// {room.name}</div>
              {room.challenge.code.split('\n').map((line, i) => (
                <div key={i} className="text-accent">{line}</div>
              ))}
            </div>
            <p className="text-sm font-display text-foreground mb-3">{room.challenge.question}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {room.challenge.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="text-left px-3 py-2 rounded-lg bg-secondary/50 text-sm text-foreground hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all font-mono">
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'victory' && (
          <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center py-6">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-accent font-display font-semibold">{feedback}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">Room cleared!</p>
            <button onClick={nextRoom}
              className="mt-4 px-6 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-display hover:bg-accent/20 transition-all">
              {currentRoom + 1 >= ROOMS.length ? 'Claim Victory' : 'Next Room →'}
            </button>
          </motion.div>
        )}

        {phase === 'defeat' && (
          <motion.div key="defeat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <div className="text-4xl mb-2"><Skull className="inline" size={40} /></div>
            <p className="text-destructive font-display font-semibold">{feedback}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">Cleared {roomsCleared.size} rooms · {xp} XP earned</p>
            <button onClick={reset}
              className="mt-4 px-6 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-display hover:bg-primary/20 transition-all">
              Try Again
            </button>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-accent font-display font-bold text-lg">Dungeon Conquered!</p>
            <p className="text-xs text-muted-foreground font-mono mt-2">Level {level} · {xp} XP · All {ROOMS.length} rooms cleared</p>
            <button onClick={reset}
              className="mt-4 px-6 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-display hover:bg-accent/20 transition-all">
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
