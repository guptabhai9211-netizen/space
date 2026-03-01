import { useRef, useState } from "react";
import { motion, useInView, useSpring, AnimatePresence } from "framer-motion";

/* ── Color Theme (matches Hero: purple/violet/indigo) ────────── */
const THEME = {
  primary:   "#7c3aed",
  secondary: "#4f46e5",
  accent1:   "#c084fc",
  accent2:   "#818cf8",
  accent3:   "#a78bfa",
  text:      "#f0e6ff",
  textMuted: "rgba(196,181,253,0.6)",
  glow1:     "rgba(124,58,237,0.5)",
  glow2:     "rgba(129,140,248,0.5)",
};

/* ── Stars & Particles ───────────────────────────────────────── */
const STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.3, delay: Math.random() * 6, dur: Math.random() * 4 + 2,
}));
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i, x: Math.random() * 90 + 5, y: Math.random() * 80 + 10,
  size: Math.random() * 4 + 1.5, dur: Math.random() * 12 + 8, delay: Math.random() * 6,
}));
const SHOOTS = Array.from({ length: 6 }, (_, i) => ({
  id: i, startX: Math.random() * 60 + 5, startY: Math.random() * 30,
  delay: i * 4 + Math.random() * 3, dur: Math.random() * 1.2 + 0.7, angle: 18 + Math.random() * 22,
}));

/* ── Explore Cards Data ──────────────────────────────────────── */
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
    color: "#c084fc",
    colorAlt: "#9333ea",
    glow: "rgba(192,132,252,0.55)",
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
    color: "#a78bfa",
    colorAlt: "#7c3aed",
    glow: "rgba(167,139,250,0.55)",
    tag: "RESEARCH LAB",
    count: "40K+",
    countLabel: "Research papers",
    detail: "Hubble · JWST · Chandra · Event Horizon",
    facts: ["13.8B light-years captured", "28 telescopes active", "Webb operational since 2022"],
    bg: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
  },
];

/* ── Universe Sections Data ──────────────────────────────────── */
const UNIVERSE_SECTIONS = [
  {
    id: "nebulae",
    label: "Nebulae",
    icon: "🌌",
    headline: "Stellar Nurseries",
    sub: "Where stars are born",
    desc: "Nebulae are vast interstellar clouds of gas and dust — the birthplaces of stars and solar systems. Inside these cosmic nurseries, gravity pulls matter together until nuclear fusion ignites, creating new suns.",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=80",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.4)",
    stats: [{ val: "1,000+", label: "Known nebulae" }, { val: "100 ly", label: "Avg. diameter" }, { val: "10K+", label: "Years to form" }],
    features: ["Emission Nebulae — glow from ionised gas", "Reflection Nebulae — scatter starlight", "Planetary Nebulae — dying star remnants", "Supernova Remnants — explosive endings"],
  },
  {
    id: "blackholes",
    label: "Black Holes",
    icon: "🕳️",
    headline: "Gravity's Abyss",
    sub: "Where space-time breaks",
    desc: "Black holes are regions where gravity is so intense that nothing — not even light — can escape. They warp space-time itself, and at their singularity, the known laws of physics cease to apply.",
    img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=80",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.4)",
    stats: [{ val: "M87*", label: "First imaged" }, { val: "6.5B M☉", label: "M87* mass" }, { val: "26K ly", label: "Sgr A* distance" }],
    features: ["Event Horizon — point of no return", "Singularity — infinite density core", "Hawking Radiation — slow evaporation", "Gravitational Lensing — light bending"],
  },
  {
    id: "galaxies",
    label: "Galaxies",
    icon: "🌀",
    headline: "Island Universes",
    sub: "100 billion stars each",
    desc: "Galaxies are gravitationally bound systems of stars, stellar remnants, gas, dust, and dark matter. Our Milky Way is just one of an estimated 2 trillion galaxies in the observable universe.",
    img: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=900&q=80",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    stats: [{ val: "2T", label: "Galaxies visible" }, { val: "100K ly", label: "Milky Way width" }, { val: "2.5M ly", label: "To Andromeda" }],
    features: ["Spiral galaxies — rotating disk arms", "Elliptical — featureless spheroidal", "Irregular — chaotic structure", "Dwarf galaxies — small satellite systems"],
  },
  {
    id: "exoplanets",
    label: "Exoplanets",
    icon: "🌍",
    headline: "Worlds Beyond",
    sub: "Other Earths await",
    desc: "Exoplanets are planets orbiting stars outside our solar system. With over 5,500 confirmed, astronomers are discovering water-worlds, lava planets, and potentially habitable Earth-like worlds every year.",
    img: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=900&q=80",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.4)",
    stats: [{ val: "5,500+", label: "Confirmed" }, { val: "57", label: "In habitable zone" }, { val: "1,000 ly", label: "Farthest confirmed" }],
    features: ["Hot Jupiters — massive close orbiters", "Super-Earths — rocky & larger", "Ocean Worlds — global water coverage", "Rogue Planets — no host star"],
  },
];

