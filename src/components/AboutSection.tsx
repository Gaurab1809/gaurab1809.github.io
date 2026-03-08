import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Lightbulb } from 'lucide-react';
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
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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

            <div className="glass rounded-xl p-6 glow-border mb-6">
              <div className="flex items-start gap-3">
                <Target className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Career Goal</h3>
                  <p className="text-sm text-muted-foreground">{profile.goals}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 glow-border">
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

          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-500 animate-pulse-glow" />
              <img
                src={profilePhoto}
                alt={profile.name}
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl object-cover border-2 border-primary/30 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
