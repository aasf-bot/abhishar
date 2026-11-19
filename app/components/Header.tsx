'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { siteConfig, navLinks, ctaLink } from '../content';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [, setScrollProgress] = useState(0);

  // Scroll listener for sticky header + progress bar
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);

      // Update scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      setScrollProgress(progress);
      document.documentElement.style.setProperty('--scroll-progress', String(progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      setMenuOpen(false);
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" aria-hidden="true" />

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#F8F1DC]/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="site-container flex items-center justify-between h-16 md:h-[72px]">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-3">
            {/* AASF Logo Badge */}
            <a
              href="#"
              className="flex items-center gap-2"
              aria-label="AASF Home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div
                className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border-2 transition-colors duration-300 ${
                  scrolled ? 'border-[#17140F]/20' : 'border-white/30'
                }`}
              >
                <Image
                  src={siteConfig.logoPath}
                  alt="AASF Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </a>

            {/* Hamburger */}
            <button
              className={`flex flex-col gap-[5px] p-2 md:hidden transition-colors ${
                scrolled ? 'text-[#17140F]' : 'text-white'
              } ${menuOpen ? 'hamburger-open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>

          {/* Right: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                    scrolled ? 'text-[#17140F]' : 'text-white'
                  } hover:text-[#E2674A]`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E2674A] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* CTA Button */}
            <button
              onClick={() => handleNavClick(ctaLink.href)}
              className={`ml-4 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-[#E2674A] text-white hover:bg-[#c9553d]'
                  : 'bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              {ctaLink.label}
            </button>
          </nav>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] bg-[#101426]/97 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 text-white p-3"
              aria-label="Close menu"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <nav className="flex flex-col items-center gap-6" aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-3xl font-light tracking-wider transition-colors ${
                      isActive ? 'text-[#F7CF45]' : 'text-white/80 hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {link.label}
                  </motion.button>
                );
              })}

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.5 }}
                onClick={() => handleNavClick(ctaLink.href)}
                className="mt-4 px-8 py-3 bg-[#E2674A] text-white text-lg font-semibold rounded-full hover:bg-[#c9553d] transition-colors"
              >
                {ctaLink.label}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
