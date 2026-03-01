import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TIMELINE = [
  { year:"1957", title:"Sputnik 1 Launched", desc:"The Soviet Union launches the world's first artificial satellite, kicking off the Space Age.", icon:"🛰️", color:"#a78bfa" },
  { year:"1961", title:"First Human in Space", desc:"Yuri Gagarin orbits Earth aboard Vostok 1 — humankind leaves the atmosphere for the first time.", icon:"👨‍🚀", color:"#38bdf8" },
  { year:"1969", title:"Moon Landing", desc:"Apollo 11 touches down on the lunar surface. Neil Armstrong takes humanity's first steps on another world.", icon:"🌕", color:"#fbbf24" },
  { year:"1977", title:"Voyager 1 & 2 Launch", desc:"Twin probes begin their grand tour of the outer planets, now the most distant human-made objects.", icon:"🚀", color:"#f472b6" },
  { year:"1990", title:"Hubble Space Telescope", desc:"Hubble is deployed, transforming our view of the universe with millions of breathtaking deep-field images.", icon:"🔭", color:"#34d399" },
  { year:"2021", title:"James Webb Telescope", desc:"The most powerful space telescope ever built launches, peering back to the universe's first light.", icon:"🌌", color:"#fb923c" },
];

/* ── TL2_ prefix: avoids variable & classname conflicts with other sections ── */
const TL2_STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`tl2-item ${isLeft ? "tl2-left" : "tl2-right"}`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="tl2-card" style={{ borderColor: `${item.color}30` }}>
        <div className="tl2-card-glow" style={{ background: `radial-gradient(circle at 50% 0%,${item.color}12,transparent 70%)` }} />
        <div className="tl2-icon-row">
          <span className="tl2-icon">{item.icon}</span>
          <span className="tl2-year" style={{ color: item.color }}>{item.year}</span>
        </div>
        <h3 className="tl2-title">{item.title}</h3>
        <p className="tl2-desc">{item.desc}</p>
        <div className="tl2-bar" style={{ background: `linear-gradient(90deg,${item.color},transparent)` }} />
      </div>
      <motion.div
        className="tl2-node"
        style={{ background: item.color, boxShadow: `0 0 20px ${item.color},0 0 40px ${item.color}50` }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
      />
    </motion.div>
  );
}

