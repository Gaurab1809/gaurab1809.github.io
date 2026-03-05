import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import TicTacToe from './games/TicTacToe';
import MemoryGame from './games/MemoryGame';

const games = [
  { id: 'tictactoe', name: 'AI Tic Tac Toe', description: 'Play against an unbeatable AI' },
  { id: 'memory', name: 'Memory Match', description: 'Tech-themed card matching' },
];

export default function PlaygroundSection() {
  const [activeGame, setActiveGame] = useState('tictactoe');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="playground" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 flex items-center gap-3">
            <Gamepad2 className="text-accent" />
            <span>Interactive <span className="text-gradient-accent">Lab</span></span>
          </h2>
          <div className="w-20 h-1 bg-accent/50 rounded-full mb-6" />
          <p className="text-muted-foreground max-w-lg">
            Take a break and explore some interactive mini-games. They showcase algorithms and creative coding.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex md:flex-col gap-2 md:w-48 shrink-0">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`text-left px-4 py-3 rounded-lg transition-all text-sm ${
                  activeGame === game.id
                    ? 'glass glow-border text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                <div className="font-display font-medium">{game.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{game.description}</div>
              </button>
            ))}
          </div>

          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex justify-center"
          >
            {activeGame === 'tictactoe' && <TicTacToe />}
            {activeGame === 'memory' && <MemoryGame />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
