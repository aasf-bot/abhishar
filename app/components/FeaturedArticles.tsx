'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { featuredArticles, featuredSection } from '../content';
import { SectionHeading } from './Reveal';

type Article = typeof featuredArticles[0];
const ease = [0.65, 0, 0.35, 1] as const;

/** One half of a pleated velvet curtain */
function Curtain({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(${side === 'left' ? '90deg' : '-90deg'}, rgba(0,0,0,0.45), transparent 30%),
          repeating-linear-gradient(90deg, #6E1E22 0px, #8E2A2C 9px, #5A171B 18px, #7A2326 26px)`,
        boxShadow: 'inset 0 -30px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* gold fringe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2.5"
        style={{ background: 'repeating-linear-gradient(90deg, #E6C77F 0 3px, #B8893B 3px 6px)' }}
      />
    </div>
  );
}

function FrameCard({ article, index }: { article: Article; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const handleReveal = () => {
    if (revealed || shaking) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setRevealed(true);
    }, reduce ? 0 : 450);
  };

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 });
  };

  const { frameColor, frameHighlight, accentColor } = article;
  const frameGradient = `linear-gradient(135deg, ${frameColor} 0%, ${frameHighlight} 25%, ${frameColor} 50%, ${frameHighlight} 75%, ${frameColor} 100%)`;

  return (
    <motion.div
      className="flex flex-col items-center"
      style={{ width: '100%' }}
      initial={reduce ? false : { opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Picture light */}
      <div className="relative w-full flex justify-center" aria-hidden="true" style={{ height: 26 }}>
        <div className="w-[46%] h-3 rounded-b-full" style={{ background: 'linear-gradient(#E6C77F, #7E5A1E)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
        <motion.div
          className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: '120%', height: 260, background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(255,226,150,0.55), transparent 70%)', zIndex: 20, mixBlendMode: 'soft-light' }}
          animate={{ opacity: revealed ? 1 : 0.45 }}
          transition={{ duration: 1 }}
        />
      </div>

      <motion.button
        ref={ref}
        onClick={handleReveal}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8893B] group"
        animate={
          shaking
            ? { x: [0, -4, 4, -3, 3, -1, 1, 0], rotate: [0, -0.6, 0.6, -0.3, 0.3, 0] }
            : { rotateX: tilt.x, rotateY: tilt.y }
        }
        transition={shaking ? { duration: 0.45, ease: 'easeInOut' } : { type: 'spring', stiffness: 150, damping: 15 }}
        aria-label={revealed ? `${article.title} by ${article.author}` : `Tap to reveal ${article.title}`}
        style={{
          width: '100%',
          aspectRatio: '3/4',
          transformPerspective: 900,
          padding: 'clamp(12px, 4.5%, 18px)',
          background: frameGradient,
          boxShadow: `inset 0 0 0 1px ${frameHighlight}, inset 0 0 0 5px rgba(0,0,0,0.25), inset 0 0 0 6px ${frameHighlight}88, 0 40px 60px -25px rgba(0,0,0,0.6), 0 18px 30px -18px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Mat + artwork */}
        <div className="relative w-full h-full" style={{ background: 'var(--paper)', padding: 'clamp(8px, 4%, 14px)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.35)' }}>
          <div className="relative w-full h-full overflow-hidden" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}>
            {/* Artwork (sits behind the curtain) */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ scale: revealed ? 1 : 1.15 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                className="object-cover"
                style={{ objectPosition: article.imagePosition }}
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 80vw"
              />
            </motion.div>

            {/* Velvet curtains */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-1/2 origin-top-left z-10"
              initial={false}
              animate={revealed ? { x: '-100%', skewY: -4 } : { x: '0%', skewY: 0 }}
              transition={{ duration: 1.3, ease }}
            >
              <Curtain side="left" />
            </motion.div>
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-1/2 origin-top-right z-10"
              initial={false}
              animate={revealed ? { x: '100%', skewY: 4 } : { x: '0%', skewY: 0 }}
              transition={{ duration: 1.3, ease }}
            >
              <Curtain side="right" />
            </motion.div>

            {/* Tap hint */}
            <AnimatePresence>
              {!revealed && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{ background: 'var(--gold-gradient)', boxShadow: '0 0 0 6px rgba(230,199,127,0.18), 0 10px 25px rgba(0,0,0,0.4)' }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1712" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <span className="text-[#FFF1D6] text-xs uppercase tracking-[0.3em]" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                    Tap to reveal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glass glare */}
            <div
              className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)' }}
            />
          </div>
        </div>
      </motion.button>

      {/* Brass museum plaque */}
      <motion.div
        className="mt-6 w-full rounded-[3px] text-center relative"
        style={{
          padding: '18px 18px',
          minHeight: '116px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid rgba(126,90,30,0.45)',
        }}
        animate={{
          background: revealed
            ? 'linear-gradient(160deg, #1C1712 0%, #2B241C 100%)'
            : 'linear-gradient(160deg, #FBF7EE 0%, #EFE4CB 100%)',
          color: revealed ? '#FFF8E8' : '#1C1712',
        }}
        transition={{ duration: 0.6, delay: revealed ? 0.8 : 0 }}
      >
        {/* screws */}
        {['left-2', 'right-2'].map((p) => (
          <span key={p} className={`absolute ${p} top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full`} style={{ background: 'var(--gold-gradient)' }} aria-hidden="true" />
        ))}
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(19px, 2vw, 22px)',
            fontWeight: 600,
            lineHeight: 1.25,
            marginBottom: '10px',
          }}
        >
          {article.title}
        </p>
        <div style={{ width: '36px', height: '2px', background: revealed ? 'var(--gold-gradient)' : accentColor, marginInline: 'auto', marginBottom: '10px' }} />
        <p style={{ fontSize: '14px', fontStyle: 'italic', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', opacity: 0.8 }}>
          By {article.author}
        </p>
      </motion.div>

      <AnimatePresence>
        {revealed && article.link && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="mt-4"
          >
            <a
              href={article.link}
              className="shimmer inline-flex items-center gap-2 px-6 py-2.5 text-[#1C1712] text-sm font-semibold uppercase tracking-[0.12em] rounded-full"
              style={{ background: 'var(--gold-gradient)' }}
            >
              Read the article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeaturedArticles() {
  return (
    <section
      id="featured"
      className="relative section-pad overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(230,199,127,0.25), transparent 70%), linear-gradient(#EFE4CB, #E6D8BA)',
      }}
    >
      {/* wainscot / dado rail */}
      <div className="absolute left-0 right-0 bottom-0 h-[18%] pointer-events-none" aria-hidden="true" style={{ background: 'linear-gradient(#D9C9A5, #CDBB93)', borderTop: '3px double rgba(126,90,30,0.4)' }} />
      <div className="site-container relative">
        <SectionHeading title={featuredSection.heading} intro={featuredSection.intro} />
        <div className="featured-frames-grid">
          {featuredArticles.map((article, i) => (
            <FrameCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
