'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { featuredArticles, featuredSection } from '../content';

type Article = typeof featuredArticles[0];

function FrameCard({ article }: { article: Article }) {
  const [revealed, setRevealed] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleReveal = () => {
    if (revealed) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setRevealed(true);
    }, 600);
  };

  const { frameColor, frameHighlight, accentColor } = article;

  return (
    <div className="flex flex-col items-center" style={{ width: '100%' }}>
      {/* Frame container */}
      <motion.button
        onClick={handleReveal}
        className="relative cursor-pointer focus:outline-none group"
        animate={shaking ? {
          x: [0, -4, 4, -3, 3, -1, 1, 0],
          rotate: [0, -0.5, 0.5, -0.3, 0.3, 0],
        } : {}}
        transition={shaking ? { duration: 0.6, ease: 'easeInOut' } : {}}
        aria-label={revealed ? `${article.title} by ${article.author}` : `Tap to reveal ${article.title}`}
        style={{ width: '100%', aspectRatio: '3/4' }}
      >
        {/* Spotlight glow */}
        <AnimatePresence>
          {(shaking || revealed) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-4 -top-8 rounded-lg"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, rgba(247,207,69,0.3) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* SVG frame border */}
        <svg
          viewBox="0 0 320 420"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          aria-hidden="true"
        >
          {/* Outer frame */}
          <rect x="4" y="4" width="312" height="412" rx="2" fill="none" stroke={frameColor} strokeWidth="12" />
          {/* Inner bevel */}
          <rect x="16" y="16" width="288" height="388" rx="1" fill="none" stroke={frameHighlight} strokeWidth="3" />
          {/* Corner ornaments */}
          <circle cx="20" cy="20" r="4" fill={frameHighlight} />
          <circle cx="300" cy="20" r="4" fill={frameHighlight} />
          <circle cx="20" cy="400" r="4" fill={frameHighlight} />
          <circle cx="300" cy="400" r="4" fill={frameHighlight} />
          {/* Top center ornament */}
          <path d="M145 10 Q160 2 175 10" fill="none" stroke={frameHighlight} strokeWidth="2" />
          {/* Bottom center ornament */}
          <path d="M145 410 Q160 418 175 410" fill="none" stroke={frameHighlight} strokeWidth="2" />
        </svg>

        {/* Inner area */}
        <div className="absolute inset-[18px] overflow-hidden bg-[#F8F1DC]">
          {/* Dotted outline hint */}
          {!revealed && (
            <div className="absolute inset-4 border-2 border-dashed border-[#17140F]/15 rounded-sm flex items-center justify-center">
              <span className="text-[#17140F]/30 text-sm font-light tracking-wider">
                Tap to reveal
              </span>
            </div>
          )}

          {/* Revealed artwork */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
                className="absolute inset-0"
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
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Museum plaque */}
      <motion.div
        className="mt-4 w-full rounded-sm text-center"
        style={{ padding: '16px 16px', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        animate={{
          backgroundColor: revealed ? '#25356B' : '#17140F10',
          color: revealed ? '#FFFFFF' : '#17140F',
        }}
        transition={{ duration: 0.5, delay: revealed ? 1 : 0 }}
      >
        {/* Title */}
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 2vw, 20px)',
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: '8px',
          }}
        >
          {article.title}
        </p>
        {/* Divider */}
        <div
          style={{
            width: '32px',
            height: '2px',
            backgroundColor: accentColor,
            marginInline: 'auto',
            marginBottom: '8px',
          }}
        />
        {/* Author */}
        <p
          style={{
            fontSize: '15px',
            fontWeight: 300,
            letterSpacing: '0.04em',
            opacity: revealed ? 0.8 : 0.6,
          }}
        >
          By {article.author}
        </p>
      </motion.div>

      {/* Read button (appears after reveal, only if link exists) */}
      <AnimatePresence>
        {revealed && article.link && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="mt-3"
          >
            <a
              href={article.link}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#E2674A] text-white text-sm font-semibold rounded-full hover:bg-[#c9553d] transition-colors"
            >
              Read the article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeaturedArticles() {
  return (
    <section
      id="featured"
      className="bg-[#F8F1DC] section-pad"
    >
      <div className="site-container">
      {/* Intro */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--intro-to-content)' }}>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17140F]"
          style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--heading-to-intro)' }}
        >
          {featuredSection.heading}
        </h2>
        <p
          className="text-base md:text-lg text-[#17140F]/70 leading-relaxed"
          style={{ maxWidth: '42rem', marginInline: 'auto' }}
        >
          {featuredSection.intro}
        </p>
      </div>

      {/* Three frames */}
      <div className="featured-frames-grid">
        {featuredArticles.map((article) => (
          <FrameCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
