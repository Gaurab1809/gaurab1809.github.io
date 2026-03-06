import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FlaskConical, ExternalLink, Github } from 'lucide-react';
import research from '@/data/research.json';

export default function ResearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expanded, setExpanded] = useState<string | null>(null);

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
            Research <span className="text-gradient-primary">& Publications</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {research.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 cursor-pointer"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 rounded-full">
                  {item.domain}
                </span>
                <span className={`text-[10px] font-mono ${item.status === 'Completed' ? 'text-accent' : 'text-primary'}`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-display font-semibold text-foreground text-sm mb-2">{item.title}</h3>
              <p className={`text-xs text-muted-foreground mb-3 ${expanded === item.id ? '' : 'line-clamp-2'}`}>
                {item.abstract}
              </p>

              {expanded === item.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground/70 uppercase mb-1">Dataset</p>
                    <p className="text-xs text-muted-foreground">{item.dataset}</p>
                  </div>
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
                </motion.div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                {item.technologies.map(tech => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] font-mono text-primary/80 bg-primary/5 border border-primary/10 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Github size={14} /> View Repository
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
