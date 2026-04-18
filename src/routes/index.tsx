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
import heroBgFlame from "@/assets/hero-bg-flame.jpg";

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
          <h1 className="text-[clamp(34px,6vw,58px)] font-black leading-[1.08] tracking-tight mb-6">
            Chegou a hora do Brasil conhecer os{" "}
            <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">
              Novos Nordestinos.
            </span>
          </h1>
          <p className="text-base text-cream-muted leading-relaxed max-w-[560px] mx-auto mb-8">
            Empresários e profissionais que já constroem resultado, mas agora
            decidiram ser{" "}
            <strong className="text-foreground">
              vistos, valorizados e respeitados
            </strong>{" "}
            no nível que realmente são.
          </p>
          <div className="max-w-[420px] mx-auto p-6 rounded-2xl border border-primary-custom/30 bg-card/60 backdrop-blur-md shadow-[0_0_40px_-8px_rgba(234,144,46,0.35)]">
            <p className="text-sm text-foreground/90 mb-1">
              Você não precisa de mais clientes.
            </p>
            <p className="text-sm font-black text-primary-custom uppercase tracking-wider">
              Você precisa de clientes melhores.
            </p>
          </div>
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
    },
    {
      title: "Mapeamento da Audiência Premium",
      desc: "Identificamos exatamente quem é o cliente que paga mais e respeita mais — para você parar de atender qualquer um e começar a atrair os melhores.",
    },
    {
      title: "Arquitetura de Marca Pessoal",
      desc: "Construímos a estrutura completa da sua presença digital: comunicação, estética, narrativa e conteúdo no nível de quem você realmente é.",
    },
    {
      title: "Implementação do Clone Digital",
      desc: "Ativamos o sistema que trabalha seu posicionamento 24/7 — sem exigir seu tempo, sem você precisar gravar nada, sem aparecer se não quiser.",
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
            <Reveal key={i} delay={i * 0.08}>
              <div className="relative p-7 rounded-3xl border border-primary-custom/25 bg-card/60 backdrop-blur-md shadow-[0_0_40px_-12px_rgba(234,144,46,0.4)]">
                <div className="inline-flex items-center justify-center px-7 py-2 rounded-full bg-gradient-to-r from-primary-dark via-primary-custom to-primary-light text-background text-[11px] font-black tracking-[0.3em] uppercase shadow-[0_4px_20px_-4px_rgba(234,144,46,0.6)] mb-5">
                  Passo {i + 1}
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-3 leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-cream-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
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

        <div className="flex flex-col gap-5">
          {profiles.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="p-7 rounded-3xl border border-primary-custom/15 bg-card/50 backdrop-blur-md">
                <div className="w-11 h-11 rounded-xl bg-primary-custom/15 flex items-center justify-center text-primary-custom mb-4">
                  {p.icon}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-cream-muted leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </Reveal>
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
            <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">
              Os Novos Nordestinos.
            </span>
          </h2>
          <p className="text-sm font-semibold text-primary-custom tracking-wide mb-5 uppercase">
            Movimento de Posicionamento Digital • Especialistas em Autoridade de Marca
          </p>
          <p className="text-sm md:text-base text-cream-muted leading-relaxed mb-8">
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
          <div className="mb-10">
            <BrutalistButton href="#cta-final" size="lg">
              Quero entrar para o movimento <ArrowRight size={18} />
            </BrutalistButton>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-primary-custom/30 bg-card aspect-[4/5] max-w-[460px] mx-auto shadow-[0_0_60px_-15px_rgba(234,144,46,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 via-background to-primary-custom/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoIcon className="w-32 h-32 opacity-90 drop-shadow-[0_0_40px_rgba(234,144,46,0.5)]" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background via-background/80 to-transparent">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-primary-custom mb-1">
                Movimento ONN
              </p>
              <p className="text-sm font-bold">
                Reposicionamento Cultural & Autoridade Digital
              </p>
            </div>
          </div>
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
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-12 block">
            ⚙️ Como isso muda sua vida
          </span>
          <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto mb-16">
            {[
              "Sua autoridade cresce sozinha",
              "Seu valor percebido explode",
              "Seu ticket médio sobe exponencialmente",
              "Sua agenda finalmente desafoga",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-primary-custom/10 bg-card/40 text-left"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-custom/20 flex items-center justify-center text-primary-custom">
                  <Check size={14} />
                </div>
                <span className="text-sm font-semibold">{text}</span>
              </div>
            ))}
          </div>

          <div className="max-w-[440px] mx-auto p-8 rounded-2xl border border-primary-custom/20 bg-card">
            <p className="text-sm font-medium mb-1">
              Você deixa de viver no{" "}
              <strong className="text-foreground">volume exaustivo</strong>…
            </p>
            <p className="text-base font-black text-primary-custom uppercase tracking-wide">
              e passa a viver no valor premium.
            </p>
          </div>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/15 rounded-full blur-[180px] animate-[pulse-glow_6s_ease-in-out_infinite]"></div>
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-custom to-primary-light rounded-[18px] text-[24px] font-black text-white flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(234,144,46,0.4)]">
            N
          </div>
          <h2 className="text-[clamp(28px,6vw,60px)] font-black leading-[1] mb-6 tracking-tight">
            Durante anos, tentaram contar a nossa história.
          </h2>
          <p className="text-xl font-black text-primary-custom italic mb-12 uppercase tracking-tight">
            Agora é a nossa vez de ocupar o lugar certo.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {["Atender menos", "Cobrar mais", "Ter mais tempo", "Ser reconhecido"].map(
              (text, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 text-sm font-bold opacity-80 uppercase tracking-widest text-[11px]"
                >
                  <Check size={14} className="text-primary-custom" strokeWidth={3} />
                  {text}
                </div>
              ),
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <BrutalistButton href="#" size="lg">
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
    <footer className="py-20 border-t border-foreground/5 bg-background relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-base text-muted-custom mb-10 leading-relaxed font-medium">
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
                  className="px-5 py-1.5 rounded-full border border-primary-custom/20 bg-primary-custom/5 text-[10px] font-black uppercase tracking-widest text-primary-custom"
                >
                  {p}
                </span>
              ),
            )}
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-custom/60">
            <LogoIcon className="w-6 h-6 text-primary-custom/60" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
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
}: {
  children: ReactNode;
  offset?: number;
  scaleFrom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Spring para suavizar o scroll (sensação premium)
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.4,
  });

  // Translação vertical: entra um pouco abaixo, sai um pouco acima
  const y = useTransform(smooth, [0, 0.5, 1], [offset, 0, -offset]);
  // Zoom sutil: começa menor, atinge 1 no centro, volta a diminuir
  const scale = useTransform(smooth, [0, 0.5, 1], [scaleFrom, 1, scaleFrom]);
  // Opacidade: fade-in/out nas pontas para reforçar profundidade
  const opacity = useTransform(
    smooth,
    [0, 0.15, 0.85, 1],
    [0.55, 1, 1, 0.55],
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity, willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Botão estilo "GumRoad" (neo-brutalist) — sombra dura deslocada,
   no hover translada e revela a sombra; no active "afunda" ── */
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
  size?: "md" | "lg";
  className?: string;
}) {
  const sizeClasses =
    size === "lg"
      ? "px-10 py-5 text-base"
      : "px-6 py-3.5 text-sm";

  // Botão "neon glow": fundo escuro translúcido, borda fina laranja.
  // Hover: glow laranja pulsa, brilho inferior aparece, borda fica mais intensa.
  const baseClasses = `glow-button group relative inline-flex items-center justify-center gap-2
    rounded-full font-bold uppercase tracking-wider text-white
    cursor-pointer select-none outline-none
    ${sizeClasses} ${className}`;

  const inner = (
    <>
      <span className="glow-button__bg" aria-hidden="true" />
      <span className="glow-button__border" aria-hidden="true" />
      <span className="glow-button__shine" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={baseClasses}>
      {inner}
    </button>
  );
}
