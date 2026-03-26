import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Lightbulb,
  Brain,
  Eye,
  Cpu,
  Globe,
  Wifi,
  Sparkles,
} from "lucide-react";

const interests = [
  {
    icon: Brain,
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Developing intelligent systems using supervised, unsupervised, and reinforcement learning techniques. Focused on ensemble models, predictive analytics, and building AI agents that automate complex decision-making tasks across healthcare, education, and public safety domains.",
  },
  {
    icon: Globe,
    title: "Natural Language Processing",
    description:
      "Exploring language understanding through transformer architectures, cross-lingual models, and word embeddings. Research includes building spell-checkers with Word2Vec, pretraining BERT-like models from scratch, offensive text detection in Bangla, and investigating multilingual transfer learning.",
  },
  {
    icon: Eye,
    title: "Computer Vision & Image Processing",
    description:
      "Applying deep learning to visual data for real-world impact — from automatic handwritten exam evaluation using OCR to eye-tracking correlation analysis. Interests span image classification, object detection, semantic segmentation, and building custom datasets for underserved problem domains.",
  },
  {
    icon: Cpu,
    title: "Deep Learning Architectures",
    description:
      "Experimenting with modern neural network architectures including CNNs, RNNs, Transformers, and attention mechanisms. Focus on understanding training dynamics, pretraining strategies, and fine-tuning for domain-specific tasks with limited data.",
  },
  {
    icon: Wifi,
    title: "IoT & Smart Systems",
    description:
      "Designing IoT-based solutions for urban challenges such as smart drainage monitoring for flood prevention. Combining sensor data, embedded systems (Arduino, Raspberry Pi), and automation to build intelligent infrastructure systems.",
  },
  {
    icon: Sparkles,
    title: "AI for Social Good",
    description:
      "Committed to applying AI research toward solving real-world problems in education, transportation, healthcare, and public safety. Focus on building practical, deployable solutions that make a tangible difference in communities, particularly in the context of Bangladesh and developing nations.",
  },
];

export default function ResearchInterestsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="research-interests" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 flex items-center gap-3">
            <Lightbulb className="text-primary" />
            <span>
              Research <span className="text-gradient-primary">Interests</span>
            </span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full mb-6" />
          <p className="text-muted-foreground max-w-3xl text-sm sm:text-base leading-relaxed">
            My research is driven by a passion for building intelligent systems
            that solve real-world problems. I work at the intersection of AI,
            machine learning, NLP, and computer vision — with a strong emphasis
            on practical deployment and social impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.5) }}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <item.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-base mb-3">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
