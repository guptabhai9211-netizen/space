"use client";

import { useEffect, useRef, useState } from "react";

const missions = [
  {
    year: "1957",
    title: "First satellite Sputnik (USSR)",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80",
    color: "#4a9eff",
  },
  {
    year: "1958",
    title: "NASA programme established (USA)",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&q=80",
    color: "#6eb5ff",
  },
  {
    year: "1961",
    title: "First Human in Space – Yuri Gagarin (USSR)",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80",
    color: "#ff6b6b",
  },
  {
    year: "1966",
    title: "First probe on Moon – Luna 9 (USSR)",
    image: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=400&q=80",
    color: "#c0c0c0",
  },
  {
    year: "1969",
    title: "First Humans on Moon – Apollo 11 (USA)",
    image: "https://images.unsplash.com/photo-1541873676-a18131494184?w=400&q=80",
    color: "#ffd700",
  },
  {
    year: "1975",
    title: "First probe on Venus – Venera 7 (USSR)",
    image: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=400&q=80",
    color: "#ffaa44",
  },
  {
    year: "1977",
    title: "Voyager 1 & 2 are launched (USA)",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&q=80",
    color: "#7bc8ff",
  },
  {
    year: "1981",
    title: "First reusable space shuttle (USA)",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80",
    color: "#ff8c42",
  },
  {
    year: "1995",
    title: "First Probe on Jupiter – Galileo (USA)",
    image: "https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=400&q=80",
    color: "#d4a574",
  },
  {
    year: "1998",
    title: "International Space Station (ISS)",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    color: "#88ccff",
  },
  {
    year: "2014",
    title: "First soft landing on comet – Rosseta (ESA)",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=400&q=80",
    color: "#aaaaaa",
  },
  {
    year: "2015",
    title: "First reusable rocket – Falcon 9 (SpaceX)",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&q=80",
    color: "#ffffff",
  },
  {
    year: "2020s",
    title: "First Humans on Mars – ITS Mission (SpaceX)",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&q=80",
    color: "#ff4500",
  },
];

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
    }));

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.a += s.speed;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function MissionCard({ mission, index, isVisible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered
          ? "linear-gradient(135deg, rgba(74,158,255,0.15) 0%, rgba(20,30,70,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(10,15,40,0.9) 100%)",
        border: `1px solid ${hovered ? mission.color + "60" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: "22px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: isVisible
          ? hovered
            ? "translateY(-12px) scale(1.04)"
            : "translateY(0) scale(1)"
          : "translateY(60px) scale(0.9)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 80}ms`,
        boxShadow: hovered
          ? `0 20px 60px ${mission.color}30, 0 0 0 1px ${mission.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
          : "0 4px 20px rgba(0,0,0,0.4)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${mission.color}25 0%, transparent 70%)`,
          transition: "all 0.4s ease",
          transform: hovered ? "scale(1.5)" : "scale(1)",
          pointerEvents: "none",
        }}
      />

      {/* Year */}
      <div
        style={{
          fontFamily: "'Orbitron', 'Courier New', monospace",
          fontSize: "2rem",
          fontWeight: "700",
          color: hovered ? mission.color : "rgba(255,255,255,0.9)",
          transition: "color 0.3s ease",
          letterSpacing: "2px",
          lineHeight: 1,
        }}
      >
        {mission.year}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "0.85rem",
          color: "rgba(180,200,255,0.8)",
          lineHeight: "1.5",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "400",
        }}
      >
        {mission.title}
      </div>

      {/* Image */}
      <div
        style={{
          flex: 1,
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid rgba(255,255,255,0.1)`,
          position: "relative",
          minHeight: "130px",
        }}
      >
        <img
          src={mission.image}
          alt={mission.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "brightness(1.1) saturate(1.2)" : "brightness(0.8) saturate(0.9)",
            transition: "all 0.4s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            minHeight: "130px",
          }}
        />
        {/* Image overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? `linear-gradient(to top, ${mission.color}20 0%, transparent 60%)`
              : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
            transition: "all 0.4s ease",
          }}
        />
      </div>

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: hovered ? "100%" : "30%",
          height: "2px",
          background: `linear-gradient(90deg, ${mission.color}80, transparent)`,
          transition: "width 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          borderRadius: "0 0 0 20px",
        }}
      />
    </div>
  );
}

export default function MissionSection() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, i]));
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
      obs.observe(ref);
      return obs;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const rows = [];
  for (let i = 0; i < missions.length; i += 3) {
    rows.push(missions.slice(i, i + 3));
  }

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050a1a; }
        ::-webkit-scrollbar-thumb { background: #1a3a6a; border-radius: 3px; }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 900px) {
          .mission-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .mission-grid { grid-template-columns: 1fr; }
        }

        .floating-orb {
          animation: float 8s ease-in-out infinite;
        }
        .floating-orb-2 {
          animation: float 12s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes timeline-line {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes title-reveal {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
            filter: blur(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0px); 
            filter: blur(0px);
          }
        }

        .title-anim {
          animation: title-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .title-anim-2 {
          animation: title-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s both;
        }
        .title-anim-3 {
          animation: title-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both;
        }

        @keyframes shimmer {
          from { background-position: -200% center; }
          to { background-position: 200% center; }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #4a9eff, #ffffff, #4a9eff, #7bc8ff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .row-divider {
          position: relative;
          display: flex;
          align-items: center;
          margin: 20px 0;
        }

        .row-divider::before {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,158,255,0.5), rgba(74,158,255,0.2), transparent);
        }

        .dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4a9eff;
          margin: 0 12px;
          animation: pulse-glow 2s ease-in-out infinite;
          box-shadow: 0 0 10px #4a9eff;
        }

        .row-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,158,255,0.2), rgba(74,158,255,0.5), transparent);
        }
      `}</style>

      <div
        ref={sectionRef}
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #020818 0%, #050d2a 30%, #04091f 70%, #020a1a 100%)",
          minHeight: "100vh",
          padding: "100px 0",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <StarField />

        {/* Ambient orbs */}
        <div
          className="floating-orb"
          style={{
            position: "absolute",
            top: "10%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,158,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          className="floating-orb-2"
          style={{
            position: "absolute",
            bottom: "20%",
            right: "-5%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,69,0,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,158,255,0.03) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 40px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div
              className="title-anim"
              style={{
                display: "inline-block",
                background: "rgba(74,158,255,0.1)",
                border: "1px solid rgba(74,158,255,0.3)",
                borderRadius: "30px",
                padding: "8px 24px",
                fontSize: "0.8rem",
                letterSpacing: "4px",
                color: "#4a9eff",
                textTransform: "uppercase",
                fontFamily: "'Orbitron', monospace",
                marginBottom: "24px",
              }}
            >
              Yearly Mission Log
            </div>

            <h2
              className="title-anim-2 shimmer-text"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: "900",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              OUR MISSION
            </h2>

            <h3
              className="title-anim-2"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                fontWeight: "400",
                color: "rgba(150,180,255,0.7)",
                letterSpacing: "6px",
                marginBottom: "28px",
              }}
            >
              THROUGH THE COSMOS
            </h3>

            <p
              className="title-anim-3"
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                color: "rgba(150,180,220,0.7)",
                fontSize: "1rem",
                lineHeight: "1.8",
                fontWeight: "300",
              }}
            >
              From Sputnik's first beep to humanity's journey to Mars — explore the milestones that
              define our relentless quest to reach beyond the stars.
            </p>

            {/* Decorative line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginTop: "40px",
              }}
            >
              <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, transparent, #4a9eff)" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4a9eff", boxShadow: "0 0 12px #4a9eff" }} />
              <div style={{ width: "30px", height: "1px", background: "#4a9eff" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 20px #4a9eff" }} />
              <div style={{ width: "30px", height: "1px", background: "#4a9eff" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4a9eff", boxShadow: "0 0 12px #4a9eff" }} />
              <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, #4a9eff, transparent)" }} />
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginBottom: "60px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                color: "rgba(150,180,255,0.5)",
                fontSize: "0.7rem",
                letterSpacing: "2px",
                fontFamily: "'Orbitron', monospace",
              }}
            >
              <span>1957</span>
              <span style={{ color: "#4a9eff" }}>TIMELINE PROGRESS</span>
              <span>2020s</span>
            </div>
            <div
              style={{
                height: "2px",
                background: "rgba(74,158,255,0.15)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "linear-gradient(90deg, #4a9eff, #7bc8ff, #fff)",
                  borderRadius: "2px",
                  transition: "width 0.1s ease",
                  boxShadow: "0 0 10px #4a9eff",
                }}
              />
            </div>
          </div>

          {/* Mission Cards in rows of 3 */}
          {rows.map((row, rowIdx) => {
            const startIdx = rowIdx * 3;
            return (
              <div key={rowIdx}>
                {rowIdx > 0 && (
                  <div className="row-divider">
                    <div className="dot-pulse" />
                  </div>
                )}
                <div className="mission-grid">
                  {row.map((mission, cardIdx) => {
                    const globalIdx = startIdx + cardIdx;
                    return (
                      <div
                        key={globalIdx}
                        ref={(el) => (cardRefs.current[globalIdx] = el)}
                      >
                        <MissionCard
                          mission={mission}
                          index={cardIdx}
                          isVisible={visibleCards.has(globalIdx)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom CTA */}
          <div
            style={{
              textAlign: "center",
              marginTop: "80px",
              padding: "60px 40px",
              background: "linear-gradient(135deg, rgba(74,158,255,0.05) 0%, rgba(10,20,60,0.6) 100%)",
              border: "1px solid rgba(74,158,255,0.15)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                fontWeight: "700",
                color: "white",
                marginBottom: "16px",
              }}
            >
              What's <span style={{ color: "#4a9eff" }}>Next?</span>
            </div>
            <p
              style={{
                color: "rgba(150,180,220,0.7)",
                fontSize: "1rem",
                maxWidth: "500px",
                margin: "0 auto 32px",
                lineHeight: "1.7",
              }}
            >
              The universe is vast and our mission continues. Join us as we push the boundaries of
              human exploration beyond the stars.
            </p>
            <button
              onMouseEnter={(e) => {
                e.target.style.background = "#4a9eff";
                e.target.style.color = "#000";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 40px rgba(74,158,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#4a9eff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
              style={{
                background: "transparent",
                border: "2px solid #4a9eff",
                borderRadius: "50px",
                padding: "14px 40px",
                color: "#4a9eff",
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.85rem",
                letterSpacing: "3px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              EXPLORE MISSION →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}