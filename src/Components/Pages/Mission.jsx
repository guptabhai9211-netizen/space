 "use client";

import { useEffect, useRef, useState, useCallback } from "react";

const missions = [
  {
    year: "1957",
    title: "In 1957, the Soviet Union launched history's first artificial satellite, Sputnik 1, on October 4, 1957. This marked the beginning of the Space Age. Laika, a dog, was subsequently sent into space by Sputnik 2 on November 3, 1957.",
    image: "https://images.tv9hindi.com/wp-content/uploads/2023/11/lyca-first-dog-to-flight-in-space.jpg",
    color: "#4a9eff",
    tag: "SATELLITE",
    fact: "Sputnik completed an orbit every 96 minutes",
  },
  {
    year: "1958",
    title: "Explorer 1 became the first successful US satellite on January 31, 1958. NASA was founded on July 29, 1958. SCORE, the first communications satellite, was also launched this year — marking America's bold entry into the space race.",
    image: "https://images.tv9hindi.com/wp-content/uploads/2023/08/whatsapp-image-2023-08-22-at-17.27.57.jpeg",
    color: "#6eb5ff",
    tag: "NASA FOUNDED",
    fact: "Explorer 1 discovered the Van Allen radiation belts",
  },
  {
    year: "1961",
    title: "Yuri Gagarin became the first human to orbit Earth aboard Vostok 1 on April 12, 1961. Alan Shepard followed with the Freedom 7 mission on May 5, 1961, becoming the first American in space.",
    image: "https://cf-img-a-in.tosshub.com/lingo/gnt/images/story/202304/yuri_gagarin_photo_twitter-sixteen_nine.jpg?size=948:533",
    color: "#ff6b6b",
    tag: "FIRST HUMAN",
    fact: "Gagarin's flight lasted 108 minutes",
  },
  {
    year: "1966",
    title: "Gemini 8 launched on March 16, 1966 with Neil Armstrong and David Scott. It achieved the first docking of two spacecraft in orbit when it connected with an unmanned Agena Target Vehicle — a historic milestone in space rendezvous.",
    image: "https://resize.indiatv.in/resize/newbucket/1200_-/2019/07/d-2jianwsaaihxw-1563587711.jpg",
    color: "#c0c0c0",
    tag: "FIRST DOCKING",
    fact: "Gemini 8 completed the first orbital docking in history",
  },
  {
    year: "1969",
    title: "Apollo 11 took humans to the Moon for the first time. Neil Armstrong and Buzz Aldrin walked on the lunar surface on July 20, 1969, while Michael Collins orbited above. Armstrong's words — 'one small step for man' — echoed across history.",
    image: "https://cf-img-a-in.tosshub.com/lingo/gnt/images/story/202207/copy_of_chhathh_12-sixteen_nine.jpg?size=948:533",
    color: "#ffd700",
    tag: "MOON LANDING",
    fact: "Armstrong and Aldrin spent 21 hours on the Moon",
  },
  {
    year: "1975",
    title: "India's first satellite Aryabhata launched April 19. The Apollo-Soyuz mission (July 15–24) symbolized Cold War détente. NASA's Viking 1 & 2 targeted Mars while Soviet Venera 9 & 10 reached Venus in a banner year for space diplomacy.",
    image: "https://static01.nyt.com/images/2025/07/15/multimedia/15HS-sci-apollo-soyuz-01-fglm/15HS-sci-apollo-soyuz-01-fglm-videoSixteenByNine3000.jpg",
    color: "#ffaa44",
    tag: "INTERNATIONAL",
    fact: "Apollo-Soyuz was the first US–Soviet joint mission",
  },
  {
    year: "1977",
    title: "NASA launched Voyager 1 and Voyager 2 to study Jupiter and Saturn. These probes are still active today — Voyager 1 has crossed interstellar space, becoming the farthest human-made object ever created, over 23 billion km from Earth.",
    image: "https://ychef.files.bbci.co.uk/1280x720/p05cpd0y.jpg",
    color: "#7bc8ff",
    tag: "DEEP SPACE",
    fact: "Voyager 1 left the solar system in 2012",
  },
  {
    year: "1981",
    title: "STS-1 (Space Shuttle Columbia) flew April 12–14, 1981 — the first reusable spacecraft ever flown in history. Piloted by John Young and Robert Crippen, it opened an era of routine access to orbit that would last 30 years.",
    image: "https://i.ytimg.com/vi/SS7MNPWES-E/maxresdefault.jpg",
    color: "#ff8c42",
    tag: "SPACE SHUTTLE",
    fact: "Columbia made 27 flights before its tragic loss in 2003",
  },
  {
    year: "1995",
    title: "The Hubble Space Telescope delivered its most iconic images after a 1993 repair mission. 1995 saw the famous 'Pillars of Creation' photograph — a stunning portrait of stellar nurseries 6,500 light-years away that changed astronomy forever.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqrWqb2JPzZmXE8L8EI3xPt3JqjVl_O-C7A&s",
    color: "#d4a574",
    tag: "HUBBLE",
    fact: "Hubble has made over 1.5 million observations",
  },
  {
    year: "1998",
    title: "Space Shuttle Endeavour (STS-88) launched December 4, 1998, delivering the Unity node to begin construction of the International Space Station. The ISS would go on to host continuous human habitation from November 2000.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyZUgdVUBTilISAjrJsT9Ga2hrwBMfVR4cpg&s",
    color: "#88ccff",
    tag: "ISS",
    fact: "The ISS orbits Earth 16 times every day",
  },
  {
    year: "2014",
    title: "ISRO made history placing Mangalyaan in Mars orbit on a shoestring budget — the cheapest interplanetary mission ever. ESA's Rosetta mission landed the Philae probe on a comet. NASA's Orion test flight paved the way for deep space human missions.",
    image: "https://spacedoutclassroom.com/wp-content/uploads/2021/08/mars-global-surveyor-art-s.jpg",
    color: "#aaaaaa",
    tag: "ISRO / MARS",
    fact: "Mangalyaan cost less than making the movie Gravity",
  },
  {
    year: "2015",
    title: "NASA's New Horizons mission flew past Pluto on July 14, 2015, revealing heart-shaped nitrogen plains and towering ice mountains for the first time. ISRO launched AstroSat, India's first multi-wavelength space observatory.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&q=80",
    color: "#ffffff",
    tag: "PLUTO",
    fact: "New Horizons took 9.5 years to reach Pluto",
  },
  {
    year: "2020s",
    title: "James Webb Space Telescope delivered its first breathtaking deep-field images in 2022, peering back 13 billion years. Artemis I circled the Moon. SpaceX's Starship test flights pushed reusable heavy-lift rockets toward Mars.",
    image: "https://www.mysphere.net/wp-content/uploads/2021/10/satellite-g3a9954e24_640.jpg",
    color: "#ff4500",
    tag: "WEBB / ARTEMIS",
    fact: "JWST orbits 1.5 million km from Earth at L2",
  },
];

