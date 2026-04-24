import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useRef, type ReactNode } from "react";
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
import founderArmchair from "@/assets/founder-armchair.jpg";
import quemSomosBgMobile from "@/assets/quem-somos-bg-mobile.jpg";
import quemSomosBgDesktop from "@/assets/quem-somos-bg-desktop.jpg";
import { VSLPlayer } from "@/components/VSLPlayer";

const WHATSAPP_URL = "https://wa.me/5581996392616";

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
      { rel: "preload", as: "image", href: founderHeroGlow, fetchpriority: "high" },
      { rel: "preload", as: "image", href: founderArmchair, fetchpriority: "high" },
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

/* ─────────── SCROLL-PROGRESS REVEAL (word-by-word + block-by-block) ─────────── */
function useScrollProgressReveal(
  ref: React.RefObject<HTMLElement | null>,
  selector: string,
  opts: { activeRatio?: number; deactivate?: boolean } = {},
) {
  const { activeRatio = 0.85, deactivate = true } = opts;
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = ref.current;
    if (!root) return;

    // Sinaliza ao CSS que o JS de reveal está vivo (libera fallback)
    document.documentElement.classList.add("reveal-ready");

    const activateAll = () => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => el.classList.add("is-active"));
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      activateAll();
      return;
    }

    // Fallback: IntersectionObserver indisponível
    if (typeof IntersectionObserver === "undefined") {
      activateAll();
      return;
    }

    let raf = 0;
    let ticking = false;
    let visible = false;
    let watchdog: ReturnType<typeof setTimeout> | null = null;

    const update = () => {
      ticking = false;
      const els = root.querySelectorAll<HTMLElement>(selector);
      const line = window.innerHeight * activeRatio;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const isActive = center < line;
        if (isActive) {
          if (!el.classList.contains("is-active")) el.classList.add("is-active");
        } else if (deactivate) {
          if (el.classList.contains("is-active")) el.classList.remove("is-active");
        }
      });
    };

    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    try {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            visible = e.isIntersecting;
            if (visible) {
              ticking = true;
              raf = requestAnimationFrame(update);
            }
          });
        },
        { rootMargin: "200px 0px 200px 0px" },
      );
      io.observe(root);

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      // initial
      ticking = true;
      raf = requestAnimationFrame(update);

      // Watchdog: se nada ativou em 1.5s, força ativar tudo
      watchdog = setTimeout(() => {
        const els = root.querySelectorAll<HTMLElement>(selector);
        const anyActive = Array.from(els).some((el) => el.classList.contains("is-active"));
        if (!anyActive) els.forEach((el) => el.classList.add("is-active"));
      }, 1500);

      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(raf);
        if (watchdog) clearTimeout(watchdog);
      };
    } catch {
      activateAll();
      return;
    }
  }, [ref, selector, activeRatio, deactivate]);
}

function splitNodeIntoWords(node: ReactNode, keyPrefix: string): ReactNode[] {
  if (node == null || node === false || node === true) return [];
  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.length === 0) return null;
      if (/^\s+$/.test(part)) return part;
      return (
        <span key={`${keyPrefix}-w-${i}`} className="reveal-word">
          {part}
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return node.flatMap((n, i) => splitNodeIntoWords(n, `${keyPrefix}-${i}`));
  }
  // React element: recurse into children, preserve element type and props
  if (typeof node === "object" && "type" in (node as object)) {
    const el = node as React.ReactElement<{ children?: ReactNode }>;
    if (el.props && "children" in el.props) {
      const newChildren = splitNodeIntoWords(el.props.children, `${keyPrefix}-c`);
      return [
        React.cloneElement(el, { key: `${keyPrefix}-el`, children: newChildren } as Partial<{ children?: ReactNode }>),
      ];
    }
  }
  return [node];
}

