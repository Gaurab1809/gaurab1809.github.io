import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Send,
  Github,
  Linkedin,
  BookOpen,
  BarChart3,
  Youtube,
  Mail,
  Instagram,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";
import profile from "@/data/profile.json";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsAutoReplyTemplateId = import.meta.env
    .VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const ownerEmail =
    import.meta.env.VITE_CONTACT_RECEIVER_EMAIL ||
    "akmmasudurrahmangaurab@gmail.com";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const openMailtoFallback = (
    name: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:${ownerEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    if (
      !emailJsServiceId ||
      !emailJsTemplateId ||
      !emailJsAutoReplyTemplateId ||
      !emailJsPublicKey
    ) {
      toast({
        title: "Email service not configured",
        description:
          "Opening your email app so you can still send the message directly.",
        variant: "destructive",
      });
      openMailtoFallback(
        form.name.trim(),
        form.email.trim(),
        form.subject.trim() || "Portfolio Contact Form Message",
        form.message.trim(),
      );
      return;
    }

    setSending(true);
    try {
      const subject = form.subject.trim() || "Portfolio Contact Form Message";

      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          to_email: ownerEmail,
          to_name: "A. K. M. Masudur Rahman",
          from_name: form.name.trim(),
          name: form.name.trim(),
          from_email: form.email.trim(),
          email: form.email.trim(),
          subject,
          message: form.message.trim(),
          user_message: form.message.trim(),
          reply_to: form.email.trim(),
        },
        { publicKey: emailJsPublicKey },
      );

      // Auto-reply failure should not block the main contact message.
      try {
        await emailjs.send(
          emailJsServiceId,
          emailJsAutoReplyTemplateId,
          {
            to_email: form.email.trim(),
            to_name: form.name.trim(),
            from_name: "A. K. M. Masudur Rahman",
            subject,
            original_message: form.message.trim(),
          },
          { publicKey: emailJsPublicKey },
        );
      } catch {
        // no-op: owner message is already sent
      }

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Message failed",
        description:
          "Unable to send right now. Opening your email app as a fallback.",
        variant: "destructive",
      });
      openMailtoFallback(
        form.name.trim(),
        form.email.trim(),
        form.subject.trim() || "Portfolio Contact Form Message",
        form.message.trim(),
      );
    } finally {
      setSending(false);
    }
  };

  const socials = [
    { icon: Github, href: profile.social.github, label: "GitHub" },
    { icon: Linkedin, href: profile.social.linkedin, label: "LinkedIn" },
    { icon: Youtube, href: profile.social.youtube, label: "YouTube" },
    { icon: BookOpen, href: profile.social.scholar, label: "Scholar" },
    { icon: BarChart3, href: profile.social.kaggle, label: "Kaggle" },
    {
      icon: ExternalLink,
      href: profile.social.huggingface,
      label: "HuggingFace",
    },
    { icon: Instagram, href: profile.social.instagram, label: "Instagram" },
    { icon: MessageCircle, href: profile.social.whatsapp, label: "WhatsApp" },
    { icon: Mail, href: `mailto:${profile.social.email}`, label: "Email" },
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

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="your@email.com"
                  maxLength={255}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Subject"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1.5">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
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
              {sending ? "Sending..." : "Send Message"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <p className="text-muted-foreground mb-2">
              I'm always open to discussing research collaborations, interesting
              projects, or opportunities. Feel free to reach out!
            </p>
            <p className="text-sm text-primary font-mono mb-2"></p>
            <p className="text-xs text-muted-foreground mb-1">
              📍 {profile.location}
            </p>
            <p className="text-xs text-accent font-mono mb-6">
              🟢 {profile.availability}
            </p>

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
