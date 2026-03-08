import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navItems = [
{ label: 'About', href: '#about' },
{ label: 'Research', href: '#research' },
{ label: 'Projects', href: '#projects' },
{ label: 'Skills', href: '#skills' },
{ label: 'Education', href: '#education' },
{ label: 'Experience', href: '#experience' },
{ label: 'Achievements', href: '#achievements' },
{ label: 'Playground', href: '#playground' },
{ label: 'Contact', href: '#contact' }];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'nav-blur shadow-lg' : 'bg-transparent'}`
      }>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a className="text-xl text-gradient-primary font-extrabold font-sans" href="#">
            A. K. M. Masudur Rahman<span className="text-accent">.</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-xs font-medium transition-colors rounded-lg hover:bg-primary/5 text-muted-foreground">
              
                {item.label}
              </a>
            )}
            <button
              onClick={() => setDark(!dark)}
              className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Toggle theme">
              
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors">
              
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors">
              
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-strong">
          
            <div className="px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) =>
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
              
                  {item.label}
                </a>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

}