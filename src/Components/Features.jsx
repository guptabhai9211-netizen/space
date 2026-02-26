import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

/* ── Feature data with video BGs ─────────────────────────── */
const FEATURES = [
  {
    title: "Explore Planets",
    desc: "Discover breathtaking alien worlds, their atmospheres, moons, and the conditions that might harbor life.",
    icon: "🪐",
    color: "#7c3aed",
    colorAlt: "#4f46e5",
    glow: "rgba(124,58,237,0.5)",
    tag: "5,000+ PLANETS",
    stats: [{ label: "Confirmed", val: "5,502" }, { label: "Habitable", val: "57" }],
    // Looping Unsplash video via mp4 proxy — fallback to still image
    video: "https://assets.mixkit.co/videos/preview/mixkit-planets-in-space-1422-large.mp4",
    img: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80",
  },
  {
    title: "Space Missions",
    desc: "Follow cutting-edge missions to Mars, the outer planets, and beyond — real-time data and mission logs.",
    icon: "🚀",
    color: "#db2777",
    colorAlt: "#9333ea",
    glow: "rgba(219,39,119,0.5)",
    tag: "LIVE TRACKING",
    stats: [{ label: "Active", val: "320" }, { label: "Agencies", val: "72" }],
    video: "https://assets.mixkit.co/videos/preview/mixkit-rocket-taking-off-from-space-center-32830-large.mp4",
    img: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80",
  },
  {
    title: "Star Gallery",
    desc: "Immerse yourself in stunning imagery of nebulae, supernovae, and billion-star galaxies from Hubble & JWST.",
    icon: "🌌",
    color: "#0ea5e9",
    colorAlt: "#6366f1",
    glow: "rgba(14,165,233,0.5)",
    tag: "JWST IMAGERY",
    stats: [{ label: "Images", val: "40K+" }, { label: "Galaxies", val: "200B" }],
    video: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
  },
];

/* ── Stars ─────────────────────────────────────────────────── */
const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.8 + 0.3,
  delay: Math.random() * 4,
  dur: Math.random() * 3 + 2,
}));

/* ── 3D tilt hook ──────────────────────────────────────────── */
function use3DTilt(strength = 16) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 150, damping: 22 });
  const ry = useSpring(0, { stiffness: 150, damping: 22 });
  const gx = useSpring(50, { stiffness: 80, damping: 20 });
  const gy = useSpring(50, { stiffness: 80, damping: 20 });

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rx.set(-dy * strength);
    ry.set(dx * strength);
    gx.set(50 + dx * 35);
    gy.set(50 + dy * 35);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };

  return { ref, rx, ry, gx, gy, onMove, onLeave };
}

