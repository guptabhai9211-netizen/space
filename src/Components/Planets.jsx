import { useRef, useState, useEffect, Suspense } from "react";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
  useScroll, useVelocity, useAnimationFrame,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   PLANET DATA — All 8 planets
═══════════════════════════════════════════════════════════════ */
const PLANETS = [
  {
    id: 1,
    name: "Mercury",
    symbol: "☿",
    romanName: "HERMES",
    desc: "The swift messenger — smallest world in our solar system, hurtling through space at 47 km/s with no atmosphere to protect its cratered face from the Sun's wrath.",
    longDesc: "Mercury's surface is covered with craters, evidence of the many meteorite impacts it has sustained over billions of years. Without a substantial atmosphere, there is no weather, no wind erosion, and temperatures swing wildly from -180°C at night to 430°C during the day. Despite being the closest planet to the Sun, Venus is actually hotter due to its thick atmosphere.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/800px-Mercury_in_color_-_Prockter07-edit1.jpg",
    videoId: "0KBjnNuhRHs",
    color: "#B8A898",
    colorAlt: "#7A6A5A",
    accent: "#D4C4B4",
    glow: "rgba(184,168,152,0.5)",
    stats: [
      { label: "Distance from Sun", val: "57.9M km", icon: "☀" },
      { label: "Orbital Period", val: "88 days", icon: "⟳" },
      { label: "Surface Temp", val: "430°C max", icon: "🌡" },
      { label: "Moons", val: "0", icon: "◑" },
      { label: "Diameter", val: "4,879 km", icon: "⊙" },
      { label: "Gravity", val: "3.7 m/s²", icon: "↓" },
    ],
    tag: "TERRESTRIAL",
    tagIcon: "⬡",
    fact: "A year on Mercury lasts just 88 Earth days — but a single day lasts 59 Earth days.",
    type: "Rocky Planet",
    moons: 0,
    rings: false,
    orderIndex: 1,
  },
  {
    id: 2,
    name: "Venus",
    symbol: "♀",
    romanName: "APHRODITE",
    desc: "Earth's twin in size, but a hellish inferno — crushing pressure, acid clouds, and the hottest surface in the solar system beneath a perpetual shroud of toxic atmosphere.",
    longDesc: "Venus is often called Earth's twin because of its similar size and composition, but the similarities end there. Its dense atmosphere creates a runaway greenhouse effect that makes it hotter than Mercury despite being farther from the Sun. Venus also rotates in the opposite direction to most planets, and its day is longer than its year.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/800px-Venus-real_color.jpg",
    videoId: "BvXa1n9fjow",
    color: "#E8C882",
    colorAlt: "#C09040",
    accent: "#F4D898",
    glow: "rgba(232,200,130,0.5)",
    stats: [
      { label: "Distance from Sun", val: "108.2M km", icon: "☀" },
      { label: "Orbital Period", val: "225 days", icon: "⟳" },
      { label: "Surface Temp", val: "465°C avg", icon: "🌡" },
      { label: "Moons", val: "0", icon: "◑" },
      { label: "Diameter", val: "12,104 km", icon: "⊙" },
      { label: "Gravity", val: "8.87 m/s²", icon: "↓" },
    ],
    tag: "TERRESTRIAL",
    tagIcon: "⬡",
    fact: "Venus rotates backwards — the Sun rises in the west and sets in the east.",
    type: "Rocky Planet",
    moons: 0,
    rings: false,
    orderIndex: 2,
  },
  {
    id: 3,
    name: "Earth",
    symbol: "♁",
    romanName: "GAIA",
    desc: "The pale blue dot — our cosmic island of life, protected by a magnetic shield, wrapped in breathable sky, and nurtured by liquid oceans that cover 71% of its surface.",
    longDesc: "Earth is the only known planet to harbor life, with its unique combination of liquid water, protective atmosphere, and stable climate. Our planet's magnetic field shields us from harmful solar radiation, while the ozone layer filters ultraviolet light. The Moon's gravitational influence stabilizes Earth's axial tilt, maintaining relatively stable seasons.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg",
    videoId: "HCDVN7DCzYE",
    color: "#4A9ECA",
    colorAlt: "#1E5F8A",
    accent: "#7AC4EA",
    glow: "rgba(74,158,202,0.5)",
    stats: [
      { label: "Distance from Sun", val: "149.6M km", icon: "☀" },
      { label: "Orbital Period", val: "365.25 days", icon: "⟳" },
      { label: "Surface Temp", val: "15°C avg", icon: "🌡" },
      { label: "Moons", val: "1", icon: "◑" },
      { label: "Diameter", val: "12,742 km", icon: "⊙" },
      { label: "Gravity", val: "9.81 m/s²", icon: "↓" },
    ],
    tag: "HABITABLE",
    tagIcon: "◉",
    fact: "Earth is the densest planet in the solar system and the only one not named after a Greek or Roman deity.",
    type: "Ocean World",
    moons: 1,
    rings: false,
    orderIndex: 3,
  },
  {
    id: 4,
    name: "Mars",
    symbol: "♂",
    romanName: "ARES",
    desc: "The Red Planet beckons — ancient riverbeds, polar ice caps, and Olympus Mons standing three times taller than Everest mark this rust-colored world as humanity's next frontier.",
    longDesc: "Mars has intrigued scientists for centuries as a potential second home for humanity. Evidence suggests Mars once had liquid water flowing across its surface, and seasonal patterns suggest possible subsurface water activity today. The planet experiences planet-wide dust storms that can last for months, completely obscuring the surface from view.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg",
    videoId: "D8pnmwOXhoY",
    color: "#C1440E",
    colorAlt: "#8B2A05",
    accent: "#E05A20",
    glow: "rgba(193,68,14,0.5)",
    stats: [
      { label: "Distance from Sun", val: "227.9M km", icon: "☀" },
      { label: "Orbital Period", val: "687 days", icon: "⟳" },
      { label: "Surface Temp", val: "-60°C avg", icon: "🌡" },
      { label: "Moons", val: "2", icon: "◑" },
      { label: "Diameter", val: "6,779 km", icon: "⊙" },
      { label: "Gravity", val: "3.72 m/s²", icon: "↓" },
    ],
    tag: "ROCKY",
    tagIcon: "⬡",
    fact: "Olympus Mons on Mars is the largest volcano in the solar system — 21 km tall and 600 km wide.",
    type: "Desert World",
    moons: 2,
    rings: false,
    orderIndex: 4,
  },
  {
    id: 5,
    name: "Jupiter",
    symbol: "♃",
    romanName: "ZEUS",
    desc: "The colossus of our solar system — 1,300 Earths could fit inside this gas giant, whose Great Red Spot is a centuries-old storm larger than our entire planet.",
    longDesc: "Jupiter is the largest planet in our solar system by a vast margin. Its powerful magnetic field, 20,000 times stronger than Earth's, creates spectacular auroras. The planet acts as a cosmic vacuum cleaner, its gravity attracting and capturing many comets and asteroids that might otherwise strike the inner planets.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    videoId: "PtkqwslbLY8",
    color: "#C8956C",
    colorAlt: "#8B5A2B",
    accent: "#E8B58C",
    glow: "rgba(200,149,108,0.5)",
    stats: [
      { label: "Distance from Sun", val: "778.5M km", icon: "☀" },
      { label: "Orbital Period", val: "11.9 years", icon: "⟳" },
      { label: "Surface Temp", val: "-110°C avg", icon: "🌡" },
      { label: "Moons", val: "95", icon: "◑" },
      { label: "Diameter", val: "139,820 km", icon: "⊙" },
      { label: "Gravity", val: "24.79 m/s²", icon: "↓" },
    ],
    tag: "GAS GIANT",
    tagIcon: "⬤",
    fact: "Jupiter's Great Red Spot is a storm that has raged for over 350 years — though it is slowly shrinking.",
    type: "Gas Giant",
    moons: 95,
    rings: true,
    orderIndex: 5,
  },
  {
    id: 6,
    name: "Saturn",
    symbol: "♄",
    romanName: "KRONOS",
    desc: "The jewel of the solar system — Saturn's magnificent ring system, stretching 282,000 km wide yet only meters thick, is made of billions of ice particles from cosmic dust to house-sized boulders.",
    longDesc: "Saturn's iconic rings are a relatively recent addition, forming between 10 and 100 million years ago — when dinosaurs still roamed Earth. The rings are made primarily of water ice mixed with rocky material. Saturn is so light relative to its size that it would float in water. Its moon Titan has thick nitrogen atmosphere and lakes of liquid methane.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg",
    videoId: "epZdZaEQhS0",
    color: "#D4A96A",
    colorAlt: "#A07840",
    accent: "#F0C98A",
    glow: "rgba(212,169,106,0.5)",
    stats: [
      { label: "Distance from Sun", val: "1.43B km", icon: "☀" },
      { label: "Orbital Period", val: "29.5 years", icon: "⟳" },
      { label: "Surface Temp", val: "-140°C avg", icon: "🌡" },
      { label: "Moons", val: "146", icon: "◑" },
      { label: "Diameter", val: "116,460 km", icon: "⊙" },
      { label: "Gravity", val: "10.44 m/s²", icon: "↓" },
    ],
    tag: "GAS GIANT",
    tagIcon: "⬤",
    fact: "Saturn is the least dense planet in the solar system — it's less dense than water and would float!",
    type: "Ringed Giant",
    moons: 146,
    rings: true,
    orderIndex: 6,
  },
  {
    id: 7,
    name: "Uranus",
    symbol: "⛢",
    romanName: "CAELUS",
    desc: "The tilted ice giant — Uranus rolls through its orbit on its side at 98°, wrapped in a methane-rich atmosphere that gives it an eerie aquamarine glow unlike any other world.",
    longDesc: "Uranus has the most extreme axial tilt of any planet, meaning it essentially rolls around the Sun on its side. This causes extreme seasons, with each pole experiencing 42 years of continuous sunlight followed by 42 years of darkness. Uranus also rotates in the opposite direction to most planets. Its interior is primarily composed of icy materials mixed with rock.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/800px-Uranus2.jpg",
    videoId: "m4NXbFOiOGk",
    color: "#7AC8D4",
    colorAlt: "#3A8898",
    accent: "#9AE8F4",
    glow: "rgba(122,200,212,0.5)",
    stats: [
      { label: "Distance from Sun", val: "2.87B km", icon: "☀" },
      { label: "Orbital Period", val: "84 years", icon: "⟳" },
      { label: "Surface Temp", val: "-195°C avg", icon: "🌡" },
      { label: "Moons", val: "28", icon: "◑" },
      { label: "Diameter", val: "50,724 km", icon: "⊙" },
      { label: "Gravity", val: "8.69 m/s²", icon: "↓" },
    ],
    tag: "ICE GIANT",
    tagIcon: "❄",
    fact: "Uranus is tilted so far on its side that it essentially orbits the Sun like a rolling ball.",
    type: "Ice Giant",
    moons: 28,
    rings: true,
    orderIndex: 7,
  },
  {
    id: 8,
    name: "Neptune",
    symbol: "♆",
    romanName: "POSEIDON",
    desc: "The dark, stormy sovereign of the outer solar system — winds rage at 2,100 km/h across Neptune's face, and its Great Dark Spot rivals Jupiter's storms in power and fury.",
    longDesc: "Neptune was the first planet found by mathematical prediction rather than direct observation. Its discovery validated Newton's law of universal gravitation. Neptune has the strongest sustained winds of any planet, reaching speeds of over 2,000 km/h. Its moon Triton is unique — it orbits in the opposite direction of Neptune's rotation, suggesting it was captured from the Kuiper Belt.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/800px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
    videoId: "NStn7zZKXfE",
    color: "#4060D8",
    colorAlt: "#202890",
    accent: "#6080F8",
    glow: "rgba(64,96,216,0.5)",
    stats: [
      { label: "Distance from Sun", val: "4.5B km", icon: "☀" },
      { label: "Orbital Period", val: "165 years", icon: "⟳" },
      { label: "Surface Temp", val: "-200°C avg", icon: "🌡" },
      { label: "Moons", val: "16", icon: "◑" },
      { label: "Diameter", val: "49,244 km", icon: "⊙" },
      { label: "Gravity", val: "11.15 m/s²", icon: "↓" },
    ],
    tag: "ICE GIANT",
    tagIcon: "❄",
    fact: "Neptune takes 165 years to orbit the Sun — one Neptune year only just completed in 2011 since its discovery.",
    type: "Ice Giant",
    moons: 16,
    rings: true,
    orderIndex: 8,
  },
];

