import { useEffect, useRef } from 'react';
import { ArrowUpRight, MessageSquareQuote } from 'lucide-react';
import { motion } from 'motion/react';

interface CtaSectionProps {
  whatsappUrl: string;
}

const navLinks = [
  { label: 'Problema', href: '#stats' },
  { label: 'Solução', href: '#wild' },
  { label: 'Entregas', href: '#stats-2' },
  { label: 'Trabalhos', href: '#reelmark' },
  { label: 'Processo', href: '#processo' },
];

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function CtaSection({ whatsappUrl }: CtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video auto-pause when scrolled out of view
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
      { threshold: 0.08 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-black text-white flex flex-col justify-between items-center px-4 sm:px-6 lg:px-12 pt-28 pb-12 select-none font-inter"
    >
      {/* 1. Immersive Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/footer.mp4"
      />

      {/* 2. Gradient Overlay for Perfect Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80 z-0 pointer-events-none" />

      {/* 3. Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF701A]/10 blur-[160px] rounded-full pointer-events-none" />

      {/* 4. Main Section Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center my-auto">
        {/* Main Heading */}
        <h2 className="font-montserrat font-black text-3xl sm:text-5xl md:text-6xl lg:text-[68px] text-white uppercase tracking-tight leading-[1.02] max-w-4xl mx-auto mb-6">
          <span>Seu negócio já tem valor. </span>
          <br className="hidden sm:block" />
          <span className="text-[#FFF4E8]">Seu conteúdo precisa mostrar isso.</span>
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-[#FFF4E8]/80 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12">
          Se sua comunicação precisa de mais direção, consistência e uma operação que acompanhe o crescimento do negócio, vamos conversar.
        </p>

        {/* Liquid Glass Proposal Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="liquid-glass w-full max-w-3xl rounded-[32px] p-8 sm:p-12 text-center text-white/90 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF701A]/15 text-[#FF701A] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <MessageSquareQuote className="w-6 h-6" />
          </div>

          <div className="space-y-3 text-base sm:text-lg text-[#FFF4E8]/90 leading-relaxed max-w-xl mx-auto font-inter">
            <p>
              Na sessão de alinhamento, entendo seu momento, seus objetivos e suas necessidades.
            </p>
            <p className="text-[#FFB800] font-semibold">
              Se houver compatibilidade, preparo uma proposta personalizada para o seu projeto.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 bg-[#FFB800] hover:bg-[#FFA500] text-[#101014] px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm font-extrabold tracking-[0.14em] uppercase rounded-full transition-all duration-200 shadow-[0_6px_32px_rgba(255,184,0,0.45)] hover:shadow-[0_8px_40px_rgba(255,184,0,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Agendar sessão de alinhamento</span>
              <ArrowUpRight className="w-4 h-4 text-[#101014] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <span className="text-xs sm:text-[13px] text-[#FFF4E8]/50 mt-1 max-w-md leading-relaxed font-inter">
              Uma conversa para entender seu negócio, sem compromisso de contratação.
            </span>
          </div>
        </motion.div>
      </div>

      {/* 5. Integrated Closing Brand Bar (Unified Footer Component) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-16 mt-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-8">
          {/* Brand Left */}
          <div className="flex items-center gap-3.5">
            <img
              src="/Logo.svg"
              alt="Um Cara Caramelo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="flex flex-col text-left">
              <span className="font-montserrat font-black text-sm uppercase text-white tracking-wider">
                UM CARA CARAMELO®
              </span>
              <span className="font-inter text-xs text-[#FF701A] font-semibold tracking-wider uppercase">
                Estratégia · Direção criativa · Conteúdo
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold tracking-widest uppercase text-[#FFF4E8]/65 font-inter">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#FF701A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Instagram Link */}
          <a
            href="https://instagram.com/umcaracaramelo"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram @umcaracaramelo"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-white/80 hover:text-[#FF701A] transition-colors group"
          >
            <InstagramIcon size={16} className="text-white/70 group-hover:text-[#FF701A] transition-colors" />
            <span className="text-white/80 group-hover:text-white transition-colors font-inter">@umcaracaramelo</span>
          </a>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#FFF4E8]/40 uppercase tracking-widest text-center sm:text-left">
          <span>© 2026 UM CARA CARAMELO® · Laboratório de Interação</span>
          <span>Transformando boas ideias em comunicação com direção.</span>
        </div>
      </div>
    </section>
  );
}
