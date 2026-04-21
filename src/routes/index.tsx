import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Sparkles,
  Store,
  Briefcase,
  TrendingUp,
  Scale,
  Volume2,
  DollarSign,
  Clock,
  Play,
  ArrowRight,
} from "lucide-react";
import logoOnn from "@/assets/logo-onn.png";
import vslBg from "@/assets/vsl-bg.png";
import founderHeroGlow from "@/assets/founder-hero-glow.jpg";
import { VSLPlayer } from "@/components/VSLPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Os Novos Nordestinos — Posicionamento Digital Premium" },
      {
        name: "description",
        content:
          "Movimento de empresários nordestinos que decidiram ser vistos, valorizados e respeitados no nível que realmente são. Atender menos, cobrar mais.",
      },
      {
        property: "og:title",
        content: "Os Novos Nordestinos — Posicionamento Digital Premium",
      },
      {
        property: "og:description",
        content:
          "Construímos toda a sua presença digital com Arquitetura de Posicionamento e Clone Digital 24/7.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preload", as: "image", href: logoOnn, fetchpriority: "high" },
    ],
  }),
  component: NovosNordestinos,
});

/* ─────────── REVEAL HOOK (IntersectionObserver) ─────────── */
function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function NovosNordestinos() {
  const [vslStatus, setVslStatus] = useState<"idle" | "watching" | "finished">(
    "idle",
  );
  const [vslElapsed, setVslElapsed] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollPrompt, setScrollPrompt] = useState(false);

  const MIN_WATCH = 30;
  const hasUnlockedRef = useRef(false);

  const handleVslPlay = () => {
    setVslStatus((prev) => (prev === "idle" ? "watching" : prev));
  };

  const handleVslTime = (seconds: number) => {
    setVslElapsed((prev) => (seconds > prev ? seconds : prev));
    if (!hasUnlockedRef.current && seconds >= MIN_WATCH) {
      hasUnlockedRef.current = true;
      setVslStatus("finished");
      unlockContent();
    }
  };

  const handleVslEnded = () => {
    if (!hasUnlockedRef.current) {
      hasUnlockedRef.current = true;
      setVslStatus("finished");
      unlockContent();
    }
  };

  const unlockContent = () => setScrollPrompt(true);

  useEffect(() => {
    if (!scrollPrompt || isLoading || isUnlocked) return;

    let touchStartY: number | null = null;
    const trigger = () => setIsLoading(true);

    const onScroll = () => { if (window.scrollY > 40) trigger(); };
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 4) trigger(); };
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0]?.clientY ?? null; };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY == null) return;
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY);
      if (dy > 20) trigger();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "End"].includes(e.key)) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [scrollPrompt, isLoading, isUnlocked]);

  useEffect(() => {
    if (!isLoading) return;
    requestAnimationFrame(() => {
      const target = document.getElementById("brand-loader-inline");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    });

    let progress = 0;
    const interval = setInterval(() => {
      const remaining = 100 - progress;
      const step = Math.max(0.6, remaining * 0.025);
      progress = Math.min(100, progress + step);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          setIsUnlocked(true);
        }, 400);
      }
      setLoadProgress(progress);
    }, 35);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isUnlocked) return;
    requestAnimationFrame(() => {
      const target = document.getElementById("hero-intro");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isUnlocked]);

  // Reveal observer (re-bind quando o conteúdo é desbloqueado)
  useReveal();
  useEffect(() => {
    if (!isUnlocked) return;
    const t = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
      );
      els.forEach((el) => io.observe(el));
    }, 50);
    return () => clearTimeout(t);
  }, [isUnlocked]);

  return (
    <>
      <VSLGate
        vslStatus={vslStatus}
        vslElapsed={vslElapsed}
        scrollPrompt={scrollPrompt}
        isLoading={isLoading}
        onPlay={handleVslPlay}
        onTime={handleVslTime}
        onEnded={handleVslEnded}
      />

      {isLoading && <BrandLoader loadProgress={loadProgress} />}

      {isUnlocked && (
        <main>
          <Nav />
          <div id="hero-intro">
            <HeroIntro />
          </div>
          <ManifestoSection />
          <AudienceSection />
          <FounderSection />
          <ImpactSection />
          <DuranteAnosHeadline />
          <FinalCTA />
          <Footer />
        </main>
      )}
    </>
  );
}

