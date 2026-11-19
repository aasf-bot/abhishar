'use client';

import { useState, useCallback } from 'react';
import BrushSweep from './BrushSweep';
import { heroSlides, siteConfig } from '../content';

export default function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const scrollToTheme = useCallback(() => {
    const el = document.getElementById('theme');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentSlide = heroSlides[currentSlideIndex];

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
    >
      {/* Background with Brush Sweep */}
      <BrushSweep slides={heroSlides} onSlideChange={handleSlideChange} />

      {/* Content overlay */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center px-6 max-w-[95vw]">
        {/* Wordmark */}
        <h1
          className="hero-wordmark text-[12vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw] leading-[0.85] mb-6"
        >
          <span className="block md:inline">ABHISHAR</span>
          <span className="hidden md:inline">&nbsp;</span>
          <span className="block md:inline">V16.0</span>
        </h1>

        {/* Theme title */}
        <p
          className="text-white/90 text-xl md:text-2xl lg:text-3xl font-light tracking-[0.15em] mb-3"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {siteConfig.themeTitle}
        </p>

        {/* Tagline */}
        <p
          className="text-white/60 text-sm md:text-base lg:text-lg font-light tracking-wider"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {siteConfig.tagline}
        </p>
      </div>

      {/* Bottom left: artwork label */}
      <div className="absolute bottom-8 left-6 md:left-12 z-[2] text-white/70 text-xs md:text-sm font-light tracking-wider">
        <p className="mb-1 text-white/50 uppercase text-[10px] tracking-[0.2em]">Now viewing</p>
        <p className="font-medium text-white/80">
          {currentSlide.label}
        </p>
        <p className="text-white/40 text-[11px] mt-0.5">
          {currentSlideIndex + 1} of {heroSlides.length}
        </p>
      </div>

      {/* Bottom centre: bouncing arrow */}
      <button
        onClick={scrollToTheme}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] text-white/60 hover:text-white transition-colors"
        aria-label="Scroll to content"
        style={{ animation: 'bounce-arrow 2s ease-in-out infinite' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 7l5 5 5-5" />
        </svg>
      </button>

      {/* Bottom right: slide counter dots */}
      <div className="absolute bottom-8 right-6 md:right-12 z-[2] flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === currentSlideIndex
                ? 'bg-white w-6'
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
