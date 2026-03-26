import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  FlaskConical,
  Database,
  Users,
  BookOpen,
  FileText,
  Download,
} from "lucide-react";
import research from "@/data/research.json";

type Person = {
  name?: string;
  designation?: string;
  organization?: string;
  institution?: string;
  [key: string]: string | undefined;
};

type PaperLink = {
  label?: string;
  url: string;
};

type ResearchFile = {
  label?: string;
  url: string;
  type?: string;
};

type ResearchItem = {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  technologies: string[];
  dataset?: string;
  status: string;
  github?: string;
  interests?: string[];
  image?: string;
  supervisor?: Person;
  coSupervisor?: Person;
  supervisors?: Person[];
  paperLink?: string;
  paperLinks?: PaperLink[];
  files?: ResearchFile[];
};

const statusStyle: Record<string, string> = {
  Published: "bg-accent/10 text-accent border-accent/20",
  Completed: "bg-accent/10 text-accent border-accent/20",
  Ongoing: "bg-primary/10 text-primary border-primary/20",
  Proposed: "bg-muted text-muted-foreground border-border",
};

export default function ResearchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = (research as ResearchItem[]).find((r) => r.id === id);

  const normalizePerson = (person?: Person) => {
    if (!person || typeof person !== "object")
      return { name: "", designation: "", organization: "" };
    if ("name" in person) {
      return {
        name: person.name || "",
        designation: person.designation || "",
        organization: person.organization || person.institution || "",
      };
    }

    const keys = Object.keys(person).filter(
      (key) => key !== "organization" && key !== "institution",
    );
    const name = keys[0] || "";
    return {
      name,
      designation: name ? person[name] || "" : "",
      organization: person.organization || person.institution || "",
    };
  };

  const supervisor = normalizePerson(item?.supervisor);
  const coSupervisor = normalizePerson(item?.coSupervisor);
  const supervisors = Array.isArray(item?.supervisors)
    ? item.supervisors.map((p) => normalizePerson(p)).filter((p) => p.name)
    : [supervisor, coSupervisor].filter((p) => p.name);

  const paperLinks = Array.isArray(item?.paperLinks)
    ? item.paperLinks.filter((p) => p?.url)
    : item?.paperLink
      ? [{ label: "View Paper", url: item.paperLink }]
      : [];

  const researchFiles = Array.isArray(item?.files)
    ? item.files.filter((f) => f?.url)
    : [];

  useEffect(() => {
    if (!item) {
      document.title = "Research Not Found | Gaurab's Portfolio";
      return;
    }
    document.title = `${item.title} | Research | Gaurab's Portfolio`;
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Research Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline font-mono text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/#research")}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-mono text-muted-foreground truncate">
            {item.domain}
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status & Domain */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 text-xs font-mono border rounded-full ${statusStyle[item.status] || "bg-muted text-muted-foreground border-border"}`}
            >
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
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
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
            {paperLinks.map((paper, idx: number) => (
              <a
                key={`${paper.url}-${idx}`}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-mono bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border border-primary/20"
              >
                <ExternalLink size={16} /> {paper.label || `Paper ${idx + 1}`}
              </a>
            ))}
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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.abstract}
                </p>
              </div>

              {/* Technologies */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FlaskConical size={18} className="text-primary" />{" "}
                  Technologies & Tools
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-mono text-primary bg-primary/5 border border-primary/15 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Interests */}
              {item.interests && item.interests.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                    Research Focus Areas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {item.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 text-xs font-mono text-accent/80 bg-accent/5 border border-accent/15 rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paperLinks.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" /> Paper Links
                  </h2>
                  <div className="space-y-2">
                    {paperLinks.map((paper, idx: number) => (
                      <a
                        key={`${paper.url}-list-${idx}`}
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <span className="text-xs sm:text-sm text-foreground truncate">
                          {paper.label || `Paper ${idx + 1}`}
                        </span>
                        <ExternalLink
                          size={14}
                          className="text-primary shrink-0"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {researchFiles.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-primary" /> Research
                    Files
                  </h2>
                  <div className="space-y-2">
                    {researchFiles.map((file, idx: number) => (
                      <a
                        key={`${file.url}-${idx}`}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-foreground truncate">
                            {file.label || `File ${idx + 1}`}
                          </p>
                          {file.type && (
                            <p className="text-[11px] text-muted-foreground">
                              {file.type}
                            </p>
                          )}
                        </div>
                        <Download size={14} className="text-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Dataset */}
              {item.dataset && item.dataset !== "N/A" && (
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Database size={16} className="text-primary" /> Dataset
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.dataset}
                  </p>
                </div>
              )}

              {/* Supervisors */}
              {supervisors.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users size={16} className="text-primary" /> Supervision
                  </h3>
                  <div className="space-y-4">
                    {supervisors.map((person, idx: number) => (
                      <div key={`${person.name}-${idx}`}>
                        <p className="text-[11px] font-mono text-primary mb-1">
                          {idx === 0 ? "Supervisor" : `Co-Supervisor ${idx}`}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {person.name}
                        </p>
                        {person.designation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {person.designation}
                          </p>
                        )}
                        {person.organization && (
                          <p className="text-xs text-muted-foreground">
                            {person.organization}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-3">
                  Quick Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">
                      Status
                    </span>
                    <span
                      className={`font-mono ${statusStyle[item.status]?.includes("text-accent") ? "text-accent" : "text-primary"}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">
                      Domain
                    </span>
                    <span className="text-foreground font-mono text-right max-w-[60%]">
                      {item.domain}
                    </span>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">
                      Technologies
                    </span>
                    <span className="text-foreground font-mono">
                      {item.technologies.length}
                    </span>
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