const stats = [
  { value: "66+", label: "Years of Exploration", icon: "🚀" },
  { value: "600+", label: "Humans in Space", icon: "👨‍🚀" },
  { value: "5", label: "Planets Visited", icon: "🪐" },
  { value: "∞", label: "Discoveries Made", icon: "🔭" },
];

const futureMs = [
  { year: "2026", title: "Artemis III Moon Landing", desc: "First crewed lunar landing since Apollo 17 in 1972. NASA plans to land the first woman on the Moon.", color: "#4a9eff", icon: "🌙" },
  { year: "2028", title: "Lunar Gateway Station", desc: "A small space station in lunar orbit to serve as a staging point for Moon and Mars missions.", color: "#ffd700", icon: "🛸" },
  { year: "2030s", title: "Humans on Mars", desc: "SpaceX and NASA both target crewed Mars missions. The red planet awaits its first human footprint.", color: "#ff6b6b", icon: "🔴" },
  { year: "2040s+", title: "Interstellar Probes", desc: "Laser-propelled nanosailcraft targeting Alpha Centauri at 20% the speed of light — Breakthrough Starshot.", color: "#7bc8ff", icon: "⭐" },
];

// ───────────────────────── Star Field ─────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.2, a: Math.random(), speed: Math.random() * 0.004 + 0.001,
    }));
    const shoots = Array.from({ length: 6 }, () => ({ x: -100, y: -100, vx: 0, vy: 0, life: 0, maxLife: 0 }));
    let animId;
    const spawnShoot = (s) => {
      s.x = Math.random() * canvas.width;
      s.y = Math.random() * canvas.height * 0.5;
      const angle = (Math.random() * 30 + 20) * Math.PI / 180;
      const speed = Math.random() * 10 + 7;
      s.vx = Math.cos(angle) * speed; s.vy = Math.sin(angle) * speed;
      s.life = 0; s.maxLife = Math.random() * 70 + 50;
    };
    shoots.forEach((s, i) => { s.life = -Math.random() * 200 - i * 80; s.maxLife = 1; });
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.a += s.speed;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.a));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`; ctx.fill();
      });
      shoots.forEach((s) => {
        s.life++;
        if (s.life < 0) return;
        if (s.life > s.maxLife) { spawnShoot(s); return; }
        const p = s.life / s.maxLife;
        const alpha = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
        ctx.beginPath();
        ctx.moveTo(s.x + s.vx * s.life, s.y + s.vy * s.life);
        ctx.lineTo(s.x + s.vx * s.life - s.vx * 15, s.y + s.vy * s.life - s.vy * 15);
        const grad = ctx.createLinearGradient(
          s.x + s.vx * s.life, s.y + s.vy * s.life,
          s.x + s.vx * s.life - s.vx * 15, s.y + s.vy * s.life - s.vy * 15
        );
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, `rgba(150,200,255,0)`);
        ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ───────────────────────── Nebula BG ─────────────────────────
function NebulaBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: "70%", height: "70%",
        background: "radial-gradient(ellipse, rgba(74,158,255,0.09) 0%, transparent 65%)",
        animation: "nebulaDrift1 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%",
        background: "radial-gradient(ellipse, rgba(255,69,0,0.07) 0%, transparent 65%)",
        animation: "nebulaDrift2 25s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "30%", right: "20%", width: "45%", height: "45%",
        background: "radial-gradient(ellipse, rgba(123,200,255,0.05) 0%, transparent 65%)",
        animation: "nebulaDrift3 18s ease-in-out infinite",
      }} />
    </div>
  );
}

// ───────────────────────── Particle Burst (on card click) ─────────────────────────
function ParticleBurst({ color, active }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "24px", zIndex: 10 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 6, height: 6,
          borderRadius: "50%",
          background: color,
          animation: `burst${i % 4} 0.6s ease-out forwards`,
          transform: `rotate(${i * 30}deg)`,
        }} />
      ))}
    </div>
  );
}

// ───────────────────────── Mission Card (BIGGER + BETTER) ─────────────────────────
function MissionCard({ mission, index, isVisible }) {
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleClick = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    setFlipped(f => !f);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        perspective: "1400px",
        cursor: "pointer",
        height: "520px", // fixed tall height
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(100px) scale(0.85)",
        opacity: isVisible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 120}ms, opacity 0.8s ease ${index * 120}ms`,
      }}
      onClick={handleClick}
    >
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.75s cubic-bezier(0.23,1,0.32,1)",
        transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(6deg) rotateX(-4deg) scale(1.02)" : "rotateY(0deg) scale(1)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: hovered
            ? `linear-gradient(160deg, rgba(74,158,255,0.14) 0%, rgba(8,15,50,0.97) 100%)`
            : `linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(5,10,30,0.95) 100%)`,
          border: `1px solid ${hovered ? mission.color + "80" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "24px",
          display: "flex", flexDirection: "column",
          boxShadow: hovered
            ? `0 30px 80px ${mission.color}40, 0 0 0 1px ${mission.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 8px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          transition: "all 0.4s ease",
        }}>
          {/* Animated glow orb top-right */}
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: `radial-gradient(circle, ${mission.color}35 0%, transparent 70%)`,
            transform: hovered ? "scale(1.8)" : "scale(1)",
            transition: "transform 0.6s ease", pointerEvents: "none",
          }} />
          {/* Corner accent lines */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "40px", height: "40px",
            borderTop: `2px solid ${mission.color}60`, borderLeft: `2px solid ${mission.color}60`,
            borderRadius: "24px 0 0 0", opacity: hovered ? 1 : 0.3, transition: "opacity 0.4s",
          }} />
          <div style={{
            position: "absolute", bottom: 0, right: 0, width: "40px", height: "40px",
            borderBottom: `2px solid ${mission.color}60`, borderRight: `2px solid ${mission.color}60`,
            borderRadius: "0 0 24px 0", opacity: hovered ? 1 : 0.3, transition: "opacity 0.4s",
          }} />

          {/* ── IMAGE (large, top half) ── */}
          <div style={{
            width: "100%",
            height: "260px", // tall image area
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            borderRadius: "24px 24px 0 0",
          }}>
            <img
              src={mission.image}
              alt={mission.year}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                display: "block",
                filter: hovered ? "brightness(1.2) saturate(1.4) contrast(1.05)" : "brightness(0.7) saturate(0.75)",
                transform: hovered ? "scale(1.12)" : "scale(1.02)",
                transition: "all 0.7s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
            {/* Gradient overlay on image */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to bottom, transparent 30%, ${hovered ? mission.color + "25" : "rgba(5,10,30,0.75)"} 100%)`,
              transition: "all 0.5s ease",
            }} />
            {/* Tag badge over image */}
            <div style={{
              position: "absolute", top: "14px", left: "14px",
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: `rgba(5,10,30,0.75)`,
              border: `1px solid ${mission.color}60`,
              borderRadius: "20px", padding: "5px 12px",
              fontSize: "0.62rem", letterSpacing: "2.5px", color: mission.color,
              fontFamily: "'Orbitron', monospace",
              backdropFilter: "blur(8px)",
              boxShadow: `0 2px 12px ${mission.color}30`,
            }}>{mission.tag}</div>
            {/* Year over image bottom */}
            <div style={{
              position: "absolute", bottom: "12px", left: "16px",
              fontFamily: "'Orbitron', monospace", fontSize: "2.6rem", fontWeight: "900",
              color: hovered ? mission.color : "rgba(255,255,255,0.95)",
              textShadow: `0 2px 20px ${mission.color}80`,
              transition: "color 0.3s", lineHeight: 1,
            }}>{mission.year}</div>
            {/* Flip hint */}
            <div style={{
              position: "absolute", bottom: "14px", right: "14px",
              fontSize: "0.6rem", color: "rgba(255,255,255,0.45)",
              fontFamily: "'Orbitron', monospace",
              background: "rgba(0,0,0,0.4)", borderRadius: "8px",
              padding: "3px 8px", backdropFilter: "blur(4px)",
              opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
            }}>CLICK TO FLIP</div>
          </div>

          {/* ── TEXT AREA (bottom half) ── */}
          <div style={{
            flex: 1,
            padding: "20px 22px 22px",
            display: "flex", flexDirection: "column", gap: "10px",
          }}>
            {/* Description */}
            <p style={{
              fontSize: "0.83rem",
              color: hovered ? "rgba(210,230,255,0.9)" : "rgba(170,195,255,0.7)",
              lineHeight: "1.65",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.3s",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
            }}>{mission.title}</p>

            {/* Divider line animated */}
            <div style={{
              height: "1px",
              background: `linear-gradient(90deg, ${mission.color}70, transparent)`,
              width: hovered ? "100%" : "40%",
              transition: "width 0.5s cubic-bezier(0.23,1,0.32,1)",
              marginTop: "auto",
            }} />

            {/* Footer row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{
                fontSize: "0.65rem", color: `${mission.color}90`,
                fontFamily: "'Orbitron', monospace", letterSpacing: "1px",
              }}>MISSION LOG</div>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                border: `1px solid ${mission.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: mission.color, fontSize: "0.75rem",
                transform: hovered ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.4s ease",
              }}>↻</div>
            </div>
          </div>

          {/* Bottom glow bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0,
            width: hovered ? "100%" : "40%", height: "2px",
            background: `linear-gradient(90deg, ${mission.color}90, ${mission.color}20, transparent)`,
            transition: "width 0.6s cubic-bezier(0.23,1,0.32,1)",
            borderRadius: "0 0 0 24px",
          }} />
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(145deg, ${mission.color}20 0%, rgba(3,8,30,0.98) 50%, ${mission.color}10 100%)`,
          border: `1px solid ${mission.color}60`,
          borderRadius: "24px",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          gap: "20px", padding: "36px 28px",
          backdropFilter: "blur(16px)",
          boxShadow: `0 24px 70px ${mission.color}30, inset 0 0 80px ${mission.color}08`,
          overflow: "hidden",
        }}>
          {/* Background rings */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "280px", height: "280px", borderRadius: "50%",
            border: `1px solid ${mission.color}15`,
            animation: "spinSlow 20s linear infinite",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "200px", height: "200px", borderRadius: "50%",
            border: `1px solid ${mission.color}10`,
            animation: "spinSlow 14s linear infinite reverse",
          }} />

          <div style={{ fontSize: "3.5rem", position: "relative", zIndex: 1, filter: `drop-shadow(0 0 20px ${mission.color})` }}>🌌</div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontSize: "1.8rem", fontWeight: "900",
            color: mission.color, textAlign: "center", position: "relative", zIndex: 1,
            textShadow: `0 0 30px ${mission.color}80`,
          }}>{mission.year}</div>
          <div style={{
            padding: "8px 18px", borderRadius: "30px",
            background: `${mission.color}18`, border: `1px solid ${mission.color}50`,
            fontSize: "0.68rem", letterSpacing: "2px", color: mission.color,
            fontFamily: "'Orbitron', monospace", position: "relative", zIndex: 1,
          }}>✦ DID YOU KNOW?</div>
          <div style={{
            fontSize: "0.95rem", color: "rgba(210,230,255,0.92)",
            textAlign: "center", lineHeight: "1.75",
            fontFamily: "'Inter', sans-serif", fontStyle: "italic",
            position: "relative", zIndex: 1,
            maxWidth: "280px",
          }}>"{mission.fact}"</div>

          <div style={{
            position: "absolute", bottom: "16px",
            fontSize: "0.6rem", color: "rgba(255,255,255,0.3)",
            fontFamily: "'Orbitron', monospace",
          }}>CLICK TO FLIP BACK</div>
        </div>

        {/* Particle burst */}
        <ParticleBurst color={mission.color} active={burst} />
      </div>
    </div>
  );
}

