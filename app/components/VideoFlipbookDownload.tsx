'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { videoSection, flipbookSection, downloadSection } from '../content';
import Reveal, { SectionHeading } from './Reveal';

export default function VideoFlipbookDownload() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Robust video error detection
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    const handleError = () => setVideoError(true);
    video.addEventListener('error', handleError, true);
    const timer = setTimeout(() => {
      if (video.networkState === 3 || video.error) {
        setVideoError(true);
      }
    }, 3000);
    return () => {
      video.removeEventListener('error', handleError, true);
      clearTimeout(timer);
    };
  }, [videoError]);


  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => {
      setVideoStarted(true);
    }).catch(() => {
      if (video.networkState === 3 || video.error) {
        setVideoError(true);
      } else {
        setVideoStarted(true);
      }
    });
  }, []);

  const isLandscape = videoSection.videoWidth >= videoSection.videoHeight;
  const aspectRatio = `${videoSection.videoWidth} / ${videoSection.videoHeight}`;

  const hasFlipbook = !!flipbookSection.flipbookUrl;

  const cards = [
    {
      ...downloadSection.lowRes,
      available: !!downloadSection.lowRes.url,
    },
    {
      ...downloadSection.highRes,
      available: !!downloadSection.highRes.url,
    },
  ];

  return (
    <section
      id="read"
      ref={sectionRef}
      className="relative overflow-hidden section-pad surface-gallery"
    >
      <div className="site-container">
      {/* ── Video subsection ── */}
      <div style={{ marginBottom: 'var(--subsection-gap)' }}>
        <SectionHeading title={videoSection.heading} intro={videoSection.title} dark />

        <Reveal variant="scale" duration={1.1}>
        <div className="gilded-frame" style={{ maxWidth: isLandscape ? '960px' : '420px', marginInline: 'auto' }}>
        <div
          style={{
            aspectRatio,
          }}
          className="relative overflow-hidden bg-black"
        >
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <svg className="mb-4 text-white/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-white/40 text-sm">The video could not be loaded. Please try again later.</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoSection.videoUrl}
                poster={videoSection.posterImage || undefined}
                controls={videoStarted}
                playsInline
                preload="metadata"
                className="w-full h-full"
                style={{ display: 'block' }}
              />

              {!videoStarted && (
                <div
                  className="group absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 flex items-center justify-center"
                  style={{ transition: 'opacity 0.4s ease', cursor: 'pointer' }}
                  onClick={handlePlay}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlay(); }}
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-[#1C1712] group-hover:scale-110 transition-transform duration-500 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ background: 'var(--gold-gradient)', boxShadow: '0 0 0 10px rgba(230,199,127,0.18), 0 0 0 22px rgba(230,199,127,0.08), 0 20px 40px rgba(0,0,0,0.5)' }}
                    aria-label="Play the Behind the Canvas video"
                    type="button"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        </div>
        </Reveal>
      </div>

      {/* ── Flipbook subsection ── */}
      <div style={{ marginBottom: '80px' }}>
        <SectionHeading as="h3" size="md" title={flipbookSection.heading} intro={flipbookSection.tip} dark />

        {!hasFlipbook || iframeError ? (
          /* Fallback: no URL or explicit error */
          <div
            className="bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center text-center"
            style={{ padding: '48px 24px', marginInline: 'auto', maxWidth: '560px' }}
          >
            <svg className="mb-4 text-white/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
            </svg>
            <p className="text-white/50 text-sm" style={{ marginBottom: '16px' }}>
              {hasFlipbook
                ? 'The flipbook could not be loaded. You can download the magazine instead.'
                : 'The online reader is not available yet. You can download the magazine instead.'}
            </p>
            {downloadSection.highRes.url && (
              <a
                href={downloadSection.highRes.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 bg-[#E2674A] text-white text-sm font-semibold rounded-full hover:bg-[#c9553d] transition-colors"
              >
                Download PDF
              </a>
            )}
          </div>
        ) : (
          /* Iframe wrapper — always mounted, spinner behind */
          <div
            className="relative overflow-hidden"
            style={{
              marginInline: 'auto',
              maxWidth: 1100,
              borderRadius: 6,
              border: '1px solid rgba(230,199,127,0.35)',
              boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8), 0 0 0 8px rgba(255,248,232,0.03)',
            }}
          >
            {/* Loading spinner — sits behind the iframe, hidden once loaded */}
            {!iframeLoaded && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', zIndex: 0 }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: 'rgba(255,255,255,0.4)',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <p className="text-white/30 text-xs">Loading flipbook…</p>
              </div>
            )}

            {/* Responsive aspect ratio: ~16:10 on desktop, ~3:4 on phones */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: 'clamp(62.5%, (768px - 100vw) * 999, 133.33%)' }}>
              <iframe
                src={flipbookSection.flipbookUrl}
                title="Abhishar V16.0 flipbook"
                allowFullScreen
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
                onError={() => setIframeError(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  zIndex: 1,
                  opacity: iframeLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        )}

        {/* Open full screen — always visible */}
        {hasFlipbook && (
          <div className="text-center" style={{ marginTop: '24px' }}>
            <a
              href={flipbookSection.flipbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#E6C77F]/80 text-sm uppercase tracking-[0.18em] hover:text-[#E6C77F] transition-colors border-b border-[#E6C77F]/30 pb-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
              </svg>
              Open full screen
            </a>
          </div>
        )}
      </div>

      {/* ── Download cards ── */}
      <div>
        <SectionHeading as="h3" size="md" title={downloadSection.heading} dark />
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            maxWidth: '680px',
            marginInline: 'auto',
          }}
        >
          {cards.map((dl) => (
            dl.available ? (
              <a
                key={dl.label}
                href={dl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shimmer relative rounded-md text-center transition-all duration-500 group block hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ padding: '36px 28px', textDecoration: 'none', background: 'linear-gradient(160deg, rgba(255,248,232,0.07), rgba(255,248,232,0.02))', border: '1px solid rgba(230,199,127,0.3)', boxShadow: '0 30px 50px -30px rgba(0,0,0,0.8)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[#1C1712] transition-transform duration-500 group-hover:translate-y-1"
                  style={{ marginInline: 'auto', marginBottom: '18px', background: 'var(--gold-gradient)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h4 className="text-[#FFF8E8] text-2xl italic" style={{ marginBottom: '6px' }}>{dl.label}</h4>
                <p className="text-white/60 text-sm" style={{ marginBottom: '10px' }}>{dl.description}</p>
                <p className="inline-block text-[#E6C77F] text-[11px] uppercase tracking-[0.2em] border border-[#E6C77F]/30 rounded-full px-3 py-1">PDF &middot; {dl.fileSize}</p>
              </a>
            ) : (
              <div
                key={dl.label}
                className="bg-white/[0.03] border border-white/5 rounded-lg text-center"
                style={{ padding: '32px', opacity: 0.5 }}
              >
                <div
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30"
                  style={{ marginInline: 'auto', marginBottom: '16px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h4 className="text-white/40 font-semibold text-lg" style={{ marginBottom: '4px' }}>{dl.label}</h4>
                <p className="text-white/30 text-sm" style={{ marginBottom: '4px' }}>{dl.description}</p>
                <p className="text-white/20 text-xs">File not available yet</p>
              </div>
            )
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
