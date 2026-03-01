import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

/* ── Card Data ───────────────────────────────────────────────── */
const CARDS = [
  {
    id: 1,
    title: "Bintang Jatuh",
    subtitle: "Shooting Stars",
    description: "Fenomena cahaya meteor yang melesat melintasi atmosfer bumi, menciptakan jejak cahaya yang memukau di langit malam.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    color: "#818cf8",
    colorAlt: "#4f46e5",
    glow: "rgba(129,140,248,0.5)",
    tag: "METEOR EVENT",
    stat: "72 km/s",
    statLabel: "Entry Speed",
  },
  {
    id: 2,
    title: "Bima Sakti",
    subtitle: "Milky Way Galaxy",
    description: "Galaksi spiral yang menjadi rumah bagi tata surya kita, membentang lebih dari 100.000 tahun cahaya di alam semesta.",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&q=80",
    color: "#c084fc",
    colorAlt: "#9333ea",
    glow: "rgba(192,132,252,0.5)",
    tag: "GALAXY",
    stat: "100K ly",
    statLabel: "Diameter",
  },
  {
    id: 3,
    title: "Pleiades",
    subtitle: "The Seven Sisters",
    description: "Gugus bintang terbuka yang terdiri dari bintang-bintang panas biru, terletak di rasi bintang Taurus sejak dahulu kala.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    color: "#34d399",
    colorAlt: "#059669",
    glow: "rgba(52,211,153,0.5)",
    tag: "STAR CLUSTER",
    stat: "444 ly",
    statLabel: "Distance",
  },
  {
    id: 4,
    title: "Orion",
    subtitle: "The Hunter",
    description: "Salah satu konstelasi paling terkenal dan mudah dikenali, menampilkan tiga bintang ikonik yang membentuk sabuk Orion.",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80",
    color: "#f97316",
    colorAlt: "#ea580c",
    glow: "rgba(249,115,22,0.5)",
    tag: "CONSTELLATION",
    stat: "1,344 ly",
    statLabel: "Nebula Dist.",
  },
  {
    id: 5,
    title: "Star Woman",
    subtitle: "Celestial Guardian",
    description: "Legenda kosmik tentang wanita bintang yang menjaga keseimbangan alam semesta, menerangi kegelapan dengan cahaya abadi.",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&q=80",
    color: "#f472b6",
    colorAlt: "#db2777",
    glow: "rgba(244,114,182,0.5)",
    tag: "COSMIC LEGEND",
    stat: "∞",
    statLabel: "Light Years",
  },
  {
    id: 6,
    title: "Andromeda",
    subtitle: "Our Neighbor Galaxy",
    description: "Galaksi spiral terdekat dengan Bima Sakti, berjarak sekitar 2,5 juta tahun cahaya dan menuju ke arah kita.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80",
    color: "#0ea5e9",
    colorAlt: "#0284c7",
    glow: "rgba(14,165,233,0.5)",
    tag: "GALAXY",
    stat: "2.5M ly",
    statLabel: "Distance",
  },
];

/* ── Stars ──────────────────────────────────────────────────── */
const STARS = Array.from({ length: 140 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.3,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 2,
}));

/* ── Shooting stars ──────────────────────────────────────────── */
const SHOOTS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  startX: Math.random() * 60 + 5,
  startY: Math.random() * 30,
  delay: i * 4 + Math.random() * 3,
  dur: Math.random() * 1.4 + 0.7,
  angle: 20 + Math.random() * 20,
}));

