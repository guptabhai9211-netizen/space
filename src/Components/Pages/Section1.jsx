import { useEffect, useRef, useState } from "react";

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  duration: Math.random() * 3 + 2,
}));

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

export default function FutureTech() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleMouse = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const tiltX = mousePos.y * -8;
  const tiltY = mousePos.x * 8;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #0a1628 0%, #020812 60%, #000308 100%)",
        fontFamily: "'Exo 2', 'Orbitron', sans-serif",
      }}
    >
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
        }
        @keyframes scan-line {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes letter-reveal {
          0% { opacity: 0; transform: translateY(-30px) rotateX(90deg); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0px); }
        }
        @keyframes helmet-glow {
          0%, 100% { filter: drop-shadow(0 0 20px #1e90ff88) drop-shadow(0 0 60px #0066cc44); }
          50% { filter: drop-shadow(0 0 40px #1e90ffbb) drop-shadow(0 0 100px #0066cc88); }
        }
        @keyframes ring-rotate {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes ring-rotate-reverse {
          from { transform: rotateX(75deg) rotateZ(360deg); }
          to { transform: rotateX(75deg) rotateZ(0deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes data-stream {
          0% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        @keyframes visor-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sub-fade {
          0% { opacity: 0; transform: translateY(10px) letterSpacing 0px; }
          100% { opacity: 1; transform: translateY(0); }
        }

        .letter-animate {
          display: inline-block;
          opacity: 0;
          animation: letter-reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .scan { animation: scan-line 4s linear infinite; }
        .ring1 { animation: ring-rotate 8s linear infinite; }
        .ring2 { animation: ring-rotate-reverse 12s linear infinite; }
        .ring3 { animation: ring-rotate 20s linear infinite; }
      `}</style>

      {/* Stars */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Floating Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #4af, #06f)",
            animation: `float-particle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Scan Line */}
      <div
        className="scan absolute left-0 w-full h-px pointer-events-none z-20"
        style={{
          background: "linear-gradient(90deg, transparent, #1e90ff44, #1e90ff88, #1e90ff44, transparent)",
        }}
      />

      {/* Ambient glow center */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, #0a3a6644 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Main 3D Card */}
      <div
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 py-12"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: "transform 0.08s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Title: FUTURE */}
        <div
          className="text-center mb-2"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(60px)",
          }}
        >
          {"FUTURE".split("").map((ch, i) => (
            <span
              key={i}
              className="letter-animate"
              style={{
                animationDelay: loaded ? `${i * 0.08}s` : "9999s",
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                fontWeight: 900,
                letterSpacing: "0.35em",
                color: "transparent",
                WebkitTextStroke: "1px #1e90ff",
                textShadow: "0 0 30px #1e90ff99, 0 0 80px #1e90ff44",
                marginRight: ch === " " ? "1em" : "0",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Title: TECHNOLOGY */}
        <div
          className="text-center mb-10"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(40px)",
          }}
        >
          {"TECHNOLOGY".split("").map((ch, i) => (
            <span
              key={i}
              className="letter-animate"
              style={{
                animationDelay: loaded ? `${0.5 + i * 0.06}s` : "9999s",
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1.8rem, 5.5vw, 3.8rem)",
                fontWeight: 700,
                letterSpacing: "0.45em",
                color: "#1e90ff",
                textShadow: "0 0 20px #1e90ffcc, 0 0 60px #0066ccaa",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Astronaut Helmet - CSS 3D */}
        <div
          className="relative flex items-center justify-center my-8"
          style={{
            width: 260,
            height: 300,
            transformStyle: "preserve-3d",
            transform: "translateZ(80px)",
          }}
        >
          {/* Orbital Rings */}
          {[
            { size: 340, color: "#1e90ff", cls: "ring1", opacity: 0.5 },
            { size: 280, color: "#00bfff", cls: "ring2", opacity: 0.35 },
            { size: 220, color: "#63d4ff", cls: "ring3", opacity: 0.2 },
          ].map((ring, idx) => (
            <div
              key={idx}
              className={`absolute ${ring.cls}`}
              style={{
                width: ring.size,
                height: ring.size,
                borderRadius: "50%",
                border: `1.5px solid ${ring.color}`,
                opacity: ring.opacity,
                top: "50%",
                left: "50%",
                marginLeft: -ring.size / 2,
                marginTop: -ring.size / 2,
                boxShadow: `0 0 10px ${ring.color}55`,
              }}
            />
          ))}

          {/* Helmet body */}
          <div
            className="relative"
            style={{
              width: 200,
              height: 230,
              animation: "helmet-glow 3s ease-in-out infinite",
            }}
          >
            {/* Outer helmet */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 30%, #1a3a5c 0%, #0d1f35 40%, #060e1a 80%)",
                border: "2px solid #1e5588",
                boxShadow:
                  "0 0 30px #1e90ff44, inset 0 0 40px #001428, 0 20px 60px #000a",
                borderRadius: "50% 50% 45% 45%",
              }}
            />

            {/* Visor */}
            <div
              className="absolute"
              style={{
                top: "20%",
                left: "15%",
                right: "15%",
                bottom: "30%",
                borderRadius: "50% 50% 40% 40%",
                background:
                  "linear-gradient(135deg, #0a2040ee 0%, #061428cc 50%, #0a304aee 100%)",
                border: "1px solid #2a6a9966",
                overflow: "hidden",
              }}
            >
              {/* Star reflection in visor */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.6 + 0.2,
                  }}
                />
              ))}
              {/* Visor shimmer */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 30%, #1e90ff22 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "visor-shimmer 4s linear infinite",
                }}
              />
              {/* Visor glare */}
              <div
                className="absolute"
                style={{
                  top: "8%",
                  left: "10%",
                  width: "35%",
                  height: "25%",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ffffff22 0%, transparent 100%)",
                }}
              />
            </div>

            {/* Helmet shine top */}
            <div
              className="absolute"
              style={{
                top: "8%",
                left: "18%",
                width: "28%",
                height: "18%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, #ffffff18 0%, transparent 100%)",
              }}
            />

            {/* Neck/collar */}
            <div
              className="absolute bottom-0 left-1/2"
              style={{
                transform: "translateX(-50%)",
                width: "60%",
                height: "20%",
                background: "linear-gradient(180deg, #0d1f35 0%, #060e1a 100%)",
                borderRadius: "0 0 10px 10px",
                border: "1px solid #1e4a6644",
              }}
            />

            {/* Suit indicator lights */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: "12%",
                  left: `${30 + i * 14}%`,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: ["#00ff88", "#1e90ff", "#ff4444"][i],
                  boxShadow: `0 0 8px ${["#00ff88", "#1e90ff", "#ff4444"][i]}`,
                  animation: `data-stream ${1.5 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Data line below helmet */}
        <div
          className="w-full max-w-lg mt-4 px-4 text-center"
          style={{
            transform: "translateZ(20px)",
            opacity: loaded ? 1 : 0,
            animation: loaded ? "sub-fade 1s ease 1.5s forwards" : "none",
            animationFillMode: "both",
          }}
        >
          <div
            className="mb-3 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #1e90ff88, transparent)",
            }}
          />
          <p
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              color: "#4a9ebb",
              lineHeight: 1.8,
              opacity: 0.8,
            }}
          >
            NEXT-GENERATION INTERFACE SYSTEM · DEEP SPACE RESEARCH MODULE ·
            NEURAL NETWORK INTEGRATION ACTIVE · QUANTUM PROCESSING UNIT ONLINE
          </p>
          <div
            className="mt-3 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #1e90ff88, transparent)",
            }}
          />
        </div>

        {/* Bottom data grid */}
        <div
          className="flex gap-8 mt-8"
          style={{
            transform: "translateZ(30px)",
            opacity: loaded ? 1 : 0,
            animation: loaded ? "sub-fade 1s ease 2s forwards" : "none",
            animationFillMode: "both",
          }}
        >
          {[
            { label: "NEURAL SYNC", value: "99.7%" },
            { label: "QUANTUM CORE", value: "ACTIVE" },
            { label: "SPACE TIME", value: "Δ0.003" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1e90ff",
                  textShadow: "0 0 15px #1e90ffaa",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "#4a8aaa",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: 16, left: 16, borderTop: "2px solid #1e90ff", borderLeft: "2px solid #1e90ff" },
        { top: 16, right: 16, borderTop: "2px solid #1e90ff", borderRight: "2px solid #1e90ff" },
        { bottom: 16, left: 16, borderBottom: "2px solid #1e90ff", borderLeft: "2px solid #1e90ff" },
        { bottom: 16, right: 16, borderBottom: "2px solid #1e90ff", borderRight: "2px solid #1e90ff" },
      ].map((style, i) => (
        <div
          key={i}
          className="absolute"
          style={{ ...style, width: 30, height: 30 }}
        />
      ))}
    </div>
  );
}