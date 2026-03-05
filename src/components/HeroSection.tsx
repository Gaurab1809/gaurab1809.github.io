import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import profile from '@/data/profile.json';

const NeuralNetwork3D = lazy(() => import('./NeuralNetwork3D'));

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <NeuralNetwork3D />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-primary border border-primary/30 rounded-full glow-border">
            Available for Research Collaboration
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">{profile.name.split(' ')[0]}</span>
          <br />
          <span className="text-gradient-primary">{profile.name.split(' ').slice(1).join(' ')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground mb-4 font-display font-light"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm sm:text-base text-muted-foreground/70 mb-10 max-w-xl mx-auto"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-lg font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-lg font-display font-medium text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-muted-foreground/50" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