// ───────────────────────── Stats Counter ─────────────────────────
function StatCard({ stat, isVisible, delay }) {
  const [counted, setCounted] = useState(false);
  useEffect(() => { if (isVisible && !counted) { setTimeout(() => setCounted(true), delay); } }, [isVisible]);
  return (
    <div className="stat-card" style={{
      textAlign: "center", padding: "36px 24px",
      background: "linear-gradient(135deg, rgba(74,158,255,0.08) 0%, rgba(5,10,35,0.92) 100%)",
      border: "1px solid rgba(74,158,255,0.18)",
      borderRadius: "20px", backdropFilter: "blur(12px)",
      transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
      opacity: isVisible ? 1 : 0,
      transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,158,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: "2.8rem", marginBottom: "10px" }}>{stat.icon}</div>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: "2.8rem", fontWeight: "900",
        color: "#4a9eff",
        textShadow: counted ? "0 0 40px rgba(74,158,255,0.9), 0 0 80px rgba(74,158,255,0.4)" : "none",
        transition: "text-shadow 0.6s ease",
        animation: counted ? "countPop 0.5s cubic-bezier(0.23,1,0.32,1)" : "none",
      }}>{stat.value}</div>
      <div style={{ color: "rgba(150,180,255,0.7)", fontSize: "0.78rem", letterSpacing: "2px", marginTop: "8px", fontFamily: "'Orbitron', monospace" }}>{stat.label}</div>
    </div>
  );
}

