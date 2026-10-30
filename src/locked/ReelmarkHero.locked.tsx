/**
 * =======================================================================
 * 🔒 LOCKED COMPONENT — TOTALMENTE APROVADO PELO CLIENTE
 * DATA DE APROVAÇÃO: 29/10/2026
 * STATUS: CONGELADO / BLOQUEADO CONTRA ALTERAÇÕES
 * 
 * Regra estrita: NÃO MODIFICAR este componente sem instrução explícita
 * direta do usuário. A geometria cilíndrica 3D, cartões do portfólio,
 * escala responsiva 1440x960, ausência de botão inferior, performance
 * e modal estão 100% finalizados e aprovados.
 * =======================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import CaseStudyModal from '../components/CaseStudyModal';

const TILES_COUNT = 10;

const CAROUSEL_CARDS = [
  {
    title: 'A anatomia do medo criativo',
    tag: 'Carrossel 01 · Identificação',
    src: '/portfolio/carrossel-thumbs/thumb-0.jpg',
  },
  {
    title: 'Storytelling Confessional',
    tag: 'Carrossel 01 · Slide 02',
    src: '/portfolio/carrossel-thumbs/thumb-1.jpg',
  },
  {
    title: 'O método invisível da direção',
    tag: 'Carrossel 02 · Autoridade',
    src: '/portfolio/carrossel-thumbs/thumb-2.jpg',
  },
  {
    title: 'Experimentação & IA',
    tag: 'Carrossel 02 · Slide 04',
    src: '/portfolio/carrossel-thumbs/thumb-3.jpg',
  },
  {
    title: 'Arquitetura de conteúdo autoral',
    tag: 'Carrossel 03 · Processos',
    src: '/portfolio/carrossel-thumbs/thumb-4.jpg',
  },
  {
    title: 'Método HEAD na Prática',
    tag: 'Carrossel 03 · Slide 03',
    src: '/portfolio/carrossel-thumbs/thumb-5.jpg',
  },
  {
    title: 'Cultura do meme & ironia fina',
    tag: 'Carrossel 04 · Humor Ácido',
    src: '/portfolio/carrossel-thumbs/thumb-6.jpg',
  },
  {
    title: 'O Briefing Impossível',
    tag: 'Carrossel 04 · Slide 03',
    src: '/portfolio/carrossel-thumbs/thumb-7.jpg',
  },
  {
    title: 'Manual de sobrevivência',
    tag: 'Carrossel 05 · Descompressão',
    src: '/portfolio/carrossel-thumbs/thumb-8.jpg',
  },
  {
    title: 'Ilustração & Linguagem Autoral',
    tag: 'Carrossel 05 · Slide 03',
    src: '/portfolio/carrossel-thumbs/thumb-9.jpg',
  },
];

export default function ReelmarkHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardPathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Scale factor for responsive 1440x1080 stage
  const [stageScale, setStageScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Carousel physics refs
  const scrollOffsetRef = useRef(0);
  const velocityRef = useRef(35); // pixels/sec auto-scroll
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  // Vertical scroll freeze detection to eliminate all vertical scroll stutter
  const isScrollingPageRef = useRef(false);
  const scrollStopTimerRef = useRef<any>(null);

  // Entrance animation trigger & Modal state
  const [entered, setEntered] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  // Handle responsive resize & scaling
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const mobile = w <= 820;
      setIsMobile(mobile);

      if (!mobile) {
        // Desktop frame: contained 1440x1080
        const scale = Math.min(w / 1440, 1);
        setStageScale(scale);
      } else {
        setStageScale(1);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Window scroll listener: pause carousel geometry updates during active vertical scroll
  useEffect(() => {
    const onScroll = () => {
      isScrollingPageRef.current = true;
      if (scrollStopTimerRef.current) {
        clearTimeout(scrollStopTimerRef.current);
      }
      scrollStopTimerRef.current = setTimeout(() => {
        isScrollingPageRef.current = false;
        lastTimeRef.current = performance.now();
      }, 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollStopTimerRef.current) {
        clearTimeout(scrollStopTimerRef.current);
      }
    };
  }, []);

  // IntersectionObserver: Only run RAF when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting;
          isVisibleRef.current = inView;

          if (inView) {
            setEntered(true);
            lastTimeRef.current = performance.now();
            if (!animationFrameRef.current) {
              animationFrameRef.current = requestAnimationFrame(renderCarousel);
            }
          } else {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
              animationFrameRef.current = 0;
            }
          }
        });
      },
      { threshold: 0.02, rootMargin: '60px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Authentic Vanguard 3D Concave Cylinder Projection
  const renderCarousel = (now: number) => {
    if (!isVisibleRef.current) {
      animationFrameRef.current = 0;
      return;
    }

    // When the user is scrolling the page vertically, skip geometry math
    // to give 100% CPU/GPU focus to Lenis smooth scroll
    if (isScrollingPageRef.current) {
      lastTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(renderCarousel);
      return;
    }

    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = now;

    if (!isDraggingRef.current) {
      if (Math.abs(velocityRef.current) > 35) {
        velocityRef.current *= Math.exp(-3.2 * dt);
        scrollOffsetRef.current += velocityRef.current * dt;
      } else {
        velocityRef.current = 35;
        scrollOffsetRef.current += 35 * dt;
      }
    }

    const totalPitch = 196 * TILES_COUNT; // 1960px
    const S = scrollOffsetRef.current;

    for (let i = 0; i < TILES_COUNT; i++) {
      const cardEl = cardRefs.current[i];
      const clipPathEl = cardPathRefs.current[i];
      if (!cardEl) continue;

      // Base unpushed offset relative to center 720
      const u = i * 196 - S;
      let t = ((u % totalPitch) + totalPitch) % totalPitch;
      if (t > totalPitch / 2) t -= totalPitch; // t in [-980, 980]

      // Push outward formula: x = 720 + t * (1 + 0.083 * (t / 706)^2)
      const tRatio = t / 706;
      const x = 720 + t * (1 + 0.083 * tRatio * tRatio);

      // Normalized distance d = |x - 720| / 706
      const d = Math.abs(x - 720) / 706;

      // Card width W = 170 + 48 * d^2
      const W = 170 + 48 * d * d;

      // Vertical center = 687 - 12 * d^2
      const yc = 687 - 12 * d * d;

      // Left and Right edges
      const xL = x - W / 2;
      const xR = x + W / 2;

      // Offscreen culling: skip DOM updates if completely off the 1440 canvas
      if (xR < -60 || xL > 1500) {
        if (cardEl.style.display !== 'none') cardEl.style.display = 'none';
        continue;
      } else {
        if (cardEl.style.display !== 'block') cardEl.style.display = 'block';
      }

      const qL = Math.abs(xL - 720) / 706;
      const qR = Math.abs(xR - 720) / 706;

      // Height of each edge: 280 + 92 * q^2.6
      const hL = 280 + 92 * Math.pow(qL, 2.6);
      const hR = 280 + 92 * Math.pow(qR, 2.6);

      // Vertices
      const yTL = yc - hL / 2;
      const yTR = yc - hR / 2;
      const yBL = yc + hL / 2;
      const yBR = yc + hR / 2;

      const yBox = Math.min(yTL, yTR);
      const hBox = Math.max(yBL, yBR) - yBox;

      // Local vertices inside bounding box
      const lTL = yTL - yBox;
      const lTR = yTR - yBox;
      const lBL = yBL - yBox;
      const lBR = yBR - yBox;

      // Corner radius R_top = 18 - 4 * d, R_bot = 18 + 4 * d
      const rTop = Math.max(8, 18 - 4 * d);
      const rBot = Math.min(26, 18 + 4 * d);
      const r = Math.min(rTop, rBot);

      const topSlope = (lTR - lTL) / W;
      const btmSlope = (lBR - lBL) / W;

      // SVG Path for rounded trapezoidquad
      const p1x = r, p1y = lTL + topSlope * r;
      const p2x = W - r, p2y = lTR - topSlope * r;
      const p3x = W, p3y = lTR + r;
      const p4x = W, p4y = lBR - r;
      const p5x = W - r, p5y = lBR + btmSlope * r;
      const p6x = r, p6y = lBL - btmSlope * r;
      const p7x = 0, p7y = lBL - r;
      const p8x = 0, p8y = lTL + r;

      const pathStr = `M ${p1x} ${p1y} L ${p2x} ${p2y} Q ${W} ${lTR} ${p3x} ${p3y} L ${p4x} ${p4y} Q ${W} ${lBR} ${p5x} ${p5y} L ${p6x} ${p6y} Q 0 ${lBL} ${p7x} ${p7y} L ${p8x} ${p8y} Q 0 ${lTL} ${p1x} ${p1y} Z`;

      if (clipPathEl) {
        clipPathEl.setAttribute('d', pathStr);
      }

      // Fast hardware-accelerated transform
      cardEl.style.transform = `translate3d(${xL}px, ${yBox}px, 0)`;
      cardEl.style.width = `${W}px`;
      cardEl.style.height = `${hBox}px`;
      cardEl.style.borderRadius = `${rTop}px ${rTop}px ${rBot}px ${rBot}px`;
      cardEl.style.clipPath = `path('${pathStr}')`;
    }

    animationFrameRef.current = requestAnimationFrame(renderCarousel);
  };

  // Drag interaction with Pointer Capture
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    scrollOffsetRef.current -= delta * 1.25;
    velocityRef.current = -delta * 40;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <section
      id="reelmark"
      ref={containerRef}
      className="relative w-full bg-[#FFF4E8] text-[#101014] overflow-hidden select-none flex flex-col items-center justify-start border-t border-[#101014]/6"
      style={{
        minHeight: isMobile ? 'auto' : `${960 * stageScale}px`,
        height: isMobile ? 'auto' : `${960 * stageScale}px`,
      }}
    >
      {/* ========================================================
          DESKTOP 1440x960 STAGE (SCALED & HARDWARE-ACCELERATED)
      ======================================================== */}
      <div
        className="relative w-[1440px] h-[960px] shrink-0 origin-top pointer-events-auto"
        style={{
          transform: `scale(${stageScale})`,
          display: isMobile ? 'none' : 'block',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* SVG Defs for ClipPaths */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            {Array.from({ length: TILES_COUNT }).map((_, i) => (
              <clipPath key={i} id={`reelmark-card-clip-${i}`}>
                <path ref={(el) => (cardPathRefs.current[i] = el)} />
              </clipPath>
            ))}
          </defs>
        </svg>

        {/* 1. HEADLINE at top 140 */}
        <div
          className={`absolute left-0 right-0 top-[140px] text-center flex flex-col items-center transition-all duration-700 delay-200 ${
            entered ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'
          }`}
        >
          <h2 className="font-montserrat font-black text-[86px] text-[#101014] leading-[92px] uppercase">
            <span className="block tracking-[-0.035em]">Da estratégia</span>
            <span className="block tracking-[-0.022em]">à publicação.</span>
          </h2>
        </div>

        {/* 2. SUBLINE at top 355 */}
        <div
          className={`absolute left-0 right-0 top-[355px] text-center flex flex-col items-center transition-all duration-700 delay-300 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-inter text-[19px] leading-[30px] text-[#5A5A66] max-w-[760px]">
            Planejamento só faz sentido quando se transforma em conteúdo.
            <br />
            Conheça os projetos, as decisões e o pensamento criativo por trás do meu trabalho.
          </p>
        </div>

        {/* Note "Narrativa & Comunidade" rotated 16° at (1180, 260) */}
        <div
          className={`absolute left-[1180px] top-[260px] pointer-events-none transition-all duration-700 delay-400 ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'rotate(16deg)' }}
        >
          <div className="font-caveat text-[28px] leading-[1.05] font-semibold text-[#FF701A]">
            Narrativa &
            <br />
            Comunidade
          </div>
        </div>

        {/* Curving Arrow from note to cards */}
        <svg
          className="absolute left-[1090px] top-[305px] w-[160px] h-[140px] pointer-events-none z-10"
          viewBox="0 0 160 140"
          fill="none"
        >
          <path
            d="M130 10 C 135 50, 100 90, 30 120"
            stroke="#FF701A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={entered ? '0' : '200'}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.4s' }}
          />
          <path
            d="M28 122 L 44 117 M 28 122 L 36 106"
            stroke="#FF701A"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity={entered ? 1 : 0}
            style={{ transition: 'opacity 0.3s ease-out 1.2s' }}
          />
        </svg>

        {/* 3. CARD ROW: AUTHENTIC 3D CONCAVE CYLINDER CAROUSEL */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto"
          style={{ touchAction: 'pan-y' }}
        >
          {Array.from({ length: TILES_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => setIsCaseModalOpen(true)}
              className="absolute left-0 top-0 overflow-hidden select-none cursor-pointer group bg-[#101014] shadow-[0_22px_45px_rgba(16,16,20,0.30)] hover:ring-2 hover:ring-[#FF701A] transition-shadow"
              style={{
                willChange: 'transform',
                clipPath: `url(#reelmark-card-clip-${i})`,
              }}
            >
              {/* High-speed pre-rendered thumbnail */}
              <img
                src={CAROUSEL_CARDS[i].src}
                alt={CAROUSEL_CARDS[i].title}
                className="w-full h-full object-cover object-center pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {/* Depth Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

              {/* Instagram Carousel Badge (Top-Right) */}
              <div className="absolute top-3 right-3 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-white pointer-events-none shadow-sm border border-white/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="14" height="14" rx="2" ry="2" />
                  <path d="M7 21h12a2 2 0 0 0 2-2V7" />
                </svg>
              </div>

              {/* Bottom Tag & Click CTA */}
              <div className="absolute bottom-2.5 inset-x-2.5 px-2.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md flex items-center justify-between text-white border border-white/10 pointer-events-none">
                <div className="flex flex-col truncate pr-1">
                  <span className="text-[9.5px] font-bold text-[#FFB800] uppercase tracking-wider truncate">
                    {CAROUSEL_CARDS[i].tag}
                  </span>
                  <span className="text-[11px] font-semibold text-white/95 truncate">
                    {CAROUSEL_CARDS[i].title}
                  </span>
                </div>
                <span className="shrink-0 text-[9.5px] font-extrabold text-[#FFF4E8] bg-[#FF701A] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                  Ver ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (<= 820px) — NATIVE 120HZ HORIZONTAL SCROLL
      ======================================================== */}
      <div
        className="w-full max-w-[820px] px-5 py-12 flex flex-col items-center gap-6"
        style={{ display: isMobile ? 'flex' : 'none' }}
      >
        <h2 className="font-montserrat font-black text-[clamp(34px,8vw,48px)] text-[#101014] leading-[1.02] text-center uppercase tracking-tight">
          Da estratégia
          <br />
          à publicação.
        </h2>

        <p className="font-inter text-sm sm:text-base text-[#5A5A66] text-center leading-relaxed max-w-md">
          Planejamento só faz sentido quando se transforma em conteúdo. Conheça os projetos, as decisões e o pensamento criativo por trás do meu trabalho.
        </p>

        <div className="relative w-screen -mx-5 px-5 h-[260px] overflow-x-auto overflow-y-hidden no-scrollbar my-2 flex items-center touch-pan-x">
          <div className="flex items-center gap-3.5 py-2 w-full px-2">
            {CAROUSEL_CARDS.map((item, i) => (
              <div
                key={i}
                onClick={() => setIsCaseModalOpen(true)}
                className="relative shrink-0 w-[170px] h-[226px] rounded-[18px] overflow-hidden bg-neutral-900 shadow-xl cursor-pointer border border-[#101014]/10 active:scale-95 transition-transform"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center select-none"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="14" height="14" rx="2" ry="2" />
                    <path d="M7 21h12a2 2 0 0 0 2-2V7" />
                  </svg>
                </div>
                <div className="absolute bottom-2 inset-x-2 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md flex items-center justify-between text-white border border-white/10">
                  <span className="text-[10px] font-bold text-[#FFB800] uppercase truncate">
                    {item.tag}
                  </span>
                  <span className="text-[9px] font-bold text-white bg-[#FF701A] px-1.5 py-0.5 rounded uppercase">
                    Ver ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Full Unfolding Modal */}
      <CaseStudyModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
      />
    </section>
  );
}
