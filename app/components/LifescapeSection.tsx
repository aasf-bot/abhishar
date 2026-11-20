'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { lifescapeCards, lifescapeSection } from '../content';
import { SectionHeading } from './Reveal';

export default function LifescapeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
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
      className="relative overflow-hidden section-pad surface-gallery"
    >
      {/* Heading */}
      <div className="site-container">
        <SectionHeading title={lifescapeSection.heading} intro={lifescapeSection.intro} dark />
      </div>

      {/* Scroll controls */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0E111D]/70 backdrop-blur-md border border-[#E6C77F]/40 flex items-center justify-center text-[#E6C77F] transition-all cursor-pointer ${
            canScrollLeft ? 'opacity-100 hover:bg-[#E6C77F] hover:text-[#1C1712]' : 'opacity-0 pointer-events-none'
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
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0E111D]/70 backdrop-blur-md border border-[#E6C77F]/40 flex items-center justify-center text-[#E6C77F] transition-all cursor-pointer ${
            canScrollRight ? 'opacity-100 hover:bg-[#E6C77F] hover:text-[#1C1712]' : 'opacity-0 pointer-events-none'
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
          className="no-scrollbar flex gap-6 md:gap-8 overflow-x-auto pt-4 pb-8 scroll-smooth snap-x snap-mandatory"
          style={{
            paddingLeft: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            paddingRight: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            scrollPaddingLeft: 'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {lifescapeCards.map((card, i) => (
            <motion.button
              key={card.id}
              data-card
              onClick={() => setLightboxIndex(i)}
              initial={reduce ? false : { opacity: 0, y: 50, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: Math.min(i, 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group snap-start flex-shrink-0 w-[260px] sm:w-[290px] md:w-[320px] text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C77F]"
            >
              {/* Frame */}
              <div
                className="relative transition-all duration-500 ease-out group-hover:-translate-y-2"
                style={{
                  padding: 10,
                  background: 'linear-gradient(145deg, #2A2018, #120D09)',
                  boxShadow: `inset 0 0 0 1px rgba(230,199,127,0.5), 0 30px 50px -20px rgba(0,0,0,0.8)`,
                }}
              >
                <div style={{ background: '#F4ECDB', padding: 8 }}>
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                      sizes="(min-width: 768px) 320px, 290px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-[#1C1712] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ background: 'var(--gold-gradient)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M10 14L21 3M9 21H3v-6" /></svg>
                    </span>
                  </div>
                </div>
                {/* coloured glow on hover */}
                <div className="absolute -inset-1 -z-10 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-500" style={{ background: card.color }} />
              </div>
              {/* Label */}
              <div className="pt-5 pl-1 flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: card.color }} />
                <div className="min-w-0">
                  <p className="text-[#FFF8E8] text-base md:text-lg italic mb-0.5 truncate" style={{ fontFamily: 'var(--font-display)' }}>{card.caption}</p>
                  <p className="text-[#E6C77F]/70 text-xs uppercase tracking-[0.18em]">{card.artist}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        {/* Scroll progress rail */}
        <div className="site-container" aria-hidden="true">
          <div className="relative h-px bg-white/15 mx-auto" style={{ maxWidth: 360 }}>
            <div className="absolute top-[-1px] h-[3px] rounded-full" style={{ width: '30%', left: `${progress * 70}%`, background: 'var(--gold-gradient)', transition: 'left 0.15s linear' }} />
          </div>
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
            className="fixed inset-0 z-[300] bg-[#0A0C14]/95 backdrop-blur-xl flex items-center justify-center"
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
              <div className="gilded-frame w-full md:w-1/2" style={{ maxWidth: 'min(100%, 52vh)' }}>
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-black">
                <Image
                  src={lifescapeCards[lightboxIndex].image}
                  alt={lifescapeCards[lightboxIndex].imageAlt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 50vw, 90vw"
                />
              </div>
              </div>
              {/* Info */}
              <div className="md:w-1/2 text-white">
                <p className="text-[#E6C77F] text-[11px] uppercase tracking-[0.3em] mb-3">Lifescape</p>
                <p className="text-2xl md:text-4xl italic mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {lifescapeCards[lightboxIndex].caption}
                </p>
                <p className="text-white/70 text-sm uppercase tracking-[0.18em] mb-6">{lifescapeCards[lightboxIndex].artist}</p>
                <p className="text-[#E6C77F]/60 text-xs tracking-widest">
                  {lightboxIndex + 1} of {lifescapeCards.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
