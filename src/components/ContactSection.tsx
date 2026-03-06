import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Github, Linkedin, BookOpen, BarChart3, Youtube, Mail, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import profile from '@/data/profile.json';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: 'Message sent!', description: "Thanks for reaching out. I'll get back to you soon." });
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const socials = [
    { icon: Github, href: profile.social.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
    { icon: Youtube, href: profile.social.youtube, label: 'YouTube' },
    { icon: BookOpen, href: profile.social.scholar, label: 'Scholar' },
    { icon: BarChart3, href: profile.social.kaggle, label: 'Kaggle' },
    { icon: ExternalLink, href: profile.social.huggingface, label: 'HuggingFace' },
    { icon: Instagram, href: profile.social.instagram, label: 'Instagram' },
    { icon: MessageCircle, href: profile.social.whatsapp, label: 'WhatsApp' },
    { icon: Mail, href: `mailto:${profile.social.email}`, label: 'Email' },
  ];

  return (
    <section id="contact" className="relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Get in <span className="text-gradient-primary">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-primary/50 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="your@email.com"
                  maxLength={255}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Subject"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                placeholder="Your message..."
                maxLength={1000}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-primary disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <p className="text-muted-foreground mb-2">
              I'm always open to discussing research collaborations, interesting projects, or opportunities. Feel free to reach out!
            </p>
            <p className="text-sm text-primary font-mono mb-2">
              ✉️ {profile.social.email}
            </p>
            <p className="text-xs text-muted-foreground mb-1">📍 {profile.location}</p>
            <p className="text-xs text-accent font-mono mb-6">🟢 {profile.availability}</p>

            <div className="flex flex-wrap gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 glass rounded-lg text-xs text-muted-foreground hover:text-primary hover:glow-border transition-all"
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
