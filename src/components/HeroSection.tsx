import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  Mail,
  FlaskConical,
  Activity,
} from "lucide-react";
import profile from "@/data/profile.json";

const NeuralNetwork3D = lazy(() => import("./NeuralNetwork3D"));

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
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = typingLines[lineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text.length < currentLine.length) {
      timeout = setTimeout(
        () => setText(currentLine.slice(0, text.length + 1)),
        60,
      );
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
      <span className="text-muted-foreground/50">{"> "}</span>
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
      className="glass rounded-2xl p-3.5 sm:p-4.5 font-mono text-[10px] sm:text-xs space-y-1.5 min-w-[210px] pointer-events-auto border-border/60 bg-card/70"
    >
      <div className="flex items-center gap-1.5 text-primary mb-2">
        <Activity size={12} className="animate-pulse" />
        <span className="uppercase tracking-widest text-[9px] sm:text-[10px] font-semibold">
          System Monitor
        </span>
      </div>
      {statusData.map((item, i) => (
        <div
          key={item.label}
          className={`flex justify-between gap-3 transition-opacity duration-150 ${
            flickerIdx === i ? "opacity-30" : "opacity-100"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
      {/* 3D background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralNetwork3D />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/5 via-background/45 to-background pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 z-[1] pointer-events-none [background:radial-gradient(circle_at_18%_28%,hsl(var(--primary)/0.14),transparent_28%),radial-gradient(circle_at_82%_22%,hsl(var(--accent)/0.12),transparent_24%)]" />

      {/* Main content */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
          {/* Left: Primary content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5"
            >
              <span className="inline-flex items-center gap-2 font-mono tracking-wider uppercase text-primary border border-primary/30 rounded-full py-[7px] px-[18px] text-[11px] sm:text-xs font-medium backdrop-blur-sm bg-card/70 shadow-[0_8px_24px_hsl(var(--background)/0.2)]">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {profile.availability}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 leading-[1.05] drop-shadow-[0_4px_14px_hsl(var(--background)/0.2)]"
            >
              <span className="text-foreground">Engineering</span>
              <br />
              <span className="text-gradient-primary">Intelligence</span>
              <span className="text-foreground"> Beyond </span>
              <span className="text-gradient-accent">Code</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm sm:text-base text-foreground/80 mb-3 font-display font-light"
            >
              AI/ML Researcher • Full Stack Developer • System Architect
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="text-xs sm:text-sm text-muted-foreground mb-5 max-w-xl mx-auto lg:mx-0"
            >
              Building intelligent systems that learn, adapt, and scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mb-6 flex flex-wrap justify-center lg:justify-start gap-2"
            >
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono border border-primary/25 text-primary bg-primary/12 backdrop-blur-sm">
                Deep Learning
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono border border-accent/25 text-accent bg-accent/12 backdrop-blur-sm">
                Cloud & DevOps
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono border border-border/70 text-foreground/75 bg-card/60 backdrop-blur-sm">
                Full-Stack Systems
              </span>
            </motion.div>

            {/* Dynamic typing line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mb-7 h-6"
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
                className="group relative px-6 py-2.5 rounded-xl font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary backdrop-blur-sm overflow-hidden hover:-translate-y-0.5 shadow-[0_10px_24px_hsl(var(--primary)/0.28)]"
              >
                <span className="relative z-10">Explore My Work</span>
                <span className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg" />
              </a>
              <a
                href="#research"
                className="group relative px-6 py-2.5 rounded-xl font-display font-medium text-sm border border-accent/30 text-accent hover:bg-accent/10 transition-all flex items-center gap-2 backdrop-blur-sm bg-card/55 overflow-hidden hover:-translate-y-0.5"
              >
                <FlaskConical size={16} />
                <span>View Research</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </a>
              <a
                href="#contact"
                className="px-6 py-2.5 rounded-xl font-display font-medium text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-2 backdrop-blur-sm bg-card/55 hover:-translate-y-0.5"
              >
                <Mail size={16} /> Contact Me
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl font-display font-medium text-sm border border-border hover:border-primary/30 transition-all flex items-center gap-2 bg-card/65 text-foreground backdrop-blur-sm hover:-translate-y-0.5"
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
        <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">
          Scroll
        </span>
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
