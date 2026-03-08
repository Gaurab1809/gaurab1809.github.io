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
  award: 'border-accent/20',
  hackathon: 'border-primary/20',
  publication: 'border-primary/20',
  competition: 'border-accent/20',
  academic: 'border-primary/20',
  leadership: 'border-accent/20',
  achievement: 'border-primary/20',
  teaching: 'border-accent/20',
  participation: 'border-border',
  membership: 'border-border',
};

const filterTypes = ['All', 'award', 'leadership', 'achievement', 'publication', 'academic', 'teaching', 'membership'];

function AchievementItem({ item, index }: { item: typeof achievements[0]; index: number }) {
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: true, margin: '-30px' });
  const Icon = typeIcon[item.type] || Award;
  const color = typeColor[item.type] || 'text-primary';
  const border = typeBg[item.type] || 'border-primary/20';
  const isLeft = index % 2 === 0;

  return (
    <div ref={itemRef} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 30, x: isLeft ? -20 : 20 }}
        animate={itemInView ? { opacity: 1, y: 0, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative flex items-start ${
          isLeft
            ? 'md:flex-row md:pr-[calc(50%+2rem)] pl-14 md:pl-0'
            : 'md:flex-row-reverse md:pl-[calc(50%+2rem)] pl-14 md:pr-0'
        }`}
      >
        {/* Icon on trunk */}
        <div className="absolute left-[5px] md:left-1/2 top-3 z-10 md:-translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={itemInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.1, ease: 'backOut' }}
            className="w-8 h-8 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-lg"
          >
            <Icon className={color} size={14} />
          </motion.div>
        </div>

        {/* Branch line */}
        <div className={`hidden md:block absolute top-[22px] h-px bg-gradient-to-r from-border to-primary/20 ${
          isLeft ? 'right-1/2 w-5 mr-[18px]' : 'left-1/2 w-5 ml-[18px]'
        }`} />

        {/* Card */}
        <div className={`glass rounded-xl p-5 border ${border} hover:glow-border transition-all duration-300 group flex-1 min-w-0`}>
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
        </div>
      </motion.div>
    </div>
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

        <div className="relative">
          {/* Central trunk */}
          <div className="absolute left-[21px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/20 to-transparent md:-translate-x-px" />

          <div className="space-y-6">
            {displayed.map((item, i) => (
              <AchievementItem key={`${filter}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>

        {filtered.length > 15 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2.5 text-sm font-mono text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all duration-200"
            >
              Show All ({filtered.length})
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
