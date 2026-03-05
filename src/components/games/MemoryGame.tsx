import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Timer } from 'lucide-react';

const techIcons = ['⚛️', '🐍', '🧠', '🔥', '⚡', '🎯', '💎', '🚀'];
const allCards = [...techIcons, ...techIcons];

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const shuffle = useCallback(() => {
    const shuffled = allCards
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setTime(0);
    setStarted(false);
    setCompleted(false);
  }, []);

  useEffect(() => { shuffle(); }, [shuffle]);

  useEffect(() => {
    if (!started || completed) return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [started, completed]);

  const handleClick = (id: number) => {
    if (selected.length >= 2 || cards[id].flipped || cards[id].matched) return;
    if (!started) setStarted(true);

    const newCards = [...cards];
    newCards[id].flipped = true;
    const newSelected = [...selected, id];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].icon === newCards[b].icon) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setSelected([]);
        if (newCards.every(c => c.matched)) setCompleted(true);
      } else {
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setSelected([]);
        }, 800);
      }
    }
  };

  return (
    <div className="glass rounded-xl p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Memory Match</h3>
        <button onClick={shuffle} className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex justify-center gap-6 mb-4 text-xs font-mono">
        <span className="text-primary">Moves: {moves}</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Timer size={12} /> {time}s
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(card.id)}
            className={`aspect-square rounded-lg text-xl flex items-center justify-center transition-all ${
              card.flipped || card.matched
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-secondary/60 hover:bg-primary/5 cursor-pointer'
            } ${card.matched ? 'opacity-60' : ''}`}
          >
            {(card.flipped || card.matched) && (
              <motion.span
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.2 }}
              >
                {card.icon}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm font-mono text-accent"
        >
          🎉 Completed in {moves} moves, {time}s!
        </motion.div>
      )}
    </div>
  );
}
