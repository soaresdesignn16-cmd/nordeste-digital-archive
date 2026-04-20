import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import {
  Play,
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  Zap,
  Users,
  Target,
  Shield,
  Sparkles,
  Cpu,
  Store,
  Briefcase,
  TrendingUp,
  Scale,
  ArrowRight,
} from "lucide-react";
import logoOnn from "@/assets/logo-onn.png";
import heroBgFlame from "@/assets/vsl-bg-skyline.jpg";

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
  const [scrollPrompt, setScrollPrompt] = useState(false);

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

  // Após a VSL, mostramos apenas o prompt "Role para baixo".
  // O loader inline só dispara quando o lead rola a página.
  const unlockContent = () => {
    setScrollPrompt(true);
  };

  // Quando o prompt está visível, dispara o loader inline ao primeiro scroll > 80px.
  useEffect(() => {
    if (!scrollPrompt || isLoading || isUnlocked) return;

    let touchStartY: number | null = null;
    const trigger = () => setIsLoading(true);

    const onScroll = () => {
      if (window.scrollY > 40) trigger();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 4) trigger();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY == null) return;
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY);
      if (dy > 20) trigger();
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "End"
      ) {
        trigger();
      }
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

  // Quando isLoading vira true, anima a barra 0→100% e desbloqueia o conteúdo.
  useEffect(() => {
    if (!isLoading) return;

    // Garante que o lead veja o loader inline (rola pra ele suavemente)
    requestAnimationFrame(() => {
      const target = document.getElementById("brand-loader-inline");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    });

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
    return () => clearInterval(interval);
  }, [isLoading]);

  // Quando desbloqueia, garante que o conteúdo apareça do topo
  // (sem flash de "outra página" — começa exatamente em "Chegou a hora…")
  useEffect(() => {
    if (!isUnlocked) return;
    // espera o React montar o <main> antes de rolar
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [isUnlocked]);

  if (!isUnlocked) {
    return (
      <>
        <VslNavbar />
        <section
          id="vsl-gate"
          className="min-h-[100svh] flex items-center justify-center pt-36 md:pt-32 pb-24 md:pb-20 relative overflow-hidden bg-background"
        >
        {/* Foto de fundo (skyline ao pôr-do-sol) com fade nas bordas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${heroBgFlame})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.6,
            maskImage:
              "radial-gradient(ellipse 80% 75% at 50% 50%, black 35%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 75% at 50% 50%, black 35%, transparent 88%)",
          }}
        ></div>
        {/* Overlay escuro para legibilidade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-background/60 pointer-events-none"
        ></div>
        <MouseParallax intensity={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-custom/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite]">
          <span className="sr-only">glow</span>
        </MouseParallax>
        <div className="relative z-10 text-center max-w-[700px] mx-auto px-6 py-8 md:py-4">
          <MouseParallax intensity={6} className="mb-8 flex justify-center">
            <LogoIcon className="w-20 h-20 drop-shadow-[0_0_30px_rgba(234,144,46,0.4)]" />
          </MouseParallax>

          <h1 className="text-[clamp(28px,5vw,48px)] font-black leading-[1.1] mb-4 tracking-tight">
            Antes de qualquer coisa,
            <br />
            <span className="headline-gradient">
              assista isso.
            </span>
          </h1>
          <p className="text-sm text-cream-muted max-w-[480px] mx-auto mb-8">
            O que você vai ver nos próximos minutos pode mudar a forma como você
            se posiciona no digital.
          </p>

          <div className="vsl-frame mb-6">
            <div className="aspect-video bg-dark-surface flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/10 to-transparent"></div>

              {vslStatus === "idle" && (
                <button
                  onClick={startVSL}
                  className="relative z-10 flex flex-col items-center gap-3 bg-none border-none cursor-pointer text-foreground group"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-custom to-primary-light flex items-center justify-center relative shadow-[0_0_50px_rgba(224,140,50,0.55)] transition-transform duration-200 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full border-2 border-primary-custom/50 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <Play className="ml-1 fill-current" style={{ color: "#0A0A0A" }} size={36} />
                  </div>
                  <span className="text-[11px] text-foreground/80 flex items-center gap-1.5 uppercase tracking-[0.25em] font-semibold">
                    🔊 Assista com som ativado
                  </span>
                </button>
              )}

              {vslStatus === "watching" && (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 border-2 border-primary-custom/30 border-t-primary-custom rounded-full animate-spin"></div>
                  <p className="text-[11px] text-cream-muted uppercase tracking-[0.25em] font-semibold">
                    Reproduzindo apresentação…
                  </p>
                  <p className="text-xs font-mono text-primary-custom text-gold-glow">
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
                    className="text-primary-custom mx-auto mb-4 icon-gold-glow"
                  />
                  <p className="text-sm font-semibold mb-2">
                    Apresentação concluída!
                  </p>
                </div>
              )}
            </div>
            <div className="h-1.5 bg-dark-surface relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-custom via-primary-light to-primary-custom bg-[length:200%_100%] transition-all duration-1000 animate-[shimmer_2s_linear_infinite]"
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
          </AnimatePresence>

          {/* Prompt "Role para baixo" — aparece quando a VSL termina */}
          <AnimatePresence>
            {scrollPrompt && !isLoading && (
              <motion.div
                key="scroll-prompt"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="motion-reduce:animate-none"
                >
                  <ChevronDown
                    size={36}
                    className="text-primary-custom drop-shadow-[0_0_18px_rgba(234,144,46,0.55)]"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <h2 className="text-[clamp(24px,4.5vw,40px)] font-black tracking-tight headline-gradient leading-none">
                  Role para baixo
                </h2>
                <p className="text-[11px] text-cream-muted uppercase tracking-[0.25em]">
                  O conteúdo foi liberado
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </section>

        {/* Loader inline — aparece como parte do scroll, não como overlay fullscreen */}
        {isLoading && (
          <section
            id="brand-loader-inline"
            aria-live="polite"
            aria-busy="true"
            className="min-h-[100svh] bg-background flex flex-col items-center justify-center gap-6 relative overflow-hidden"
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
          </section>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <PremiumBackground />
      <Navbar />
      <main>
        <ParallaxLayer offset={50} scaleFrom={0.97}>
          <HeroIntro />
        </ParallaxLayer>
        <SectionDivider />
        <ParallaxLayer offset={70} scaleFrom={0.95}>
          <StepsSection />
        </ParallaxLayer>
        <SectionDivider />
        <ParallaxLayer offset={70} scaleFrom={0.95}>
          <AudienceSection />
        </ParallaxLayer>
        <SectionDivider />
        <ParallaxLayer offset={70} scaleFrom={0.95}>
          <FounderSection />
        </ParallaxLayer>
        <SectionDivider />
        <ParallaxLayer offset={60} scaleFrom={0.96}>
          <ImpactSection />
        </ParallaxLayer>
        <SectionDivider />
        <ParallaxLayer offset={60} scaleFrom={0.96}>
          <FinalCTA />
        </ParallaxLayer>
        <Footer />
      </main>
    </div>
  );
}

function PremiumBackground() {
  return (
    <div className="premium-bg">
      <div className="bg-grid"></div>
      <div className="absolute w-[420px] h-[420px] bg-primary-custom/10 rounded-full blur-[160px] top-[10%] left-[10%] animate-[drift_12s_ease-in-out_infinite]"></div>
      <div className="absolute w-[480px] h-[480px] bg-primary-custom/5 rounded-full blur-[160px] top-[55%] right-[5%] animate-[drift_14s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute w-[380px] h-[380px] bg-primary-custom/5 rounded-full blur-[160px] bottom-[5%] left-[35%] animate-[pulse-glow-slow_8s_ease-in-out_infinite]"></div>
      <div className="bg-scanlines"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_40%,rgba(5,5,5,0.6)_100%)]"></div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-background/70 border-b border-primary-custom/15">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-6 h-6" />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase">
            Os Novos Nordestinos
          </span>
        </div>
        <BrutalistButton href="#cta-final" className="!px-4 !py-2 !text-[11px]">
          Solicitar Avaliação
        </BrutalistButton>
      </div>
    </nav>
  );
}

function VslNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-primary-custom/10">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <LogoIcon className="w-10 h-10 shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold tracking-[0.18em] uppercase text-foreground">
              Os Novos
            </span>
            <span className="text-[13px] font-extrabold tracking-[0.18em] uppercase text-foreground">
              Nordestinos
            </span>
          </div>
        </div>
        <BrutalistButton href="#vsl-gate" className="!flex-col !px-5 !py-3 !text-[13px] !leading-tight !gap-0">
          <span>Solicitar</span>
          <span>Avaliação</span>
        </BrutalistButton>
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

/* ── Pill com tag de seção (estilo "O QUE É" / "PARA QUEM É" do vídeo) ── */
function SectionPill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center px-8 py-2.5 rounded-full border border-primary-custom/40 bg-background/40 backdrop-blur-md text-foreground text-[11px] font-bold tracking-[0.35em] uppercase shadow-[0_0_20px_-4px_rgba(234,144,46,0.35)]">
      {children}
    </div>
  );
}

/* ── Seta indicadora entre seções ── */
function ArrowDivider() {
  return (
    <div className="w-full flex justify-center py-10">
      <ChevronDown
        className="text-primary-custom/70 animate-bounce"
        size={28}
        strokeWidth={2.5}
      />
    </div>
  );
}

/* ── HERO INTRO — bloco de abertura após o VSL ── */
function HeroIntro() {
  return (
    <section className="relative pt-24 pb-12 px-6">
      <div className="max-w-[760px] mx-auto text-center">
        <Reveal>
          <ArrowDivider />
          <div className="mb-8 flex justify-center">
            <SectionPill>O Movimento</SectionPill>
          </div>
          <h1 className="text-[clamp(34px,6vw,58px)] font-black leading-[1.08] tracking-tight mb-6 headline-gradient">
            Chegou a hora do Brasil conhecer os Novos Nordestinos.
          </h1>
          <p className="text-base text-cream-muted leading-relaxed max-w-[560px] mx-auto mb-8">
            Empresários e profissionais que já constroem resultado, mas agora
            decidiram ser{" "}
            <strong className="text-foreground">
              vistos, valorizados e respeitados
            </strong>{" "}
            no nível que realmente são.
          </p>
          <TiltCard tilt={false} spotlight className="card-premium max-w-[420px] mx-auto p-6">
            <p className="text-sm text-foreground/90 mb-1">
              Você não precisa de mais clientes.
            </p>
            <p className="text-sm font-black text-primary-custom uppercase tracking-wider text-gold-glow">
              Você precisa de clientes melhores.
            </p>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ── STEPS SECTION — 4 etapas no formato do vídeo (PASSO 1, 2, 3, 4) ── */
function StepsSection() {
  const steps = [
    {
      title: "Diagnóstico de Posicionamento",
      desc: "Vamos analisar como o mercado realmente enxerga você hoje — onde está sua autoridade, onde estão os ruídos e onde mora o dinheiro escondido na sua percepção.",
      fragments: [
        { type: "badge" as const, icon: <Target size={14} />, label: "AUDIT", speed: -0.6, pos: "top-2 right-[26%] md:right-[28%]" },
        { type: "badge" as const, icon: <Shield size={14} />, label: "BRAND", speed: 0.4, pos: "bottom-3 right-[12%] md:right-[18%]" },
      ],
    },
    {
      title: "Mapeamento da Audiência Premium",
      desc: "Identificamos exatamente quem é o cliente que paga mais e respeita mais — para você parar de atender qualquer um e começar a atrair os melhores.",
      fragments: [
        { type: "badge" as const, icon: <Users size={14} />, label: "ICP", speed: -0.5, pos: "top-4 right-[30%] md:right-[32%]" },
        { type: "badge" as const, icon: <TrendingUp size={14} />, label: "TICKET", speed: 0.5, pos: "bottom-2 right-[10%] md:right-[14%]" },
      ],
    },
    {
      title: "Arquitetura de Marca Pessoal",
      desc: "Construímos a estrutura completa da sua presença digital: comunicação, estética, narrativa e conteúdo no nível de quem você realmente é.",
      fragments: [
        { type: "badge" as const, icon: <Sparkles size={14} />, label: "ESTÉTICA", speed: -0.7, pos: "top-3 right-[28%] md:right-[30%]" },
        { type: "badge" as const, icon: <Briefcase size={14} />, label: "NARRATIVA", speed: 0.45, pos: "bottom-4 right-[10%] md:right-[16%]" },
      ],
    },
    {
      title: "Implementação do Clone Digital",
      desc: "Ativamos o sistema que trabalha seu posicionamento 24/7 — sem exigir seu tempo, sem você precisar gravar nada, sem aparecer se não quiser.",
      fragments: [
        { type: "badge" as const, icon: <Cpu size={14} />, label: "24/7", speed: -0.55, pos: "top-2 right-[32%] md:right-[34%]" },
        { type: "badge" as const, icon: <Zap size={14} />, label: "AUTO", speed: 0.5, pos: "bottom-3 right-[8%] md:right-[12%]" },
      ],
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <ArrowDivider />
          <div className="mb-8 flex justify-center">
            <SectionPill>O Que É</SectionPill>
          </div>
          <h2 className="text-[clamp(30px,5vw,48px)] font-black leading-[1.1] tracking-tight mb-5 text-left">
            Dentro da nossa Arquitetura de Posicionamento, vamos passar por{" "}
            <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">
              4 etapas:
            </span>
          </h2>
          <p className="text-sm text-cream-muted leading-relaxed mb-12 text-left max-w-[560px]">
            Um processo direto ao ponto pra você sair com um plano de ação claro
            — sem enrolação, sem teoria vazia.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <TiltCard tilt spotlight intensity={3} className="card-premium relative p-7 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_50px_-10px_rgba(224,140,50,0.45)] hover:border-primary-custom/40">
                <Parallax speed={-0.5} className="absolute -top-4 -right-2 pointer-events-none">
                  <span className="ghost-number block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Parallax>

                {/* ── Editorial collage — fragmentos como cartas de moodboard vivo
                    (inspirado no efeito Pinterest do vídeo de referência:
                    cada fragmento entra de uma direção, respira em loop
                    e sai cobrindo o anterior, criando dashboard editorial). ── */}
                {s.fragments.map((f, fi) => {
                  // direção de entrada cíclica por fragmento — TL/TR/BL/BR
                  const dirs = ["fragment-enter-tr", "fragment-enter-br", "fragment-enter-tl", "fragment-enter-bl"] as const;
                  const dirClass = dirs[fi % dirs.length];
                  return (
                    <Parallax
                      key={fi}
                      speed={f.speed}
                      className={`absolute ${f.pos} pointer-events-none z-[1] scale-75 md:scale-100 origin-top-right`}
                    >
                      <div
                        className={`fragment-stagger ${dirClass}`}
                        style={{ ["--frag-delay" as string]: `${fi * 180}ms` }}
                      >
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/80 border border-primary-custom/35 backdrop-blur-md shadow-[0_4px_20px_-6px_rgba(0,0,0,0.7)]">
                          <span className="text-primary-light">{f.icon}</span>
                          <span className="text-[9px] font-black tracking-[0.18em] text-cream-muted uppercase">
                            {f.label}
                          </span>
                        </div>
                      </div>
                    </Parallax>
                  );
                })}

                <div className="relative z-[2]">
                  <div className="inline-flex items-center justify-center px-7 py-2 rounded-full bg-gradient-to-r from-primary-custom to-primary-light text-background text-[11px] font-black tracking-[0.3em] uppercase shadow-[0_4px_20px_-4px_rgba(224,140,50,0.6)] mb-5">
                    Passo {i + 1}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-cream-muted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="flex justify-center mt-12">
            <BrutalistButton href="#cta-final" size="lg">
              Quero ser selecionado <ArrowRight size={18} />
            </BrutalistButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── AUDIENCE SECTION — "Para quem é" (perfis) ── */
function AudienceSection() {
  const profiles = [
    {
      icon: <Store size={22} />,
      title: "Donos de negócios do mundo físico",
      desc: "Lojas, clínicas, escritórios, prestadores de serviço presencial. Você sente que está preso na operação e que o digital não traduz o tamanho real da sua empresa.",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Empresários em escala",
      desc: "Sua empresa já fatura bem, mas ainda faz 80% dos processos na mão. Está na hora de profissionalizar a percepção e escalar com margem — não com volume.",
    },
    {
      icon: <Scale size={22} />,
      title: "Profissionais liberais",
      desc: "Advogados, médicos, contadores, consultores. Você vende seu tempo e sabe que tem um teto. Posicionamento te ajuda a cobrar mais, atender melhor e parar de ser refém da própria agenda.",
    },
    {
      icon: <Briefcase size={22} />,
      title: "Especialistas e autoridades",
      desc: "Você já tem conhecimento, resultado e bagagem. Falta apenas a estrutura digital pra que o mercado pare de te tratar como mais um e comece a te tratar como referência.",
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <ArrowDivider />
          <div className="mb-8 flex justify-center">
            <SectionPill>Para Quem É</SectionPill>
          </div>
          <h2 className="text-[clamp(30px,5vw,48px)] font-black leading-[1.1] tracking-tight mb-5 text-left">
            Esse movimento faz sentido pra você se:
          </h2>
          <p className="text-sm text-cream-muted leading-relaxed mb-12 text-left max-w-[560px]">
            Você se encaixa em um desses perfis e quer usar posicionamento pra
            crescer de verdade.
          </p>
        </Reveal>

        <div className="stack-zone" style={{ ["--stack-count" as string]: profiles.length }}>
          {profiles.map((p, i) => (
            <div
              key={i}
              className="stack-card"
              style={{
                ["--stack-index" as string]: i,
                zIndex: i + 1,
              }}
            >
              <TiltCard tilt spotlight intensity={3} className="card-premium stack-card-inner p-7 transition-shadow duration-300 hover:border-primary-custom/40 hover:shadow-[0_0_40px_-12px_rgba(224,140,50,0.4)]">
                <div className="w-11 h-11 rounded-xl bg-primary-custom/15 border border-primary-custom/30 flex items-center justify-center text-primary-custom mb-4 shadow-[0_0_20px_-6px_rgba(224,140,50,0.5)]">
                  {p.icon}
                </div>
                <div className="editorial-meta mb-3 opacity-70">
                  0{i + 1} / 0{profiles.length}
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 leading-tight tracking-tight">
                  {p.title}
                </h3>
                <div className="w-10 h-px bg-primary-custom/40 mb-3" />
                <p className="text-sm text-cream-muted leading-relaxed">
                  {p.desc}
                </p>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOUNDER SECTION — apresentação do idealizador (estilo "Muito prazer") ── */
function FounderSection() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <ArrowDivider />
          <div className="mb-8 flex justify-center">
            <SectionPill>Quem Está Por Trás</SectionPill>
          </div>
          <h2 className="text-[clamp(30px,5vw,48px)] font-black leading-[1.05] tracking-tight mb-6 text-left">
            Muito prazer,
            <br />
            <span className="headline-gradient">
              Os Novos Nordestinos.
            </span>
          </h2>
          <p className="text-sm font-semibold text-primary-custom tracking-[0.15em] mb-5 uppercase">
            Movimento de Posicionamento Digital • Especialistas em Autoridade de Marca
          </p>
          <p className="text-sm md:text-base text-cream-muted leading-relaxed mb-6">
            Nascemos com um propósito: mostrar pro Brasil que o Nordeste produz
            empresários sofisticados, negócios milionários e marcas no nível
            das maiores do país. Hoje, à frente do movimento, ajudamos
            empresários nordestinos a implementar uma{" "}
            <strong className="text-foreground">
              Arquitetura de Posicionamento Digital
            </strong>{" "}
            de ponta a ponta — transformando autoridade em ticket maior, mais
            tempo livre e respeito de mercado.
          </p>
          <blockquote className="blockquote-gold mb-10 text-sm md:text-base">
            Posicionamento não é vaidade. É a diferença entre ser escolhido pelo preço — ou pelo prestígio.
          </blockquote>
          <div className="mb-10">
            <BrutalistButton href="#cta-final" size="lg">
              Quero entrar para o movimento <ArrowRight size={18} />
            </BrutalistButton>
          </div>

          <TiltCard tilt spotlight intense intensity={4} className="relative rounded-lg overflow-hidden border-2 border-primary-custom/50 bg-card aspect-[4/5] max-w-[460px] mx-auto shadow-[0_0_60px_-10px_rgba(224,140,50,0.55)]">
            {/* Visual ancorado embaixo, ocupando o card todo */}
            <Parallax speed={-0.25} className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_85%,rgba(224,140,50,0.32),transparent_72%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-custom/25 via-primary-dark/15 to-transparent" />
            </Parallax>
            {/* Logo gigante, ancorado no rodapé do card — preenche a moldura toda de baixo pra cima */}
            <Parallax speed={0.12} className="absolute inset-x-0 bottom-0 flex items-end justify-center">
              <LogoIcon className="w-[88%] h-auto opacity-95 drop-shadow-[0_0_60px_rgba(224,140,50,0.65)] translate-y-[6%]" />
            </Parallax>
            {/* Faixa de leitura preservada, sobreposta ao logo */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent z-[2]">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-custom/15 border border-primary-custom/40 text-[10px] font-black tracking-[0.3em] uppercase text-primary-custom mb-2">
                Movimento ONN
              </span>
              <p className="text-sm font-bold">
                Reposicionamento Cultural & Autoridade Digital
              </p>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary-custom/30 to-transparent" />
    </div>
  );
}

function ImpactSection() {
  return (
    <section className="py-24 relative section-warm">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary-custom mb-12 block text-gold-glow">
            ⚙️ Como isso muda sua vida
          </span>
          <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto mb-16">
            {[
              "Sua autoridade cresce sozinha",
              "Seu valor percebido explode",
              "Seu ticket médio sobe exponencialmente",
              "Sua agenda finalmente desafoga",
            ].map((text, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <TiltCard tilt={false} spotlight className="card-premium flex items-center gap-4 px-6 py-5 text-left transition-shadow duration-300 hover:border-primary-custom/45 hover:shadow-[0_0_35px_-10px_rgba(224,140,50,0.5)]">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-custom/15 border border-primary-custom/40 flex items-center justify-center text-primary-custom icon-gold-glow">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold">{text}</span>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <blockquote className="blockquote-gold max-w-[440px] mx-auto text-left">
            <p className="text-sm font-medium mb-1 not-italic">
              Você deixa de viver no{" "}
              <strong className="text-foreground">volume exaustivo</strong>…
            </p>
            <p className="text-base font-black text-primary-custom uppercase tracking-wide not-italic">
              e passa a viver no valor premium.
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      id="cta-final"
      className="py-32 relative overflow-hidden scroll-mt-20"
    >
      <Parallax speed={-0.4} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/15 rounded-full blur-[180px] animate-[pulse-glow_6s_ease-in-out_infinite]"></div>
      </Parallax>
      <div className="bg-scanlines"></div>
      <Parallax speed={-0.2} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(224,140,50,0.08),transparent_70%)]"></div>
      </Parallax>
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <div className="w-20 h-20 rounded-full bg-background border border-primary-custom/40 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(224,140,50,0.5)]">
            <LogoIcon className="w-12 h-12 drop-shadow-[0_0_20px_rgba(224,140,50,0.7)]" />
          </div>
          <h2 className="text-[clamp(28px,6vw,60px)] font-black leading-[1] mb-6 tracking-tight">
            Durante anos, tentaram contar a nossa história.
          </h2>
          <blockquote className="blockquote-gold max-w-[560px] mx-auto mb-12 text-lg md:text-xl font-black uppercase tracking-tight">
            Agora é a nossa vez de ocupar o lugar certo.
          </blockquote>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {["Atender menos", "Cobrar mais", "Ter mais tempo", "Ser reconhecido"].map(
              (text, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 text-sm font-bold opacity-90 uppercase tracking-[0.2em] text-[11px]"
                >
                  <Check size={14} className="text-primary-custom icon-gold-glow" strokeWidth={3} />
                  {text}
                </div>
              ),
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <BrutalistButton href="#" size="xl">
              Solicitar minha avaliação estratégica →
            </BrutalistButton>
            <p className="max-w-[420px] text-[11px] text-muted-custom font-semibold tracking-wide leading-relaxed">
              Entre para o movimento exclusivo de empresários que estão
              redefinindo o padrão de autoridade nordestina no cenário digital
              nacional.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-20 border-t border-primary-custom/25 bg-background relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-base text-cream-muted mb-10 leading-relaxed font-medium">
            Você não está contratando marketing comum.
            <br />
            <strong className="text-foreground">
              Você está entrando para um movimento irreversível.
            </strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Autoridade", "Liberdade", "Posicionamento", "Representatividade"].map(
              (p, i) => (
                <span
                  key={i}
                  className="px-5 py-1.5 rounded-full border border-primary-custom/40 bg-primary-custom/10 text-[10px] font-black uppercase tracking-[0.25em] text-primary-custom shadow-[0_0_18px_-6px_rgba(224,140,50,0.5)]"
                >
                  {p}
                </span>
              ),
            )}
          </div>
          <div className="flex items-center justify-center gap-3 text-cream-muted/70">
            <LogoIcon className="w-7 h-7 drop-shadow-[0_0_12px_rgba(224,140,50,0.5)]" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase">
              Os Novos Nordestinos
            </span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

/* ── ParallaxLayer: aplica parallax (translateY) + zoom sutil + fade
   conforme a seção entra/sai da viewport. Cria sensação de profundidade
   em todas as seções abaixo do topo. ── */
function ParallaxLayer({
  children,
  offset = 70,
  scaleFrom = 0.95,
  fade = true,
}: {
  children: ReactNode;
  offset?: number;
  scaleFrom?: number;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.4,
  });

  const y = useTransform(smooth, [0, 0.5, 1], [offset, 0, -offset]);
  const scale = useTransform(smooth, [0, 0.5, 1], [scaleFrom, 1, scaleFrom]);
  const opacityFade = useTransform(smooth, [0, 0.15, 0.85, 1], [0.55, 1, 1, 0.55]);
  const opacityNone = useTransform(smooth, [0, 1], [1, 1]);
  const opacity = fade ? opacityFade : opacityNone;

  return (
    <motion.div
      ref={ref}
      className="will-parallax"
      style={{ y, scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax: camada interna com velocidade configurável. Use para
   fundos, ghost numbers e decorações — cria profundidade dentro da seção. ── */
function Parallax({
  children,
  speed = -0.3,
  className = "",
}: {
  children: ReactNode;
  /** negativo = mais lento (sobe ao rolar), positivo = mais rápido */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.5,
  });
  const y = useTransform(smooth, [0, 1], [200 * speed, -200 * speed]);

  return (
    <motion.div ref={ref} className={`will-parallax ${className}`} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ── MouseParallax: reage ao movimento do mouse (desktop apenas).
   Microinteração sutil no hero. ── */
function MouseParallax({
  children,
  intensity = 8,
  className = "",
}: {
  children: ReactNode;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tx = ((e.clientX - cx) / cx) * intensity;
      ty = ((e.clientY - cy) / cy) * intensity;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          raf = 0;
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={`will-parallax ${className}`}>
      {children}
    </div>
  );
}

/* ── TiltCard — wrapper com Tilt 3D sutil + Spotlight dourado seguindo o cursor.
   Ambos efeitos opcionais. Desabilitados em touch / reduced-motion. ── */
function TiltCard({
  children,
  className = "",
  tilt = true,
  spotlight = true,
  intensity = 3,
  intense = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  spotlight?: boolean;
  /** graus máximos de inclinação */
  intensity?: number;
  /** spotlight mais forte (para cards isolados/grandes) */
  intense?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    let raf = 0;
    let rx = 0;
    let ry = 0;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      if (spotlight) {
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      }

      if (tilt && !isTouch) {
        ry = (px - 0.5) * intensity * 2;
        rx = (0.5 - py) * intensity * 2;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            raf = 0;
          });
        }
      }
    };

    const onEnter = () => {
      if (spotlight) card.style.setProperty("--spot-opacity", "1");
    };
    const onLeave = () => {
      if (spotlight) card.style.setProperty("--spot-opacity", "0");
      if (tilt && !isTouch) {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      }
    };

    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [tilt, spotlight, intensity]);

  const wrapCls = tilt ? "tilt-wrap" : "";
  const cardCls = [
    tilt ? "tilt-card" : "",
    spotlight ? "spotlight-card" : "",
    spotlight && intense ? "spotlight-card-intense" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapRef} className={wrapCls}>
      <div ref={cardRef} className={cardCls}>
        {children}
      </div>
    </div>
  );
}

/* ── GoldCTA — botão dourado editorial premium (substitui o Brutalist) ── */
function BrutalistButton({
  href,
  onClick,
  children,
  size = "md",
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClass =
    size === "xl" ? "btn-gold-xl" : size === "lg" ? "btn-gold-lg" : "";
  const cls = `btn-gold ${sizeClass} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
