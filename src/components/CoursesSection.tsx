import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import courses from '@/data/courses.json';

export default function CoursesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="courses" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Courses & <span className="text-gradient-primary">Learning</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-4 hover:glow-border transition-all duration-300 group"
            >
              <span className="text-[10px] font-mono text-primary/60 uppercase">{course.category}</span>
              <h3 className="font-display font-semibold text-foreground text-sm mt-1 mb-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-[10px] font-mono text-muted-foreground">{course.institution}</p>
              {course.relatedProject && (
                <a
                  href={course.relatedProject}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-primary mt-2 hover:underline"
                >
                  <ExternalLink size={10} /> Related Project
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
