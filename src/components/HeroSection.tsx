import { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Mail, FlaskConical, Activity } from 'lucide-react';
import profile from '@/data/profile.json';

const NeuralNetwork3D = lazy(() => import('./NeuralNetwork3D'));

const typingLines = [
  "Training models…",
  "Optimizing pipelines…",
  "Deploying intelligence…",
  "Analyzing data patterns…",
  "Building neural architectures…",
  "Processing research data…",
];

const statusData = [
  { label: "STATUS", value: "ONLINE", color: "text-accent" },
  { label: "MODEL ACCURACY", value: "96.2%", color: "text-primary" },
  { label: "ACTIVE PROJECTS", value: "12", color: "text-primary" },
  { label: "FOCUS", value: "AI RESEARCH", color: "text-accent" },
];

function TypingEffect() {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = typingLines[lineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text.length < currentLine.length) {
      timeout = setTimeout(() => setText(currentLine.slice(0, text.length + 1)), 60);
    } else if (!isDeleting && text.length === currentLine.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 30);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setLineIndex((prev) => (prev + 1) % typingLines.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, lineIndex]);

  return (
    <span className="font-mono text-primary text-xs sm:text-sm">
      <span className="text-muted-foreground/50">{'> '}</span>
      {text}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

function SystemStatusPanel() {
  const [flickerIdx, setFlickerIdx] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerIdx(Math.floor(Math.random() * statusData.length));
      setTimeout(() => setFlickerIdx(-1), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="glass rounded-lg p-3 sm:p-4 font-mono text-[10px] sm:text-xs space-y-1.5 min-w-[180px] pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 text-primary mb-2">
        <Activity size={12} className="animate-pulse" />
        <span className="uppercase tracking-widest text-[9px] sm:text-[10px] font-semibold">System Monitor</span>
      </div>
      {statusData.map((item, i) => (
        <div
          key={item.label}
          className={`flex justify-between gap-3 transition-opacity duration-150 ${
            flickerIdx === i ? 'opacity-30' : 'opacity-100'
          }`}
        >
          <span className="text-muted-foreground">{item.label}:</span>
          <span className={item.color}>{item.value}</span>
        </div>
      ))}
      <div className="border-t border-border/50 pt-1.5 mt-1.5">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">UPTIME:</span>
          <span className="text-primary">99.97%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralNetwork3D />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/10 via-background/30 to-background pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Primary content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block font-mono tracking-wider uppercase text-primary border border-primary/30 rounded-full glow-border py-[6px] px-[20px] text-xs sm:text-sm font-medium backdrop-blur-sm bg-background/40">
                {profile.availability}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight drop-shadow-lg"
            >
              <span className="text-foreground">Engineering</span>
              <br />
              <span className="text-gradient-primary">Intelligence</span>
              <span className="text-foreground"> Beyond </span>
              <span className="text-gradient-accent">Code</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground mb-2 font-display font-light drop-shadow-md"
            >
              AI/ML Researcher • Full Stack Developer • System Architect
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="text-xs sm:text-sm text-muted-foreground/70 mb-4 max-w-xl mx-auto lg:mx-0 drop-shadow-md"
            >
              Building intelligent systems that learn, adapt, and scale.
            </motion.p>

            {/* Dynamic typing line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mb-6 h-6"
            >
              <TypingEffect />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 pointer-events-auto"
            >
              <a
                href="#projects"
                className="group relative px-6 py-2.5 rounded-lg font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary backdrop-blur-sm overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <span className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg" />
              </a>
              <a
                href="#research"
                className="group relative px-6 py-2.5 rounded-lg font-display font-medium text-sm border border-accent/30 text-accent hover:bg-accent/10 transition-all flex items-center gap-2 backdrop-blur-sm bg-background/30 overflow-hidden"
              >
                <FlaskConical size={16} />
                <span>View Research</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700" />
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

          {/* Right: System Status Panel */}
          <div className="hidden sm:flex flex-col items-end gap-4">
            <SystemStatusPanel />
          </div>
        </div>
      </div>

      {/* Scroll indicator - data stream arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-1"
      >
        <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-primary/40" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
