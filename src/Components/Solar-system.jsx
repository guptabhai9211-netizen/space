import { useRef, useState } from "react";
import { motion, useInView, useSpring, AnimatePresence } from "framer-motion";

/* ── Planet Data ─────────────────────────────────────────────── */
const PLANETS = [
  {
    name: "Mercury",
    index: "01",
    info: "Closest planet to the Sun.",
    fact: "A year on Mercury is just 88 Earth days.",
    distance: "57.9M km",
    distLabel: "From Sun",
    color: "#c2944a",
    colorAlt: "#8b6914",
    glow: "rgba(194,148,74,0.5)",
    tag: "INNER PLANET",
    emoji: "🪨",
    size: "4,879 km",
  },
  {
    name: "Venus",
    index: "02",
    info: "Hottest planet in the Solar System.",
    fact: "Venus rotates in the opposite direction to most planets.",
    distance: "108.2M km",
    distLabel: "From Sun",
    color: "#e8a45a",
    colorAlt: "#c27a2a",
    glow: "rgba(232,164,90,0.5)",
    tag: "INNER PLANET",
    emoji: "🌋",
    size: "12,104 km",
  },
  {
    name: "Earth",
    index: "03",
    info: "Our home planet.",
    fact: "70% of Earth's surface is covered with water.",
    distance: "149.6M km",
    distLabel: "From Sun",
    color: "#4a9eca",
    colorAlt: "#1a6a9a",
    glow: "rgba(74,158,202,0.5)",
    tag: "HOME WORLD",
    emoji: "🌍",
    size: "12,742 km",
  },
  {
    name: "Mars",
    index: "04",
    info: "The Red Planet.",
    fact: "Mars has the tallest volcano — Olympus Mons at 21 km high.",
    distance: "227.9M km",
    distLabel: "From Sun",
    color: "#c1440e",
    colorAlt: "#8b2800",
    glow: "rgba(193,68,14,0.5)",
    tag: "RED PLANET",
    emoji: "🔴",
    size: "6,779 km",
  },
  {
    name: "Jupiter",
    index: "05",
    info: "Largest planet in the Solar System.",
    fact: "Jupiter's Great Red Spot is a storm older than 350 years.",
    distance: "778.5M km",
    distLabel: "From Sun",
    color: "#c8956c",
    colorAlt: "#8b5a3a",
    glow: "rgba(200,149,108,0.5)",
    tag: "GAS GIANT",
    emoji: "🌀",
    size: "139,820 km",
  },
  {
    name: "Saturn",
    index: "06",
    info: "Famous for its spectacular ring system.",
    fact: "Saturn could float in water — it's less dense than water.",
    distance: "1.43B km",
    distLabel: "From Sun",
    color: "#d4a96a",
    colorAlt: "#a07a3a",
    glow: "rgba(212,169,106,0.5)",
    tag: "RING WORLD",
    emoji: "💫",
    size: "116,460 km",
  },
  {
    name: "Uranus",
    index: "07",
    info: "An ice giant that rotates on its side.",
    fact: "Uranus rotates at a 98° tilt — essentially on its side.",
    distance: "2.87B km",
    distLabel: "From Sun",
    color: "#7ececa",
    colorAlt: "#3a9a9a",
    glow: "rgba(126,206,202,0.5)",
    tag: "ICE GIANT",
    emoji: "🧊",
    size: "50,724 km",
  },
  {
    name: "Neptune",
    index: "08",
    info: "Farthest planet from the Sun.",
    fact: "Neptune has the strongest winds in the solar system — 2,100 km/h.",
    distance: "4.50B km",
    distLabel: "From Sun",
    color: "#4466cc",
    colorAlt: "#1a2a8a",
    glow: "rgba(68,102,204,0.5)",
    tag: "DEEP SPACE",
    emoji: "🌊",
    size: "49,244 km",
  },
];

/* ── Stars ─────────────────────────────────────────────────── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.3,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 2,
}));

/* ── Shooting stars ─────────────────────────────────────────── */
const SHOOTS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  startX: Math.random() * 60 + 5,
  startY: Math.random() * 30,
  delay: i * 4.5 + Math.random() * 3,
  dur: Math.random() * 1.2 + 0.7,
  angle: 18 + Math.random() * 22,
}));

