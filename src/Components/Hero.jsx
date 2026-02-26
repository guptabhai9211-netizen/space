import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

/* ─── Space image gallery ─────────────────────────────────── */
const SPACE_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    label: "Andromeda Galaxy",
    sub: "2.537 million light‑years away",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    label: "Earth from Orbit",
    sub: "The pale blue dot",
  },
  {
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
    label: "Deep Space",
    sub: "Billions of stars, billions of stories",
  },
  {
    url: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&q=80",
    label: "The Moon",
    sub: "384,400 km from home",
  },
];

/* ─── Random stars ────────────────────────────────────────── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

/* ─── Floating debris / asteroids ────────────────────────── */
const DEBRIS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startX: Math.random() * 100,
  startY: Math.random() * 100,
  size: Math.random() * 6 + 3,
  dur: Math.random() * 20 + 15,
  delay: Math.random() * 10,
}));

/* ─── Counter animation hook ─────────────────────────────── */
function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

/* ─── Main component ──────────────────────────────────────── */
export default function SpaceHero() {
  const [slide, setSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const cardRef = useRef(null);

  // Framer spring for mouse tilt on card
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 });
  const cardGlowX = useSpring(50, { stiffness: 80, damping: 20 });
  const cardGlowY = useSpring(50, { stiffness: 80, damping: 20 });

  // Auto-advance slideshow
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SPACE_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Trigger counters when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // 3D tilt on card mouse move
  const handleCardMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 14);
    rotateY.set(dx * 14);
    cardGlowX.set(50 + dx * 30);
    cardGlowY.set(50 + dy * 30);
  };
  const handleCardMouseLeave = () => {
    rotateX.set(0); rotateY.set(0);
    cardGlowX.set(50); cardGlowY.set(50);
  };

  const planets = useCounter(5000, 2200, statsVisible);
  const missions = useCounter(320, 2000, statsVisible);
  const galaxies = useCounter(200, 2500, statsVisible);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-root {
          min-height: 100vh;
          background: #000;
          position: relative;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ── Video BG ── */
        .video-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .video-bg video {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.18;
          filter: saturate(1.4) hue-rotate(220deg);
        }
        .video-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(15,0,40,0.6) 0%, rgba(0,0,0,0.95) 100%);
        }

        /* ── Stars ── */
        .star-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .star-dot {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          from { opacity: 0.08; transform: scale(0.6); }
          to   { opacity: 1;    transform: scale(1.3); }
        }

        /* ── Debris ── */
        .debris-dot {
          position: absolute;
          border-radius: 2px;
          background: rgba(167,139,250,0.5);
          animation: float-debris var(--dur) var(--delay) linear infinite;
          transform: rotate(45deg);
        }
        @keyframes float-debris {
          0%   { transform: translate(0,0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translate(-150px, -300px) rotate(720deg); opacity: 0; }
        }

        /* ── Layout ── */
        .hero-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 100px 32px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 40px; }
        }

        /* ── Left ── */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.4);
          background: rgba(109,40,217,0.15);
          font-family: 'Orbitron', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #a78bfa;
          margin-bottom: 28px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 8px #a78bfa;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); box-shadow: 0 0 8px #a78bfa; }
          50%      { transform: scale(1.4); box-shadow: 0 0 16px #a78bfa; }
        }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 5rem);
          line-height: 1.05;
          color: #f0e6ff;
          text-shadow: 0 0 40px rgba(139,92,246,0.4);
          letter-spacing: -0.01em;
        }
        .hero-title .accent {
          background: linear-gradient(135deg, #c084fc, #818cf8, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(167,139,250,0.5));
        }

        .hero-sub {
          margin-top: 20px;
          font-size: 1.05rem;
          font-weight: 300;
          color: rgba(196,181,253,0.7);
          line-height: 1.7;
          max-width: 440px;
        }

        .btn-row {
          display: flex;
          gap: 16px;
          margin-top: 36px;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) { .btn-row { justify-content: center; } }

        .btn-primary {
          position: relative;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'Orbitron', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: white;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          box-shadow: 0 6px 30px rgba(109,40,217,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
          overflow: hidden;
          transition: all 0.35s ease;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #9333ea, #6366f1);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 12px 40px rgba(109,40,217,0.7); }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-secondary {
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'Orbitron', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c4b5fd;
          background: transparent;
          border: 1px solid rgba(139,92,246,0.4);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.35s ease;
        }
        .btn-secondary:hover {
          background: rgba(109,40,217,0.2);
          border-color: rgba(167,139,250,0.7);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(109,40,217,0.25);
        }

        /* ── Stats row ── */
        .stats-row {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(139,92,246,0.15);
        }
        @media (max-width: 900px) { .stats-row { justify-content: center; } }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat-num {
          font-family: 'Orbitron', monospace;
          font-size: 1.6rem;
          font-weight: 900;
          color: #e9d5ff;
          text-shadow: 0 0 20px rgba(167,139,250,0.5);
        }
        .stat-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(167,139,250,0.6);
        }
        .stat-divider { width: 1px; background: rgba(139,92,246,0.2); align-self: stretch; }

        /* ── 3D Card ── */
        .card-perspective { perspective: 900px; }
        .card-3d {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.25);
          box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06);
          transform-style: preserve-3d;
          cursor: pointer;
        }

        /* Slide images */
        .slide-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
        }

        /* Card glass overlay */
        .card-glass {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        /* Dynamic radial glow on hover */
        .card-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(circle at var(--gx) var(--gy), rgba(139,92,246,0.18), transparent 60%);
        }
        .card-3d:hover .card-glow { opacity: 1; }

        /* Slide label */
        .slide-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 32px 24px 20px;
          background: linear-gradient(to top, rgba(0,0,10,0.95), transparent);
        }
        .slide-label h3 {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #f0e6ff;
          letter-spacing: 0.08em;
        }
        .slide-label p {
          font-size: 0.78rem;
          color: rgba(196,181,253,0.65);
          margin-top: 4px;
          letter-spacing: 0.06em;
        }

        /* Slide dots */
        .slide-dots {
          position: absolute;
          top: 16px; right: 16px;
          display: flex;
          gap: 6px;
        }
        .slide-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          border: none;
          transition: all 0.3s;
        }
        .slide-dot.active {
          background: #a78bfa;
          box-shadow: 0 0 8px #a78bfa;
          width: 18px;
          border-radius: 3px;
        }

        /* Orbit ring around card */
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.15);
          pointer-events: none;
          animation: orbit-spin var(--dur) linear infinite;
        }
        @keyframes orbit-spin {
          from { transform: rotateZ(0deg) rotateX(70deg); }
          to   { transform: rotateZ(360deg) rotateX(70deg); }
        }
        .orbit-planet {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #c084fc, #4f46e5);
          box-shadow: 0 0 20px rgba(139,92,246,0.8);
          animation: orbit-planet var(--dur) linear infinite;
        }

        /* Floating space elements */
        .float-elem {
          position: absolute;
          pointer-events: none;
          animation: float-elem var(--dur) ease-in-out infinite alternate;
          opacity: 0.6;
          font-size: var(--size);
          filter: drop-shadow(0 0 10px rgba(167,139,250,0.6));
        }
        @keyframes float-elem {
          from { transform: translateY(0) rotate(0deg); }
          to   { transform: translateY(-18px) rotate(20deg); }
        }

        /* Bottom gradient fade */
        .bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 120px;
          background: linear-gradient(to top, #000, transparent);
          pointer-events: none;
          z-index: 5;
        }

        /* Scroll indicator */
        .scroll-hint {
          position: absolute;
          bottom: 32px; left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(167,139,250,0.5);
          font-family: 'Orbitron', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
        }
        .scroll-mouse {
          width: 22px; height: 36px;
          border: 1.5px solid rgba(139,92,246,0.4);
          border-radius: 11px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }
        .scroll-wheel {
          width: 3px; height: 6px;
          border-radius: 2px;
          background: #a78bfa;
          animation: scroll-anim 1.6s ease-in-out infinite;
        }
        @keyframes scroll-anim {
          0%,100% { transform: translateY(0); opacity: 1; }
          80%      { transform: translateY(10px); opacity: 0; }
        }
      `}</style>

      <section className="hero-root" ref={heroRef}>

        {/* ── Video background ── */}
        <div className="video-bg">
          {/* NASA public domain timelapse */}
          <video autoPlay muted loop playsInline>
            <source src="https://www.nasa.gov/wp-content/uploads/2023/03/black-holes-collide.mp4" type="video/mp4" />
            {/* fallback: gradient bg already applied */}
          </video>
          <div className="video-overlay" />
        </div>

        {/* ── Star field ── */}
        <div className="star-canvas">
          {STARS.map(s => (
            <div key={s.id} className="star-dot" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* ── Floating debris ── */}
        {DEBRIS.map(d => (
          <div key={d.id} className="debris-dot" style={{
            left: `${d.startX}%`, top: `${d.startY}%`,
            width: d.size, height: d.size / 2,
            "--dur": `${d.dur}s`, "--delay": `${d.delay}s`,
          }} />
        ))}

        {/* ── Nebula blobs ── */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", borderRadius: "50%",
            width: 600, height: 300,
            background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "10%", left: "5%",
            zIndex: 1, pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute", borderRadius: "50%",
            width: 400, height: 400,
            background: "radial-gradient(ellipse, #4f46e5 0%, transparent 70%)",
            filter: "blur(100px)",
            bottom: "5%", right: "10%",
            zIndex: 1, pointerEvents: "none",
          }}
        />

        {/* ── Main content ── */}
        <div className="hero-inner">

          {/* ── LEFT ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="badge">
                <div className="badge-dot" />
                MISSION CONTROL ACTIVE
              </div>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              Explore The<br />
              <span className="accent">Universe</span><br />
              Beyond
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              Journey beyond the stars and discover amazing planets,
              galaxies and mysteries of the cosmos — rendered in breathtaking 3D.
            </motion.p>

            <motion.div
              className="btn-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>🚀 Start Journey</span>
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                🌌 Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="stats-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              <div className="stat">
                <span className="stat-num">{planets.toLocaleString()}+</span>
                <span className="stat-label">Exoplanets</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">{missions}+</span>
                <span className="stat-label">Missions</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">{galaxies}B+</span>
                <span className="stat-label">Galaxies</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — 3D Card with slideshow ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="card-perspective"
            style={{ position: "relative" }}
          >
            {/* Floating emoji decor */}
            <div className="float-elem" style={{ top: "-30px", right: "10px", "--dur": "4s", "--size": "2rem" }}>🪐</div>
            <div className="float-elem" style={{ bottom: "20px", left: "-20px", "--dur": "5.5s", "--size": "1.5rem" }}>⭐</div>
            <div className="float-elem" style={{ top: "40%", right: "-25px", "--dur": "3.5s", "--size": "1.2rem" }}>☄️</div>

            {/* The 3D card */}
            <motion.div
              ref={cardRef}
              className="card-3d"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Slideshow images */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide}
                  className="slide-img"
                  src={SPACE_SLIDES[slide].url}
                  alt={SPACE_SLIDES[slide].label}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* Glass + glow */}
              <div className="card-glass" />
              <div className="card-glow" />

              {/* Slide label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${slide}`}
                  className="slide-label"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3>{SPACE_SLIDES[slide].label}</h3>
                  <p>{SPACE_SLIDES[slide].sub}</p>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="slide-dots">
                {SPACE_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`slide-dot ${i === slide ? "active" : ""}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Reflection shadow */}
            <motion.div
              style={{
                position: "absolute",
                bottom: -30, left: "10%", right: "10%",
                height: 40,
                background: "radial-gradient(ellipse, rgba(109,40,217,0.35), transparent 70%)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="bottom-fade" />

        {/* Scroll hint */}
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          SCROLL
        </motion.div>
      </section>
    </>
  );
}