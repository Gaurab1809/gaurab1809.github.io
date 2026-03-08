import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
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

const filterTypes = ['All', 'award', 'leadership', 'achievement', 'publication', 'academic', 'teaching', 'membership'];

function CardContent({ item }: { item: typeof achievements[0] }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] font-mono text-primary">{item.year}</span>
        <span className="text-[10px] font-mono uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {item.type}
        </span>
      </div>
      <h3 className="font-display font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      <p className="text-[10px] font-mono text-muted-foreground/70 mb-2">{item.organization}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
    </>
  );
}

function AchievementCard({ item, index }: { item: typeof achievements[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const Icon = typeIcon[item.type] || Award;
  const color = typeColor[item.type] || 'text-primary';
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-[1fr_40px_1fr] items-start">
        {/* Left card */}
        <div>
          {isLeft && (
            <div
              className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              }}
            >
              <CardContent item={item} />
            </div>
          )}
        </div>

        {/* Center icon only (trunk line is outside) */}
        <div className="flex justify-center relative">
          <div
            className="relative z-10 w-9 h-9 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-md mt-3"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1)' : 'scale(0)',
              transition: 'opacity 0.3s ease-out 0.1s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
            }}
          >
            <Icon className={color} size={14} />
          </div>
        </div>

        {/* Right card */}
        <div>
          {!isLeft && (
            <div
              className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              }}
            >
              <CardContent item={item} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden relative pl-12">
        <div
          className="absolute left-[8px] top-3 z-10 w-[18px] h-[18px] rounded-full bg-card border-2 border-primary/30 flex items-center justify-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'scale(1)' : 'scale(0)',
            transition: 'all 0.3s ease-out',
          }}
        >
          <Icon className={color} size={8} />
        </div>
        <div
          className="glass rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <CardContent item={item} />
        </div>
      </div>
    </div>
  );
}

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => filter === 'All' ? achievements : achievements.filter(a => a.type === filter),
    [filter]
  );
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
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 capitalize ${
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

        {/* Tree container with continuous trunk line */}
        <div className="relative">
          {/* Continuous trunk line - desktop (centered) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-px w-[2px] bg-gradient-to-b from-primary/40 via-accent/20 to-transparent" />
          
          {/* Continuous trunk line - mobile (left side) */}
          <div className="md:hidden absolute top-0 bottom-0 left-[16px] w-[2px] bg-gradient-to-b from-primary/40 via-accent/20 to-transparent" />

          <div className="space-y-5">
            {displayed.map((item, i) => (
              <AchievementCard key={`${filter}-${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>

        {filtered.length > 15 && !showAll && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2.5 text-sm font-mono text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all duration-200"
            >
              Show All ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
