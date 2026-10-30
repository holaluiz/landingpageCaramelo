import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import CaseStudyModal from './CaseStudyModal';

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

  // Scale factor for responsive 1440x760 stage
  const [stageScale, setStageScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Carousel physics refs
  const scrollOffsetRef = useRef(0);
  const velocityRef = useRef(35); // pixels/sec auto-scroll
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0, time: 0 });
  const clickedCardIndexRef = useRef<number | null>(null);

  // Entrance animation trigger, Modal state & Selected Carousel Index
  const [entered, setEntered] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCarouselIdx, setSelectedCarouselIdx] = useState(0);

  // Open case study modal at target carousel
  const handleCardClick = (cardIdx: number) => {
    // 10 cards mapped to 5 carousels (2 cards per carousel)
    const carouselIdx = Math.min(Math.floor(cardIdx / 2), 4);
    setSelectedCarouselIdx(carouselIdx);
    setIsCaseModalOpen(true);
  };

  const handleOpenCase = () => {
    setSelectedCarouselIdx(0);
    setIsCaseModalOpen(true);
  };

  // Handle responsive resize & scaling
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const mobile = w <= 820;
      setIsMobile(mobile);

      if (!mobile) {
        // Desktop frame: contained 1440 width
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

  // Authentic Vanguard 3D Concave Cylinder Projection Layout Calculation
  const updateGeometry = () => {
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

      // Vertical center = 550 - 12 * d^2
      const yc = 550 - 12 * d * d;

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
  };

  // Immediate layout render on mount so all cards are pre-positioned before first scroll
  useEffect(() => {
    updateGeometry();
  }, []);

  // IntersectionObserver: Run continuous RAF with generous pre-scroll margin
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
      { threshold: 0.01, rootMargin: '600px 0px' }
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

  // Authentic Vanguard 3D Concave Cylinder Projection loop
  const renderCarousel = (now: number) => {
    if (!isVisibleRef.current) {
      animationFrameRef.current = 0;
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

    updateGeometry();

    animationFrameRef.current = requestAnimationFrame(renderCarousel);
  };

  // Drag interaction with Pointer Capture AND Click distinction
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    dragStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    hasMovedRef.current = false;
    isDraggingRef.current = false;
    velocityRef.current = 0;

    // Detect if pointerdown started on a card
    const target = e.target as HTMLElement;
    const cardEl = target.closest('[data-card-idx]');
    if (cardEl) {
      const idxStr = cardEl.getAttribute('data-card-idx');
      clickedCardIndexRef.current = idxStr !== null ? parseInt(idxStr, 10) : null;
    } else {
      clickedCardIndexRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerDownPosRef.current.time === 0) return;
    const dist = Math.abs(e.clientX - dragStartXRef.current);

    // Only engage drag and capture pointer if moved beyond 6px threshold
    if (!hasMovedRef.current && dist > 6) {
      hasMovedRef.current = true;
      isDraggingRef.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }

    if (isDraggingRef.current) {
      const delta = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;
      scrollOffsetRef.current -= delta * 1.25;
      velocityRef.current = -delta * 40;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = hasMovedRef.current;
    const downPos = pointerDownPosRef.current;
    pointerDownPosRef.current = { x: 0, y: 0, time: 0 };
    isDraggingRef.current = false;
    hasMovedRef.current = false;

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}

    // If it was a CLICK (no significant drag)
    if (!wasDragging) {
      const moveDist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (moveDist < 8) {
        if (clickedCardIndexRef.current !== null) {
          handleCardClick(clickedCardIndexRef.current);
          clickedCardIndexRef.current = null;
          return;
        }

        const target = e.target as HTMLElement;
        const cardEl = target.closest('[data-card-idx]');
        if (cardEl) {
          const idxStr = cardEl.getAttribute('data-card-idx');
          if (idxStr !== null) {
            handleCardClick(parseInt(idxStr, 10));
          }
        }
      }
    }
    clickedCardIndexRef.current = null;
  };

  return (
    <section
      id="reelmark"
      ref={containerRef}
      className="relative w-full bg-[#FFF4E8] text-[#101014] overflow-hidden select-none flex flex-col items-center justify-start border-t border-[#101014]/6 pt-12 sm:pt-16 pb-20 sm:pb-28"
    >
      {/* ========================================================
          DESKTOP 1440x760 STAGE (SCALED & HARDWARE-ACCELERATED)
      ======================================================== */}
      <div
        className="w-full flex justify-center overflow-visible"
        style={{
          height: `${760 * stageScale}px`,
          display: isMobile ? 'none' : 'flex',
        }}
      >
        <div
          className="relative w-[1440px] h-[760px] shrink-0 origin-top pointer-events-auto"
          style={{
            transform: `scale(${stageScale})`,
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

          {/* 1. HEADLINE at top 85 */}
          <div
            className={`absolute left-0 right-0 top-[85px] text-center flex flex-col items-center transition-all duration-700 delay-200 ${
              entered ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'
            }`}
          >
            <h2 className="font-montserrat font-black text-[76px] text-[#101014] leading-[82px] uppercase">
              <span className="block tracking-[-0.035em]">Da estratégia</span>
              <span className="block tracking-[-0.022em]">à publicação.</span>
            </h2>
          </div>

          {/* 3. SUBLINE at top 270 */}
          <div
            className={`absolute left-0 right-0 top-[270px] text-center flex flex-col items-center transition-all duration-700 delay-300 ${
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-inter text-[18px] leading-[28px] text-[#5A5A66] max-w-[760px]">
              Planejamento só faz sentido quando se transforma em conteúdo.
              <br />
              Conheça os projetos, as decisões e o pensamento criativo por trás do meu trabalho.
            </p>
          </div>

          {/* Note "Narrativa & Comunidade" rotated 16° at (1170, 210) */}
          <div
            className={`absolute left-[1170px] top-[210px] pointer-events-none transition-all duration-700 delay-400 ${
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
            className="absolute left-[1090px] top-[255px] w-[160px] h-[140px] pointer-events-none z-10"
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

          {/* 4. CARD ROW: AUTHENTIC 3D CONCAVE CYLINDER CAROUSEL */}
          <div
            className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto"
            style={{ touchAction: 'pan-y' }}
          >
            {Array.from({ length: TILES_COUNT }).map((_, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                data-card-idx={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(i);
                }}
                className="absolute left-0 top-0 overflow-hidden select-none cursor-pointer group bg-[#101014] shadow-[0_22px_45px_rgba(16,16,20,0.30)] hover:ring-2 hover:ring-[#FF701A] transition-[box-shadow,ring] duration-150"
                style={{
                  willChange: 'transform',
                  clipPath: `url(#reelmark-card-clip-${i})`,
                }}
                title="Clique para ver o case completo"
              >
                {/* High-speed pre-rendered thumbnail */}
                <img
                  src={CAROUSEL_CARDS[i].src}
                  alt={CAROUSEL_CARDS[i].title}
                  className="w-full h-full object-cover object-center pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (<= 820px) — NATIVE 120HZ HORIZONTAL SCROLL
      ======================================================== */}
      <div
        className="w-full max-w-[820px] px-5 pt-8 pb-4 flex flex-col items-center gap-5"
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
                data-card-idx={i}
                onClick={() => handleCardClick(i)}
                className="relative shrink-0 w-[170px] h-[226px] rounded-[18px] overflow-hidden bg-neutral-900 shadow-xl cursor-pointer border border-[#101014]/10 active:scale-95 transition-transform"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center select-none"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          PROJETO 01 — UM CARA CARAMELO® (FEATURED CASE STUDY CARD)
      ======================================================== */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 mt-6 sm:mt-10">
        <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-[#FF701A]/25 p-7 sm:p-10 shadow-[0_20px_50px_rgba(16,16,20,0.08)]">
          {/* Header Row: Label & Identificação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#101014]/8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#FF701A] text-white font-montserrat font-black text-xs tracking-wider uppercase shadow-sm">
                PROJETO 01 — UM CARA CARAMELO®
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#5A5A66] font-inter">
                Estratégia de Conteúdo · Branding · Comunidade
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-[#101014]/50 uppercase tracking-wider font-inter">
                Identificação:
              </span>
              <span className="font-caveat text-lg sm:text-xl font-bold text-[#FF701A]">
                Projeto autoral
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h3 className="font-montserrat font-black text-xl sm:text-2xl md:text-[28px] text-[#101014] uppercase tracking-tight leading-snug mt-5 mb-4">
            Uma marca pessoal. Múltiplos interesses. Uma direção editorial.
          </h3>

          {/* Narrative Body Copy */}
          <div className="space-y-3.5 font-inter text-sm sm:text-base text-[#5A5A66] leading-relaxed max-w-3xl">
            <p>
              Como conectar criatividade, inteligência artificial, design e tecnologia em uma narrativa capaz de construir identificação, autoridade e comunidade? Esse foi o desafio que orientou a estratégia editorial do Um Cara Caramelo.
            </p>
            <p>
              Desenvolvi uma jornada de conteúdo baseada em identificação, conexão, aspiração, confiança e conversão, combinando storytelling, experimentação, educação e humor.
            </p>
            <p className="text-[#101014]/90 font-medium">
              O planejamento foi organizado em três editorias semanais, cada uma com uma função estratégica na construção da marca.
            </p>
          </div>

          {/* Footer Metadata & CTA Row */}
          <div className="mt-7 pt-6 border-t border-[#101014]/8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#101014]/50 uppercase tracking-widest font-inter">
                Atuação
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#101014] font-inter leading-relaxed">
                Estratégia editorial · Planejamento · Arquitetura de narrativas · Direção criativa · Conteúdo
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <span className="font-caveat text-lg text-[#FF701A] font-semibold hidden sm:inline">
                Projeto autoral →
              </span>
              <button
                onClick={handleOpenCase}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FF701A] hover:bg-[#E55E0D] text-white font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all duration-200 shadow-[0_6px_25px_rgba(255,112,26,0.35)] hover:shadow-[0_8px_32px_rgba(255,112,26,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explorar case completo</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Full Unfolding Modal */}
      <CaseStudyModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        initialCarousel={selectedCarouselIdx}
      />
    </section>
  );
}
