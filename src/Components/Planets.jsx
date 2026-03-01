import { useRef, useState } from "react";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";

/* ── Planet data ──────────────────────────────────────────── */
const PLANETS = [
  {
    name: "Mercury",
    symbol: "☿",
    desc: "The smallest planet and closest to the Sun — a scorched, cratered world with extreme temperature swings.",
    img: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&q=85",
    color: "#c2944a",
    colorAlt: "#8b6914",
    glow: "rgba(194,148,74,0.6)",
    stats: [
      { label: "Distance from Sun", val: "57.9M km" },
      { label: "Day Length", val: "59 Earth days" },
      { label: "Temperature", val: "430°C" },
      { label: "Moons", val: "0" },
    ],
    orbitRadius: 80,
    orbitDur: 8,
    tag: "TERRESTRIAL",
    fact: "A year on Mercury lasts just 88 Earth days.",
  },
  {
    name: "Venus",
    symbol: "♀",
    desc: "The hottest planet in our solar system — its thick atmosphere traps heat in a runaway greenhouse effect.",
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=85",
    color: "#e8a45a",
    colorAlt: "#c07830",
    glow: "rgba(232,164,90,0.6)",
    stats: [
      { label: "Distance from Sun", val: "108.2M km" },
      { label: "Day Length", val: "243 Earth days" },
      { label: "Temperature", val: "465°C" },
      { label: "Moons", val: "0" },
    ],
    orbitRadius: 100,
    orbitDur: 12,
    tag: "TERRESTRIAL",
    fact: "Venus rotates backwards compared to most planets.",
  },
  {
    name: "Earth",
    symbol: "♁",
    desc: "Our home planet — teeming with life, liquid water, and protected by a magnetic field and ozone layer.",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=85",
    color: "#4a9eca",
    colorAlt: "#2563eb",
    glow: "rgba(74,158,202,0.6)",
    stats: [
      { label: "Distance from Sun", val: "149.6M km" },
      { label: "Day Length", val: "24 hours" },
      { label: "Temperature", val: "15°C avg" },
      { label: "Moons", val: "1" },
    ],
    orbitRadius: 120,
    orbitDur: 16,
    tag: "HABITABLE",
    fact: "71% of Earth's surface is covered by water.",
  },
  {
    name: "Mars",
    symbol: "♂",
    desc: "The Red Planet — home to the tallest volcano and deepest canyon in the solar system, a prime target for colonization.",
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=85",
    color: "#c1440e",
    colorAlt: "#9a2c05",
    glow: "rgba(193,68,14,0.6)",
    stats: [
      { label: "Distance from Sun", val: "227.9M km" },
      { label: "Day Length", val: "24.6 hours" },
      { label: "Temperature", val: "-60°C avg" },
      { label: "Moons", val: "2" },
    ],
    orbitRadius: 140,
    orbitDur: 20,
    tag: "ROCKY",
    fact: "Olympus Mons on Mars is 3× the height of Everest.",
  },
  {
    name: "Jupiter",
    symbol: "♃",
    desc: "The largest planet — its Great Red Spot is a storm bigger than Earth that has raged for over 350 years.",
    img: "https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=800&q=85",
    color: "#c8956c",
    colorAlt: "#a0522d",
    glow: "rgba(200,149,108,0.6)",
    stats: [
      { label: "Distance from Sun", val: "778.5M km" },
      { label: "Day Length", val: "9.9 hours" },
      { label: "Temperature", val: "-110°C avg" },
      { label: "Moons", val: "95" },
    ],
    orbitRadius: 160,
    orbitDur: 24,
    tag: "GAS GIANT",
    fact: "Jupiter has 95 known moons, including 4 large Galilean moons.",
  },
  {
    name: "Saturn",
    symbol: "♄",
    desc: "The ringed jewel of our solar system — its iconic rings are made of ice and rock stretching 282,000 km wide.",
    img: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=800&q=85",
    color: "#d4a96a",
    colorAlt: "#a07840",
    glow: "rgba(212,169,106,0.6)",
    stats: [
      { label: "Distance from Sun", val: "1.43B km" },
      { label: "Day Length", val: "10.7 hours" },
      { label: "Temperature", val: "-140°C avg" },
      { label: "Moons", val: "146" },
    ],
    orbitRadius: 180,
    orbitDur: 28,
    tag: "GAS GIANT",
    fact: "Saturn is less dense than water — it would float!",
  },
];

