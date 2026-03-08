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
import ChessGame from './games/ChessGame';
import BossFight from './games/BossFight';
import DevDungeon from './games/DevDungeon';
import SwarmArena from './games/SwarmArena';

const games = [
  { id: 'chess', name: 'AI Chess', description: 'Play chess against minimax AI', icon: '♟️' },
  { id: 'boss', name: 'Boss Fight', description: 'Defeat the Bug Lord with dev knowledge', icon: '👾' },
  { id: 'dungeon', name: 'Dev Dungeon', description: 'Solve coding puzzles to escape', icon: '🏚️' },
  { id: 'swarm', name: 'Swarm Arena', description: 'Survive evolving AI swarms', icon: '🎯' },
  { id: 'shooter', name: 'Bug Blaster', description: 'Shoot code bugs in space', icon: '🚀' },
  { id: 'snake', name: 'Code Snake', description: 'Classic snake with a dev twist', icon: '🐍' },
  { id: 'puzzle', name: 'Code Puzzle', description: 'Solve JavaScript challenges', icon: '🧩' },
  { id: 'typing', name: 'Code Typer', description: 'Test your typing speed', icon: '⌨️' },
  { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Play against minimax AI', icon: '🤖' },
  { id: 'memory', name: 'Memory', description: 'Tech-themed card matching', icon: '🧠' },
  { id: 'reaction', name: 'Reaction', description: 'Test your reflexes', icon: '⚡' },
  { id: 'trivia', name: 'Dev Trivia', description: 'Quiz your dev knowledge', icon: '❓' },
  { id: 'binary', name: 'Binary', description: 'Binary conversions & ops', icon: '🔢' },
  { id: 'sorting', name: 'Data Sort', description: 'Sort the array visually', icon: '📊' },
  { id: 'pathfinding', name: 'Pathfinder', description: 'BFS algorithm visualizer', icon: '🗺️' },
  { id: 'neural', name: 'Neural Net', description: 'Compute neuron outputs', icon: '🧬' },
];

export default function PlaygroundSection() {
  const [activeGame, setActiveGame] = useState('chess');
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
            Take a break and explore {games.length} interactive mini-games showcasing algorithms, AI, problem-solving, and creative coding.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Game selector - horizontal scrollable on mobile/tablet, vertical sidebar on desktop */}
          <div className="lg:w-48 shrink-0">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 snap-x lg:snap-none scrollbar-thin">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`snap-start flex-shrink-0 lg:flex-shrink rounded-lg transition-all
                    px-3 py-2 lg:px-3 lg:py-2.5 min-w-[72px] lg:min-w-0 lg:w-full
                    ${activeGame === game.id
                      ? 'glass glow-border text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                >
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-2">
                    <span className="text-lg lg:text-base">{game.icon}</span>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-display font-medium leading-tight text-center lg:text-left whitespace-nowrap lg:whitespace-normal">
                      {game.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden lg:block">{game.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Game area - consistent width across all games */}
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex justify-center items-start"
          >
            <div className="w-full max-w-md">
              {activeGame === 'chess' && <ChessGame />}
              {activeGame === 'boss' && <BossFight />}
              {activeGame === 'dungeon' && <DevDungeon />}
              {activeGame === 'swarm' && <SwarmArena />}
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
