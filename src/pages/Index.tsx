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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ResearchSection />
      <ResearchInterestsSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <ExperienceSection />
      <CoursesSection />
      <AchievementsSection />
      <PlaygroundSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
