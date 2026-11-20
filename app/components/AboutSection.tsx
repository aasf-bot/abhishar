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
      className="relative overflow-hidden surface-canvas section-pad"
    >
      <div className="site-container">
      <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">
        {/* Cover image */}
        <div
          className="flex-shrink-0 w-full md:w-2/5 mx-auto md:mx-0"
          style={{
            maxWidth: '460px',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'perspective(1200px) rotateY(8deg) rotateZ(-1.5deg)' : 'perspective(1200px) rotateY(30deg) translateY(40px)',
            transition: 'opacity 1.2s ease, transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="gilded-frame shimmer transition-transform duration-700 hover:[transform:rotateY(-8deg)_rotateZ(1.5deg)]">
            <Image
              src={aboutSection.coverImage}
              alt={aboutSection.coverAlt}
              width={aboutSection.coverWidth}
              height={aboutSection.coverHeight}
              className="block"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              sizes="(min-width: 768px) 40vw, 80vw"
            />
          </div>
          <p className="text-center text-sm mt-5 italic" style={{ color: 'rgba(28,23,18,0.6)', fontFamily: 'var(--font-display)' }}>
            {aboutSection.coverCaption}
          </p>
        </div>

        {/* Text */}
        <div
          className="flex-1"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease 0.3s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] mb-4" style={{ color: 'var(--gold-deep)' }} aria-hidden="true">✦</p>
          <h2
            className="display-xl text-[#1C1712] mb-6 italic"
            style={{ fontWeight: 500 }}
          >
            {aboutSection.heading}
          </h2>

          <div className="w-20 h-[3px] mb-8 rounded-full" style={{ background: 'var(--gold-gradient)', transform: revealed ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s' }} />

          <p className="text-base md:text-xl text-[#1C1712]/80 leading-relaxed first-letter:float-left first-letter:text-7xl first-letter:leading-[0.85] first-letter:mr-3 first-letter:mt-1 first-letter:text-[#5E1F23] first-letter:[font-family:var(--font-display)]" style={{ fontFamily: 'var(--font-display)' }}>
            {aboutSection.text}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs md:text-sm text-[#7E5A1E] uppercase tracking-[0.25em] font-medium">
              ABV-IIITM Gwalior
            </span>
            <span className="text-[#B8893B]">✦</span>
            <span className="text-xs md:text-sm text-[#7E5A1E] uppercase tracking-[0.25em] font-medium">
              AASF
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
