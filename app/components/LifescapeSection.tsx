'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { lifescapeCards, lifescapeSection } from '../content';

export default function LifescapeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector('[data-card]')?.clientWidth ?? 320;
    el.scrollBy({ left: dir === 'left' ? -cardW - 24 : cardW + 24, behavior: 'smooth' });
  };

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i !== null ? (i + 1) % lifescapeCards.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i !== null ? (i - 1 + lifescapeCards.length) % lifescapeCards.length : null));
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <section
      id="lifescape"
      className="relative overflow-hidden section-pad"
      style={{
        background: 'linear-gradient(135deg, #101426 0%, #1a1f3a 100%)',
      }}
    >
      {/* Heading */}
      <div className="site-container" style={{ textAlign: 'center', marginBottom: 'var(--intro-to-content)' }}>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--heading-to-intro)' }}
        >
          {lifescapeSection.heading}
        </h2>
        <p
          className="text-base md:text-lg text-white/60 leading-relaxed"
          style={{ maxWidth: '42rem', marginInline: 'auto' }}
        >
          {lifescapeSection.intro}
        </p>
      </div>

      {/* Scroll controls */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all ${
            canScrollLeft ? 'opacity-100 hover:bg-white/20' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all ${
            canScrollRight ? 'opacity-100 hover:bg-white/20' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          style={{
            paddingLeft: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            paddingRight: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            scrollPaddingLeft: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {lifescapeCards.map((card, i) => (
            <button
              key={card.id}
              data-card
              onClick={() => setLightboxIndex(i)}
              className="group flex-shrink-0 w-[280px] md:w-[320px] rounded-lg overflow-hidden bg-white/5 border border-white/8 hover:border-white/20 transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2674A]"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="320px"
                />
                {/* Color accent bar at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: card.color }}
                />
              </div>
              {/* Text */}
              <div className="p-4">
                <p className="text-white text-sm font-semibold mb-1 truncate">{card.caption}</p>
                <p className="text-white/50 text-xs">{card.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] bg-[#101426]/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition z-10"
              aria-label="Close lightbox"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + lifescapeCards.length) % lifescapeCards.length);
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition z-10"
              aria-label="Previous artwork"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % lifescapeCards.length);
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition z-10"
              aria-label="Next artwork"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            {/* Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-6 md:gap-10 max-w-5xl w-full px-12 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full md:w-1/2 aspect-[3/4] max-h-[70vh] rounded-lg overflow-hidden bg-black">
                <Image
                  src={lifescapeCards[lightboxIndex].image}
                  alt={lifescapeCards[lightboxIndex].imageAlt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 50vw, 90vw"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: lifescapeCards[lightboxIndex].color }}
                />
              </div>
              {/* Info */}
              <div className="md:w-1/2 text-white">
                <p className="text-xl md:text-2xl font-bold mb-2">
                  {lifescapeCards[lightboxIndex].caption}
                </p>
                <p className="text-white/60 text-sm mb-4">{lifescapeCards[lightboxIndex].artist}</p>
                <p className="text-white/30 text-xs">
                  {lightboxIndex + 1} of {lifescapeCards.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
