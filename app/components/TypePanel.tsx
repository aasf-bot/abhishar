'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TypePanelProps {
  id: string;
  title: string;
  description: string;
  materials: string;
  image: string;
  imageAlt: string;
  color: string;
  longDescription: string;
  techniques: string;
  index: number;
  total: number;
}

export default function TypePanel({
  id,
  title,
  description,
  materials,
  image,
  imageAlt,
  color,
  longDescription,
  techniques,
  index,
  total,
}: TypePanelProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [imageRevealed, setImageRevealed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !imageRevealed) setImageRevealed(true);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [imageRevealed]);

  // Contrast colours
  const isLight = ['#F7CF45', '#D9CC9B'].includes(color);
  const text = isLight ? '#17140F' : '#FFFFFF';
  const muted = isLight ? 'rgba(23,20,15,0.65)' : 'rgba(255,255,255,0.7)';
  const link = isLight ? '#25356B' : '#F7CF45';

  return (
    <>
      {/* ---- Panel ---- */}
      <div
        id={id}
        ref={panelRef}
        aria-label={`${title} (${index + 1} of ${total})`}
        className="relative w-full"
        style={{
          backgroundColor: color,
          position: 'sticky',
          top: `${60 + index * 8}px`,
          zIndex: index + 1,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
          minHeight: '85vh',
        }}
      >
        {/* Inner padding — identical for every panel */}
        <div
          className="site-container"
          style={{ paddingTop: 'clamp(3rem, 6vh, 5rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}
        >
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* ---- Text column ---- */}
          <div className="flex-1 flex flex-col justify-start md:order-1 order-2 max-w-xl">
            <h3
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: text }}
            >
              {title}
            </h3>

            {/* Mobile image — fixed container, same for every panel */}
            <div className="block md:hidden mb-6">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '4 / 3',
                  clipPath: imageRevealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 35%' }}
                  sizes="100vw"
                />
              </div>
            </div>

            <p className="text-base md:text-lg mb-4 leading-relaxed" style={{ color: muted }}>
              {description}
            </p>

            <p className="text-sm mb-6 uppercase tracking-widest font-medium" style={{ color: muted }}>
              Materials: {materials}
            </p>

            <button
              onClick={() => setDetailOpen(true)}
              className="inline-flex items-center gap-2 text-base font-semibold group transition-colors cursor-pointer"
              style={{ color: link }}
            >
              Explore the form
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ---- Desktop image — fixed container, identical for every panel ---- */}
          <div className="hidden md:flex flex-1 md:order-2 items-start justify-end">
            <div
              className="relative overflow-hidden group cursor-pointer"
              onClick={() => setDetailOpen(true)}
              style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '3 / 4',
                clipPath: imageRevealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transition: 'clip-path 1s cubic-bezier(0.65, 0, 0.35, 1)',
                marginTop: '2rem',
              }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: '50% 35%' }}
                sizes="(min-width: 768px) 400px, 100vw"
              />
            </div>
          </div>
          </div>
        </div>
        </div>

      {/* ---- Detail overlay ---- */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] overflow-y-auto"
            style={{ backgroundColor: color }}
          >
            <div className="min-h-screen" style={{ padding: 'clamp(2rem, 5vh, 4rem) clamp(1.5rem, 5vw, 5rem)' }}>
              <button
                onClick={() => setDetailOpen(false)}
                className="fixed top-6 right-6 z-[201] w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{ backgroundColor: `${text}20`, color: text }}
                aria-label="Close detail view"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-4xl md:text-6xl font-bold mb-8"
                  style={{ fontFamily: 'var(--font-display)', color: text }}
                >
                  {title}
                </h2>

                <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden">
                  <Image src={image} alt={imageAlt} fill className="object-cover" sizes="100vw" />
                </div>

                <p className="text-lg md:text-xl leading-relaxed mb-6" style={{ color: muted }}>
                  {longDescription}
                </p>

                <div className="border-t pt-6 mb-6" style={{ borderColor: `${text}20` }}>
                  <h4 className="text-sm uppercase tracking-widest font-semibold mb-2" style={{ color: text }}>Materials</h4>
                  <p style={{ color: muted }}>{materials}</p>
                </div>

                <div className="border-t pt-6" style={{ borderColor: `${text}20` }}>
                  <h4 className="text-sm uppercase tracking-widest font-semibold mb-2" style={{ color: text }}>Techniques</h4>
                  <p style={{ color: muted }}>{techniques}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
