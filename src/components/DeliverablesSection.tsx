import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Layers,
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DeliverablesSectionProps {
  id?: string;
  imageSrc?: string;
}

interface DeliverableItem {
  id: number;
  number: string;
  shortLabel: string;
  title: string;
  description: string;
  category: string;
  highlight: string;
  outputs: string[];
  icon: typeof Compass;
}

const DELIVERABLES: DeliverableItem[] = [
  {
    id: 1,
    number: '01',
    shortLabel: 'Diagnóstico',
    title: 'Diagnóstico e posicionamento',
    description:
      'Entendo seu negócio, sua oferta, seu público e sua comunicação para identificar oportunidades e definir prioridades.',
    category: 'Imersão Estratégica',
    highlight: 'Causa raiz & gargalos',
    outputs: [
      'Mapeamento de posicionamento e percepção de marca',
      'Diagnóstico de gaps entre a sua entrega e seu conteúdo',
      'Definição do público prioritário e da mensagem central',
    ],
    icon: Compass,
  },
  {
    id: 2,
    number: '02',
    shortLabel: 'Estratégia',
    title: 'Estratégia editorial',
    description:
      'Estruturo narrativas, pilares e mensagens para construir uma comunicação reconhecível, relevante e alinhada aos seus objetivos.',
    category: 'Arquitetura de Marca',
    highlight: 'Fio condutor autoral',
    outputs: [
      'Matriz de pilares editoriais com intenção clara',
      'Narrativas-chave que geram autoridade e identificação imediata',
      'Tom de voz proprietário e diretrizes de diferenciação',
    ],
    icon: Layers,
  },
  {
    id: 3,
    number: '03',
    shortLabel: 'Planejamento',
    title: 'Planejamento de conteúdo',
    description:
      'Organizo pautas, formatos, campanhas e calendário editorial para transformar a estratégia em uma rotina de produção.',
    category: 'Rotina & Processos',
    highlight: 'Cadência sem sobrecarga',
    outputs: [
      'Calendário editorial organizado por ciclos quinzenais',
      'Pautas fundamentadas em pesquisa e comportamento do público',
      'Seleção de formatos validados: carrosséis, vídeos e narrativas',
    ],
    icon: Calendar,
  },
  {
    id: 4,
    number: '04',
    shortLabel: 'Produção',
    title: 'Direção criativa e produção',
    description:
      'Conduzo o desenvolvimento de textos, carrosséis, vídeos e demais conteúdos, coordenando produção, aprovações e publicações conforme o escopo.',
    category: 'Execução & Arte',
    highlight: 'Copy antes do design',
    outputs: [
      'Roteiros de vídeo com retenção testada e ganchos autênticos',
      'Carrosséis estruturados no Método HEAD (Atenção → Retenção → Toque)',
      'Gestão de aprovações prévias para preservar o seu tempo',
    ],
    icon: Sparkles,
  },
  {
    id: 5,
    number: '05',
    shortLabel: 'Evolução',
    title: 'Acompanhamento e evolução',
    description:
      'Analiso indicadores, identifico aprendizados e ajusto os próximos ciclos para aprimorar continuamente a comunicação.',
    category: 'Métricas & Otimização',
    highlight: 'Melhoria contínua',
    outputs: [
      'Análise de indicadores reais (retenção, engajamento e conversão)',
      'Identificação de aprendizados para refinamento de temas e formatos',
      'Ajustes ágeis nos próximos ciclos de conteúdo',
    ],
    icon: TrendingUp,
  },
];

