import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap } from "lucide-react";
import education from "@/data/education.json";

export default function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 flex items-center gap-3">
            <GraduationCap className="text-primary" />
            <span>Education</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full" />
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-primary font-mono mt-1">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {edu.period}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full">
                  {edu.grade}
                </span>
                <span className="text-xs text-muted-foreground">
                  {edu.details}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
