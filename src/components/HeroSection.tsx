import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail, FlaskConical } from 'lucide-react';
import profile from '@/data/profile.json';

const NeuralNetwork3D = lazy(() => import('./NeuralNetwork3D'));

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D background - behind everything */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralNetwork3D />
        </Suspense>
      </div>

      {/* Gradient overlays to ensure text readability - pointer-events-none so 3D stays interactive */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Text content - above gradients, pointer-events-none so mouse goes through to 3D */}
      <div className="relative z-[2] text-center px-4 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-block font-mono tracking-wider uppercase text-primary border border-primary/30 rounded-full glow-border py-[6px] px-[20px] text-xs sm:text-sm text-center font-medium backdrop-blur-sm bg-background/40">
            {profile.availability}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight drop-shadow-lg"
        >
          <span className="text-foreground">Hi 👋, I'm</span>
          <br />
          <span className="text-gradient-primary">{profile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg text-muted-foreground mb-3 font-display font-light drop-shadow-md"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xs sm:text-sm text-muted-foreground/70 mb-8 max-w-xl mx-auto drop-shadow-md"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-3 pointer-events-auto"
        >
          <a
            href="#projects"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary backdrop-blur-sm"
          >
            View Projects
          </a>
          <a
            href="#research"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-accent/30 text-accent hover:bg-accent/10 transition-all flex items-center gap-2 backdrop-blur-sm bg-background/30"
          >
            <FlaskConical size={16} /> Explore Research
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-2 backdrop-blur-sm bg-background/30"
          >
            <Mail size={16} /> Contact Me
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-border hover:border-primary/30 transition-all flex items-center gap-2 bg-card/50 text-foreground backdrop-blur-sm"
          >
            <Download size={16} /> Resume
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
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