export default function DeliverablesSection({
  id = 'stats-2',
  imageSrc = '/PC.png',
}: DeliverablesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pcRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomBandRef = useRef<HTMLDivElement>(null);

  // Scroll-driven pipeline refs
  const pipelineWrapperRef = useRef<HTMLDivElement>(null);
  const pipelineStickyRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIdRef = useRef(1);

  // Active deliverable card state for interactive deep dive & scroll progress
  const [activeId, setActiveId] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header entrance (smooth lift, always visible)
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 24,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // 2. Scroll-Driven 5-Deliverable Scrub Pipeline (Advances cards as user scrolls)
      if (pipelineWrapperRef.current && pipelineStickyRef.current) {
        const mm = gsap.matchMedia();

        // Desktop / Tablet: Pinned scroll scrub across all 5 deliverables
        mm.add('(min-width: 641px)', () => {
          const st = ScrollTrigger.create({
            trigger: pipelineWrapperRef.current,
            start: 'top 14%',
            end: '+=240%',
            pin: pipelineStickyRef.current,
            scrub: 0.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Map progress 0.0 -> 1.0 into 5 deliverables (1 to 5)
              const cardIndex = Math.min(Math.floor(self.progress * 5), 4);
              const targetId = DELIVERABLES[cardIndex].id;
              if (targetId !== activeIdRef.current) {
                activeIdRef.current = targetId;
                setActiveId(targetId);
              }
              setScrollProgress(self.progress);
            },
          });
          scrollTriggerRef.current = st;
        });

        // Mobile: Lighter pin distance for touch scrolling
        mm.add('(max-width: 640px)', () => {
          const st = ScrollTrigger.create({
            trigger: pipelineWrapperRef.current,
            start: 'top 10%',
            end: '+=180%',
            pin: pipelineStickyRef.current,
            scrub: 0.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              const cardIndex = Math.min(Math.floor(self.progress * 5), 4);
              const targetId = DELIVERABLES[cardIndex].id;
              if (targetId !== activeIdRef.current) {
                activeIdRef.current = targetId;
                setActiveId(targetId);
              }
              setScrollProgress(self.progress);
            },
          });
          scrollTriggerRef.current = st;
        });
      }

      // 3. Smooth Parallax of PC Illustration rising from bottom
      if (pcRef.current && sectionRef.current) {
        gsap.fromTo(
          pcRef.current,
          { yPercent: 30, scale: 0.95, opacity: 0.5 },
          {
            yPercent: 0,
            scale: 1,
            opacity: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 15%',
              scrub: 0.5,
            },
          }
        );
      }

      // 4. Bottom frosted band reveal
      if (bottomBandRef.current) {
        gsap.from(bottomBandRef.current, {
          y: 20,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle direct card click: activates card and syncs scroll position
  const handleCardClick = (id: number) => {
    activeIdRef.current = id;
    setActiveId(id);

    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetProgress = (id - 1) / 4;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleNextStep = () => {
    const nextId = activeId >= 5 ? 1 : activeId + 1;
    handleCardClick(nextId);
  };

  const activeDeliverable =
    DELIVERABLES.find((d) => d.id === activeId) || DELIVERABLES[0];
  const ActiveIcon = activeDeliverable.icon;

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full min-h-screen pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden bg-[#FFF4E8] text-[#101014] flex flex-col justify-between items-center select-none"
    >
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-[#FF701A]/6 blur-[160px] rounded-full pointer-events-none" />

      {/* PC Illustration Rising from Bottom in Smooth Parallax */}
      <div className="absolute z-[2] left-1/2 -translate-x-1/2 bottom-0 w-[min(460px,85vw)] pointer-events-none">
        <img
          ref={pcRef}
          src={imageSrc}
          alt="Estação de trabalho do Head de Conteúdo"
          className="w-full h-auto block origin-bottom object-contain drop-shadow-[0_24px_50px_rgba(16,16,20,0.18)]"
          loading="lazy"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center">
        {/* ========================================================
            1. HEADER (TITLE & SUBTITLE)
        ======================================================== */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <h2 className="font-montserrat font-black text-3xl sm:text-5xl md:text-[54px] text-[#101014] uppercase tracking-tight leading-[1.05] mb-5">
            Tudo conectado,
            <br />
            <span className="text-[#FF701A]">da estratégia ao próximo conteúdo.</span>
          </h2>

          <p className="font-inter text-sm sm:text-base md:text-lg text-[#5A5A66] leading-relaxed max-w-2xl">
            Uma operação que combina pensamento estratégico, direção criativa e execução.
          </p>
        </div>

        {/* ========================================================
            SCROLL-DRIVEN DELIVERABLES PIPELINE (COMPACT & VIEWPORT-SAFE)
        ======================================================== */}
        <div
          ref={pipelineWrapperRef}
          className="relative w-full max-w-4xl my-2"
        >
          <div
            ref={pipelineStickyRef}
            className="w-full flex flex-col items-center"
          >
            {/* Guided Scroll Indicator & Continuous Progress Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-3 gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF701A] animate-pulse" />
                <span className="font-montserrat font-bold text-xs sm:text-sm uppercase tracking-wider text-[#101014]">
                  As 5 Entregas da Operação
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-inter text-xs font-semibold text-[#FF701A] uppercase tracking-wider bg-[#FF701A]/10 px-3 py-1 rounded-full">
                  Rolagem guiada · Entrega {activeDeliverable.number} de 05
                </span>
                <span className="font-inter text-xs text-[#5A5A66] hidden sm:inline">
                  (Role para alternar entregas)
                </span>
              </div>
            </div>

            {/* Continuous Progress Bar */}
            <div className="w-full h-1 bg-[#101014]/10 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF701A] to-[#FFD52A] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>

            {/* Stepper Navigation Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5 w-full">
              {DELIVERABLES.map((deliv, idx) => {
                const isActive = activeId === deliv.id;
                const isPassed = activeId > deliv.id;

                return (
                  <button
                    key={deliv.id}
                    onClick={() => handleCardClick(deliv.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#101014] text-white shadow-lg scale-105 ring-2 ring-[#FF701A]/40'
                        : isPassed
                        ? 'bg-white/90 text-[#101014] border border-[#FF701A]/30 shadow-sm'
                        : 'bg-white/70 text-[#5A5A66] hover:bg-white hover:text-[#101014] border border-[#101014]/8'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-black ${
                        isActive ? 'text-[#FF701A]' : isPassed ? 'text-[#FF701A]' : 'opacity-50'
                      }`}
                    >
                      {deliv.number}
                    </span>
                    <span>{deliv.shortLabel}</span>
                    {idx < DELIVERABLES.length - 1 && (
                      <span className="text-[#101014]/30 font-normal ml-1 hidden sm:inline">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Deliverable Highlight Card (Combined & Compact) */}
            <div className="w-full rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#FF701A]/35 p-6 sm:p-8 shadow-[0_18px_45px_rgba(255,112,26,0.12)]">
              <div
                key={activeId}
                className="animate-step-swap flex flex-col justify-between"
              >
                {/* Card Top: Number, Title, Category & Highlight Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#101014]/8 mb-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-[#FF701A] text-white font-montserrat font-black text-sm flex items-center justify-center shadow-md shrink-0">
                      {activeDeliverable.number}
                    </span>
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-[#FF701A] uppercase tracking-[0.16em]">
                        {activeDeliverable.category}
                      </div>
                      <h4 className="font-montserrat font-black text-lg sm:text-2xl text-[#101014] uppercase tracking-tight">
                        {activeDeliverable.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF701A]/10 text-[#FF701A] text-xs font-bold border border-[#FF701A]/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{activeDeliverable.highlight}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101014]/5 text-[#101014]/80 text-xs font-medium border border-[#101014]/8">
                      <ActiveIcon className="w-3.5 h-3.5 text-[#FF701A]" />
                      <span>Entrega {activeDeliverable.id} de 5</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-inter text-sm sm:text-base text-[#5A5A66] leading-relaxed mb-4">
                  {activeDeliverable.description}
                </p>

                {/* What's Included / Scope Outputs */}
                <div className="pt-3 border-t border-[#101014]/8">
                  <div className="text-[11px] font-bold text-[#101014]/70 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF701A]" />
                    <span>O que está incluso nesta entrega:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeDeliverable.outputs.map((out, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#101014]/6 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#FF701A]/15 text-[#FF701A] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.8]" />
                        </div>
                        <span className="font-inter text-xs sm:text-[13px] text-[#101014]/85 leading-snug font-medium">
                          {out}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Dots & Next Step CTA */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#101014]/6">
                  <div className="flex items-center gap-2">
                    {DELIVERABLES.map((deliv) => (
                      <button
                        key={deliv.id}
                        onClick={() => handleCardClick(deliv.id)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeId === deliv.id
                            ? 'w-8 bg-[#FF701A]'
                            : activeId > deliv.id
                            ? 'w-3 bg-[#FF701A]/60'
                            : 'w-2 bg-[#101014]/15 hover:bg-[#101014]/30'
                        }`}
                        aria-label={`Ir para entrega ${deliv.number}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 font-inter text-xs font-bold text-[#101014] hover:text-[#FF701A] uppercase tracking-wider transition-colors cursor-pointer group"
                  >
                    <span>
                      {activeId === DELIVERABLES.length ? 'Reiniciar ciclo' : 'Próxima entrega'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. CLOSING MANIFESTO BAND (FROSTED GLASS CAPSULE)
        ======================================================== */}
        <div
          ref={bottomBandRef}
          className="relative z-[5] w-full max-w-4xl mx-auto px-4 mt-8 flex justify-center items-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center justify-center px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-xl border border-[#101014]/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-[#101014] font-inter text-[11px] sm:text-[13px] font-bold tracking-[0.08em] sm:tracking-[0.14em] uppercase text-center leading-relaxed gap-1.5 sm:gap-4">
            <span>Uma direção estratégica</span>
            <span className="hidden sm:inline text-[#FF701A]">·</span>
            <span>Um processo organizado</span>
            <span className="hidden sm:inline text-[#FF701A]">·</span>
            <span className="text-[#FF701A] sm:text-[#101014]">Conteúdos que fazem sentido juntos</span>
          </div>
        </div>
      </div>
    </section>
  );
}