// ───────────────────────── Future Card ─────────────────────────
function FutureCard({ m, delay, isVisible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, ${m.color}18 0%, rgba(5,10,35,0.97) 100%)` : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(5,10,35,0.93) 100%)",
        border: `1px solid ${hovered ? m.color + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "20px", padding: "28px 24px",
        transform: isVisible ? (hovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)") : "translateY(60px) scale(0.88)",
        opacity: isVisible ? 1 : 0,
        transition: `all 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? `0 24px 60px ${m.color}28, 0 0 0 1px ${m.color}20` : "0 4px 20px rgba(0,0,0,0.4)",
        cursor: "default",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, transparent, ${m.color}80, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
      }} />
      <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{m.icon}</div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.1rem", fontWeight: "700", color: m.color, marginBottom: "8px" }}>{m.year}</div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.85rem", fontWeight: "600", color: "rgba(255,255,255,0.92)", marginBottom: "12px" }}>{m.title}</div>
      <div style={{ fontSize: "0.83rem", color: "rgba(165,190,255,0.72)", lineHeight: "1.65", fontFamily: "'Inter', sans-serif" }}>{m.desc}</div>
    </div>
  );
}

// ───────────────────────── Solar System ─────────────────────────
function SolarSystem() {
  const planets = [
    { name: "Mercury", color: "#b5b5b5", size: 9, orbit: 65, speed: 4.7 },
    { name: "Venus", color: "#e8cda0", size: 15, orbit: 95, speed: 3.5 },
    { name: "Earth", color: "#4a9eff", size: 16, orbit: 132, speed: 2.9 },
    { name: "Mars", color: "#c1440e", size: 11, orbit: 173, speed: 2.4 },
  ];
  return (
    <div style={{ position: "relative", width: "370px", height: "370px", margin: "0 auto", flexShrink: 0 }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "38px", height: "38px", borderRadius: "50%",
        background: "radial-gradient(circle, #fff7cc 0%, #ffdd44 40%, #ff8800 100%)",
        boxShadow: "0 0 50px #ffdd44, 0 0 100px rgba(255,200,0,0.35), 0 0 180px rgba(255,140,0,0.15)",
        zIndex: 5, animation: "sunPulse 4s ease-in-out infinite",
      }} />
      {planets.map((p, i) => (
        <div key={p.name} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute", borderRadius: "50%",
            width: p.orbit * 2, height: p.orbit * 2,
            border: "1px solid rgba(74,158,255,0.14)",
          }} />
          <div style={{
            position: "absolute", width: p.orbit * 2, height: p.orbit * 2,
            borderRadius: "50%", animation: `orbit${i} ${11 - p.speed}s linear infinite`,
          }}>
            <div style={{
              position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
              width: p.size, height: p.size, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${p.color} 0%, ${p.color}88 100%)`,
              boxShadow: `0 0 12px ${p.color}80, 0 0 24px ${p.color}30`,
            }} title={p.name} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes orbit0 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit1 { from{transform:rotate(60deg)} to{transform:rotate(420deg)} }
        @keyframes orbit2 { from{transform:rotate(120deg)} to{transform:rotate(480deg)} }
        @keyframes orbit3 { from{transform:rotate(200deg)} to{transform:rotate(560deg)} }
        @keyframes sunPulse { 0%,100%{box-shadow:0 0 50px #ffdd44, 0 0 100px rgba(255,200,0,0.35);} 50%{box-shadow:0 0 70px #ffdd44, 0 0 140px rgba(255,200,0,0.5);} }
        @keyframes spinSlow { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ───────────────────────── Countdown ─────────────────────────
function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-09-03T00:00:00Z");
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [["DAYS", time.d], ["HOURS", time.h], ["MINS", time.m], ["SECS", time.s]];
  return (
    <div style={{ display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap", marginTop: "36px" }}>
      {units.map(([label, val]) => (
        <div key={label} style={{
          textAlign: "center", minWidth: "90px",
          background: "rgba(74,158,255,0.09)", border: "1px solid rgba(74,158,255,0.28)",
          borderRadius: "14px", padding: "18px 14px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(74,158,255,0.12)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(74,158,255,0.05) 0%, transparent 100%)",
          }} />
          <div style={{
            fontFamily: "'Orbitron', monospace", fontSize: "2.2rem", fontWeight: "900",
            color: "#4a9eff", lineHeight: 1,
            textShadow: "0 0 20px rgba(74,158,255,0.7)",
            animation: label === "SECS" ? "tickPulse 1s ease-in-out infinite" : "none",
          }}>
            {String(val).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", color: "rgba(150,180,255,0.6)", marginTop: "6px", fontFamily: "'Orbitron', monospace" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── Quote Rotator ─────────────────────────
const quotes = [
  { text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson" },
  { text: "Earth is the cradle of humanity, but one cannot live in a cradle forever.", author: "Konstantin Tsiolkovsky" },
  { text: "That's one small step for man, one giant leap for mankind.", author: "Neil Armstrong" },
  { text: "To confine our attention to terrestrial matters would be to limit the human spirit.", author: "Stephen Hawking" },
];
function QuoteRotator() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % quotes.length); setFade(true); }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);
  const q = quotes[idx];
  return (
    <div style={{
      textAlign: "center", padding: "56px 44px",
      background: "linear-gradient(135deg, rgba(74,158,255,0.06) 0%, rgba(5,10,40,0.88) 100%)",
      border: "1px solid rgba(74,158,255,0.14)", borderRadius: "28px", backdropFilter: "blur(12px)",
      opacity: fade ? 1 : 0, transition: "opacity 0.4s ease",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(74,158,255,0.5), transparent)",
      }} />
      <div style={{ fontSize: "3.5rem", marginBottom: "18px", opacity: 0.35, lineHeight: 1 }}>"</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "clamp(1rem, 2.5vw, 1.45rem)",
        fontStyle: "italic", color: "rgba(205,225,255,0.92)",
        lineHeight: "1.75", maxWidth: "700px", margin: "0 auto 24px",
        fontWeight: 300,
      }}>{q.text}</p>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: "0.75rem",
        letterSpacing: "3px", color: "#4a9eff",
      }}>— {q.author}</div>
    </div>
  );
}

// ───────────────────────── MAIN PAGE ─────────────────────────
export default function MissionSection() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [futureVisible, setFutureVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const statsRef = useRef(null);
  const futureRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / (h - window.innerHeight))));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setVisibleCards(p => new Set([...p, i]));
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      obs.observe(ref); return obs;
    });
    const sObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.15 });
    if (statsRef.current) sObs.observe(statsRef.current);
    const fObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFutureVisible(true); }, { threshold: 0.08 });
    if (futureRef.current) fObs.observe(futureRef.current);
    const qObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setQuoteVisible(true); }, { threshold: 0.15 });
    if (quoteRef.current) qObs.observe(quoteRef.current);
    return () => { observers.forEach(o => o?.disconnect()); sObs.disconnect(); fObs.disconnect(); qObs.disconnect(); };
  }, []);

  const rows = [];
  for (let i = 0; i < missions.length; i += 3) rows.push(missions.slice(i, i + 3));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #020818; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050a1a; }
        ::-webkit-scrollbar-thumb { background: #1a3a6a; border-radius: 3px; }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: stretch;
        }
        @media(max-width: 1000px){ .mission-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 620px){ .mission-grid { grid-template-columns: 1fr; } }

        .future-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        @media(max-width:1000px){ .future-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:600px){ .future-grid{grid-template-columns:1fr;} }

        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
        @media(max-width:900px){ .stats-grid{grid-template-columns:repeat(2,1fr);} }

        .solar-hero { display: flex; align-items: center; gap: 60px; }
        @media(max-width:800px){ .solar-hero{flex-direction:column; gap:30px; text-align:center;} }

        @keyframes nebulaDrift1 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,20px) scale(1.08);} }
        @keyframes nebulaDrift2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-30px,-15px) scale(1.05);} }
        @keyframes nebulaDrift3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(15px,25px) scale(1.1);} }
        @keyframes shimmer { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes titleReveal { from{opacity:0;transform:translateY(50px);filter:blur(12px);} to{opacity:1;transform:translateY(0);filter:blur(0);} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(74,158,255,0.2);} 50%{border-color:rgba(74,158,255,0.5);} }
        @keyframes countPop { 0%{transform:scale(0.6)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes tickPulse { 0%,100%{opacity:1;} 50%{opacity:0.6;} }

        @keyframes burst0 { to{transform:rotate(0deg) translateX(60px) scale(0);opacity:0;} }
        @keyframes burst1 { to{transform:rotate(90deg) translateX(60px) scale(0);opacity:0;} }
        @keyframes burst2 { to{transform:rotate(180deg) translateX(60px) scale(0);opacity:0;} }
        @keyframes burst3 { to{transform:rotate(270deg) translateX(60px) scale(0);opacity:0;} }

        .title-a1 { animation: titleReveal 1s cubic-bezier(0.23,1,0.32,1) 0s both; }
        .title-a2 { animation: titleReveal 1s cubic-bezier(0.23,1,0.32,1) 0.2s both; }
        .title-a3 { animation: titleReveal 1s cubic-bezier(0.23,1,0.32,1) 0.4s both; }
        .title-a4 { animation: titleReveal 1s cubic-bezier(0.23,1,0.32,1) 0.6s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #4a9eff, #fff, #4a9eff, #7bc8ff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .float-el { animation: float 7s ease-in-out infinite; }

        .row-divider { position:relative; display:flex; align-items:center; margin:24px 0; }
        .row-divider::before { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(74,158,255,0.4),rgba(74,158,255,0.15),transparent); }
        .row-divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(74,158,255,0.15),rgba(74,158,255,0.4),transparent); }
        .dot-pulse { width:8px; height:8px; border-radius:50%; background:#4a9eff; margin:0 14px; animation:pulseGlow 2s ease-in-out infinite; box-shadow:0 0 12px #4a9eff; }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.04) !important;
          box-shadow: 0 24px 60px rgba(74,158,255,0.22) !important;
          border-color: rgba(74,158,255,0.4) !important;
        }
        .stat-card { transition: all 0.35s cubic-bezier(0.23,1,0.32,1) !important; }

        .scan-line { position:fixed; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,rgba(74,158,255,0.35),transparent); animation:scanLine 9s linear infinite; pointer-events:none; z-index:100; }
      `}</style>

      <div className="scan-line" />

      <div ref={sectionRef} style={{
        position: "relative",
        background: "linear-gradient(180deg, #020818 0%, #050d2a 25%, #04091f 60%, #020a1a 100%)",
        minHeight: "100vh", padding: "100px 0 80px",
        overflow: "hidden", fontFamily: "'Inter', sans-serif",
      }}>
        <StarField />
        <NebulaBg />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1280px", margin: "0 auto", padding: "0 36px" }}>

          {/* ── HERO HEADER ── */}
          <div style={{ textAlign: "center", marginBottom: "88px" }}>
            <div className="title-a1" style={{
              display: "inline-block", background: "rgba(74,158,255,0.1)",
              border: "1px solid rgba(74,158,255,0.3)", borderRadius: "30px",
              padding: "8px 26px", fontSize: "0.72rem", letterSpacing: "5px",
              color: "#4a9eff", textTransform: "uppercase", fontFamily: "'Orbitron', monospace",
              marginBottom: "26px",
            }}>⚡ Yearly Mission Log</div>

            <h1 className="title-a2 shimmer-text" style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2.8rem, 7vw, 5.8rem)", fontWeight: "900",
              letterSpacing: "-1px", lineHeight: 1.05, marginBottom: "16px",
            }}>OUR MISSION</h1>

            <h2 className="title-a3" style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(0.9rem, 2vw, 1.3rem)", fontWeight: "400",
              color: "rgba(150,180,255,0.65)", letterSpacing: "8px", marginBottom: "26px",
            }}>THROUGH THE COSMOS</h2>

            <p className="title-a4" style={{
              maxWidth: "580px", margin: "0 auto", color: "rgba(150,180,220,0.65)",
              fontSize: "1rem", lineHeight: "1.9", fontWeight: "300",
            }}>
              From Sputnik's first beep to Webb's deep-field images — explore the defining milestones of our relentless quest to reach beyond the stars.
            </p>

            <div className="title-a4" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "42px" }}>
              {[80, 30].map((w, i) => <div key={i} style={{ width: w, height: "1px", background: `linear-gradient(${i ? "270deg" : "90deg"}, transparent, #4a9eff)` }} />)}
              {[6, 10, 6].map((s, i) => <div key={i} style={{ width: s, height: s, borderRadius: "50%", background: s === 10 ? "#fff" : "#4a9eff", boxShadow: `0 0 ${s === 10 ? 22 : 14}px #4a9eff` }} />)}
              {[30, 80].map((w, i) => <div key={i} style={{ width: w, height: "1px", background: `linear-gradient(${i ? "90deg" : "270deg"}, transparent, #4a9eff)` }} />)}
            </div>
          </div>

          {/* ── SOLAR SYSTEM + INTRO ── */}
          <div style={{
            marginBottom: "88px", padding: "52px 44px",
            background: "linear-gradient(135deg, rgba(74,158,255,0.06) 0%, rgba(5,10,40,0.87) 100%)",
            border: "1px solid rgba(74,158,255,0.13)", borderRadius: "28px", backdropFilter: "blur(14px)",
          }}>
            <div className="solar-hero">
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: "4px", color: "#4a9eff", marginBottom: "18px" }}>🌌 OUR SOLAR SYSTEM</div>
                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: "700", color: "white", lineHeight: 1.2, marginBottom: "22px" }}>
                  Exploring<br /><span style={{ color: "#4a9eff" }}>Every Corner</span>
                </h3>
                <p style={{ color: "rgba(160,185,255,0.7)", fontSize: "0.95rem", lineHeight: "1.85", maxWidth: "440px" }}>
                  From the first satellite to the edges of interstellar space, humans have sent probes, rovers, and astronauts across our solar neighborhood. Each mission pushes the boundary of what's possible.
                </p>
                <div style={{ display: "flex", gap: "28px", marginTop: "30px", flexWrap: "wrap" }}>
                  {[["8", "Planets Explored"], ["500+", "Missions Flown"], ["23B km", "Farthest Object"]].map(([v, l]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.5rem", fontWeight: "700", color: "#4a9eff" }}>{v}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(150,180,255,0.6)", letterSpacing: "1px", marginTop: "4px" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="float-el"><SolarSystem /></div>
            </div>
          </div>

          {/* ── PROGRESS BAR ── */}
          <div style={{ marginBottom: "60px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "rgba(150,180,255,0.45)", fontSize: "0.65rem", letterSpacing: "2px", fontFamily: "'Orbitron', monospace" }}>
              <span>1957</span><span style={{ color: "#4a9eff" }}>TIMELINE PROGRESS — {Math.round(progress * 100)}%</span><span>2020s</span>
            </div>
            <div style={{ height: "3px", background: "rgba(74,158,255,0.1)", borderRadius: "2px", overflow: "visible", position: "relative" }}>
              <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #1a3a8a, #4a9eff, #7bc8ff, #fff)", borderRadius: "2px", transition: "width 0.12s ease", boxShadow: "0 0 14px #4a9eff, 0 0 28px rgba(74,158,255,0.4)" }} />
              <div style={{ position: "absolute", right: `${100 - progress * 100}%`, top: "50%", transform: "translate(50%, -50%)", width: "10px", height: "10px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 14px #4a9eff, 0 0 28px rgba(74,158,255,0.6)", transition: "right 0.12s ease" }} />
            </div>
          </div>

          {/* ── MISSION CARDS ── */}
          {rows.map((row, rowIdx) => {
            const si = rowIdx * 3;
            return (
              <div key={rowIdx}>
                {rowIdx > 0 && <div className="row-divider"><div className="dot-pulse" /></div>}
                <div className="mission-grid">
                  {row.map((mission, ci) => {
                    const gi = si + ci;
                    return (
                      <div key={gi} ref={el => (cardRefs.current[gi] = el)}>
                        <MissionCard mission={mission} index={ci} isVisible={visibleCards.has(gi)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── QUOTE ROTATOR ── */}
          <div ref={quoteRef} style={{
            marginTop: "88px",
            opacity: quoteVisible ? 1 : 0, transform: quoteVisible ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)",
          }}>
            <div style={{ textAlign: "center", marginBottom: "26px" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: "4px", color: "#4a9eff" }}>💫 WORDS FROM THE COSMOS</div>
            </div>
            <QuoteRotator />
          </div>

          {/* ── STATS ── */}
          <div ref={statsRef} style={{ marginTop: "88px" }}>
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: "4px", color: "#4a9eff", marginBottom: "14px" }}>📊 BY THE NUMBERS</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: "700", color: "white" }}>Space <span style={{ color: "#4a9eff" }}>Milestones</span></h3>
            </div>
            <div className="stats-grid">
              {stats.map((s, i) => <StatCard key={s.label} stat={s} isVisible={statsVisible} delay={i * 130} />)}
            </div>
          </div>

          {/* ── FUTURE MISSIONS ── */}
          <div ref={futureRef} style={{ marginTop: "88px" }}>
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: "4px", color: "#ff6b6b", marginBottom: "14px" }}>🚀 WHAT LIES AHEAD</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: "700", color: "white" }}>Future <span style={{ color: "#ff6b6b" }}>Missions</span></h3>
              <p style={{ color: "rgba(160,185,255,0.6)", fontSize: "0.9rem", marginTop: "12px", maxWidth: "500px", margin: "14px auto 0" }}>
                The next chapters of space exploration are already being written.
              </p>
            </div>
            <div className="future-grid">
              {futureMs.map((m, i) => <FutureCard key={m.year} m={m} delay={i * 110} isVisible={futureVisible} />)}
            </div>
          </div>

          {/* ── ARTEMIS COUNTDOWN ── */}
          <div style={{
            marginTop: "88px", padding: "56px 44px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(74,158,255,0.07) 0%, rgba(5,10,40,0.9) 100%)",
            border: "1px solid rgba(74,158,255,0.16)", borderRadius: "28px", backdropFilter: "blur(14px)",
          }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: "4px", color: "#4a9eff", marginBottom: "18px" }}>⏱ NEXT LAUNCH WINDOW</div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.3rem, 3vw, 2.1rem)", fontWeight: "700", color: "white", marginBottom: "10px" }}>
              Artemis III — <span style={{ color: "#4a9eff" }}>Moon Landing</span>
            </h3>
            <p style={{ color: "rgba(160,185,255,0.6)", fontSize: "0.87rem", maxWidth: "420px", margin: "0 auto" }}>Target: September 2026 — First crewed lunar landing since 1972</p>
            <Countdown />
          </div>

          {/* ── BOTTOM CTA ── */}
          <div style={{
            textAlign: "center", marginTop: "88px", padding: "76px 44px",
            background: "linear-gradient(135deg, rgba(74,158,255,0.07) 0%, rgba(10,20,60,0.72) 100%)",
            border: "1px solid rgba(74,158,255,0.13)", borderRadius: "28px", backdropFilter: "blur(14px)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(74,158,255,0.09)", animation: "borderGlow 4s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "630px", height: "630px", borderRadius: "50%", border: "1px solid rgba(74,158,255,0.05)", animation: "borderGlow 4s ease-in-out infinite 1.2s", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3.2rem", marginBottom: "18px" }}>🌌</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: "700", color: "white", marginBottom: "18px" }}>
                What's <span style={{ color: "#4a9eff" }}>Next?</span>
              </h3>
              <p style={{ color: "rgba(150,180,220,0.65)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto 40px", lineHeight: "1.85" }}>
                The universe is vast and our mission continues. Join us as we push the boundaries of human exploration — beyond the stars, beyond imagination.
              </p>
              <div style={{ display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap" }}>
                {[["EXPLORE MISSIONS →", "transparent", "#4a9eff"], ["FUTURE LAUNCHES", "rgba(74,158,255,0.15)", "#7bc8ff"]].map(([label, bg, col]) => (
                  <button key={label}
                    onMouseEnter={e => { e.target.style.background = col; e.target.style.color = "#000"; e.target.style.transform = "translateY(-5px) scale(1.04)"; e.target.style.boxShadow = `0 18px 45px ${col}55`; }}
                    onMouseLeave={e => { e.target.style.background = bg; e.target.style.color = col; e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = "none"; }}
                    style={{
                      background: bg, border: `2px solid ${col}`, borderRadius: "50px",
                      padding: "15px 38px", color: col,
                      fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", letterSpacing: "3px",
                      cursor: "pointer", transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ textAlign: "center", marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(74,158,255,0.1)" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(100,130,180,0.5)" }}>
              SPACE ODYSSEY © 2025 — HUMANITY'S MISSION LOG — AD ASTRA PER ASPERA
            </div>
          </div>

        </div>
      </div>
    </>
  );
}