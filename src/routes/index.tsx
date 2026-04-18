import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Lock, Sparkles } from "lucide-react";
import logoOnn from "@/assets/logo-onn.png";
import heroBgFlame from "@/assets/hero-bg-flame.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Os Novos Nordestinos — Posicionamento Digital de Elite" },
      {
        name: "description",
        content:
          "Movimento de empresários nordestinos que decidiram ser vistos, valorizados e respeitados no nível que realmente são. Atender menos, cobrar mais.",
      },
      {
        property: "og:title",
        content: "Os Novos Nordestinos — Posicionamento Digital de Elite",
      },
      {
        property: "og:description",
        content:
          "Construímos toda a sua presença digital — Clone Digital que trabalha por você 24/7.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: NovosNordestinos,
});

function NovosNordestinos() {
  const [vslStatus, setVslStatus] = useState<"idle" | "watching" | "finished">(
    "idle",
  );
  const [vslElapsed, setVslElapsed] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const MIN_WATCH = 30;
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (vslStatus === "watching" && vslElapsed < MIN_WATCH) {
      interval = setInterval(() => {
        setVslElapsed((prev) => prev + 1);
      }, 1000);
    } else if (vslStatus === "watching" && vslElapsed >= MIN_WATCH) {
      setVslStatus("finished");
      unlockContent();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vslStatus, vslElapsed]);

  const startVSL = () => setVslStatus("watching");

  const unlockContent = () => {
    setIsLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          setIsUnlocked(true);
        }, 500);
      }
      setLoadProgress(progress);
    }, 50);
  };

  if (!isUnlocked) {
    if (isLoading) {
      return (
        <div
          id="brand-loader"
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-6 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brasa/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite] pointer-events-none"></div>

          <div className="relative">
            <div className="text-[clamp(60px,12vw,130px)] font-black leading-tight tracking-tighter text-foreground/5 whitespace-nowrap select-none font-sans">
              ONN
            </div>
            <div
              className="absolute inset-0 text-[clamp(60px,12vw,130px)] font-black leading-tight tracking-tighter bg-gradient-to-br from-foreground to-brasa bg-clip-text text-transparent whitespace-nowrap font-sans filter drop-shadow-[0_0_30px_rgba(201,123,42,0.45)]"
              style={{ clipPath: `inset(0 ${100 - loadProgress}% 0 0)` }}
            >
              ONN
            </div>
          </div>

          <div className="w-full max-w-[420px] flex flex-col gap-2 px-6">
            <div className="w-full h-[2px] bg-foreground/10 rounded-full overflow-hidden relative">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-brasa to-brasa-viva transition-[width] duration-75"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono tracking-[0.25em] uppercase text-cinza-quente">
              <span>Carregando experiência</span>
              <span className="text-brasa">
                {Math.floor(loadProgress).toString().padStart(3, "0")}%
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <VslNavbar />
        <section
          id="vsl-gate"
          className="min-h-screen flex items-center justify-center pt-28 pb-16 relative overflow-hidden bg-background"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${heroBgFlame})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.55,
              maskImage:
                "radial-gradient(ellipse 75% 70% at 50% 45%, black 35%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 70% at 50% 45%, black 35%, transparent 85%)",
            }}
          ></div>
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-background/55 pointer-events-none"
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brasa/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite]"></div>

          <div className="relative z-10 text-center max-w-[700px] mx-auto px-6">
            <div className="mb-8 flex justify-center">
              <LogoIcon className="w-20 h-20 drop-shadow-[0_0_30px_rgba(201,123,42,0.4)]" />
            </div>

            <h1 className="text-[clamp(28px,5vw,48px)] font-black leading-[1.1] mb-4 uppercase tracking-[0.04em]">
              Antes de qualquer coisa,
              <br />
              <span className="bg-gradient-to-br from-brasa to-brasa-viva bg-clip-text text-transparent">
                assista isso.
              </span>
            </h1>
            <p className="text-sm text-cinza-quente max-w-[480px] mx-auto mb-8">
              O que você vai ver nos próximos minutos pode mudar a forma como
              você se posiciona no digital.
            </p>

            <div className="rounded-sm overflow-hidden border border-brasa/20 bg-territorio shadow-[0_0_60px_-10px_rgba(201,123,42,0.4)] mb-6">
              <div className="aspect-video bg-vazio flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brasa/10 to-transparent"></div>

                {vslStatus === "idle" && (
                  <button
                    onClick={startVSL}
                    className="relative z-10 flex flex-col items-center gap-3 bg-none border-none cursor-pointer text-foreground group"
                  >
                    <div className="w-24 h-24 rounded-full bg-brasa flex items-center justify-center relative shadow-[0_0_40px_rgba(201,123,42,0.5)] transition-transform duration-200 group-hover:scale-110">
                      <div className="absolute inset-0 rounded-full bg-brasa/40 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                      <Play className="ml-1 text-vazio fill-current" size={36} />
                    </div>
                    <span className="text-[11px] text-foreground/80 flex items-center gap-1.5 uppercase tracking-widest">
                      🔊 Assista com som ativado
                    </span>
                  </button>
                )}

                {vslStatus === "watching" && (
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 border-2 border-brasa/30 border-t-brasa rounded-full animate-spin"></div>
                    <p className="text-[11px] text-cinza-quente uppercase tracking-widest">
                      Reproduzindo apresentação…
                    </p>
                    <p className="text-xs font-mono text-brasa">
                      {Math.floor(vslElapsed / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(vslElapsed % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                )}

                {vslStatus === "finished" && (
                  <div className="relative z-10 text-foreground">
                    <Sparkles size={48} className="text-brasa mx-auto mb-4" />
                    <p className="text-sm font-semibold mb-2">
                      Apresentação concluída!
                    </p>
                  </div>
                )}
              </div>
              <div className="h-1.5 bg-vazio relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brasa to-brasa-viva transition-all duration-1000"
                  style={{
                    width: `${Math.min((vslElapsed / MIN_WATCH) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {vslStatus === "idle" && (
                <motion.div
                  key="hint-play"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-cinza-quente uppercase tracking-widest"
                >
                  ▶ Inicie a apresentação para liberar o restante da página
                </motion.div>
              )}

              {vslStatus === "watching" && (
                <motion.div
                  key="hint-waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-cinza-quente flex items-center justify-center gap-2"
                >
                  <Lock size={12} /> O conteúdo será liberado em instantes…
                </motion.div>
              )}

              {vslStatus === "finished" && (
                <motion.div
                  key="unlock-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-brasa uppercase tracking-widest"
                >
                  Liberando acesso…
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="relative">
      <div className="premium-bg">
        <div className="bg-grid"></div>
        <div className="bg-scanlines"></div>
      </div>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeStrip
          text="ECOSSISTEMA ESTRATÉGICO  ·  AUTORIDADE NORDESTINA  ·  POSICIONAMENTO DE ELITE  ·  CLONE DIGITAL  ·  OS NOVOS NORDESTINOS  ·  NOVA GERAÇÃO  ·  NOVO PADRÃO  ·"
          duration={35}
          variant="default"
        />
        <TruthSection />
        <GameChangeSection />
        <MovementSection />
        <MarqueeStrip
          text="NOVA GERAÇÃO  ·  NOVO PADRÃO  ·  INVISIBILIDADE NÃO É HUMILDADE  ·  CLONE DIGITAL  ·  AUTORIDADE REGIONAL  ·  POSICIONAMENTO NORDESTINO  ·"
          duration={40}
          variant="brasa"
          reverse
        />
        <SolutionSection />
        <CtaSection />
        <Footer />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAVBAR (pós-unlock) e NAVBAR (VSL gate)
   ───────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-vazio/70 border-b border-borda-onn">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-7 h-7" />
          <span className="text-[11px] font-black tracking-[0.18em] uppercase text-pergaminho">
            Os Novos Nordestinos
          </span>
        </div>
        <a
          href="#cta-final"
          className="hidden sm:inline-flex items-center px-5 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase text-vazio rounded-sm cta-btn"
          style={{ animation: "none" }}
        >
          Solicitar Avaliação
        </a>
      </div>
    </nav>
  );
}

function VslNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-brasa/10">
      <div className="max-w-[1200px] mx-auto px-5 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <LogoIcon className="w-10 h-10 shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold tracking-[0.18em] uppercase text-pergaminho">
              Os Novos
            </span>
            <span className="text-[13px] font-extrabold tracking-[0.18em] uppercase text-pergaminho">
              Nordestinos
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <img
      src={logoOnn}
      alt="Os Novos Nordestinos"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPERS — Reveal, Section Label, Brand Lines, Hex Decoration
   ───────────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 30,
  duration = 0.7,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 mb-6">
      <span className="block w-10 h-px bg-brasa" aria-hidden="true" />
      <span
        className="font-script text-[11px] tracking-[0.3em] uppercase text-brasa"
      >
        {children}
      </span>
    </div>
  );
}

function BrandLine({
  top,
  left,
  right,
  height = 180,
  rotate = -15,
  delay = 0,
}: {
  top?: string;
  left?: string;
  right?: string;
  height?: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="brand-line"
      style={{
        top,
        left,
        right,
        height: `${height}px`,
        transform: `rotate(${rotate}deg)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function HexDeco({
  size = 500,
  opacity = 0.06,
  duration = 25,
  reverse = false,
  top,
  left,
  right,
  bottom,
}: {
  size?: number;
  opacity?: number;
  duration?: number;
  reverse?: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="hex-deco"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
        top,
        left,
        right,
        bottom,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 01 — HERO
   ───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative pt-32 pb-24 px-6 overflow-hidden"
      style={{ background: "var(--ambient-hero)", minHeight: "100vh" }}
    >
      {/* Watermark ONN */}
      <span
        aria-hidden="true"
        className="absolute right-[-40px] top-1/2 -translate-y-1/2 font-black select-none pointer-events-none"
        style={{
          fontSize: "320px",
          color: "#1A1A1A",
          opacity: 0.5,
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        ONN
      </span>

      <BrandLine top="10%" left="6%" height={180} rotate={-15} />
      <BrandLine top="35%" right="8%" height={120} rotate={12} delay={1.5} />

      <div className="relative max-w-[900px] mx-auto">
        <Reveal y={20} duration={0.8}>
          <SectionLabel>
            Os Novos Nordestinos · Ecossistema Estratégico
          </SectionLabel>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[14px] font-semibold text-brasa mb-5">
            👉 Assista o vídeo abaixo antes de continuar
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="relative rounded-sm overflow-hidden border border-borda-onn mb-3"
            style={{
              background: "#0D0D0D",
              aspectRatio: "16 / 9",
              boxShadow: "0 0 60px rgba(201,123,42,0.10)",
            }}
          >
            {/* Progress bar decorativa no topo */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "var(--g-brasa)" }}
            />
            {/* Hexágono play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 96, height: 96 }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    border: "1.5px solid #C97B2A",
                    clipPath:
                      "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                />
                <Play
                  className="text-brasa relative z-10 ml-1"
                  size={32}
                  strokeWidth={2}
                />
              </div>
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="text-[12px] italic text-cinza-quente text-center mb-14">
            (conteúdo liberado após assistir o vídeo)
          </p>
        </Reveal>

        <Reveal y={50} duration={0.9} delay={0.1}>
          <h1
            className="font-black uppercase mb-6"
            style={{
              fontSize: "clamp(36px, 5.5vw, 56px)",
              letterSpacing: "0.06em",
              lineHeight: 1.0,
              color: "#F2F0EB",
            }}
          >
            Chegou a hora do Brasil conhecer os{" "}
            <span style={{ color: "#C97B2A" }}>Novos Nordestinos</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="text-cinza-quente"
            style={{
              fontSize: "18px",
              lineHeight: 1.8,
              maxWidth: "560px",
            }}
          >
            Empresários e profissionais que já constroem resultado — e agora
            decidiram ser vistos, valorizados e respeitados no nível que
            realmente são.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MARQUEE STRIP
   ───────────────────────────────────────────────────────────── */
function MarqueeStrip({
  text,
  duration = 35,
  reverse = false,
  variant = "default",
}: {
  text: string;
  duration?: number;
  reverse?: boolean;
  variant?: "default" | "brasa";
}) {
  // Repete o texto 4x para garantir loop infinito sem corte
  const items = Array.from({ length: 4 }, () => text);
  const textColor = variant === "brasa" ? "#C97B2A" : "#F2F0EB";
  const sepColor = variant === "brasa" ? "rgba(242,240,235,0.4)" : "#C97B2A";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid #2A2A2A",
        borderBottom: "1px solid #2A2A2A",
        padding: "14px 0",
      }}
    >
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="font-black uppercase whitespace-nowrap px-8"
            style={{
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: textColor,
            }}
          >
            {t.split("·").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <span style={{ color: sepColor }}>·</span>
                )}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 02 — A VERDADE QUE NINGUÉM FALA
   ───────────────────────────────────────────────────────────── */
function TruthSection() {
  return (
    <section
      className="relative px-6 py-28 overflow-hidden"
      style={{ background: "#111111", borderTop: "1px solid #C97B2A" }}
    >
      <HexDeco size={300} opacity={0.04} top="40px" right="-80px" duration={30} />

      <div className="relative max-w-[900px] mx-auto">
        <Reveal y={50} duration={0.9}>
          <h2
            className="font-black uppercase text-pergaminho"
            style={{
              fontSize: "clamp(30px, 4.5vw, 48px)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
            }}
          >
            A Verdade Que Ninguém Fala
          </h2>
          <span
            className="block mt-3 mb-12"
            style={{
              width: "60px",
              height: "2px",
              background: "#C97B2A",
            }}
            aria-hidden="true"
          />
        </Reveal>

        <div className="space-y-7 mb-12">
          <Reveal delay={0.1}>
            <p
              className="text-cinza-quente"
              style={{ fontSize: "17px", lineHeight: 1.9 }}
            >
              Você já construiu resultado. Tem empresa, faturamento, história.
              Mas se o digital não mostra isso — o mercado assume que isso não
              existe.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-cinza-quente"
              style={{ fontSize: "17px", lineHeight: 1.9 }}
            >
              E enquanto você permanece invisível, alguém menor, menos
              preparado, mas mais posicionado, ocupa o espaço que deveria ser
              seu.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={0} duration={0.8}>
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif-italic relative"
            style={{
              fontSize: "clamp(20px, 2.6vw, 28px)",
              color: "#F2F0EB",
              lineHeight: 1.5,
              borderLeft: "3px solid #C97B2A",
              paddingLeft: "28px",
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingRight: "20px",
              background: "rgba(201,123,42,0.04)",
              borderRadius: "0 4px 4px 0",
              boxShadow: "-3px 0 20px rgba(201,123,42,0.15)",
            }}
          >
            O mercado não escolhe o melhor. Escolhe o mais bem percebido.
          </motion.blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 03 — A MUDANÇA DE JOGO
   ───────────────────────────────────────────────────────────── */
function GameChangeSection() {
  const bullets = [
    "Seu ticket sobe",
    "Seu cliente muda",
    "Sua agenda desafoga",
  ];

  return (
    <section
      className="relative px-6 py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 800px 500px at 50% 50%, rgba(201,123,42,0.05) 0%, transparent 70%), #0A0A0A",
      }}
    >
      <BrandLine top="15%" left="4%" height={160} rotate={-18} />
      <BrandLine top="60%" right="6%" height={140} rotate={20} delay={1} />

      <div className="relative max-w-[900px] mx-auto">
        <Reveal y={50} duration={0.9}>
          <h2
            className="font-black uppercase mb-12"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
              color: "#F2F0EB",
            }}
          >
            A Mudança de <span style={{ color: "#C97B2A" }}>Jogo</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="text-cinza-quente mb-10"
            style={{ fontSize: "18px", lineHeight: 1.8 }}
          >
            Empresário cheio de clientes, mas cobrando barato, não tem negócio.
            Tem um emprego caro.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="text-pergaminho font-semibold mb-6"
            style={{ fontSize: "17px" }}
          >
            Quando você se posiciona da forma certa:
          </p>
        </Reveal>

        <div className="flex flex-col gap-4 mb-12">
          {bullets.map((b, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div
                className="group transition-all duration-300"
                style={{
                  background: "#1A1A1A",
                  borderLeft: "2px solid #C97B2A",
                  borderRadius: "2px",
                  padding: "20px 24px",
                  transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderLeftColor = "#E08C32";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(201,123,42,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderLeftColor = "#C97B2A";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <p
                  className="font-bold text-pergaminho"
                  style={{ fontSize: "17px" }}
                >
                  👉 {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} y={20} duration={1}>
          <motion.p
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-black text-pergaminho"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.25,
            }}
          >
            Você atende menos — e ganha mais. Com mais tempo e mais liberdade.
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 04 — O MOVIMENTO
   ───────────────────────────────────────────────────────────── */
function MovementSection() {
  return (
    <section
      className="relative px-6 py-28 overflow-hidden"
      style={{ background: "#111111" }}
    >
      {/* Watermark NORDESTE */}
      <span
        aria-hidden="true"
        className="absolute font-black select-none pointer-events-none whitespace-nowrap"
        style={{
          fontSize: "280px",
          color: "#191919",
          opacity: 0.6,
          left: "-60px",
          top: "50%",
          transform: "translateY(-50%) rotate(-5deg)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        NORDESTE
      </span>

      <div className="relative max-w-[900px] mx-auto">
        <Reveal y={50} duration={0.9}>
          <h2
            className="font-black uppercase"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
              background: "var(--g-brasa)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
            }}
          >
            O Movimento
          </h2>
          <span
            className="block mt-3 mb-12"
            style={{ width: "60px", height: "2px", background: "#C97B2A" }}
            aria-hidden="true"
          />
        </Reveal>

        <div className="space-y-7 mb-10">
          <Reveal delay={0.1}>
            <p
              className="text-cinza-quente"
              style={{ fontSize: "17px", lineHeight: 1.9 }}
            >
              Durante anos, tentaram definir o que é ser nordestino como
              sinônimo de pouca sofisticação e mercado limitado.
            </p>
          </Reveal>

          <Reveal y={60} duration={0.9} delay={0.15}>
            <p
              className="font-black uppercase text-brasa"
              style={{
                fontSize: "clamp(22px, 2.6vw, 28px)",
                letterSpacing: "0.06em",
              }}
            >
              Essa não é mais a realidade.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              className="text-cinza-quente"
              style={{ fontSize: "17px", lineHeight: 1.9 }}
            >
              Hoje existem empresários sofisticados, negócios milionários,
              estratégia e inovação no Nordeste. O problema? Isso ainda não é
              percebido como deveria.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p
              className="font-semibold text-pergaminho"
              style={{ fontSize: "20px", lineHeight: 1.6 }}
            >
              Quando um empresário nordestino se posiciona, ele não cresce
              sozinho. Ele muda a percepção de uma região inteira.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={0} duration={1}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
            style={{
              background: "rgba(201,123,42,0.05)",
              border: "1px solid rgba(201,123,42,0.15)",
              borderRadius: "4px",
              padding: "40px 48px",
              boxShadow: "0 0 40px rgba(201,123,42,0.06)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute font-black pointer-events-none select-none"
              style={{
                fontSize: "100px",
                color: "#C97B2A",
                opacity: 0.25,
                top: "-20px",
                left: "12px",
                lineHeight: 1,
                zIndex: 0,
              }}
            >
              “
            </span>
            <blockquote
              className="font-serif-italic relative text-pergaminho"
              style={{
                fontSize: "clamp(22px, 2.8vw, 32px)",
                lineHeight: 1.5,
                zIndex: 1,
              }}
            >
              Invisibilidade não é humildade. É perda de oportunidade.
            </blockquote>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 05 — A SOLUÇÃO
   ───────────────────────────────────────────────────────────── */
function SolutionSection() {
  const benefits = ["Sua autoridade cresce", "Seu ticket sobe", "Sua agenda desafoga"];

  return (
    <section
      className="relative px-6 py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 900px 600px at 50% 50%, rgba(201,123,42,0.09) 0%, transparent 65%), #0A0A0A",
      }}
    >
      <HexDeco size={600} opacity={0.03} top="-150px" left="-200px" duration={45} />

      <div className="relative max-w-[900px] mx-auto">
        <Reveal y={50} duration={0.9}>
          <h2
            className="font-black uppercase text-pergaminho mb-12"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
            }}
          >
            A Solução
          </h2>
        </Reveal>

        <Reveal y={0} duration={0.8} delay={0.1}>
          <motion.blockquote
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif-italic mb-10"
            style={{
              fontSize: "clamp(18px, 2.2vw, 24px)",
              color: "#5A5A52",
              lineHeight: 1.6,
              borderLeft: "2px solid #2A2A2A",
              paddingLeft: "24px",
            }}
          >
            “Não tenho tempo pra criar conteúdo… Não gosto de aparecer… Isso
            não é pra mim…”
          </motion.blockquote>
        </Reveal>

        <Reveal delay={0.15}>
          <p
            className="font-black uppercase mb-10"
            style={{
              fontSize: "clamp(24px, 3.6vw, 36px)",
              letterSpacing: "0.06em",
              lineHeight: 1.15,
            }}
          >
            <span style={{ color: "#C97B2A" }}>Perfeito.</span>{" "}
            <span style={{ color: "#F2F0EB" }}>
              Porque você não precisa fazer isso.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="text-cinza-quente mb-10"
            style={{ fontSize: "17px", lineHeight: 1.8 }}
          >
            Nós construímos toda a sua presença digital pra você — estruturando
            sua autoridade, criando sua comunicação e produzindo seus conteúdos
            estratégicos.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div
            className="border-pulse mb-12"
            style={{
              border: "1px solid rgba(201,123,42,0.3)",
              background: "#1A1A1A",
              borderRadius: "4px",
              padding: "28px 36px",
              boxShadow: "0 0 40px rgba(201,123,42,0.08)",
            }}
          >
            <p
              className="font-black"
              style={{
                fontSize: "clamp(20px, 2.6vw, 28px)",
                lineHeight: 1.3,
                color: "#F2F0EB",
              }}
            >
              👉 Criamos um{" "}
              <span style={{ color: "#C97B2A" }}>Clone Digital</span> que
              trabalha por você.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p
            className="font-semibold text-pergaminho mb-6"
            style={{ fontSize: "17px" }}
          >
            Enquanto você foca no negócio:
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div
                className="transition-all duration-300 h-full"
                style={{
                  background: "#111111",
                  borderTop: "2px solid #C97B2A",
                  borderRadius: "2px",
                  padding: "28px",
                  transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderTopColor = "#E08C32";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(201,123,42,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderTopColor = "#C97B2A";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <p
                  className="font-bold text-pergaminho"
                  style={{ fontSize: "16px" }}
                >
                  <span
                    className="inline-block mr-2 text-brasa"
                    style={{ fontSize: "18px" }}
                  >
                    ✔
                  </span>
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEÇÃO 06 — CTA FINAL
   ───────────────────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section
      id="cta-final"
      className="relative px-6 py-32 overflow-hidden scroll-mt-20"
      style={{ background: "var(--ambient-cta)" }}
    >
      <HexDeco size={500} opacity={0.05} top="10%" left="-100px" duration={30} />
      <HexDeco
        size={700}
        opacity={0.03}
        bottom="-200px"
        right="-150px"
        duration={45}
        reverse
      />
      <BrandLine top="8%" right="12%" height={170} rotate={14} />
      <BrandLine top="50%" left="6%" height={150} rotate={-16} delay={1.2} />
      <BrandLine top="78%" right="20%" height={130} rotate={20} delay={2} />

      <div className="relative max-w-[800px] mx-auto text-center">
        <Reveal y={30} duration={0.8}>
          <p
            className="text-cinza-quente mb-10"
            style={{ fontSize: "18px", lineHeight: 1.8 }}
          >
            Se você já construiu resultado e quer atender menos, cobrar mais e
            ser reconhecido no nível que já é:
          </p>
        </Reveal>

        <Reveal y={20} duration={1} delay={0.1}>
          <motion.a
            href="#"
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="cta-btn inline-flex items-center justify-center gap-3 font-black uppercase rounded-sm mb-10"
            style={{
              fontSize: "16px",
              letterSpacing: "0.08em",
              padding: "22px 56px",
            }}
          >
            <span className="relative z-10">
              👉 Solicite agora sua avaliação estratégica
            </span>
          </motion.a>
        </Reveal>

        <Reveal delay={0.25}>
          <p
            className="text-cinza-quente mb-16"
            style={{ fontSize: "15px" }}
          >
            Entre para o movimento que está redefinindo o Nordeste no digital.
          </p>
        </Reveal>

        <Reveal y={0} duration={1.2} delay={0.2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative inline-block"
          >
            <span
              aria-hidden="true"
              className="absolute pointer-events-none select-none font-black"
              style={{
                fontSize: "140px",
                color: "#C97B2A",
                opacity: 0.22,
                top: "-60px",
                left: "-20px",
                lineHeight: 1,
                zIndex: 0,
              }}
            >
              “
            </span>
            <span
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                inset: "-40px",
                background:
                  "radial-gradient(ellipse 300px 200px at 50% 50%, rgba(201,123,42,0.06) 0%, transparent 70%)",
                zIndex: 0,
              }}
            />
            <blockquote
              className="font-serif-italic relative text-pergaminho"
              style={{
                fontSize: "clamp(20px, 2.6vw, 28px)",
                lineHeight: 1.5,
                zIndex: 1,
              }}
            >
              O Nordeste não precisa de mais esforço. Precisa de mais
              posicionamento.
            </blockquote>
            <span
              aria-hidden="true"
              className="block mx-auto mt-8"
              style={{ width: "60px", height: "2px", background: "#C97B2A" }}
            />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="relative py-16 px-6 overflow-hidden"
      style={{ background: "#050505", borderTop: "1px solid #C97B2A" }}
    >
      <Reveal y={20} duration={0.8}>
        <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-3">
          <LogoIcon className="w-12 h-12 mb-2" />
          <p
            className="font-bold text-pergaminho"
            style={{ fontSize: "20px" }}
          >
            ONN
          </p>
          <p
            className="font-script text-brasa"
            style={{
              fontSize: "12px",
              letterSpacing: "0.12em",
            }}
          >
            Ecossistema · Mentalidade · Movimento
          </p>
          <p
            className="text-cinza-quente uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
            }}
          >
            Os Novos Nordestinos
          </p>
          <p style={{ fontSize: "12px", color: "#3A3A3A", marginTop: "12px" }}>
            © 2025 ONN · Todos os direitos reservados
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
