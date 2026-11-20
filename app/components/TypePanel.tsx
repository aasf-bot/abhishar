'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface TypePanelProps {
  id: string;
  title: string;
  description: string;
  materials: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  artwork?: { title: string; artist: string; year: string };
  color: string;
  longDescription: string;
  techniques: string;
  index: number;
  total: number;
}

/** Museum wall colour for each room (the content `color` becomes the accent). */
const WALLS = [
  { bg: '#5E1F23', glow: 'rgba(230,120,90,0.25)' },   // oxblood — painting
  { bg: '#22403C', glow: 'rgba(140,200,180,0.18)' },  // verdigris — sculpture
  { bg: '#1C2748', glow: 'rgba(120,150,230,0.22)' },  // ultramarine — textile
  { bg: '#33251A', glow: 'rgba(230,199,127,0.25)' },  // umber — mosaic
];
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const ease = [0.16, 1, 0.3, 1] as const;

export default function TypePanel({
  id,
  title,
  description,
  materials,
  image,
  imageAlt,
  imagePosition = '50% 35%',
  artwork,
  color,
  longDescription,
  techniques,
  index,
  total,
}: TypePanelProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wall = WALLS[index % WALLS.length];
  const flip = index % 2 === 1;

  const { scrollYProgress } = useScroll({ target: panelRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const numeralY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Sticky offset: short panels pin just under the header; panels taller than
  // the viewport pin by their bottom edge so their full content is seen first.
  const baseTop = 56 + index * 10;
  const [stickyTop, setStickyTop] = useState(baseTop);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const measure = () => setStickyTop(Math.min(baseTop, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [baseTop]);

  // Escape closes the detail view; lock page scroll while it is open
  useEffect(() => {
    if (!detailOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDetailOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [detailOpen]);

  const text = '#FFF8E8';
  const muted = 'rgba(255,248,232,0.72)';

  return (
    <>
      <div
        id={id}
        ref={panelRef}
        aria-label={`${title} (${index + 1} of ${total})`}
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: wall.bg,
          backgroundImage: `radial-gradient(ellipse 60% 70% at ${flip ? '25%' : '75%'} 40%, ${wall.glow}, transparent 70%), radial-gradient(ellipse at 50% 120%, rgba(0,0,0,0.45), transparent 60%)`,
          position: 'sticky',
          top: `${stickyTop}px`,
          zIndex: index + 1,
          boxShadow: '0 -20px 50px rgba(0,0,0,0.35)',
          minHeight: '88vh',
          borderTop: '1px solid rgba(230,199,127,0.35)',
          borderRadius: '28px 28px 0 0',
        }}
      >
        {/* Giant ghost numeral */}
        <motion.span
          aria-hidden="true"
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(10rem, 30vw, 26rem)',
            lineHeight: 0.8,
            top: '4%',
            [flip ? 'right' : 'left']: '-1.5vw',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(230,199,127,0.22)',
            y: reduce ? 0 : numeralY,
          }}
        >
          {NUMERALS[index]}
        </motion.span>

        <div className="site-container relative" style={{ paddingTop: 'clamp(3.5rem, 9vh, 6.5rem)', paddingBottom: 'clamp(3.5rem, 9vh, 6.5rem)' }}>
          <div className={`type-panel-grid ${flip ? 'flip' : ''}`}>
            {/* ---- Text column ---- */}
            <div>
              <motion.div
                className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] mb-5"
                style={{ color: 'var(--gold-light)' }}
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease }}
              >
                <span className="inline-block w-2 h-2 rotate-45" style={{ background: color }} />
                Room {NUMERALS[index]} &middot; {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </motion.div>

              <motion.h3
                className="display-xl mb-6"
                style={{ color: text }}
                initial={reduce ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
              >
                {title.split(' ').map((w, i) => (
                  <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: '0.22em' }}>
                    <motion.span
                      style={{ display: 'inline-block', fontStyle: w === '&' ? 'italic' : undefined, color: w === '&' ? 'var(--gold-light)' : undefined }}
                      variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, delay: 0.1 + i * 0.07, ease } } }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </motion.h3>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.3, ease }}
              >
                <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ color: muted, maxWidth: '34rem', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  {description}
                </p>

                <div className="mb-8" style={{ borderTop: '1px solid rgba(230,199,127,0.3)', paddingTop: 14, maxWidth: '34rem' }}>
                  <p className="text-[11px] uppercase tracking-[0.3em] mb-1.5" style={{ color: 'var(--gold-light)' }}>Materials</p>
                  <p className="text-sm md:text-base tracking-wide" style={{ color: muted }}>
                    {materials}
                  </p>
                </div>

                <button
                  onClick={() => setDetailOpen(true)}
                  className="shimmer group inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold uppercase tracking-[0.14em] cursor-pointer transition-transform hover:-translate-y-0.5"
                  style={{ color: '#1C1712', background: 'var(--gold-gradient)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)' }}
                >
                  Explore the form
                  <span className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1C1712] text-[#E6C77F] transition-transform duration-300 group-hover:rotate-[-45deg]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </motion.div>
            </div>

            {/* ---- Framed artwork ---- */}
            <motion.figure
              className="mx-auto w-full"
              style={{ maxWidth: 'min(440px, 100%)' }}
              initial={reduce ? false : { opacity: 0, y: 60, rotate: flip ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.3, ease }}
            >
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="gilded-frame shimmer group block w-full cursor-pointer text-left transition-transform duration-700 hover:-translate-y-1"
                aria-label={`Open ${title}`}
              >
                <div className="mat">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                    <motion.div className="absolute" style={{ inset: '-10% 0', y: reduce ? 0 : imgY }}>
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                        style={{ objectPosition: imagePosition }}
                        sizes="(min-width: 768px) 440px, 90vw"
                      />
                    </motion.div>
                  </div>
                </div>
              </button>
              {artwork && (
                <figcaption className="mt-5 mx-auto text-center" style={{ maxWidth: 320 }}>
                  <div className="inline-block px-5 py-2.5 rounded-sm" style={{ background: 'rgba(255,248,232,0.06)', border: '1px solid rgba(230,199,127,0.25)' }}>
                    <p className="italic text-sm md:text-base" style={{ fontFamily: 'var(--font-display)', color: text }}>{artwork.title}</p>
                    <p className="text-[11px] tracking-wider mt-0.5" style={{ color: 'rgba(255,248,232,0.55)' }}>
                      {artwork.artist}, {artwork.year}
                    </p>
                  </div>
                </figcaption>
              )}
            </motion.figure>
          </div>
        </div>
      </div>

      {/* ---- Detail overlay ---- */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[200] overflow-y-auto"
            style={{ backgroundColor: wall.bg }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="min-h-screen" style={{ padding: 'clamp(4.5rem, 8vh, 6rem) clamp(1.25rem, 5vw, 5rem) 4rem' }}>
              <button
                onClick={() => setDetailOpen(false)}
                className="fixed top-5 right-5 md:top-6 md:right-6 z-[201] w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:rotate-90 cursor-pointer"
                style={{ background: 'var(--gold-gradient)', color: '#1C1712' }}
                aria-label="Close detail view"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="max-w-4xl mx-auto">
                <motion.p
                  className="text-[11px] uppercase tracking-[0.35em] mb-4"
                  style={{ color: 'var(--gold-light)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Room {NUMERALS[index]}
                </motion.p>
                <motion.h2
                  className="display-xl mb-10"
                  style={{ color: text }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.8, ease }}
                >
                  {title}
                </motion.h2>

                <motion.div
                  className="gilded-frame mb-10"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55, duration: 0.9, ease }}
                >
                  <div className="mat">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                      <Image src={image} alt={imageAlt} fill className="object-cover" style={{ objectPosition: imagePosition }} sizes="(min-width: 900px) 860px, 100vw" />
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
                  <p className="text-lg md:text-2xl leading-relaxed mb-10" style={{ color: muted, fontFamily: 'var(--font-display)' }}>
                    {longDescription}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="pt-5" style={{ borderTop: '1px solid rgba(230,199,127,0.35)' }}>
                      <h4 className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-3" style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-body)' }}>Materials</h4>
                      <p style={{ color: muted }}>{materials}</p>
                    </div>
                    <div className="pt-5" style={{ borderTop: '1px solid rgba(230,199,127,0.35)' }}>
                      <h4 className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-3" style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-body)' }}>Techniques</h4>
                      <p style={{ color: muted }}>{techniques}</p>
                    </div>
                  </div>
                  {artwork && (
                    <p className="mt-10 text-xs tracking-wider" style={{ color: 'rgba(255,248,232,0.45)' }}>
                      Pictured: <em>{artwork.title}</em>, {artwork.artist}, {artwork.year}.
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