export default function SpaceTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=JetBrains+Mono:wght@300;400&display=swap');

        .tl2-root {
          position: relative;
          background: linear-gradient(180deg, #000, #06001a, #000);
          color: #fff;
          padding: 120px 0;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        /* ── Stars ── */
        .tl2-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .tl2-star {
          position: absolute; border-radius: 50%; background: #fff;
          animation: tl2-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes tl2-tw {
          from { opacity: 0.04; transform: scale(0.5); }
          to   { opacity: 0.9;  transform: scale(1.5); }
        }

        /* ── Nebula ── */
        .tl2-neb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(90px); opacity: 0.1;
          animation: tl2-np var(--dur) ease-in-out infinite alternate;
        }
        @keyframes tl2-np {
          from { transform: scale(1); }
          to   { transform: scale(1.2); }
        }

        /* ── Glow lines ── */
        .tl2-glow {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #a78bfa, #38bdf8, transparent);
          background-size: 200% 100%;
          animation: tl2-gs 6s linear infinite;
        }
        .tl2-glow.top { top: 0; }
        .tl2-glow.bot { bottom: 0; animation-delay: -3s; }
        @keyframes tl2-gs {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Inner ── */
        .tl2-inner { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 32px; }

        /* ── Eyebrow ── */
        .tl2-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 18px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.35);
          background: rgba(109,40,217,0.1);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; color: #a78bfa;
          margin-bottom: 22px;
        }
        .tl2-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          animation: tl2-blink 1.4s ease-in-out infinite;
        }
        @keyframes tl2-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }

        /* ── Heading ── */
        .tl2-title-main {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 900; line-height: 1.05;
          color: #f0e6ff;
          text-shadow: 0 0 40px rgba(139,92,246,0.3);
        }
        .tl2-acc {
          background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tl2-sub {
          margin-top: 14px; font-size: 1rem; font-weight: 300;
          color: rgba(196,181,253,0.5); line-height: 1.7;
          max-width: 500px; margin-left: auto; margin-right: auto;
        }
        .tl2-divider {
          width: 80px; height: 1px;
          margin: 28px auto 60px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
        }

        /* ── Track ── */
        .tl2-track { position: relative; padding: 20px 0; }
        .tl2-spine {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), rgba(139,92,246,0.4), transparent);
          transform: translateX(-50%); z-index: 0;
        }
        @media (max-width: 760px) { .tl2-spine { left: 20px; } }

        /* ── Item ── */
        .tl2-item { display: flex; align-items: center; gap: 40px; margin-bottom: 60px; position: relative; z-index: 1; }
        .tl2-left  { flex-direction: row; }
        .tl2-right { flex-direction: row-reverse; }
        @media (max-width: 760px) {
          .tl2-item, .tl2-left, .tl2-right { flex-direction: row; padding-left: 52px; }
        }

        /* ── Card ── */
        .tl2-card {
          flex: 0 0 calc(50% - 60px);
          background: rgba(6,2,22,0.9);
          border: 1px solid;
          border-radius: 18px;
          padding: 24px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s;
        }
        .tl2-card:hover { border-color: rgba(139,92,246,0.4); }
        @media (max-width: 760px) { .tl2-card { flex: 1; } }

        .tl2-card-glow { position: absolute; inset: 0; pointer-events: none; }
        .tl2-icon-row  { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .tl2-icon  { font-size: 1.8rem; }
        .tl2-year  { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 900; letter-spacing: 0.06em; }
        .tl2-title { font-family: 'Orbitron', monospace; font-size: 0.95rem; font-weight: 700; color: #f0e6ff; letter-spacing: 0.05em; margin-bottom: 8px; }
        .tl2-desc  { font-size: 0.82rem; color: rgba(196,181,253,0.5); line-height: 1.65; font-weight: 300; }
        .tl2-bar   { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; }

        /* ── Node ── */
        .tl2-node {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 14px; height: 14px; border-radius: 50%; z-index: 3;
        }
        @media (max-width: 760px) { .tl2-node { left: 20px; transform: translateX(-50%); } }

        @media (max-width: 640px) { .tl2-inner { padding: 0 16px; } }
      `}</style>

      <section className="tl2-root" ref={ref}>

        {/* Stars — using TL2_STARS */}
        <div className="tl2-stars">
          {TL2_STARS.map(s => (
            <div
              key={s.id}
              className="tl2-star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.r,
                height: s.r,
                "--dur": `${s.dur}s`,
                "--del": `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula */}
        <div className="tl2-neb" style={{ width: 500, height: 500, background: "radial-gradient(circle,#7c3aed,transparent)", top: "-100px", right: "-100px", "--dur": "10s" }} />
        <div className="tl2-neb" style={{ width: 400, height: 400, background: "radial-gradient(circle,#38bdf8,transparent)", bottom: "-80px", left: "-80px", "--dur": "13s" }} />

        {/* Glow lines */}
        <div className="tl2-glow top" />
        <div className="tl2-glow bot" />

        <div className="tl2-inner">

          {/* Header */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="tl2-eyebrow">
              <div className="tl2-eyebrow-dot" />
              HISTORY OF EXPLORATION
            </div>
            <h2 className="tl2-title-main">
              Space <span className="tl2-acc">Timeline</span>
            </h2>
            <p className="tl2-sub">
              From the first satellite to the James Webb telescope — the milestones that defined our journey to the stars.
            </p>
            <div className="tl2-divider" />
          </motion.div>

          {/* Timeline */}
          <div className="tl2-track">
            <div className="tl2-spine" />
            {TIMELINE.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}