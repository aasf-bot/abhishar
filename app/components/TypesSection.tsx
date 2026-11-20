'use client';

import { useState, useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import TypePanel from './TypePanel';
import { typePanels, otherArtForms } from '../content';

const PANEL_COLORS = ['#5E1F23', '#22403C', '#1C2748', '#7E5A1E'];

export default function TypesSection() {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [chipsRevealed, setChipsRevealed] = useState(false);
  const [brushDrawn, setBrushDrawn] = useState(false);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const brushRef = useRef<SVGPathElement>(null);
  const prefersReduced = useReducedMotion() ?? false;
  const reducedMotion = useRef(prefersReduced);
  useEffect(() => { reducedMotion.current = prefersReduced; }, [prefersReduced]);

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
    <section id="types" className="relative" style={{ background: 'var(--canvas)' }}>
      {/* Stacking panels */}
      <div className="relative">
        {typePanels.map((panel, i) => (
          <TypePanel key={panel.id} {...panel} index={i} total={typePanels.length} />
        ))}
      </div>

      {/* ---- Chip row ---- */}
      <div
        ref={chipRowRef}
        className="surface-canvas relative z-10 section-pad"
        style={{ borderRadius: '28px 28px 0 0', boxShadow: '0 -20px 50px rgba(0,0,0,0.3)', marginTop: -28 }}
      >
        <div className="site-container">
          {/* Heading with brush underline */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--heading-to-chips)' }}>
            <h3
              className="display-md text-[#1C1712]"
              style={{ display: 'inline-block', position: 'relative', fontStyle: 'italic', fontWeight: 500 }}
            >
              More art forms to explore
              {/* Hand-drawn brush underline */}
              <svg
                className="absolute -bottom-3 left-0 w-full h-3 pointer-events-none"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  ref={brushRef}
                  d="M2 8 Q40 2 80 7 Q120 12 160 6 Q200 1 240 7 Q270 11 298 5"
                  fill="none"
                  stroke="#B8893B"
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
              const delay = prefersReduced ? 0 : i * 0.06;

              return (
                <button
                  key={form.label}
                  onClick={() => setActiveChip(isActive ? null : form.label)}
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8893B] cursor-pointer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 22px',
                    borderRadius: '999px',
                    border: isActive ? `1px solid ${hoverColor}` : '1px solid rgba(126,90,30,0.35)',
                    backgroundColor: isActive ? hoverColor : 'rgba(251,247,238,0.7)',
                    boxShadow: isActive ? '0 10px 24px -10px rgba(0,0,0,0.45)' : '0 1px 0 rgba(255,255,255,0.8) inset',
                    color: isActive ? '#FFF8E8' : '#1C1712',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '1rem',
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
                      el.style.backgroundColor = hoverColor + '14';
                      el.style.borderColor = hoverColor;
                      el.style.transform = 'translateY(-3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.backgroundColor = 'rgba(251,247,238,0.7)';
                      el.style.borderColor = 'rgba(126,90,30,0.35)';
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
          <div className="mt-8 flex justify-center" style={{ minHeight: '96px' }}>
            {activeNote && (
              <div
                key={activeChip}
                className="w-full rounded-sm text-center relative"

                style={{
                  maxWidth: '640px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '1.5rem 1.75rem',
                  background: 'var(--paper)',
                  border: '1px solid rgba(184,137,59,0.45)',
                  boxShadow: '0 20px 40px -24px rgba(60,40,10,0.5), inset 0 0 0 5px var(--paper), inset 0 0 0 6px rgba(184,137,59,0.3)',
                  animation: prefersReduced ? 'none' : 'chipNoteIn 0.35s ease-out both',
                }}
              >
                <p className="text-[#1C1712]/80 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>{activeNote}</p>
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
