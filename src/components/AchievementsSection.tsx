import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, BookOpen, Award, Medal } from 'lucide-react';
import achievements from '@/data/achievements.json';

const typeIcon: Record<string, typeof Trophy> = {
  award: Award,
  hackathon: Trophy,
  publication: BookOpen,
  competition: Medal,
  academic: BookOpen,
};

const typeColor: Record<string, string> = {
  award: 'text-accent',
  hackathon: 'text-primary',
  publication: 'text-primary',
  competition: 'text-accent',
  academic: 'text-primary',
};

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="achievements" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Achievements <span className="text-gradient-accent">&</span> Publications
          </h2>
          <div className="w-20 h-1 bg-accent/50 rounded-full" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/20 to-transparent" />

          <div className="space-y-8">
            {achievements.map((item, i) => {
              const Icon = typeIcon[item.type] || Award;
              const color = typeColor[item.type] || 'text-primary';
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center">
                      <Icon className={color} size={14} />
                    </div>
                  </div>

                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <div className="glass rounded-xl p-5 hover:glow-border transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-primary">{item.year}</span>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
