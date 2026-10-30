import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SolutionSectionProps {
  id?: string;
}

const METHODOLOGY_STEPS = [
  {
    step: '01',
    label: 'Entender',
    tagline: 'Imersão no seu modelo',
    description:
      'Compreendo sua oferta, seu público, seus objetivos e os desafios atuais da comunicação. Sem fórmulas prontas: diagnóstico da causa raiz.',
  },
  {
    step: '02',
    label: 'Direcionar',
    tagline: 'Estratégia & Posicionamento',
    description:
      'Estruturo o posicionamento editorial, as narrativas-chave, os pilares de conteúdo e o planejamento para que cada peça tenha um papel claro.',
  },
  {
    step: '03',
    label: 'Criar',
    tagline: 'Direção Criativa & Copy',
    description:
      'Conduzo a criação de roteiros de alto impacto, engenharia de retenção em vídeo, carrosséis estratégicos e copy que valoriza a sua entrega.',
  },
  {
    step: '04',
    label: 'Publicar',
    tagline: 'Operação Sem Sobrecarga',
    description:
      'Organizo o fluxo de aprovações prévias e coordeno as postagens previstas no escopo combinado, liberando o seu tempo para gerir o negócio.',
  },
  {
    step: '05',
    label: 'Evoluir',
    tagline: 'Análise & Otimização',
    description:
      'Acompanho métricas de aquisição e retenção, avalio o desempenho e aprimoro continuamente os próximos ciclos editoriais.',
  },
];

