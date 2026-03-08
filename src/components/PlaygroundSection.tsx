import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import TicTacToe from './games/TicTacToe';
import MemoryGame from './games/MemoryGame';
import SpaceShooter from './games/SpaceShooter';
import SnakeGame from './games/SnakeGame';
import TypingTest from './games/TypingTest';
import CodingPuzzle from './games/CodingPuzzle';
import ReactionSpeed from './games/ReactionSpeed';
import DevTrivia from './games/DevTrivia';
import BinaryPuzzle from './games/BinaryPuzzle';
import DataSorting from './games/DataSorting';
import PathfindingGame from './games/PathfindingGame';
import NeuralNetworkPuzzle from './games/NeuralNetworkPuzzle';

const games = [
  { id: 'shooter', name: 'Bug Blaster', description: 'Shoot code bugs in space', icon: '🚀' },
  { id: 'snake', name: 'Code Snake', description: 'Classic snake with a dev twist', icon: '🐍' },
  { id: 'puzzle', name: 'Code Puzzle', description: 'Solve JavaScript challenges', icon: '🧩' },
  { id: 'typing', name: 'Code Typer', description: 'Test your typing speed', icon: '⌨️' },
  { id: 'tictactoe', name: 'AI Tic Tac Toe', description: 'Play against minimax AI', icon: '🤖' },
  { id: 'memory', name: 'Memory Match', description: 'Tech-themed card matching', icon: '🧠' },
  { id: 'reaction', name: 'Reaction Speed', description: 'Test your reflexes', icon: '⚡' },
  { id: 'trivia', name: 'Dev Trivia', description: 'Quiz your dev knowledge', icon: '❓' },
  { id: 'binary', name: 'Binary Puzzle', description: 'Binary conversions & ops', icon: '🔢' },
  { id: 'sorting', name: 'Data Sorter', description: 'Sort the array visually', icon: '📊' },
  { id: 'pathfinding', name: 'Pathfinder', description: 'BFS algorithm visualizer', icon: '🗺️' },
  { id: 'neural', name: 'Neural Puzzle', description: 'Compute neuron outputs', icon: '🧬' },
];

export default function PlaygroundSection() {
  const [activeGame, setActiveGame] = useState('shooter');
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
            Take a break and explore 12 interactive mini-games showcasing algorithms, AI, problem-solving, and creative coding.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-1 gap-2 lg:w-52 shrink-0">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`text-left px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg transition-all text-sm flex-shrink-0 ${
                  activeGame === game.id
                    ? 'glass glow-border text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                <div className="font-display font-medium flex items-center gap-2 text-xs lg:text-sm">
                  <span>{game.icon}</span> <span className="hidden sm:inline">{game.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 hidden lg:block">{game.description}</div>
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
            {activeGame === 'shooter' && <SpaceShooter />}
            {activeGame === 'snake' && <SnakeGame />}
            {activeGame === 'puzzle' && <CodingPuzzle />}
            {activeGame === 'typing' && <TypingTest />}
            {activeGame === 'tictactoe' && <TicTacToe />}
            {activeGame === 'memory' && <MemoryGame />}
            {activeGame === 'reaction' && <ReactionSpeed />}
            {activeGame === 'trivia' && <DevTrivia />}
            {activeGame === 'binary' && <BinaryPuzzle />}
            {activeGame === 'sorting' && <DataSorting />}
            {activeGame === 'pathfinding' && <PathfindingGame />}
            {activeGame === 'neural' && <NeuralNetworkPuzzle />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