/* ── 3D Tilt Hook ────────────────────────────────────────────── */
function useTilt(str = 13) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 160, damping: 24 });
  const ry = useSpring(0, { stiffness: 160, damping: 24 });
  const gx = useSpring(50, { stiffness: 90, damping: 20 });
  const gy = useSpring(50, { stiffness: 90, damping: 20 });
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rx.set(-dy * str); ry.set(dx * str);
    gx.set(50 + dx * 40); gy.set(50 + dy * 40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return { ref, rx, ry, gx, gy, onMove, onLeave };
}

/* ── Planet Card ─────────────────────────────────────────────── */
function PlanetCard({ planet, index }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(11);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -18, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 900, width: "100%" }}
    >
      <motion.div
        ref={ref}
        className="planet-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ scale: 1.05, z: 20 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        {/* Cursor glow */}
        <motion.div className="pc-cursor-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${planet.glow} 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow */}
        <motion.div className="pc-border-glow"
          animate={{
            opacity: hovered ? 1 : 0,
            boxShadow: hovered ? `0 0 0 1px ${planet.color}80, 0 0 40px ${planet.glow}` : "none",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Scan sweep */}
        <motion.div className="pc-scan"
          animate={hovered ? { y: ["-100%", "200%"], opacity: [0, 0.5, 0] } : { opacity: 0 }}
          transition={{ duration: 1.6, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${planet.color}50, transparent)` }}
        />

        {/* Index number */}
        <div className="pc-index" style={{ color: `${planet.color}30` }}>{planet.index}</div>

        {/* Tag */}
        <motion.div className="pc-tag"
          style={{ background: `${planet.color}18`, border: `1px solid ${planet.color}50`, color: planet.color }}
          animate={{ opacity: hovered ? 1 : 0.55 }}
        >
          ✦ {planet.tag}
        </motion.div>

        {/* Emoji planet orb */}
        <motion.div className="pc-orb"
          animate={hovered
            ? { scale: 1.3, y: -6, filter: `drop-shadow(0 0 20px ${planet.color}) drop-shadow(0 0 40px ${planet.color}60)` }
            : { scale: 1, y: 0, filter: `drop-shadow(0 0 10px ${planet.color}80)` }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {planet.emoji}
        </motion.div>

        {/* Content */}
        <div className="pc-content" style={{ transform: "translateZ(16px)" }}>
          <h3 className="pc-name">{planet.name}</h3>
          <p className="pc-info">{planet.info}</p>

          {/* Fact — slides in on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div className="pc-fact"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="pc-fact-icon" style={{ color: planet.color }}>◈</span>
                {planet.fact}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <motion.div className="pc-stats"
            animate={{ opacity: hovered ? 1 : 0.45, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pc-stat">
              <span className="pc-stat-val" style={{ color: planet.color }}>{planet.distance}</span>
              <span className="pc-stat-lbl">{planet.distLabel}</span>
            </div>
            <div className="pc-stat-divider" />
            <div className="pc-stat">
              <span className="pc-stat-val" style={{ color: planet.color }}>{planet.size}</span>
              <span className="pc-stat-lbl">Diameter</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom color line */}
        <motion.div className="pc-bottom-line"
          style={{ background: `linear-gradient(90deg, transparent, ${planet.color}, transparent)` }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Corner brackets */}
        <div className="pc-corner pc-tl" style={{ borderColor: `${planet.color}70` }} />
        <div className="pc-corner pc-br" style={{ borderColor: `${planet.color}70` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ────────────────────────────────────────────── */
export default function SolarSystem() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .ss-root {
          position: relative; min-height: 100vh;
          background: linear-gradient(160deg, #000 0%, #03000a 40%, #000510 70%, #000 100%);
          overflow: hidden; font-family: 'Exo 2', sans-serif; color: white;
          padding: 110px 0 140px;
        }

        /* stars */
        .ss-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .ss-star {
          position: absolute; border-radius: 50%; background: white;
          animation: ss-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes ss-tw {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.88; transform: scale(1.5); }
        }

        /* shooting stars */
        .ss-shoot {
          position: absolute; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0.85), transparent);
          border-radius: 1px; opacity: 0;
          animation: ss-sa var(--dur) var(--del) linear infinite;
        }
        @keyframes ss-sa {
          0%  { opacity:0; width:0; transform:translate(0,0) rotate(var(--ang)); }
          5%  { opacity:1; }
          55% { opacity:0.7; width:130px; }
          100%{ opacity:0; width:60px; transform:translate(260px,150px) rotate(var(--ang)); }
        }

        /* nebulae */
        .ss-neb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px);
          animation: ss-np var(--dur) ease-in-out infinite alternate;
        }
        @keyframes ss-np {
          from { opacity: var(--a); transform: scale(1); }
          to   { opacity: var(--b); transform: scale(1.18); }
        }

        /* grid lines */
        .ss-gridlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.02;
          background-image:
            linear-gradient(rgba(200,149,108,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,149,108,0.8) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 75%);
        }

        /* glow bars */
        .ss-gbar {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #c2944a, #4a9eca, #c1440e, transparent);
          background-size: 200% 100%; animation: ss-gs 6s linear infinite;
        }
        .ss-gbar.top { top: 0; }
        .ss-gbar.bot { bottom: 0; animation-delay: -3s; }
        @keyframes ss-gs { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* inner */
        .ss-inner {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 0 auto; padding: 0 32px;
        }

        /* header */
        .ss-header { text-align: center; margin-bottom: 64px; }
        .ss-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 20px; border-radius: 40px;
          border: 1px solid rgba(194,148,74,0.4); background: rgba(194,148,74,0.08);
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.22em; color: #d4a96a; margin-bottom: 22px;
        }
        .ss-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #d4a96a; box-shadow: 0 0 8px #d4a96a;
          animation: ss-blink 1.5s ease-in-out infinite;
        }
        @keyframes ss-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .ss-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          font-weight: 900; line-height: 1.04;
          background: linear-gradient(135deg, #f0e6d3 0%, #d4a96a 35%, #4a9eca 65%, #c1440e 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(194,148,74,0.35));
          margin-bottom: 16px;
        }
        .ss-sub {
          font-size: 1rem; font-weight: 300; line-height: 1.75;
          color: rgba(212,169,106,0.5); max-width: 480px; margin: 0 auto;
        }
        .ss-divider {
          width: 120px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(194,148,74,0.6), rgba(74,158,202,0.6), transparent);
        }

        /* grid */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }
        @media (max-width: 1100px) { .ss-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 760px)  { .ss-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 480px)  { .ss-grid { grid-template-columns: minmax(0, 1fr); } }

        /* planet card */
        .planet-card {
          position: relative; border-radius: 22px; overflow: hidden; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,0,14,0.95);
          width: 100%; aspect-ratio: 1 / 1;
          display: flex; flex-direction: column;
          transform-style: preserve-3d; padding: 18px;
        }

        .pc-cursor-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .pc-border-glow { position: absolute; inset: 0; border-radius: 22px; pointer-events: none; z-index: 2; }
        .pc-scan        { position: absolute; left: 0; right: 0; top: 0; height: 40%; z-index: 3; pointer-events: none; }

        .pc-index {
          position: absolute; top: 14px; right: 16px; z-index: 5;
          font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 900;
          line-height: 1; letter-spacing: -0.02em;
        }
        .pc-tag {
          position: relative; z-index: 5; align-self: flex-start;
          padding: 3px 10px; border-radius: 16px;
          font-family: 'Orbitron', monospace; font-size: 0.46rem;
          letter-spacing: 0.14em; font-weight: 700; margin-bottom: 10px;
        }
        .pc-orb {
          position: relative; z-index: 5;
          font-size: 2.8rem; line-height: 1; margin-bottom: 10px;
          display: inline-block; transform-origin: center;
        }
        .pc-content { position: relative; z-index: 5; display: flex; flex-direction: column; flex: 1; }

        .pc-name {
          font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 900;
          color: #f0e6d3; letter-spacing: 0.06em; margin-bottom: 5px; line-height: 1;
        }
        .pc-info {
          font-size: 0.72rem; font-weight: 300; color: rgba(212,169,106,0.55);
          line-height: 1.5; margin-bottom: 8px; flex: 1;
        }
        .pc-fact {
          font-size: 0.7rem; font-weight: 400; color: rgba(240,230,211,0.8);
          line-height: 1.55; margin-bottom: 10px; overflow: hidden;
          display: flex; align-items: flex-start; gap: 6px;
        }
        .pc-fact-icon { font-size: 0.75rem; flex-shrink: 0; margin-top: 1px; }

        .pc-stats {
          display: flex; align-items: center; gap: 10px;
          padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: auto;
        }
        .pc-stat { display: flex; flex-direction: column; gap: 1px; }
        .pc-stat-val {
          font-family: 'Orbitron', monospace; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.04em; line-height: 1;
        }
        .pc-stat-lbl {
          font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(212,169,106,0.35);
        }
        .pc-stat-divider {
          width: 1px; height: 24px; background: rgba(255,255,255,0.08); flex-shrink: 0;
        }

        /* bottom line */
        .pc-bottom-line {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; transform-origin: center; z-index: 6;
        }

        /* corner brackets */
        .pc-corner { position: absolute; width: 12px; height: 12px; z-index: 7; pointer-events: none; }
        .pc-tl { top: 8px; left: 8px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 3px 0 0 0; }
        .pc-br { bottom: 8px; right: 8px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 3px 0; }

        /* bottom stats strip */
        .ss-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(194,148,74,0.1); border-radius: 18px;
          overflow: hidden; margin-top: 56px;
        }
        @media (max-width: 640px) { .ss-strip { grid-template-columns: repeat(2, 1fr); } }
        .ss-strip-cell {
          padding: 22px 20px; text-align: center;
          border-right: 1px solid rgba(194,148,74,0.08);
          background: rgba(4,0,14,0.7); transition: background 0.3s;
        }
        .ss-strip-cell:last-child { border-right: none; }
        .ss-strip-cell:hover { background: rgba(194,148,74,0.08); }
        .ss-strip-num {
          font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 900;
          color: #f0e6d3; text-shadow: 0 0 20px rgba(194,148,74,0.4);
        }
        .ss-strip-lbl {
          font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(212,169,106,0.4); margin-top: 4px;
        }

        /* orbit ring decoration */
        .ss-orbit-ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(194,148,74,0.06);
          pointer-events: none; z-index: 1;
          animation: ss-orbit-spin var(--dur) linear infinite;
        }
        @keyframes ss-orbit-spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
      `}</style>

      <div className="ss-root" ref={sectionRef}>

        {/* Stars */}
        <div className="ss-stars">
          {STARS.map(s => (
            <div key={s.id} className="ss-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Shooting stars */}
        {SHOOTS.map(s => (
          <div key={s.id} className="ss-shoot" style={{
            left: `${s.startX}%`, top: `${s.startY}%`,
            "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            "--ang": `${s.angle}deg`,
          }} />
        ))}

        {/* Nebulae */}
        <div className="ss-neb" style={{ width:600, height:400, background:"radial-gradient(ellipse,#c2944a,transparent)", top:"-80px", left:"-120px", "--dur":"11s","--a":"0.06","--b":"0.12" }} />
        <div className="ss-neb" style={{ width:500, height:500, background:"radial-gradient(ellipse,#4a9eca,transparent)", bottom:"0", right:"-80px", "--dur":"14s","--a":"0.05","--b":"0.1" }} />
        <div className="ss-neb" style={{ width:400, height:300, background:"radial-gradient(ellipse,#c1440e,transparent)", top:"40%", left:"35%", "--dur":"9s","--a":"0.04","--b":"0.07" }} />

        {/* Orbit rings decoration */}
        {[400, 600, 800].map((size, i) => (
          <div key={i} className="ss-orbit-ring" style={{
            width: size, height: size,
            top: "50%", left: "50%",
            "--dur": `${30 + i * 15}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }} />
        ))}

        <div className="ss-gridlines" />
        <div className="ss-gbar top" />
        <div className="ss-gbar bot" />

        <div className="ss-inner">

          {/* Header */}
          <motion.div
            className="ss-header"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="ss-eyebrow">
              <div className="ss-eyebrow-dot" />
              OUR SOLAR SYSTEM
            </div>
            <h1 className="ss-title">Eight Worlds</h1>
            <div className="ss-divider" />
            <p className="ss-sub">
              From scorched Mercury to frozen Neptune — explore every planet in our cosmic neighborhood.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="ss-grid">
            {PLANETS.map((planet, i) => (
              <PlanetCard key={planet.name} planet={planet} index={i} />
            ))}
          </div>

          {/* Stats strip */}
          <motion.div
            className="ss-strip"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { num: "8", label: "Known Planets" },
              { num: "4.5B", label: "Years Old" },
              { num: "200+", label: "Known Moons" },
              { num: "4 ly", label: "To Nearest Star" },
            ].map((s, i) => (
              <motion.div key={i} className="ss-strip-cell"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <div className="ss-strip-num">{s.num}</div>
                <div className="ss-strip-lbl">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}