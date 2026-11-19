'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { aboutSection } from '../content';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8F1DC] section-pad"
    >
      <div className="site-container">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Cover image */}
        <div
          className="flex-shrink-0 w-full md:w-2/5 mx-auto md:mx-0"
          style={{
            maxWidth: '460px',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="relative rounded-sm overflow-hidden shadow-xl">
            <Image
              src={aboutSection.coverImage}
              alt={aboutSection.coverAlt}
              width={aboutSection.coverWidth}
              height={aboutSection.coverHeight}
              className="rounded-sm"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              sizes="(min-width: 768px) 40vw, 80vw"
            />
            <div className="absolute inset-0 border-4 border-[#25356B]/20 pointer-events-none" />
          </div>
          <p className="text-center text-xs mt-2 italic" style={{ color: 'rgba(23,20,15,0.5)' }}>
            {aboutSection.coverCaption}
          </p>
        </div>

        {/* Text */}
        <div
          className="flex-1"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17140F] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {aboutSection.heading}
          </h2>

          <div className="w-16 h-1 bg-[#E2674A] mb-6 rounded-full" />

          <p className="text-base md:text-lg text-[#17140F]/75 leading-relaxed">
            {aboutSection.text}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-[#17140F]/40 uppercase tracking-widest font-medium">
              ABV-IIITM Gwalior
            </span>
            <span className="text-[#17140F]/20">•</span>
            <span className="text-sm text-[#17140F]/40 uppercase tracking-widest font-medium">
              AASF
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
