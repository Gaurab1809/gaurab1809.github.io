import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ResearchSection from '@/components/ResearchSection';
import ResearchInterestsSection from '@/components/ResearchInterestsSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
import CoursesSection from '@/components/CoursesSection';
import AchievementsSection from '@/components/AchievementsSection';
import PlaygroundSection from '@/components/PlaygroundSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[28%] -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <div className="section-divider"><AboutSection /></div>
      <div className="section-divider"><ResearchInterestsSection /></div>
      <div className="section-divider"><ResearchSection /></div>
      <div className="section-divider"><ProjectsSection /></div>
      <div className="section-divider"><SkillsSection /></div>
      <div className="section-divider"><EducationSection /></div>
      <div className="section-divider"><ExperienceSection /></div>
      <div className="section-divider"><CoursesSection /></div>
      <div className="section-divider"><AchievementsSection /></div>
      <div className="section-divider"><PlaygroundSection /></div>
      <div className="section-divider"><ContactSection /></div>
      <Footer />
    </div>
  );
};

export default Index;
