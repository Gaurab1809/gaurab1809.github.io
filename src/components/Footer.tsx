import profile from '@/data/profile.json';
import { Github, Linkedin, BookOpen, BarChart3, Youtube, Mail, Instagram, MessageCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  const socials = [
    { icon: Github, href: profile.social.github },
    { icon: Linkedin, href: profile.social.linkedin },
    { icon: Youtube, href: profile.social.youtube },
    { icon: BookOpen, href: profile.social.scholar },
    { icon: BarChart3, href: profile.social.kaggle },
    { icon: ExternalLink, href: profile.social.huggingface },
    { icon: Instagram, href: profile.social.instagram },
    { icon: MessageCircle, href: profile.social.whatsapp },
    { icon: Mail, href: `mailto:${profile.social.email}` },
  ];

  return (
    <footer className="border-t border-border/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} {profile.name}. Built with passion & code.
        </p>
        <div className="flex gap-3">
          {socials.map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-primary transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