/* ── 3D Tilt Hook ────────────────────────────────────────────── */
function useTilt(str = 14) {
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

/* ── Astronaut SVG ───────────────────────────────────────────── */
function AstronautSVG() {
  return (
    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <ellipse cx="100" cy="170" rx="55" ry="70" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="100" cy="90" r="48" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
      <ellipse cx="100" cy="88" rx="32" ry="30" fill="#0ea5e9" opacity="0.85" />
      <ellipse cx="100" cy="88" rx="32" ry="30" fill="url(#visorGrad)" opacity="0.5" />
      <ellipse cx="88" cy="76" rx="10" ry="8" fill="white" opacity="0.3" />
      <ellipse cx="45" cy="175" rx="18" ry="45" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" transform="rotate(-15 45 175)" />
      <ellipse cx="155" cy="175" rx="18" ry="45" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" transform="rotate(15 155 175)" />
      <circle cx="38" cy="215" r="14" fill="#94a3b8" />
      <circle cx="162" cy="215" r="14" fill="#94a3b8" />
      <ellipse cx="76" cy="240" rx="22" ry="38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <ellipse cx="124" cy="240" rx="22" ry="38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <ellipse cx="70" cy="272" rx="26" ry="10" fill="#475569" />
      <ellipse cx="130" cy="272" rx="26" ry="10" fill="#475569" />
      <rect x="75" y="148" width="50" height="35" rx="6" fill="#64748b" />
      <rect x="80" y="153" width="10" height="8" rx="2" fill="#0ea5e9" />
      <rect x="93" y="153" width="10" height="8" rx="2" fill="#22d3ee" />
      <rect x="106" y="153" width="10" height="8" rx="2" fill="#a855f7" />
      <rect x="80" y="164" width="32" height="4" rx="2" fill="#94a3b8" />
      <rect x="60" y="135" width="80" height="50" rx="8" fill="#334155" opacity="0.5" />
      {/* Tether line */}
      <path d="M 162 215 Q 195 200 192 170" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />
      <defs>
        <radialGradient id="visorGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Galaxy Card ─────────────────────────────────────────────── */
function GalaxyCard({ card, index, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -22, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      transition={{ duration: 0.85, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        className="sg-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ scale: 1.04, z: 24 }}
        onClick={onClick}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {/* Image */}
        {!imgErr ? (
          <motion.img
            src={card.image}
            alt={card.title}
            className="sg-card-img"
            animate={{ scale: hovered ? 1.1 : 1.03 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="sg-card-img" style={{ background: `radial-gradient(ellipse, ${card.color}20, transparent)` }} />
        )}

        {/* Dark overlay */}
        <div className="sg-card-dark" />

        {/* Cursor glow */}
        <motion.div className="sg-cursor-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${card.glow} 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow */}
        <motion.div className="sg-border-glow"
          animate={{
            opacity: hovered ? 1 : 0,
            boxShadow: hovered ? `0 0 0 1px ${card.color}70, 0 0 50px ${card.glow}` : "none",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Scan sweep */}
        <motion.div className="sg-scan"
          animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.4, 0] } : { opacity: 0 }}
          transition={{ duration: 1.8, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${card.color}60, transparent)` }}
        />

        {/* Tag */}
        <motion.div className="sg-tag"
          style={{ background: `${card.color}1a`, border: `1px solid ${card.color}55`, color: card.color }}
          animate={{ opacity: hovered ? 1 : 0.55 }}
        >
          ✦ {card.tag}
        </motion.div>

        {/* Card index */}
        <div className="sg-num" style={{ color: `${card.color}40` }}>
          {String(card.id).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="sg-content" style={{ transform: "translateZ(18px)" }}>
          <div className="sg-subtitle" style={{ color: `${card.color}cc` }}>{card.subtitle}</div>
          <h3 className="sg-title">{card.title}</h3>
          <p className="sg-desc">{card.description}</p>

          {/* Stat */}
          <motion.div className="sg-stat-row"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: hovered ? 0.05 : 0 }}
          >
            <span className="sg-stat-num" style={{ color: card.color }}>{card.stat}</span>
            <span className="sg-stat-label">{card.statLabel}</span>
          </motion.div>

          {/* CTA */}
          <motion.div className="sg-cta"
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -10 }}
            transition={{ duration: 0.3, delay: hovered ? 0.1 : 0 }}
          >
            <span style={{ color: card.color }}>Jelajahi</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ color: card.color }}
            >→</motion.span>
          </motion.div>
        </div>

        {/* Corner brackets */}
        <div className="sg-corner sg-tl" style={{ borderColor: `${card.color}80` }} />
        <div className="sg-corner sg-br" style={{ borderColor: `${card.color}80` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Nav Button ──────────────────────────────────────────────── */
function NavBtn({ dir, onClick, disabled }) {
  return (
    <motion.button
      className="sg-navbtn"
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.12 } : {}}
      whileTap={!disabled ? { scale: 0.93 } : {}}
      style={{ opacity: disabled ? 0.3 : 1, cursor: disabled ? "default" : "pointer" }}
    >
      {dir === "left" ? "←" : "→"}
    </motion.button>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function SpaceGalaxy() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const COLS = 3;
  const totalPages = Math.ceil(CARDS.length / COLS);
  const visible = CARDS.slice(page * COLS, page * COLS + COLS);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=Cinzel:wght@400;700&display=swap');

        .sg-root {
          position: relative; min-height: 100vh;
          background: linear-gradient(160deg, #000 0%, #04000e 40%, #000813 70%, #000 100%);
          overflow: hidden; font-family: 'Exo 2', sans-serif;
          color: white;
        }

        /* stars */
        .sg-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .sg-star {
          position: absolute; border-radius: 50%; background: white;
          animation: sg-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes sg-tw {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.9; transform: scale(1.5); }
        }

        /* shooting stars */
        .sg-shoot {
          position: absolute; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0.85), transparent);
          border-radius: 1px; opacity: 0;
          animation: sg-sa var(--dur) var(--del) linear infinite;
        }
        @keyframes sg-sa {
          0%   { opacity: 0; width: 0; transform: translate(0,0) rotate(var(--ang)); }
          5%   { opacity: 1; }
          55%  { opacity: 0.7; width: 130px; }
          100% { opacity: 0; width: 60px; transform: translate(260px,150px) rotate(var(--ang)); }
        }

        /* nebulae */
        .sg-neb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px);
          animation: sg-np var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sg-np {
          from { opacity: var(--a); transform: scale(1); }
          to   { opacity: var(--b); transform: scale(1.2); }
        }

        /* warp grid */
        .sg-grid-lines {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.022;
          background-image: linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 75%);
        }

        /* glow bars */
        .sg-gbar {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #818cf8, #c084fc, #34d399, transparent);
          background-size: 200% 100%;
          animation: sg-gs 6s linear infinite;
        }
        .sg-gbar.top { top: 0; }
        .sg-gbar.bot { bottom: 0; animation-delay: -3s; }
        @keyframes sg-gs { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* inner layout */
        .sg-inner {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 0 auto; padding: 0 32px;
        }

        /* header */
        .sg-header { text-align: center; padding: 100px 0 56px; }
        .sg-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 6px 20px; border-radius: 40px;
          border: 1px solid rgba(129,140,248,0.35); background: rgba(79,70,229,0.1);
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.22em; color: #a5b4fc; margin-bottom: 24px;
        }
        .sg-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a5b4fc; box-shadow: 0 0 8px #a5b4fc;
          animation: sg-blink 1.4s ease-in-out infinite;
        }
        @keyframes sg-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .sg-h1 {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 700; line-height: 1;
          background: linear-gradient(135deg, #f0e6ff 0%, #a5b4fc 40%, #c084fc 70%, #34d399 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(129,140,248,0.4));
          margin-bottom: 14px;
        }
        .sg-h1-sub {
          font-family: 'Orbitron', monospace; font-size: 0.62rem;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(196,181,253,0.45); margin-bottom: 0;
        }
        .sg-divider {
          width: 100px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent);
        }

        /* cards row */
        .sg-controls {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 48px;
        }
        .sg-cards-grid {
          flex: 1;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
        }
        @media (max-width: 900px) { .sg-cards-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .sg-cards-grid { grid-template-columns: 1fr; } }

        /* nav button */
        .sg-navbtn {
          width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px); color: #e2e8f0;
          font-family: 'Orbitron', monospace; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.3s, border 0.3s, box-shadow 0.3s;
        }
        .sg-navbtn:hover { background: rgba(129,140,248,0.2); border-color: rgba(129,140,248,0.5); box-shadow: 0 0 20px rgba(129,140,248,0.4); }

        /* page dots */
        .sg-dots { display: flex; gap: 8px; justify-content: center; margin-bottom: 56px; }
        .sg-dot {
          height: 8px; border-radius: 4px; cursor: pointer; border: none;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
          background: rgba(255,255,255,0.2);
        }
        .sg-dot.active { background: #818cf8; box-shadow: 0 0 10px rgba(129,140,248,0.6); }

        /* ── card ── */
        .sg-card {
          position: relative; border-radius: 22px; overflow: hidden; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,0,18,0.95); min-height: 460px;
          display: flex; flex-direction: column;
          transform-style: preserve-3d;
        }
        .sg-card-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0.22; transform-origin: center;
          will-change: transform; transition: opacity 0.5s;
        }
        .sg-card:hover .sg-card-img { opacity: 0.38; }
        .sg-card-dark {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,12,0.97) 0%, rgba(0,0,12,0.5) 50%, rgba(0,0,12,0.15) 100%);
          z-index: 1;
        }
        .sg-cursor-glow { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .sg-border-glow { position: absolute; inset: 0; border-radius: 22px; z-index: 3; pointer-events: none; }
        .sg-scan { position: absolute; left: 0; right: 0; top: 0; height: 50%; z-index: 4; pointer-events: none; }

        .sg-tag {
          position: absolute; top: 14px; left: 14px; z-index: 6;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.5rem;
          letter-spacing: 0.14em; font-weight: 700;
        }
        .sg-num {
          position: absolute; top: 12px; right: 14px; z-index: 6;
          font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 900;
        }

        .sg-content {
          position: relative; z-index: 6;
          padding: 20px 20px 24px; margin-top: auto;
          display: flex; flex-direction: column; flex: 1; justify-content: flex-end;
        }
        .sg-subtitle {
          font-family: 'Orbitron', monospace; font-size: 0.52rem;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; opacity: 0.8;
        }
        .sg-title {
          font-family: 'Cinzel', serif; font-size: 1.35rem; font-weight: 700;
          color: #f0e6ff; margin-bottom: 10px; line-height: 1.2;
        }
        .sg-desc {
          font-size: 0.8rem; font-weight: 300;
          color: rgba(196,181,253,0.6); line-height: 1.65; margin-bottom: 14px;
        }
        .sg-stat-row {
          display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;
          padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sg-stat-num {
          font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 900;
        }
        .sg-stat-label {
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(196,181,253,0.45);
        }
        .sg-cta {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700;
        }

        /* corner brackets */
        .sg-corner { position: absolute; width: 16px; height: 16px; z-index: 7; pointer-events: none; }
        .sg-tl { top: 10px; left: 10px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .sg-br { bottom: 10px; right: 10px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* ── Astronaut ── */
        .sg-astro-wrap {
          display: flex; justify-content: center; align-items: flex-end;
          padding-bottom: 0; margin-top: -16px;
          position: relative; z-index: 10;
        }

        /* ── bottom strip ── */
        .sg-strip {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(129,140,248,0.1); border-radius: 18px;
          overflow: hidden; margin: 0 0 80px;
        }
        @media (max-width: 640px) { .sg-strip { grid-template-columns: 1fr; } }
        .sg-strip-cell {
          padding: 22px 24px; text-align: center;
          border-right: 1px solid rgba(129,140,248,0.08);
          background: rgba(5,0,20,0.7);
          transition: background 0.3s;
        }
        .sg-strip-cell:last-child { border-right: none; }
        .sg-strip-cell:hover { background: rgba(79,70,229,0.12); }
        .sg-strip-num {
          font-family: 'Orbitron', monospace; font-size: 1.5rem; font-weight: 900;
          color: #e9d5ff; text-shadow: 0 0 20px rgba(129,140,248,0.5);
        }
        .sg-strip-label {
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(167,139,250,0.45); margin-top: 4px;
        }

        /* ── footer credit ── */
        .sg-credit {
          text-align: center; padding-bottom: 32px;
          font-family: 'Orbitron', monospace; font-size: 0.48rem;
          letter-spacing: 0.2em; color: rgba(167,139,250,0.25);
          position: relative; z-index: 10;
        }

        /* mobile nav */
        .sg-mobile-nav { display: none; justify-content: center; gap: 12px; margin: 16px 0 24px; }
        @media (max-width: 900px) { .sg-mobile-nav { display: flex; } .sg-navbtn.desktop { display: none; } }
        @media (min-width: 901px) { .sg-navbtn.desktop { display: flex; } }
      `}</style>

      <div className="sg-root">

        {/* Stars */}
        <div className="sg-stars">
          {STARS.map(s => (
            <div key={s.id} className="sg-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Shooting stars */}
        {SHOOTS.map(s => (
          <div key={s.id} className="sg-shoot" style={{
            left: `${s.startX}%`, top: `${s.startY}%`,
            "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            "--ang": `${s.angle}deg`,
          }} />
        ))}

        {/* Nebulae */}
        <div className="sg-neb" style={{ width:600, height:400, background:"radial-gradient(ellipse,#7c3aed,transparent)", top:"-60px", left:"-100px", "--dur":"10s","--a":"0.07","--b":"0.14" }} />
        <div className="sg-neb" style={{ width:500, height:500, background:"radial-gradient(ellipse,#0ea5e9,transparent)", bottom:"0", right:"-80px", "--dur":"13s","--a":"0.05","--b":"0.1" }} />
        <div className="sg-neb" style={{ width:350, height:350, background:"radial-gradient(ellipse,#c084fc,transparent)", top:"40%", left:"35%", "--dur":"9s","--a":"0.04","--b":"0.08" }} />

        <div className="sg-grid-lines" />
        <div className="sg-gbar top" />
        <div className="sg-gbar bot" />

        <div className="sg-inner">

          {/* Header */}
          <motion.div
            className="sg-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="sg-eyebrow">
              <div className="sg-eyebrow-dot" />
              DEEP SPACE OBSERVATORY
            </div>
            <h1 className="sg-h1">Galaksi</h1>
            <p className="sg-h1-sub">Penjelajahan Kosmik · Space Exploration</p>
            <div className="sg-divider" />
          </motion.div>

          {/* Controls + Cards */}
          <div className="sg-controls">
            <NavBtn dir="left" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} />
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                className="sg-cards-grid"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              >
                {visible.map((card, i) => (
                  <GalaxyCard
                    key={card.id}
                    card={card}
                    index={i}
                    isActive={selected?.id === card.id}
                    onClick={() => setSelected(selected?.id === card.id ? null : card)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <NavBtn dir="right" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} />
          </div>

          {/* Mobile nav */}
          <div className="sg-mobile-nav">
            <NavBtn dir="left" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} />
            <NavBtn dir="right" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} />
          </div>

          {/* Page dots */}
          <div className="sg-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`sg-dot ${i === page ? "active" : ""}`}
                onClick={() => setPage(i)}
                style={{ width: i === page ? "28px" : "8px" }}
              />
            ))}
          </div>

          {/* Stats strip */}
          <motion.div
            className="sg-strip"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { num: "200B+", label: "Galaxies in Universe" },
              { num: "100K", label: "Light-years Wide" },
              { num: "13.8B", label: "Years Old" },
            ].map((s, i) => (
              <motion.div key={i} className="sg-strip-cell" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <div className="sg-strip-num">{s.num}</div>
                <div className="sg-strip-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Astronaut */}
        <motion.div
          className="sg-astro-wrap"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{ width: "170px", height: "220px" }}
          >
            <AstronautSVG />
          </motion.div>
        </motion.div>

        {/* Ground glow */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "180px",
          background: "linear-gradient(to top, rgba(129,140,248,0.07), transparent)",
          pointerEvents: "none", zIndex: 5,
        }} />

        {/* Footer credit */}
        <div className="sg-credit">© 2026 · GALAKSI OBSERVATORY · BEYOND THE STARS</div>

      </div>
    </>
  );
}