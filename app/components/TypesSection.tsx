'use client';

import { useState, useRef, useEffect } from 'react';
import TypePanel from './TypePanel';
import { typePanels, otherArtForms } from '../content';

const PANEL_COLORS = ['#F7CF45', '#4FB0BA', '#D9CC9B', '#E2674A'];

export default function TypesSection() {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [chipsRevealed, setChipsRevealed] = useState(false);
  const [brushDrawn, setBrushDrawn] = useState(false);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const brushRef = useRef<SVGPathElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Intersection observer for chips + brush underline
  useEffect(() => {
    const el = chipRowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !chipsRevealed) {
          setChipsRevealed(true);
          // Draw brush underline
          if (brushRef.current && !brushDrawn) {
            const path = brushRef.current;
            const len = path.getTotalLength();
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len}`;
            if (reducedMotion.current) {
              path.style.strokeDashoffset = '0';
            } else {
              requestAnimationFrame(() => {
                path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
                path.style.strokeDashoffset = '0';
              });
            }
            setBrushDrawn(true);
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [chipsRevealed, brushDrawn]);

  const activeNote = otherArtForms.find((f) => f.label === activeChip)?.note;

  return (
    <section id="types" className="relative">
      {/* Stacking panels */}
      <div className="relative">
        {typePanels.map((panel, i) => (
          <TypePanel key={panel.id} {...panel} index={i} total={typePanels.length} />
        ))}
      </div>

      {/* ---- Chip row ---- */}
      <div
        ref={chipRowRef}
        className="bg-[#F8F1DC] relative z-10 section-pad"
      >
        <div className="site-container">
          {/* Heading with brush underline */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--heading-to-chips)' }}>
            <h3
              className="text-xl md:text-2xl font-bold text-[#17140F]"
              style={{ fontFamily: 'var(--font-display)', display: 'inline-block', position: 'relative' }}
            >
              More art forms to explore
              {/* Hand-drawn brush underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 pointer-events-none"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  ref={brushRef}
                  d="M2 8 Q40 2 80 7 Q120 12 160 6 Q200 1 240 7 Q270 11 298 5"
                  fill="none"
                  stroke="#E2674A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </h3>
          </div>

          {/* Chips */}
          <div
            className="flex flex-wrap"
            style={{ justifyContent: 'center', gap: 'var(--chip-gap)', maxWidth: '56rem', marginInline: 'auto' }}
          >
            {otherArtForms.map((form, i) => {
              const isActive = activeChip === form.label;
              const hoverColor = PANEL_COLORS[i % PANEL_COLORS.length];
              // Stagger delay: 60ms per chip, or instant with reduced motion
              const delay = reducedMotion.current ? 0 : i * 0.06;

              return (
                <button
                  key={form.label}
                  onClick={() => setActiveChip(isActive ? null : form.label)}
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25356B] cursor-pointer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    border: isActive ? `1.5px solid ${hoverColor}` : '1.5px solid rgba(23,20,15,0.18)',
                    backgroundColor: isActive ? hoverColor : '#F8F1DC',
                    color: isActive
                      ? (['#F7CF45', '#D9CC9B'].includes(hoverColor) ? '#17140F' : '#FFFFFF')
                      : '#17140F',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    opacity: chipsRevealed ? 1 : 0,
                    transform: chipsRevealed ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: chipsRevealed ? `${delay}s` : '0s',
                    ['--hover-bg' as string]: hoverColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.backgroundColor = hoverColor + '18';
                      el.style.borderColor = hoverColor;
                      el.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.backgroundColor = '#F8F1DC';
                      el.style.borderColor = 'rgba(23,20,15,0.18)';
                      el.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {/* Tick icon for active chip */}
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {form.label}
                </button>
              );
            })}
          </div>

          {/* Note card */}
          <div className="mt-6 flex justify-center" style={{ minHeight: '60px' }}>
            {activeNote && (
              <div
                key={activeChip}
                className="w-full bg-white/60 backdrop-blur-sm rounded-xl border border-[#17140F]/8 text-center"
                style={{
                  maxWidth: '640px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '1.25rem 1.5rem',
                  animation: reducedMotion.current ? 'none' : 'chipNoteIn 0.35s ease-out both',
                }}
              >
                <p className="text-[#17140F]/70 text-sm leading-relaxed">{activeNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyframe for note card */}
      <style jsx>{`
        @keyframes chipNoteIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
