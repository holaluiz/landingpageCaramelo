import { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users, Eye } from 'lucide-react';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarousel?: number;
}

const carousels = [
  {
    id: 1,
    title: 'A anatomia do medo criativo',
    tag: 'Segunda — Identificação · Storytelling Confessional',
    src: '/portfolio/carrossel (1).png',
    slides: [
      '/portfolio/carrossel-slides/c1/slide-1.png',
      '/portfolio/carrossel-slides/c1/slide-2.png',
      '/portfolio/carrossel-slides/c1/slide-3.png',
      '/portfolio/carrossel-slides/c1/slide-4.png',
      '/portfolio/carrossel-slides/c1/slide-5.png',
      '/portfolio/carrossel-slides/c1/slide-6.png',
    ],
    caption: 'Narrativa sobre a síndrome do impostor, contradições e a tensão entre criar e publicar.',
  },
  {
    id: 2,
    title: 'O método invisível da direção',
    tag: 'Quarta — Autoridade · Experimentação & IA',
    src: '/portfolio/carrossel (2).png',
    slides: [
      '/portfolio/carrossel-slides/c2/slide-1.png',
      '/portfolio/carrossel-slides/c2/slide-2.png',
      '/portfolio/carrossel-slides/c2/slide-3.png',
      '/portfolio/carrossel-slides/c2/slide-4.png',
      '/portfolio/carrossel-slides/c2/slide-5.png',
      '/portfolio/carrossel-slides/c2/slide-6.png',
      '/portfolio/carrossel-slides/c2/slide-7.png',
    ],
    caption: 'Desdobramento técnico de direção de arte, inteligência artificial e prompt engineering.',
  },
  {
    id: 3,
    title: 'Arquitetura de conteúdo autoral',
    tag: 'Quarta — Autoridade · Processos & Métricas',
    src: '/portfolio/carrossel (3).png',
    slides: [
      '/portfolio/carrossel-slides/c3/slide-1.png',
      '/portfolio/carrossel-slides/c3/slide-2.png',
      '/portfolio/carrossel-slides/c3/slide-3.png',
      '/portfolio/carrossel-slides/c3/slide-4.png',
      '/portfolio/carrossel-slides/c3/slide-5.png',
      '/portfolio/carrossel-slides/c3/slide-6.png',
      '/portfolio/carrossel-slides/c3/slide-7.png',
    ],
    caption: 'Estruturação do método HEAD e pipeline de retenção tela a tela.',
  },
  {
    id: 4,
    title: 'Cultura do meme & ironia fina',
    tag: 'Sexta — Descompressão · Humor Ácido',
    src: '/portfolio/carrossel (4).png',
    slides: [
      '/portfolio/carrossel-slides/c4/slide-1.png',
      '/portfolio/carrossel-slides/c4/slide-2.png',
      '/portfolio/carrossel-slides/c4/slide-3.png',
      '/portfolio/carrossel-slides/c4/slide-4.png',
      '/portfolio/carrossel-slides/c4/slide-5.png',
      '/portfolio/carrossel-slides/c4/slide-6.png',
    ],
    caption: 'Tiras e ilustrações autorais sobre o cotidiano de quem vive de criatividade.',
  },
  {
    id: 5,
    title: 'Manual de sobrevivência do designer',
    tag: 'Sexta — Descompressão · Ilustração Autoral',
    src: '/portfolio/carrossel (5).png',
    slides: [
      '/portfolio/carrossel-slides/c5/slide-1.png',
      '/portfolio/carrossel-slides/c5/slide-2.png',
      '/portfolio/carrossel-slides/c5/slide-3.png',
      '/portfolio/carrossel-slides/c5/slide-4.png',
      '/portfolio/carrossel-slides/c5/slide-5.png',
      '/portfolio/carrossel-slides/c5/slide-6.png',
      '/portfolio/carrossel-slides/c5/slide-7.png',
    ],
    caption: 'Observações de mercado com humor afiado gerando picos de salvamento e compartilhamento.',
  },
];

