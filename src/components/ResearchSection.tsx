import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FlaskConical, Github, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import research from "@/data/research.json";

const domains = ["All", ...Array.from(new Set(research.map((r) => r.domain)))];

const statusColor: Record<string, string> = {
  Published: "text-accent",
  Completed: "text-accent",
  Ongoing: "text-primary",
  Proposed: "text-muted-foreground",
};

export default function ResearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filtered =
    filter === "All" ? research : research.filter((r) => r.domain === filter);

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
            <span>
              Research{" "}
              <span className="text-gradient-primary">& Publications</span>
            </span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full mb-6" />

          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                  filter === d
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/10"
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
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.08, 0.4),
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="glass rounded-xl overflow-hidden hover:glow-border transition-all duration-300 cursor-pointer flex flex-col group"
              onClick={() => navigate(`/research/${item.id}`)}
            >
              {item.image && (
                <div className="h-36 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 rounded-full truncate">
                    {item.domain}
                  </span>
                  <span
                    className={`text-[10px] font-mono shrink-0 ${statusColor[item.status] || "text-muted-foreground"}`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.abstract}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                  {item.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono text-primary/80 bg-primary/5 border border-primary/10 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      +{item.technologies.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex gap-2">
                    {item.github && (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {item.paperLink && (
                      <a
                        href={item.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors">
                    View Details{" "}
                    <ArrowRight
                      size={10}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