/* ── Feature Card ──────────────────────────────────────────── */
function FeatureCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = use3DTilt(14);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -20, scale: 0.9 },
    visible: {
      opacity: 1, y: 0, rotateX: 0, scale: 1,
      transition: { duration: 0.8, delay: index * 0.18, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ scale: 1.03, z: 30 }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
        className="feat-card"
      >
        {/* Video / image BG */}
        <div className="feat-media">
          {!videoError ? (
            <video
              autoPlay muted loop playsInline
              onError={() => setVideoError(true)}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                opacity: hovered ? 0.45 : 0.2,
                transition: "opacity 0.6s ease",
                filter: "saturate(1.3)",
              }}
            >
              <source src={item.video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                opacity: hovered ? 0.45 : 0.2,
                transition: "opacity 0.6s ease",
              }}
            />
          )}
        </div>

        {/* Dynamic radial glow on cursor */}
        <motion.div
          className="feat-cursor-glow"
          style={{
            background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.glow} 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ opacity: { duration: 0.3 } }}
        />

        {/* Gradient overlay */}
        <div className="feat-overlay" style={{
          background: `linear-gradient(160deg, rgba(0,0,0,0.1) 0%, rgba(0,0,5,0.85) 60%, rgba(0,0,5,0.98) 100%)`,
        }} />

        {/* Border glow on hover */}
        <motion.div
          className="feat-border-glow"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ boxShadow: `0 0 0 1px ${item.color}60, 0 0 40px ${item.glow}, inset 0 0 40px ${item.glow.replace("0.5", "0.07")}` }}
        />

        {/* Content */}
        <div className="feat-content" style={{ transform: "translateZ(20px)" }}>

          {/* Tag */}
          <motion.div
            className="feat-tag"
            style={{ background: `${item.color}22`, border: `1px solid ${item.color}55`, color: item.color }}
            animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
          >
            {item.tag}
          </motion.div>

          {/* Icon */}
          <motion.div
            className="feat-icon"
            animate={hovered
              ? { y: -8, scale: 1.25, rotate: [0, -8, 8, 0], filter: `drop-shadow(0 0 20px ${item.color})` }
              : { y: 0, scale: 1, filter: `drop-shadow(0 0 8px ${item.color}80)` }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {item.icon}
          </motion.div>

          <h3 className="feat-title">{item.title}</h3>
          <p className="feat-desc">{item.desc}</p>

          {/* Stats row */}
          <motion.div
            className="feat-stats"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.35, delay: hovered ? 0.05 : 0 }}
          >
            {item.stats.map((s, i) => (
              <div key={i} className="feat-stat">
                <span className="feat-stat-num" style={{ color: item.color }}>{s.val}</span>
                <span className="feat-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            className="feat-cta"
            style={{
              background: `linear-gradient(135deg, ${item.color}, ${item.colorAlt})`,
              boxShadow: `0 6px 24px ${item.glow}`,
            }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
            transition={{ duration: 0.35, delay: hovered ? 0.1 : 0 }}
            whileTap={{ scale: 0.96 }}
          >
            Discover More →
          </motion.button>
        </div>

        {/* Corner accent lines */}
        <div className="feat-corner feat-corner-tl" style={{ borderColor: `${item.color}60` }} />
        <div className="feat-corner feat-corner-br" style={{ borderColor: `${item.color}60` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ──────────────────────────────────────────── */
export default function SpaceFeatures() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .sf-root {
          position: relative;
          background: #000;
          color: white;
          padding: 120px 0 140px;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        /* stars */
        .sf-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .sf-star {
          position: absolute; border-radius: 50%; background: white;
          animation: sf-twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes sf-twinkle {
          from { opacity: 0.05; transform: scale(0.6); }
          to   { opacity: 0.85; transform: scale(1.3); }
        }

        /* nebula blobs */
        .sf-nebula {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(90px); opacity: 0.1;
          animation: sf-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sf-pulse {
          from { transform: scale(1); opacity: 0.08; }
          to   { transform: scale(1.2); opacity: 0.16; }
        }

        /* section heading */
        .sf-inner { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; padding: 0 32px; }

        .sf-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.35);
          background: rgba(109,40,217,0.12);
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; color: #a78bfa;
          margin-bottom: 24px;
        }
        .sf-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          animation: sf-blink 1.5s ease-in-out infinite;
        }
        @keyframes sf-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }

        .sf-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.2rem, 4.5vw, 4rem);
          font-weight: 900;
          color: #f0e6ff;
          text-shadow: 0 0 40px rgba(139,92,246,0.3);
          line-height: 1.08;
        }
        .sf-title .accent {
          background: linear-gradient(135deg, #c084fc, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sf-sub {
          margin-top: 16px; max-width: 500px; margin-left: auto; margin-right: auto;
          font-size: 1rem; font-weight: 300; line-height: 1.7;
          color: rgba(196,181,253,0.6);
        }

        /* divider */
        .sf-divider {
          width: 80px; height: 1px; margin: 32px auto;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
        }

        /* grid */
        .sf-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 60px;
        }
        @media (max-width: 1000px) { .sf-grid { grid-template-columns: 1fr; max-width: 480px; margin-left: auto; margin-right: auto; } }
        @media (max-width: 640px)  { .sf-grid { gap: 20px; } }

        /* card */
        .feat-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.12);
          background: rgba(5,0,20,0.9);
          min-height: 420px;
          cursor: pointer;
          transform-style: preserve-3d;
        }

        .feat-media {
          position: absolute; inset: 0; z-index: 0;
        }
        .feat-cursor-glow {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
        }
        .feat-overlay {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
        }
        .feat-border-glow {
          position: absolute; inset: 0; z-index: 3; border-radius: 24px; pointer-events: none;
        }

        .feat-content {
          position: relative; z-index: 5;
          padding: 28px 26px 30px;
          display: flex; flex-direction: column; height: 100%; min-height: 420px;
        }

        .feat-tag {
          display: inline-block; align-self: flex-start;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'Orbitron', monospace;
          font-size: 0.55rem; letter-spacing: 0.18em;
          font-weight: 700; margin-bottom: 20px;
        }

        .feat-icon {
          font-size: 3.2rem; margin-bottom: 20px;
          display: inline-block; transform-origin: center;
        }

        .feat-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem; font-weight: 700;
          color: #f0e6ff; letter-spacing: 0.05em;
          margin-bottom: 12px;
          text-shadow: 0 0 20px rgba(167,139,250,0.3);
        }

        .feat-desc {
          font-size: 0.88rem; font-weight: 300;
          color: rgba(196,181,253,0.65);
          line-height: 1.65; flex: 1;
        }

        .feat-stats {
          display: flex; gap: 24px;
          margin-top: 22px; padding-top: 18px;
          border-top: 1px solid rgba(139,92,246,0.12);
        }
        .feat-stat { display: flex; flex-direction: column; gap: 3px; }
        .feat-stat-num {
          font-family: 'Orbitron', monospace;
          font-size: 1.15rem; font-weight: 900;
        }
        .feat-stat-label {
          font-size: 0.65rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(196,181,253,0.45);
        }

        .feat-cta {
          margin-top: 16px;
          padding: 10px 22px; border-radius: 40px;
          border: none; cursor: pointer;
          font-family: 'Orbitron', monospace;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: white; align-self: flex-start;
          transition: transform 0.2s;
        }
        .feat-cta:hover { transform: scale(1.05); }

        /* corner accents */
        .feat-corner {
          position: absolute; width: 18px; height: 18px;
          pointer-events: none; z-index: 6;
        }
        .feat-corner-tl { top: 12px; left: 12px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .feat-corner-br { bottom: 12px; right: 12px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* bottom glow bar */
        .sf-glow-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #db2777, transparent);
          background-size: 200% 100%;
          animation: glow-slide 5s linear infinite;
        }
        @keyframes glow-slide {
          0% { background-position: 200% 0; } 100% { background-position: -200% 0; }
        }

        /* bottom extra features strip */
        .sf-extras {
          margin-top: 80px;
          display: flex; gap: 0;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 20px;
          overflow: hidden;
        }
        .sf-extra-item {
          flex: 1;
          padding: 28px 24px;
          display: flex; align-items: center; gap: 16px;
          border-right: 1px solid rgba(139,92,246,0.12);
          background: rgba(5,0,20,0.7);
          position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .sf-extra-item:last-child { border-right: none; }
        .sf-extra-item:hover { background: rgba(109,40,217,0.1); }
        .sf-extra-icon { font-size: 1.8rem; }
        .sf-extra-title {
          font-family: 'Orbitron', monospace; font-size: 0.75rem;
          font-weight: 700; color: #e9d5ff; letter-spacing: 0.06em;
        }
        .sf-extra-desc {
          font-size: 0.75rem; color: rgba(196,181,253,0.5);
          margin-top: 3px; line-height: 1.4;
        }
        @media (max-width: 768px) { .sf-extras { flex-direction: column; } .sf-extra-item { border-right: none; border-bottom: 1px solid rgba(139,92,246,0.12); } .sf-extra-item:last-child { border-bottom: none; } }
      `}</style>

      <section className="sf-root" ref={sectionRef}>

        {/* Stars */}
        <div className="sf-stars">
          {STARS.map(s => (
            <div key={s.id} className="sf-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Nebula blobs */}
        <div className="sf-nebula" style={{ width: 500, height: 500, background: "radial-gradient(circle, #7c3aed, transparent)", top: "-100px", left: "-100px", "--dur": "9s" }} />
        <div className="sf-nebula" style={{ width: 400, height: 400, background: "radial-gradient(circle, #4f46e5, transparent)", bottom: "0", right: "-80px", "--dur": "12s" }} />
        <div className="sf-nebula" style={{ width: 300, height: 300, background: "radial-gradient(circle, #db2777, transparent)", top: "40%", left: "40%", "--dur": "7s", opacity: 0.07 }} />

        {/* Bottom bar */}
        <div className="sf-glow-bar" />

        <div className="sf-inner">

          {/* Header */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="sf-eyebrow">
              <div className="sf-eyebrow-dot" />
              WHAT WE OFFER
            </div>
            <h2 className="sf-title">
              Amazing <span className="accent">Features</span>
            </h2>
            <p className="sf-sub">
              Discover the power of space exploration with tools built for the next generation of cosmic adventurers.
            </p>
            <div className="sf-divider" />
          </motion.div>

          {/* Cards grid */}
          <motion.div
            className="sf-grid"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {FEATURES.map((item, i) => (
              <FeatureCard key={i} item={item} index={i} />
            ))}
          </motion.div>

          {/* Extra strip */}
          <motion.div
            className="sf-extras"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            {[
              { icon: "🛰️", title: "Live Telemetry", desc: "Real-time satellite & probe data streams" },
              { icon: "🔭", title: "JWST Feed", desc: "Latest James Webb images, daily updated" },
              { icon: "🌍", title: "3D Orrery", desc: "Interactive solar system model" },
              { icon: "📡", title: "SETI Signals", desc: "Anomalous signals from deep space" },
            ].map((e, i) => (
              <motion.div
                key={i}
                className="sf-extra-item"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
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