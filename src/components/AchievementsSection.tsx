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

const filterTypes = ['All', 'award', 'leadership', 'achievement', 'publication', 'academic', 'teaching', 'membership'];

// Individual item wrapper with its own inView for seamless scroll reveal
function AchievementItem({ item, index }: { item: typeof achievements[0]; index: number }) {
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: true, margin: '-50px' });
  const Icon = typeIcon[item.type] || Award;
  const color = typeColor[item.type] || 'text-primary';
  const bg = typeBg[item.type] || 'bg-primary/10 border-primary/30';
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      animate={itemInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative flex items-start gap-4 pl-14 sm:pl-0 ${
        isLeft ? 'sm:flex-row sm:pr-[calc(50%+2.5rem)]' : 'sm:flex-row-reverse sm:pl-[calc(50%+2.5rem)]'
      }`}
    >
      {/* Icon node on trunk */}
      <div className="absolute left-[5px] sm:left-1/2 top-2 z-10 sm:-translate-x-1/2">
        <div className={`w-8 h-8 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center shadow-md`}>
          <Icon className={color} size={14} />
        </div>
      </div>

      {/* Horizontal branch line */}
      <div className={`hidden sm:block absolute top-[18px] h-px bg-border ${
        isLeft ? 'right-1/2 w-6 mr-4' : 'left-1/2 w-6 ml-4'
      }`} />

      {/* Card */}
      <div className={`glass rounded-xl p-5 border ${bg} hover:glow-border transition-all duration-300 group flex-1`}>
        {item.image && (
          <div className="mb-3 rounded-lg overflow-hidden h-32">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-start gap-3">
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
}

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
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
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
          <div className="absolute left-[21px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent sm:-translate-x-px" />

          <div className="space-y-8">
            {displayed.map((item, i) => (
              <AchievementItem key={`${filter}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>

        {filtered.length > 15 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2.5 text-sm font-mono text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all hover:shadow-lg"
            >
              Show All ({filtered.length})
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
