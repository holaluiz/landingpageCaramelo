import { Compass, Layers, Milestone, Repeat } from 'lucide-react';

const steps = [
  {
    number: '01',
    step: '01 — Imersão',
    headline: 'Primeiro, entendo o seu negócio.',
    description: 'Conheço sua oferta, seu público, seus objetivos e os desafios atuais da comunicação.',
    color: '#FF701A',
    bgBadge: 'rgba(255, 112, 26, 0.12)',
    icon: Compass,
  },
  {
    number: '02',
    step: '02 — Direção',
    headline: 'Depois, definimos o caminho.',
    description: 'Estruturo o posicionamento editorial, as narrativas, as prioridades e o planejamento de conteúdo.',
    color: '#25BFFF',
    bgBadge: 'rgba(37, 191, 255, 0.12)',
    icon: Milestone,
  },
  {
    number: '03',
    step: '03 — Operação',
    headline: 'A estratégia ganha forma.',
    description: 'Conduzo a criação, organizo o fluxo de aprovações e coordeno as publicações previstas no escopo.',
    color: '#FFB800',
    bgBadge: 'rgba(255, 184, 0, 0.15)',
    icon: Layers,
  },
  {
    number: '04',
    step: '04 — Evolução',
    headline: 'O conteúdo continua aprendendo.',
    description: 'Acompanho indicadores, avalio o desempenho e aprimoro os próximos ciclos editoriais.',
    color: '#7657FF',
    bgBadge: 'rgba(118, 87, 255, 0.14)',
    icon: Repeat,
  },
];

export default function ProcessSection() {
  return (
    <section
      id="processo"
      className="relative w-full bg-[#FFF4E8] text-[#101014] py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden border-t border-[#101014]/8 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <h2 className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#101014] uppercase tracking-tight leading-[1.04] max-w-4xl">
          <span>Um processo claro. </span>
          <br className="hidden sm:block" />
          <span className="text-[#FF701A]">Uma comunicação em movimento.</span>
        </h2>

        {/* Subtext */}
        <p className="font-inter text-base sm:text-lg md:text-xl text-[#5A5A66] max-w-3xl leading-relaxed mt-5">
          Você não precisa coordenar cada etapa da produção. Precisa participar das decisões que realmente importam para o seu negócio.
        </p>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 sm:mt-16">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#101014]/10 shadow-[0_10px_30px_rgba(16,16,20,0.04)] flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(16,16,20,0.08)] transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-montserrat font-black text-2xl tracking-tight"
                      style={{ color: item.color }}
                    >
                      {item.number}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: item.bgBadge, color: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Name */}
                  <h3 className="font-montserrat font-black text-xl text-[#101014] uppercase tracking-tight mb-2">
                    {item.step}
                  </h3>

                  {/* Step Subheadline */}
                  <p
                    className="font-inter text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-3 leading-snug"
                    style={{ color: item.color }}
                  >
                    {item.headline}
                  </p>

                  {/* Description */}
                  <p className="font-inter text-xs sm:text-sm text-[#5A5A66] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Visual Accent Line */}
                <div className="mt-8 pt-4 border-t border-[#101014]/8">
                  <div
                    className="h-1 rounded-full w-12 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
