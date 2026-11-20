'use client';

import { useEffect, useRef } from 'react';

const PALETTE = ['#C2462E', '#B8893B', '#22403C', '#1C2748', '#5E1F23'];

/** Paint-dot cursor with a lagging gold ring and a short pigment trail (fine pointers only). */
export default function PaintCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.display = 'block';
    ring.style.display = 'block';
    document.documentElement.classList.add('has-paint-cursor');

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let last = { x: -100, y: -100 };
    let lastTrail = 0;
    let colorIdx = 0;
    let raf = 0;
    const trails = new Set<HTMLDivElement>();

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest?.('a, button, [role="button"], input, select, textarea, iframe, video');
      ring.classList.toggle('hovering', interactive);
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const spawnTrail = (x: number, y: number) => {
      const el = document.createElement('div');
      el.className = 'paint-trail';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.background = PALETTE[colorIdx++ % PALETTE.length];
      document.body.appendChild(el);
      trails.add(el);
      requestAnimationFrame(() => {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(0.2)';
      });
      setTimeout(() => {
        el.remove();
        trails.delete(el);
      }, 650);
    };

    const tick = () => {
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      // Only paint while actually moving
      const now = performance.now();
      const moved = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      if (!reduce && moved > 6 && now - lastTrail > 35) {
        spawnTrail(mouse.x, mouse.y);
        lastTrail = now;
        last = { ...mouse };
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-paint-cursor');
      trails.forEach((t) => t.remove());
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="paint-cursor-ring" style={{ display: 'none' }} aria-hidden="true" />
      <div ref={dotRef} className="paint-cursor" style={{ display: 'none' }} aria-hidden="true" />
    </>
  );
}