/* ── Stars ─────────────────────────────────────────────────── */
const STARS = Array.from({ length: 140 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

/* ── 3D Tilt Hook ─────────────────────────────────────────── */
function useTilt(str = 14) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 160, damping: 22 });
  const ry = useSpring(0, { stiffness: 160, damping: 22 });
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

/* ── Planet Card ──────────────────────────────────────────── */
function PlanetCard({ planet, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(13);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 70, scale: 0.85, rotateX: -22 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        className="pc-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        onClick={() => onSelect(planet)}
        whileHover={{ scale: 1.04, z: 30 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {/* Animated planet image with rotation */}
        <div className="pc-img-wrap">
          <motion.img
            src={planet.img}
            alt={planet.name}
            className="pc-img"
            animate={{ scale: hovered ? 1.12 : 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Planet spin overlay */}
          <motion.div
            className="pc-spin-overlay"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ background: `conic-gradient(from 0deg, transparent 70%, ${planet.color}18 100%)` }}
          />

          {/* Atmospheric glow rim */}
          <motion.div
            className="pc-atmo"
            style={{ boxShadow: `inset 0 0 30px ${planet.color}40, 0 0 40px ${planet.glow}` }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
          />

          {/* Scan line */}
          <motion.div
            className="pc-scan"
            animate={hovered
              ? { y: ["0%", "100%"], opacity: [0, 0.5, 0] }
              : { opacity: 0 }
            }
            transition={{ duration: 1.8, repeat: hovered ? Infinity : 0, ease: "linear" }}
            style={{ background: `linear-gradient(to bottom, transparent, ${planet.color}60, transparent)` }}
          />

          {/* Tag */}
          <motion.div
            className="pc-tag"
            style={{ background: `${planet.color}22`, border: `1px solid ${planet.color}55`, color: planet.color }}
            animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : -4 }}
            transition={{ duration: 0.3 }}
          >
            {planet.tag}
          </motion.div>

          {/* Symbol */}
          <motion.div
            className="pc-symbol"
            style={{ color: `${planet.color}80` }}
            animate={hovered ? { scale: 1.3, color: planet.color, textShadow: `0 0 20px ${planet.color}` } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {planet.symbol}
          </motion.div>
        </div>

        {/* Cursor glow */}
        <motion.div
          className="pc-cursor-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${planet.glow} 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow */}
        <motion.div
          className="pc-border-glow"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${planet.color}70, 0 0 50px ${planet.glow}, inset 0 0 40px ${planet.color}08` : "none" }}
          transition={{ duration: 0.4 }}
        />

        {/* Info */}
        <div className="pc-info">
          <div className="pc-name-row">
            <h3 className="pc-name">{planet.name}</h3>
            <motion.div
              className="pc-index"
              style={{ color: `${planet.color}50` }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.div>
          </div>

          <p className="pc-desc">{planet.desc}</p>

          {/* Mini stats */}
          <motion.div
            className="pc-mini-stats"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.35, delay: hovered ? 0.05 : 0 }}
          >
            {planet.stats.slice(0, 2).map((s, i) => (
              <div key={i} className="pc-mini-stat">
                <span className="pc-mini-val" style={{ color: planet.color }}>{s.val}</span>
                <span className="pc-mini-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            className="pc-cta"
            style={{ background: `linear-gradient(135deg, ${planet.color}, ${planet.colorAlt})`, boxShadow: `0 6px 24px ${planet.glow}` }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14, scale: hovered ? 1 : 0.92 }}
            transition={{ duration: 0.35, delay: hovered ? 0.1 : 0 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Planet →
          </motion.button>
        </div>

        {/* Corner brackets */}
        <div className="pc-corner pc-tl" style={{ borderColor: `${planet.color}70` }} />
        <div className="pc-corner pc-br" style={{ borderColor: `${planet.color}70` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Detail Modal ─────────────────────────────────────────── */
function PlanetModal({ planet, onClose }) {
  const [tab, setTab] = useState(0);

  return (
    <motion.div
      className="pm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="pm-box"
        initial={{ scale: 0.75, rotateY: -30, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.75, rotateY: 30, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ "--pcolor": planet.color, "--pglow": planet.glow }}
      >
        {/* Left — planet visual */}
        <div className="pm-left">
          <div className="pm-img-wrap">
            <motion.img
              src={planet.img}
              alt={planet.name}
              className="pm-img"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
            <div className="pm-img-atmo" style={{ boxShadow: `0 0 80px ${planet.glow}, inset 0 0 60px ${planet.color}30` }} />

            {/* Orbital ring */}
            <motion.div
              className="pm-orbit-ring"
              animate={{ rotateZ: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ borderColor: `${planet.color}40` }}
            >
              <div className="pm-orbit-dot" style={{ background: planet.color, boxShadow: `0 0 10px ${planet.color}` }} />
            </motion.div>
          </div>

          <div className="pm-symbol-big" style={{ color: planet.color, textShadow: `0 0 30px ${planet.color}` }}>
            {planet.symbol}
          </div>
          <div className="pm-tag-big" style={{ background: `${planet.color}22`, border: `1px solid ${planet.color}55`, color: planet.color }}>
            {planet.tag}
          </div>
        </div>

        {/* Right — info */}
        <div className="pm-right">
          <h2 className="pm-title">{planet.name}</h2>
          <p className="pm-desc">{planet.desc}</p>

          {/* Fact callout */}
          <div className="pm-fact" style={{ borderColor: `${planet.color}40`, background: `${planet.color}10` }}>
            <span style={{ color: planet.color }}>✦ </span>{planet.fact}
          </div>

          {/* Stats grid */}
          <div className="pm-stats">
            {planet.stats.map((s, i) => (
              <motion.div
                key={i}
                className="pm-stat"
                style={{ borderColor: `${planet.color}20` }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
              >
                <span className="pm-stat-val" style={{ color: planet.color }}>{s.val}</span>
                <span className="pm-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Bar — "Habitability" visual */}
          <div className="pm-bar-label">Exploration Priority</div>
          <div className="pm-bar-track">
            <motion.div
              className="pm-bar-fill"
              style={{ background: `linear-gradient(90deg, ${planet.color}, ${planet.colorAlt})`, boxShadow: `0 0 12px ${planet.glow}` }}
              initial={{ width: "0%" }}
              animate={{ width: `${[55, 42, 98, 85, 70, 60][PLANETS.findIndex(p => p.name === planet.name)] ?? 60}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>

          <button
            className="pm-close-btn"
            style={{ background: `linear-gradient(135deg, ${planet.color}, ${planet.colorAlt})` }}
            onClick={onClose}
          >
            Close Mission Briefing
          </button>
        </div>

        {/* Close X */}
        <button className="pm-x" onClick={onClose}>✕</button>

        {/* Corner accents */}
        <div className="pm-corner pm-tl" style={{ borderColor: `${planet.color}70` }} />
        <div className="pm-corner pm-br" style={{ borderColor: `${planet.color}70` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ─────────────────────────────────────────── */
export default function PlanetsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .ps-root {
          position: relative;
          background: linear-gradient(180deg, #000 0%, #0a001a 50%, #000 100%);
          color: white;
          padding: 120px 0 140px;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        /* stars */
        .ps-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .ps-star {
          position: absolute; border-radius: 50%; background: white;
          animation: ps-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes ps-tw {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.9; transform: scale(1.5); }
        }

        /* nebulae */
        .ps-neb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(90px);
          animation: ps-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes ps-pulse {
          from { opacity: var(--a); transform: scale(1); }
          to   { opacity: var(--b); transform: scale(1.2); }
        }

        /* top/bottom glow lines */
        .ps-glow-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #c1440e, transparent);
          background-size: 200% 100%;
          animation: ps-slide 6s linear infinite;
        }
        .ps-glow-line.top { top: 0; }
        .ps-glow-line.bot { bottom: 0; animation-delay: -3s; }
        @keyframes ps-slide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* inner */
        .ps-inner { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 0 32px; }

        /* header */
        .ps-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.35);
          background: rgba(109,40,217,0.1);
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; color: #a78bfa;
          margin-bottom: 22px;
        }
        .ps-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          animation: ps-blink 1.4s ease-in-out infinite;
        }
        @keyframes ps-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .ps-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 900; line-height: 1.05;
          color: #f0e6ff;
          text-shadow: 0 0 40px rgba(139,92,246,0.3);
        }
        .ps-title .acc {
          background: linear-gradient(135deg, #c084fc, #818cf8, #f97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-sub {
          margin-top: 14px; font-size: 1rem; font-weight: 300;
          color: rgba(196,181,253,0.6); line-height: 1.7;
          max-width: 500px; margin-left: auto; margin-right: auto;
        }
        .ps-divider {
          width: 80px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
        }

        /* solar orbit diagram strip */
        .ps-orbit-strip {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 56px; overflow: hidden;
          position: relative;
        }
        .ps-sun {
          width: 40px; height: 40px; border-radius: 50%;
          background: radial-gradient(circle, #fff7aa, #f97316, #c1440e);
          box-shadow: 0 0 40px #f97316, 0 0 80px #f9731640;
          flex-shrink: 0;
          animation: ps-sun-pulse 2.5s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes ps-sun-pulse {
          0%,100%{box-shadow:0 0 40px #f97316, 0 0 80px #f9731640}
          50%{box-shadow:0 0 60px #f97316, 0 0 120px #f9731660}
        }
        .ps-orbit-item {
          display: flex; align-items: center; cursor: pointer;
          transition: all 0.3s;
        }
        .ps-orbit-line {
          height: 1px; background: rgba(139,92,246,0.2);
          position: relative;
        }
        .ps-orbit-planet {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          position: relative; flex-shrink: 0;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .ps-orbit-item:hover .ps-orbit-planet { transform: scale(1.8); }
        .ps-orbit-label {
          font-family: 'Orbitron', monospace; font-size: 0.45rem;
          letter-spacing: 0.1em; color: rgba(196,181,253,0.4);
          margin-top: 4px; text-align: center;
          position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
          white-space: nowrap;
        }
        @media (max-width: 768px) { .ps-orbit-strip { display: none; } }

        /* grid */
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) { .ps-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .ps-grid { grid-template-columns: 1fr; } }

        /* card */
        .pc-card {
          position: relative; border-radius: 22px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(5,0,18,0.95);
          cursor: pointer;
          transform-style: preserve-3d;
        }

        .pc-img-wrap {
          position: relative; height: 220px; overflow: hidden;
        }
        .pc-img {
          width: 100%; height: 100%; object-fit: cover;
          transform-origin: center; will-change: transform;
        }
        .pc-spin-overlay {
          position: absolute; inset: 0; border-radius: 0;
          mix-blend-mode: screen; pointer-events: none;
        }
        .pc-atmo {
          position: absolute; inset: 0; border-radius: 0;
          pointer-events: none; transition: opacity 0.4s;
        }
        .pc-scan {
          position: absolute; left: 0; right: 0; top: 0;
          height: 50%; z-index: 3; pointer-events: none;
        }
        .pc-tag {
          position: absolute; top: 12px; left: 12px; z-index: 5;
          padding: 3px 11px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.48rem;
          letter-spacing: 0.15em; font-weight: 700;
        }
        .pc-symbol {
          position: absolute; top: 10px; right: 14px; z-index: 5;
          font-size: 1.6rem; line-height: 1;
          transition: all 0.4s;
        }

        .pc-cursor-glow { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .pc-border-glow { position: absolute; inset: 0; border-radius: 22px; z-index: 2; pointer-events: none; }

        .pc-info { position: relative; z-index: 6; padding: 20px 20px 22px; }
        .pc-name-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
        .pc-name {
          font-family: 'Orbitron', monospace; font-size: 1.1rem;
          font-weight: 900; color: #f0e6ff; letter-spacing: 0.06em;
        }
        .pc-index {
          font-family: 'Orbitron', monospace; font-size: 1.2rem; font-weight: 900;
        }
        .pc-desc {
          font-size: 0.8rem; font-weight: 300;
          color: rgba(196,181,253,0.55); line-height: 1.6;
        }
        .pc-mini-stats {
          display: flex; gap: 20px; margin-top: 14px;
          padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .pc-mini-stat { display: flex; flex-direction: column; gap: 2px; }
        .pc-mini-val { font-family: 'Orbitron', monospace; font-size: 0.75rem; font-weight: 700; }
        .pc-mini-label { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(196,181,253,0.4); }
        .pc-cta {
          margin-top: 14px; padding: 9px 20px; border-radius: 40px;
          border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: white;
        }

        /* corners */
        .pc-corner {
          position: absolute; width: 15px; height: 15px;
          z-index: 7; pointer-events: none;
        }
        .pc-tl { top: 9px; left: 9px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .pc-br { bottom: 9px; right: 9px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* ── MODAL ─────────────────────────────────────── */
        .pm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(0,0,10,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .pm-box {
          position: relative;
          max-width: 820px; width: 100%;
          border-radius: 28px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(4,0,16,0.97);
          box-shadow: 0 40px 120px rgba(0,0,0,0.9);
          display: grid; grid-template-columns: 280px 1fr;
          transform-style: preserve-3d;
        }
        @media (max-width: 680px) { .pm-box { grid-template-columns: 1fr; } }

        .pm-left {
          padding: 40px 28px;
          background: rgba(0,0,8,0.6);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .pm-img-wrap {
          position: relative; width: 160px; height: 160px;
        }
        .pm-img {
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 50%; will-change: transform;
          filter: saturate(1.2);
        }
        .pm-img-atmo {
          position: absolute; inset: -6px; border-radius: 50%; pointer-events: none;
        }
        .pm-orbit-ring {
          position: absolute; inset: -30px; border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.15);
          transform-origin: center;
        }
        .pm-orbit-dot {
          position: absolute; top: -4px; left: 50%;
          width: 8px; height: 8px; border-radius: 50%;
          transform: translateX(-50%);
        }
        .pm-symbol-big {
          font-size: 3.5rem; line-height: 1;
        }
        .pm-tag-big {
          padding: 5px 16px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.15em; font-weight: 700;
        }

        .pm-right { padding: 36px 32px 32px; overflow-y: auto; max-height: 90vh; }
        .pm-title {
          font-family: 'Orbitron', monospace; font-size: 2rem;
          font-weight: 900; color: #f0e6ff; letter-spacing: 0.06em;
          margin-bottom: 12px;
        }
        .pm-desc {
          font-size: 0.88rem; font-weight: 300;
          color: rgba(196,181,253,0.65); line-height: 1.7; margin-bottom: 18px;
        }
        .pm-fact {
          padding: 12px 16px; border-radius: 10px; border-left: 3px solid;
          font-size: 0.82rem; color: rgba(224,207,255,0.75);
          line-height: 1.55; margin-bottom: 24px;
        }
        .pm-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 22px;
        }
        .pm-stat {
          padding: 12px 14px; border-radius: 12px;
          border: 1px solid; background: rgba(255,255,255,0.02);
          display: flex; flex-direction: column; gap: 3px;
        }
        .pm-stat-val {
          font-family: 'Orbitron', monospace; font-size: 0.95rem; font-weight: 700;
        }
        .pm-stat-label {
          font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(196,181,253,0.4);
        }
        .pm-bar-label {
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(196,181,253,0.4); margin-bottom: 8px;
        }
        .pm-bar-track {
          height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06);
          overflow: hidden; margin-bottom: 24px;
        }
        .pm-bar-fill { height: 100%; border-radius: 3px; }
        .pm-close-btn {
          padding: 12px 28px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: white; transition: transform 0.2s, box-shadow 0.2s;
        }
        .pm-close-btn:hover { transform: scale(1.04); }

        .pm-x {
          position: absolute; top: 14px; right: 14px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,10,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 0.85rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px); z-index: 10;
        }
        .pm-x:hover { background: rgba(109,40,217,0.4); color: white; transform: scale(1.1); }

        .pm-corner {
          position: absolute; width: 20px; height: 20px; z-index: 11; pointer-events: none;
        }
        .pm-tl { top: 12px; left: 12px; border-top: 2px solid; border-left: 2px solid; border-radius: 6px 0 0 0; }
        .pm-br { bottom: 12px; right: 12px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 6px 0; }
      `}</style>

      <section className="ps-root" ref={sectionRef}>

        {/* Stars */}
        <div className="ps-stars">
          {STARS.map(s => (
            <div key={s.id} className="ps-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Nebulae */}
        <div className="ps-neb" style={{ width: 600, height: 400, background: "radial-gradient(ellipse, #7c3aed, transparent)", top: "-100px", left: "-100px", "--dur": "10s", "--a": "0.08", "--b": "0.16" }} />
        <div className="ps-neb" style={{ width: 500, height: 400, background: "radial-gradient(ellipse, #c1440e, transparent)", bottom: "-80px", right: "-80px", "--dur": "12s", "--a": "0.07", "--b": "0.13" }} />
        <div className="ps-neb" style={{ width: 400, height: 300, background: "radial-gradient(ellipse, #4f46e5, transparent)", top: "40%", left: "35%", "--dur": "8s", "--a": "0.04", "--b": "0.09" }} />

        {/* Glow bars */}
        <div className="ps-glow-line top" />
        <div className="ps-glow-line bot" />

        <div className="ps-inner">

          {/* Header */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="ps-eyebrow">
              <div className="ps-eyebrow-dot" />
              SOLAR SYSTEM
            </div>
            <h2 className="ps-title">
              Our <span className="acc">Planets</span>
            </h2>
            <p className="ps-sub">
              From scorched Mercury to the ringed wonder of Saturn — explore every world in our cosmic neighbourhood.
            </p>
            <div className="ps-divider" />
          </motion.div>

          {/* Mini solar system strip */}
          <motion.div
            className="ps-orbit-strip"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <div className="ps-sun" />
            {PLANETS.map((p, i) => (
              <div key={p.name} className="ps-orbit-item" onClick={() => setSelected(p)}>
                <div className="ps-orbit-line" style={{ width: `${30 + i * 8}px` }} />
                <div style={{ position: "relative" }}>
                  <div
                    className="ps-orbit-planet"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.colorAlt})`,
                      boxShadow: `0 0 12px ${p.glow}`,
                      width: `${10 + i * 2}px`, height: `${10 + i * 2}px`,
                    }}
                  />
                  <span className="ps-orbit-label" style={{ color: `${p.color}80` }}>{p.name}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Planet cards grid */}
          <motion.div
            className="ps-grid"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {PLANETS.map((planet, i) => (
              <PlanetCard
                key={planet.name}
                planet={planet}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </motion.div>

        </div>
      </section>

      {/* Planet detail modal */}
      <AnimatePresence>
        {selected && (
          <PlanetModal planet={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}