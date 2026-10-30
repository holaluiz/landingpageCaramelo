import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProblemSectionProps {
  id?: string;
  imageSrc?: string;
}

const SCENARIOS = [
  {
    id: 1,
    number: '01',
    title: 'Conteúdo sem narrativa.',
    description:
      'As publicações acontecem, mas não constroem uma percepção consistente da sua marca.',
    symptom: 'Falta de fio condutor editorial',
  },
  {
    id: 2,
    number: '02',
    title: 'Tudo depende de você.',
    description:
      'Da escolha das pautas à aprovação das peças, cada decisão disputa espaço com as prioridades do negócio.',
    symptom: 'Sobrecarga de decisões diárias',
  },
  {
    id: 3,
    number: '03',
    title: 'Sua comunicação não reflete sua entrega.',
    description:
      'O valor do que você oferece é maior do que aquilo que seu conteúdo consegue demonstrar.',
    symptom: 'Gap entre excelência e percepção',
  },
];

export default function ProblemSection({
  id = 'stats',
  imageSrc = '/calendario.png',
}: ProblemSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const calendarRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bottomBandRef = useRef<HTMLDivElement>(null);

  // Interactive selection state for visceral persona identification ("MEU DEUS, SOU EU")
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([1, 2]);

  const toggleScenario = (scenarioId: number) => {
    setSelectedScenarios((prev) =>
      prev.includes(scenarioId)
        ? prev.filter((item) => item !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header entrance animation (smooth lift, always visible)
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

      // 2. Scenario cards staggered entrance (visible by default, never blank)
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 28,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // 3. Parallax rise of the calendar illustration
      if (calendarRef.current && sectionRef.current) {
        gsap.fromTo(
          calendarRef.current,
          { yPercent: 45, scale: 0.92, opacity: 0.8 },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
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

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 sm:py-32 overflow-hidden bg-[#FFF4E8] text-[#101014] flex flex-col justify-between items-center select-none"
    >
      {/* Background Subtle Gradient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF701A]/6 blur-[150px] rounded-full pointer-events-none" />

      {/* Parallax Calendar Illustration rising from bottom */}
      <div className="absolute z-[2] left-1/2 -translate-x-1/2 bottom-0 w-[min(480px,85vw)] pointer-events-none opacity-40 sm:opacity-50">
        <img
          ref={calendarRef}
          src={imageSrc}
          alt="Calendário de conteúdo"
          className="w-full h-auto block origin-bottom object-contain drop-shadow-[0_24px_45px_rgba(16,16,20,0.14)]"
          loading="lazy"
        />
      </div>

      {/* Main Section Content Wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center">
        {/* 1. Header (Titles & Subtext) */}
        <div ref={headerRef} className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-montserrat font-black text-3xl sm:text-5xl md:text-[56px] text-[#101014] uppercase tracking-tight leading-[1.04] mb-5">
            Publicar não é o mesmo
            <br />
            <span className="text-[#FF701A]">que construir uma marca.</span>
          </h2>

          <p className="font-inter text-sm sm:text-base md:text-lg text-[#5A5A66] leading-relaxed max-w-2xl">
            Você tem uma oferta valiosa, produz conteúdo e mantém o perfil ativo. Mas suas publicações parecem desconectadas e as decisões continuam com você.
          </p>
        </div>

        {/* 2. Interactive Scenarios Header (Provocation) */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF701A] animate-ping" />
            <h3 className="font-montserrat font-bold text-sm sm:text-base uppercase tracking-wider text-[#101014]">
              Você reconhece algum desses cenários?
            </h3>
          </div>
          <span className="font-caveat text-base sm:text-lg text-[#FF701A] font-semibold">
            Clique no card para marcar os que você vive ↗
          </span>
        </div>

        {/* 3. The 3 Interactive Animated Scenarios Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-4xl mb-12"
        >
          {SCENARIOS.map((item) => {
            const isSelected = selectedScenarios.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleScenario(item.id)}
                className={`relative group rounded-3xl p-6 sm:p-7 cursor-pointer transition-[border-color,box-shadow,background-color] duration-300 backdrop-blur-xl border select-none ${
                  isSelected
                    ? 'bg-white/95 border-[#FF701A] shadow-[0_18px_40px_rgba(255,112,26,0.18)] -translate-y-1.5'
                    : 'bg-white/70 border-[#101014]/10 hover:border-[#FF701A]/50 hover:bg-white/85 shadow-[0_8px_24px_rgba(16,16,20,0.05)] hover:-translate-y-1'
                }`}
              >
                {/* Top Badge: Number + Selection Indicator */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-montserrat font-black text-xs transition-colors duration-200 ${
                      isSelected
                        ? 'bg-[#FF701A] text-white shadow-md'
                        : 'bg-[#101014]/6 text-[#101014]/70 group-hover:bg-[#FF701A]/10 group-hover:text-[#FF701A]'
                    }`}
                  >
                    {item.number}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF701A] uppercase tracking-wider bg-[#FF701A]/10 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Identificado</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#5A5A66]/60 group-hover:text-[#5A5A66] transition-colors">
                        Toque p/ marcar
                      </span>
                    )}
                  </div>
                </div>

                {/* Scenario Title */}
                <h4 className="font-montserrat font-bold text-lg sm:text-[19px] text-[#101014] leading-snug mb-3 tracking-tight">
                  {item.title}
                </h4>

                {/* Scenario Description */}
                <p className="font-inter text-xs sm:text-[13.5px] text-[#5A5A66] leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom Pill Tag */}
                <div className="mt-5 pt-4 border-t border-[#101014]/6 flex items-center gap-1.5 text-[11px] font-medium text-[#101014]/50">
                  <AlertCircle className="w-3.5 h-3.5 text-[#FF701A]/70" />
                  <span className="truncate">{item.symptom}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Bottom Frosted Band (Key Takeaway) */}
        <div ref={bottomBandRef} className="relative z-[5] w-full max-w-4xl mx-auto px-4 flex justify-center items-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-xl border border-[#101014]/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-[#101014] font-inter text-[11px] sm:text-[13px] font-bold tracking-[0.08em] sm:tracking-[0.14em] uppercase text-center leading-relaxed gap-1.5 sm:gap-3">
            <span>O problema nem sempre é publicar pouco</span>
            <span className="hidden sm:inline text-[#FF701A]">·</span>
            <span>É publicar sem uma direção que conecte</span>
            <span className="hidden sm:inline text-[#FF701A]">·</span>
            <span className="text-[#FF701A] sm:text-[#101014]">Cada conteúdo a um objetivo maior</span>
          </div>
        </div>
      </div>
    </section>
  );
}