const resultsPrints = [
  {
    id: 1,
    title: 'Engajamento & Compartilhamentos',
    metric: '+340%',
    metricLabel: 'Aumento em compartilhamentos qualificados',
    src: '/portfolio/resultados (1).jpeg',
  },
  {
    id: 2,
    title: 'Retenção & Salvamentos',
    metric: '4.8x',
    metricLabel: 'Mais salvamentos por carrossel',
    src: '/portfolio/resultados (2).jpeg',
  },
  {
    id: 3,
    title: 'Crescimento Orgânico de Comunidade',
    metric: '92%',
    metricLabel: 'Público composto por tomadores de decisão',
    src: '/portfolio/resultados (3).jpeg',
  },
];

export default function CaseStudyModal({
  isOpen,
  onClose,
  initialCarousel = 0,
}: CaseStudyModalProps) {
  const [activeCarousel, setActiveCarousel] = useState(initialCarousel);
  const [viewMode, setViewMode] = useState<'slides' | 'panoramic'>('slides');
  const carouselScrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync initialCarousel when modal opens and scroll modal to top
  useEffect(() => {
    if (isOpen) {
      setActiveCarousel(initialCarousel);
      if (overlayRef.current) {
        overlayRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, initialCarousel]);

  // Handle ESC, pause Lenis smooth scroll, and lock background
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Temporarily pause Lenis so modal scrolls natively without interference
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    };
  }, [isOpen, onClose]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselScrollRef.current) {
      const shift = 600;
      carouselScrollRef.current.scrollBy({
        left: direction === 'left' ? -shift : shift,
        behavior: 'smooth',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      data-lenis-prevent="true"
      tabIndex={-1}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#101014]/90 backdrop-blur-2xl animate-fade-in flex justify-center items-start p-0 sm:p-6 lg:p-8 cursor-default"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Floating Close Button in Top Right for instant accessibility */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#101014]/90 hover:bg-[#FF701A] text-white flex items-center justify-center shadow-2xl border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
        aria-label="Fechar case (ESC)"
        title="Fechar case (ESC)"
      >
        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
      </button>

      {/* Modal Container */}
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-6xl bg-[#FFF4E8] text-[#101014] rounded-none sm:rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/20 flex flex-col shrink-0 my-0 sm:my-3 mb-16 overflow-visible"
      >
        {/* ========================================================
            MODAL HEADER (STICKY)
        ======================================================== */}
        <header className="sticky top-0 z-40 bg-[#FFF4E8]/95 backdrop-blur-md border-b border-[#101014]/10 px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-between rounded-none sm:rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <span className="font-montserrat font-black text-xs sm:text-sm text-[#FF701A] uppercase tracking-[0.16em] bg-[#FF701A]/10 px-3.5 py-1.5 rounded-full border border-[#FF701A]/20">
              CASE 01 · PROJETO AUTORAL
            </span>
            <span className="hidden sm:inline text-xs font-inter font-medium text-[#5A5A66]">
              Head de Conteúdo e Direção Criativa
            </span>
          </div>

          <button
            onClick={onClose}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#101014] text-white hover:bg-[#FF701A] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
            aria-label="Fechar case"
          >
            <span>Fechar</span>
            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          </button>
        </header>

        {/* ========================================================
            CASE HERO BANNER
        ======================================================== */}
        <div className="px-6 sm:px-12 pt-12 pb-8 border-b border-[#101014]/10 bg-gradient-to-b from-[#FFF4E8] to-[#F8EFE4]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF701A] tracking-[0.2em] uppercase font-inter mb-3">
            <Sparkles className="w-4 h-4" />
            <span>ESTRATÉGIA DE CONTEÚDO · BRANDING · COMUNIDADE</span>
          </div>

          <h1 className="font-montserrat font-black text-4xl sm:text-6xl lg:text-7xl uppercase text-[#101014] leading-[0.95] tracking-tight max-w-4xl">
            Um Cara Caramelo®
          </h1>

          <p className="font-inter text-base sm:text-xl text-[#5A5A66] max-w-3xl leading-relaxed mt-5">
            Desenvolvimento de uma estratégia editorial completa para transformar uma marca pessoal multidisciplinar em um ecossistema de conteúdo, relacionamento autoral e oportunidades comerciais escaláveis.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="font-inter text-xs font-semibold uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-[#101014]/10 text-[#101014]">
              ✦ Estratégia Editorial
            </span>
            <span className="font-inter text-xs font-semibold uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-[#101014]/10 text-[#101014]">
              ✦ Arquitetura de Narrativas
            </span>
            <span className="font-inter text-xs font-semibold uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-[#101014]/10 text-[#101014]">
              ✦ Direção Criativa
            </span>
            <span className="font-inter text-xs font-semibold uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-[#101014]/10 text-[#101014]">
              ✦ Método HEAD
            </span>
          </div>
        </div>

        {/* ========================================================
            CORPO DO CASE (6 CAPÍTULOS ESTRUTURADOS)
        ======================================================== */}
        <div className="p-6 sm:p-12 space-y-20">

          {/* ----------------------------------------------------
              01 / O DESAFIO
          ---------------------------------------------------- */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.18em] uppercase">
                01 / O DESAFIO
              </span>
              <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-[#101014] uppercase leading-tight mt-2">
                Como transformar múltiplos interesses em uma marca com narrativa única?
              </h2>
            </div>
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[24px] border border-[#101014]/10 shadow-sm space-y-4">
              <p className="font-inter text-base text-[#5A5A66] leading-relaxed">
                O <strong>Um Cara Caramelo</strong> nasceu da interseção entre criatividade, inteligência artificial, design e tecnologia. O desafio era conectar esses universos em um posicionamento reconhecível, sem perder a espontaneidade e a personalidade autoral da marca.
              </p>
              <p className="font-inter text-base text-[#5A5A66] leading-relaxed">
                Era necessário ir muito além de compartilhar tutoriais e ferramentas soltas: construir uma presença autoral capaz de atrair profissionais criativos, desenvolver uma audiência qualificada e estabelecer conexões com serviços, produtos educacionais e comunidade.
              </p>
              <div className="bg-[#FFF4E8] p-5 rounded-[18px] border-l-4 border-[#FF701A] mt-4">
                <span className="text-xs font-bold text-[#FF701A] uppercase tracking-wider font-inter block mb-1">
                  O Objetivo Central
                </span>
                <p className="font-inter font-semibold text-[#101014] text-sm sm:text-base leading-snug">
                  Transformar uma multiplicidade de interesses em uma narrativa consistente, capaz de gerar identificação imediata, autoridade técnica e oportunidades comerciais.
                </p>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              02 / O INSIGHT ESTRATÉGICO
          ---------------------------------------------------- */}
          <section className="bg-[#101014] text-[#FFF4E8] p-8 sm:p-12 rounded-[28px] shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-[#FFB800] font-inter text-xs font-bold tracking-[0.2em] uppercase">
                02 / O INSIGHT ESTRATÉGICO
              </span>
              <h3 className="font-montserrat font-black text-3xl sm:text-4xl lg:text-5xl uppercase leading-[1.05] mt-3 text-white">
                "Falar como a persona pensa, não como uma marca tentando vender."
              </h3>
              <p className="font-inter text-base sm:text-lg text-[#FFF4E8]/80 leading-relaxed mt-6">
                O ponto de partida foi compreender que a conexão genuína não nasce apenas daquilo que uma marca ensina, mas também daquilo que seu público reconhece como parte da própria experiência cotidiana.
              </p>
              <p className="font-inter text-sm sm:text-base text-[#FFF4E8]/65 leading-relaxed mt-3">
                Profissionais criativos compartilham inquietações, inseguranças, ambições e contradições que raramente aparecem em conteúdos puramente técnicos. A oportunidade estava em transformar essas experiências em narrativas: a <strong>identificação</strong> como porta de entrada e a <strong>demonstração de competência</strong> como caminho para a confiança.
              </p>
            </div>
            <div className="absolute right-[-40px] bottom-[-40px] text-white/[0.04] font-montserrat font-black text-[220px] select-none pointer-events-none">
              UCC
            </div>
          </section>

          {/* ----------------------------------------------------
              03 / A ESTRATÉGIA: JORNADA EM 5 ETAPAS
          ---------------------------------------------------- */}
          <section className="space-y-6">
            <div>
              <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.18em] uppercase">
                03 / A ESTRATÉGIA
              </span>
              <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-[#101014] uppercase leading-tight mt-1">
                Da identificação à conversão: uma jornada construída por conteúdo.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#5A5A66] max-w-2xl mt-2 leading-relaxed">
                A estratégia foi desenhada para conduzir o relacionamento progressivamente através de cinco estados de consciência e afeto:
              </p>
            </div>

            {/* 5 Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
              {[
                {
                  step: '01',
                  name: 'Identificação',
                  role: 'Reconhecer e verbalizar pensamentos, dores e contradições vividas pelo público criativo.',
                  accent: '#FF701A',
                },
                {
                  step: '02',
                  name: 'Conexão',
                  role: 'Transformar experiências compartilhadas em proximidade, personalidade e senso de pertencimento.',
                  accent: '#FFB800',
                },
                {
                  step: '03',
                  name: 'Aspiração',
                  role: 'Apresentar novas possibilidades através de projetos autorais, descobertas e experimentações com IA.',
                  accent: '#25BFFF',
                },
                {
                  step: '04',
                  name: 'Confiança',
                  role: 'Demonstrar repertório, raciocínio estratégico e capacidade prática de execução em casos reais.',
                  accent: '#FF3D8D',
                },
                {
                  step: '05',
                  name: 'Conversão',
                  role: 'Aproximar a audiência de serviços, mentorias, produtos educacionais e comunidade de forma contextualizada.',
                  accent: '#7657FF',
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-white p-5 rounded-[20px] border border-[#101014]/10 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-montserrat font-black text-lg text-[#101014]">
                        {s.step}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.accent }}
                      />
                    </div>
                    <h4 className="font-montserrat font-black text-base text-[#101014] uppercase mb-2">
                      {s.name}
                    </h4>
                  </div>
                  <p className="font-inter text-xs text-[#5A5A66] leading-relaxed">
                    {s.role}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------
              04 / O SISTEMA DE CONTEÚDO: 3 DIAS, 3 FUNÇÕES
          ---------------------------------------------------- */}
          <section className="space-y-6">
            <div>
              <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.18em] uppercase">
                04 / O SISTEMA DE CONTEÚDO
              </span>
              <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-[#101014] uppercase leading-tight mt-1">
                Três dias. Três funções. Uma mesma estratégia.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#5A5A66] max-w-2xl mt-2 leading-relaxed">
                Para transformar o posicionamento em rotina sustentável, desenhei um calendário editorial semanal onde cada publicação cumpre um papel insubstituível:
              </p>
            </div>

            {/* 3 Days Editorial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Segunda */}
              <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-[#101014]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#FF701A]/10 text-[#FF701A] font-inter text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      SEGUNDA-FEIRA
                    </span>
                    <Users className="w-4 h-4 text-[#FF701A]" />
                  </div>
                  <h3 className="font-montserrat font-black text-xl uppercase text-[#101014]">
                    Identificação
                  </h3>
                  <p className="font-inter text-xs font-semibold text-[#FF701A] uppercase tracking-wider mt-1 mb-3">
                    Storytelling Confessional
                  </p>
                  <p className="font-inter text-sm text-[#5A5A66] leading-relaxed">
                    Carrosséis sobre dores, inseguranças, pensamentos e ambições de profissionais criativos.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#101014]/10">
                  <span className="text-[11px] font-bold text-[#101014] uppercase tracking-wider font-inter block">
                    Função Estratégica:
                  </span>
                  <p className="text-xs text-[#5A5A66] font-inter mt-1 leading-snug">
                    Gerar reconhecimento imediato ("Meu Deus, sou eu!"), estimular compartilhamentos e iniciar conexões emocionais.
                  </p>
                </div>
              </div>

              {/* Quarta */}
              <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-[#101014]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#25BFFF]/10 text-[#0082c9] font-inter text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      QUARTA-FEIRA
                    </span>
                    <TrendingUp className="w-4 h-4 text-[#0082c9]" />
                  </div>
                  <h3 className="font-montserrat font-black text-xl uppercase text-[#101014]">
                    Autoridade
                  </h3>
                  <p className="font-inter text-xs font-semibold text-[#0082c9] uppercase tracking-wider mt-1 mb-3">
                    Experimentação & Educação
                  </p>
                  <p className="font-inter text-sm text-[#5A5A66] leading-relaxed">
                    Conteúdos que apresentam projetos reais, processos de direção criativa, testes com IA e aplicações práticas de design.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#101014]/10">
                  <span className="text-[11px] font-bold text-[#101014] uppercase tracking-wider font-inter block">
                    Função Estratégica:
                  </span>
                  <p className="text-xs text-[#5A5A66] font-inter mt-1 leading-snug">
                    Demonstrar repertório técnico incomparável, estimular aprendizado e consolidar confiança na entrega.
                  </p>
                </div>
              </div>

              {/* Sexta */}
              <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-[#101014]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#FFB800]/15 text-[#b07d00] font-inter text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      SEXTA-FEIRA
                    </span>
                    <Eye className="w-4 h-4 text-[#b07d00]" />
                  </div>
                  <h3 className="font-montserrat font-black text-xl uppercase text-[#101014]">
                    Descompressão
                  </h3>
                  <p className="font-inter text-xs font-semibold text-[#b07d00] uppercase tracking-wider mt-1 mb-3">
                    Humor Ácido & Cultura Criativa
                  </p>
                  <p className="font-inter text-sm text-[#5A5A66] leading-relaxed">
                    Ilustrações autorais e observações bem-humoradas sobre contradições, perrengues e hábitos cotidianos do mercado.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#101014]/10">
                  <span className="text-[11px] font-bold text-[#101014] uppercase tracking-wider font-inter block">
                    Função Estratégica:
                  </span>
                  <p className="text-xs text-[#5A5A66] font-inter mt-1 leading-snug">
                    Fortalecer a personalidade única da marca, quebrar solenidade e incentivar conversas e menções orgânicas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              05 / A EXECUÇÃO CRIATIVA (A MAIOR ÁREA VISUAL)
          ---------------------------------------------------- */}
          <section className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#101014]/12 shadow-md space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.18em] uppercase">
                  05 / A EXECUÇÃO CRIATIVA · PROVAS VISUAIS REAIS
                </span>
                <h2 className="font-montserrat font-black text-3xl sm:text-4xl text-[#101014] uppercase leading-tight mt-1">
                  Transformar intenção estratégica em narrativas visuais.
                </h2>
                <p className="font-inter text-sm sm:text-base text-[#5A5A66] max-w-2xl mt-2 leading-relaxed">
                  Os carrosséis panorâmicos reais construídos a partir do <strong>Método HEAD</strong>. Arraste ou use os botões para percorrer as sequências contínuas de cada publicação:
                </p>
              </div>

              {/* Carousel Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-11 h-11 rounded-full bg-[#FFF4E8] hover:bg-[#FF701A] hover:text-white text-[#101014] flex items-center justify-center border border-[#101014]/10 shadow-sm transition-colors cursor-pointer"
                  aria-label="Rolar para esquerda"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-11 h-11 rounded-full bg-[#FFF4E8] hover:bg-[#FF701A] hover:text-white text-[#101014] flex items-center justify-center border border-[#101014]/10 shadow-sm transition-colors cursor-pointer"
                  aria-label="Rolar para direita"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selector Pills & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#101014]/10">
              {/* Carousel Picker */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {carousels.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCarousel(idx);
                      if (carouselScrollRef.current) carouselScrollRef.current.scrollLeft = 0;
                    }}
                    className={`px-4 py-2 rounded-full font-inter text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      activeCarousel === idx
                        ? 'bg-[#FF701A] text-white shadow-md'
                        : 'bg-[#FFF4E8] text-[#5A5A66] hover:text-[#101014] border border-[#101014]/10'
                    }`}
                  >
                    Carrossel {idx + 1}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher: Slides Separados vs Lâmina Panorâmica */}
              <div className="flex items-center gap-1.5 bg-[#FFF4E8] p-1 rounded-full border border-[#101014]/10 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setViewMode('slides')}
                  className={`px-3 py-1 rounded-full font-inter text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === 'slides'
                      ? 'bg-[#101014] text-white shadow-sm'
                      : 'text-[#5A5A66] hover:text-[#101014]'
                  }`}
                >
                  Slides Separados ({carousels[activeCarousel].slides.length})
                </button>
                <button
                  onClick={() => setViewMode('panoramic')}
                  className={`px-3 py-1 rounded-full font-inter text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === 'panoramic'
                      ? 'bg-[#101014] text-white shadow-sm'
                      : 'text-[#5A5A66] hover:text-[#101014]'
                  }`}
                >
                  Lâmina Contínua
                </button>
              </div>
            </div>

            {/* Active Carousel Showcase */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#FF701A] uppercase tracking-wider font-inter">
                    {carousels[activeCarousel].tag}
                  </span>
                  <h3 className="font-montserrat font-black text-xl sm:text-2xl text-[#101014] uppercase">
                    {carousels[activeCarousel].title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-inter text-[#5A5A66] max-w-md">
                  {carousels[activeCarousel].caption}
                </p>
              </div>

              {/* Carousel Viewer Container */}
              {viewMode === 'slides' ? (
                /* 1. SEPARATED SLIDES VIEWER */
                <div
                  ref={carouselScrollRef}
                  data-lenis-prevent="true"
                  className="relative w-full h-[380px] sm:h-[490px] lg:h-[560px] rounded-[24px] overflow-x-auto overflow-y-hidden bg-[#101014] p-4 sm:p-5 shadow-inner cursor-grab active:cursor-grabbing border border-[#101014]/15 flex items-center gap-4 sm:gap-5"
                >
                  {carousels[activeCarousel].slides.map((slideSrc, sIdx) => (
                    <div
                      key={sIdx}
                      className="relative h-full shrink-0 aspect-[3/4] rounded-[18px] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl group select-none"
                    >
                      <img
                        src={slideSrc}
                        alt={`Slide ${sIdx + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FFB800] tracking-wider border border-white/10">
                        SLIDE {sIdx + 1} DE {carousels[activeCarousel].slides.length}
                      </div>
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-md bg-black/75 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="14" height="14" rx="2" ry="2" />
                          <path d="M7 21h12a2 2 0 0 0 2-2V7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 2. PANORAMIC CONTINUOUS CANVAS VIEWER */
                <div
                  ref={carouselScrollRef}
                  data-lenis-prevent="true"
                  className="relative w-full h-[320px] sm:h-[460px] lg:h-[540px] rounded-[24px] overflow-x-auto overflow-y-hidden bg-[#101014] p-3 shadow-inner cursor-grab active:cursor-grabbing border border-[#101014]/15"
                >
                  <img
                    src={carousels[activeCarousel].src}
                    alt={carousels[activeCarousel].title}
                    className="h-full w-auto max-w-none object-contain rounded-[16px] select-none"
                    draggable={false}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#5A5A66] font-inter pt-1">
                <span>← Arraste horizontalmente ou use as setas para navegar entre os slides →</span>
                <span className="font-semibold text-[#101014]">
                  {viewMode === 'slides' ? `${carousels[activeCarousel].slides.length} slides individuais em alta resolução` : 'Sequência contínua original'}
                </span>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              06 / RESULTADOS E APRENDIZADOS
          ---------------------------------------------------- */}
          <section className="space-y-8">
            <div>
              <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.18em] uppercase">
                06 / RESULTADOS E APRENDIZADOS
              </span>
              <h2 className="font-montserrat font-black text-2xl sm:text-4xl text-[#101014] uppercase leading-tight mt-1">
                Construir uma marca é um processo de percepção, relacionamento e consistência.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#5A5A66] max-w-3xl mt-2 leading-relaxed">
                Métricas reais auditadas de alcance qualificado, salvamentos, crescimento de comunidade e oportunidades geradas pelo ecossistema editorial:
              </p>
            </div>

            {/* Results Prints Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resultsPrints.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-5 rounded-[28px] border border-[#101014]/10 shadow-sm flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <span className="font-montserrat font-black text-3xl sm:text-4xl text-[#FF701A] block">
                      {r.metric}
                    </span>
                    <span className="text-xs font-bold text-[#101014] uppercase tracking-wider font-inter block mt-1">
                      {r.title}
                    </span>
                    <p className="text-xs text-[#5A5A66] font-inter mt-1 leading-snug">
                      {r.metricLabel}
                    </p>
                  </div>

                  {/* Mobile Print Mockup */}
                  <div className="relative w-full h-[400px] rounded-[20px] overflow-hidden bg-neutral-100 border border-[#101014]/10 shadow-inner group">
                    <img
                      src={r.src}
                      alt={r.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-semibold">
                      Print real auditado de métricas do perfil
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Takeaway Card */}
            <div className="bg-[#FFB800]/15 p-8 sm:p-10 rounded-[28px] border border-[#FFB800]/40">
              <span className="text-xs font-bold text-[#b07d00] uppercase tracking-wider font-inter block mb-2">
                ✦ Aprendizado Estratégico Canônico
              </span>
              <h4 className="font-montserrat font-black text-xl sm:text-2xl text-[#101014] uppercase leading-snug">
                "Uma estratégia de conteúdo não começa pela escolha dos formatos ou pela frequência de publicação. Começa pela compreensão de quem queremos alcançar, qual percepção desejamos construir e por que alguém deveria se importar com aquilo que comunicamos."
              </h4>
              <p className="font-inter text-sm sm:text-base text-[#5A5A66] mt-4 leading-relaxed">
                Mais do que ensinar ferramentas, o <strong>Um Cara Caramelo</strong> consolidou uma comunidade engajada através da transformação de curiosidade em identificação, aprendizado e capacidade concreta de criação.
              </p>
            </div>
          </section>

          {/* ========================================================
              CTA FINAL DO CASE
          ======================================================== */}
          <div className="bg-[#101014] text-white p-8 sm:p-12 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="max-w-xl">
              <span className="text-[#FF701A] font-inter text-xs font-bold tracking-[0.2em] uppercase">
                PRÓXIMO PASSO
              </span>
              <h3 className="font-montserrat font-black text-2xl sm:text-3xl uppercase leading-tight mt-1 text-white">
                Sua comunicação precisa dessa direção estratégica?
              </h3>
              <p className="font-inter text-sm text-white/70 leading-relaxed mt-2">
                Conduzo sua marca da estratégia à publicação, com a mesma consistência e profundidade metodológica demonstradas neste case.
              </p>
            </div>

            <a
              href="https://wa.me/5531985869015?text=Ol%C3%A1%2C%20Luiz!%20Gostaria%20de%20agendar%20uma%20sess%C3%A3o%20de%20alinhamento."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#FFB800] hover:bg-[#FFA500] text-[#101014] font-extrabold px-8 py-4 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Agendar sessão de alinhamento</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}