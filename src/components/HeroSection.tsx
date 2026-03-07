import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail, FlaskConical } from 'lucide-react';
import profile from '@/data/profile.json';
import profilePhoto from '@/assets/profile-photo.jpeg';

const NeuralNetwork3D = lazy(() => import('./NeuralNetwork3D'));

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Suspense fallback={null}>
        <NeuralNetwork3D />
      </Suspense>

      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-50 blur-md group-hover:opacity-80 transition-opacity animate-pulse-glow" />
            <img
              src={profilePhoto}
              alt={profile.name}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-primary/30"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-block font-mono tracking-wider uppercase text-primary border border-primary/30 rounded-full glow-border py-[6px] px-[20px] text-xs sm:text-sm text-center font-medium">
            {profile.availability}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight"
        >
          <span className="text-foreground">Hi 👋, I'm</span>
          <br />
          <span className="text-gradient-primary">{profile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg text-muted-foreground mb-3 font-display font-light"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xs sm:text-sm text-muted-foreground/70 mb-8 max-w-xl mx-auto"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <a
            href="#projects"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary"
          >
            View Projects
          </a>
          <a
            href="#research"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-accent/30 text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
          >
            <FlaskConical size={16} /> Explore Research
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <Mail size={16} /> Contact Me
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-border hover:border-primary/30 transition-all flex items-center gap-2 bg-card/50 text-foreground"
          >
            <Download size={16} /> Resume
          </a>
        </motion.div>
      </div>

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
