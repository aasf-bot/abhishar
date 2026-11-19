'use client';

import { useEffect, useRef } from 'react';
import { themeSection } from '../content';

export default function ThemeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const brushRef = useRef<SVGPathElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal words on scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealedRef.current) {
          hasRevealedRef.current = true;
          wordsRef.current.forEach((word, i) => {
            if (!word) return;
            if (prefersReducedMotion) {
              word.style.opacity = '1';
              word.style.transform = 'none';
              return;
            }
            setTimeout(() => {
              word.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              word.style.opacity = '1';
              word.style.transform = 'translateY(0) scale(1)';
            }, i * 30);
          });

          // Animate brush line
          if (brushRef.current && !prefersReducedMotion) {
            const path = brushRef.current;
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            // Force layout reflow so the transition animates reliably
            void path.getBoundingClientRect();
            path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.65, 0, 0.35, 1) 0.5s';
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

  return (
    <section
      id="theme"
      ref={sectionRef}
      className="relative bg-[#F8F1DC] overflow-hidden section-pad"
    >
      <div className="site-container" style={{ textAlign: 'center' }}>
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#17140F]"
          style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--theme-heading-gap)' }}
        >
          {themeSection.heading}
        </h2>

        {/* Pull-quote with word-by-word reveal */}
        <p
          className="text-xl md:text-2xl lg:text-[1.75rem] leading-relaxed text-[#17140F]/85 font-light"
          aria-label={themeSection.pullQuote}
          style={{ maxWidth: '56rem', marginInline: 'auto', marginBottom: 'var(--theme-heading-gap)' }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => { wordsRef.current[i] = el; }}
              className="inline-block"
              style={{
                opacity: 0,
                transform: 'translateY(12px) scale(0.94)',
                marginRight: '0.28em',
              }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Follow-up text */}
        <p
          className="text-base md:text-lg text-[#17140F]/60 font-light"
          style={{ maxWidth: '42rem', marginInline: 'auto' }}
        >
          {themeSection.followUp}
        </p>
      </div>

      {/* Decorative brush line */}
      <svg
        className="absolute bottom-8 left-0 w-full h-12 pointer-events-none"
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={brushRef}
          d="M0 25 Q150 5 300 25 Q450 45 600 25 Q750 5 900 25 Q1050 45 1200 25"
          fill="none"
          stroke="#E2674A"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </section>
  );
}
