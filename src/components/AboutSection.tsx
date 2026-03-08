import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Target, Lightbulb } from 'lucide-react';
import profile from '@/data/profile.json';
import profilePhoto from '@/assets/profile-photo.jpeg';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            About <span className="text-gradient-primary">Me</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bio with Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Profile Photo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-50 blur-md group-hover:opacity-80 transition-opacity animate-pulse-glow" />
                <img
                  src={profilePhoto}
                  alt={profile.name}
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-primary/30"
                />
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>

            <div className="glass rounded-xl p-6 glow-border">
              <div className="flex items-start gap-3">
                <Target className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Career Goal</h3>
                  <p className="text-sm text-muted-foreground">{profile.goals}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <GraduationCap className="text-primary" size={20} />
              Education
            </h3>
            <div className="space-y-6 relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
              {profile.education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/60 border-2 border-background" />
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-semibold text-foreground text-sm">{edu.degree}</h4>
                      <span className="text-xs font-mono text-primary">{edu.year}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{edu.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 glass rounded-xl p-6 glow-border">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-primary mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Research Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Exploring efficient deep learning architectures, transfer learning for low-resource domains, and interpretable AI systems.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
