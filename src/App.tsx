import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Award, Crown, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ReelmarkHero from './components/ReelmarkHero';
import ProcessSection from './components/ProcessSection';
import CtaSection from './components/CtaSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DeliverablesSection from './components/DeliverablesSection';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Problema', href: '#stats' },
  { label: 'Solução', href: '#wild' },
  { label: 'Entregas', href: '#stats-2' },
  { label: 'Trabalhos', href: '#reelmark' },
  { label: 'Processo', href: '#processo' },
  { label: 'Contato', href: '#contato' },
];

export const WHATSAPP_URL =
  'https://wa.me/5531985869015?text=Ol%C3%A1%2C%20Luiz!%20Gostaria%20de%20agendar%20uma%20sess%C3%A3o%20de%20alinhamento.';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ultra-fluid Lenis Smooth Scroll Configuration
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    (window as any).lenis = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hero Video auto-pause when scrolled away
    const heroObserver = new IntersectionObserver(
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
    const heroEl = document.getElementById('hero');
    if (heroEl) heroObserver.observe(heroEl);

    // Adaptive Header Theme Detection based on light/dark section under navbar
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const contato = document.getElementById('contato');
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const darkRect = contato ? contato.getBoundingClientRect() : null;

      // Header height is ~80px.
      // Light sections (#stats, #wild, #stats-2, #reelmark, #processo) sit between Hero and #contato
      const pastHero = heroRect.bottom <= 80;
      const beforeDark = darkRect ? darkRect.top > 80 : true;

      setIsLightSection(pastHero && beforeDark);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lenis.on('scroll', handleScroll);
    handleScroll();

    // Smooth Anchor Scroll across all navigational elements
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        const elem = document.querySelector(href);
        if (elem) {
          e.preventDefault();
          lenis.scrollTo(elem as HTMLElement, {
            offset: -40,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              ScrollTrigger.refresh();
            },
          });
          setMenuOpen(false);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Initial and delayed refresh to guarantee accurate scroll trigger coordinates
    ScrollTrigger.refresh();
    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleWindowLoad);
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('load', handleWindowLoad);
      gsap.ticker.remove(tick);
      delete (window as any).lenis;
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorClick);
      heroObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#121410] text-[#121410] overflow-x-hidden select-none">
      {/* ========================================================
          FIXED GLASS NAVBAR (CABEÇALHO FIXO COM EFEITO DE VIDRO ADAPTATIVO)
      ======================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ${
          isLightSection
            ? 'bg-[#FFF4E8]/85 backdrop-blur-2xl backdrop-saturate-180 border-b border-[#101014]/10 shadow-[0_4px_24px_0_rgba(16,16,20,0.06),inset_0_1px_0_0_rgba(255,255,255,0.7)]'
            : 'bg-white/[0.16] backdrop-blur-2xl backdrop-saturate-180 border-b border-white/[0.22] shadow-[0_8px_32px_0_rgba(0,0,0,0.18),inset_0_1px_0_0_rgba(255,255,255,0.4)]'
        }`}
      >
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 lg:py-5">
          {/* Brand Left */}
          <a
            href="#hero"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="Um Cara Caramelo"
          >
            <img
              src={isLightSection ? '/Logo-dark.svg' : '/Logo.svg'}
              alt="Um Cara Caramelo"
              className={`h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-300 ${
                isLightSection ? '' : 'drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]'
              }`}
            />
          </a>

          {/* Center Links (md+) */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-inter text-xs font-bold tracking-[0.16em] uppercase hover:text-[#FF701A] transition-colors duration-200 ${
                  isLightSection
                    ? 'text-[#101014]'
                    : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Button (md+) */}
          <div className="hidden md:block">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.14em] uppercase transition-all duration-200 rounded-full backdrop-blur-md ${
                isLightSection
                  ? 'border border-[#FF701A] bg-[#FF701A] hover:bg-[#E55E0D] text-white shadow-[0_4px_16px_rgba(255,112,26,0.3)] hover:shadow-[0_6px_24px_rgba(255,112,26,0.5)]'
                  : 'border border-white/40 hover:border-[#FFB800] bg-white/[0.18] hover:bg-[#FFB800] text-white hover:text-[#101014] shadow-[0_4px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_24px_rgba(255,184,0,0.45)]'
              }`}
            >
              <span>AGENDAR SESSÃO</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Hamburger (below md) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col items-end space-y-1.5 p-2 focus:outline-none cursor-pointer"
            aria-label="Open Menu"
          >
            <div
              className={`w-6 h-0.5 transition-colors ${
                isLightSection ? 'bg-[#101014]' : 'bg-white'
              }`}
            />
            <div
              className={`w-6 h-0.5 transition-colors ${
                isLightSection ? 'bg-[#101014]' : 'bg-white'
              }`}
            />
            <div
              className={`w-4 h-0.5 transition-colors ${
                isLightSection ? 'bg-[#101014]' : 'bg-white'
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#101014]/98 backdrop-blur-xl flex flex-col justify-between px-6 sm:px-10 py-5 transition-all duration-500 md:hidden ${
          menuOpen
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between w-full">
          <a
            href="#hero"
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
            aria-label="Um Cara Caramelo"
          >
            <img
              src="/Logo.svg"
              alt="Um Cara Caramelo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-white/80 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Links Centered */}
        <div className="flex flex-col items-center justify-center space-y-6 my-auto">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-montserrat font-black text-3xl sm:text-4xl text-white uppercase tracking-wider transition-all duration-500 hover:text-[#FF701A]"
              style={{
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {item.label}
            </a>
          ))}

          <div
            className="pt-6 transition-all duration-500"
            style={{
              transitionDelay: `${navItems.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 border border-[#FF701A] bg-[#FF701A] hover:bg-[#E55E0D] px-8 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors text-white rounded-full shadow-lg"
            >
              <span>AGENDAR SESSÃO</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="text-center text-[10px] tracking-widest uppercase text-white/40 pb-4">
          HEAD DE CONTEÚDO · UM CARA CARAMELO®
        </div>
      </div>

      {/* =======================================================================
          🔒 LOCKED COMPONENT — HERO SECTION PRINCIPAL (VANGUARD FULLSCREEN)
          DATA DE APROVAÇÃO: 29/10/2026
          STATUS: TOTALMENTE APROVADO / BLOQUEADO CONTRA ALTERAÇÕES
          Regra estrita: NÃO MODIFICAR este bloco sem instrução explícita direta
          do usuário. Layout, vídeo de fundo, copy, tipografia e CTAs estão congelados.
      ======================================================================= */}
      <section
        id="hero"
        className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between text-white font-inter"
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-[70%_center] z-0 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/hero.mp4"
        />

        {/* Hero Content */}
        <main className="relative z-20 flex-1 flex flex-col justify-center pt-24 pb-12 sm:pt-28 px-6 sm:px-10 lg:px-16 max-w-7xl w-full mx-auto">
          <div className="max-w-[520px] lg:max-w-[470px] xl:max-w-[500px]">
            {/* 1. Eyebrow */}
            <div className="animate-fade-up flex items-center gap-2.5 mb-4 lg:mb-5">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-[#FFF4E8]/80 text-xs sm:text-sm font-inter tracking-[0.25em] uppercase font-semibold">
                HEAD DE CONTEÚDO · UM CARA CARAMELO®
              </span>
            </div>

            {/* 2. Main Heading */}
            <h1 className="animate-fade-up-delay-1 font-montserrat font-black text-white uppercase leading-[0.98] tracking-tight flex flex-col text-[clamp(2rem,3.6vw,3.4rem)]">
              <span>Seu conteúdo</span>
              <span>está à altura</span>
              <span className="text-[#FFF4E8]">do seu negócio?</span>
            </h1>

            {/* 3. Subtext */}
            <p className="animate-fade-up-delay-2 text-[#FFF4E8]/85 text-xs sm:text-sm lg:text-[15px] font-inter leading-relaxed max-w-[430px] mt-5 lg:mt-6">
              Você tem algo valioso para oferecer. Eu cuido da estratégia, direção criativa e operação do seu conteúdo para que sua comunicação demonstre esse valor.
            </p>

            {/* 4. CTA Row */}
            <div className="animate-fade-up-delay-3 flex flex-wrap items-center gap-4 sm:gap-5 mt-7 lg:mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-[#101014] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold tracking-[0.12em] uppercase rounded-full transition-all duration-200 shadow-[0_6px_28px_rgba(255,184,0,0.45)] hover:shadow-[0_8px_36px_rgba(255,184,0,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Agendar sessão de alinhamento</span>
                <ArrowUpRight className="w-4 h-4 text-[#101014] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="hidden sm:flex items-center gap-3 pl-1">
                <Award className="w-7 h-7 text-white" />
                <div className="flex flex-col text-[#FFF4E8]/65 text-[11px] tracking-wider uppercase leading-snug">
                  <span>Direção & Operação</span>
                  <span className="text-[#FFF4E8] font-semibold">Head de Conteúdo</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Balance spacer */}
        <div className="h-4 lg:h-6 pointer-events-none" />
      </section>

      {/* ========================================================
          FAIXA ANIMADA PÓS-HERO (ACID YELLOW TICKER)
          Posicionada exatamente sobre a divisão entre a Hero e a Seção 02 (sem espaço escuro)
      ======================================================== */}
      <div className="relative z-30 w-full h-0 pointer-events-none select-none">
        <div className="absolute left-0 right-0 top-0 -translate-y-1/2 w-full flex items-center justify-center overflow-hidden py-14 pointer-events-none">
          <div
            className="w-[180vw] -ml-[40vw] bg-[#FFD52A] py-3.5 sm:py-4.5 border-y-2 border-[#101014]/20 shadow-[0_12px_36px_rgba(0,0,0,0.3)] pointer-events-auto"
            style={{ transform: 'rotate(-2.5deg)' }}
          >
            <div className="animate-marquee flex items-center whitespace-nowrap hover:[animation-play-state:paused]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    ESTRATÉGIA EDITORIAL
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    DIREÇÃO CRIATIVA
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    OPERAÇÃO DE CONTEÚDO
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    POSICIONAMENTO DE MARCA
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    DA ESTRATÉGIA À PUBLICAÇÃO
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                  <span className="font-montserrat font-black text-[14px] sm:text-[17px] md:text-[19px] text-[#101014] tracking-[0.14em] uppercase mx-5 sm:mx-8">
                    COMUNICAÇÃO COM DIREÇÃO
                  </span>
                  <span className="text-[#101014]/40 font-bold">·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. PROBLEMA (02 / O PROBLEMA COM OS 3 CENÁRIOS INTERATIVOS)
      ======================================================== */}
      <ProblemSection id="stats" imageSrc="/calendario.png" />

      {/* ========================================================
          3. SOLUÇÃO (03 / O QUE EU FAÇO — HE [pill] AD COM COPY INTEGRAL)
      ======================================================== */}
      <SolutionSection id="wild" />

      {/* ========================================================
          4. ENTREGAS (04 / MINHA ATUAÇÃO — 5 ENTREGAS INTERATIVAS)
      ======================================================== */}
      <DeliverablesSection id="stats-2" imageSrc="/PC.png" />

      {/* ========================================================
          5. REELMARK HERO (05 / TRABALHOS SELECIONADOS & CASE)
      ======================================================== */}
      <ReelmarkHero />

      {/* ========================================================
          6. PROCESSO (06 / COMO FUNCIONA)
      ======================================================== */}
      <ProcessSection />

      {/* ========================================================
          7. CTA FINAL (07 / VAMOS CONVERSAR?) — SEÇÃO FINAL COM VÍDEO E LIQUID GLASS
      ======================================================== */}
      <CtaSection whatsappUrl={WHATSAPP_URL} />
    </div>
  );
}
