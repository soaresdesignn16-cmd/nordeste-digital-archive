import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Play, Check, ChevronRight, Lock, Zap, Award, Users, Target, Shield, MessageSquare, Image, Sparkles, Cpu } from 'lucide-react';

export default function App() {
  const [vslStatus, setVslStatus] = useState<'idle' | 'watching' | 'finished'>('idle');
  const [vslElapsed, setVslElapsed] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // VSL Logic
  const MIN_WATCH = 30;
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vslStatus === 'watching' && vslElapsed < MIN_WATCH) {
      interval = setInterval(() => {
        setVslElapsed(prev => prev + 1);
      }, 1000);
    } else if (vslElapsed >= MIN_WATCH) {
      setVslStatus('finished');
    }
    return () => clearInterval(interval);
  }, [vslStatus, vslElapsed]);

  const startVSL = () => setVslStatus('watching');
  
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
          setIsReady(true);
          setIsUnlocked(true);
        }, 500);
      }
      setLoadProgress(progress);
    }, 50);
  };

  if (!isUnlocked) {
    if (isLoading) {
      return (
        <div id="brand-loader" className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-6 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] height-[800px] bg-primary-custom/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite] pointer-events-none"></div>
          
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
              <span className="text-primary-custom">{Math.floor(loadProgress).toString().padStart(3, '0')}%</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <section id="vsl-gate" className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-custom/10 rounded-full blur-[200px] animate-[pulse-glow_5s_ease-in-out_infinite]"></div>
        <div className="relative z-10 text-center max-w-[700px] mx-auto px-6">
          <div className="mb-6">
            <LogoIcon className="w-14 h-14 text-primary-custom mx-auto shadow-[0_0_30px_rgba(234,144,46,0.3)]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-custom/30 bg-primary-custom/10 text-primary-custom text-[11px] font-semibold tracking-wider mb-6">
            <Lock size={12} /> Conteúdo exclusivo — Assista antes de continuar
          </div>

          <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold leading-[1.1] mb-4">
            Antes de qualquer coisa,<br />
            <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">assista isso.</span>
          </h1>
          <p className="text-sm text-cream-muted max-w-[480px] mx-auto mb-8">O que você vai ver nos próximos minutos pode mudar a forma como você se posiciona no digital.</p>

          <div className="rounded-2xl overflow-hidden border border-primary-custom/20 bg-card shadow-[0_0_40px_-10px_rgba(234,144,46,0.4)] mb-6">
            <div className="aspect-video bg-dark-surface flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/10 to-transparent"></div>
              
              {vslStatus === 'idle' && (
                <button 
                  onClick={startVSL}
                  className="relative z-10 flex flex-col items-center gap-3 bg-none border-none cursor-pointer text-foreground group"
                >
                  <div className="w-24 h-24 rounded-full bg-primary-custom flex items-center justify-center relative shadow-[0_0_40px_rgba(234,144,46,0.5)] transition-transform duration-200 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-primary-custom/40 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <Play className="ml-1 text-white fill-current" size={36} />
                  </div>
                  <span className="text-[11px] text-foreground/80 flex items-center gap-1.5 uppercase tracking-widest">🔊 Assista com som ativado</span>
                </button>
              )}

              {vslStatus === 'watching' && (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 border-2 border-primary-custom/30 border-t-primary-custom rounded-full animate-spin"></div>
                  <p className="text-[11px] text-muted-custom uppercase tracking-widest">Reproduzindo apresentação…</p>
                  <p className="text-xs font-mono text-primary-custom">
                    {Math.floor(vslElapsed / 60).toString().padStart(2, '0')}:{ (vslElapsed % 60).toString().padStart(2, '0') }
                  </p>
                </div>
              )}

              {vslStatus === 'finished' && (
                <div className="relative z-10 text-foreground">
                  <Sparkles size={48} className="text-primary-custom mx-auto mb-4" />
                  <p className="text-sm font-semibold mb-2">Apresentação concluída!</p>
                </div>
              )}
            </div>
            <div className="h-1.5 bg-dark-surface relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-custom to-primary-light transition-all duration-1000"
                style={{ width: `${Math.min((vslElapsed / MIN_WATCH) * 100, 100)}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {vslStatus === 'idle' && (
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
            
            {vslStatus === 'watching' && (
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

            {vslStatus === 'finished' && (
              <motion.button 
                key="unlock-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={unlockContent}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-br from-primary-custom to-primary-light text-white shadow-[0_0_40px_rgba(234,144,46,0.4)] transition-transform hover:scale-105"
              >
                <Check size={18} /> Liberar acesso ao conteúdo completo
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  return (
    <div className="relative">
      <PremiumBackground />
      <Navbar />
      <main className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
        <HorizontalShowcase />
        <SectionDivider />
        <GameChanger />
        <SectionDivider />
        <MovementSection />
        <SectionDivider />
        <OpportunitySection />
        <SectionDivider />
        <ObjectionsSection />
        <SectionDivider />
        <SolutionSection />
        <SectionDivider />
        <ImpactSection />
        <SectionDivider />
        <FinalCTA />
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
          <LogoIcon className="w-6 h-6 text-primary-custom" />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Os Novos Nordestinos</span>
        </div>
        <a href="#cta-final" className="px-4 py-2 bg-primary-custom hover:bg-primary-light text-white rounded-lg text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,144,46,0.3)]">
          Solicitar Avaliação
        </a>
      </div>
    </nav>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 5L33 12.5V27.5L20 35L7 27.5V12.5L20 5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 13V24L20 27.5L26 24V13L20 9.5L14 13Z" fill="currentColor" />
      <path d="M20 16V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HorizontalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);
  const x = useSpring(xTransform, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 1]);
  const floatingY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, 0]);

  const indicatorWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Layer 3: Floating Decorative Element */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
           <motion.div 
            style={{ y: floatingY, rotate: rotation, scale }}
            className="absolute top-1/3 right-[15%] w-72 h-72 border border-primary-custom/10 rounded-[3rem] flex items-center justify-center z-0 opacity-20"
          >
            <div className="w-56 h-56 border border-primary-custom/5 rounded-full" />
            <Sparkles className="absolute text-primary-custom/30" size={64} />
          </motion.div>
        </div>

        {/* Track */}
        <motion.div style={{ x }} className="flex h-full w-[300vw] relative z-10 items-center">
          {/* Panel 1 */}
          <div className="w-screen h-full flex flex-col items-center justify-start px-6 pt-24 pb-12 relative overflow-hidden">
            {/* Panel 1 Background Image (Only for this panel) */}
            <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1495195129352-aec325b55b65?q=80&w=1776&auto=format&fit=crop" 
                alt="" 
                className="w-full h-full object-cover scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-background/30" />
            </div>
            
            <div className="max-w-[750px] w-full text-center mt-auto mb-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-custom/20 bg-primary-custom/5 text-primary-custom text-[11px] font-semibold tracking-wider mb-6">
                <Zap size={14} /> Movimento de Posicionamento Digital
              </div>
              <h1 className="text-[clamp(32px,6vw,60px)] font-black leading-[1] mb-4 tracking-tight">
                Chegou a hora do Brasil conhecer os <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">Novos Nordestinos.</span>
              </h1>
              <p className="text-sm md:text-base text-cream-muted max-w-[540px] mx-auto mb-6 leading-relaxed font-medium">
                Empresários e profissionais que já constroem resultado, mas agora decidiram ser <strong className="text-foreground">vistos, valorizados e respeitados</strong> no nível que realmente são.
              </p>
              
              <div className="max-w-[380px] mx-auto p-5 rounded-2xl border border-primary-custom/30 bg-card/60 backdrop-blur-md mb-6 shadow-[0_0_40px_-5px_rgba(234,144,46,0.3)]">
                <div className="text-xs font-semibold mb-1">Você não precisa de mais clientes.</div>
                <div className="text-xs font-bold text-primary-custom uppercase tracking-wide">Você precisa de clientes melhores.</div>
              </div>

              <div className="flex flex-col gap-2 items-center mb-8">
                {[
                  "Atenda menos e aumente seu ticket",
                  "Atraia clientes premium",
                  "Tenha mais tempo livre",
                  "Construa uma marca pessoal forte",
                  "Cresça no digital sem depender de você"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary-custom/20 flex items-center justify-center text-primary-custom">
                      <Check size={10} />
                    </div>
                    <span className="text-xs text-foreground/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <a 
                href="#cta-final" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary-custom to-primary-light text-white shadow-[0_0_30px_rgba(234,144,46,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(234,144,46,0.5)] group"
              >
                Quero fazer parte dos Novos Nordestinos 
                <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
              </a>
              <p className="text-[10px] text-muted-custom mt-4 font-medium italic opacity-80">Avaliação estratégica + plano de posicionamento personalizado</p>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="w-screen h-full flex flex-col items-center justify-start px-6 pt-24 pb-12 overflow-hidden">
            <div className="max-w-[850px] w-full text-center mt-auto mb-auto">
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-3 block">⚠️ A verdade que ninguém fala</span>
              <h2 className="text-[clamp(28px,5vw,50px)] font-black leading-[1.1] mb-8">Você já construiu <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">resultado.</span></h2>
              
              <div className="grid md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
                <div className="p-6 rounded-2xl border border-primary-custom/15 bg-card/40 backdrop-blur-md flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-custom/10 flex items-center justify-center text-primary-custom mb-4">
                    <Users size={20} />
                  </div>
                  <h3 className="text-xs font-bold mb-2">Tem história real</h3>
                  <p className="text-[11px] text-muted-custom leading-relaxed">Tem empresa e faturamento. Mas se o digital não mostra, o mercado assume que não existe.</p>
                </div>
                <div className="p-6 rounded-2xl border border-primary-custom/15 bg-card/40 backdrop-blur-md flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-custom/10 flex items-center justify-center text-primary-custom mb-4">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-xs font-bold mb-2">Permanece invisível</h3>
                  <p className="text-[11px] text-muted-custom leading-relaxed">Alguém menos preparado — mas mais posicionado — ocupa seu espaço de direito.</p>
                </div>
                <div className="p-6 rounded-2xl border border-primary-custom/15 bg-card/40 backdrop-blur-md flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-custom/10 flex items-center justify-center text-primary-custom mb-4">
                    <Target size={20} />
                  </div>
                  <h3 className="text-xs font-bold mb-2">O espaço é ocupado</h3>
                  <p className="text-[11px] text-muted-custom leading-relaxed">Enquanto você não se posiciona, outros constroem autoridade no SEU mercado.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3 */}
          <div className="w-screen h-full flex flex-col items-center justify-start px-6 pt-24 pb-12 overflow-hidden">
            <div className="max-w-[750px] w-full text-center mt-auto mb-auto">
              <h2 className="text-[clamp(28px,5vw,50px)] font-black leading-[1.1] mb-4">O mercado <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">não escolhe o melhor.</span></h2>
              <p className="text-sm text-cream-muted mb-4">Escolhe o <strong className="text-foreground">mais bem percebido.</strong></p>
              <p className="text-[10px] text-muted-custom mb-10 tracking-wide uppercase font-semibold">E percepção hoje é construída exclusivamente no digital.</p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-[600px] mx-auto">
                <div className="flex-1 w-full p-6 rounded-2xl border border-primary-custom/10 bg-card/20 text-center">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-3">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                  <p className="text-[8px] font-bold tracking-widest uppercase text-red-500/80 mb-2">O erro da maioria</p>
                  <p className="text-xs font-bold">Tentar crescer aumentando volume de trabalho</p>
                </div>
                <div className="text-primary-custom font-black tracking-widest text-base">VS</div>
                <div className="flex-1 w-full p-6 rounded-2xl border border-primary-custom/30 bg-primary-custom/5 text-center shadow-[0_0_20px_rgba(234,144,46,0.2)]">
                  <div className="w-9 h-9 rounded-full bg-primary-custom/20 flex items-center justify-center text-primary-custom mx-auto mb-3">
                    <ChevronRight size={18} className="-rotate-90" />
                  </div>
                  <p className="text-[8px] font-bold tracking-widest uppercase text-primary-custom mb-2">O jogo real</p>
                  <p className="text-xs font-bold">Diminuir volume e aumentar valor percebido</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress UI */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-foreground/10 rounded-full overflow-hidden z-20">
          <motion.div style={{ width: indicatorWidth }} className="h-full bg-gradient-to-r from-primary-custom to-primary-light" />
        </div>
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary-custom/30 to-transparent" />
    </div>
  );
}

function GameChanger() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-primary-custom/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-4 block">🔥 Mudança de jogo</span>
          <h2 className="text-[clamp(24px,4vw,42px)] font-extrabold leading-tight mb-4">Empresário que vive cheio de cliente… mas cobrando barato…</h2>
          <div className="flex flex-col items-center gap-1 mb-10">
            <p className="text-lg font-bold">não tem negócio.</p>
            <p className="text-2xl font-black bg-gradient-to-r from-primary-custom to-primary-light bg-clip-text text-transparent">Tem um emprego caro.</p>
          </div>
          <p className="text-sm text-muted-custom mb-10">Agora veja o outro lado — quando você se posiciona da forma certa:</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: "💰", text: "Seu ticket sobe" },
              { icon: "👥", text: "Seu cliente muda" },
              { icon: "⏰", text: "Sua agenda desafoga" },
              { icon: "📈", text: "Você atende menos… e ganha mais" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl border border-primary-custom/20 bg-card/40 backdrop-blur-md">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="max-w-[440px] mx-auto p-6 rounded-2xl border border-primary-custom/20 bg-primary-custom/5">
            <p className="text-sm font-medium">Você passa a atender menos… e ganhar mais.</p>
            <p className="text-sm text-primary-custom font-bold mt-1">Com muito mais tempo e liberdade.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MovementSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-4 block">🏛️ O Movimento</span>
          <h2 className="text-[clamp(24px,4vw,42px)] font-extrabold leading-tight mb-12">Durante anos, tentaram definir o que é <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">ser nordestino.</span></h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-[600px] mx-auto mb-12">
            <div className="p-8 rounded-2xl border border-foreground/5 bg-card/20 text-center">
              <p className="text-[9px] font-bold tracking-widest uppercase text-red-500/70 mb-6">O que diziam</p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-custom">
                  <span className="text-red-500/60 font-bold">✕</span>
                  <span className="text-sm">Pouca sofisticação</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-custom">
                  <span className="text-red-500/60 font-bold">✕</span>
                  <span className="text-sm">Pouca relevância</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-custom">
                  <span className="text-red-500/60 font-bold">✕</span>
                  <span className="text-sm">Mercado limitado</span>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-2xl border border-primary-custom/30 bg-primary-custom/5 text-center shadow-[0_0_30px_rgba(234,144,46,0.2)]">
              <p className="text-[9px] font-bold tracking-widest uppercase text-primary-custom mb-6">A realidade atual</p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-primary-custom font-bold">✓</span>
                  <span className="text-sm font-semibold">Empresários sofisticados</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-primary-custom font-bold">✓</span>
                  <span className="text-sm font-semibold">Negócios milionários</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-primary-custom font-bold">✓</span>
                  <span className="text-sm font-semibold">Estratégia e inovação</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[480px] mx-auto p-10 rounded-3xl border border-primary-custom/30 bg-card/60 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(234,144,46,0.4)] relative">
            <div className="text-4xl mb-6 animate-bounce">🔥</div>
            <h3 className="text-base font-bold mb-3">Quando um empresário nordestino se posiciona…</h3>
            <p className="text-sm text-cream-muted leading-relaxed mb-4">ele não cresce sozinho. Ele altera a percepção de uma região inteira no mercado nacional.</p>
            <p className="text-xs font-black uppercase tracking-widest text-primary-custom">Reposicionamento Cultural</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OpportunitySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-primary-custom/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-4 block">🚀 Oportunidade</span>
          <h2 className="text-[clamp(24px,4vw,42px)] font-extrabold leading-tight mb-4">Você não representa só a sua empresa.</h2>
          <p className="text-lg text-cream-muted mb-12">Você representa <strong className="text-foreground border-b-2 border-primary-custom pb-1">o que é possível no Nordeste.</strong></p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <Award size={18} />, text: "Seu nome vira autoridade" },
              { icon: <Zap size={18} />, text: "Seu ticket aumenta" },
              { icon: <Users size={18} />, text: "Atrai clientes premium" },
              { icon: <Target size={18} />, text: "Acessa oportunidades maiores" },
              { icon: <Shield size={18} />, text: "Ganha respeito nacional" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl border border-primary-custom/20 bg-card/40 backdrop-blur-md">
                <span className="text-primary-custom">{item.icon}</span>
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ObjectionsSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-8 block">⚠️ O maior bloqueio</span>
          <div className="flex flex-col gap-4 mb-12">
            {[
              "Não tenho tempo pra criar conteúdo…",
              "Não gosto de aparecer…",
              "Isso não é pra mim…"
            ].map((text, i) => (
              <div key={i} className="px-6 py-4 rounded-xl border border-primary-custom/10 bg-card/30 max-w-[380px] mx-auto w-full italic text-sm text-muted-custom">
                " {text} "
              </div>
            ))}
          </div>
          <p className="text-3xl font-black mb-2 italic">Perfeito.</p>
          <p className="text-xl font-bold text-primary-custom">Porque você não precisa fazer isso.</p>
        </Reveal>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-4 block">🧠 A Solução</span>
          <h2 className="text-[clamp(24px,4vw,42px)] font-extrabold leading-tight mb-6">Nós construímos toda a sua presença digital <span className="bg-gradient-to-br from-primary-custom to-primary-light bg-clip-text text-transparent">pra você.</span></h2>
          <p className="text-sm text-muted-custom mb-12">Através de uma verdadeira <strong className="text-foreground">Arquitetura de Posicionamento Digital</strong>:</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <Shield />, text: "Estruturamos sua autoridade" },
              { icon: <MessageSquare />, text: "Criamos sua comunicação" },
              { icon: <Image />, text: "Posicionamos sua imagem no nível certo" },
              { icon: <Sparkles />, text: "Produzimos conteúdos estratégicos" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border border-primary-custom/15 bg-card/40 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-custom/10 flex items-center justify-center text-primary-custom">
                  {item.icon}
                </div>
                <p className="text-xs font-bold leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="max-w-[480px] mx-auto p-10 rounded-[32px] border border-primary-custom/30 bg-gradient-to-br from-card to-primary-custom/10 shadow-[0_0_60px_-10px_rgba(234,144,46,0.35)]">
            <div className="w-16 h-16 rounded-2xl bg-primary-custom/20 flex items-center justify-center text-primary-custom mx-auto mb-6">
              <Cpu size={32} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-custom mb-2">A Tecnologia que nos separa</p>
            <h3 className="text-2xl font-black mb-4">Clone Digital</h3>
            <p className="text-sm text-cream-muted leading-relaxed">Criamos um Clone Digital que trabalha seu posicionamento — 24 horas por dia, 7 dias por semana, sem exigir seu tempo.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-custom mb-12 block">⚙️ Como isso muda sua vida</span>
          <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto mb-16">
            {[
              "Sua autoridade cresce sozinha",
              "Seu valor percebido explode",
              "Seu ticket médio sobe exponencialmente",
              "Sua agenda finalmente desafoga"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-primary-custom/10 bg-card/40 text-left">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-custom/20 flex items-center justify-center text-primary-custom">
                  <Check size={14} />
                </div>
                <span className="text-sm font-semibold">{text}</span>
              </div>
            ))}
          </div>

          <div className="max-w-[440px] mx-auto p-8 rounded-2xl border border-primary-custom/20 bg-card">
            <p className="text-sm font-medium mb-1">Você deixa de viver no <strong className="text-foreground">volume exaustivo</strong>…</p>
            <p className="text-base font-black text-primary-custom uppercase tracking-wide">e passa a viver no valor premium.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta-final" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/15 rounded-full blur-[180px] animate-[pulse-glow_6s_ease-in-out_infinite]"></div>
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-custom to-primary-light rounded-[18px] text-[24px] font-black text-white flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(234,144,46,0.4)]">N</div>
          <h2 className="text-[clamp(28px,6vw,60px)] font-black leading-[1] mb-6 tracking-tight">Durante anos, tentaram contar a nossa história.</h2>
          <p className="text-xl font-black text-primary-custom italic mb-12 uppercase tracking-tight">Agora é a nossa vez de ocupar o lugar certo.</p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {["Atender menos", "Cobrar mais", "Ter mais tempo", "Ser reconhecido"].map((text, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-sm font-bold opacity-80 uppercase tracking-widest text-[11px]">
                <Check size={14} className="text-primary-custom" strokeWidth={3} />
                {text}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
            <a 
              href="#" 
              className="px-12 py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-primary-custom to-primary-light text-white shadow-[0_20px_60px_-15px_rgba(234,144,46,0.5)] transition-all hover:scale-105 hover:shadow-[0_25px_80px_-10px_rgba(234,144,46,0.6)] active:scale-95"
            >
              Solicitar minha avaliação estratégica →
            </a>
            <p className="max-w-[420px] text-[11px] text-muted-custom font-semibold tracking-wide leading-relaxed">
              Entre para o movimento exclusivo de empresários que estão redefinindo o padrão de autoridade nordestina no cenário digital nacional.
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
          <p className="text-base text-muted-custom mb-10 leading-relaxed font-medium">Você não está contratando marketing comum.<br /><strong className="text-foreground">Você está entrando para um movimento irreversível.</strong></p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Autoridade", "Liberdade", "Posicionamento", "Representatividade"].map((p, i) => (
              <span key={i} className="px-5 py-1.5 rounded-full border border-primary-custom/20 bg-primary-custom/5 text-[10px] font-black uppercase tracking-widest text-primary-custom">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-custom/60">
            <LogoIcon className="w-6 h-6 text-primary-custom/60" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Os Novos Nordestinos</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
