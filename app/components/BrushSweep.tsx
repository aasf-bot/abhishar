'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroSlide {
  src: string;
  alt: string;
  label: string;
  focalPoint: { x: number; y: number };
}

interface BrushSweepProps {
  slides: HeroSlide[];
  onSlideChange?: (index: number) => void;
}

const HOLD_DURATION = 5000;
const SWEEP_DURATION = 2.6;

export default function BrushSweep({ slides, onSlideChange }: BrushSweepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackRef = useRef<number[]>([]);
  const loadedImgs = useRef<HTMLImageElement[]>([]);
  const isTransitioningRef = useRef(false);
  const isPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const onChangeRef = useRef(onSlideChange);
  // Animation progress for each band (0 = not erased, 1 = fully erased)
  const bandProgress = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const zoomRef = useRef(1);
  const zoomDirRef = useRef(1);

  useEffect(() => { onChangeRef.current = onSlideChange; }, [onSlideChange]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const numSlides = slides.length;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const getNumBands = () => window.innerWidth < 768 ? 8 : 12;

    // Reduced motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mql.matches;
    const onMotion = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches; };
    mql.addEventListener('change', onMotion);

    // Preload all images into HTMLImageElement array
    let loadCount = 0;
    loadedImgs.current = slides.map((s, i) => {
      const img = new window.Image();
      img.src = s.src;
      img.crossOrigin = 'anonymous';
      img.decode().then(() => {
        loadCount++;
        if (loadCount === numSlides) {
          // All loaded — do initial draw and start
          initAfterLoad();
        }
      }).catch(() => {
        loadCount++;
        if (loadCount === numSlides) initAfterLoad();
      });
      return img;
    });

    // Stack: reversed so top = slide 0
    stackRef.current = [...Array(numSlides)].map((_, i) => i).reverse();

    // Resize canvas to match container
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initAfterLoad() {
      resizeCanvas();
      drawCurrentFrame();
      onChangeRef.current?.(stackRef.current[stackRef.current.length - 1]);
      schedule();
      startZoomLoop();
    }

    // Draw an image on canvas with cover-fit and focal point
    function drawImageCover(
      img: HTMLImageElement,
      focalX: number,
      focalY: number,
      zoom = 1,
      clipY?: number,
      clipH?: number,
    ) {
      if (!img.complete || img.naturalWidth === 0) return;
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let sw: number, sh: number, sx: number, sy: number;

      if (imgRatio > canvasRatio) {
        // Image is wider — fit by height
        sh = img.naturalHeight;
        sw = sh * canvasRatio;
        sx = (img.naturalWidth - sw) * (focalX / 100);
        sy = 0;
      } else {
        // Image is taller — fit by width
        sw = img.naturalWidth;
        sh = sw / canvasRatio;
        sx = 0;
        sy = (img.naturalHeight - sh) * (focalY / 100);
      }

      // Apply zoom
      if (zoom !== 1) {
        const zoomSw = sw / zoom;
        const zoomSh = sh / zoom;
        sx += (sw - zoomSw) * (focalX / 100);
        sy += (sh - zoomSh) * (focalY / 100);
        sw = zoomSw;
        sh = zoomSh;
      }

      const dx = 0;
      const dy = clipY !== undefined ? clipY : 0;
      const dw = cw;
      const dh = clipH !== undefined ? clipH : ch;

      // Adjust source for clip region
      if (clipY !== undefined && clipH !== undefined) {
        const srcClipY = sy + (clipY / ch) * sh;
        const srcClipH = (clipH / ch) * sh;
        ctx!.drawImage(img, sx, srcClipY, sw, srcClipH, dx, dy, dw, dh);
      } else {
        ctx!.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }

    // Draw the current state: bottom image fully, then top image with bands erased
    function drawCurrentFrame() {
      const stack = stackRef.current;
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;
      if (cw === 0 || ch === 0) return;

      const topIdx = stack[stack.length - 1];
      const belowIdx = stack.length > 1 ? stack[stack.length - 2] : topIdx;
      const topSlide = slides[topIdx];
      const belowSlide = slides[belowIdx];
      const topImg = loadedImgs.current[topIdx];
      const belowImg = loadedImgs.current[belowIdx];

      // Draw the image below (fully visible)
      drawImageCover(belowImg, belowSlide.focalPoint.x, belowSlide.focalPoint.y, 1);

      // Draw the top image, skipping erased bands
      const numBands = bandProgress.current.length;
      if (numBands === 0) {
        // No transition — draw top fully with zoom
        drawImageCover(topImg, topSlide.focalPoint.x, topSlide.focalPoint.y, zoomRef.current);
        return;
      }

      const bandH = ch / numBands;
      for (let i = 0; i < numBands; i++) {
        const progress = bandProgress.current[i];
        if (progress >= 1) continue; // fully erased, skip

        const ltr = i % 2 === 0;
        const y = i * bandH;
        const erased = progress * cw;

        ctx!.save();
        if (ltr) {
          // Erased from the left: visible part is from erased to cw
          ctx!.beginPath();
          ctx!.rect(erased, y, cw - erased, bandH + 1); // +1 to prevent seams
          ctx!.clip();
        } else {
          // Erased from the right: visible part is from 0 to (cw - erased)
          ctx!.beginPath();
          ctx!.rect(0, y, cw - erased, bandH + 1);
          ctx!.clip();
        }
        drawImageCover(topImg, topSlide.focalPoint.x, topSlide.focalPoint.y, zoomRef.current);
        ctx!.restore();
      }
    }

    // Slow zoom loop during hold (not during sweep)
    function startZoomLoop() {
      const tick = () => {
        if (!isTransitioningRef.current) {
          zoomRef.current += 0.0003 * zoomDirRef.current;
          if (zoomRef.current > 1.06) zoomDirRef.current = -1;
          if (zoomRef.current < 1) zoomDirRef.current = 1;
          drawCurrentFrame();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    // Schedule next sweep
    function schedule() {
      if (isPausedRef.current || numSlides < 2) return;
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      holdTimerRef.current = setTimeout(sweep, HOLD_DURATION);
    }

    // The main sweep animation
    function sweep() {
      if (isTransitioningRef.current || isPausedRef.current || numSlides < 2) return;
      isTransitioningRef.current = true;

      const stack = stackRef.current;

      // Reduced motion: simple crossfade via canvas opacity
      if (reducedMotionRef.current) {
        const fadeObj = { t: 0 };
        gsap.to(fadeObj, {
          t: 1,
          duration: 1,
          onUpdate: () => {
            const topIdx = stack[stack.length - 1];
            const belowIdx = stack[stack.length - 2];
            const cw = container!.clientWidth;
            const ch = container!.clientHeight;
            // Draw below fully
            drawImageCover(loadedImgs.current[belowIdx], slides[belowIdx].focalPoint.x, slides[belowIdx].focalPoint.y, 1);
            // Draw top with fading opacity
            ctx!.globalAlpha = 1 - fadeObj.t;
            drawImageCover(loadedImgs.current[topIdx], slides[topIdx].focalPoint.x, slides[topIdx].focalPoint.y, zoomRef.current);
            ctx!.globalAlpha = 1;
          },
          onComplete: () => {
            const removed = stack.pop()!;
            stack.unshift(removed);
            zoomRef.current = 1;
            zoomDirRef.current = 1;
            onChangeRef.current?.(stack[stack.length - 1]);
            isTransitioningRef.current = false;
            drawCurrentFrame();
            schedule();
          },
        });
        return;
      }

      // Set up band progress
      const numBands = getNumBands();
      bandProgress.current = new Array(numBands).fill(0);

      // Freeze zoom at current value during sweep
      const sweepZoom = zoomRef.current;

      const tl = gsap.timeline({
        onUpdate: () => drawCurrentFrame(),
        onComplete: () => {
          // Move top to bottom
          const removed = stack.pop()!;
          stack.unshift(removed);
          bandProgress.current = [];
          zoomRef.current = 1;
          zoomDirRef.current = 1;
          onChangeRef.current?.(stack[stack.length - 1]);
          isTransitioningRef.current = false;
          drawCurrentFrame();
          schedule();
        },
      });
      timelineRef.current = tl;

      const bandDur = SWEEP_DURATION / (numBands * 0.6 + 0.4);
      const stagger = bandDur * 0.6;

      const brush = brushRef.current;
      const streak = streakRef.current;

      for (let i = 0; i < numBands; i++) {
        const ltr = i % 2 === 0;
        const t0 = i * stagger;
        const bandPct = 100 / numBands;
        const brushY = i * bandPct + bandPct / 2;

        // Animate band progress from 0 to 1
        tl.to(bandProgress.current, {
          [i]: 1,
          duration: bandDur,
          ease: 'power2.inOut',
        }, t0);

        // Brush follows leading edge
        if (brush) {
          tl.set(brush, {
            top: `${brushY}%`,
            left: ltr ? '0%' : '100%',
            opacity: 1,
            scaleX: ltr ? 1 : -1,
          }, t0);
          tl.to(brush, {
            left: ltr ? '100%' : '0%',
            duration: bandDur,
            ease: 'power2.inOut',
          }, t0);
        }

        // Paint streak
        if (streak) {
          tl.set(streak, { opacity: 0.55 }, t0 + 0.02);
          tl.to(streak, { opacity: 0, duration: bandDur * 0.45 }, t0 + bandDur * 0.55);
        }
      }

      // Fade brush at end
      if (brush) tl.to(brush, { opacity: 0, duration: 0.2 }, '>-0.12');
    }

    // Visibility API
    const onVis = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
        timelineRef.current?.pause();
      } else {
        isPausedRef.current = false;
        if (timelineRef.current?.paused()) timelineRef.current.resume();
        else if (!isTransitioningRef.current) schedule();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // Resize handler
    const onResize = () => {
      resizeCanvas();
      drawCurrentFrame();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      timelineRef.current?.kill();
      cancelAnimationFrame(rafRef.current);
      mql.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Canvas renders the image stack + eraser animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Brush graphic + paint streak */}
      <div
        ref={brushRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 15,
          top: '0%',
          left: '0%',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, opacity',
        }}
      >
        <div
          ref={streakRef}
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '90px',
            height: '3px',
            background: 'linear-gradient(to left, #E2674A, transparent)',
            opacity: 0,
            borderRadius: '2px',
          }}
        />
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="drop-shadow-lg">
          <rect x="0" y="8" width="35" height="14" rx="3" fill="#8B6914" />
          <rect x="35" y="6" width="6" height="18" rx="1" fill="#C0C0C0" />
          <path d="M41 6 Q50 0 58 8 Q60 15 58 22 Q50 30 41 24 Z" fill="#E2674A" opacity="0.9" />
          <circle cx="55" cy="20" r="3" fill="#E2674A" opacity="0.6" />
        </svg>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="hero-gradient absolute inset-0" style={{ zIndex: 10 }} />
    </div>
  );
}
