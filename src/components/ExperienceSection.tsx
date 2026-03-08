import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Users } from 'lucide-react';
import experience from '@/data/experience.json';

function ExperienceItem({ item, index }: { item: typeof experience[0]; index: number }) {
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -20 }}
      animate={itemInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative pl-12"
    >
      <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
        <Briefcase size={10} className="text-primary" />
      </div>

      <div className="glass rounded-xl p-5 hover:glow-border transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-foreground text-sm">{item.title}</h3>
            <p className="text-xs text-primary font-mono">{item.organization}</p>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
            {item.period}
          </span>
        </div>

        <ul className="space-y-1 mt-3">
          {item.highlights.map((h, j) => (
            <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-accent mt-0.5 shrink-0">▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 flex items-center gap-3">
            <Users className="text-accent" />
            <span>Experience & <span className="text-gradient-accent">Leadership</span></span>
          </h2>
          <div className="w-20 h-1 bg-accent/50 rounded-full" />
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/20 to-transparent" />

          <div className="space-y-6">
            {experience.map((item, i) => (
              <ExperienceItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
