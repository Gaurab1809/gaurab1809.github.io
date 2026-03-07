import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Trophy, BookOpen, Award, Medal, Users, GraduationCap, Star, Mic, Image as ImageIcon } from 'lucide-react';
import achievements from '@/data/achievements.json';

const typeIcon: Record<string, typeof Trophy> = {
  award: Award,
  hackathon: Trophy,
  publication: BookOpen,
  competition: Medal,
  academic: GraduationCap,
  leadership: Users,
  achievement: Star,
  teaching: BookOpen,
  participation: Mic,
  membership: Users,
};

const typeColor: Record<string, string> = {
  award: 'text-accent',
  hackathon: 'text-primary',
  publication: 'text-primary',
  competition: 'text-accent',
  academic: 'text-primary',
  leadership: 'text-accent',
  achievement: 'text-primary',
  teaching: 'text-accent',
  participation: 'text-muted-foreground',
  membership: 'text-muted-foreground',
};

const filterTypes = ['All', 'award', 'leadership', 'achievement', 'publication', 'academic', 'teaching', 'membership'];

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filtered = filter === 'All' ? achievements : achievements.filter(a => a.type === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 12);

  return (
    <section id="achievements" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Achievements <span className="text-gradient-accent">&</span> Awards
          </h2>
          <div className="w-20 h-1 bg-accent/50 rounded-full mb-8" />

          <div className="flex flex-wrap gap-2">
            {filterTypes.map(type => (
              <button
                key={type}
                onClick={() => { setFilter(type); setShowAll(false); }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all capitalize ${
                  filter === type
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-accent bg-secondary/50 hover:bg-accent/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((item, i) => {
            const Icon = typeIcon[item.type] || Award;
            const color = typeColor[item.type] || 'text-primary';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                className="glass rounded-xl p-5 hover:glow-border transition-all duration-300 group"
              >
                {item.image && (
                  <div className="mb-3 rounded-lg overflow-hidden h-32">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Icon className={color} size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono text-primary">{item.year}</span>
                      <span className="text-[10px] font-mono uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-mono text-muted-foreground/70 mb-1">{item.organization}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length > 12 && !showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 text-sm font-mono text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all"
            >
              Show All ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