function RevealWords({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useScrollProgressReveal(ref, ".reveal-word", { activeRatio: 0.75, deactivate: true });
  return (
    <p ref={ref} className={className} style={style}>
      {splitNodeIntoWords(children, "rw")}
    </p>
  );
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

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      rafId = 0;
      dot.style.left = lastX + "px";
      dot.style.top = lastY + "px";
      outer.style.left = lastX + "px";
      outer.style.top = lastY + "px";
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const isInteractive = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return !!target.closest("a, button, [role='button']");
    };

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) outer.classList.add("hovered");
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) outer.classList.remove("hovered");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (rafId) cancelAnimationFrame(rafId);
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
          <CTABlock />
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

        <RevealWords className="typo-body mx-auto text-center hero-anim hero-d-3" style={{ maxWidth: 420, marginTop: 14 }}>
          O que você vai ver nos próximos minutos pode mudar a forma como você
          se posiciona no digital.
        </RevealWords>

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
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 60);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav className={`onn-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="onn-nav__inner">
        <a href="#hero-intro" className="onn-nav__logo">
          <img src={logoOnn} alt="Os Novos Nordestinos" className="w-7 h-7 object-contain" />
          <span className="onn-nav__logo-text">ONN</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#manifesto" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Manifesto</a>
          <a href="#para-quem" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Para Quem</a>
          <a href="#ganhos" className="typo-label" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Ganhos</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="onn-nav__cta">Solicitar Avaliação</a>
        </div>

        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="onn-nav__cta onn-nav__cta--mobile md:hidden">
          Solicitar Avaliação
        </a>

        <button onClick={() => setMenuOpen(true)} className="onn-nav__burger md:hidden" aria-label="Abrir menu">
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
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="btn-primary mt-6 self-start">
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
            <RevealWords className="typo-body hero-anim hero-d-4" style={{ marginTop: 24 }}>
              <strong>Empresário e profissionais nordestinos</strong> que já constroem resultado, mas agora decidiram ser{" "}
              <span className="accent-text" style={{ fontWeight: 400 }}>vistos, valorizados e respeitados</span>{" "}
              no nível que realmente são.
            </RevealWords>
            <div className="flex flex-wrap items-center gap-6 hero-anim hero-d-5" style={{ marginTop: 36 }}>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
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
            <RevealWords className="typo-body hero-anim hero-d-4" style={{ marginTop: 24 }}>
              <strong>Empresário e profissionais nordestinos</strong> que já constroem resultado, mas agora decidiram ser{" "}
              <span className="accent-text" style={{ fontWeight: 400 }}>vistos, valorizados e respeitados</span>{" "}
              no nível que realmente são.
            </RevealWords>
            <div className="flex flex-wrap items-center gap-6 hero-anim hero-d-5" style={{ marginTop: 36 }}>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Iniciar Avaliação
                <Play size={13} fill="currentColor" />
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
          <div className="hero-photo-glow" aria-hidden="true" />
          <img src={founderHeroGlow} alt="Idealizador d'Os Novos Nordestinos" loading="eager" decoding="async" />
          <div className="hero-photo-mask-left" aria-hidden="true" />
          <div className="hero-photo-mask-bottom" aria-hidden="true" />
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
    <section
      id="manifesto"
      className="quem-somos"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        ["--qs-bg-image-mobile" as string]: `url(${quemSomosBgMobile})`,
        ["--qs-bg-image-desktop" as string]: `url(${quemSomosBgDesktop})`,
      } as React.CSSProperties}
    >
      <div className="quem-somos__content mx-auto">
        <Reveal>
          <div className="qs-eyebrow">Quem Somos</div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="qs-headline">
            <span className="l1">O Nordeste</span>
            <span className="l2">Sempre</span>
            <span className="l3">Produziu.</span>
            <span className="l4">Agora é visto.</span>
          </h2>
          <hr className="qs-divider" />
        </Reveal>

        <Reveal delay={140}>
          <div className="qs-highlight">Nascemos com um propósito:</div>
        </Reveal>

        <Reveal delay={180}>
          <p className="qs-body">
            Mostrar para o <em>Brasil</em> que o <strong>nordeste produz</strong>
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="qs-cards">
            <div className="qs-card">Empresários sofisticados</div>
            <div className="qs-card">Negócios milionários</div>
            <div className="qs-card">Marcas no nível das maiores do país.</div>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <p className="qs-body qs-block-6">Hoje, à frente do movimento, ajudamos</p>
        </Reveal>

        <Reveal delay={300}>
          <div className="qs-highlight qs-highlight--upper">EMPRESÁRIOS NORDESTINOS</div>
        </Reveal>

        <Reveal delay={340}>
          <p className="qs-body qs-body--close">
            a implementar uma <strong>Arquitetura de Posicionamento Digital</strong> de ponta a ponta.
            <br />
            <em>Transformando autoridade</em> em ticket maior, mais tempo livre e respeito de mercado.
          </p>
        </Reveal>

        <div className="quem-somos__manifesto-cards grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card h-full">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{c.title}</h4>
                <RevealWords>{c.desc}</RevealWords>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── AUDIENCE (Fan-out cards pin scroll) ─────────── */
function AudienceSection() {
  const profiles = [
    { icon: <Store size={22} />, title: "Donos de negócios do mundo físico", desc: "Lojas, clínicas, escritórios, prestadores de serviço presencial. Você sente que está preso na operação e que o digital não traduz o tamanho real da sua empresa." },
    { icon: <TrendingUp size={22} />, title: "Empresários em escala", desc: "Sua empresa já fatura bem, mas ainda faz 80% dos processos na mão. Está na hora de profissionalizar a percepção e escalar com margem — não com volume." },
    { icon: <Scale size={22} />, title: "Profissionais liberais", desc: "Advogados, médicos, contadores, consultores. Você vende seu tempo e sabe que tem um teto. Posicionamento te ajuda a cobrar mais, atender melhor e parar de ser refém da própria agenda." },
    { icon: <Briefcase size={22} />, title: "Especialistas e autoridades", desc: "Você já tem conhecimento, resultado e bagagem. Falta apenas a estrutura digital pra que o mercado pare de te tratar como mais um e comece a te tratar como referência." },
  ];

  const leadProfile = profiles[0];
  const backProfiles = [profiles[1], profiles[2], profiles[3]];

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrapper = wrapperRef.current;
    const stack = stackRef.current;
    if (!wrapper || !stack) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Detecta dispositivo fraco (GPU/CPU/RAM limitada): celulares antigos.
    // Critérios: pouca RAM (<= 2GB) OU poucos núcleos (<= 4) em conexão lenta,
    // OU navegador pediu economia de dados. Mantém o efeito em qualquer device decente.
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const lowCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const saveData = nav.connection?.saveData === true;
    const slowNet = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
    const isMobile = window.matchMedia("(max-width: 540px)").matches;
    const lowGpu = saveData || lowMemory || (isMobile && lowCores && slowNet);
    if (lowGpu) {
      document.documentElement.classList.add("low-gpu");
    }
    if (reduced || lowGpu) return;

    // Cacheia métricas pesadas (offsetHeight força layout). Só recalcula no resize.
    let total = wrapper.offsetHeight - window.innerHeight;
    let viewportH = window.innerHeight;
    const recalc = () => {
      total = wrapper.offsetHeight - window.innerHeight;
      viewportH = window.innerHeight;
    };

    // Pré-calcula constantes do timeline pra evitar trabalho por frame.
    const FAN_END = isMobile ? 0.3 : 0.25;
    const INV_FAN_END = 1 / FAN_END;

    // Cache do último valor escrito em cada custom property — evita
    // setProperty redundante (cada chamada invalida estilo computado).
    const last: Record<string, string> = {};
    const setVar = (name: string, value: number) => {
      const v = value.toFixed(2);
      if (last[name] === v) return;
      last[name] = v;
      stack.style.setProperty(name, v);
    };

    let visible = false;
    let ticking = false;
    let lastProgress = -1;

    const update = () => {
      ticking = false;
      if (total <= 0) return;
      // getBoundingClientRect().top em vez de calcular de novo offsetTop.
      const top = wrapper.getBoundingClientRect().top;
      const progress = top >= 0 ? 0 : top <= -total ? 1 : -top / total;
      // Skip se variação < 0.3% (sub-pixel em telas comuns).
      if (Math.abs(progress - lastProgress) < 0.003) return;
      lastProgress = progress;

      // Smoothstep: easing suave (ease-in-out) em cada transição entre cards,
      // mata os "cortes" lineares que pareciam jumps duros.
      const seg = (start: number, end: number) => {
        const t = (progress - start) / (end - start);
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        return t * t * (3 - 2 * t);
      };

      let fanRaw = progress * INV_FAN_END;
      if (fanRaw > 1) fanRaw = 1;
      // Ease-out cubic em todos os devices: o leque desacelera no final
      // (movimento natural, sem "estalar" ao chegar aberto).
      const inv = 1 - fanRaw;
      const fanProgress = 1 - inv * inv * inv;

      setVar("--fan", fanProgress);
      setVar("--focus", seg(0.25, 0.36));
      setVar("--slide", seg(0.34, 0.45));
      setVar("--focus-3", seg(0.43, 0.54));
      setVar("--slide-3", seg(0.52, 0.63));
      setVar("--focus-2", seg(0.61, 0.72));
      setVar("--slide-2", seg(0.7, 0.81));
      setVar("--focus-1", seg(0.79, 0.9));
      setVar("--slide-1", seg(0.88, 1));
    };

    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      recalc();
      lastProgress = -1;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Só escuta scroll quando o pin está realmente em cena.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) {
            lastProgress = -1;
            if (!ticking) {
              ticking = true;
              requestAnimationFrame(update);
            }
          }
        }
      },
      { rootMargin: "100px 0px 100px 0px" },
    );
    io.observe(wrapper);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="para-quem"
      ref={wrapperRef}
      className="audience-pin"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div className="audience-pin__sticky">
        <div className="audience-pin__header px-6">
          <div className="max-w-[1200px] mx-auto text-center">
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
              <RevealWords className="typo-body mx-auto text-center" style={{ marginTop: 12, maxWidth: 480 }}>
                Você se encaixa em um desses perfis e quer usar posicionamento pra crescer de verdade.
              </RevealWords>
            </Reveal>
          </div>
        </div>

        <div className="fan-stack-wrap">
          <div className="fan-stack" ref={stackRef}>
            {backProfiles.map((p, i) => (
              <div key={`bg-${i}`} className={`fan-card fan-card--bg-${i + 1}`}>
                <div className="icon-box">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
            <div className="fan-card fan-card--lead">
              <div className="icon-box">{leadProfile.icon}</div>
              <h3>{leadProfile.title}</h3>
              <p>{leadProfile.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FOUNDER ─────────── */
function FounderSection() {
  return (
    <section className="founder-bleed">
      <img
        src={founderArmchair}
        alt="Fundador — Os Novos Nordestinos"
        className="founder-bleed__bg"
        loading="eager"
        fetchPriority="high"
      />
      <div className="founder-bleed__overlay" aria-hidden="true" />
      <div className="founder-bleed__content">
        <Reveal>
          <div className="founder-bleed__label">
            <span className="founder-bleed__dash" aria-hidden="true" />
            Quem Está Por Trás
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="typo-headline typo-headline--display">
            <span className="founder-bleed__line founder-bleed__line--white">Muito Prazer,</span>
            <span className="founder-bleed__line founder-bleed__line--gold">Os Novos</span>
            <span className="founder-bleed__line founder-bleed__line--gold">Nordestinos</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="founder-bleed__sub">
            Movimento de Posicionamento Digital.<br />
            Especialistas em Autoridade de Marca.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="founder-cta">
            <img src={logoOnn} alt="" className="founder-cta__icon" />
            <span className="founder-cta__text">
              <span>Quero Entrar</span>
              <span>Para o Movimento</span>
            </span>
          </a>
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

  const listRef = useRef<HTMLDivElement>(null);
  useScrollProgressReveal(listRef, ".ganho-item", { activeRatio: 0.78, deactivate: true });

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
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Quero ser selecionado
            </a>
          </Reveal>
        </div>

        <div ref={listRef} className="flex flex-col gap-[2px]">
          {gains.map((g, i) => (
            <div key={i} className="ganho-item scroll-fade">
              <span className="ganho-numero">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <RevealWords className="ganho-titulo">{g.lead}</RevealWords>
                <RevealWords className="ganho-desc">{g.desc}</RevealWords>
              </div>
              <span className="ganho-arrow">→</span>
            </div>
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

/* ─────────── DURANTE ANOS HEADLINE — scroll-zoom ─────────── */
function DuranteAnosHeadline() {
  const sectionRef = useRef<HTMLElement>(null);
  const phraseRefs = [
    useRef<HTMLHeadingElement>(null),
    useRef<HTMLHeadingElement>(null),
    useRef<HTMLHeadingElement>(null),
  ];

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      phraseRefs.forEach((r) => {
        if (r.current) {
          r.current.style.setProperty("--s", "1");
          r.current.style.setProperty("--o", "1");
        }
      });
      return;
    }

    let raf = 0;
    const smoothstep = (t: number) => {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    };

    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));

      const N = 3;
      const overlap = 0.05;
      for (let i = 0; i < N; i++) {
        const start = i / N - (i > 0 ? overlap : 0);
        const end = (i + 1) / N + (i < N - 1 ? overlap : 0);
        const local = (progress - start) / (end - start);
        let s = 1;
        let o = 0;
        if (local <= 0) {
          s = 1.6;
          o = 0;
        } else if (local >= 1) {
          s = 0.5;
          o = 0;
        } else if (local < 0.4) {
          const t = smoothstep(local / 0.4);
          s = 1.6 - 0.6 * t;
          o = t;
        } else if (local < 0.6) {
          s = 1;
          o = 1;
        } else {
          const t = smoothstep((local - 0.6) / 0.4);
          s = 1 - 0.5 * t;
          o = 1 - t;
        }
        const node = phraseRefs[i].current;
        if (node) {
          node.style.setProperty("--s", s.toFixed(4));
          node.style.setProperty("--o", o.toFixed(4));
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="durante-anos-pin">
      <div className="durante-anos-stage">
        <h2 ref={phraseRefs[0]} className="durante-anos-phrase">
          Durante anos tentaram
        </h2>
        <h2 ref={phraseRefs[1]} className="durante-anos-phrase">
          contar a <span className="highlight-word">nossa história.</span>
        </h2>
        <h2 ref={phraseRefs[2]} className="durante-anos-phrase durante-anos-phrase--accent">
          Agora é a nossa vez.
        </h2>
      </div>
    </section>
  );
}

/* ─────────── FINAL CTA ─────────── */
function FinalCTA() {
  return (
    <section id="cta-final" className="section-cta px-6">
      <div className="final-cta-sticky">
        <div className="final-cta-inner relative max-w-[1100px] mx-auto text-center">
          <h2 className="typo-display final-cta-headline final-cta-headline--static">
            Pronto para ser
            <br />
            <span className="accent-text">visto de verdade?</span>
          </h2>
          <div className="final-cta-actions">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-primary--lg">
              A Sua Chance
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── CTA BLOCK (eyebrow + paragraph + buttons + quote) ─────────── */
function CTABlock() {
  return (
    <section id="cta-block" className="section-cta-block px-6"
      style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
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
        <Reveal delay={160}>
          <RevealWords className="typo-body mx-auto" style={{ marginTop: 18, maxWidth: 440, fontSize: 17 }}>
            Entre para o movimento exclusivo de empresários que estão
            redefinindo o padrão de autoridade nordestina no cenário digital
            nacional.
          </RevealWords>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-5" style={{ marginTop: 48 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-primary--lg">
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
