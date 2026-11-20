'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

type Variant = 'up' | 'fade' | 'left' | 'right' | 'scale' | 'unveil';

const offsets: Record<Variant, Record<string, number | string>> = {
  up: { y: 40, opacity: 0 },
  fade: { opacity: 0 },
  left: { x: -60, opacity: 0 },
  right: { x: 60, opacity: 0 },
  scale: { scale: 0.92, opacity: 0 },
  unveil: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
};

const targets: Record<Variant, Record<string, number | string>> = {
  up: { y: 0, opacity: 1 },
  fade: { opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  scale: { scale: 1, opacity: 1 },
  unveil: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 },
};

/** Fades/slides its children in once when they scroll into view. */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.9,
  className,
  style,
  amount = 0.25,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial={offsets[variant]}
      whileInView={targets[variant]}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section heading: gold ornament, words rising out of a mask, optional intro paragraph. */
export function SectionHeading({
  title,
  intro,
  dark = false,
  as: Tag = 'h2',
  size = 'lg',
}: {
  title: string;
  intro?: string;
  dark?: boolean;
  as?: 'h2' | 'h3';
  size?: 'xl' | 'lg' | 'md';
}) {
  const reduce = useReducedMotion();
  const words = title.split(' ');
  const MotionTag = Tag === 'h2' ? motion.h2 : motion.h3;
  return (
    <div style={{ textAlign: 'center', marginBottom: 'var(--intro-to-content)' }}>
      <Reveal variant="fade" duration={1.2}>
        <div className="ornament" aria-hidden="true" style={{ marginBottom: 18 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
          </svg>
        </div>
      </Reveal>
      <MotionTag
        className={`display-${size}`}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        style={{ color: dark ? '#FFF8E8' : 'var(--color-ink)', marginBottom: intro ? 'var(--heading-to-intro)' : 0 }}
        aria-label={title}
      >
        {words.map((w, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: i < words.length - 1 ? '0.25em' : 0 }}
          >
            <motion.span
              style={{ display: 'inline-block', fontStyle: i === words.length - 1 && words.length > 1 ? 'italic' : undefined, fontWeight: i === words.length - 1 && words.length > 1 ? 500 : undefined }}
              className={i === words.length - 1 && words.length > 1 ? (dark ? 'text-gilded' : '') : ''}
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <span style={!dark && i === words.length - 1 && words.length > 1 ? { color: 'var(--oxblood)' } : undefined}>{w}</span>
            </motion.span>
          </span>
        ))}
      </MotionTag>
      {intro && (
        <Reveal delay={0.25}>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ maxWidth: '42rem', marginInline: 'auto', color: dark ? 'rgba(255,248,232,0.65)' : 'rgba(28,23,18,0.7)' }}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