export default function SolutionSection({ id = 'wild' }: SolutionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const wordRowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Scroll-driven pipeline refs
  const pipelineWrapperRef = useRef<HTMLDivElement>(null);
  const pipelineStickyRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeStepRef = useRef(0);

  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Video visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // GSAP Entrance Animations & Scroll-Driven Stepper Pin
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade up
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // 2. HEAD Pill dynamic expansion on scroll
      if (pillRef.current && wordRowRef.current) {
        gsap.fromTo(
          pillRef.current,
          { width: '70px', scale: 0.9 },
          {
            width: 'clamp(180px, 28vw, 380px)',
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wordRowRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 0.6,
            },
          }
        );
      }

      // 3. Quote Callout reveal
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // 4. Scroll-Driven 5-Step Pipeline (Pins and advances steps as user scrolls)
      if (pipelineWrapperRef.current && pipelineStickyRef.current) {
        const mm = gsap.matchMedia();

        // Desktop / Tablet: Pinned scroll scrub through all 5 steps
        mm.add('(min-width: 641px)', () => {
          const st = ScrollTrigger.create({
            trigger: pipelineWrapperRef.current,
            start: 'top 12%',
            end: '+=240%',
            pin: pipelineStickyRef.current,
            scrub: 0.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Map progress 0.0 -> 1.0 into 5 distinct steps (0 to 4)
              const step = Math.min(Math.floor(self.progress * 5), 4);
              if (step !== activeStepRef.current) {
                activeStepRef.current = step;
                setActiveStep(step);
              }
              setScrollProgress(self.progress);
            },
          });
          scrollTriggerRef.current = st;
        });

        // Mobile: Lighter pin distance for seamless touch scroll
        mm.add('(max-width: 640px)', () => {
          const st = ScrollTrigger.create({
            trigger: pipelineWrapperRef.current,
            start: 'top 10%',
            end: '+=160%',
            pin: pipelineStickyRef.current,
            scrub: 0.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              const step = Math.min(Math.floor(self.progress * 5), 4);
              if (step !== activeStepRef.current) {
                activeStepRef.current = step;
                setActiveStep(step);
              }
              setScrollProgress(self.progress);
            },
          });
          scrollTriggerRef.current = st;
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle direct pill click: smoothly transitions step and syncs scroll
  const handleStepClick = (targetIdx: number) => {
    activeStepRef.current = targetIdx;
    setActiveStep(targetIdx);

    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetProgress = targetIdx / 4;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleNextStep = () => {
    const nextIdx = (activeStep + 1) % METHODOLOGY_STEPS.length;
    handleStepClick(nextIdx);
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 sm:py-32 overflow-hidden bg-[#FFF4E8] text-[#101014] flex flex-col items-center justify-between select-none"
    >
      {/* Background Flowing S-Curves SVG Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <path d="M-100,820 C250,700 800,380 1540,80" stroke="#ffffff" strokeWidth="2.5" opacity="0.65" fill="none" />
          <path d="M-50,860 C300,740 850,340 1500,40" stroke="#ffffff" strokeWidth="3.2" opacity="0.75" fill="none" />
          <path d="M0,910 C360,790 900,290 1550,-10" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" fill="none" />
          <path d="M-80,840 C280,710 820,370 1520,70" stroke="#ffffff" strokeWidth="3.8" opacity="0.8" fill="none" />
          <path d="M-120,800 C240,670 780,410 1560,110" stroke="#ffffff" strokeWidth="2.8" opacity="0.85" fill="none" />
          <path d="M10,930 C370,810 910,270 1620,-20" stroke="#ffffff" strokeWidth="3.4" opacity="0.72" fill="none" />
          <path d="M-40,880 C320,760 860,320 1540,20" stroke="#ffffff" strokeWidth="2.7" opacity="0.82" fill="none" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center">
        {/* ========================================================
            1. HEADER (TITLE & BODY)
        ======================================================== */}
        <div ref={headerRef} className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-montserrat font-black text-3xl sm:text-5xl md:text-[56px] text-[#101014] uppercase tracking-tight leading-[1.04] mb-6">
            Uma direção para o conteúdo.
            <br />
            <span className="text-[#FF701A]">Uma operação para fazer acontecer.</span>
          </h2>

          <div className="space-y-3 font-inter text-sm sm:text-base md:text-[17px] text-[#5A5A66] leading-relaxed max-w-2xl">
            <p>
              Como <strong className="text-[#101014] font-semibold">Head de Conteúdo</strong>, conecto posicionamento, planejamento, direção criativa, produção e acompanhamento em uma única operação editorial.
            </p>
            <p className="text-[#101014]/90 font-medium">
              Você participa das decisões essenciais. Eu conduzo o processo, da estratégia à publicação, dentro do escopo combinado.
            </p>
          </div>
        </div>

        {/* ========================================================
            2. THE ICONIC "HE [video pill] AD" CENTERPIECE
        ======================================================== */}
        <div
          ref={wordRowRef}
          className="flex items-center justify-center font-montserrat font-black uppercase text-[#101014] my-4 sm:my-8 select-none"
        >
          <span className="text-[clamp(52px,9vw,110px)] tracking-[-0.03em] leading-none">
            HE
          </span>

          {/* Dynamic Video Stadium Pill */}
          <div
            ref={pillRef}
            className="relative h-[clamp(56px,10vw,126px)] rounded-full overflow-hidden bg-[#101014] mx-2 sm:mx-4 flex items-center justify-center shadow-[0_20px_50px_rgba(16,16,20,0.22)] border-2 border-white/70 group"
          >
            <video
              ref={videoRef}
              src="/terceira-secao.mp4"
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center pointer-events-none"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <span className="text-[clamp(52px,9vw,110px)] tracking-[-0.03em] leading-none">
            AD
          </span>
        </div>

        {/* ========================================================
            3. KEY PRINCIPLE CALLOUT QUOTE
        ======================================================== */}
        <div ref={quoteRef} className="w-full max-w-3xl mx-auto my-8 sm:my-10">
          <div className="relative rounded-3xl sm:rounded-full bg-white/80 backdrop-blur-xl border border-[#101014]/10 p-6 sm:px-10 sm:py-5 text-center shadow-[0_8px_30px_rgba(16,16,20,0.06)]">
            <p className="font-montserrat font-bold text-base sm:text-lg text-[#101014] leading-relaxed">
              O objetivo não é apenas manter seu perfil ativo.{' '}
              <span className="text-[#FF701A] block sm:inline font-extrabold">
                É fazer cada conteúdo contribuir para a construção da sua marca.
              </span>
            </p>
          </div>
        </div>

        {/* ========================================================
            4. SCROLL-DRIVEN 5-STEP METHODOLOGY PIPELINE
            Entender → Direcionar → Criar → Publicar → Evoluir
        ======================================================== */}
        <div
          ref={pipelineWrapperRef}
          className="relative w-full max-w-5xl mt-8 sm:mt-12"
        >
          <div
            ref={pipelineStickyRef}
            className="w-full flex flex-col items-center"
          >
            {/* Stepper Eyebrow & Guided Scroll Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-5 gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF701A] animate-pulse" />
                <span className="font-montserrat font-bold text-xs sm:text-sm uppercase tracking-wider text-[#101014]">
                  O Ciclo Operacional da Direção
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-inter text-xs font-semibold text-[#FF701A] uppercase tracking-wider bg-[#FF701A]/10 px-3 py-1 rounded-full">
                  Rolagem guiada · Etapa {activeStep + 1} de 5
                </span>
                <span className="font-inter text-xs text-[#5A5A66] hidden sm:inline">
                  (Role para avançar)
                </span>
              </div>
            </div>

            {/* Stepper Continuous Scroll Progress Bar */}
            <div className="w-full h-1 bg-[#101014]/10 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF701A] to-[#FFB800] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>

            {/* Stepper Navigation Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 w-full">
              {METHODOLOGY_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={step.step}
                    onClick={() => handleStepClick(idx)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
                      {step.step}
                    </span>
                    <span>{step.label}</span>
                    {idx < METHODOLOGY_STEPS.length - 1 && (
                      <span className="text-[#101014]/30 font-normal ml-1 hidden sm:inline">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Step Highlight Card (Animated Step Swap) */}
            <div className="w-full rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#101014]/10 p-7 sm:p-9 shadow-[0_16px_45px_rgba(16,16,20,0.08)]">
              <div
                key={activeStep}
                className="animate-step-swap flex flex-col justify-between"
              >
                {/* Card Top: Number, Label, Tagline & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#101014]/8 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#FF701A] text-white font-montserrat font-black text-sm flex items-center justify-center shadow-md">
                      {METHODOLOGY_STEPS[activeStep].step}
                    </span>
                    <div>
                      <h4 className="font-montserrat font-black text-xl sm:text-2xl text-[#101014] uppercase tracking-tight">
                        {METHODOLOGY_STEPS[activeStep].label}
                      </h4>
                      <span className="font-inter text-xs font-semibold text-[#FF701A] tracking-wider uppercase">
                        {METHODOLOGY_STEPS[activeStep].tagline}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#101014]/5 text-[#101014]/80 text-xs font-medium self-start sm:self-auto border border-[#101014]/8">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF701A]" />
                    <span>Etapa {activeStep + 1} de 5</span>
                  </div>
                </div>

                {/* Card Description */}
                <p className="font-inter text-sm sm:text-base md:text-lg text-[#5A5A66] leading-relaxed max-w-3xl min-h-[56px]">
                  {METHODOLOGY_STEPS[activeStep].description}
                </p>

                {/* Step Progress Dots & Next Step CTA */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#101014]/6">
                  <div className="flex items-center gap-2">
                    {METHODOLOGY_STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleStepClick(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeStep === i
                            ? 'w-8 bg-[#FF701A]'
                            : activeStep > i
                            ? 'w-3 bg-[#FF701A]/60'
                            : 'w-2 bg-[#101014]/15 hover:bg-[#101014]/30'
                        }`}
                        aria-label={`Ir para etapa ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 font-inter text-xs font-bold text-[#101014] hover:text-[#FF701A] uppercase tracking-wider transition-colors cursor-pointer group"
                  >
                    <span>
                      {activeStep === METHODOLOGY_STEPS.length - 1 ? 'Reiniciar ciclo' : 'Próxima etapa'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
