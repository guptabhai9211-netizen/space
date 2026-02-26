import { useRef, useState } from "react";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";

/* ── Gallery data ─────────────────────────────────────────── */
const GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&q=85",
    title: "Deep Space Void",
    sub: "13.8 billion light-years",
    size: "large",   // spans 2 rows
    color: "#7c3aed",
  },
  {
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=85",
    title: "Andromeda Galaxy",
    sub: "2.537M light-years away",
    size: "normal",
    color: "#4f46e5",
  },
  {
    url: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=900&q=85",
    title: "Solar Flare",
    sub: "Plasma eruption, 10,000 km",
    size: "normal",
    color: "#f97316",
  },
  {
    url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=85",
    title: "Nebula Birth",
    sub: "Star forming region",
    size: "normal",
    color: "#db2777",
  },
  {
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=900&q=85",
    title: "Saturn Rings",
    sub: "1.2 billion km from Earth",
    size: "large",
    color: "#0ea5e9",
  },
  {
    url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=900&q=85",
    title: "Lunar Surface",
    sub: "384,400 km from home",
    size: "normal",
    color: "#a78bfa",
  },
];

const STARS = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

/* ── 3D tilt hook ─────────────────────────────────────────── */
function useTilt(strength = 12) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 180, damping: 24 });
  const ry = useSpring(0, { stiffness: 180, damping: 24 });
  const gx = useSpring(50, { stiffness: 90, damping: 20 });
  const gy = useSpring(50, { stiffness: 90, damping: 20 });

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

