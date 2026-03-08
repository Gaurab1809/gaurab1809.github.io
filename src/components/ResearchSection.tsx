import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FlaskConical, Github } from 'lucide-react';
import research from '@/data/research.json';

const domains = ['All', ...Array.from(new Set(research.map(r => r.domain)))];

export default function ResearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? research : research.filter(r => r.domain === filter);

  return (
    <section id="research" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 flex items-center gap-3">
            <FlaskConical className="text-primary" />
            <span>Research <span className="text-gradient-primary">& Publications</span></span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full mb-6" />

          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                  filter === d
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/10'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass rounded-xl overflow-hidden hover:glow-border transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              {item.image && (
                <div className="h-36 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 rounded-full truncate">
                    {item.domain}
                  </span>
                  <span className={`text-[10px] font-mono shrink-0 ${item.status === 'Completed' ? 'text-accent' : 'text-primary'}`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-foreground text-sm mb-2 line-clamp-2">{item.title}</h3>
                <p className={`text-xs text-muted-foreground mb-3 ${expanded === item.id ? '' : 'line-clamp-2'}`}>
                  {item.abstract}
                </p>

                {expanded === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {item.dataset && (
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground/70 uppercase mb-1">Dataset</p>
                        <p className="text-xs text-muted-foreground">{item.dataset}</p>
                      </div>
                    )}
                    {item.interests && (
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground/70 uppercase mb-1">Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {item.interests.map(interest => (
                            <span key={interest} className="px-2 py-0.5 text-[10px] font-mono text-accent/80 bg-accent/5 border border-accent/10 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                  {item.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] font-mono text-primary/80 bg-primary/5 border border-primary/10 rounded">
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      +{item.technologies.length - 4}
                    </span>
                  )}
                </div>

                {item.github && (
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-3"
                    onClick={e => e.stopPropagation()}
                  >
                    <Github size={14} /> View Repository
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
