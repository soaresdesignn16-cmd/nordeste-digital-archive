import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Check, Lock, Sparkles } from "lucide-react";
import logoOnn from "@/assets/logo-onn.png";
import heroBgFlame from "@/assets/hero-bg-flame.jpg";

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

function VslNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(10, 10, 10, 0.85)",
        borderBottom: "1px solid #2A2A2A",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 h-20 flex items-center gap-3">
        <LogoIcon className="w-10 h-10 shrink-0" />
        <div className="flex flex-col leading-tight">
          <span
            className="text-[13px] font-extrabold uppercase"
            style={{ color: "#F2F0EB", letterSpacing: "0.18em" }}
          >
            Os Novos
          </span>
          <span
            className="text-[13px] font-extrabold uppercase"
            style={{ color: "#F2F0EB", letterSpacing: "0.18em" }}
          >
            Nordestinos
          </span>
        </div>
      </div>
    </nav>
  );
}


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

  // VSL Logic
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-custom/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite] pointer-events-none"></div>

          <div className="relative">
            <div className="text-[clamp(60px,12vw,130px)] font-black leading-tight tracking-tighter text-foreground/5 whitespace-nowrap select-none font-sans">
              ONN
            </div>
            <div
              className="absolute inset-0 text-[clamp(60px,12vw,130px)] font-black leading-tight tracking-tighter bg-gradient-to-br from-foreground to-primary-custom bg-clip-text text-transparent whitespace-nowrap font-sans filter drop-shadow-[0_0_30px_rgba(234,144,46,0.35)]"
              style={{ clipPath: `inset(0 ${100 - loadProgress}% 0 0)` }}
            >
              ONN
            </div>
          </div>

          <div className="w-full max-w-[420px] flex flex-col gap-2 px-6">
            <div className="w-full h-[2px] bg-foreground/10 rounded-full overflow-hidden relative">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-custom to-primary-light transition-[width] duration-75"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono tracking-[0.25em] uppercase text-muted-custom">
              <span>Carregando experiência</span>
              <span className="text-primary-custom">
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
        {/* Foto de fundo (chama nordestina) com fade nas bordas */}
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
        {/* Overlay escuro para legibilidade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-background/55 pointer-events-none"
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-custom/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite]"></div>
        <div className="relative z-10 text-center max-w-[700px] mx-auto px-6">
          <div className="mb-8 flex justify-center">
            <LogoIcon className="w-20 h-20 drop-shadow-[0_0_30px_rgba(234,144,46,0.4)]" />
          </div>

          <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold leading-[1.1] mb-4">
            Antes de qualquer coisa,
            <br />
            <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">
              assista isso.
            </span>
          </h1>
          <p className="text-sm text-cream-muted max-w-[480px] mx-auto mb-8">
            O que você vai ver nos próximos minutos pode mudar a forma como você
            se posiciona no digital.
          </p>

          <div className="rounded-2xl overflow-hidden border border-primary-custom/20 bg-card shadow-[0_0_40px_-10px_rgba(234,144,46,0.4)] mb-6">
            <div className="aspect-video bg-dark-surface flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/10 to-transparent"></div>

              {vslStatus === "idle" && (
                <button
                  onClick={startVSL}
                  className="relative z-10 flex flex-col items-center gap-3 bg-none border-none cursor-pointer text-foreground group"
                >
                  <div className="w-24 h-24 rounded-full bg-primary-custom flex items-center justify-center relative shadow-[0_0_40px_rgba(234,144,46,0.5)] transition-transform duration-200 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-primary-custom/40 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <Play className="ml-1 text-white fill-current" size={36} />
                  </div>
                  <span className="text-[11px] text-foreground/80 flex items-center gap-1.5 uppercase tracking-widest">
                    🔊 Assista com som ativado
                  </span>
                </button>
              )}

              {vslStatus === "watching" && (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 border-2 border-primary-custom/30 border-t-primary-custom rounded-full animate-spin"></div>
                  <p className="text-[11px] text-muted-custom uppercase tracking-widest">
                    Reproduzindo apresentação…
                  </p>
                  <p className="text-xs font-mono text-primary-custom">
                    {Math.floor(vslElapsed / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(vslElapsed % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              )}

              {vslStatus === "finished" && (
                <div className="relative z-10 text-foreground">
                  <Sparkles
                    size={48}
                    className="text-primary-custom mx-auto mb-4"
                  />
                  <p className="text-sm font-semibold mb-2">
                    Apresentação concluída!
                  </p>
                </div>
              )}
            </div>
            <div className="h-1.5 bg-dark-surface relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-custom to-primary-light transition-all duration-1000"
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
                className="text-[11px] text-muted-custom uppercase tracking-widest"
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
                className="text-[11px] text-muted-custom flex items-center justify-center gap-2"
              >
                <Lock size={12} /> O conteúdo será liberado em instantes…
              </motion.div>
            )}

            {vslStatus === "finished" && (
              <motion.div
                key="unlock-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-primary-custom uppercase tracking-widest"
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
    <div className="relative bg-[#0A0A0A] text-[#F2F0EB] font-display overflow-x-hidden">
      <OnnNavbar />
      <main>
        <OnnHero />
        <OnnMarquee
          items={[
            "Mentoria de Marca Pessoal",
            "Networking de Alto Nível",
            "Conselho de Influência",
            "Plataforma de Mídia",
            "Ecossistema Nordestino",
            "Autoridade Regional",
          ]}
        />
        <OnnProblem />
        <OnnSolution />
        <OnnEcosystem />
        <OnnMarquee
          items={[
            "Vagas Limitadas",
            "Acesso Avaliado",
            "Nova Geração",
            "Novo Padrão",
            "Os Novos Nordestinos",
            "Ciclo 2025",
          ]}
        />
        <OnnQualification />
        <OnnTestimonials />
        <OnnFinalCta />
        <OnnFooter />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ONN — Helpers
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold uppercase mb-6"
      style={{ color: "#C97B2A", letterSpacing: "0.3em" }}
    >
      {children}
    </span>
  );
}

function OnnReveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function OnnCTA({
  href = "#cta-final",
  size = "md",
  children,
}: {
  href?: string;
  size?: "md" | "lg";
  children: ReactNode;
}) {
  const padding =
    size === "lg" ? "px-12 py-5 text-base" : "px-10 py-4 text-sm";
  return (
    <a
      href={href}
      className={`onn-cta inline-flex items-center justify-center ${padding}`}
      style={{ letterSpacing: size === "lg" ? "0.1em" : "0.08em" }}
    >
      {children}
    </a>
  );
}

function OnnNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(10, 10, 10, 0.75)",
        borderBottom: "1px solid #2A2A2A",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-7 h-7" />
          <span
            className="text-[11px] font-bold uppercase"
            style={{ color: "#F2F0EB", letterSpacing: "0.18em" }}
          >
            ONN
          </span>
          <span
            className="hidden sm:inline text-[10px] font-tagline"
            style={{ color: "#C97B2A", letterSpacing: "0.15em" }}
          >
            · Os Novos Nordestinos
          </span>
        </div>
        <a
          href="#cta-final"
          className="text-[11px] font-bold uppercase px-5 py-2.5 transition-all"
          style={{
            color: "#0A0A0A",
            background: "linear-gradient(135deg, #C97B2A 0%, #E08C32 100%)",
            letterSpacing: "0.1em",
            borderRadius: "2px",
          }}
        >
          Quero fazer parte
        </a>
      </div>
    </nav>
  );
}

/* ── SEÇÃO 01 — HERO ── */
function OnnHero() {
  return (
    <section className="relative onn-hero-ambient min-h-screen pt-28 pb-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none"
        style={{ paddingRight: "2vw" }}
      >
        <span
          className="font-black uppercase"
          style={{
            color: "#1A1A1A",
            fontSize: "clamp(180px, 28vw, 420px)",
            letterSpacing: "0.02em",
            lineHeight: 0.85,
            opacity: 0.55,
          }}
        >
          ONN
        </span>
      </div>

      <div className="onn-light-beam" aria-hidden="true" />
      <div
        className="onn-brand-line"
        style={{ height: 220, top: "8%", left: "6%", transform: "rotate(15deg)" }}
        aria-hidden="true"
      />
      <div
        className="onn-brand-line"
        style={{
          height: 160,
          top: "30%",
          right: "10%",
          transform: "rotate(-12deg)",
          animationDelay: "1.2s",
        }}
        aria-hidden="true"
      />
      <div className="onn-grain" aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center min-h-[calc(100vh-7rem)]">
        <div className="relative">
          <OnnReveal>
            <SectionLabel>Ecossistema · Mentalidade · Movimento</SectionLabel>
          </OnnReveal>

          <h1
            className="onn-headline-reveal font-black uppercase mb-8"
            style={{
              fontSize: "clamp(42px, 6.5vw, 84px)",
              lineHeight: 0.98,
              letterSpacing: "0.02em",
              color: "#F2F0EB",
            }}
          >
            O Nordeste não pediu licença
            <br />
            <span
              className="font-serif-italic font-normal normal-case"
              style={{ color: "#C97B2A", letterSpacing: 0 }}
            >
              para ser grande.
            </span>
          </h1>

          <OnnReveal delay={0.4}>
            <p
              className="mb-10 max-w-[540px]"
              style={{ fontSize: "18px", lineHeight: 1.7, color: "#5A5A52" }}
            >
              Somos a infraestrutura estratégica que faltava para o empresário
              nordestino ocupar o lugar que merece.
            </p>
          </OnnReveal>

          <OnnReveal delay={0.6}>
            <OnnCTA size="lg">Quero fazer parte</OnnCTA>
          </OnnReveal>

          <div className="hidden lg:block absolute -bottom-12 left-0">
            <div
              className="w-px"
              style={{
                height: 40,
                background: "linear-gradient(180deg, transparent, #C97B2A)",
                animation: "onn-line-pulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <div className="relative h-[460px] lg:h-[600px]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 75% at 50% 50%, hsla(28,65%,48%,0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 flex items-end justify-center pb-4"
            aria-hidden="true"
          >
            <div
              className="w-[78%] h-[88%] rounded-t-[200px]"
              style={{
                background:
                  "linear-gradient(180deg, hsla(28,30%,15%,0.5) 0%, hsla(0,0%,4%,0.95) 90%)",
                border: "1px solid hsla(28,40%,25%,0.3)",
                boxShadow:
                  "inset 0 60px 120px hsla(28,65%,48%,0.08), 0 0 80px hsla(28,65%,48%,0.12)",
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoIcon className="w-28 h-28 opacity-90 drop-shadow-[0_0_40px_rgba(201,123,42,0.5)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="onn-floating-card absolute top-4 left-0 lg:-left-6 max-w-[230px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#C97B2A" }}
              />
              <p className="text-[13px] font-semibold" style={{ color: "#F2F0EB" }}>
                Novo membro aprovado
              </p>
            </div>
            <p className="text-[11px]" style={{ color: "#5A5A52" }}>
              Empresário · Fortaleza, CE
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="onn-floating-card absolute bottom-12 left-0 lg:-left-10 max-w-[250px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Check size={14} style={{ color: "#C97B2A" }} />
              <p className="text-[13px] font-semibold" style={{ color: "#F2F0EB" }}>
                Conselho de Influência
              </p>
            </div>
            <p className="text-[11px]" style={{ color: "#5A5A52" }}>
              Empresários nordestinos · Ciclo 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="onn-floating-card absolute top-1/3 right-0 lg:-right-4 max-w-[210px]"
          >
            <p className="text-[13px] font-semibold mb-2" style={{ color: "#F2F0EB" }}>
              Protagonismo Nacional
            </p>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "#1A1A1A" }}
            >
              <div
                className="h-full"
                style={{
                  width: "94%",
                  background: "linear-gradient(90deg, #C97B2A 0%, #E08C32 100%)",
                }}
              />
            </div>
            <p
              className="text-[10px] mt-1"
              style={{ color: "#C97B2A", letterSpacing: "0.1em" }}
            >
              94% · NORDESTE
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OnnMarquee({ items }: { items: string[] }) {
  const block = (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span
            className="px-8 font-black uppercase whitespace-nowrap"
            style={{
              color: "#F2F0EB",
              fontSize: "13px",
              letterSpacing: "0.2em",
            }}
          >
            {item}
          </span>
          <span
            className="text-base"
            style={{ color: "#C97B2A" }}
            aria-hidden="true"
          >
            ·
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid #2A2A2A",
        borderBottom: "1px solid #2A2A2A",
        padding: "16px 0",
      }}
    >
      <div className="onn-marquee">
        {block}
        {block}
      </div>
    </div>
  );
}

/* ── SEÇÃO 02 — PROBLEMA ── */
function OnnProblem() {
  return (
    <section
      className="relative py-[120px] px-6 lg:px-20"
      style={{ background: "#111111" }}
    >
      <div className="onn-grain" aria-hidden="true" />
      <div className="max-w-[780px] mx-auto relative z-10">
        <OnnReveal>
          <SectionLabel>O Problema</SectionLabel>
        </OnnReveal>
        <OnnReveal delay={0.1}>
          <h2
            className="font-black uppercase mb-10"
            style={{
              fontSize: "clamp(32px, 4.5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              color: "#F2F0EB",
            }}
          >
            Durante décadas, o empresário nordestino construiu patrimônio.
            <br />
            <span
              className="font-serif-italic font-normal normal-case"
              style={{ color: "#C97B2A", letterSpacing: 0 }}
            >
              Mas não construiu influência proporcional.
            </span>
          </h2>
        </OnnReveal>

        <OnnReveal delay={0.2}>
          <p
            className="mb-12"
            style={{ fontSize: "17px", lineHeight: 1.8, color: "#F2F0EB" }}
          >
            Enquanto outros polos do país organizavam sua imagem institucional,
            o Nordeste permaneceu sub-representado na narrativa nacional — não
            por falta de resultado, mas por falta de estrutura de visibilidade.
          </p>
        </OnnReveal>

        <OnnReveal delay={0.3}>
          <blockquote
            className="font-serif-italic"
            style={{
              fontSize: "clamp(22px, 2.6vw, 30px)",
              lineHeight: 1.45,
              color: "#F2F0EB",
              borderLeft: "3px solid #C97B2A",
              paddingLeft: 28,
              margin: "16px 0",
            }}
          >
            O Nordeste cresceu economicamente.
            <br />
            Mas permaneceu invisível onde mais importa.
          </blockquote>
        </OnnReveal>
      </div>
    </section>
  );
}

/* ── SEÇÃO 03 — SOLUÇÃO ── */
function OnnSolution() {
  return (
    <section
      className="relative py-[140px] px-6 lg:px-20 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      <div
        className="onn-hex"
        style={{ width: 500, height: 500, top: "10%", right: "-120px", opacity: 0.06 }}
        aria-hidden="true"
      />
      <div
        className="onn-hex onn-hex-rev"
        style={{ width: 280, height: 280, bottom: "10%", left: "-60px", opacity: 0.04 }}
        aria-hidden="true"
      />

      <div className="max-w-[860px] mx-auto relative z-10 text-center">
        <OnnReveal>
          <SectionLabel>A Solução</SectionLabel>
        </OnnReveal>

        <OnnReveal delay={0.1}>
          <h2
            className="font-black mb-2"
            style={{
              fontSize: "clamp(40px, 5.5vw, 68px)",
              lineHeight: 1,
              letterSpacing: "0.01em",
              color: "#F2F0EB",
            }}
          >
            Os Novos Nordestinos
          </h2>
          <div
            className="mx-auto mb-10"
            style={{ width: 60, height: 2, background: "#C97B2A" }}
          />
        </OnnReveal>

        <OnnReveal delay={0.2}>
          <p
            className="mb-10 mx-auto max-w-[640px]"
            style={{ fontSize: "20px", lineHeight: 1.6, color: "#F2F0EB" }}
          >
            Não apenas como comunidade. Mas como{" "}
            <span style={{ fontWeight: 700 }}>
              infraestrutura estratégica de autoridade regional.
            </span>
          </p>
        </OnnReveal>

        <OnnReveal delay={0.3}>
          <p
            className="font-tagline mb-12"
            style={{
              fontSize: "clamp(24px, 3vw, 34px)",
              color: "#C97B2A",
              letterSpacing: "0.12em",
            }}
          >
            Nova geração. Novo padrão.
          </p>
        </OnnReveal>

        <OnnReveal delay={0.4}>
          <p
            className="mx-auto max-w-[640px]"
            style={{ fontSize: "17px", lineHeight: 1.7, color: "#5A5A52" }}
          >
            O ONN é um ecossistema de comunicação que desenvolve nordestinos
            mentalmente fortes para liderar o jogo do digital e empresarial.
          </p>
        </OnnReveal>
      </div>
    </section>
  );
}

/* ── SEÇÃO 04 — ECOSSISTEMA (4 pilares) ── */
function OnnEcosystem() {
  const pillars = [
    {
      n: "01",
      title: "Mentoria de Marca Pessoal",
      desc: "Construa sua autoridade de forma estruturada. Posicionamento, narrativa e presença que geram negócios.",
    },
    {
      n: "02",
      title: "Plataforma de Entrevistas e Mídia",
      desc: "Visibilidade com propósito. Entrevistas, conteúdo e presença de mídia que ampliam sua influência regional.",
    },
    {
      n: "03",
      title: "Conselho de Influência Empresarial",
      desc: "Um grupo seleto de líderes com acesso a decisões, parcerias e inteligência estratégica do mercado.",
    },
    {
      n: "04",
      title: "Networking Estratégico de Alto Nível",
      desc: "Conexões que valem contratos. Acesso a um ecossistema de empresários nordestinos que se movem juntos.",
    },
  ];

  return (
    <section
      className="relative py-[140px] px-6 lg:px-20"
      style={{ background: "#1A1A1A" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <OnnReveal>
            <SectionLabel>O Ecossistema</SectionLabel>
          </OnnReveal>
          <OnnReveal delay={0.1}>
            <h2
              className="font-black mb-4"
              style={{
                fontSize: "clamp(34px, 4.5vw, 56px)",
                lineHeight: 1.05,
                color: "#F2F0EB",
                letterSpacing: "0.01em",
              }}
            >
              Quatro pilares.
              <br />
              <span
                className="font-serif-italic font-normal"
                style={{ color: "#C97B2A" }}
              >
                Uma única infraestrutura.
              </span>
            </h2>
          </OnnReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <OnnReveal key={p.n} delay={i * 0.12}>
              <article
                className="relative h-full p-10 transition-all duration-300"
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderTopWidth: 2,
                  borderTopColor: "#C97B2A",
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1F1F1F";
                  e.currentTarget.style.borderTopColor = "#E08C32";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(201, 123, 42, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1A1A1A";
                  e.currentTarget.style.borderTopColor = "#C97B2A";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  className="font-black select-none"
                  style={{
                    color: "#1F1F1F",
                    fontSize: 80,
                    lineHeight: 1,
                    position: "absolute",
                    top: 16,
                    right: 24,
                  }}
                  aria-hidden="true"
                >
                  {p.n}
                </span>
                <h3
                  className="font-bold mb-4 relative"
                  style={{ fontSize: 24, lineHeight: 1.2, color: "#F2F0EB" }}
                >
                  {p.title}
                </h3>
                <p
                  className="relative"
                  style={{ fontSize: 15, lineHeight: 1.7, color: "#5A5A52" }}
                >
                  {p.desc}
                </p>
              </article>
            </OnnReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SEÇÃO 05 — QUALIFICAÇÃO ── */
function OnnQualification() {
  const fits = [
    "Empresário nordestino com negócio ativo e faturamento relevante",
    "Líder regional que quer ocupar espaço na narrativa nacional",
    "Profissional que entende que visibilidade é ativo estratégico",
    "Quem está pronto para agir, não apenas aprender",
  ];
  const notFits = [
    "Quem está começando do zero sem estrutura",
    "Quem busca atalhos sem comprometimento real",
    "Quem quer apenas conteúdo gratuito",
    "Quem não valoriza o poder do networking",
  ];

  return (
    <section
      className="relative py-[140px] px-6 lg:px-20"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(201,123,42,0.2)",
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <OnnReveal>
            <SectionLabel>Acesso Restrito</SectionLabel>
          </OnnReveal>
          <OnnReveal delay={0.1}>
            <h2
              className="font-black mb-4"
              style={{
                fontSize: "clamp(34px, 4.5vw, 52px)",
                lineHeight: 1.05,
                color: "#F2F0EB",
                letterSpacing: "0.01em",
              }}
            >
              Este não é para todo mundo.
            </h2>
          </OnnReveal>
          <OnnReveal delay={0.2}>
            <p
              className="font-serif-italic mx-auto max-w-[560px]"
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                color: "#C97B2A",
                lineHeight: 1.5,
              }}
            >
              E isso não é arrogância. É respeito pelo seu tempo.
            </p>
          </OnnReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <OnnReveal delay={0.1}>
            <div
              className="p-8 h-full"
              style={{
                background: "#111111",
                border: "1px solid #2A2A2A",
                borderRadius: 4,
              }}
            >
              <p
                className="text-[11px] font-bold uppercase mb-6"
                style={{ color: "#C97B2A", letterSpacing: "0.3em" }}
              >
                Para quem é
              </p>
              <ul className="space-y-4">
                {fits.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      size={18}
                      style={{ color: "#C97B2A", marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 15, color: "#F2F0EB", lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </OnnReveal>

          <OnnReveal delay={0.25}>
            <div
              className="p-8 h-full"
              style={{
                background: "#111111",
                border: "1px solid #2A2A2A",
                borderRadius: 4,
              }}
            >
              <p
                className="text-[11px] font-bold uppercase mb-6"
                style={{ color: "#5A5A52", letterSpacing: "0.3em" }}
              >
                Para quem não é
              </p>
              <ul className="space-y-4">
                {notFits.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      style={{
                        color: "#5A5A52",
                        marginTop: 2,
                        flexShrink: 0,
                        fontSize: 18,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </span>
                    <span style={{ fontSize: 15, color: "#5A5A52", lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </OnnReveal>
        </div>
      </div>
    </section>
  );
}

/* ── SEÇÃO 06 — DEPOIMENTOS ── */
function OnnTestimonials() {
  const testimonials = [
    {
      quote:
        "O ONN não é mais um curso. É a estrutura que transformou a forma como o mercado nacional enxerga meu negócio.",
      name: "Empresário do Setor Industrial",
      role: "Recife · PE",
    },
    {
      quote:
        "Encontrei aqui o nível de networking que eu buscava há anos — empresários sérios, que se movem juntos.",
      name: "Founder de Rede de Clínicas",
      role: "Fortaleza · CE",
    },
    {
      quote:
        "Construí patrimônio por décadas, mas só agora construí influência proporcional. Isso muda o jogo.",
      name: "Líder do Agronegócio Nordestino",
      role: "Salvador · BA",
    },
  ];

  return (
    <section
      className="relative py-[120px] px-6 lg:px-20"
      style={{ background: "#111111" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <OnnReveal>
            <SectionLabel>Quem Já Faz Parte</SectionLabel>
          </OnnReveal>
          <OnnReveal delay={0.1}>
            <h2
              className="font-black mb-2"
              style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "#F2F0EB",
                letterSpacing: "0.01em",
              }}
            >
              Vozes do movimento.
            </h2>
          </OnnReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <OnnReveal key={i} delay={i * 0.15}>
              <article
                className="p-8 h-full flex flex-col"
                style={{
                  background: "#0A0A0A",
                  border: "1px solid #2A2A2A",
                  borderLeftWidth: 3,
                  borderLeftColor: "#C97B2A",
                }}
              >
                <span
                  className="font-black"
                  style={{
                    fontSize: 60,
                    lineHeight: 0.6,
                    color: "#C97B2A",
                    opacity: 0.4,
                    marginBottom: 8,
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="font-serif-italic flex-1 mb-6"
                  style={{ fontSize: 18, lineHeight: 1.6, color: "#F2F0EB" }}
                >
                  {t.quote}
                </p>
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background: "#C97B2A",
                    marginBottom: 16,
                  }}
                />
                <p className="font-bold" style={{ fontSize: 15, color: "#F2F0EB" }}>
                  {t.name}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#5A5A52",
                    letterSpacing: "0.06em",
                    marginTop: 2,
                  }}
                >
                  {t.role}
                </p>
              </article>
            </OnnReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SEÇÃO 07 — CTA FINAL ── */
function OnnFinalCta() {
  return (
    <section
      id="cta-final"
      className="relative onn-cta-ambient py-[160px] px-6 lg:px-20 overflow-hidden scroll-mt-20"
    >
      <div
        className="onn-hex"
        style={{
          width: 600,
          height: 600,
          top: "10%",
          left: "50%",
          marginLeft: -300,
          opacity: 0.05,
        }}
        aria-hidden="true"
      />
      <div
        className="onn-hex onn-hex-rev"
        style={{
          width: 800,
          height: 800,
          top: "5%",
          left: "50%",
          marginLeft: -400,
          opacity: 0.025,
        }}
        aria-hidden="true"
      />
      <div className="onn-grain" aria-hidden="true" />

      <div className="max-w-[860px] mx-auto text-center relative z-10">
        <OnnReveal>
          <span
            className="text-[11px] font-semibold uppercase mb-8 inline-block"
            style={{ color: "#C97B2A", letterSpacing: "0.4em" }}
          >
            Vagas Limitadas
          </span>
        </OnnReveal>

        <OnnReveal delay={0.1}>
          <h2
            className="font-black mb-8"
            style={{
              fontSize: "clamp(44px, 6vw, 80px)",
              lineHeight: 0.98,
              letterSpacing: "0.01em",
              color: "#F2F0EB",
            }}
          >
            O próximo passo é seu.
          </h2>
        </OnnReveal>

        <OnnReveal delay={0.2}>
          <p
            className="font-serif-italic mb-14 mx-auto max-w-[600px]"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              lineHeight: 1.5,
              color: "#C97B2A",
            }}
          >
            O Nordeste não precisa de permissão para ser grande. Ele só precisa
            de quem acredite primeiro.
          </p>
        </OnnReveal>

        <OnnReveal delay={0.3}>
          <OnnCTA size="lg">Quero fazer parte do ONN</OnnCTA>
        </OnnReveal>

        <OnnReveal delay={0.4}>
          <p
            className="mt-8"
            style={{ fontSize: 13, color: "#5A5A52", letterSpacing: "0.06em" }}
          >
            Acesso avaliado individualmente · Vagas por ciclo
          </p>
        </OnnReveal>
      </div>
    </section>
  );
}

/* ── SEÇÃO 08 — FOOTER ── */
function OnnFooter() {
  return (
    <footer
      className="relative py-16 px-6 lg:px-20"
      style={{ background: "#050505", borderTop: "1px solid #C97B2A" }}
    >
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-10 items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <LogoIcon className="w-8 h-8" />
            <span className="font-bold" style={{ fontSize: 24, color: "#F2F0EB" }}>
              ONN
            </span>
          </div>
          <p
            className="font-tagline"
            style={{ fontSize: 12, color: "#C97B2A", letterSpacing: "0.12em" }}
          >
            Ecossistema · Mentalidade · Movimento
          </p>
        </div>
        <div className="md:text-center">
          <p
            className="text-[10px] font-semibold uppercase"
            style={{ color: "#5A5A52", letterSpacing: "0.3em" }}
          >
            Os Novos Nordestinos
          </p>
        </div>
        <div className="md:text-right">
          <p style={{ fontSize: 12, color: "#3A3A3A" }}>
            © 2025 ONN · Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
