'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import BrushSweep from './BrushSweep';
import { heroSlides, siteConfig } from '../content';

const ease = [0.16, 1, 0.3, 1] as const;

function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.06em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={reduce ? false : { y: '105%', rotate: 8 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 1.1, delay: delay + i * 0.045, ease }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, 160]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const scrollToTheme = useCallback(() => {
    document.getElementById('theme')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentSlide = heroSlides[currentSlideIndex];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-center justify-center bg-[#0E0B08]"
      style={{ height: '100svh', minHeight: 600 }}
    >
      <BrushSweep slides={heroSlides} onSlideChange={handleSlideChange} />

      {/* Content overlay */}
      <motion.div
        className="relative z-[20] flex flex-col items-center justify-center text-center px-6"
        style={{ maxWidth: '95vw', y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
      >
        <motion.div
          className="flex items-center gap-3 md:gap-4 text-[#E6C77F] text-[10px] md:text-xs uppercase tracking-[0.22em] md:tracking-[0.4em] whitespace-nowrap"
          style={{ marginBottom: 'clamp(16px, 3vh, 28px)' }}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          <motion.span
            className="hidden sm:block h-px bg-[#E6C77F]/70"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 'clamp(28px, 6vw, 70px)' }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          />
          {siteConfig.organization} &middot; {siteConfig.institute}
          <motion.span
            className="hidden sm:block h-px bg-[#E6C77F]/70"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 'clamp(28px, 6vw, 70px)' }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          />
        </motion.div>

        <h1
          className="hero-wordmark"
          aria-label={siteConfig.name}
          style={{ fontSize: 'clamp(3.2rem, 11vw, 10rem)', marginBottom: 'clamp(10px, 2vh, 20px)' }}
        >
          <span className="block md:inline"><Letters text="ABHISHAR" delay={0.2} /></span>
          <span className="hidden md:inline">&nbsp;</span>
          <span className="block md:inline italic font-normal text-gilded" style={{ fontSize: '0.62em', verticalAlign: 'baseline' }}>
            <Letters text="V16.0" delay={0.6} />
          </span>
        </h1>

        <motion.p
          className="text-[#FFF8E8] italic"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)', marginBottom: 10 }}
          initial={reduce ? false : { opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay: 1.0, ease }}
        >
          {siteConfig.themeTitle}
        </motion.p>

        <motion.p
          className="text-white/70 text-sm md:text-base lg:text-lg font-light tracking-[0.18em] uppercase"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.3, ease }}
        >
          {siteConfig.tagline}
        </motion.p>
      </motion.div>

      {/* Bottom left: museum label for the artwork on screen */}
      <div className="absolute bottom-6 md:bottom-10 left-5 md:left-12 z-[20] max-w-[52vw] md:max-w-xs">
        <div className="border-l border-[#E6C77F]/60 pl-3 md:pl-4">
          <p className="text-[#E6C77F] uppercase text-[9px] md:text-[10px] tracking-[0.3em] mb-1.5">Now viewing</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
            >
              <p className="italic text-white text-sm md:text-lg leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {currentSlide.label}
              </p>
              <p className="text-white/60 text-[11px] md:text-xs mt-0.5">{currentSlide.artist}</p>
            </motion.div>
          </AnimatePresence>
          <p className="text-white/40 text-[10px] mt-1 tracking-widest">
            {String(currentSlideIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Bottom centre: scroll cue */}
      <button
        onClick={scrollToTheme}
        className="hidden sm:flex absolute bottom-8 left-1/2 z-[20] flex-col items-center gap-2 text-white/70 hover:text-[#E6C77F] transition-colors cursor-pointer"
        aria-label="Scroll to content"
        style={{ animation: 'bounce-arrow 2.4s ease-in-out infinite', transform: 'translateX(-50%)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Enter</span>
        <svg width="22" height="34" viewBox="0 0 22 34" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1" y="1" width="20" height="32" rx="10" />
          <circle cx="11" cy="10" r="2.5" fill="currentColor" />
        </svg>
      </button>

      {/* Bottom right: slide progress */}
      <div className="absolute bottom-7 md:bottom-11 right-5 md:right-12 z-[20] flex items-center gap-1.5" aria-hidden="true">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-700"
            style={{
              width: i === currentSlideIndex ? 28 : 10,
              background: i === currentSlideIndex ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