/* ── Gallery Card ─────────────────────────────────────────── */
function GalleryCard({ item, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(11);
  const isLarge = item.size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.88, rotateX: -18 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      style={{
        gridRow: isLarge ? "span 2" : "span 1",
        perspective: 900,
      }}
    >
      <motion.div
        ref={ref}
        className="gc-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        onClick={() => onClick(item, index)}
        whileHover={{ scale: 1.03, z: 20 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {/* Image */}
        <motion.img
          src={item.url}
          alt={item.title}
          className="gc-img"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Dark overlay */}
        <div className="gc-dark" />

        {/* Cursor glow */}
        <motion.div
          className="gc-glow"
          style={{
            background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.color}55 0%, transparent 65%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Border glow */}
        <motion.div
          className="gc-border"
          animate={{
            opacity: hovered ? 1 : 0,
            boxShadow: hovered
              ? `0 0 0 1px ${item.color}80, 0 0 50px ${item.color}40, inset 0 0 50px ${item.color}10`
              : "none",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Scan line animation */}
        <motion.div
          className="gc-scan"
          animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.4, 0] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${item.color}60, transparent)` }}
        />

        {/* Top badge */}
        <motion.div
          className="gc-badge"
          style={{ background: `${item.color}22`, border: `1px solid ${item.color}55`, color: item.color }}
          animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : -6 }}
          transition={{ duration: 0.3 }}
        >
          ✦ CAPTURED
        </motion.div>

        {/* Bottom info */}
        <div className="gc-info">
          <motion.h3
            className="gc-title"
            animate={{ y: hovered ? 0 : 6, opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.35 }}
          >
            {item.title}
          </motion.h3>
          <motion.p
            className="gc-sub"
            animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {item.sub}
          </motion.p>
          <motion.div
            className="gc-expand"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
            animate={{ scale: hovered ? 1 : 0.85, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            ⊕ View Full
          </motion.div>
        </div>

        {/* Corner brackets */}
        <div className="gc-corner gc-tl" style={{ borderColor: `${item.color}70` }} />
        <div className="gc-corner gc-br" style={{ borderColor: `${item.color}70` }} />
        <div className="gc-num" style={{ color: `${item.color}60` }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ item, index, total, onClose, onPrev, onNext }) {
  return (
    <motion.div
      className="lb-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      {/* Blur backdrop */}
      <div className="lb-blur" />

      <motion.div
        className="lb-box"
        initial={{ scale: 0.8, rotateY: -20, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.8, rotateY: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.url} alt={item.title} className="lb-img" />

        <div className="lb-glass" />

        <div className="lb-meta">
          <div>
            <h2 className="lb-title">{item.title}</h2>
            <p className="lb-sub">{item.sub}</p>
          </div>
          <div className="lb-counter">{index + 1} / {total}</div>
        </div>

        {/* Close */}
        <button className="lb-close" onClick={onClose}>✕</button>

        {/* Prev / Next */}
        <button className="lb-nav lb-prev" onClick={onPrev}>‹</button>
        <button className="lb-nav lb-next" onClick={onNext}>›</button>

        {/* Corner accents */}
        <div className="lb-corner lb-tl" style={{ borderColor: `${item.color}80` }} />
        <div className="lb-corner lb-br" style={{ borderColor: `${item.color}80` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ─────────────────────────────────────────── */
export default function SpaceGallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [lightbox, setLightbox] = useState(null); // index

  const openLightbox = (_, i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevSlide = () => setLightbox((l) => (l - 1 + GALLERY.length) % GALLERY.length);
  const nextSlide = () => setLightbox((l) => (l + 1) % GALLERY.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .sg-root {
          position: relative;
          background: #000;
          color: white;
          padding: 120px 0 140px;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        /* stars */
        .sg-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .sg-star {
          position: absolute; border-radius: 50%; background: white;
          animation: sg-twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes sg-twinkle {
          from { opacity: 0.05; transform: scale(0.5); }
          to   { opacity: 0.9; transform: scale(1.4); }
        }

        /* nebulae */
        .sg-neb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(100px);
          animation: sg-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sg-pulse {
          from { opacity: var(--op-from); transform: scale(1); }
          to   { opacity: var(--op-to);   transform: scale(1.18); }
        }

        .sg-inner { position: relative; z-index: 10; max-width: 1320px; margin: 0 auto; padding: 0 32px; }

        /* header */
        .sg-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.35);
          background: rgba(109,40,217,0.1);
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; color: #a78bfa;
          margin-bottom: 22px;
        }
        .sg-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          animation: sg-blink 1.4s ease-in-out infinite;
        }
        @keyframes sg-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }

        .sg-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.2rem, 4.5vw, 4rem);
          font-weight: 900; line-height: 1.08;
          color: #f0e6ff;
          text-shadow: 0 0 40px rgba(139,92,246,0.3);
        }
        .sg-title .acc {
          background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sg-sub {
          margin-top: 14px; font-size: 1rem; font-weight: 300;
          color: rgba(196,181,253,0.6); line-height: 1.7;
          max-width: 480px; margin-left: auto; margin-right: auto;
        }
        .sg-divider {
          width: 80px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
        }

        /* filter tabs */
        .sg-tabs {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .sg-tab {
          padding: 8px 20px; border-radius: 40px;
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid rgba(139,92,246,0.25);
          background: transparent; color: rgba(196,181,253,0.5);
          cursor: pointer; transition: all 0.3s;
        }
        .sg-tab:hover, .sg-tab.active {
          background: rgba(109,40,217,0.25); color: #e9d5ff;
          border-color: rgba(139,92,246,0.6);
          box-shadow: 0 0 20px rgba(109,40,217,0.25);
        }

        /* masonry grid */
        .sg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .sg-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 200px; }
        }
        @media (max-width: 580px) {
          .sg-grid { grid-template-columns: 1fr; grid-auto-rows: 240px; }
        }

        /* card */
        .gc-card {
          position: relative; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(139,92,246,0.12);
          background: rgba(5,0,20,0.95);
          cursor: pointer; height: 100%;
          transform-style: preserve-3d;
        }
        .gc-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transform-origin: center; will-change: transform;
        }
        .gc-dark {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,10,0.9) 0%, rgba(0,0,10,0.3) 50%, transparent 100%);
          z-index: 1;
        }
        .gc-glow { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .gc-border { position: absolute; inset: 0; border-radius: 18px; z-index: 3; pointer-events: none; }
        .gc-scan {
          position: absolute; left: 0; right: 0; top: 0;
          height: 40%; z-index: 4; pointer-events: none;
        }

        .gc-badge {
          position: absolute; top: 14px; left: 14px; z-index: 6;
          padding: 4px 12px; border-radius: 20px;
          font-family: 'Orbitron', monospace; font-size: 0.5rem;
          letter-spacing: 0.15em; font-weight: 700;
        }

        .gc-num {
          position: absolute; top: 14px; right: 14px; z-index: 6;
          font-family: 'Orbitron', monospace; font-size: 1.4rem;
          font-weight: 900; line-height: 1;
        }

        .gc-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px 18px 18px; z-index: 6;
        }
        .gc-title {
          font-family: 'Orbitron', monospace; font-size: 0.9rem;
          font-weight: 700; color: #f0e6ff; letter-spacing: 0.05em;
        }
        .gc-sub {
          font-size: 0.72rem; color: rgba(196,181,253,0.6);
          margin-top: 3px; letter-spacing: 0.06em;
        }
        .gc-expand {
          display: inline-block; margin-top: 10px;
          padding: 6px 14px; border-radius: 20px; border: none;
          font-family: 'Orbitron', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; color: white; cursor: pointer;
        }

        /* corner brackets */
        .gc-corner {
          position: absolute; width: 16px; height: 16px;
          z-index: 6; pointer-events: none;
          transition: all 0.3s;
        }
        .gc-tl { top: 10px; left: 10px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .gc-br { bottom: 10px; right: 10px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* count strip */
        .sg-strip {
          display: flex; gap: 0;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 16px; overflow: hidden;
          margin-top: 48px;
        }
        .sg-strip-item {
          flex: 1; padding: 22px 20px; text-align: center;
          border-right: 1px solid rgba(139,92,246,0.1);
          background: rgba(5,0,20,0.7);
          transition: background 0.3s;
        }
        .sg-strip-item:last-child { border-right: none; }
        .sg-strip-item:hover { background: rgba(109,40,217,0.1); }
        .sg-strip-num {
          font-family: 'Orbitron', monospace; font-size: 1.5rem;
          font-weight: 900; color: #e9d5ff;
          text-shadow: 0 0 15px rgba(167,139,250,0.4);
        }
        .sg-strip-label {
          font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(167,139,250,0.5);
          margin-top: 4px;
        }
        @media (max-width: 640px) {
          .sg-strip { flex-wrap: wrap; }
          .sg-strip-item { flex: 1 1 50%; border-bottom: 1px solid rgba(139,92,246,0.1); }
        }

        /* glow bar */
        .sg-glow-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #0ea5e9, transparent);
          background-size: 200% 100%;
          animation: sg-bar 5s linear infinite;
        }
        @keyframes sg-bar { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── LIGHTBOX ─────────────────────────────── */
        .lb-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .lb-blur {
          position: absolute; inset: 0;
          background: rgba(0,0,10,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .lb-box {
          position: relative; z-index: 1;
          max-width: 900px; width: 100%;
          border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(139,92,246,0.25);
          box-shadow: 0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(139,92,246,0.1);
          transform-style: preserve-3d;
        }
        .lb-img {
          width: 100%; max-height: 80vh;
          object-fit: cover; display: block;
        }
        .lb-glass {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .lb-meta {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 40px 28px 24px;
          background: linear-gradient(to top, rgba(0,0,10,0.97), transparent);
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .lb-title {
          font-family: 'Orbitron', monospace; font-size: 1.4rem;
          font-weight: 900; color: #f0e6ff; letter-spacing: 0.06em;
        }
        .lb-sub {
          font-size: 0.82rem; color: rgba(196,181,253,0.6);
          margin-top: 5px; letter-spacing: 0.06em;
        }
        .lb-counter {
          font-family: 'Orbitron', monospace; font-size: 0.7rem;
          color: rgba(167,139,250,0.5); letter-spacing: 0.12em;
        }
        .lb-close {
          position: absolute; top: 16px; right: 16px;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(0,0,10,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px);
        }
        .lb-close:hover { background: rgba(109,40,217,0.4); color: white; transform: scale(1.1); }
        .lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 46px; height: 46px; border-radius: 50%;
          background: rgba(0,0,10,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 1.6rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px);
        }
        .lb-nav:hover { background: rgba(109,40,217,0.4); color: white; transform: translateY(-50%) scale(1.1); }
        .lb-prev { left: 16px; }
        .lb-next { right: 16px; }
        .lb-corner {
          position: absolute; width: 22px; height: 22px;
          z-index: 10; pointer-events: none;
        }
        .lb-tl { top: 14px; left: 14px; border-top: 2px solid; border-left: 2px solid; border-radius: 6px 0 0 0; }
        .lb-br { bottom: 14px; right: 14px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 6px 0; }
      `}</style>

      <section className="sg-root" ref={sectionRef}>

        {/* Stars */}
        <div className="sg-stars">
          {STARS.map(s => (
            <div key={s.id} className="sg-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* Nebulae */}
        <div className="sg-neb" style={{ width: 600, height: 400, background: "radial-gradient(ellipse, #7c3aed, transparent)", top: "-80px", left: "-120px", "--dur": "9s", "--op-from": "0.09", "--op-to": "0.17" }} />
        <div className="sg-neb" style={{ width: 500, height: 300, background: "radial-gradient(ellipse, #0ea5e9, transparent)", bottom: "0", right: "-80px", "--dur": "11s", "--op-from": "0.07", "--op-to": "0.14" }} />
        <div className="sg-neb" style={{ width: 400, height: 400, background: "radial-gradient(ellipse, #db2777, transparent)", top: "50%", left: "40%", "--dur": "7s", "--op-from": "0.04", "--op-to": "0.09" }} />

        {/* Top glow bar */}
        <div className="sg-glow-bar" />

        <div className="sg-inner">

          {/* Header */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="sg-eyebrow">
              <div className="sg-eyebrow-dot" />
              COSMIC IMAGERY
            </div>
            <h2 className="sg-title">
              Space <span className="acc">Gallery</span>
            </h2>
            <p className="sg-sub">
              Stunning visuals from Hubble, JWST, and deep-space probes —
              every pixel a billion light-years of history.
            </p>
            <div className="sg-divider" />
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="sg-tabs"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {["All", "Galaxies", "Nebulae", "Planets", "Deep Space"].map((t, i) => (
              <motion.button
                key={t}
                className={`sg-tab ${i === 0 ? "active" : ""}`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                {t}
              </motion.button>
            ))}
          </motion.div>

          {/* Masonry Grid */}
          <div className="sg-grid">
            {GALLERY.map((item, i) => (
              <GalleryCard
                key={i}
                item={item}
                index={i}
                onClick={openLightbox}
              />
            ))}
          </div>

          {/* Stats strip */}
          <motion.div
            className="sg-strip"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { num: "40K+", label: "Images in Archive" },
              { num: "28", label: "Telescopes Used" },
              { num: "200B", label: "Galaxies Catalogued" },
              { num: "13.8B", label: "Light-years Captured" },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="sg-strip-item"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <div className="sg-strip-num">{s.num}</div>
                <div className="sg-strip-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            item={GALLERY[lightbox]}
            index={lightbox}
            total={GALLERY.length}
            onClose={closeLightbox}
            onPrev={prevSlide}
            onNext={nextSlide}
          />
        )}
      </AnimatePresence>
    </>
  );
}