/* stars */
const STARS = Array.from({ length: 200 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  r: Math.random() * 2.5 + 0.2, delay: Math.random() * 6, dur: Math.random() * 4 + 2,
}));

/* ═══════════════════════════════════════════════════════════════
   TILT HOOK
═══════════════════════════════════════════════════════════════ */
function useTilt(str = 12) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 180, damping: 24 });
  const ry = useSpring(0, { stiffness: 180, damping: 24 });
  const gx = useSpring(50, { stiffness: 100, damping: 20 });
  const gy = useSpring(50, { stiffness: 100, damping: 20 });
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

/* ═══════════════════════════════════════════════════════════════
   PARTICLE FIELD
═══════════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      });
      pts.forEach((p, i) => pts.slice(i + 1).forEach(q => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 100) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ═══════════════════════════════════════════════════════════════
   PLANET CARD
═══════════════════════════════════════════════════════════════ */
function PlanetCard({ planet, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(11);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 80, scale: 0.8 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="planet-card-outer"
    >
      <motion.div
        ref={ref}
        className="planet-card"
        style={{
          rotateX: rx, rotateY: ry,
          transformStyle: "preserve-3d",
          "--pcolor": planet.color,
          "--pglow": planet.glow,
          "--palt": planet.colorAlt,
          "--pacc": planet.accent,
        }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        onClick={() => onSelect(planet)}
        whileHover={{ z: 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
      >
        {/* Image area */}
        <div className="pc-image-area">
          <motion.div className="pc-planet-sphere" animate={{ rotateY: hovered ? [0, 360] : 0 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <img src={planet.img} alt={planet.name} className="pc-planet-img" />
          </motion.div>

          {/* Orbital ring animation */}
          <motion.div
            className="pc-orbit-ring-anim"
            style={{ borderColor: `${planet.color}30` }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="pc-orbit-dot-anim" style={{ background: planet.accent, boxShadow: `0 0 8px ${planet.color}` }} />
          </motion.div>

          {/* Atmosphere shimmer */}
          <motion.div className="pc-atmo-shimmer" style={{ background: `radial-gradient(circle, transparent 40%, ${planet.color}25 70%, ${planet.color}50 100%)` }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />

          {/* Scan line */}
          <motion.div
            className="pc-scan-line"
            style={{ background: `linear-gradient(to bottom, transparent, ${planet.color}50, transparent)` }}
            animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.7, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Tags */}
          <div className="pc-badges">
            <motion.span className="pc-tag" style={{ background: `${planet.color}20`, border: `1px solid ${planet.color}50`, color: planet.accent }}
              animate={{ opacity: hovered ? 1 : 0.6 }}>
              {planet.tagIcon} {planet.tag}
            </motion.span>
            <motion.span className="pc-order-badge" style={{ color: `${planet.color}60` }}>
              {String(planet.orderIndex).padStart(2, "0")}
            </motion.span>
          </div>

          {/* Symbol */}
          <motion.div className="pc-symbol-float" style={{ color: `${planet.color}70` }}
            animate={hovered ? { scale: 1.4, color: planet.accent, y: -4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}>
            {planet.symbol}
          </motion.div>

          {/* Cursor glow */}
          <motion.div className="pc-cursor-glow"
            style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${planet.glow} 0%, transparent 65%)` }}
            animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} />

          {/* Hover overlay gradient */}
          <motion.div className="pc-hover-overlay"
            style={{ background: `linear-gradient(to top, ${planet.colorAlt}AA, transparent)` }}
            animate={{ opacity: hovered ? 0.7 : 0 }} transition={{ duration: 0.4 }} />
        </div>

        {/* Info panel */}
        <div className="pc-info-panel">
          <div className="pc-name-row">
            <div>
              <p className="pc-roman-name" style={{ color: `${planet.color}50` }}>{planet.romanName}</p>
              <h3 className="pc-name">{planet.name}</h3>
            </div>
            <div className="pc-type-pill" style={{ background: `${planet.color}15`, border: `1px solid ${planet.color}30`, color: planet.color }}>
              {planet.type}
            </div>
          </div>

          <p className="pc-desc">{planet.desc}</p>

          {/* Quick stats on hover */}
          <motion.div className="pc-quick-stats"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.3, delay: hovered ? 0.05 : 0 }}>
            {planet.stats.slice(0, 2).map((s, i) => (
              <div key={i} className="pc-qs-item">
                <span className="pc-qs-val" style={{ color: planet.accent }}>{s.val}</span>
                <span className="pc-qs-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Moons + rings indicators */}
          <div className="pc-indicators">
            <span className="pc-indicator" style={{ color: `${planet.color}60` }}>
              ◑ {planet.moons} moon{planet.moons !== 1 ? "s" : ""}
            </span>
            {planet.rings && <span className="pc-indicator" style={{ color: `${planet.color}60` }}>◎ Has rings</span>}
          </div>

          <motion.button
            className="pc-explore-btn"
            style={{ background: `linear-gradient(135deg, ${planet.color}, ${planet.colorAlt})`, boxShadow: `0 8px 32px ${planet.glow}` }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16, scale: hovered ? 1 : 0.9 }}
            transition={{ duration: 0.3, delay: hovered ? 0.1 : 0 }}
            whileTap={{ scale: 0.94 }}
          >
            MISSION BRIEFING →
          </motion.button>
        </div>

        {/* Border glow */}
        <motion.div className="pc-border-glow"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${planet.color}60, 0 20px 60px ${planet.glow}` : "none" }}
          transition={{ duration: 0.4 }} />

        {/* Corner brackets */}
        <div className="pc-corner pc-tl" style={{ borderColor: `${planet.color}60` }} />
        <div className="pc-corner pc-br" style={{ borderColor: `${planet.color}60` }} />
        <div className="pc-corner pc-tr" style={{ borderColor: `${planet.color}30` }} />
        <div className="pc-corner pc-bl" style={{ borderColor: `${planet.color}30` }} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLANET MODAL
═══════════════════════════════════════════════════════════════ */
function PlanetModal({ planet, onClose, onNext, onPrev }) {
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setShowVideo(false);
    setActiveTab("overview");
  }, [planet.id]);

  return (
    <motion.div className="pm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="pm-container"
        initial={{ scale: 0.8, rotateX: -15, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, opacity: 1 }}
        exit={{ scale: 0.85, rotateX: 10, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ "--pcolor": planet.color, "--pglow": planet.glow, "--palt": planet.colorAlt, "--pacc": planet.accent }}
      >
        {/* Close */}
        <button className="pm-close" onClick={onClose}>✕</button>

        {/* Nav arrows */}
        <button className="pm-nav pm-prev" onClick={onPrev}>‹</button>
        <button className="pm-nav pm-next" onClick={onNext}>›</button>

        {/* Left visual column */}
        <div className="pm-visual">
          <div className="pm-planet-showcase">
            {/* Animated rings for gas/ice giants */}
            {planet.rings && (
              <motion.div className="pm-rings" style={{ borderColor: `${planet.color}40` }}
                animate={{ rotateX: 75, rotateZ: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
            )}

            <motion.div className="pm-planet-img-wrap" animate={{ rotateY: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
              <img src={planet.img} alt={planet.name} className="pm-planet-img" />
              <div className="pm-planet-atmo" style={{ boxShadow: `0 0 80px ${planet.glow}, inset 0 0 40px ${planet.color}20` }} />
            </motion.div>

            {/* Orbiting moon dot */}
            <motion.div className="pm-moon-orbit" style={{ borderColor: `${planet.color}25` }}
              animate={{ rotateZ: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
              <div className="pm-moon-dot" style={{ background: planet.accent }} />
            </motion.div>

            {/* Secondary orbit */}
            <motion.div className="pm-moon-orbit2" style={{ borderColor: `${planet.color}15` }}
              animate={{ rotateZ: -360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
              <div className="pm-moon-dot2" style={{ background: `${planet.color}80` }} />
            </motion.div>
          </div>

          {/* Planet info below image */}
          <div className="pm-planet-meta">
            <div className="pm-symbol-big" style={{ color: planet.color }}>{planet.symbol}</div>
            <div className="pm-planet-name-big">{planet.name}</div>
            <div className="pm-tag-big" style={{ background: `${planet.color}20`, border: `1px solid ${planet.color}40`, color: planet.accent }}>
              {planet.tagIcon} {planet.tag}
            </div>
            <div className="pm-order-label" style={{ color: `${planet.color}40` }}>PLANET {String(planet.orderIndex).padStart(2, "0")}</div>
          </div>

          {/* Video toggle */}
          <button className="pm-video-btn" style={{ border: `1px solid ${planet.color}40`, color: planet.color }}
            onClick={() => setShowVideo(v => !v)}>
            {showVideo ? "◉ HIDE VIDEO" : "▶ WATCH FLYBY"}
          </button>
        </div>

        {/* Right info column */}
        <div className="pm-info">
          {/* Tabs */}
          <div className="pm-tabs">
            {["overview", "stats", "exploration"].map(t => (
              <button key={t} className={`pm-tab ${activeTab === t ? "pm-tab-active" : ""}`}
                style={activeTab === t ? { color: planet.accent, borderBottomColor: planet.color } : {}}
                onClick={() => setActiveTab(t)}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="pm-title" style={{ color: "#F0E8FF" }}>{planet.name}</h2>
                <p className="pm-roman" style={{ color: `${planet.color}60` }}>{planet.romanName} / {planet.type.toUpperCase()}</p>
                <p className="pm-main-desc">{planet.desc}</p>
                <p className="pm-long-desc">{planet.longDesc}</p>
                <div className="pm-fact-box" style={{ borderColor: `${planet.color}40`, background: `${planet.color}08` }}>
                  <span className="pm-fact-icon" style={{ color: planet.color }}>✦</span>
                  <p className="pm-fact-text">{planet.fact}</p>
                </div>
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h3 className="pm-tab-title" style={{ color: planet.accent }}>MISSION DATA</h3>
                <div className="pm-stats-grid">
                  {planet.stats.map((s, i) => (
                    <motion.div key={i} className="pm-stat-card" style={{ borderColor: `${planet.color}20`, background: `${planet.color}06` }}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                      <span className="pm-stat-icon">{s.icon}</span>
                      <span className="pm-stat-val" style={{ color: planet.accent }}>{s.val}</span>
                      <span className="pm-stat-lbl">{s.label}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="pm-bar-section">
                  <div className="pm-bar-label-row">
                    <span style={{ color: `${planet.color}60`, fontSize: "0.6rem", letterSpacing: "0.15em" }}>EXPLORATION PRIORITY INDEX</span>
                    <span style={{ color: planet.accent, fontFamily: "Space Mono, monospace", fontSize: "0.75rem" }}>
                      {[55, 42, 98, 85, 70, 60, 52, 78][planet.orderIndex - 1]}%
                    </span>
                  </div>
                  <div className="pm-bar-track">
                    <motion.div className="pm-bar-fill"
                      style={{ background: `linear-gradient(90deg, ${planet.colorAlt}, ${planet.color}, ${planet.accent})`, boxShadow: `0 0 12px ${planet.glow}` }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${[55, 42, 98, 85, 70, 60, 52, 78][planet.orderIndex - 1]}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "exploration" && (
              <motion.div key="exploration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h3 className="pm-tab-title" style={{ color: planet.accent }}>EXPLORATION LOG</h3>
                {[
                  { mission: planet.orderIndex <= 4 ? "Mariner Program" : "Pioneer Program", year: "1960s–70s", desc: "First close-up images captured" },
                  { mission: planet.orderIndex <= 4 ? "Voyager Flyby" : "Cassini-Huygens", year: "1979–89", desc: "Detailed atmospheric and surface mapping" },
                  { mission: "New Horizons", year: "2006–15", desc: "Long-range imaging and spectral analysis" },
                ].map((e, i) => (
                  <motion.div key={i} className="pm-mission-entry" style={{ borderColor: `${planet.color}20` }}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="pm-mission-dot" style={{ background: planet.color, boxShadow: `0 0 8px ${planet.color}` }} />
                    <div>
                      <div className="pm-mission-name" style={{ color: planet.accent }}>{e.mission} <span style={{ color: `${planet.color}50` }}>{e.year}</span></div>
                      <div className="pm-mission-desc">{e.desc}</div>
                    </div>
                  </motion.div>
                ))}
                <div className="pm-future-badge" style={{ background: `${planet.color}10`, border: `1px solid ${planet.color}30` }}>
                  <span style={{ color: planet.accent }}>◉</span> Future missions planned for this world
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video embed */}
          <AnimatePresence>
            {showVideo && (
              <motion.div className="pm-video-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 220 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${planet.videoId}?autoplay=1&mute=1&loop=1&playlist=${planet.videoId}&controls=0&showinfo=0&rel=0`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="pm-video-frame"
                  style={{ borderColor: `${planet.color}30` }}
                  title={`${planet.name} video`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative corners */}
        <div className="pm-corner pm-tl" style={{ borderColor: `${planet.color}70` }} />
        <div className="pm-corner pm-br" style={{ borderColor: `${planet.color}70` }} />
        <div className="pm-corner pm-tr" style={{ borderColor: `${planet.color}40` }} />
        <div className="pm-corner pm-bl" style={{ borderColor: `${planet.color}40` }} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORRERY STRIP — interactive orbit diagram
═══════════════════════════════════════════════════════════════ */
function OrreryStrip({ onSelect }) {
  return (
    <div className="orrery-wrap">
      <div className="orrery-sun">
        <motion.div className="orrery-sun-inner" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <div className="orrery-planets">
        {PLANETS.map((p, i) => (
          <motion.div key={p.id} className="orrery-item" onClick={() => onSelect(p)}
            whileHover={{ scale: 1.6 }} title={p.name}>
            <div className="orrery-line" style={{ width: `${18 + i * 10}px`, background: `linear-gradient(90deg, ${p.color}15, ${p.color}40)` }} />
            <motion.div
              className="orrery-dot"
              style={{ background: `radial-gradient(circle at 35% 35%, ${p.accent}, ${p.colorAlt})`, width: `${8 + i * 1.5}px`, height: `${8 + i * 1.5}px`, boxShadow: `0 0 12px ${p.glow}` }}
              animate={{ boxShadow: [`0 0 8px ${p.glow}`, `0 0 20px ${p.glow}`, `0 0 8px ${p.glow}`] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="orrery-label" style={{ color: `${p.color}70` }}>{p.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div className="hero-section" ref={ref} style={{ y, opacity }}>
      <div className="hero-bg-video">
        <iframe
          src="https://www.youtube.com/embed/libKVRa01L8?autoplay=1&mute=1&loop=1&playlist=libKVRa01L8&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
          allow="autoplay; encrypted-media"
          className="hero-iframe"
          title="Space background"
        />
        <div className="hero-video-overlay" />
      </div>

      <div className="hero-content">
        <motion.div className="hero-eyebrow"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="hero-dot" />
          SOLAR SYSTEM EXPLORER
        </motion.div>

        <motion.h1 className="hero-title"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          THE EIGHT
          <br />
          <span className="hero-title-acc">WORLDS</span>
        </motion.h1>

        <motion.p className="hero-sub"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}>
          From Mercury's scorched craters to Neptune's midnight storms —
          <br />explore every planet orbiting our ancient star.
        </motion.p>

        <motion.div className="hero-cta-row"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }}>
          <a href="#planets" className="hero-btn-primary">BEGIN EXPLORATION ↓</a>
        </motion.div>

        {/* Animated orbital rings decorative */}
        <div className="hero-rings">
          {[200, 300, 420].map((s, i) => (
            <motion.div key={i} className="hero-ring"
              style={{ width: s, height: s, borderColor: `rgba(139,92,246,${0.06 - i * 0.015})` }}
              animate={{ rotateZ: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="hero-scroll-hint"
        animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <div className="hero-scroll-dot" />
        SCROLL
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FACTS TICKER
═══════════════════════════════════════════════════════════════ */
const FACTS = PLANETS.map(p => `${p.symbol} ${p.name} — ${p.fact}`);
function FactTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % FACTS.length), 4000); return () => clearInterval(t); }, []);
  const p = PLANETS[idx];
  return (
    <div className="ticker-wrap">
      <div className="ticker-label" style={{ color: `${p.color}80` }}>◉ DID YOU KNOW</div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} className="ticker-fact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} style={{ color: p.accent }}>
          {FACTS[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIZE COMPARISON SECTION
═══════════════════════════════════════════════════════════════ */
const SIZE_DATA = [
  { name: "Mercury", diameter: 4879,   color: "#B8A898", accent: "#D4C4B4", glow: "rgba(184,168,152,0.5)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/800px-Mercury_in_color_-_Prockter07-edit1.jpg" },
  { name: "Venus",   diameter: 12104,  color: "#E8C882", accent: "#F4D898", glow: "rgba(232,200,130,0.5)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/800px-Venus-real_color.jpg" },
  { name: "Earth",   diameter: 12742,  color: "#4A9ECA", accent: "#7AC4EA", glow: "rgba(74,158,202,0.5)",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg" },
  { name: "Mars",    diameter: 6779,   color: "#C1440E", accent: "#E05A20", glow: "rgba(193,68,14,0.5)",   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg" },
  { name: "Jupiter", diameter: 139820, color: "#C8956C", accent: "#E8B58C", glow: "rgba(200,149,108,0.5)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg" },
  { name: "Saturn",  diameter: 116460, color: "#D4A96A", accent: "#F0C98A", glow: "rgba(212,169,106,0.5)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg" },
  { name: "Uranus",  diameter: 50724,  color: "#7AC8D4", accent: "#9AE8F4", glow: "rgba(122,200,212,0.5)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/800px-Uranus2.jpg" },
  { name: "Neptune", diameter: 49244,  color: "#4060D8", accent: "#6080F8", glow: "rgba(64,96,216,0.5)",   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/800px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg" },
];
const MAX_DIAM = 139820;
const MAX_VIS  = 160; // px — Jupiter's max rendered size

function SizeComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(null);

  return (
    <section className="size-section" ref={ref}>
      {/* subtle nebula */}
      <div className="size-nebula" />

      <div className="section-inner">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="s-eyebrow"><div className="s-eyebrow-dot" />SCALE & MAGNITUDE</div>
          <h2 className="s-title">Size <span className="acc">Comparison</span></h2>
          <p className="s-sub">All eight planets rendered to scale — hover to reveal exact diameters and see how they stack up against each other.</p>
          <div className="s-divider" />
        </motion.div>

        {/* Planets bar */}
        <motion.div
          className="size-bar"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          {SIZE_DATA.map((p, i) => {
            const size = Math.max(12, (p.diameter / MAX_DIAM) * MAX_VIS);
            const isHov = hovered === p.name;
            return (
              <motion.div
                key={p.name}
                className="size-planet-wrap"
                onMouseEnter={() => setHovered(p.name)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {isHov && (
                    <motion.div className="size-tooltip"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      style={{ borderColor: `${p.color}40`, background: "rgba(3,0,14,0.97)" }}>
                      <span className="size-tt-name" style={{ color: p.accent }}>{p.name}</span>
                      <span className="size-tt-val" style={{ color: p.color }}>{p.diameter.toLocaleString()} km</span>
                      <span className="size-tt-earths" style={{ color: `${p.color}70` }}>
                        {(p.diameter / 12742).toFixed(2)}× Earth
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Planet sphere */}
                <motion.div
                  className="size-sphere"
                  style={{
                    width: size, height: size,
                    boxShadow: isHov ? `0 0 ${size * 0.5}px ${p.glow}, 0 0 ${size}px ${p.glow}30` : `0 0 ${size * 0.25}px ${p.glow}50`,
                  }}
                  animate={{ scale: isHov ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <img src={p.img} alt={p.name} className="size-sphere-img" />
                  {/* atmosphere rim */}
                  <div className="size-atmo" style={{ boxShadow: `inset 0 0 ${size * 0.3}px ${p.color}30, 0 0 ${size * 0.4}px ${p.glow}40` }} />
                  {/* Saturn rings */}
                  {p.name === "Saturn" && (
                    <motion.div className="size-rings"
                      style={{ width: size * 2.2, height: size * 0.32, borderColor: `${p.color}50` }}
                      animate={{ rotateX: 72 }} />
                  )}
                </motion.div>

                {/* Name label */}
                <motion.div className="size-label"
                  style={{ color: isHov ? p.accent : `${p.color}60` }}
                  animate={{ opacity: isHov ? 1 : 0.55 }}
                  transition={{ duration: 0.25 }}>
                  {p.name}
                </motion.div>

                {/* Diameter bar underneath */}
                <div className="size-diam-bar-track">
                  <motion.div className="size-diam-bar-fill"
                    style={{ background: `linear-gradient(90deg, ${p.color}80, ${p.accent})` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(p.diameter / MAX_DIAM) * 100}%` } : { width: 0 }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend row */}
        <motion.div className="size-legend"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
          <span className="size-legend-item"><span style={{ color: "#a78bfa" }}>◉</span> Spheres shown to relative scale</span>
          <span className="size-legend-item"><span style={{ color: "#38bdf8" }}>◎</span> Hover for exact measurements</span>
          <span className="size-legend-item"><span style={{ color: "#f97316" }}>◈</span> Jupiter is 11.7× wider than Earth</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SOLAR SYSTEM TIMELINE
═══════════════════════════════════════════════════════════════ */
const TIMELINE_EVENTS = [
  { year: "4.6 Billion BCE", title: "Solar Nebula Collapses", desc: "A giant cloud of gas and dust collapses under its own gravity, triggering the birth of our Sun and the protoplanetary disk from which all planets would form.", color: "#f97316", icon: "☀" },
  { year: "4.5 Billion BCE", title: "Rocky Planets Form", desc: "Mercury, Venus, Earth, and Mars accrete from solid materials in the inner solar system — a violent process of collisions, mergers, and bombardments lasting millions of years.", color: "#B8A898", icon: "⬡" },
  { year: "4.5 Billion BCE", title: "Moon-Forming Impact", desc: "A Mars-sized protoplanet named Theia slams into early Earth. The debris from this catastrophic collision coalesces into our Moon within centuries.", color: "#4A9ECA", icon: "◑" },
  { year: "4.0 Billion BCE", title: "Gas Giants Migrate", desc: "Jupiter and Saturn's gravitational dance reshapes the outer solar system. Their migration flings icy bodies inward, potentially delivering water to Earth.", color: "#C8956C", icon: "♃" },
  { year: "3.8 Billion BCE", title: "Late Heavy Bombardment", desc: "A cataclysmic period of intense asteroid impacts scars all inner planets. The Moon's impact craters visible today are relics of this era.", color: "#C1440E", icon: "☄" },
  { year: "3.5 Billion BCE", title: "Life Emerges on Earth", desc: "The first single-celled organisms appear in Earth's oceans — making our planet the only known world to host life in the entire universe.", color: "#4ade80", icon: "◉" },
  { year: "1610 CE", title: "Galileo's Discovery", desc: "Galileo Galilei turns his telescope on Jupiter and discovers four large moons orbiting it — the first direct evidence that not everything orbits Earth.", color: "#E8C882", icon: "🔭" },
  { year: "1977 CE", title: "Voyager Launches", desc: "NASA launches Voyager 1 & 2, which would go on to photograph Jupiter, Saturn, Uranus, and Neptune — giving humanity its first close look at the outer planets.", color: "#7AC8D4", icon: "🚀" },
  { year: "1990 CE", title: "Pale Blue Dot", desc: "Voyager 1 turns its camera back toward Earth from 6 billion km away. Carl Sagan's famous 'Pale Blue Dot' photo — our entire world as a single pixel.", color: "#4060D8", icon: "♁" },
  { year: "2030s CE", title: "Humanity Reaches Mars", desc: "Planned crewed missions aim to land humans on Mars within this decade — the next giant leap for our species beyond the Earth-Moon system.", color: "#C1440E", icon: "♂" },
];

function TimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(null);

  return (
    <section className="tl-section" ref={ref}>
      <div className="tl-nebula-left" />
      <div className="tl-nebula-right" />

      <div className="section-inner">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="s-eyebrow"><div className="s-eyebrow-dot" />4.6 BILLION YEARS</div>
          <h2 className="s-title">Cosmic <span className="acc">Timeline</span></h2>
          <p className="s-sub">From the birth of our Sun to humanity's first steps toward the stars — the epic story of our solar system across deep time.</p>
          <div className="s-divider" />
        </motion.div>

        <div className="tl-track">
          {/* Vertical spine */}
          <motion.div className="tl-spine"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} />

          {TIMELINE_EVENTS.map((ev, i) => {
            const isLeft = i % 2 === 0;
            const isActive = active === i;
            return (
              <motion.div
                key={i}
                className={`tl-item ${isLeft ? "tl-left" : "tl-right"}`}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActive(isActive ? null : i)}
              >
                {/* Node dot */}
                <motion.div className="tl-node"
                  style={{ background: ev.color, boxShadow: `0 0 20px ${ev.color}80` }}
                  animate={isActive ? { scale: 1.5, boxShadow: `0 0 40px ${ev.color}` } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="tl-node-icon">{ev.icon}</span>
                </motion.div>

                {/* Connector line */}
                <div className="tl-connector" style={{ background: `linear-gradient(${isLeft ? "to left" : "to right"}, transparent, ${ev.color}50)` }} />

                {/* Card */}
                <motion.div className="tl-card"
                  style={{ borderColor: isActive ? `${ev.color}60` : `${ev.color}20`, background: isActive ? `${ev.color}08` : "rgba(4,0,16,0.8)" }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                  <div className="tl-card-year" style={{ color: ev.color }}>{ev.year}</div>
                  <h3 className="tl-card-title" style={{ color: "#F0E8FF" }}>{ev.title}</h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p className="tl-card-desc"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}>
                        {ev.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {!isActive && <p className="tl-card-hint">Click to expand →</p>}
                  {/* accent bar */}
                  <motion.div className="tl-card-bar"
                    style={{ background: ev.color }}
                    animate={{ width: isActive ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom label */}
        <motion.div className="tl-bottom-label"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>
          <span className="tl-end-dot" />
          <span>THE STORY CONTINUES…</span>
          <span className="tl-end-dot" />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function PlanetsPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const selectedIdx = selected ? PLANETS.findIndex(p => p.id === selected.id) : -1;
  const onNext = () => setSelected(PLANETS[(selectedIdx + 1) % PLANETS.length]);
  const onPrev = () => setSelected(PLANETS[(selectedIdx - 1 + PLANETS.length) % PLANETS.length]);

  const FILTERS = ["ALL", "TERRESTRIAL", "GAS GIANT", "ICE GIANT", "ROCKY", "HABITABLE"];
  const filtered = filter === "ALL" ? PLANETS : PLANETS.filter(p => p.tag === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .planets-page {
          background: #000005;
          color: white;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ──────────────────────────── STARS ── */
        .stars-field { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .star {
          position: absolute; border-radius: 50%; background: #fff;
          animation: twinkle var(--dur, 3s) var(--del, 0s) ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          from { opacity: 0.03; transform: scale(0.5); }
          to { opacity: 0.85; transform: scale(1.4); }
        }

        /* ──────────────────────────── HERO ── */
        .hero-section {
          position: relative; height: 100vh; min-height: 700px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; will-change: transform;
        }
        .hero-bg-video {
          position: absolute; inset: 0; overflow: hidden;
        }
        .hero-iframe {
          width: 100%; height: 100%; border: none; pointer-events: none;
          transform: scale(1.15);
          filter: brightness(0.35) saturate(1.5);
        }
        .hero-video-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,5,0.3) 0%, rgba(0,0,5,0.0) 40%, rgba(0,0,5,0.8) 100%);
        }
        .hero-content {
          position: relative; z-index: 2; text-align: center; padding: 0 20px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 20px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.4);
          background: rgba(109,40,217,0.12);
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; color: #a78bfa;
          margin-bottom: 28px;
        }
        .hero-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 10px #a78bfa;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.1} }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 800; line-height: 0.92;
          color: #F0E8FF; letter-spacing: -0.02em;
          text-shadow: 0 0 80px rgba(139,92,246,0.2);
        }
        .hero-title-acc {
          background: linear-gradient(135deg, #c084fc 0%, #818cf8 45%, #f97316 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-sub {
          margin-top: 22px; font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: rgba(196,181,253,0.55); line-height: 1.7; font-weight: 300;
        }
        .hero-cta-row { margin-top: 36px; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .hero-btn-primary {
          padding: 14px 36px; border-radius: 6px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white; text-decoration: none;
          font-family: 'Space Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.15em; font-weight: 700;
          box-shadow: 0 8px 40px rgba(124,58,237,0.4);
          transition: all 0.3s; border: 1px solid rgba(139,92,246,0.4);
        }
        .hero-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 60px rgba(124,58,237,0.6); }
        .hero-rings {
          position: absolute; top: 50%; left: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
        }
        .hero-ring {
          position: absolute; border-radius: 50%; border: 1px solid;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .hero-scroll-hint {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-family: 'Space Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.2em; color: rgba(196,181,253,0.4); z-index: 2;
        }
        .hero-scroll-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(139,92,246,0.7); box-shadow: 0 0 10px rgba(139,92,246,0.7);
        }

        /* ──────────────────────────── SECTION WRAPPER ── */
        .planets-section {
          position: relative; z-index: 1;
          padding: 100px 0 140px;
          background: linear-gradient(180deg, #000005 0%, #08001A 30%, #020010 70%, #000005 100%);
        }
        .section-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; }

        /* nebulae */
        .nebula {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(110px); animation: nebpulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes nebpulse { from{opacity:var(--a)} to{opacity:var(--b)} }

        /* glow lines */
        .glow-line {
          position: absolute; left: 0; right: 0; height: 1px; z-index: 2;
          background: linear-gradient(90deg, transparent 0%, #7c3aed 30%, #f97316 70%, transparent 100%);
          background-size: 300% 100%;
          animation: glide 8s linear infinite;
        }
        .glow-line.top { top: 0; }
        .glow-line.bot { bottom: 0; animation-delay: -4s; }
        @keyframes glide { 0%{background-position:300% 0} 100%{background-position:-300% 0} }

        /* ──────────────────────────── SECTION HEADER ── */
        .section-header { text-align: center; margin-bottom: 60px; }
        .s-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 5px 18px; border-radius: 40px;
          border: 1px solid rgba(139,92,246,0.3);
          background: rgba(109,40,217,0.08);
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.2em; color: #a78bfa;
          margin-bottom: 20px;
        }
        .s-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 8px #a78bfa; animation: blink 1.4s ease-in-out infinite; }
        .s-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800; color: #F0E8FF; letter-spacing: -0.02em; line-height: 1.05;
        }
        .s-title .acc {
          background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .s-sub {
          margin-top: 14px; font-size: 1rem; color: rgba(196,181,253,0.5);
          font-weight: 300; line-height: 1.75; max-width: 520px; margin-left: auto; margin-right: auto;
        }
        .s-divider { width: 60px; height: 1px; margin: 28px auto; background: linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent); }

        /* ──────────────────────────── ORRERY ── */
        .orrery-wrap {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 48px; overflow-x: auto;
          padding: 20px 0; scrollbar-width: none;
          mask: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
        .orrery-wrap::-webkit-scrollbar { display: none; }
        .orrery-sun {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: radial-gradient(circle at 40% 35%, #fff8c0, #FDB813, #f97316, #c1440e);
          box-shadow: 0 0 50px #f97316, 0 0 100px rgba(249,115,22,0.35);
          z-index: 2; position: relative;
        }
        .orrery-sun-inner { width: 100%; height: 100%; border-radius: 50%; background: inherit; }
        .orrery-planets { display: flex; align-items: center; }
        .orrery-item { display: flex; align-items: center; cursor: pointer; position: relative; }
        .orrery-line { height: 1px; flex-shrink: 0; }
        .orrery-dot { border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.1); flex-shrink: 0; transition: transform 0.3s; }
        .orrery-item:hover .orrery-dot { transform: scale(1.8) !important; }
        .orrery-label {
          position: absolute; top: 22px; left: 50%; transform: translateX(-50%);
          font-family: 'Space Mono', monospace; font-size: 0.42rem; letter-spacing: 0.1em;
          white-space: nowrap; pointer-events: none;
        }

        /* ──────────────────────────── FILTER ── */
        .filter-row {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 44px;
        }
        .filter-btn {
          padding: 7px 18px; border-radius: 40px; border: 1px solid rgba(139,92,246,0.2);
          background: rgba(109,40,217,0.05);
          font-family: 'Space Mono', monospace; font-size: 0.52rem;
          letter-spacing: 0.12em; color: rgba(196,181,253,0.4);
          cursor: pointer; transition: all 0.25s;
        }
        .filter-btn:hover { border-color: rgba(139,92,246,0.5); color: #c084fc; }
        .filter-btn.active {
          background: rgba(124,58,237,0.2); border-color: rgba(139,92,246,0.6);
          color: #c084fc; box-shadow: 0 0 20px rgba(124,58,237,0.2);
        }

        /* ──────────────────────────── GRID ── */
        .planets-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1280px) { .planets-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .planets-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .planets-grid { grid-template-columns: 1fr; } }

        /* ──────────────────────────── PLANET CARD ── */
        .planet-card-outer { will-change: transform; }
        .planet-card {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(4,0,16,0.96);
          cursor: pointer; transform-style: preserve-3d;
          backdrop-filter: blur(12px);
          transition: border-color 0.4s;
        }
        .planet-card:hover { border-color: rgba(255,255,255,0.1); }

        .pc-image-area { position: relative; height: 200px; overflow: hidden; }
        .pc-planet-sphere { width: 100%; height: 100%; overflow: hidden; }
        .pc-planet-img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
        .pc-orbit-ring-anim {
          position: absolute; inset: -20px; border-radius: 50%;
          border: 1px dashed; transform-origin: center;
          pointer-events: none;
        }
        .pc-orbit-dot-anim {
          position: absolute; top: -4px; left: 50%;
          width: 8px; height: 8px; border-radius: 50%;
          transform: translateX(-50%);
        }
        .pc-atmo-shimmer { position: absolute; inset: 0; pointer-events: none; }
        .pc-scan-line { position: absolute; left: 0; right: 0; top: 0; height: 40%; z-index: 3; pointer-events: none; }
        .pc-badges { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: flex-start; z-index: 5; }
        .pc-tag {
          padding: 3px 10px; border-radius: 20px;
          font-family: 'Space Mono', monospace; font-size: 0.44rem; letter-spacing: 0.12em;
        }
        .pc-order-badge {
          font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700;
        }
        .pc-symbol-float {
          position: absolute; bottom: 12px; right: 14px; z-index: 5;
          font-size: 1.5rem; line-height: 1;
        }
        .pc-cursor-glow { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .pc-hover-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .pc-border-glow { position: absolute; inset: 0; border-radius: 20px; z-index: 8; pointer-events: none; }

        .pc-info-panel { position: relative; z-index: 6; padding: 18px 18px 20px; }
        .pc-name-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
        .pc-roman-name { font-family: 'Space Mono', monospace; font-size: 0.45rem; letter-spacing: 0.2em; margin-bottom: 2px; }
        .pc-name { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: #F0E8FF; }
        .pc-type-pill {
          padding: 3px 10px; border-radius: 4px; white-space: nowrap;
          font-family: 'Space Mono', monospace; font-size: 0.42rem; letter-spacing: 0.1em;
          margin-top: 4px; flex-shrink: 0;
        }
        .pc-desc { font-size: 0.78rem; color: rgba(196,181,253,0.45); line-height: 1.65; font-weight: 300; }
        .pc-quick-stats { display: flex; gap: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04); }
        .pc-qs-item { display: flex; flex-direction: column; gap: 2px; }
        .pc-qs-val { font-family: 'Space Mono', monospace; font-size: 0.72rem; font-weight: 700; }
        .pc-qs-label { font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(196,181,253,0.35); }
        .pc-indicators { display: flex; gap: 12px; margin-top: 10px; }
        .pc-indicator { font-family: 'Space Mono', monospace; font-size: 0.5rem; letter-spacing: 0.08em; }
        .pc-explore-btn {
          margin-top: 14px; padding: 9px 20px; border-radius: 6px; border: none;
          cursor: pointer; font-family: 'Space Mono', monospace; font-size: 0.52rem;
          font-weight: 700; letter-spacing: 0.12em; color: white; display: block;
        }

        .pc-corner {
          position: absolute; width: 14px; height: 14px; z-index: 7; pointer-events: none;
        }
        .pc-tl { top: 8px; left: 8px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 3px 0 0 0; }
        .pc-br { bottom: 8px; right: 8px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 3px 0; }
        .pc-tr { top: 8px; right: 8px; border-top: 1.5px solid; border-right: 1.5px solid; border-radius: 0 3px 0 0; }
        .pc-bl { bottom: 8px; left: 8px; border-bottom: 1.5px solid; border-left: 1.5px solid; border-radius: 0 0 0 3px; }

        /* ──────────────────────────── TICKER ── */
        .ticker-wrap {
          background: rgba(4,0,16,0.7); border: 1px solid rgba(139,92,246,0.15);
          border-radius: 8px; padding: 14px 24px; margin-bottom: 48px;
          display: flex; align-items: center; gap: 20px; overflow: hidden;
        }
        .ticker-label {
          font-family: 'Space Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.18em; white-space: nowrap; flex-shrink: 0;
        }
        .ticker-fact {
          font-family: 'Space Mono', monospace; font-size: 0.7rem;
          letter-spacing: 0.04em; font-style: italic;
        }

        /* ──────────────────────────── MODAL ── */
        .pm-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; background: rgba(0,0,10,0.88);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
        }
        .pm-container {
          position: relative; max-width: 900px; width: 100%; max-height: 92vh;
          border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(3,0,14,0.98);
          box-shadow: 0 60px 140px rgba(0,0,0,0.95);
          display: grid; grid-template-columns: 260px 1fr;
          transform-style: preserve-3d;
        }
        @media (max-width: 700px) { .pm-container { grid-template-columns: 1fr; } }

        .pm-close {
          position: absolute; top: 14px; right: 14px; z-index: 20;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(0,0,14,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 0.85rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px);
        }
        .pm-close:hover { background: rgba(109,40,217,0.4); color: white; transform: scale(1.1) rotate(90deg); }

        .pm-nav {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(0,0,14,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 1.3rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px);
        }
        .pm-nav:hover { background: rgba(109,40,217,0.4); color: white; }
        .pm-prev { left: -48px; } .pm-next { right: -48px; }
        @media (max-width: 1000px) { .pm-prev { left: 6px; } .pm-next { right: 6px; } }

        .pm-visual {
          padding: 32px 22px 24px; border-right: 1px solid rgba(255,255,255,0.04);
          background: rgba(0,0,10,0.5); display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .pm-planet-showcase { position: relative; width: 170px; height: 170px; }
        .pm-rings {
          position: absolute; width: 280px; height: 80px; border-radius: 50%;
          border: 2px dashed; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(75deg);
          pointer-events: none;
        }
        .pm-planet-img-wrap { width: 170px; height: 170px; position: relative; }
        .pm-planet-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; filter: saturate(1.3); }
        .pm-planet-atmo { position: absolute; inset: -8px; border-radius: 50%; pointer-events: none; }
        .pm-moon-orbit {
          position: absolute; inset: -36px; border-radius: 50%;
          border: 1px dashed; transform-origin: center;
        }
        .pm-moon-dot { position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; border-radius: 50%; transform: translateX(-50%); }
        .pm-moon-orbit2 {
          position: absolute; inset: -56px; border-radius: 50%;
          border: 1px dashed; transform-origin: center;
        }
        .pm-moon-dot2 { position: absolute; bottom: -4px; right: -4px; width: 6px; height: 6px; border-radius: 50%; }

        .pm-planet-meta { text-align: center; }
        .pm-symbol-big { font-size: 3rem; line-height: 1; margin-bottom: 4px; }
        .pm-planet-name-big { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: #F0E8FF; margin-bottom: 8px; }
        .pm-tag-big { display: inline-block; padding: 4px 14px; border-radius: 20px; font-family: 'Space Mono', monospace; font-size: 0.52rem; letter-spacing: 0.15em; }
        .pm-order-label { font-family: 'Space Mono', monospace; font-size: 0.45rem; letter-spacing: 0.2em; margin-top: 8px; }

        .pm-video-btn {
          padding: 8px 18px; border-radius: 6px; background: transparent;
          font-family: 'Space Mono', monospace; font-size: 0.52rem;
          letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s;
        }
        .pm-video-btn:hover { background: rgba(139,92,246,0.1); }

        .pm-info { padding: 28px 28px 24px; overflow-y: auto; max-height: 92vh; }
        .pm-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px; }
        .pm-tab {
          padding: 10px 18px; background: transparent; border: none; border-bottom: 2px solid transparent;
          font-family: 'Space Mono', monospace; font-size: 0.52rem; letter-spacing: 0.12em;
          color: rgba(196,181,253,0.35); cursor: pointer; transition: all 0.25s; margin-bottom: -1px;
        }
        .pm-tab:hover { color: rgba(196,181,253,0.7); }
        .pm-tab-active { font-weight: 700; }
        .pm-tab-title { font-family: 'Space Mono', monospace; font-size: 0.58rem; letter-spacing: 0.18em; margin-bottom: 16px; }
        .pm-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }
        .pm-roman { font-family: 'Space Mono', monospace; font-size: 0.52rem; letter-spacing: 0.15em; margin-bottom: 14px; }
        .pm-main-desc { font-size: 0.9rem; color: rgba(196,181,253,0.6); line-height: 1.7; font-weight: 300; margin-bottom: 12px; }
        .pm-long-desc { font-size: 0.8rem; color: rgba(196,181,253,0.4); line-height: 1.75; font-weight: 300; margin-bottom: 18px; }
        .pm-fact-box {
          padding: 12px 16px; border-radius: 8px; border-left: 3px solid;
          display: flex; gap: 10px; align-items: flex-start; margin-bottom: 4px;
        }
        .pm-fact-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .pm-fact-text { font-size: 0.82rem; color: rgba(224,207,255,0.7); line-height: 1.6; font-style: italic; }

        .pm-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .pm-stat-card {
          padding: 12px 14px; border-radius: 10px; border: 1px solid;
          display: flex; flex-direction: column; gap: 3px;
        }
        .pm-stat-icon { font-size: 1rem; margin-bottom: 2px; }
        .pm-stat-val { font-family: 'Space Mono', monospace; font-size: 0.88rem; font-weight: 700; }
        .pm-stat-lbl { font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(196,181,253,0.35); }
        .pm-bar-section { margin-top: 4px; }
        .pm-bar-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .pm-bar-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; }
        .pm-bar-fill { height: 100%; border-radius: 3px; }

        .pm-mission-entry {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 14px 0; border-bottom: 1px solid;
        }
        .pm-mission-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
        .pm-mission-name { font-family: 'Space Mono', monospace; font-size: 0.65rem; letter-spacing: 0.05em; margin-bottom: 4px; }
        .pm-mission-desc { font-size: 0.78rem; color: rgba(196,181,253,0.4); }
        .pm-future-badge { padding: 12px 16px; border-radius: 8px; margin-top: 16px; font-family: 'Space Mono', monospace; font-size: 0.58rem; letter-spacing: 0.08em; display: flex; gap: 10px; }

        .pm-video-wrap { margin-top: 20px; border-radius: 10px; overflow: hidden; }
        .pm-video-frame { width: 100%; height: 100%; border: 1px solid; border-radius: 10px; display: block; }

        .pm-corner { position: absolute; width: 20px; height: 20px; z-index: 11; pointer-events: none; }
        .pm-tl { top: 12px; left: 12px; border-top: 2px solid; border-left: 2px solid; border-radius: 5px 0 0 0; }
        .pm-br { bottom: 12px; right: 12px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 5px 0; }
        .pm-tr { top: 12px; right: 12px; border-top: 2px solid; border-right: 2px solid; border-radius: 0 5px 0 0; }
        .pm-bl { bottom: 12px; left: 12px; border-bottom: 2px solid; border-left: 2px solid; border-radius: 0 0 0 5px; }

        /* ──────────────────────────── COUNT STRIP ── */
        .count-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; border: 1px solid rgba(139,92,246,0.12);
          border-radius: 16px; overflow: hidden; margin-bottom: 60px;
          background: rgba(4,0,16,0.6);
        }
        @media (max-width: 700px) { .count-strip { grid-template-columns: repeat(2, 1fr); } }
        .count-item {
          padding: 28px 20px; border-right: 1px solid rgba(139,92,246,0.08);
          text-align: center; position: relative; overflow: hidden;
        }
        .count-item:last-child { border-right: none; }
        .count-val { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; line-height: 1; margin-bottom: 6px; }
        .count-lbl { font-family: 'Space Mono', monospace; font-size: 0.5rem; letter-spacing: 0.18em; color: rgba(196,181,253,0.4); }
        .count-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; }

        /* ──────────────────────────── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,14,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }

        /* ══════════════════════════ SIZE COMPARISON ══ */
        .size-section {
          position: relative; z-index: 1;
          padding: 160px 0 180px;
          background: linear-gradient(180deg, #000005 0%, #06001A 50%, #000005 100%);
          overflow: hidden;
          border-top: 1px solid rgba(139,92,246,0.08);
          border-bottom: 1px solid rgba(139,92,246,0.08);
        }
        .size-nebula {
          position: absolute; width: 900px; height: 500px; border-radius: 50%;
          background: radial-gradient(ellipse, #4f46e550, transparent);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(120px); pointer-events: none; opacity: 0.12;
        }

        .size-bar {
          display: flex; align-items: flex-end; justify-content: center;
          gap: 48px; flex-wrap: nowrap; padding: 40px 0 60px;
          min-height: 320px;
        }
        @media (max-width: 768px) { .size-bar { gap: 24px; overflow-x: auto; padding: 24px 16px 40px; } }

        .size-planet-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; position: relative; cursor: pointer; flex-shrink: 0;
        }

        .size-tooltip {
          position: absolute; bottom: calc(100% + 14px); left: 50%; transform: translateX(-50%);
          padding: 10px 14px; border-radius: 10px; border: 1px solid;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          white-space: nowrap; z-index: 30;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8);
          pointer-events: none;
        }
        .size-tt-name { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700; }
        .size-tt-val  { font-family: 'Space Mono', monospace; font-size: 0.7rem; }
        .size-tt-earths { font-family: 'Space Mono', monospace; font-size: 0.55rem; letter-spacing: 0.08em; }

        .size-sphere {
          border-radius: 50%; overflow: visible; position: relative; flex-shrink: 0;
          transition: box-shadow 0.4s;
        }
        .size-sphere-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
        .size-atmo { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
        .size-rings {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(72deg);
          border-radius: 50%; border: 2px solid; pointer-events: none;
        }

        .size-label {
          font-family: 'Space Mono', monospace; font-size: 0.48rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          transition: color 0.25s; text-align: center;
        }

        .size-diam-bar-track {
          width: 64px; height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;
        }
        .size-diam-bar-fill { height: 100%; border-radius: 1px; }

        .size-legend {
          display: flex; gap: 32px; justify-content: center; flex-wrap: wrap;
          margin-top: 36px; padding-top: 28px;
          border-top: 1px solid rgba(139,92,246,0.1);
        }
        .size-legend-item {
          font-family: 'Space Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; color: rgba(196,181,253,0.35);
          display: flex; align-items: center; gap: 8px;
        }

        /* ══════════════════════════ TIMELINE ══ */
        .tl-section {
          position: relative; z-index: 1;
          padding: 160px 0 180px;
          background: linear-gradient(180deg, #000005 0%, #09001E 40%, #000005 100%);
          overflow: hidden;
          border-top: 1px solid rgba(139,92,246,0.08);
        }
        .tl-nebula-left {
          position: absolute; width: 600px; height: 800px; border-radius: 50%;
          background: radial-gradient(ellipse, #7c3aed25, transparent);
          top: 10%; left: -150px; filter: blur(100px); pointer-events: none;
          animation: nebpulse 12s ease-in-out infinite alternate;
          --a: 0.5; --b: 1;
        }
        .tl-nebula-right {
          position: absolute; width: 500px; height: 700px; border-radius: 50%;
          background: radial-gradient(ellipse, #c1440e20, transparent);
          bottom: 5%; right: -100px; filter: blur(100px); pointer-events: none;
          animation: nebpulse 14s ease-in-out infinite alternate;
          --a: 0.4; --b: 0.9;
        }

        .tl-track {
          position: relative; max-width: 860px; margin: 0 auto;
          padding: 20px 0 40px;
        }

        .tl-spine {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(139,92,246,0.5) 10%, rgba(139,92,246,0.3) 80%, transparent);
          transform-origin: top center;
          transform: translateX(-50%);
        }
        @media (max-width: 700px) {
          .tl-spine { left: 20px; }
          .tl-item  { flex-direction: row !important; padding-left: 50px !important; padding-right: 0 !important; }
          .tl-item.tl-left  { flex-direction: row !important; }
          .tl-item.tl-right { flex-direction: row !important; }
          .tl-node  { left: 12px !important; right: auto !important; }
          .tl-connector { display: none; }
        }

        .tl-item {
          display: flex; align-items: center;
          margin-bottom: 48px; position: relative; cursor: pointer;
        }
        .tl-left  { flex-direction: row-reverse; padding-right: calc(50% + 48px); }
        .tl-right { flex-direction: row;         padding-left: calc(50% + 48px); }

        .tl-node {
          position: absolute; left: calc(50% - 18px);
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          z-index: 5; border: 2px solid rgba(255,255,255,0.15);
          cursor: pointer; flex-shrink: 0;
        }
        .tl-node-icon { font-size: 1rem; line-height: 1; }

        .tl-connector {
          position: absolute; left: 50%; height: 1px; width: 36px; z-index: 3;
        }
        .tl-left  .tl-connector { transform: translateX(-100%); }
        .tl-right .tl-connector { transform: translateX(0); }

        .tl-card {
          position: relative; padding: 16px 20px 18px;
          border-radius: 14px; border: 1px solid;
          width: 100%; overflow: hidden;
          transition: border-color 0.35s, background 0.35s;
        }
        .tl-card-year {
          font-family: 'Space Mono', monospace; font-size: 0.52rem;
          letter-spacing: 0.18em; margin-bottom: 5px;
        }
        .tl-card-title {
          font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700;
          margin-bottom: 6px; line-height: 1.25;
        }
        .tl-card-desc {
          font-size: 0.8rem; color: rgba(196,181,253,0.55); line-height: 1.7;
          font-weight: 300; overflow: hidden;
        }
        .tl-card-hint {
          font-family: 'Space Mono', monospace; font-size: 0.48rem;
          letter-spacing: 0.12em; color: rgba(196,181,253,0.25); margin-top: 4px;
        }
        .tl-card-bar {
          position: absolute; bottom: 0; left: 0; height: 2px; border-radius: 0 2px 2px 0;
        }

        .tl-bottom-label {
          display: flex; align-items: center; gap: 16px; justify-content: center;
          margin-top: 48px;
          font-family: 'Space Mono', monospace; font-size: 0.52rem;
          letter-spacing: 0.22em; color: rgba(196,181,253,0.25);
        }
        .tl-end-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(139,92,246,0.5); box-shadow: 0 0 10px rgba(139,92,246,0.5); }
      `}</style>

      <div className="planets-page">

        {/* Fixed star field */}
        <div className="stars-field">
          {STARS.map(s => (
            <div key={s.id} className="star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.r}px`, height: `${s.r}px`,
              "--dur": `${s.dur}s`, "--del": `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* ── HERO ─────────────────────────────── */}
        <HeroSection />

        {/* ── PLANETS SECTION ──────────────────── */}
        <section className="planets-section" id="planets" ref={sectionRef}>
          {/* Floating particle canvas */}
          <ParticleField />

          {/* Nebulae */}
          <div className="nebula" style={{ width: 700, height: 500, background: "radial-gradient(ellipse, #7c3aed, transparent)", top: "-80px", left: "-120px", "--dur": "11s", "--a": "0.07", "--b": "0.14" }} />
          <div className="nebula" style={{ width: 600, height: 450, background: "radial-gradient(ellipse, #c1440e, transparent)", bottom: "-60px", right: "-100px", "--dur": "13s", "--a": "0.06", "--b": "0.12" }} />
          <div className="nebula" style={{ width: 500, height: 350, background: "radial-gradient(ellipse, #1e40af, transparent)", top: "40%", left: "30%", "--dur": "9s", "--a": "0.04", "--b": "0.08" }} />

          {/* Glow bars */}
          <div className="glow-line top" />
          <div className="glow-line bot" />

          <div className="section-inner">

            {/* Header */}
            <motion.div className="section-header"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="s-eyebrow">
                <div className="s-eyebrow-dot" />
                SOLAR SYSTEM
              </div>
              <h2 className="s-title">Explore the <span className="acc">Planets</span></h2>
              <p className="s-sub">Eight worlds, each with their own story — ancient, violent, beautiful, and mysterious.</p>
              <div className="s-divider" />
            </motion.div>

            {/* Stats strip */}
            <motion.div className="count-strip"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}>
              {[
                { val: "8", lbl: "PLANETS", color: "#a78bfa" },
                { val: "290+", lbl: "KNOWN MOONS", color: "#38bdf8" },
                { val: "4.6B", lbl: "YEARS OLD", color: "#f97316" },
                { val: "4.5T", lbl: "KM ACROSS", color: "#4ade80" },
              ].map((c, i) => (
                <div key={i} className="count-item">
                  <div className="count-val" style={{ color: c.color }}>{c.val}</div>
                  <div className="count-lbl">{c.lbl}</div>
                  <div className="count-accent" style={{ background: `linear-gradient(90deg, transparent, ${c.color}40, transparent)` }} />
                </div>
              ))}
            </motion.div>

            {/* Orrery */}
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
              <OrreryStrip onSelect={setSelected} />
            </motion.div>

            {/* Fact ticker */}
            <FactTicker />

            {/* Filter buttons */}
            <motion.div className="filter-row"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}>
              {FILTERS.map(f => (
                <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </motion.div>

            {/* Planet Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                className="planets-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                {filtered.map((planet, i) => (
                  <PlanetCard key={planet.id} planet={planet} index={i} onSelect={setSelected} />
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* ── SIZE COMPARISON ─────────────────── */}
        <SizeComparisonSection />

        {/* ── TIMELINE ─────────────────────────── */}
        <TimelineSection />

        {/* ── MODAL ─────────────────────────────── */}
        <AnimatePresence>
          {selected && (
            <PlanetModal
              planet={selected}
              onClose={() => setSelected(null)}
              onNext={onNext}
              onPrev={onPrev}
            />
          )}
        </AnimatePresence>

      </div>
    </>
  );
}