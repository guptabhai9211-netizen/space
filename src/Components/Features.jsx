import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useSpring,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";

/* ────────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    title: "Explore Planets",
    desc: "Discover breathtaking alien worlds, their atmospheres, moons, and the conditions that might harbour life.",
    icon: "🪐",
    color: "#a78bfa",
    colorAlt: "#6366f1",
    glow: "rgba(167,139,250,0.55)",
    tag: "5,000+ PLANETS",
    stats: [{ label: "Confirmed", val: "5,502" }, { label: "Habitable", val: "57" }],
    video: "https://assets.mixkit.co/videos/preview/mixkit-planets-in-space-1422-large.mp4",
    img: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
    accent: "#7c3aed",
  },
  {
    title: "Space Missions",
    desc: "Follow cutting-edge missions to Mars and beyond — real-time telemetry, mission logs, and launch countdowns.",
    icon: "🚀",
    color: "#f472b6",
    colorAlt: "#e11d48",
    glow: "rgba(244,114,182,0.55)",
    tag: "LIVE TRACKING",
    stats: [{ label: "Active", val: "320" }, { label: "Agencies", val: "72" }],
    video: "https://assets.mixkit.co/videos/preview/mixkit-rocket-taking-off-from-space-center-32830-large.mp4",
    img: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
    accent: "#db2777",
  },
  {
    title: "Star Gallery",
    desc: "Immerse yourself in stunning imagery of nebulae, supernovae, and billion-star galaxies from Hubble & JWST.",
    icon: "🌌",
    color: "#38bdf8",
    colorAlt: "#818cf8",
    glow: "rgba(56,189,248,0.55)",
    tag: "JWST IMAGERY",
    stats: [{ label: "Images", val: "40K+" }, { label: "Galaxies", val: "200B" }],
    video: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    accent: "#0ea5e9",
  },
];

const TICKER_ITEMS = [
  "🛸 New exoplanet discovered in Kepler-452 system",
  "🌑 Artemis III crew announced",
  "🔭 JWST captures deepest infrared image yet",
  "☄️ Apophis trajectory confirmed: 2029 close approach",
  "🪐 Saturn's rings thinner than expected, study shows",
  "🚀 SpaceX Starship orbital test successful",
  "🌍 ISS orbit raised by 5 km for long-term stability",
  "💫 New magnetar detected 13,000 light-years away",
];

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.4,
  delay: Math.random() * 5,
  dur: Math.random() * 4 + 2,
  depth: Math.random(), // for parallax
}));

const EXTRAS = [
  { icon: "🛰️", title: "Live Telemetry", desc: "Real-time satellite & probe data streams" },
  { icon: "🔭", title: "JWST Feed", desc: "Latest James Webb images, daily updated" },
  { icon: "🌍", title: "3D Orrery", desc: "Interactive solar system model" },
  { icon: "📡", title: "SETI Signals", desc: "Anomalous signals from deep space" },
];

/* ────────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */
function use3DTilt(strength = 15) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 160, damping: 24 });
  const ry = useSpring(0, { stiffness: 160, damping: 24 });
  const gx = useSpring(50, { stiffness: 90, damping: 22 });
  const gy = useSpring(50, { stiffness: 90, damping: 22 });

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rx.set(-dy * strength);
    ry.set(dx * strength);
    gx.set(50 + dx * 40);
    gy.set(50 + dy * 40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return { ref, rx, ry, gx, gy, onMove, onLeave };
}

/* ── Ticker ────────────────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const x = useMotionValue(0);
  const SPEED = 0.5;

  useAnimationFrame(() => {
    const current = x.get();
    const reset = -((TICKER_ITEMS.length * 340));
    x.set(current <= reset ? 0 : current - SPEED);
  });

  return (
    <div className="ticker-wrap">
      <span className="ticker-label">● LIVE</span>
      <div className="ticker-inner">
        <motion.div className="ticker-track" style={{ x }}>
          {items.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Morphing Orb ───────────────────────────────────────────── */
