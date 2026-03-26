import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Image as ImageIcon } from "lucide-react";
import projects from "@/data/projects.json";

const categories = ["All", "AI", "Web", "Mobile", "Research", "Systems"];

export default function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Featured <span className="text-gradient-primary">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full mb-8" />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-mono rounded-lg transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group glass rounded-xl overflow-hidden hover:glow-border transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-primary/10 via-secondary to-accent/5 flex items-center justify-center relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <ImageIcon className="text-primary/20" size={32} />
                      <span className="font-display font-bold text-lg text-primary/30 text-center px-4 line-clamp-2">
                        {project.title}
                      </span>
                    </div>
                  </>
                )}
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono uppercase bg-accent/20 text-accent border border-accent/30 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-display font-semibold text-base text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono text-primary/80 bg-primary/5 border border-primary/10 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