/* ─────────── VSL GATE — seção inicial ─────────── */
function VSLGate({
  vslStatus,
  vslElapsed,
  scrollPrompt,
  isLoading,
  onPlay,
  onTime,
  onEnded,
}: {
  vslStatus: "idle" | "watching" | "finished";
  vslElapsed: number;
  scrollPrompt: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onTime: (s: number) => void;
  onEnded: () => void;
}) {
  const MIN_WATCH = 30;

  return (
    <section
      id="vsl-gate"
      className="relative min-h-[100svh] flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Fundo sutil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] bg-cover bg-center"
        style={{ backgroundImage: `url(${vslBg})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--bg-surface) 80%)",
        }}
      />

      {/* Watermark ONN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="watermark-onn">ONN</span>
      </div>

      <div className="relative z-10 text-center max-w-[760px] mx-auto">
        {/* Eyebrow centralizado */}
        <div className="hero-anim hero-anim-1 flex justify-center">
          <span className="eyebrow eyebrow--center">Antes de Qualquer Coisa</span>
        </div>

        {/* Headline 2 linhas */}
        <h1 className="headline mt-4 hero-anim hero-anim-2">
          Antes de qualquer coisa,
          <br />
          <span className="accent-text">Assista isso</span>
        </h1>

        {/* Body centralizado */}
        <p className="body-text mx-auto text-center mt-5 hero-anim hero-anim-3" style={{ maxWidth: 420 }}>
          O que você vai ver nos próximos minutos pode mudar a forma como você
          se posiciona no digital.
        </p>

        {/* Player */}
        <div className="mt-11 hero-anim hero-anim-4">
          <div className="video-frame">
            <VSLPlayer
              videoId="1184950928"
              hash="c0d54d152e"
              onPlay={onPlay}
              onTimeUpdate={onTime}
              onEnded={onEnded}
            />

            {vslStatus === "finished" && (
              <div
                className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full pointer-events-none"
                style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(8px)" }}
              >
                <Sparkles size={14} style={{ color: "var(--accent)" }} />
                <span className="label-meta label-meta--accent">Liberado</span>
              </div>
            )}
          </div>

          {vslStatus === "watching" && (
            <div className="h-[2px] w-full max-w-[720px] mx-auto mt-2 relative overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <div
                className="h-full transition-all duration-1000"
                style={{
                  background: "var(--accent)",
                  width: `${Math.min((vslElapsed / MIN_WATCH) * 100, 100)}%`,
                }}
              />
            </div>
          )}

          {vslStatus === "idle" && (
            <p className="mt-4 flex items-center justify-center gap-2 label-meta label-meta--accent">
              <Volume2 size={13} strokeWidth={2.2} />
              Assista com som ativado
            </p>
          )}
        </div>

        {/* Deslize para baixo */}
        <div className="mt-12 flex flex-col items-center gap-2 hero-anim hero-anim-5">
          <span className="label-meta label-meta--accent" style={{ letterSpacing: "0.40em" }}>
            Deslize para baixo
          </span>
          <ChevronDown size={20} strokeWidth={2} className="bounce-soft" style={{ color: "var(--accent)" }} />
        </div>

        <AnimatePresence>
          {scrollPrompt && !isLoading && (
            <motion.div
              key="scroll-prompt"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-6 label-meta"
            >
              O conteúdo foi liberado
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────── BRAND LOADER inline ─────────── */
function BrandLoader({ loadProgress }: { loadProgress: number }) {
  return (
    <section
      id="brand-loader-inline"
      aria-live="polite"
      aria-busy="true"
      className="loader-stage"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "var(--accent-glow)",
          filter: "blur(180px)",
          animation: "pulse-glow 5s ease-in-out infinite",
        }}
      />
      <div className="relative">
        <div className="loader-onn-base">ONN</div>
        <div
          className="loader-onn-fill"
          style={{ clipPath: `inset(0 ${100 - loadProgress}% 0 0)` }}
        >
          ONN
        </div>
      </div>

      <div className="w-full max-w-[420px] flex flex-col gap-2 px-6">
        <div
          className="w-full h-[2px] rounded-full overflow-hidden relative"
          style={{ background: "var(--border-subtle)" }}
        >
          <div
            className="absolute left-0 top-0 h-full transition-[width] duration-200 ease-out"
            style={{ width: `${loadProgress}%`, background: "var(--accent)" }}
          />
        </div>
        <div className="flex justify-between w-full label-meta">
          <span>Carregando experiência</span>
          <span className="label-meta--accent">
            {Math.floor(loadProgress).toString().padStart(3, "0")}%
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─────────── NAV ─────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,10,10,0.95)"
          : "linear-gradient(to bottom, rgba(10,10,10,0.88), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero-intro" className="flex items-center gap-2">
          <img src={logoOnn} alt="Os Novos Nordestinos" className="w-7 h-7 object-contain" />
          <span className="label-meta" style={{ color: "var(--text-primary)", letterSpacing: "0.22em" }}>
            ONN
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#manifesto" className="label-meta hover:text-accent-token transition-colors" style={{ color: "var(--text-secondary)" }}>
            Manifesto
          </a>
          <a href="#para-quem" className="label-meta hover:text-accent-token transition-colors" style={{ color: "var(--text-secondary)" }}>
            Para Quem
          </a>
          <a href="#ganhos" className="label-meta hover:text-accent-token transition-colors" style={{ color: "var(--text-secondary)" }}>
            Ganhos
          </a>
          <a href="#cta-final" className="btn-primary btn-primary--sm">
            Solicitar avaliação
          </a>
        </div>

        <a href="#cta-final" className="md:hidden btn-pill" style={{ padding: "8px 16px", fontSize: 11 }}>
          Avaliação
        </a>
      </div>
    </nav>
  );
}

/* ─────────── HERO INTRO — 55/45 grid ─────────── */
function HeroIntro() {
  return (
    <section
      className="relative min-h-[100vh] overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] min-h-[100vh]">
        {/* COLUNA ESQUERDA — conteúdo */}
        <div
          className="relative flex flex-col justify-center order-2 md:order-1"
          style={{ padding: "120px 24px 72px" }}
        >
          <div className="max-w-[560px]">
            {/* Eyebrow */}
            <div className="hero-anim hero-anim-1">
              <span className="eyebrow">O Movimento</span>
            </div>

            {/* Linha fina + Display COLADOS (gap 4px) */}
            <div className="mt-3 hero-anim hero-anim-2">
              <p className="pre-display">Chegou a hora do Brasil conhecer</p>
              <h1 className="display display--hero accent-text" style={{ marginTop: 4 }}>
                Os Novos
                <br />
                Nordestinos
              </h1>
            </div>

            {/* Body */}
            <p className="body-text hero-anim hero-anim-3" style={{ marginTop: 24 }}>
              <strong>Empresário e profissionais nordestinos</strong> que já constroem resultado, mas agora decidiram ser{" "}
              <span className="accent-text" style={{ fontWeight: 700 }}>vistos, valorizados e respeitados</span>{" "}
              no nível que realmente são.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6 hero-anim hero-anim-4" style={{ marginTop: 36 }}>
              <a href="#cta-final" className="btn-primary">
                Iniciar avaliação
                <Play size={14} fill="currentColor" />
              </a>
              <a href="#manifesto" className="btn-ghost">
                Conhecer o movimento
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Divider + Stats */}
            <div className="hero-anim hero-anim-5" style={{ marginTop: 52 }}>
              <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
              <div className="grid grid-cols-3 gap-6" style={{ marginTop: 28 }}>
                <Stat num="2K26" label="Ano do Movimento" />
                <Stat num="9" label="Estados do Nordeste" />
                <Stat num="1" label="Posicionamento Real" />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA — foto idealizador */}
        <div
          className="relative order-1 md:order-2"
          style={{
            minHeight: "55vw",
            maxHeight: "100vh",
            background: "var(--bg)",
          }}
        >
          <img
            src={founderHeroGlow}
            alt="Idealizador d'Os Novos Nordestinos"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
          <div className="hero-photo-glow" />
          <div className="hero-photo-mask" />

          {/* Badge ONN — 2K26 */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
            <span className="label-meta" style={{ color: "var(--accent)", letterSpacing: "0.3em" }}>
              ONN
            </span>
            <span className="block w-12 h-px" style={{ background: "var(--accent-dim)" }} />
            <span className="label-meta label-meta--accent">2K26</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div
        className="accent-text"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 44px)",
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        {num}
      </div>
      <div className="label-meta" style={{ marginTop: 8 }}>{label}</div>
    </div>
  );
}

/* ─────────── MANIFESTO — grid 2 cols + 2x2 cards ─────────── */
function ManifestoSection() {
  const cards = [
    { title: "Diagnóstico de Posicionamento", desc: "Vamos analisar como o mercado realmente enxerga você hoje — onde está sua autoridade, onde estão os ruídos e onde mora o dinheiro escondido na sua percepção." },
    { title: "Mapeamento da Audiência Premium", desc: "Identificamos exatamente quem é o cliente que paga mais e respeita mais — para você parar de atender qualquer um e começar a atrair os melhores." },
    { title: "Arquitetura de Marca Pessoal", desc: "Construímos a estrutura completa da sua presença digital: comunicação, estética, narrativa e conteúdo no nível de quem você realmente é." },
    { title: "Implementação do Clone Digital", desc: "Ativamos o sistema que trabalha seu posicionamento 24/7 — sem exigir seu tempo, sem você precisar gravar nada, sem aparecer se não quiser." },
  ];

  return (
    <section
      id="manifesto"
      className="relative px-6"
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(72px, 12vw, 110px)",
        paddingBottom: "clamp(72px, 12vw, 110px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Esquerda */}
        <div>
          <Reveal>
            <span className="eyebrow">Quem Somos</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="headline" style={{ marginTop: 12 }}>
              O Nordeste<br />
              Sempre Produziu.<br />
              <span className="accent-text">Agora é Visto.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-text" style={{ marginTop: 24 }}>
              Nascemos com um propósito: mostrar pro Brasil que o Nordeste produz
              empresários sofisticados, negócios milionários e marcas no nível
              das maiores do país.
            </p>
            <p className="body-text">
              Hoje, à frente do movimento, ajudamos empresários nordestinos a
              implementar uma <strong>Arquitetura de Posicionamento Digital</strong> de
              ponta a ponta — transformando autoridade em ticket maior, mais
              tempo livre e respeito de mercado.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <blockquote className="quote-block" style={{ marginTop: 32 }}>
              <p>Posicionamento não é vaidade. É a diferença entre ser escolhido pelo preço — ou pelo prestígio.</p>
              <span className="quote-author">Movimento ONN</span>
            </blockquote>
          </Reveal>
          <Reveal delay={320}>
            <div style={{ marginTop: 32 }}>
              <a href="#cta-final" className="btn-ghost">
                Fazer parte do movimento
                <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Direita — grid 2x2 */}
        <div className="grid grid-cols-2 gap-[2px]">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="feature-card h-full">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── AUDIENCE — 3 cards centered header ─────────── */
function AudienceSection() {
  const profiles = [
    { icon: <Store size={22} />, title: "Donos de negócios do mundo físico", desc: "Lojas, clínicas, escritórios, prestadores de serviço presencial. Você sente que está preso na operação e que o digital não traduz o tamanho real da sua empresa." },
    { icon: <TrendingUp size={22} />, title: "Empresários em escala", desc: "Sua empresa já fatura bem, mas ainda faz 80% dos processos na mão. Está na hora de profissionalizar a percepção e escalar com margem — não com volume." },
    { icon: <Scale size={22} />, title: "Profissionais liberais", desc: "Advogados, médicos, contadores, consultores. Você vende seu tempo e sabe que tem um teto. Posicionamento te ajuda a cobrar mais, atender melhor e parar de ser refém da própria agenda." },
    { icon: <Briefcase size={22} />, title: "Especialistas e autoridades", desc: "Você já tem conhecimento, resultado e bagagem. Falta apenas a estrutura digital pra que o mercado pare de te tratar como mais um e comece a te tratar como referência." },
  ];

  return (
    <section
      id="para-quem"
      className="relative px-6"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        paddingTop: "clamp(72px, 12vw, 110px)",
        paddingBottom: "clamp(72px, 12vw, 110px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header centralizado */}
        <div className="text-center mb-16">
          <Reveal>
            <div className="flex justify-center">
              <span className="eyebrow eyebrow--center">Para Quem É</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="headline" style={{ marginTop: 16 }}>
              Esse movimento<br />
              <span className="accent-text">faz sentido pra você se</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-text mx-auto" style={{ marginTop: 12, maxWidth: 480 }}>
              Você se encaixa em um desses perfis e quer usar posicionamento pra
              crescer de verdade.
            </p>
          </Reveal>
        </div>

        {/* Grid 4 cards (com border container) */}
        <Reveal>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-lg overflow-hidden"
            style={{ background: "var(--border-subtle)", border: "1px solid var(--border-subtle)" }}
          >
            {profiles.map((p, i) => (
              <div key={i} className="audience-card">
                <div className="icon-box">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── FOUNDER — quem está por trás ─────────── */
function FounderSection() {
  return (
    <section
      className="relative px-6"
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(72px, 12vw, 110px)",
        paddingBottom: "clamp(72px, 12vw, 110px)",
      }}
    >
      <div className="max-w-[900px] mx-auto">
        <Reveal>
          <span className="eyebrow">Quem Está Por Trás</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="headline" style={{ marginTop: 12 }}>
            Muito Prazer,<br />
            <span className="accent-text">Os Novos Nordestinos</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="label-meta label-meta--accent" style={{ marginTop: 20 }}>
            Movimento de Posicionamento Digital · Especialistas em Autoridade de Marca
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p className="body-text" style={{ marginTop: 20, maxWidth: 720 }}>
            Nascemos com um propósito: mostrar pro Brasil que o Nordeste produz
            empresários sofisticados, negócios milionários e marcas no nível
            das maiores do país. Hoje, à frente do movimento, ajudamos
            empresários nordestinos a implementar uma{" "}
            <strong>Arquitetura de Posicionamento Digital</strong>{" "}
            de ponta a ponta — transformando autoridade em ticket maior, mais
            tempo livre e respeito de mercado.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div style={{ marginTop: 36 }}>
            <a href="#cta-final" className="btn-primary">
              Quero entrar para o movimento
              <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── IMPACT — 4 ganhos lista vertical ─────────── */
function ImpactSection() {
  const gains = [
    { lead: "Sua autoridade cresce sozinha", desc: "porque o seu nome passa a circular nos lugares certos, com o peso certo, sem você precisar correr atrás." },
    { lead: "Seu valor percebido explode", desc: "e o mercado começa a te enxergar como referência, não como mais uma opção entre tantas." },
    { lead: "Seu ticket médio sobe exponencialmente", desc: "com clientes que pagam pelo posicionamento, pela entrega e pela autoridade — não pelo menor preço." },
    { lead: "Sua agenda finalmente desafoga", desc: "você atende menos, com mais qualidade, e recupera tempo pra viver, pensar e crescer de verdade." },
  ];

  return (
    <section
      id="ganhos"
      className="relative px-6"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        paddingTop: "clamp(72px, 12vw, 110px)",
        paddingBottom: "clamp(72px, 12vw, 110px)",
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Header 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end mb-14">
          <div>
            <Reveal>
              <span className="eyebrow">Como Isso Muda Sua Vida</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="headline" style={{ marginTop: 12 }}>
                Essa foi feita<br />
                <span className="accent-text">pra você que</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <a href="#cta-final" className="btn-secondary">
              Quero ser selecionado
            </a>
          </Reveal>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-[2px]">
          {gains.map((g, i) => (
            <Reveal key={i} delay={i * 80}>
              <a href="#cta-final" className="gain-item">
                <span className="gain-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="gain-title">{g.lead}</p>
                  <p className="gain-desc">{g.desc}</p>
                </div>
                <span className="gain-arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <blockquote className="quote-block mt-12" style={{ maxWidth: 560 }}>
            <p>
              Você deixa de viver no <span style={{ color: "var(--text-primary)" }}>volume exaustivo</span>
              {" "}— e passa a viver no{" "}
              <span className="accent-text">valor premium.</span>
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── DURANTE ANOS HEADLINE ─────────── */
function DuranteAnosHeadline() {
  return (
    <section
      className="relative px-6"
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(80px, 12vw, 130px)",
        paddingBottom: "clamp(80px, 12vw, 130px)",
      }}
    >
      <div className="max-w-[1100px] mx-auto text-center">
        <Reveal>
          <h2 className="display" style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
            Durante anos tentaram<br />
            contar a <span className="accent-text">nossa história.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="label-meta label-meta--accent" style={{ marginTop: 28, letterSpacing: "0.4em" }}>
            Agora é a nossa vez.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── FINAL CTA ─────────── */
function FinalCTA() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden px-6"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: "clamp(100px, 14vw, 150px)",
        paddingBottom: "clamp(100px, 14vw, 150px)",
      }}
    >
      {/* Glow centro topo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 10%, rgba(224,140,50,0.09), transparent 70%)",
        }}
      />
      {/* Anéis concêntricos */}
      <div className="cta-rings" aria-hidden>
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="200" stroke="rgba(224,140,50,0.04)" />
          <circle cx="400" cy="400" r="280" stroke="rgba(224,140,50,0.04)" />
          <circle cx="400" cy="400" r="360" stroke="rgba(224,140,50,0.04)" />
          <circle cx="400" cy="400" r="380" stroke="rgba(224,140,50,0.03)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        <Reveal>
          <div className="flex justify-center">
            <span className="eyebrow eyebrow--center">A Hora É Agora</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display" style={{ marginTop: 22, fontSize: "clamp(54px, 8vw, 96px)" }}>
            Pronto para ser<br />
            <span className="accent-text">visto de verdade?</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="body-text mx-auto" style={{ marginTop: 20, maxWidth: 440 }}>
            Entre para o movimento exclusivo de empresários que estão
            redefinindo o padrão de autoridade nordestina no cenário digital
            nacional.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-4" style={{ marginTop: 48 }}>
            <a href="#" className="btn-primary btn-primary--lg">
              Solicitar avaliação estratégica
              <ArrowRight size={14} />
            </a>
            <a href="#manifesto" className="btn-secondary btn-secondary--lg">
              Conhecer o manifesto
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className="quote-author" style={{ marginTop: 36, color: "var(--accent)" }}>
            Agora é a nossa vez de ocupar o lugar certo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
function Footer() {
  return (
    <footer
      className="px-6"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: "clamp(60px, 8vw, 90px)",
        paddingBottom: "clamp(40px, 6vw, 60px)",
      }}
    >
      <div className="max-w-[1100px] mx-auto text-center">
        <Reveal>
          <p className="body-text mx-auto" style={{ maxWidth: 560 }}>
            Você não está contratando marketing comum.
            <br />
            <strong>Você está entrando para um movimento irreversível.</strong>
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 36 }}>
            {["Autoridade", "Liberdade", "Posicionamento", "Representatividade"].map((p, i) => (
              <span key={i} className="btn-pill" style={{ pointerEvents: "none" }}>
                {p}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex items-center justify-center gap-3" style={{ marginTop: 48 }}>
            <img src={logoOnn} alt="Os Novos Nordestinos" className="w-7 h-7 object-contain" />
            <span className="label-meta">Os Novos Nordestinos</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
