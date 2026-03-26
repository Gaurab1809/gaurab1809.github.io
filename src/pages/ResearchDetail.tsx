import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, FlaskConical, Database, Users, BookOpen } from 'lucide-react';
import research from '@/data/research.json';

const statusStyle: Record<string, string> = {
  Published: 'bg-accent/10 text-accent border-accent/20',
  Completed: 'bg-accent/10 text-accent border-accent/20',
  Ongoing: 'bg-primary/10 text-primary border-primary/20',
  Proposed: 'bg-muted text-muted-foreground border-border',
};

export default function ResearchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = research.find(r => r.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Research Not Found</h1>
          <button onClick={() => navigate('/')} className="text-primary hover:underline font-mono text-sm">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const hasSupervisor = item.supervisor?.name;
  const hasCoSupervisor = item.coSupervisor?.name;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/#research')}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-mono text-muted-foreground truncate">{item.domain}</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Status & Domain */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1 text-xs font-mono border rounded-full ${statusStyle[item.status] || 'bg-muted text-muted-foreground border-border'}`}>
              {item.status}
            </span>
            <span className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary border border-primary/20 rounded-full">
              {item.domain}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            {item.title}
          </h1>

          {/* Image */}
          {item.image && (
            <div className="rounded-xl overflow-hidden mb-8 border border-border/50">
              <img src={item.image} alt={item.title} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            {item.github && (
              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-mono bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors border border-border/50"
              >
                <Github size={16} /> GitHub Repository
              </a>
            )}
            {item.paperLink && (
              <a
                href={item.paperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-mono bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border border-primary/20"
              >
                <ExternalLink size={16} /> View Paper
              </a>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Abstract */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" /> Abstract
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.abstract}</p>
              </div>

              {/* Technologies */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FlaskConical size={18} className="text-primary" /> Technologies & Tools
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1.5 text-xs font-mono text-primary bg-primary/5 border border-primary/15 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Interests */}
              {item.interests && item.interests.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-4">Research Focus Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.interests.map(interest => (
                      <span key={interest} className="px-3 py-1.5 text-xs font-mono text-accent/80 bg-accent/5 border border-accent/15 rounded-lg">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Dataset */}
              {item.dataset && item.dataset !== 'N/A' && (
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Database size={16} className="text-primary" /> Dataset
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.dataset}</p>
                </div>
              )}

              {/* Supervisor */}
              {hasSupervisor && (
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users size={16} className="text-primary" /> Supervisor
                  </h3>
                  <p className="text-sm font-medium text-foreground">{item.supervisor.name}</p>
                  {item.supervisor.designation && (
                    <p className="text-xs text-muted-foreground mt-1">{item.supervisor.designation}</p>
                  )}
                  {item.supervisor.organization && (
                    <p className="text-xs text-muted-foreground">{item.supervisor.organization}</p>
                  )}
                </div>
              )}

              {/* Co-Supervisor */}
              {hasCoSupervisor && (
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users size={16} className="text-accent" /> Co-Supervisor
                  </h3>
                  <p className="text-sm font-medium text-foreground">{item.coSupervisor.name}</p>
                  {item.coSupervisor.designation && (
                    <p className="text-xs text-muted-foreground mt-1">{item.coSupervisor.designation}</p>
                  )}
                  {item.coSupervisor.organization && (
                    <p className="text-xs text-muted-foreground">{item.coSupervisor.organization}</p>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-3">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">Status</span>
                    <span className={`font-mono ${statusStyle[item.status]?.includes('text-accent') ? 'text-accent' : 'text-primary'}`}>{item.status}</span>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">Domain</span>
                    <span className="text-foreground font-mono text-right max-w-[60%]">{item.domain}</span>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">Technologies</span>
                    <span className="text-foreground font-mono">{item.technologies.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
