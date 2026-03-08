import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Trophy, BookOpen, Award, Medal, Users, GraduationCap, Star, Mic } from 'lucide-react';
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

const typeBg: Record<string, string> = {
  award: 'bg-accent/10 border-accent/30',
  hackathon: 'bg-primary/10 border-primary/30',
  publication: 'bg-primary/10 border-primary/30',
  competition: 'bg-accent/10 border-accent/30',
  academic: 'bg-primary/10 border-primary/30',
  leadership: 'bg-accent/10 border-accent/30',
  achievement: 'bg-primary/10 border-primary/30',
  teaching: 'bg-accent/10 border-accent/30',
  participation: 'bg-muted/50 border-border',
  membership: 'bg-muted/50 border-border',
};

const typeDot: Record<string, string> = {
  award: 'bg-accent',
  hackathon: 'bg-primary',
  publication: 'bg-primary',
  competition: 'bg-accent',
  academic: 'bg-primary',
  leadership: 'bg-accent',
  achievement: 'bg-primary',
  teaching: 'bg-accent',
  participation: 'bg-muted-foreground',
  membership: 'bg-muted-foreground',
};

const filterTypes = ['All', 'award', 'leadership', 'achievement', 'publication', 'academic', 'teaching', 'membership'];

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filtered = filter === 'All' ? achievements : achievements.filter(a => a.type === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 15);

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

        {/* Tree / Timeline Layout */}
        <div className="relative">
          {/* Central trunk line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent sm:-translate-x-px" />

          <div className="space-y-6">
            {displayed.map((item, i) => {
              const Icon = typeIcon[item.type] || Award;
              const color = typeColor[item.type] || 'text-primary';
              const bg = typeBg[item.type] || 'bg-primary/10 border-primary/30';
              const dot = typeDot[item.type] || 'bg-primary';
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.8) }}
                  className={`relative flex items-start gap-4 ${
                    /* On small screens: always left-aligned. On sm+: alternate */
                    'pl-12 sm:pl-0'
                  } ${isLeft ? 'sm:flex-row sm:pr-[calc(50%+2rem)]' : 'sm:flex-row-reverse sm:pl-[calc(50%+2rem)]'}`}
                >
                  {/* Branch dot on the trunk */}
                  <div className={`absolute left-[13px] sm:left-1/2 top-3 w-3 h-3 rounded-full ${dot} border-2 border-background z-10 sm:-translate-x-1.5`} />

                  {/* Horizontal branch line */}
                  <div className={`hidden sm:block absolute top-[17px] h-px bg-border/50 ${
                    isLeft ? 'right-1/2 w-8 mr-1.5' : 'left-1/2 w-8 ml-1.5'
                  }`} />

                  {/* Card */}
                  <div className={`glass rounded-xl p-5 border ${bg} hover:glow-border transition-all duration-300 group flex-1`}>
                    {item.image && (
                      <div className="mb-3 rounded-lg overflow-hidden h-32">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Icon className={color} size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filtered.length > 15 && !showAll && (
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
