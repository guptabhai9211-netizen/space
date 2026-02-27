import { useRef, useState } from "react";
import {
  motion, useInView, useSpring, AnimatePresence,
} from "framer-motion";

/* ── Stars ─────────────────────────────────────────────────── */
const STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.3,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 2,
}));

/* ── Floating particles ─────────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 90 + 5,
  y: Math.random() * 80 + 10,
  size: Math.random() * 4 + 1,
  dur: Math.random() * 12 + 8,
  delay: Math.random() * 6,
}));

/* ── Explore items ──────────────────────────────────────────── */
const EXPLORE_ITEMS = [
  {
    icon: "🚀",
    title: "Space Missions",
    desc: "Explore historic and upcoming missions pushing the boundaries of human discovery — from Apollo to Artemis and beyond.",
    color: "#818cf8",
    colorAlt: "#4f46e5",
    glow: "rgba(129,140,248,0.55)",
    tag: "ACTIVE MISSIONS",
    count: "320+",
    countLabel: "Missions tracked",
    detail: "Artemis III · JWST · Voyager · Cassini",
    facts: ["47 currently active", "12 agency partners", "Next: Mars 2030"],
    bg: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
  },
  {
    icon: "🪐",
    title: "Planetary Systems",
    desc: "Dive into planets, moons, and distant exoplanets — from scorching Mercury to the ice giants at the edge of our solar system.",
    color: "#34d399",
    colorAlt: "#059669",
    glow: "rgba(52,211,153,0.55)",
    tag: "SOLAR SYSTEM",
    count: "5,500+",
    countLabel: "Exoplanets found",
    detail: "Mercury · Venus · Earth · Mars · Jupiter",
    facts: ["57 potentially habitable", "8 solar planets", "200B+ estimated galaxies"],
    bg: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
  },
  {
    icon: "🔭",
    title: "Deep Space Research",
    desc: "Discover cutting-edge research unlocking the secrets of dark matter, black holes, and the very first light of the universe.",
    color: "#c084fc",
    colorAlt: "#9333ea",
    glow: "rgba(192,132,252,0.55)",
    tag: "RESEARCH LAB",
    count: "40K+",
    countLabel: "Research papers",
    detail: "Hubble · JWST · Chandra · Event Horizon",
    facts: ["13.8B light-years captured", "28 telescopes active", "Webb operational since 2022"],
    bg: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
  },
];

/* ── 3D Tilt Hook ───────────────────────────────────────────── */
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