/* ── Marquee Items ───────────────────────────────────────────── */
const MARQUEE = [
  "🚀 Space Missions", "🪐 Planetary Science", "🔭 Deep Space Imaging",
  "🌌 Galactic Cartography", "☄️ Asteroid Tracking", "🛰️ Satellite Networks",
  "🌍 Earth Observation", "⭐ Stellar Evolution", "🕳️ Black Hole Research", "🌊 Exoplanet Oceans",
];

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

/* ── Explore Card ────────────────────────────────────────────── */
function ExploreCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(11);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -18, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000, width: "100%" }}
    >
      <motion.div
        ref={ref}
        className="ec-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ scale: 1.04, z: 28 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {/* BG image */}
        {!imgErr ? (
          <motion.img src={item.bg} alt="" className="ec-bg-img"
            animate={{ scale: hovered ? 1.1 : 1.03 }}
            transition={{ duration: 0.8 }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="ec-bg-img" style={{ background: `radial-gradient(ellipse at 30% 30%, ${item.color}25, transparent)` }} />
        )}
        <div className="ec-dark" />

        <motion.div className="ec-cursor-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.glow} 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}
        />
        <motion.div className="ec-border-glow"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${item.color}70, 0 0 60px ${item.glow}` : "none" }}
          transition={{ duration: 0.45 }}
        />
        <motion.div className="ec-scan"
          animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.4, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${item.color}55, transparent)` }}
        />

        <motion.div className="ec-badge"
          style={{ background: `${item.color}1a`, border: `1px solid ${item.color}55`, color: item.color }}
          animate={{ opacity: hovered ? 1 : 0.55, y: hovered ? 0 : -4 }}
        >✦ {item.tag}</motion.div>

        <div className="ec-num" style={{ color: `${item.color}35` }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="ec-content" style={{ transform: "translateZ(18px)" }}>
          <div className="ec-top-row">
            <motion.span className="ec-icon"
              animate={hovered
                ? { scale: 1.3, y: -6, filter: `drop-shadow(0 0 18px ${item.color})` }
                : { scale: 1, y: 0, filter: `drop-shadow(0 0 8px ${item.color}80)` }
              }
              transition={{ duration: 0.45 }}
            >{item.icon}</motion.span>
            <motion.div className="ec-count-box"
              style={{ borderColor: `${item.color}35`, background: `${item.color}0d` }}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88 }}
              transition={{ duration: 0.3, delay: hovered ? 0.06 : 0 }}
            >
              <span className="ec-count" style={{ color: item.color }}>{item.count}</span>
              <span className="ec-count-label">{item.countLabel}</span>
            </motion.div>
          </div>

          <h3 className="ec-title">{item.title}</h3>
          <p className="ec-desc">{item.desc}</p>

          <motion.div className="ec-detail" style={{ color: `${item.color}80` }}
            animate={{ opacity: hovered ? 0.7 : 0.3 }} transition={{ duration: 0.3 }}
          >{item.detail}</motion.div>

          <motion.div className="ec-facts"
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

          <motion.button className="ec-cta"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.colorAlt})`, boxShadow: `0 6px 24px ${item.glow}` }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }}
            transition={{ duration: 0.3, delay: hovered ? 0.1 : 0 }}
            whileTap={{ scale: 0.95 }}
          >Explore Now →</motion.button>
        </div>

        <div className="ec-corner ec-tl" style={{ borderColor: `${item.color}80` }} />
        <div className="ec-corner ec-br" style={{ borderColor: `${item.color}80` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Universe Tab Section ────────────────────────────────────── */
function UniverseSection({ inView }) {
  const [activeTab, setActiveTab] = useState(0);
  const item = UNIVERSE_SECTIONS[activeTab];
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="us-root">

      {/* Section header */}
      <motion.div className="us-header"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="us-eyebrow">
          <div className="us-eyebrow-dot" />
          EXPLORE THE UNIVERSE
        </div>
        <h2 className="us-title">Cosmic <span className="us-acc">Wonders</span></h2>
        <p className="us-sub">From nebulae to black holes — discover the most extraordinary phenomena in the cosmos.</p>
        <div className="us-divider" />
      </motion.div>

      {/* Tabs */}
      <motion.div className="us-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {UNIVERSE_SECTIONS.map((sec, i) => (
          <motion.button
            key={sec.id}
            className={`us-tab ${activeTab === i ? "active" : ""}`}
            onClick={() => { setActiveTab(i); setImgErr(false); }}
            style={activeTab === i ? {
              background: `${sec.color}1a`,
              border: `1px solid ${sec.color}60`,
              color: sec.color,
              boxShadow: `0 0 20px ${sec.color}25`,
            } : {}}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="us-panel"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Left — image */}
          <div className="us-img-wrap">
            <div className="us-img-frame" style={{ boxShadow: `0 0 60px ${item.glow}, 0 0 0 1px ${item.color}30` }}>
              {!imgErr ? (
                <img src={item.img} alt={item.label} className="us-img"
                  onError={() => setImgErr(true)}
                />
              ) : (
                <div className="us-img" style={{ background: `radial-gradient(ellipse, ${item.color}25, transparent)` }} />
              )}
              {/* Overlay gradient */}
              <div className="us-img-overlay" style={{ background: `linear-gradient(135deg, ${item.color}10 0%, transparent 60%)` }} />
              {/* Scan lines */}
              <div className="us-img-scanlines" />
              {/* Corner brackets on image */}
              <div className="us-img-corner us-img-tl" style={{ borderColor: `${item.color}80` }} />
              <div className="us-img-corner us-img-br" style={{ borderColor: `${item.color}80` }} />
              {/* Label badge */}
              <div className="us-img-label" style={{ background: `${item.color}18`, border: `1px solid ${item.color}50`, color: item.color }}>
                {item.icon} {item.label}
              </div>
            </div>

            {/* Stats row below image */}
            <div className="us-stats-row">
              {item.stats.map((s, i) => (
                <motion.div key={i} className="us-stat-box"
                  style={{ borderColor: `${item.color}25`, background: `${item.color}08` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.15 }}
                >
                  <span className="us-stat-val" style={{ color: item.color }}>{s.val}</span>
                  <span className="us-stat-lbl">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — text */}
          <div className="us-text-wrap">
            <div className="us-tag" style={{ background: `${item.color}18`, border: `1px solid ${item.color}50`, color: item.color }}>
              ✦ {item.sub}
            </div>
            <h3 className="us-headline">{item.headline}</h3>
            <p className="us-desc">{item.desc}</p>

            <div className="us-features-label">Key Phenomena</div>
            <div className="us-features">
              {item.features.map((f, i) => (
                <motion.div key={i} className="us-feature"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                >
                  <div className="us-feature-dot" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                  <span>{f}</span>
                </motion.div>
              ))}
            </div>

            <motion.button className="us-cta-btn"
              style={{ background: `linear-gradient(135deg, ${item.color}, ${item.colorAlt || "#4f46e5"})`, boxShadow: `0 6px 28px ${item.glow}` }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Discover {item.label} →
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Main Section ────────────────────────────────────────────── */
export default function ExploreSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        /* ── Root ── */
        .es-root {
          position: relative;
          background: linear-gradient(180deg, #000 0%, #04000e 40%, #0a0020 70%, #000 100%);
          color: white; font-family: 'Exo 2', sans-serif;
          padding: 120px 0 0; overflow: hidden;
        }

        /* ── Stars ── */
        .es-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .es-star {
          position: absolute; border-radius: 50%; background: white;
          animation: es-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes es-tw {
          from { opacity: 0.03; transform: scale(0.5); }
          to   { opacity: 0.9;  transform: scale(1.5); }
        }

        /* ── Shoots ── */
        .es-shoot {
          position: absolute; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
          opacity: 0; border-radius: 1px;
          animation: es-sa var(--dur) var(--del) linear infinite;
        }
        @keyframes es-sa {
          0%  { opacity:0; width:0;  transform:translate(0,0) rotate(var(--ang)); }
          5%  { opacity:1; }
          55% { opacity:0.7; width:120px; }
          100%{ opacity:0; width:50px; transform:translate(240px,130px) rotate(var(--ang)); }
        }

        /* ── Particles ── */
        .es-particle {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
          background: radial-gradient(circle, rgba(167,139,250,0.55), transparent);
          animation: es-float var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes es-float {
          from { transform:translateY(0) scale(1);    opacity:0.15; }
          to   { transform:translateY(-28px) scale(1.3); opacity:0.45; }
        }

        /* ── Nebulae ── */
        .es-neb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px);
          animation: es-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes es-pulse {
          from { opacity:var(--a); transform:scale(1);   }
          to   { opacity:var(--b); transform:scale(1.2); }
        }

        /* ── Warp grid ── */
        .es-warp {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.02;
          background-image:
            linear-gradient(rgba(167,139,250,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 75%);
        }

        /* ── Glow bars ── */
        .es-gbar {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #818cf8, #c084fc, transparent);
          background-size: 200% 100%; animation: es-barslide 5s linear infinite;
        }
        .es-gbar.top { top: 0; } .es-gbar.bot { bottom: 0; animation-delay:-2.5s; }
        @keyframes es-barslide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── Inner container ── */
        .es-inner {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 0 auto; padding: 0 32px;
        }
        @media (max-width: 768px) { .es-inner { padding: 0 20px; } }

        /* ── Section 1: Explore Cards header ── */
        .es-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(129,140,248,0.35); background: rgba(79,70,229,0.1);
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.22em; color: #a5b4fc; margin-bottom: 22px;
        }
        .es-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a5b4fc; box-shadow: 0 0 8px #a5b4fc;
          animation: es-blink 1.4s ease-in-out infinite;
        }
        @keyframes es-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .es-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.2rem, 4.5vw, 4rem); font-weight: 900; line-height: 1.06;
          color: #f0e6ff; text-shadow: 0 0 50px rgba(129,140,248,0.3);
        }
        .es-title-acc {
          background: linear-gradient(135deg, #a5b4fc, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .es-sub {
          margin-top: 16px; font-size: 0.95rem; font-weight: 300;
          color: rgba(196,181,253,0.55); line-height: 1.75;
          max-width: 540px; margin-left: auto; margin-right: auto;
        }
        .es-divider {
          width: 80px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent);
        }

        /* ── Cards grid ── */
        .es-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: 500px; gap: 24px; margin-top: 56px;
        }
        @media (max-width: 980px) { .es-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 480px; } }
        @media (max-width: 620px) { .es-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 480px; } }

        /* ── Explore Card ── */
        .ec-card {
          position: relative; border-radius: 22px; overflow: hidden;
          border: 1px solid rgba(167,139,250,0.1); background: rgba(4,0,18,0.96);
          width: 100%; height: 100%; cursor: pointer;
          display: flex; flex-direction: column; transform-style: preserve-3d;
        }
        .ec-bg-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0.2; transition: opacity 0.5s;
        }
        .ec-card:hover .ec-bg-img { opacity: 0.35; }
        .ec-dark {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,12,0.97) 0%, rgba(0,0,12,0.5) 50%, rgba(0,0,12,0.15) 100%);
        }
        .ec-cursor-glow { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .ec-border-glow { position: absolute; inset: 0; border-radius: 22px; z-index: 3; pointer-events: none; }
        .ec-scan { position: absolute; left: 0; right: 0; top: 0; height: 50%; z-index: 4; pointer-events: none; }
        .ec-badge {
          position: absolute; top: 14px; left: 14px; z-index: 6;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.5rem; letter-spacing: 0.14em; font-weight: 700;
        }
        .ec-num {
          position: absolute; top: 12px; right: 14px; z-index: 6;
          font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 900;
        }
        .ec-content {
          position: relative; z-index: 6; padding: 22px 20px 24px;
          display: flex; flex-direction: column; flex: 1; justify-content: flex-end; margin-top: auto;
        }
        .ec-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .ec-icon { font-size: 2.8rem; display: inline-block; transform-origin: center; }
        .ec-count-box {
          display: flex; flex-direction: column; align-items: flex-end;
          padding: 6px 12px; border-radius: 10px; border: 1px solid; gap: 2px;
        }
        .ec-count { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 900; }
        .ec-count-label { font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(196,181,253,0.45); }
        .ec-title { font-family: 'Orbitron', monospace; font-size: 1.05rem; font-weight: 900; color: #f0e6ff; letter-spacing: 0.05em; margin-bottom: 8px; }
        .ec-desc { font-size: 0.8rem; font-weight: 300; color: rgba(196,181,253,0.6); line-height: 1.65; margin-bottom: 8px; }
        .ec-detail { font-family: 'Orbitron', monospace; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; line-height: 1.7; }
        .ec-facts { display: flex; flex-direction: column; gap: 5px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); margin-bottom: 14px; }
        .ec-fact { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: rgba(196,181,253,0.55); }
        .ec-fact-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .ec-cta {
          padding: 9px 20px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          font-weight: 700; letter-spacing: 0.1em; color: white; align-self: flex-start;
        }
        .ec-corner { position: absolute; width: 14px; height: 14px; z-index: 7; pointer-events: none; }
        .ec-tl { top: 8px; left: 8px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 3px 0 0 0; }
        .ec-br { bottom: 8px; right: 8px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 3px 0; }

        /* ── Marquee ── */
        .es-marquee-wrap {
          overflow: hidden; margin-top: 60px;
          border-top: 1px solid rgba(167,139,250,0.1);
          border-bottom: 1px solid rgba(167,139,250,0.1);
          padding: 14px 0; position: relative;
        }
        .es-marquee-wrap::before, .es-marquee-wrap::after {
          content:''; position:absolute; top:0; bottom:0; width:80px; z-index:2; pointer-events:none;
        }
        .es-marquee-wrap::before { left:0; background:linear-gradient(90deg,#000,transparent); }
        .es-marquee-wrap::after  { right:0; background:linear-gradient(-90deg,#000,transparent); }
        .es-marquee { display:flex; gap:40px; width:max-content; animation:es-marq 28s linear infinite; }
        @keyframes es-marq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .es-marquee-item {
          display:flex; align-items:center; gap:10px; white-space:nowrap;
          font-family:'Orbitron',monospace; font-size:0.58rem; letter-spacing:0.15em;
          text-transform:uppercase; color:rgba(167,139,250,0.4);
        }
        .es-marquee-dot { width:4px; height:4px; border-radius:50%; background:rgba(167,139,250,0.5); flex-shrink:0; }

        /* ═══════════════════════════════════════════════════
           ── Universe Section ──
        ════════════════════════════════════════════════════ */
        .us-root {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 0 auto; padding: 100px 32px 0;
        }
        @media (max-width: 768px) { .us-root { padding: 80px 20px 0; } }

        /* header */
        .us-header { text-align: center; margin-bottom: 48px; }
        .us-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(124,58,237,0.4); background: rgba(124,58,237,0.08);
          font-family: 'Orbitron', monospace; font-size: 0.58rem;
          letter-spacing: 0.22em; color: #c084fc; margin-bottom: 22px;
        }
        .us-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #c084fc; box-shadow: 0 0 8px #c084fc;
          animation: es-blink 1.4s ease-in-out infinite;
        }
        .us-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.2rem, 4.5vw, 4rem); font-weight: 900; line-height: 1.06;
          color: #f0e6ff; text-shadow: 0 0 50px rgba(124,58,237,0.3);
        }
        .us-acc {
          background: linear-gradient(135deg, #c084fc, #a78bfa, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .us-sub {
          margin-top: 14px; font-size: 0.95rem; font-weight: 300;
          color: rgba(196,181,253,0.55); line-height: 1.75;
          max-width: 540px; margin-left: auto; margin-right: auto;
        }
        .us-divider {
          width: 80px; height: 1px; margin: 24px auto;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent);
        }

        /* Tabs */
        .us-tabs {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .us-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 40px; cursor: pointer;
          border: 1px solid rgba(167,139,250,0.2); background: rgba(5,0,20,0.6);
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; color: rgba(196,181,253,0.5);
          transition: color 0.3s; white-space: nowrap;
        }
        @media (max-width: 480px) { .us-tab { font-size: 0.52rem; padding: 8px 14px; } }

        /* Panel */
        .us-panel {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;
        }
        @media (max-width: 880px) { .us-panel { grid-template-columns: 1fr; gap: 32px; } }

        /* Image side */
        .us-img-wrap { display: flex; flex-direction: column; gap: 16px; }
        .us-img-frame {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(167,139,250,0.15);
          aspect-ratio: 16/10;
        }
        .us-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .us-img-overlay { position: absolute; inset: 0; pointer-events: none; }
        .us-img-scanlines {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
          opacity: 0.4;
        }
        .us-img-corner { position: absolute; width: 18px; height: 18px; pointer-events: none; }
        .us-img-tl { top: 10px; left: 10px; border-top: 2px solid; border-left: 2px solid; border-radius: 4px 0 0 0; }
        .us-img-br { bottom: 10px; right: 10px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 4px 0; }
        .us-img-label {
          position: absolute; bottom: 14px; left: 14px;
          padding: 5px 14px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.55rem; letter-spacing: 0.12em; font-weight: 700;
        }

        /* Stats row */
        .us-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .us-stat-box {
          padding: 14px 12px; border-radius: 14px; border: 1px solid;
          text-align: center; transition: background 0.3s;
        }
        .us-stat-val { font-family: 'Orbitron', monospace; font-size: 0.9rem; font-weight: 900; display: block; margin-bottom: 4px; }
        .us-stat-lbl { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(196,181,253,0.4); }

        /* Text side */
        .us-text-wrap { display: flex; flex-direction: column; gap: 0; }
        .us-tag {
          display: inline-block; align-self: flex-start;
          padding: 4px 14px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.5rem; letter-spacing: 0.14em; font-weight: 700;
          margin-bottom: 18px;
        }
        .us-headline {
          font-family: 'Orbitron', monospace; font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 900; color: #f0e6ff; line-height: 1.1; margin-bottom: 16px;
        }
        .us-desc {
          font-size: 0.88rem; font-weight: 300; color: rgba(196,181,253,0.6);
          line-height: 1.75; margin-bottom: 24px;
        }
        .us-features-label {
          font-family: 'Orbitron', monospace; font-size: 0.55rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(167,139,250,0.45); margin-bottom: 12px;
        }
        .us-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .us-feature {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.82rem; color: rgba(196,181,253,0.7);
          padding: 8px 14px; border-radius: 10px;
          background: rgba(167,139,250,0.04); border: 1px solid rgba(167,139,250,0.08);
          transition: background 0.3s;
        }
        .us-feature:hover { background: rgba(167,139,250,0.08); }
        .us-feature-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .us-cta-btn {
          padding: 12px 28px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.1em; color: white; align-self: flex-start;
          transition: transform 0.2s;
        }
        .us-cta-btn:hover { transform: translateY(-2px); }

        /* ── Bottom CTA ── */
        .es-cta-section {
          position: relative; z-index: 10;
          max-width: 1320px; margin: 80px auto 0; padding: 0 32px 100px;
        }
        @media (max-width: 768px) { .es-cta-section { padding: 0 20px 80px; } }

        .es-cta-row {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 24px; padding: 40px 44px;
          border-radius: 24px; border: 1px solid rgba(129,140,248,0.15);
          background: rgba(5,0,20,0.85); position: relative; overflow: hidden;
        }
        @media (max-width: 640px) { .es-cta-row { padding: 28px 24px; flex-direction: column; align-items: flex-start; } }
        .es-cta-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 25% 50%, rgba(124,58,237,0.1) 0%, transparent 65%);
        }
        .es-cta-gbar {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #c084fc, transparent);
          background-size: 200% 100%; animation: es-barslide 4s linear infinite;
        }
        .es-cta-title {
          font-family: 'Orbitron', monospace; font-size: clamp(1rem, 2vw, 1.15rem);
          font-weight: 900; color: #f0e6ff; text-shadow: 0 0 20px rgba(129,140,248,0.3);
        }
        .es-cta-sub { font-size: 0.82rem; font-weight: 300; color: rgba(196,181,253,0.5); margin-top: 6px; }
        .es-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; position: relative; z-index: 1; }
        .es-cta-btn-primary {
          padding: 13px 28px; border-radius: 40px; border: none; cursor: pointer;
          font-family: 'Orbitron', monospace; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.1em; color: white;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          box-shadow: 0 6px 24px rgba(124,58,237,0.45);
          transition: all 0.3s;
        }
        .es-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(124,58,237,0.65); }
        .es-cta-btn-sec {
          padding: 12px 24px; border-radius: 40px;
          border: 1px solid rgba(167,139,250,0.3); background: transparent;
          font-family: 'Orbitron', monospace; font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.1em; color: #a78bfa; cursor: pointer; transition: all 0.3s;
        }
        .es-cta-btn-sec:hover { background: rgba(124,58,237,0.12); border-color: rgba(167,139,250,0.6); color: white; transform: translateY(-2px); }
      `}</style>

      <section className="es-root" ref={sectionRef}>

        {/* Stars */}
        <div className="es-stars">
          {STARS.map(s => (
            <div key={s.id} className="es-star" style={{
              left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Shooting stars */}
        {SHOOTS.map(s => (
          <div key={s.id} className="es-shoot" style={{
            left: `${s.startX}%`, top: `${s.startY}%`,
            "--dur": `${s.dur}s`, "--del": `${s.delay}s`, "--ang": `${s.angle}deg`,
          }} />
        ))}

        {/* Floating particles */}
        {PARTICLES.map(p => (
          <div key={p.id} className="es-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            "--dur": `${p.dur}s`, "--del": `${p.delay}s`,
          }} />
        ))}

        {/* Nebulae */}
        <div className="es-neb" style={{ width:620, height:420, background:"radial-gradient(ellipse,#4f46e5,transparent)", top:"-60px", left:"-120px", "--dur":"10s","--a":"0.07","--b":"0.14" }} />
        <div className="es-neb" style={{ width:520, height:420, background:"radial-gradient(ellipse,#7c3aed,transparent)", bottom:"200px", right:"-80px", "--dur":"13s","--a":"0.05","--b":"0.1" }} />
        <div className="es-neb" style={{ width:400, height:400, background:"radial-gradient(ellipse,#c084fc,transparent)", top:"45%", left:"35%", "--dur":"9s","--a":"0.04","--b":"0.08" }} />

        <div className="es-warp" />
        <div className="es-gbar top" />
        <div className="es-gbar bot" />

        {/* ── SECTION 1: Explore Cards ── */}
        <div className="es-inner">
          <motion.div style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="es-eyebrow"><div className="es-eyebrow-dot" />DISCOVERY PORTAL</div>
            <h2 className="es-title">Explore The <span className="es-title-acc">Universe</span></h2>
            <p className="es-sub">Journey through missions, planets, and discoveries that expand our understanding of the cosmos.</p>
            <div className="es-divider" />
          </motion.div>

          <div className="es-grid">
            {EXPLORE_ITEMS.map((item, i) => (
              <ExploreCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Marquee */}
          <motion.div className="es-marquee-wrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="es-marquee">
              {[...Array(2)].map((_, ri) =>
                MARQUEE.map((label, i) => (
                  <div key={`${ri}-${i}`} className="es-marquee-item">
                    <div className="es-marquee-dot" />{label}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 2: Universe Tab Explorer ── */}
        <UniverseSection inView={inView} />

        {/* ── Bottom CTA ── */}
        <div className="es-cta-section">
          <motion.div className="es-cta-row"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="es-cta-bg" />
            <div className="es-cta-gbar" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="es-cta-title">Ready to Begin Your Journey?</div>
              <div className="es-cta-sub">Join 40,000+ explorers discovering the cosmos every day.</div>
            </div>
            <div className="es-cta-btns">
              <motion.button className="es-cta-btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                🚀 Start Exploring
              </motion.button>
              <motion.button className="es-cta-btn-sec" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                View All Missions
              </motion.button>
            </div>
          </motion.div>
        </div>

      </section>
    </>
  );
}