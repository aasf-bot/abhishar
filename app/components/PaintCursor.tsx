'use client';

import { useEffect, useRef } from 'react';

interface TrailDot {
  x: number;
  y: number;
  el: HTMLDivElement;
  birth: number;
}

export default function PaintCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastTrailRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.display = 'block';
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, select, textarea, [tabindex]')
      ) {
        cursor.classList.add('hovering');
      } else {
        cursor.classList.remove('hovering');
      }
    };

    const createTrailDot = (x: number, y: number) => {
      const dot = document.createElement('div');
      dot.className = 'paint-trail';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      document.body.appendChild(dot);

      const trail: TrailDot = { x, y, el: dot, birth: Date.now() };
      trailsRef.current.push(trail);

      // Fade and remove
      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          dot.remove();
          trailsRef.current = trailsRef.current.filter((t) => t !== trail);
        }, 400);
      }, 100);
    };

    const animate = () => {
      if (cursor) {
        cursor.style.left = `${mouseRef.current.x}px`;
        cursor.style.top = `${mouseRef.current.y}px`;
      }

      // Create trail dots occasionally
      const now = Date.now();
      if (now - lastTrailRef.current > 50) {
        createTrailDot(mouseRef.current.x, mouseRef.current.y);
        lastTrailRef.current = now;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = '';
      // Clean up trail dots
      trailsRef.current.forEach((t) => t.el.remove());
      trailsRef.current = [];
    };
  }, []);

  return <div ref={cursorRef} className="paint-cursor" style={{ display: 'none' }} />;
}
