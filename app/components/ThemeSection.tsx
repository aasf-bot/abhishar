'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { themeSection } from '../content';
import { SectionHeading } from './Reveal';

/** Soft watercolour wash blob */
function Wash({ color, className, style }: { color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <defs>
        <filter id={`wash-${color.slice(1)}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="28" />
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path
        d="M44 38 C80 4 150 14 170 58 C192 104 168 160 118 176 C66 192 18 160 14 112 C10 78 22 58 44 38 Z"
        fill={color}
        filter={`url(#wash-${color.slice(1)})`}
      />
    </svg>
  );
}

export default function ThemeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const brushRef = useRef<SVGPathElement>(null);
  const hasRevealedRef = useRef(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 140]);
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 10]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealedRef.current) {
          hasRevealedRef.current = true;
          wordsRef.current.forEach((word, i) => {
            if (!word) return;
            if (prefersReducedMotion) {
              word.style.opacity = '1';
              word.style.transform = 'none';
              word.style.filter = 'none';
              return;
            }
            setTimeout(() => {
              word.style.transition =
                'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease';
              word.style.opacity = '1';
              word.style.transform = 'translateY(0)';
              word.style.filter = 'blur(0)';
            }, 300 + i * 28);
          });

          if (brushRef.current && !prefersReducedMotion) {
            const path = brushRef.current;
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            void path.getBoundingClientRect();
            path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.65, 0, 0.35, 1) 0.8s';
            path.style.strokeDashoffset = '0';
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const words = themeSection.pullQuote.split(' ');
  // Highlight the material words in the quote with the painter's palette
  const accents: Record<string, string> = {
    'brushstroke,': 'var(--vermilion)',
    'stitch,': 'var(--verdigris)',
    'chiselled': 'var(--gold-deep)',
    'curve,': 'var(--gold-deep)',
    'tile:': '#1C2748',
    'odyssey': 'var(--oxblood)',
  };

  return (
    <section id="theme" ref={sectionRef} className="relative surface-canvas overflow-hidden section-pad">
      {/* Drifting watercolour washes */}
      <motion.div className="absolute pointer-events-none" style={{ top: '6%', left: '-6%', width: 'clamp(180px, 28vw, 420px)', y: reduce ? 0 : y1, rotate: reduce ? 0 : rot, opacity: 0.35 }}>
        <Wash color="#E6C77F" />
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ bottom: '4%', right: '-5%', width: 'clamp(160px, 24vw, 360px)', y: reduce ? 0 : y2, opacity: 0.22 }}>
        <Wash color="#C2462E" />
      </motion.div>
      <motion.div className="absolute pointer-events-none hidden md:block" style={{ top: '40%', right: '12%', width: 120, y: reduce ? 0 : y1, opacity: 0.18 }}>
        <Wash color="#22403C" />
      </motion.div>

      <div className="site-container relative" style={{ textAlign: 'center' }}>
        <SectionHeading title={themeSection.heading} size="xl" />

        {/* Pull-quote */}
        <div className="relative" style={{ maxWidth: '58rem', marginInline: 'auto', marginBottom: 'var(--theme-heading-gap)' }}>
          <span
            aria-hidden="true"
            className="absolute select-none pointer-events-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(8rem, 18vw, 16rem)',
              lineHeight: 1,
              top: 'clamp(-4.5rem, -6vw, -2.5rem)',
              left: 'clamp(-1rem, -3vw, 0rem)',
              color: 'var(--gold)',
              opacity: 0.18,
            }}
          >
            &ldquo;
          </span>
          <p
            className="relative leading-[1.6] font-light"
            aria-label={themeSection.pullQuote}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.3vw, 1.9rem)', color: 'rgba(28,23,18,0.88)' }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                aria-hidden="true"
                ref={(el) => { wordsRef.current[i] = el; }}
                className="inline-block"
                style={{
                  opacity: 0,
                  transform: 'translateY(14px)',
                  filter: 'blur(6px)',
                  marginRight: '0.28em',
                  color: accents[word],
                  fontStyle: accents[word] ? 'italic' : undefined,
                  fontWeight: accents[word] ? 500 : undefined,
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Painted brushstroke flourish */}
        <svg viewBox="0 0 600 40" className="block mx-auto" style={{ width: 'min(420px, 80%)', height: 28, marginBottom: 'var(--theme-heading-gap)' }} aria-hidden="true">
          <path
            ref={brushRef}
            d="M10 24 C 90 6, 160 34, 250 20 S 420 6, 500 22 S 570 26, 590 16"
            fill="none"
            stroke="var(--vermilion)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>

        <p className="text-sm md:text-base uppercase tracking-[0.25em]" style={{ maxWidth: '42rem', marginInline: 'auto', color: 'rgba(28,23,18,0.55)' }}>
          {themeSection.followUp}
        </p>
        <svg width="18" height="28" viewBox="0 0 18 28" className="mx-auto mt-4" style={{ color: 'var(--gold)', animation: 'float-slow 2.4s ease-in-out infinite' }} aria-hidden="true">
          <path d="M9 2v22M2 17l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
}
