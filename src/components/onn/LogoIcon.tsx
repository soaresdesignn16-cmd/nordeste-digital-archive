import logoOnn from "@/assets/logo-onn.png";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <img
      src={logoOnn}
      alt="Os Novos Nordestinos"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function VslNavbar() {
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