/* ── Explore Card ───────────────────────────────────────────── */
function ExploreCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -20, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: index * 0.16, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        className="ec-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ scale: 1.035, z: 28 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {/* Background image */}
        {!imgError ? (
          <motion.img
            src={item.bg}
            alt=""
            className="ec-bg-img"
            animate={{ scale: hovered ? 1.1 : 1.03 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="ec-bg-img" style={{ background: `radial-gradient(ellipse at 30% 30%, ${item.color}20, transparent)` }} />
        )}

        {/* Dark gradient overlay */}
        <div className="ec-dark" />

        {/* Cursor radial glow */}
        <motion.div
          className="ec-cursor-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.glow} 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Border glow */}
        <motion.div
          className="ec-border-glow"
          animate={{
            opacity: hovered ? 1 : 0,
            boxShadow: hovered ? `0 0 0 1px ${item.color}70, 0 0 60px ${item.glow}, inset 0 0 40px ${item.color}08` : "none",
          }}
          transition={{ duration: 0.45 }}
        />

        {/* Scan sweep */}
        <motion.div
          className="ec-scan"
          animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.45, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${item.color}60, transparent)` }}
        />

        {/* Top badge */}
        <motion.div
          className="ec-badge"
          style={{ background: `${item.color}1a`, border: `1px solid ${item.color}55`, color: item.color }}
          animate={{ opacity: hovered ? 1 : 0.55, y: hovered ? 0 : -5 }}
          transition={{ duration: 0.3 }}
        >
          ✦ {item.tag}
        </motion.div>

        {/* ── Content ── */}
        <div className="ec-content" style={{ transform: "translateZ(18px)" }}>

          {/* Icon + count row */}
          <div className="ec-top-row">
            <motion.span
              className="ec-icon"
              animate={hovered
                ? { scale: 1.3, y: -6, filter: `drop-shadow(0 0 18px ${item.color})` }
                : { scale: 1, y: 0, filter: `drop-shadow(0 0 8px ${item.color}80)` }
              }
              transition={{ duration: 0.45 }}
            >
              {item.icon}
            </motion.span>

            <motion.div
              className="ec-count-box"
              style={{ borderColor: `${item.color}30`, background: `${item.color}0d` }}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88 }}
              transition={{ duration: 0.3, delay: hovered ? 0.08 : 0 }}
            >
              <span className="ec-count" style={{ color: item.color }}>{item.count}</span>
              <span className="ec-count-label">{item.countLabel}</span>
            </motion.div>
          </div>

          <h3 className="ec-title">{item.title}</h3>
          <p className="ec-desc">{item.desc}</p>

          {/* Detail tag */}
          <motion.div
            className="ec-detail"
            style={{ color: `${item.color}80` }}
            animate={{ opacity: hovered ? 0.7 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            {item.detail}
          </motion.div>

          {/* Facts list */}
          <motion.div
            className="ec-facts"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.35, delay: hovered ? 0.07 : 0 }}
          >
            {item.facts.map((f, i) => (
              <div key={i} className="ec-fact">
                <span className="ec-fact-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                {f}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            className="ec-cta"
            style={{
              background: `linear-gradient(135deg, ${item.color}, ${item.colorAlt})`,
              boxShadow: `0 6px 24px ${item.glow}`,
            }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16, scale: hovered ? 1 : 0.9 }}
            transition={{ duration: 0.35, delay: hovered ? 0.12 : 0 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Now →
          </motion.button>
        </div>

        {/* Corner brackets */}
        <div className="ec-corner ec-tl" style={{ borderColor: `${item.color}80` }} />
        <div className="ec-corner ec-br" style={{ borderColor: `${item.color}80` }} />

        {/* Index number */}
        <div className="ec-num" style={{ color: `${item.color}40` }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ───────────────────────────────────────────── */
export default function ExploreSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .es-root {
          position: relative;
          background: linear-gradient(180deg, #000 0%, #04000e 50%, #000 100%);
          color: white;
          padding: 120px 0 140px;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        /* stars */
        .es-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .es-star {
          position: absolute; border-radius: 50%; background: white;
          animation: es-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes es-tw {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.9;  transform: scale(1.5); }
        }

        /* floating particles */
        .es-particle {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(129,140,248,0.6), transparent);
          animation: es-float var(--dur) var(--del) ease-in-out infinite alternate;
          z-index: 1;
        }
        @keyframes es-float {
          from { transform: translateY(0) scale(1);   opacity: 0.2; }
          to   { transform: translateY(-30px) scale(1.3); opacity: 0.5; }
        }

        /* nebulae */
        .es-neb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(100px);
          animation: es-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes es-pulse {
          from { opacity: var(--a); transform: scale(1); }
          to   { opacity: var(--b); transform: scale(1.2); }
        }

        /* glow bars */
        .es-glow-bar {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #818cf8, #4f46e5, #c084fc, transparent);
          background-size: 200% 100%;
          animation: es-barslide 5s linear infinite;
        }
        .es-glow-bar.top { top: 0; }
        .es-glow-bar.bot { bottom: 0; animation-delay: -2.5s; }
        @keyframes es-barslide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* warp grid */
        .es-warp {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.022;
          background-image:
            linear-gradient(rgba(129,140,248,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 75%);
        }

        .es-inner {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 0 auto; padding: 0 32px;
        }

        /* ── header ── */
        .es-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(129,140,248,0.35);
          background: rgba(79,70,229,0.1);
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; color: #a5b4fc;
          margin-bottom: 22px;
        }
        .es-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a5b4fc; box-shadow: 0 0 8px #a5b4fc;
          animation: es-blink 1.4s ease-in-out infinite;
        }
        @keyframes es-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .es-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 900; line-height: 1.06;
          color: #f0e6ff;
          text-shadow: 0 0 50px rgba(129,140,248,0.3);
        }
        .es-title .acc {
          background: linear-gradient(135deg, #a5b4fc, #818cf8, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .es-sub {
          margin-top: 16px; font-size: 1rem; font-weight: 300;
          color: rgba(196,181,253,0.55); line-height: 1.75;
          max-width: 560px; margin-left: auto; margin-right: auto;
        }
        .es-divider {
          width: 80px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent);
        }

        /* ── cards grid ── */
        .es-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 56px;
        }
        @media (max-width: 980px)  { .es-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 620px)  { .es-grid { grid-template-columns: 1fr; } }

        /* ── card ── */
        .ec-card {
          position: relative; border-radius: 22px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,0,18,0.96);
          cursor: pointer; min-height: 500px;
          display: flex; flex-direction: column;
          transform-style: preserve-3d;
        }

        .ec-bg-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transform-origin: center; will-change: transform; opacity: 0.22;
          transition: opacity 0.5s;
        }
        .ec-card:hover .ec-bg-img { opacity: 0.38; }

        .ec-dark {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,12,0.97) 0%, rgba(0,0,12,0.55) 50%, rgba(0,0,12,0.2) 100%);
          z-index: 1;
        }
        .ec-cursor-glow { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .ec-border-glow { position: absolute; inset: 0; border-radius: 22px; z-index: 3; pointer-events: none; }
        .ec-scan {
          position: absolute; left: 0; right: 0; top: 0;
          height: 50%; z-index: 4; pointer-events: none;
        }

        .ec-badge {
          position: absolute; top: 16px; left: 16px; z-index: 6;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.5rem;
          letter-spacing: 0.14em; font-weight: 700;
        }

        .ec-num {
          position: absolute; top: 14px; right: 16px; z-index: 6;
          font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 900;
        }

        .ec-content {
          position: relative; z-index: 6;
          padding: 24px 22px 26px;
          display: flex; flex-direction: column;
          flex: 1; justify-content: flex-end;
          margin-top: auto;
        }

        .ec-top-row {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 16px;
        }
        .ec-icon {
          font-size: 3rem; display: inline-block; transform-origin: center;
        }
        .ec-count-box {
          display: flex; flex-direction: column; align-items: flex-end;
          padding: 6px 12px; border-radius: 12px; border: 1px solid;
          gap: 2px;
        }
        .ec-count {
          font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 900;
        }
        .ec-count-label {
          font-size: 0.6rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(196,181,253,0.45);
        }

        .ec-title {
          font-family: 'Orbitron', monospace; font-size: 1.1rem;
          font-weight: 900; color: #f0e6ff; letter-spacing: 0.05em;
          margin-bottom: 10px;
        }
        .ec-desc {
          font-size: 0.82rem; font-weight: 300;
          color: rgba(196,181,253,0.6); line-height: 1.65; margin-bottom: 10px;
        }
        .ec-detail {
          font-family: 'Orbitron', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 14px; line-height: 1.6;
        }

        .ec-facts {
          display: flex; flex-direction: column; gap: 6px;
          padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 16px;
        }
        .ec-fact {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; color: rgba(196,181,253,0.55);
        }
        .ec-fact-dot {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
        }

        .ec-cta {
          padding: 10px 22px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: white; align-self: flex-start;
          transition: transform 0.2s;
        }
        .ec-cta:hover { transform: scale(1.05); }

        .ec-corner {
          position: absolute; width: 16px; height: 16px; z-index: 7; pointer-events: none;
        }
        .ec-tl { top: 10px; left: 10px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .ec-br { bottom: 10px; right: 10px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* ── Feature marquee strip ── */
        .es-marquee-wrap {
          overflow: hidden; margin-top: 64px;
          border-top: 1px solid rgba(129,140,248,0.1);
          border-bottom: 1px solid rgba(129,140,248,0.1);
          padding: 16px 0;
          position: relative;
        }
        .es-marquee-wrap::before,
        .es-marquee-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 80px;
          z-index: 2; pointer-events: none;
        }
        .es-marquee-wrap::before { left: 0; background: linear-gradient(90deg, #000, transparent); }
        .es-marquee-wrap::after  { right: 0; background: linear-gradient(-90deg, #000, transparent); }

        .es-marquee {
          display: flex; gap: 40px; width: max-content;
          animation: es-marq 28s linear infinite;
        }
        @keyframes es-marq { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .es-marquee-item {
          display: flex; align-items: center; gap: 10px; white-space: nowrap;
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(165,180,252,0.4);
        }
        .es-marquee-dot {
          width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0;
          background: rgba(129,140,248,0.5);
        }

        /* ── Bottom CTA ── */
        .es-cta-row {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          margin-top: 56px;
          padding: 36px 40px;
          border-radius: 22px;
          border: 1px solid rgba(129,140,248,0.12);
          background: rgba(5,0,20,0.8);
          position: relative; overflow: hidden;
        }
        .es-cta-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 30% 50%, rgba(129,140,248,0.07) 0%, transparent 70%);
        }
        .es-cta-title {
          font-family: 'Orbitron', monospace; font-size: 1.1rem;
          font-weight: 900; color: #f0e6ff;
          text-shadow: 0 0 20px rgba(129,140,248,0.3);
        }
        .es-cta-sub {
          font-size: 0.82rem; font-weight: 300;
          color: rgba(196,181,253,0.5); margin-top: 5px;
        }
        .es-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .es-cta-btn-primary {
          padding: 13px 28px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: white;
          background: linear-gradient(135deg, #818cf8, #4f46e5);
          box-shadow: 0 6px 24px rgba(129,140,248,0.4);
          transition: all 0.3s;
        }
        .es-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(129,140,248,0.6); }
        .es-cta-btn-sec {
          padding: 12px 24px; border-radius: 40px;
          border: 1px solid rgba(129,140,248,0.3); background: transparent;
          font-family: 'Orbitron', monospace; font-size: 0.65rem;
          font-weight: 600; letter-spacing: 0.1em;
          color: #a5b4fc; cursor: pointer;
          transition: all 0.3s;
        }
        .es-cta-btn-sec:hover {
          background: rgba(129,140,248,0.12); border-color: rgba(129,140,248,0.6);
          color: white; transform: translateY(-2px);
        }
      `}</style>

      <section className="es-root" ref={sectionRef}>

        {/* Stars */}
        <div className="es-stars">
          {STARS.map(s => (
            <div key={s.id} className="es-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Floating particles */}
        {PARTICLES.map(p => (
          <div key={p.id} className="es-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            "--dur": `${p.dur}s`, "--del": `${p.delay}s`,
          }} />
        ))}

        {/* Nebulae */}
        <div className="es-neb" style={{ width: 600, height: 400, background: "radial-gradient(ellipse, #4f46e5, transparent)", top: "-60px", left: "-100px", "--dur": "10s", "--a": "0.07", "--b": "0.14" }} />
        <div className="es-neb" style={{ width: 500, height: 400, background: "radial-gradient(ellipse, #34d399, transparent)", bottom: "-40px", right: "-80px", "--dur": "12s", "--a": "0.05", "--b": "0.1" }} />
        <div className="es-neb" style={{ width: 350, height: 350, background: "radial-gradient(ellipse, #c084fc, transparent)", top: "40%", left: "35%", "--dur": "9s", "--a": "0.04", "--b": "0.08" }} />

        {/* Grid + glow bars */}
        <div className="es-warp" />
        <div className="es-glow-bar top" />
        <div className="es-glow-bar bot" />

        <div className="es-inner">

          {/* Header */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="es-eyebrow">
              <div className="es-eyebrow-dot" />
              DISCOVERY PORTAL
            </div>
            <h2 className="es-title">
              Explore The <span className="acc">Universe</span>
            </h2>
            <p className="es-sub">
              Journey through missions, planets, and discoveries that expand
              our understanding of the cosmos — one revelation at a time.
            </p>
            <div className="es-divider" />
          </motion.div>

          {/* Cards */}
          <div className="es-grid">
            {EXPLORE_ITEMS.map((item, i) => (
              <ExploreCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Marquee strip */}
          <motion.div
            className="es-marquee-wrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="es-marquee">
              {[...Array(2)].map((_, ri) =>
                ["🚀 Space Missions", "🪐 Planetary Science", "🔭 Deep Space Imaging", "🌌 Galactic Cartography", "☄️ Asteroid Tracking", "🛰️ Satellite Networks", "🌍 Earth Observation", "⭐ Stellar Evolution", "🕳️ Black Hole Research", "🌊 Exoplanet Oceans"].map((label, i) => (
                  <div key={`${ri}-${i}`} className="es-marquee-item">
                    <div className="es-marquee-dot" />
                    {label}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="es-cta-row"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            <div className="es-cta-bg" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="es-cta-title">Ready to Begin Your Journey?</div>
              <div className="es-cta-sub">Join 40,000+ explorers discovering the cosmos every day.</div>
            </div>
            <div className="es-cta-btns" style={{ position: "relative", zIndex: 1 }}>
              <motion.button
                className="es-cta-btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                🚀 Start Exploring
              </motion.button>
              <motion.button
                className="es-cta-btn-sec"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                View All Missions
              </motion.button>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}