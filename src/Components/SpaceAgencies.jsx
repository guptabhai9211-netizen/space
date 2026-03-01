import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ target, duration = 2200, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="counter-value">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glare: { x: 50, y: 50 } });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x: dy * -12, y: dx * 12, glare: { x: glareX, y: glareY } });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0, glare: { x: 50, y: 50 } });

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="tilt-glare"
        style={{
          background: `radial-gradient(circle at ${tilt.glare.x}% ${tilt.glare.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, target, suffix, prefix, label, delay, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="stat-card">
        <div className="stat-icon" style={{ color }}>{icon}</div>
        <div className="stat-number" style={{ color }}>
          <Counter target={target} suffix={suffix} prefix={prefix} />
        </div>
        <p className="stat-label">{label}</p>
        <div className="stat-bar" style={{ background: color }} />
      </TiltCard>
    </motion.div>
  );
}

// ─── Fact Card with Flip ──────────────────────────────────────────────────────
function FactCard({ emoji, title, teaser, reveal, accentColor, bgVideo, delay }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="fact-wrapper"
    >
      <div
        className={`fact-flipper ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front */}
        <div className="fact-face fact-front">
          {bgVideo && (
            <video
              src={bgVideo}
              autoPlay loop muted playsInline
              className="fact-video"
            />
          )}
          <div className="fact-overlay" style={{ background: `linear-gradient(135deg, ${accentColor}33, #0a0a1a99)` }} />
          <div className="fact-content">
            <span className="fact-emoji">{emoji}</span>
            <h3 className="fact-title">{title}</h3>
            <p className="fact-teaser">{teaser}</p>
            <span className="fact-cta">Tap to reveal ✦</span>
          </div>
        </div>
        {/* Back */}
        <div className="fact-face fact-back" style={{ background: `linear-gradient(135deg, ${accentColor}cc, #0a0a1a)` }}>
          <div className="fact-back-content">
            <span className="fact-emoji">{emoji}</span>
            <p className="fact-reveal">{reveal}</p>
            <span className="fact-cta back">Tap to flip back ↩</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="particles">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FunFactsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["0px", "-40px"]);

  const stats = [
    { icon: "☀️", target: 99, suffix: "%", label: "Solar System mass held by the Sun", color: "#FFD166", delay: 0 },
    { icon: "🪐", target: 8, suffix: "", label: "Planets in our Solar System", color: "#06D6A0", delay: 0.1 },
    { icon: "🚀", target: 1969, suffix: "", label: "Year of the first Moon landing", color: "#118AB2", delay: 0.2 },
    { icon: "💫", target: 200, suffix: "B+", label: "Stars in the Milky Way alone", color: "#EF476F", delay: 0.3 },
    { icon: "🌌", target: 2, suffix: "T+", label: "Galaxies in the observable universe", color: "#a855f7", delay: 0.4 },
    { icon: "⚡", target: 299792, suffix: " km/s", label: "Speed of light", color: "#f97316", delay: 0.5 },
  ];

  const facts = [
    {
      emoji: "🌞",
      title: "The Sun's Dominance",
      teaser: "One star holds almost everything.",
      reveal: "The Sun contains 99.86% of the entire Solar System's mass. All the planets, moons, asteroids, and comets combined account for just 0.14%.",
      accentColor: "#FFD166",
      bgVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
      delay: 0,
    },
    {
      emoji: "🔇",
      title: "Cosmic Silence",
      teaser: "No one can hear you scream — literally.",
      reveal: "Space is an almost perfect vacuum. With no medium for sound waves to travel through, the universe is profoundly silent — no explosion, no rocket, nothing.",
      accentColor: "#8B5CF6",
      bgVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
      delay: 0.1,
    },
    {
      emoji: "🪐",
      title: "Jupiter the Giant",
      teaser: "It could swallow all the others.",
      reveal: "Jupiter is so massive that all the other planets in the Solar System could fit inside it — with room to spare. Over 1,300 Earths fit within its volume.",
      accentColor: "#EF476F",
      bgVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
      delay: 0.2,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .space-section {
          position: relative;
          min-height: 100vh;
          background: #04040f;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          padding: 100px 24px;
        }

        .space-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 10%, #1a103399 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, #0e1f3b88 0%, transparent 60%),
            radial-gradient(ellipse 100% 60% at 50% 50%, #060614 0%, #04040f 100%);
          z-index: 0;
        }

        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .nebula-1 {
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          background: radial-gradient(circle, #4f23ff22 0%, transparent 70%);
        }
        .nebula-2 {
          width: 500px; height: 500px;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, #ff234f22 0%, transparent 70%);
        }
        .nebula-3 {
          width: 400px; height: 400px;
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #23ffb422 0%, transparent 70%);
        }

        .particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
        .particle { position: absolute; border-radius: 50%; background: #fff; }

        .section-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a0aabf;
          margin-bottom: 24px;
        }

        .section-headline {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #a0b4ff 50%, #ff6bdf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 1.1rem;
          color: #7a8aa0;
          max-width: 500px;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 72px;
        }

        /* ── Stats Grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 80px;
        }

        .stat-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px 28px;
          overflow: hidden;
          cursor: default;
          transition: border-color 0.3s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.18); }

        .tilt-glare {
          position: absolute; inset: 0; border-radius: inherit;
          pointer-events: none; z-index: 1;
        }

        .stat-icon { font-size: 2rem; margin-bottom: 12px; }
        .stat-number { display: block; font-family: 'Orbitron', monospace; font-size: 2.2rem; font-weight: 700; margin-bottom: 8px; }
        .counter-value { font-family: 'Orbitron', monospace; font-size: 2.2rem; font-weight: 700; }
        .stat-label { font-size: 0.85rem; color: #6b7a90; line-height: 1.5; }
        .stat-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 0 0 20px 20px;
          opacity: 0.6;
        }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 56px;
          color: #3a4560;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06);
        }

        /* ── Fact Cards ── */
        .facts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 80px;
        }

        .fact-wrapper { perspective: 1000px; height: 320px; }

        .fact-flipper {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
          cursor: pointer;
          border-radius: 20px;
        }
        .fact-flipper.flipped { transform: rotateY(180deg); }

        .fact-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .fact-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.2;
        }

        .fact-overlay {
          position: absolute; inset: 0;
          z-index: 1;
        }

        .fact-content {
          position: relative; z-index: 2;
          padding: 32px;
          height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end;
        }

        .fact-emoji { font-size: 2.5rem; margin-bottom: 12px; display: block; }
        .fact-title { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .fact-teaser { font-size: 0.9rem; color: #a0b0c0; line-height: 1.6; margin-bottom: 16px; }
        .fact-cta {
          display: inline-block;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 100px;
        }
        .fact-cta.back { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.3); }

        .fact-back { transform: rotateY(180deg); }
        .fact-back-content {
          padding: 32px;
          height: 100%;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          text-align: center; gap: 20px;
        }
        .fact-reveal { font-size: 1rem; line-height: 1.8; color: rgba(255,255,255,0.9); }

        /* ── Image Gallery ── */
        .gallery-label {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 32px;
          color: #fff;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 200px 200px;
          gap: 12px;
          margin-bottom: 80px;
          border-radius: 24px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(3, 180px);
          }
          .gallery-item-main { grid-column: 1 / -1; }
        }

        .gallery-item {
          overflow: hidden;
          position: relative;
          background: #0d0d20;
        }

        .gallery-item-main { grid-row: 1 / 3; }

        .gallery-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease, filter 0.6s ease;
          filter: brightness(0.8) saturate(1.2);
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.07);
          filter: brightness(1) saturate(1.4);
        }

        .gallery-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.05em;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .gallery-item:hover .gallery-caption { opacity: 1; }

        /* ── Video Feature ── */
        .video-feature {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 80px;
        }

        .video-main {
          width: 100%; max-height: 420px;
          object-fit: cover;
          display: block;
          filter: brightness(0.7) saturate(1.3);
        }

        .video-overlay-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 40px;
          background: linear-gradient(transparent, rgba(4,4,15,0.9));
        }

        .video-badge {
          display: inline-block;
          background: rgba(239,71,111,0.3);
          border: 1px solid rgba(239,71,111,0.5);
          color: #ef476f;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 12px;
        }
        .video-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .video-desc { font-size: 0.9rem; color: #7a8aa0; max-width: 500px; }

        /* ── Footer Quote ── */
        .space-quote {
          text-align: center;
          padding: 60px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .quote-text {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          color: #7a8aa0;
          max-width: 700px;
          margin: 0 auto 16px;
          line-height: 1.7;
        }
        .quote-author {
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a4560;
        }

        @media (max-width: 640px) {
          .space-section { padding: 70px 16px; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .facts-grid { grid-template-columns: 1fr; }
          .gallery-grid { grid-template-columns: 1fr; grid-template-rows: repeat(5, 180px); }
          .gallery-item-main { grid-row: auto; }
        }
      `}</style>

      <section className="space-section" ref={sectionRef}>
        {/* Background */}
        <div className="space-bg" />
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <Particles />

        <div className="section-content">
          {/* Header */}
          <motion.div style={{ y: titleY }}>
            <motion.div
              className="badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>✦</span> Cosmic Knowledge Base
            </motion.div>

            <motion.h2
              className="section-headline"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Mind-Bending<br />Space Facts
            </motion.h2>

            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The universe is stranger, bigger, and more beautiful than you can imagine. Explore the numbers that redefine scale.
            </motion.p>
          </motion.div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          {/* ── Divider ── */}
          <motion.div
            className="divider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Did You Know?
          </motion.div>

          {/* ── Fact Cards ── */}
          <div className="facts-grid">
            {facts.map((f, i) => (
              <FactCard key={i} {...f} />
            ))}
          </div>

          {/* ── Video Feature ── */}
          <motion.div
            className="video-feature"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              className="video-main"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              autoPlay loop muted playsInline
            />
            <div className="video-overlay-content">
              <div className="video-badge">🎬 Featured</div>
              <h3 className="video-title">Journey Through the Cosmos</h3>
              <p className="video-desc">
                A visual exploration of the universe — from our solar system to the furthest reaches of observable space.
              </p>
            </div>
          </motion.div>

          {/* ── Image Gallery ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="gallery-label">✦ The Universe in Images</h3>
            <div className="gallery-grid">
              {[
                { src: "https://images.nasa.gov/image/hubble-ultra-deep-field/hubble-ultra-deep-field~orig.jpg", caption: "Hubble Ultra Deep Field", main: true },
                { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg", caption: "Earth from Apollo 17" },
                { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Culinary_fruits_front_view.jpg/800px-Culinary_fruits_front_view.jpg", caption: "Solar Nebula (simulated)" },
                { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NGC_4414_%28NASA-med%29.jpg/800px-NGC_4414_%28NASA-med%29.jpg", caption: "NGC 4414 Galaxy" },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`gallery-item ${img.main ? "gallery-item-main" : ""}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="gallery-img"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/space${i}/800/500`;
                    }}
                  />
                  <div className="gallery-caption">{img.caption}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Quote ── */}
          <motion.div
            className="space-quote"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="quote-text">
              "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."
            </p>
            <p className="quote-author">— Carl Sagan</p>
          </motion.div>

        </div>
      </section>
    </>
  );
}