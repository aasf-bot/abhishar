'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { siteConfig, navLinks, ctaLink } from '../content';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // One rAF-throttled scroll handler: sticky header, progress bar, active section.
  // (Previously an IntersectionObserver set the active link but never cleared it,
  // so "About" stayed highlighted after scrolling back up.)
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace('#', ''));
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 80);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));

      const probe = window.innerHeight * 0.4;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) current = id;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
            ? 'bg-[#F4ECDB]/90 backdrop-blur-md shadow-[0_1px_0_rgba(184,137,59,0.35),0_10px_30px_-15px_rgba(0,0,0,0.25)]'
            : 'bg-gradient-to-b from-black/40 to-transparent'
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
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 hover:rotate-[360deg]"
                style={{ padding: 2, background: 'var(--gold-gradient)' }}
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
              <span
                className="hidden sm:inline text-lg tracking-wide transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: scrolled ? 'var(--color-ink)' : '#FFF8E8' }}
              >
                {siteConfig.name}
              </span>
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
                  className={`relative px-3 py-2 text-[13px] uppercase font-medium tracking-[0.14em] transition-colors duration-300 cursor-pointer ${
                    scrolled ? 'text-[#1C1712]' : 'text-white/90'
                  } ${scrolled ? 'hover:text-[#5E1F23]' : 'hover:text-[#E6C77F]'}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: 'var(--gold-gradient)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* CTA Button */}
            <button
              onClick={() => handleNavClick(ctaLink.href)}
              className={`shimmer ml-3 px-6 py-2.5 text-[13px] uppercase tracking-[0.12em] font-semibold rounded-full transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
                scrolled
                  ? 'text-[#1C1712] shadow-[0_6px_20px_-8px_rgba(126,90,30,0.8)]'
                  : 'text-[#1C1712]'
              }`}
              style={{ background: 'var(--gold-gradient)' }}
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
            className="fixed inset-0 z-[99] surface-gallery flex flex-col items-center justify-center"
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
                    className={`text-4xl italic transition-colors ${
                      isActive ? 'text-[#E6C77F]' : 'text-white/85 hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
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
                className="mt-6 px-9 py-3.5 text-[#1C1712] text-base uppercase tracking-[0.12em] font-semibold rounded-full"
                style={{ background: 'var(--gold-gradient)' }}
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