function MorphOrb({ color, size, x, y, dur, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x, top: y,
        width: size, height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
      }}
      animate={{
        scale: [1, 1.3, 0.9, 1.15, 1],
        x: [0, 30, -20, 15, 0],
        y: [0, -20, 30, -10, 0],
        opacity: [0.12, 0.2, 0.1, 0.18, 0.12],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Scan Line overlay ─────────────────────────────────────── */
function ScanLines() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
    }} />
  );
}

/* ── Feature Card ───────────────────────────────────────────── */
function FeatureCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = use3DTilt(13);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  const variants = {
    hidden: { opacity: 0, y: 70, scale: 0.88, rotateX: -12 },
    visible: {
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { duration: 0.9, delay: index * 0.16, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div ref={cardRef} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"}
      style={{ perspective: 1000, width: "100%" }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ z: 40 }}
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        className="feat-card"
      >
        {/* ── Media bg ── */}
        <div className="feat-media">
          {!videoError ? (
            <video autoPlay muted loop playsInline onError={() => setVideoError(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                opacity: hovered ? 0.5 : 0.18,
                transition: "opacity 0.7s ease",
                filter: "saturate(1.4) brightness(1.1)",
              }}>
              <source src={item.video} type="video/mp4" />
            </video>
          ) : (
            <img src={item.img} alt={item.title} style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: hovered ? 0.5 : 0.18,
              transition: "opacity 0.7s ease",
            }} />
          )}
        </div>

        {/* ── Cursor glow ── */}
        <motion.div className="feat-cursor-glow" style={{
          background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.glow} 0%, transparent 62%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }} />

        {/* ── Gradient overlay ── */}
        <div className="feat-overlay" style={{
          background: `linear-gradient(160deg, rgba(0,0,8,0.08) 0%, rgba(0,0,12,0.82) 55%, rgba(0,0,12,0.98) 100%)`,
        }} />

        {/* ── Hover border glow ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="feat-border-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                boxShadow: `0 0 0 1px ${item.color}55, 0 0 50px ${item.glow}, inset 0 0 50px ${item.glow.replace("0.55", "0.08")}`,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Shimmer line ── */}
        <motion.div
          className="feat-shimmer"
          animate={hovered ? { x: ["−100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ background: `linear-gradient(90deg, transparent, ${item.color}44, transparent)` }}
        />

        {/* ── Content ── */}
        <div className="feat-content">

          {/* Tag */}
          <motion.div className="feat-tag"
            style={{ background: `${item.color}18`, border: `1px solid ${item.color}50`, color: item.color }}
            animate={{ opacity: hovered ? 1 : 0.65, y: hovered ? 0 : 5 }}
            transition={{ duration: 0.3 }}>
            {item.tag}
          </motion.div>

          {/* Icon */}
          <motion.div className="feat-icon"
            animate={hovered
              ? { y: -10, scale: 1.3, rotate: [0, -10, 10, -5, 0], filter: `drop-shadow(0 0 28px ${item.color})` }
              : { y: 0, scale: 1, rotate: 0, filter: `drop-shadow(0 0 10px ${item.color}88)` }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            {item.icon}
          </motion.div>

          <h3 className="feat-title">{item.title}</h3>
          <p className="feat-desc">{item.desc}</p>

          {/* Stats */}
          <motion.div className="feat-stats"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }}
            transition={{ duration: 0.35, delay: hovered ? 0.06 : 0 }}>
            {item.stats.map((s, i) => (
              <div key={i} className="feat-stat">
                <span className="feat-stat-num" style={{ color: item.color }}>{s.val}</span>
                <span className="feat-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button className="feat-cta"
            style={{
              background: `linear-gradient(135deg, ${item.color}, ${item.colorAlt})`,
              boxShadow: `0 6px 28px ${item.glow}`,
            }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 18 }}
            transition={{ duration: 0.35, delay: hovered ? 0.12 : 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}>
            Discover More →
          </motion.button>
        </div>

        {/* Corner accents */}
        {[["tl", "top:14px;left:14px;border-top:1.5px solid;border-left:1.5px solid;border-radius:5px 0 0 0"],
          ["tr", "top:14px;right:14px;border-top:1.5px solid;border-right:1.5px solid;border-radius:0 5px 0 0"],
          ["bl", "bottom:14px;left:14px;border-bottom:1.5px solid;border-left:1.5px solid;border-radius:0 0 0 5px"],
          ["br", "bottom:14px;right:14px;border-bottom:1.5px solid;border-right:1.5px solid;border-radius:0 0 5px 0"],
        ].map(([k, s]) => (
          <motion.div key={k}
            style={{ position: "absolute", width: 20, height: 20, pointerEvents: "none", zIndex: 10, borderColor: `${item.color}55`, ...Object.fromEntries(s.split(";").map(p => { const [pk, pv] = p.split(":"); return [pk.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), pv?.trim()]; }).filter(([k]) => k)) }}
            animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.35 }}
          />
        ))}

        {/* Index number watermark */}
        <div className="feat-watermark" style={{ color: item.color }}>0{index + 1}</div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   MAIN SECTION
──────────────────────────────────────────────────────────────── */
export default function SpaceFeatures() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Parallax layers
  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const headY = useTransform(scrollYProgress, [0, 0.5], ["0px", "-30px"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;500;700&family=Bebas+Neue&family=JetBrains+Mono:wght@300;400&display=swap');

        :root {
          --c-bg: #02010d;
          --c-surface: rgba(8,4,30,0.92);
          --c-border: rgba(139,92,246,0.13);
          --c-text: #e2d9f3;
          --c-muted: rgba(196,181,253,0.5);
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'Rajdhani', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sf-root {
          position: relative;
          background: var(--c-bg);
          color: var(--c-text);
          padding: 0 0 140px;
          overflow: hidden;
          font-family: var(--font-body);
        }

        /* ── Stars layer ── */
        .sf-stars {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
        }
        .sf-star {
          position: absolute; border-radius: 50%; background: #fff;
          animation: sf-twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes sf-twinkle {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.9;  transform: scale(1.4); }
        }

        /* ── Ticker ── */
        .ticker-wrap {
          display: flex; align-items: center;
          background: rgba(124,58,237,0.08);
          border-bottom: 1px solid rgba(124,58,237,0.2);
          padding: 10px 0;
          overflow: hidden;
          position: relative; z-index: 20;
        }
        .ticker-label {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: #ef4444;
          letter-spacing: 0.15em;
          padding: 0 20px;
          border-right: 1px solid rgba(255,255,255,0.1);
          white-space: nowrap;
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ticker-inner { flex: 1; overflow: hidden; }
        .ticker-track { display: flex; white-space: nowrap; will-change: transform; }
        .ticker-item {
          display: inline-block;
          padding: 0 40px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: rgba(196,181,253,0.65);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* ── Inner layout ── */
        .sf-inner {
          position: relative; z-index: 10;
          max-width: 1300px; margin: 0 auto;
          padding: 0 32px;
        }

        /* ── Hero header ── */
        .sf-header {
          text-align: center;
          padding: 100px 0 70px;
        }

        .sf-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 20px; border-radius: 40px;
          border: 1px solid rgba(167,139,250,0.3);
          background: rgba(109,40,217,0.1);
          font-family: var(--font-mono);
          font-size: 0.58rem; letter-spacing: 0.22em; color: #a78bfa;
          margin-bottom: 28px; text-transform: uppercase;
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 10px #a78bfa;
          animation: blink 1.5s ease-in-out infinite;
        }

        .sf-title {
          font-family: var(--font-display);
          font-size: clamp(3.5rem, 8vw, 7.5rem);
          font-weight: 400;
          letter-spacing: 0.06em;
          line-height: 0.95;
          color: #f0e8ff;
          text-shadow: 0 0 60px rgba(139,92,246,0.25);
        }
        .sf-title .line2 {
          display: block;
          background: linear-gradient(90deg, #c084fc, #818cf8, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200%;
          animation: grad-shift 5s linear infinite alternate;
        }
        @keyframes grad-shift {
          from { background-position: 0% 50%; }
          to   { background-position: 100% 50%; }
        }

        .sf-sub {
          margin: 20px auto 0;
          max-width: 480px;
          font-size: 1.05rem; font-weight: 300;
          line-height: 1.75; color: var(--c-muted);
          letter-spacing: 0.03em;
        }

        .sf-rule {
          display: flex; align-items: center; gap: 20px;
          margin: 40px auto 0;
          max-width: 300px; color: rgba(139,92,246,0.3);
          font-family: var(--font-mono); font-size: 0.6rem;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .sf-rule::before, .sf-rule::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
        }

        /* ── Cards grid ── */
        .sf-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .sf-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 660px) {
          .sf-grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
        }

        /* ── Card ── */
        .feat-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--c-border);
          background: var(--c-surface);
          aspect-ratio: 3/4;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: border-color 0.4s;
        }
        .feat-card:hover { border-color: rgba(139,92,246,0.3); }

        .feat-media { position: absolute; inset: 0; z-index: 0; }
        .feat-cursor-glow { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .feat-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .feat-border-glow { position: absolute; inset: 0; z-index: 3; border-radius: 20px; pointer-events: none; }

        .feat-shimmer {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          width: 60%; height: 100%; skewX: -15deg;
        }

        .feat-content {
          position: absolute; inset: 0; z-index: 8;
          padding: 24px 22px 26px;
          display: flex; flex-direction: column;
        }

        .feat-tag {
          display: inline-block; align-self: flex-start;
          padding: 4px 12px; border-radius: 20px;
          font-family: var(--font-mono);
          font-size: 0.52rem; letter-spacing: 0.18em;
          font-weight: 400; margin-bottom: 18px;
          text-transform: uppercase;
        }

        .feat-icon {
          font-size: 3rem; margin-bottom: 16px;
          display: inline-block; transform-origin: center;
          line-height: 1;
        }

        .feat-title {
          font-family: var(--font-display);
          font-size: 2rem; letter-spacing: 0.07em;
          color: #f5eeff; margin-bottom: 10px;
          text-shadow: 0 0 30px rgba(167,139,250,0.25);
        }

        .feat-desc {
          font-size: 0.9rem; font-weight: 300;
          color: rgba(196,181,253,0.62); line-height: 1.7;
          flex: 1;
          letter-spacing: 0.02em;
        }

        .feat-stats {
          display: flex; gap: 28px;
          margin-top: 20px; padding-top: 16px;
          border-top: 1px solid rgba(139,92,246,0.1);
        }
        .feat-stat { display: flex; flex-direction: column; gap: 4px; }
        .feat-stat-num {
          font-family: var(--font-display);
          font-size: 1.6rem; letter-spacing: 0.06em;
        }
        .feat-stat-label {
          font-family: var(--font-mono);
          font-size: 0.58rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(196,181,253,0.4);
        }

        .feat-cta {
          margin-top: 14px;
          padding: 10px 22px; border-radius: 40px;
          border: none; cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; align-self: flex-start;
        }

        .feat-watermark {
          position: absolute; bottom: 18px; right: 20px; z-index: 6;
          font-family: var(--font-display);
          font-size: 4rem; letter-spacing: 0.04em;
          opacity: 0.06; pointer-events: none;
          line-height: 1;
        }

        /* ── Glow bar ── */
        .sf-glow-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed 30%, #38bdf8 60%, #db2777, transparent);
          background-size: 300% 100%;
          animation: glow-sweep 6s linear infinite;
        }
        @keyframes glow-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Count strip ── */
        .sf-count-strip {
          display: flex; justify-content: center;
          gap: 0; margin: 60px 0;
          border-top: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
          padding: 0;
          overflow: hidden; border-radius: 0;
        }
        .sf-count-item {
          flex: 1; padding: 30px 20px;
          text-align: center;
          border-right: 1px solid var(--c-border);
          position: relative;
          background: rgba(8,4,30,0.6);
          transition: background 0.3s;
        }
        .sf-count-item:last-child { border-right: none; }
        .sf-count-item:hover { background: rgba(109,40,217,0.08); }
        .sf-count-num {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.5rem);
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #c084fc, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sf-count-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.58rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--c-muted);
          margin-top: 6px;
        }

        /* ── Extras strip ── */
        .sf-extras {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          border: 1px solid var(--c-border);
          border-radius: 18px; overflow: hidden;
          margin-top: 28px;
        }
        @media (max-width: 800px) { .sf-extras { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .sf-extras { grid-template-columns: 1fr; } }

        .sf-extra-item {
          padding: 26px 22px;
          display: flex; align-items: center; gap: 14px;
          border-right: 1px solid var(--c-border);
          background: rgba(5,0,20,0.7);
          transition: background 0.3s, transform 0.3s;
          cursor: default;
        }
        .sf-extra-item:last-child { border-right: none; }
        .sf-extra-item:hover { background: rgba(109,40,217,0.1); }
        .sf-extra-icon { font-size: 1.9rem; flex-shrink: 0; }
        .sf-extra-title {
          font-family: var(--font-display);
          font-size: 1rem; letter-spacing: 0.06em;
          color: #e9d5ff; line-height: 1;
        }
        .sf-extra-desc {
          font-size: 0.78rem; color: var(--c-muted);
          margin-top: 4px; line-height: 1.4;
          font-weight: 300;
        }

        /* ── Responsive tweaks ── */
        @media (max-width: 640px) {
          .sf-inner { padding: 0 16px; }
          .sf-header { padding: 70px 0 50px; }
          .sf-count-strip { flex-wrap: wrap; }
          .sf-count-item { flex: 1 1 50%; border-bottom: 1px solid var(--c-border); }
        }
      `}</style>

      <section className="sf-root" ref={sectionRef}>
        {/* Background stars */}
        <motion.div className="sf-stars" style={{ y: starsY }}>
          {STARS.map(s => (
            <div key={s.id} className="sf-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
              opacity: s.depth * 0.8 + 0.1,
            }} />
          ))}
        </motion.div>

        {/* Morphing nebula orbs */}
        <MorphOrb color="#7c3aed" size={600} x="-100px" y="-100px" dur={11} delay={0} />
        <MorphOrb color="#4f46e5" size={500} x="70%" y="30%" dur={14} delay={3} />
        <MorphOrb color="#db2777" size={400} x="20%" y="60%" dur={9} delay={1.5} />
        <MorphOrb color="#0ea5e9" size={350} x="80%" y="80%" dur={12} delay={5} />

        <ScanLines />
        <div className="sf-glow-bar" />

        {/* Live ticker */}
        <Ticker />

        <div className="sf-inner">
          {/* Header */}
          <motion.div className="sf-header" style={{ y: headY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}>
              <div className="sf-eyebrow">
                <div className="eyebrow-dot" />
                Mission Control · Features
              </div>
            </motion.div>

            <motion.h2
              className="sf-title"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              YOUR GATEWAY TO<br />
              <span className="line2">THE COSMOS</span>
            </motion.h2>

            <motion.p className="sf-sub"
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}>
              Tools built for the next generation of cosmic explorers — real data, stunning imagery, and live tracking.
            </motion.p>

            <motion.div className="sf-rule"
              initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}>
              3 Core Features
            </motion.div>
          </motion.div>

          {/* Cards */}
          <div className="sf-grid">
            {FEATURES.map((item, i) => (
              <FeatureCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Count strip */}
          <motion.div className="sf-count-strip"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            {[
              ["200B+", "Galaxies Mapped"],
              ["5,502", "Exoplanets Found"],
              ["320", "Active Missions"],
              ["40K+", "JWST Images"],
              ["13.8B", "Universe Age (yrs)"],
            ].map(([num, label], i) => (
              <motion.div key={i} className="sf-count-item"
                whileHover={{ backgroundColor: "rgba(109,40,217,0.12)" }}>
                <span className="sf-count-num">{num}</span>
                <span className="sf-count-label">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Extras strip */}
          <motion.div className="sf-extras"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
            {EXTRAS.map((e, i) => (
              <motion.div key={i} className="sf-extra-item"
                whileHover={{ y: -4, backgroundColor: "rgba(109,40,217,0.13)" }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}>
                <span className="sf-extra-icon">{e.icon}</span>
                <div>
                  <div className="sf-extra-title">{e.title}</div>
                  <div className="sf-extra-desc">{e.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}