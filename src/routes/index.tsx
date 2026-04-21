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
  Play,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import logoOnn from "@/assets/logo-onn.png";
import vslBg from "@/assets/vsl-bg.png";
import founderHeroGlow from "@/assets/founder-hero-new.png";
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

/* ─────────── REVEAL HOOK ─────────── */
function useRevealObserver(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.visible)");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}

/* ─────────── CURSOR CUSTOMIZADO ─────────── */
function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const outer = outerRef.current;
    const dot = dotRef.current;
    if (!outer || !dot) return;

    const onMove = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      window.setTimeout(() => {
        outer.style.left = e.clientX + "px";
        outer.style.top = e.clientY + "px";
      }, 80);
    };

    const onEnter = () => outer.classList.add("hovered");
    const onLeave = () => outer.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);

    const interactive = document.querySelectorAll<HTMLElement>(
      "a, button, [role='button']",
    );
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Re-bind quando novos elementos forem renderizados
    const mo = new MutationObserver(() => {
      const all = document.querySelectorAll<HTMLElement>(
        "a, button, [role='button']",
      );
      all.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      mo.disconnect();
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={outerRef} className="cursor-outer" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}

/* ─────────── COUNTER NUMÉRICO ─────────── */
function Counter({ end, duration = 1800 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (started.current) return;
      started.current = true;
      let startTs = 0;
      const step = (ts: number) => {
        if (!startTs) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = String(end);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { start(); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return <span ref={ref}>0</span>;
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
      setScrollPrompt(true);
    }
  };
  const handleVslEnded = () => {
    if (!hasUnlockedRef.current) {
      hasUnlockedRef.current = true;
      setVslStatus("finished");
      setScrollPrompt(true);
    }
  };

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
      const t = document.getElementById("brand-loader-inline");
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
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
        setTimeout(() => { setIsLoading(false); setIsUnlocked(true); }, 400);
      }
      setLoadProgress(progress);
    }, 35);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isUnlocked) return;
    requestAnimationFrame(() => {
      const t = document.getElementById("hero-intro");
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isUnlocked]);

  useRevealObserver([isUnlocked]);

  return (
    <>
      <CustomCursor />

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

/* ─────────── VSL GATE ─────────── */
function VSLGate({
  vslStatus, vslElapsed, scrollPrompt, isLoading,
  onPlay, onTime, onEnded,
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
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div aria-hidden className="absolute inset-0 opacity-[0.18] bg-cover bg-center" style={{ backgroundImage: `url(${vslBg})` }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--bg-surface) 80%)" }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="watermark-onn">ONN</span>
      </div>

      <div className="relative z-10 text-center max-w-[760px] mx-auto">
        <h1 className="typo-headline hero-anim hero-d-2" style={{ marginTop: 14 }}>
          Antes de qualquer coisa,
          <br />
          <span className="accent-text">Assista isso</span>
        </h1>

        <p className="typo-body mx-auto text-center hero-anim hero-d-3" style={{ maxWidth: 420, marginTop: 14 }}>
          O que você vai ver nos próximos minutos pode mudar a forma como você
          se posiciona no digital.
        </p>

        <div className="hero-anim hero-d-4" style={{ marginTop: 48 }}>
          <div className="video-frame">
            <VSLPlayer
              videoId="1184950928"
              hash="c0d54d152e"
              onPlay={onPlay}
              onTimeUpdate={onTime}
              onEnded={onEnded}
            />
            {vslStatus === "finished" && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full pointer-events-none"
                style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(8px)" }}>
                <Sparkles size={14} style={{ color: "var(--accent)" }} />
                <span className="typo-label typo-label--accent">Liberado</span>
              </div>
            )}
          </div>

          {vslStatus === "watching" && (
            <div className="h-[2px] w-full max-w-[720px] mx-auto mt-2 relative overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <div className="h-full transition-all duration-1000"
                style={{ background: "var(--accent)", width: `${Math.min((vslElapsed / MIN_WATCH) * 100, 100)}%` }} />
            </div>
          )}

          {vslStatus === "idle" && (
            <p className="mt-4 flex items-center justify-center gap-2 typo-label typo-label--accent">
              <Volume2 size={13} strokeWidth={2.2} />
              Assista com som ativado
            </p>
          )}
        </div>

        <div className="hero-anim hero-d-5 flex flex-col items-center gap-2" style={{ marginTop: 52 }}>
          <span className="typo-label typo-label--accent">Deslize para baixo</span>
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
              className="mt-6 typo-label"
            >
              O conteúdo foi liberado
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────── BRAND LOADER ─────────── */
function BrandLoader({ loadProgress }: { loadProgress: number }) {
  return (
    <section id="brand-loader-inline" aria-live="polite" aria-busy="true" className="loader-stage">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "var(--accent-glow)", filter: "blur(180px)", animation: "pulse-glow 5s ease-in-out infinite" }}
      />
      <div className="relative">
        <div className="loader-onn-base">ONN</div>
        <div className="loader-onn-fill" style={{ clipPath: `inset(0 ${100 - loadProgress}% 0 0)` }}>
          ONN
        </div>
      </div>
      <div className="w-full max-w-[420px] flex flex-col gap-2 px-6">
        <div className="w-full h-[2px] rounded-full overflow-hidden relative" style={{ background: "var(--border-subtle)" }}>
          <div className="absolute left-0 top-0 h-full transition-[width] duration-200 ease-out"
            style={{ width: `${loadProgress}%`, background: "var(--accent)" }} />
        </div>
        <div className="flex justify-between w-full typo-label">
          <span>Carregando experiência</span>
          <span className="typo-label--accent">{Math.floor(loadProgress).toString().padStart(3, "0")}%</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────── NAV ─────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        background: scrolled ? "rgba(10,10,10,0.96)" : "linear-gradient(to bottom, rgba(10,10,10,0.85), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between"
        style={{ padding: scrolled ? "14px 24px" : "22px 24px", transition: "padding 0.3s ease" }}>
        <a href="#hero-intro" className="flex items-center gap-2.5">
          <img src={logoOnn} alt="Os Novos Nordestinos" className="w-7 h-7 object-contain" />
          <span style={{ fontFamily: "var(--font)", fontWeight: 800, fontSize: 14, letterSpacing: "0.18em", color: "var(--text-primary)" }}>
            ONN
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#manifesto" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Manifesto</a>
          <a href="#para-quem" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Para Quem</a>
          <a href="#ganhos" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Ganhos</a>
          <a href="#cta-final" className="btn-primary btn-primary--sm">Solicitar Avaliação</a>
        </div>

        <button onClick={() => setMenuOpen(true)} className="md:hidden p-2" aria-label="Abrir menu" style={{ color: "var(--text-primary)", background: "transparent", border: "none" }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 md:hidden flex flex-col p-8"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"
                style={{ color: "var(--text-primary)", background: "transparent", border: "none", padding: 8 }}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {[
                { href: "#manifesto", label: "Manifesto" },
                { href: "#para-quem", label: "Para Quem" },
                { href: "#ganhos", label: "Ganhos" },
              ].map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="typo-headline" style={{ fontSize: 36 }}>
                  {l.label}
                </a>
              ))}
              <a href="#cta-final" onClick={() => setMenuOpen(false)} className="btn-primary mt-6 self-start">
                Solicitar Avaliação
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─────────── HERO INTRO ─────────── */
function HeroIntro() {
  return (
    <section className="hero">
      {/* Mobile: imagem no topo (70vh) com fade pro preto, texto abaixo no preto sólido */}
      <div className="md:hidden relative z-10">
        <div className="relative w-full" style={{ height: "70vh" }}>
          <img
            src={founderHeroGlow}
            alt="Idealizador d'Os Novos Nordestinos"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
          {/* Fade natural pro preto na parte de baixo */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "45%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 55%, #000 100%)",
            }}
          />
          {/* Badge ONN — 2K26 */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", color: "rgba(242,240,235,0.6)" }}>ONN</span>
            <span className="block w-12 h-px" style={{ background: "rgba(242,240,235,0.25)" }} />
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", color: "var(--accent)" }}>2K26</span>
          </div>
        </div>

        {/* Bloco de texto no preto sólido, abaixo da imagem */}
        <div className="bg-black px-6 pt-6 pb-16 -mt-px">
          <div className="max-w-[560px] mx-auto">
            <div className="hero-anim hero-d-1">
              <span className="eyebrow">O Movimento</span>
            </div>
            <p className="pre-display hero-anim hero-d-2" style={{ marginTop: 10 }}>
              Chegou a hora do Brasil conhecer
            </p>
            <h1 className="typo-display accent-text hero-anim hero-d-3 text-5xl" style={{ marginTop: 2 }}>
              Os Novos<br />Nordestinos
            </h1>
            <p className="typo-body hero-anim hero-d-4" style={{ marginTop: 24 }}>
              <strong>Empresário e profissionais nordestinos</strong> que já constroem resultado, mas agora decidiram ser{" "}
              <span className="accent-text" style={{ fontWeight: 400 }}>vistos, valorizados e respeitados</span>{" "}
              no nível que realmente são.
            </p>
            <div className="flex flex-wrap items-center gap-6 hero-anim hero-d-5" style={{ marginTop: 36 }}>
              <a href="#cta-final" className="btn-primary">
                Iniciar Avaliação
                <Play size={13} fill="currentColor" />
              </a>
              <a href="#manifesto" className="btn-ghost">
                Ver o manifesto
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="hero-anim hero-d-6" style={{ marginTop: 56 }}>
              <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
              <div className="grid grid-cols-3 gap-8" style={{ marginTop: 28 }}>
                <Stat value={9} label="Estados Nordestinos" />
                <Stat value={500} label="Empresários no Movimento" suffix="+" />
                <Stat value={24} label="Posicionamento Ativo" suffix="/7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: layout em duas colunas (inalterado) */}
      <div className="hidden md:grid grid-cols-[55%_45%] min-h-[100vh] relative z-10">
        <div className="relative flex flex-col justify-center" style={{ padding: "120px 24px 72px" }}>
          <div className="max-w-[560px]">
            <div className="hero-anim hero-d-1">
              <span className="eyebrow">O Movimento</span>
            </div>
            <p className="pre-display hero-anim hero-d-2" style={{ marginTop: 10 }}>
              Chegou a hora do Brasil conhecer
            </p>
            <h1 className="typo-display accent-text hero-anim hero-d-3 text-5xl" style={{ marginTop: 2 }}>
              Os Novos<br />Nordestinos
            </h1>
            <p className="typo-body hero-anim hero-d-4" style={{ marginTop: 24 }}>
              <strong>Empresário e profissionais nordestinos</strong> que já constroem resultado, mas agora decidiram ser{" "}
              <span className="accent-text" style={{ fontWeight: 400 }}>vistos, valorizados e respeitados</span>{" "}
              no nível que realmente são.
            </p>
            <div className="flex flex-wrap items-center gap-6 hero-anim hero-d-5" style={{ marginTop: 36 }}>
              <a href="#cta-final" className="btn-primary">
                Iniciar Avaliação
                <Play size={13} fill="currentColor" />
              </a>
              <a href="#manifesto" className="btn-ghost">
                Ver o manifesto
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="hero-anim hero-d-6" style={{ marginTop: 56 }}>
              <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
              <div className="grid grid-cols-3 gap-8" style={{ marginTop: 28 }}>
                <Stat value={9} label="Estados Nordestinos" />
                <Stat value={500} label="Empresários no Movimento" suffix="+" />
                <Stat value={24} label="Posicionamento Ativo" suffix="/7" />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-photo-wrap" style={{ minHeight: "55vw", maxHeight: "100vh" }}>
          <img src={founderHeroGlow} alt="Idealizador d'Os Novos Nordestinos" loading="eager" decoding="async" />
          <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", color: "rgba(242,240,235,0.6)" }}>ONN</span>
            <span className="block w-12 h-px" style={{ background: "rgba(242,240,235,0.25)" }} />
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", color: "var(--accent)" }}>2K26</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return (
    <div>
      <div className="accent-text"
        style={{ fontFamily: "var(--font)", fontWeight: 900, fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
        <Counter end={value} />
        {suffix}
      </div>
      <div className="typo-label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ─────────── MANIFESTO ─────────── */
function ManifestoSection() {
  const cards = [
    { title: "Diagnóstico de Posicionamento", desc: "Vamos analisar como o mercado realmente enxerga você hoje — onde está sua autoridade, onde estão os ruídos e onde mora o dinheiro escondido na sua percepção." },
    { title: "Mapeamento da Audiência Premium", desc: "Identificamos exatamente quem é o cliente que paga mais e respeita mais — para você parar de atender qualquer um e começar a atrair os melhores." },
    { title: "Arquitetura de Marca Pessoal", desc: "Construímos a estrutura completa da sua presença digital: comunicação, estética, narrativa e conteúdo no nível de quem você realmente é." },
    { title: "Implementação do Clone Digital", desc: "Ativamos o sistema que trabalha seu posicionamento 24/7 — sem exigir seu tempo, sem você precisar gravar nada, sem aparecer se não quiser." },
  ];

  return (
    <section id="manifesto" className="relative px-6"
      style={{ background: "var(--bg)", paddingTop: 120, paddingBottom: 120, borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-[88px] items-center">
        <div>
          <Reveal>
            <span className="eyebrow">Quem Somos</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="typo-headline" style={{ marginTop: 10 }}>
              O Nordeste<br />
              Sempre Produziu.<br />
              <span className="highlight-word">Agora é Visto.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="typo-body" style={{ marginTop: 22 }}>
              Nascemos com um propósito: mostrar pro Brasil que o Nordeste produz
              empresários sofisticados, negócios milionários e marcas no nível
              das maiores do país.
            </p>
            <p className="typo-body">
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

        <div className="grid grid-cols-2 gap-[2px]">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card h-full">
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

/* ─────────── AUDIENCE ─────────── */
function AudienceSection() {
  const profiles = [
    { icon: <Store size={22} />, title: "Donos de negócios do mundo físico", desc: "Lojas, clínicas, escritórios, prestadores de serviço presencial. Você sente que está preso na operação e que o digital não traduz o tamanho real da sua empresa." },
    { icon: <TrendingUp size={22} />, title: "Empresários em escala", desc: "Sua empresa já fatura bem, mas ainda faz 80% dos processos na mão. Está na hora de profissionalizar a percepção e escalar com margem — não com volume." },
    { icon: <Scale size={22} />, title: "Profissionais liberais", desc: "Advogados, médicos, contadores, consultores. Você vende seu tempo e sabe que tem um teto. Posicionamento te ajuda a cobrar mais, atender melhor e parar de ser refém da própria agenda." },
    { icon: <Briefcase size={22} />, title: "Especialistas e autoridades", desc: "Você já tem conhecimento, resultado e bagagem. Falta apenas a estrutura digital pra que o mercado pare de te tratar como mais um e comece a te tratar como referência." },
  ];

  return (
    <section id="para-quem" className="relative px-6"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", paddingTop: 110, paddingBottom: 110 }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <div className="flex justify-center">
              <span className="eyebrow eyebrow--center">Para Quem É</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="typo-headline" style={{ marginTop: 14 }}>
              Esse movimento é<br />
              <span className="accent-text">para você se…</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="typo-body mx-auto text-center" style={{ marginTop: 12, maxWidth: 480 }}>
              Você se encaixa em um desses perfis e quer usar posicionamento pra
              crescer de verdade.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-lg overflow-hidden"
            style={{ background: "var(--border-subtle)", border: "1px solid var(--border-subtle)" }}>
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

/* ─────────── FOUNDER ─────────── */
function FounderSection() {
  return (
    <section className="relative px-6"
      style={{ background: "var(--bg)", paddingTop: 120, paddingBottom: 120, borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-[900px] mx-auto">
        <Reveal>
          <span className="eyebrow">Quem Está Por Trás</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="typo-headline" style={{ marginTop: 10, lineHeight: 1.15 }}>
            Muito Prazer,<br />
            <span className="accent-text">Os Novos Nordestinos</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="typo-label typo-label--accent" style={{ marginTop: 28, lineHeight: 1.6 }}>
            Movimento de Posicionamento Digital · Especialistas em Autoridade de Marca
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p className="typo-body" style={{ marginTop: 28, maxWidth: 720, lineHeight: 1.8 }}>
            Nascemos com um propósito: mostrar pro Brasil que o Nordeste produz
            empresários sofisticados, negócios milionários e marcas no nível
            das maiores do país. Hoje, à frente do movimento, ajudamos
            empresários nordestinos a implementar uma{" "}
            <strong>Arquitetura de Posicionamento Digital</strong>{" "}
            de ponta a ponta — transformando autoridade em ticket maior, mais
            tempo livre e respeito de mercado.
          </p>
        </Reveal>
        <Reveal delay={280}>
          <div
            className="founder-photo-placeholder"
            style={{
              marginTop: 56,
              width: "100%",
              maxWidth: 720,
              aspectRatio: "16 / 10",
              borderRadius: 12,
              border: "1px dashed var(--border-subtle)",
              background: "var(--bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="typo-label" style={{ color: "var(--text-ghost)" }}>
              Espaço reservado para foto
            </span>
          </div>
        </Reveal>
        <Reveal delay={340}>
          <div style={{ marginTop: 48 }}>
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

/* ─────────── IMPACT (Ganhos) ─────────── */
function ImpactSection() {
  const gains = [
    { lead: "Sua autoridade cresce sozinha", desc: "porque o seu nome passa a circular nos lugares certos, com o peso certo, sem você precisar correr atrás." },
    { lead: "Seu valor percebido explode", desc: "e o mercado começa a te enxergar como referência, não como mais uma opção entre tantas." },
    { lead: "Seu ticket médio sobe exponencialmente", desc: "com clientes que pagam pelo posicionamento, pela entrega e pela autoridade — não pelo menor preço." },
    { lead: "Sua agenda finalmente desafoga", desc: "você atende menos, com mais qualidade, e recupera tempo pra viver, pensar e crescer de verdade." },
  ];

  return (
    <section id="ganhos" className="relative px-6"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border-subtle)", paddingTop: 120, paddingBottom: 120 }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end mb-14">
          <div>
            <Reveal>
              <span className="eyebrow">Como Isso Muda Sua Vida</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="typo-headline" style={{ marginTop: 12 }}>
                O que muda<br />
                <span className="accent-text">na sua vida</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <a href="#cta-final" className="btn-secondary">
              Quero ser selecionado
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-[2px]">
          {gains.map((g, i) => (
            <Reveal key={i} delay={i * 80}>
              <a href="#cta-final" className="ganho-item">
                <span className="ganho-numero">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="ganho-titulo">{g.lead}</p>
                  <p className="ganho-desc">{g.desc}</p>
                </div>
                <span className="ganho-arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <blockquote className="quote-block" style={{ marginTop: 48, maxWidth: 560 }}>
            <p>
              Você deixa de viver no <span style={{ color: "var(--text-primary)" }}>volume exaustivo</span>
              {" "}— e passa a viver no{" "}
              <span className="highlight-word">valor premium.</span>
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
    <section className="relative px-6"
      style={{ background: "var(--bg)", paddingTop: 100, paddingBottom: 100, borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-[1100px] mx-auto text-center">
        <Reveal>
          <h2 className="typo-display" style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
            Durante anos tentaram<br />
            contar a <span className="highlight-word">nossa história.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="typo-label typo-label--accent" style={{ marginTop: 28 }}>
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
    <section id="cta-final" className="section-cta px-6"
      style={{ paddingTop: 150, paddingBottom: 150 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="watermark-onn">ONN</span>
      </div>
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        width="900" height="900" viewBox="0 0 900 900" fill="none" style={{ zIndex: 0 }}>
        <circle cx="450" cy="450" r="200" stroke="rgba(224,140,50,0.04)" strokeWidth="1" />
        <circle cx="450" cy="450" r="320" stroke="rgba(224,140,50,0.03)" strokeWidth="1" />
        <circle cx="450" cy="450" r="440" stroke="rgba(224,140,50,0.02)" strokeWidth="1" />
      </svg>

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        <Reveal>
          <div className="flex justify-center">
            <span className="eyebrow eyebrow--center">A Hora É Agora</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="typo-display" style={{ marginTop: 22 }}>
            Pronto para ser<br />
            <span className="accent-text">visto de verdade?</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="typo-body mx-auto" style={{ marginTop: 18, maxWidth: 440, fontSize: 17 }}>
            Entre para o movimento exclusivo de empresários que estão
            redefinindo o padrão de autoridade nordestina no cenário digital
            nacional.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-5" style={{ marginTop: 48 }}>
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
    <footer className="px-6"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border-subtle)", paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p style={{ fontFamily: "var(--font)", fontWeight: 400, fontSize: 12, color: "var(--text-ghost)" }}>
          © 2026 Os Novos Nordestinos. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-3">
          <img src={logoOnn} alt="ONN" className="w-5 h-5 object-contain opacity-60" />
          <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-ghost)" }}>
            ONN — 2K26
          </span>
        </div>
      </div>
    </footer>
  );
}
