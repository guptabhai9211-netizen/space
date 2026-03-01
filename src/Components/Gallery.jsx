 import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";

/* ── Gallery data ─────────────────────────────────────────── */
const GALLERY = [
  {
    url: "https://blogcdn.aakash.ac.in/wordpress_media/2024/08/A.P.J.-Abdul-Kalam.jpg",
    title: "A.P.J. Abdul Kalam",
    sub: "Scientist and former President of India",
    size: "large",
    color: "#7c3aed",
    category: "Visionaries",
    born: "1931",
    died: "2015",
    award: "Bharat Ratna",
    quote: "Dream, Dream, Dream. Dreams transform into thoughts and thoughts result in action.",
    role: "Missile Man of India",
    contributions: ["Agni Missile", "IGMDP Program", "Nuclear Tests 1998", "PSLV Development"],
    skills: [
      { name: "Aerospace Engineering", pct: 98 },
      { name: "Missile Technology", pct: 96 },
      { name: "Nuclear Physics", pct: 85 },
    ],
  },
  {
    url: "https://www.indiastrategic.in/wp-content/uploads/2024/08/LR_Remembering-Vikram-Sarabhai.jpg",
    title: "Dr. Vikram Sarabhai",
    sub: "The Father of the Indian Space Programme",
    size: "normal",
    color: "#4f46e5",
    category: "Pioneers",
    born: "1919",
    died: "1971",
    award: "Padma Bhushan",
    quote: "There are some who question the relevance of space activities in a developing nation.",
    role: "ISRO Founder",
    contributions: ["Founded ISRO", "INCOSPAR", "First Indian Satellite", "Thumba Rocket Station"],
    skills: [
      { name: "Space Science", pct: 99 },
      { name: "Physics", pct: 94 },
      { name: "Leadership", pct: 97 },
    ],
  },
  {
    url: "https://speak2world.wordpress.com/wp-content/uploads/2014/10/homi.jpg",
    title: "Dr. Homi Bhabha",
    sub: "The father of the Indian nuclear programme",
    size: "normal",
    color: "#f97316",
    category: "Nuclear",
    born: "1909",
    died: "1966",
    award: "Adams Prize",
    quote: "No power can stop an exploding star. No force can halt the march of science.",
    role: "Nuclear Pioneer",
    contributions: ["Tata Institute", "Atomic Energy Commission", "Trombay Reactor", "Cascade Theory"],
    skills: [
      { name: "Nuclear Physics", pct: 99 },
      { name: "Cosmic Ray Research", pct: 92 },
      { name: "Mathematics", pct: 96 },
    ],
  },
  {
    url: "https://avatars.sched.co/2/c0/19021062/avatar.jpg?1d8",
    title: "Nandini Harinath",
    sub: "Deputy Operations Director, Mars Orbiter Mission",
    size: "normal",
    color: "#db2777",
    category: "Modern Era",
    born: "1964",
    died: null,
    award: "Group Achievement Award",
    quote: "Science has no gender. The universe doesn't care who you are — only what you discover.",
    role: "ISRO Scientist",
    contributions: ["Mars Orbiter Mission", "Chandrayaan-1", "PSLV Operations", "Mission Planning"],
    skills: [
      { name: "Mission Operations", pct: 97 },
      { name: "Deep Space Comms", pct: 90 },
      { name: "Systems Engineering", pct: 88 },
    ],
  },
  {
    url: "https://blackhattalent.com/wp-content/uploads/w3-webp/uploads/2023/08/Anuradha-TK.jpg-595xh.webp",
    title: "Anuradha TK",
    sub: "Former Director, ISRO Satellite Centre",
    size: "large",
    color: "#0ea5e9",
    category: "Pioneers",
    born: "1958",
    died: null,
    award: "ISRO Merit Award",
    quote: "Every satellite we launch carries a piece of our dream into the infinite.",
    role: "Satellite Pioneer",
    contributions: ["GSAT Satellites", "Communication Satellites", "Transponder Tech", "ISRO Leadership"],
    skills: [
      { name: "Satellite Systems", pct: 98 },
      { name: "RF Engineering", pct: 94 },
      { name: "Leadership", pct: 92 },
    ],
  },
  {
    url: "https://cimg.acharyaprashant.org/images/img-5db4f63f-0451-4103-bdd9-7a0efef31c08/30/image.jpg",
    title: "Jagadish Chandra Bose",
    sub: "Pioneering polymath, physicist, and botanist",
    size: "normal",
    color: "#a78bfa",
    category: "Visionaries",
    born: "1858",
    died: "1937",
    award: "Companion of the Order of the Star",
    quote: "The life force in plants is no different from the life force in us — it only speaks a different language.",
    role: "Physicist & Botanist",
    contributions: ["Radio Wave Research", "Plant Biophysics", "Crescograph", "Millimeter Waves"],
    skills: [
      { name: "Physics", pct: 97 },
      { name: "Radio Technology", pct: 95 },
      { name: "Botany", pct: 90 },
    ],
  },
];

const CATEGORIES = ["All", "Visionaries", "Pioneers", "Nuclear", "Modern Era"];

const TIMELINE_EVENTS = [
  { year: "1858", event: "J.C. Bose born — future radio wave pioneer", color: "#a78bfa" },
  { year: "1895", event: "Bose demonstrates wireless radio transmission", color: "#a78bfa" },
  { year: "1909", event: "Homi Bhabha born in Mumbai", color: "#f97316" },
  { year: "1919", event: "Vikram Sarabhai born in Ahmedabad", color: "#4f46e5" },
  { year: "1931", event: "A.P.J. Abdul Kalam born in Rameswaram", color: "#7c3aed" },
  { year: "1945", event: "Bhabha establishes Tata Institute of Fundamental Research", color: "#f97316" },
  { year: "1963", event: "ISRO founded by Sarabhai — India enters space race", color: "#4f46e5" },
  { year: "1975", event: "India's first satellite Aryabhata launched", color: "#0ea5e9" },
  { year: "1980", event: "India achieves satellite launch capability with SLV-3", color: "#7c3aed" },
  { year: "1998", event: "Kalam leads Pokhran-II nuclear tests successfully", color: "#7c3aed" },
  { year: "2014", event: "MOM (Mangalyaan) reaches Mars orbit — Nandini leads ops", color: "#db2777" },
  { year: "2023", event: "Chandrayaan-3 lands on Moon's south pole", color: "#0ea5e9" },
];

const STARS = Array.from({ length: 130 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  dur: Math.random() * 12 + 8,
  delay: Math.random() * 10,
  size: Math.random() * 3 + 1,
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
    rx.set(-dy * strength); ry.set(dx * strength);
    gx.set(50 + dx * 40); gy.set(50 + dy * 40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return { ref, rx, ry, gx, gy, onMove, onLeave };
}

/* ── Skill Bar ─────────────────────────────────────────────── */
function SkillBar({ name, pct, color, animate: doAnim }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "0.65rem", color: "rgba(196,181,253,0.7)", letterSpacing: "0.08em", fontFamily: "'Exo 2', sans-serif" }}>{name}</span>
        <span style={{ fontSize: "0.65rem", color: color, fontFamily: "'Orbitron', monospace", fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: "4px", background: "rgba(139,92,246,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: "4px", background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: doAnim ? `${pct}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* ── Gallery Card ─────────────────────────────────────────── */
function GalleryCard({ item, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(11);
  const isLarge = item.size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      style={{ gridRow: isLarge ? "span 2" : "span 1", perspective: 900 }}
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
        <motion.img src={item.url} alt={item.title} className="gc-img"
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="gc-dark" />
        <motion.div className="gc-glow"
          style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, ${item.color}55 0%, transparent 65%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
        <motion.div className="gc-border"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${item.color}80, 0 0 60px ${item.color}40, inset 0 0 50px ${item.color}10` : "none" }}
          transition={{ duration: 0.4 }}
        />
        {/* Scan line */}
        <motion.div className="gc-scan"
          animate={hovered ? { y: ["0%", "100%"], opacity: [0, 0.5, 0] } : { opacity: 0 }}
          transition={{ duration: 1.6, repeat: hovered ? Infinity : 0, ease: "linear" }}
          style={{ background: `linear-gradient(to bottom, transparent, ${item.color}70, transparent)` }}
        />
        {/* Particle burst on hover */}
        {hovered && [0,1,2,3,4,5].map(i => (
          <motion.div key={i}
            initial={{ opacity: 1, scale: 0, x: "50%", y: "50%" }}
            animate={{ opacity: 0, scale: 1, x: `${50 + Math.cos(i * 60 * Math.PI/180) * 80}%`, y: `${50 + Math.sin(i * 60 * Math.PI/180) * 80}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: item.color, zIndex: 10, pointerEvents: "none", top: 0, left: 0 }}
          />
        ))}
        {/* Category tag */}
        <motion.div className="gc-badge"
          style={{ background: `${item.color}22`, border: `1px solid ${item.color}55`, color: item.color }}
          animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : -6 }}
          transition={{ duration: 0.3 }}
        >
          ✦ {item.category}
        </motion.div>
        {/* Era chip */}
        <motion.div style={{
          position: "absolute", top: 14, right: 46, zIndex: 6,
          padding: "3px 8px", borderRadius: "10px", background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.5rem",
          color: "rgba(255,255,255,0.5)", fontFamily: "'Orbitron', monospace", letterSpacing: "0.1em",
        }}
          animate={{ opacity: hovered ? 1 : 0 }}
        >
          {item.born}{item.died ? `–${item.died}` : "–present"}
        </motion.div>
        {/* Bottom info */}
        <div className="gc-info">
          <motion.h3 className="gc-title"
            animate={{ y: hovered ? 0 : 6, opacity: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.35 }}
          >{item.title}</motion.h3>
          <motion.p className="gc-sub"
            animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
          >{item.sub}</motion.p>
          {/* Role badge */}
          <motion.div
            animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}
          >
            <span style={{ padding: "3px 10px", borderRadius: "20px", background: `${item.color}30`, border: `1px solid ${item.color}50`, fontSize: "0.58rem", color: item.color, fontFamily: "'Orbitron', monospace", letterSpacing: "0.1em" }}>{item.role}</span>
            {item.award && <span style={{ padding: "3px 10px", borderRadius: "20px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", fontSize: "0.58rem", color: "#ffd700", fontFamily: "'Orbitron', monospace" }}>🏆 {item.award}</span>}
          </motion.div>
          <motion.div className="gc-expand"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
            animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >⊕ View Profile</motion.div>
        </div>
        <div className="gc-corner gc-tl" style={{ borderColor: `${item.color}70` }} />
        <div className="gc-corner gc-br" style={{ borderColor: `${item.color}70` }} />
        <div className="gc-num" style={{ color: `${item.color}60` }}>{String(index + 1).padStart(2, "0")}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Lightbox / Profile Modal ─────────────────────────────── */
function Lightbox({ item, index, total, onClose, onPrev, onNext }) {
  const [tab, setTab] = useState("bio");
  const skillsVisible = tab === "skills";
  useEffect(() => { setTab("bio"); }, [index]);

  return (
    <motion.div className="lb-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }} onClick={onClose}
    >
      <div className="lb-blur" />
      <motion.div className="lb-box"
        initial={{ scale: 0.82, rotateY: -18, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.82, rotateY: 18, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left: image */}
        <div className="lb-left">
          <img src={item.url} alt={item.title} className="lb-img" />
          <div className="lb-img-overlay" style={{ background: `linear-gradient(to right, rgba(0,0,10,0.95) 0%, transparent 100%)` }} />
          {/* Animated color border */}
          <motion.div style={{
            position: "absolute", inset: 0, borderRadius: "0",
            boxShadow: `inset 0 0 60px ${item.color}30`,
            pointerEvents: "none",
          }} animate={{ boxShadow: [`inset 0 0 40px ${item.color}20`, `inset 0 0 80px ${item.color}40`, `inset 0 0 40px ${item.color}20`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Right: content */}
        <div className="lb-right">
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <motion.div style={{
              display: "inline-block", padding: "4px 14px", borderRadius: "20px",
              background: `${item.color}22`, border: `1px solid ${item.color}50`,
              fontSize: "0.6rem", color: item.color, letterSpacing: "0.15em",
              fontFamily: "'Orbitron', monospace", marginBottom: "10px",
            }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            >✦ {item.category} · {item.born}{item.died ? `–${item.died}` : "–present"}</motion.div>

            <motion.h2 className="lb-title"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            >{item.title}</motion.h2>
            <motion.p className="lb-sub"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >{item.sub}</motion.p>

            <motion.div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            >
              <span style={{ padding: "4px 12px", borderRadius: "20px", background: `${item.color}25`, border: `1px solid ${item.color}45`, fontSize: "0.6rem", color: item.color, fontFamily: "'Orbitron', monospace" }}>🔬 {item.role}</span>
              {item.award && <span style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", fontSize: "0.6rem", color: "#ffd700", fontFamily: "'Orbitron', monospace" }}>🏆 {item.award}</span>}
            </motion.div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {["bio", "contributions", "skills"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: "6px 16px", borderRadius: "20px", cursor: "pointer",
                  fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: "0.1em",
                  border: tab === t ? `1px solid ${item.color}70` : "1px solid rgba(139,92,246,0.2)",
                  background: tab === t ? `${item.color}25` : "transparent",
                  color: tab === t ? item.color : "rgba(196,181,253,0.45)",
                  transition: "all 0.3s",
                }}
              >{t.toUpperCase()}</button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {tab === "bio" && (
              <motion.div key="bio"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{
                  background: `${item.color}0d`, border: `1px solid ${item.color}25`,
                  borderRadius: "14px", padding: "18px", marginBottom: 16,
                }}>
                  <div style={{ fontSize: "1.2rem", color: item.color, marginBottom: 8, opacity: 0.6 }}>"</div>
                  <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "rgba(220,210,255,0.85)", lineHeight: 1.7, fontFamily: "'Exo 2', sans-serif" }}>{item.quote}</p>
                </div>
                <p style={{ fontSize: "0.82rem", color: "rgba(196,181,253,0.6)", lineHeight: 1.75, fontFamily: "'Exo 2', sans-serif" }}>
                  A towering figure in the history of science, <strong style={{ color: "rgba(220,210,255,0.9)" }}>{item.title}</strong> transformed the landscape of {item.category.toLowerCase()} research and left an indelible mark on generations of scientists that followed.
                </p>
              </motion.div>
            )}

            {tab === "contributions" && (
              <motion.div key="contrib"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {item.contributions.map((c, i) => (
                    <motion.div key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      style={{
                        padding: "12px 14px", borderRadius: "12px",
                        background: `${item.color}10`, border: `1px solid ${item.color}30`,
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0, boxShadow: `0 0 8px ${item.color}` }} />
                      <span style={{ fontSize: "0.72rem", color: "rgba(220,210,255,0.85)", fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.04em" }}>{c}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "skills" && (
              <motion.div key="skills"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {item.skills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} pct={s.pct} color={item.color} animate={skillsVisible || true} />
                ))}
                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: "12px", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
                  <div style={{ fontSize: "0.62rem", color: "rgba(167,139,250,0.5)", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'Orbitron', monospace" }}>IMPACT SCORE</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "2rem", fontWeight: 900, color: item.color }}>
                      {Math.round(item.skills.reduce((a, s) => a + s.pct, 0) / item.skills.length)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(196,181,253,0.5)", fontFamily: "'Exo 2', sans-serif" }}>out of 100 — Exceptional Contributor</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter */}
          <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="lb-counter">{index + 1} / {total}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {GALLERY.map((_, i) => (
                <div key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, background: i === index ? item.color : "rgba(139,92,246,0.2)", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        </div>

        <button className="lb-close" onClick={onClose}>✕</button>
        <button className="lb-nav lb-prev" onClick={onPrev}>‹</button>
        <button className="lb-nav lb-next" onClick={onNext}>›</button>
        <div className="lb-corner lb-tl" style={{ borderColor: `${item.color}80` }} />
        <div className="lb-corner lb-br" style={{ borderColor: `${item.color}80` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Timeline Event ───────────────────────────────────────── */
function TimelineEvent({ event, index, isLeft }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      style={{
        display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start",
        paddingRight: isLeft ? "calc(50% + 24px)" : 0,
        paddingLeft: isLeft ? 0 : "calc(50% + 24px)",
        marginBottom: 24, position: "relative",
      }}
    >
      {/* Node on center line */}
      <motion.div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: 14, height: 14, borderRadius: "50%",
        background: event.color,
        boxShadow: `0 0 16px ${event.color}`,
        zIndex: 2,
      }}
        animate={{ scale: [1, 1.4, 1], boxShadow: [`0 0 10px ${event.color}`, `0 0 24px ${event.color}`, `0 0 10px ${event.color}`] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
      />
      {/* Card */}
      <div style={{
        background: `linear-gradient(135deg, ${event.color}10 0%, rgba(5,0,20,0.9) 100%)`,
        border: `1px solid ${event.color}35`,
        borderRadius: 14, padding: "14px 18px", maxWidth: 280,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1rem", fontWeight: 900, color: event.color, marginBottom: 4 }}>{event.year}</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(196,181,253,0.7)", lineHeight: 1.55, fontFamily: "'Exo 2', sans-serif" }}>{event.event}</div>
      </div>
    </motion.div>
  );
}

/* ── Animated Counter ─────────────────────────────────────── */
function AnimCounter({ end, suffix = "", label, icon }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 2000, steps = 60;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setCount(Math.floor(end * (i / steps)));
      if (i >= steps) { setCount(end); clearInterval(id); }
    }, dur / steps);
    return () => clearInterval(id);
  }, [inView, end]);
  return (
    <motion.div ref={ref}
      className="sg-strip-item"
      whileHover={{ y: -4, background: "rgba(109,40,217,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{icon}</div>
      <div className="sg-strip-num">{count}{suffix}</div>
      <div className="sg-strip-label">{label}</div>
    </motion.div>
  );
}

/* ── Main Section ─────────────────────────────────────────── */
export default function SpaceGallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-60px" });
  const [lightbox, setLightbox] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const filteredGallery = GALLERY.filter(item => {
    const matchCat = activeFilter === "All" || item.category === activeFilter;
    const matchSearch = searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openLightbox = (_, i) => {
    const actualIdx = GALLERY.indexOf(filteredGallery[i]);
    setLightbox(actualIdx);
  };
  const closeLightbox = () => setLightbox(null);
  const prevSlide = () => setLightbox(l => (l - 1 + GALLERY.length) % GALLERY.length);
  const nextSlide = () => setLightbox(l => (l + 1) % GALLERY.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .sg-root {
          position: relative; background: #000; color: white;
          padding: 120px 0 140px; overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        .sg-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .sg-star {
          position: absolute; border-radius: 50%; background: white;
          animation: sg-twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes sg-twinkle {
          from { opacity: 0.05; transform: scale(0.5); }
          to   { opacity: 0.9; transform: scale(1.4); }
        }

        /* Floating particles */
        .sg-particle {
          position: absolute; border-radius: 50%;
          background: rgba(139,92,246,0.4);
          animation: sg-float var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes sg-float {
          from { transform: translateY(0px) scale(1); opacity: 0.3; }
          to   { transform: translateY(-80px) scale(1.5); opacity: 0.8; }
        }

        .sg-neb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(100px);
          animation: sg-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sg-pulse {
          from { opacity: var(--op-from); transform: scale(1); }
          to   { opacity: var(--op-to);   transform: scale(1.2); }
        }

        .sg-inner { position: relative; z-index: 10; max-width: 1320px; margin: 0 auto; padding: 0 32px; }

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
          font-weight: 900; line-height: 1.08; color: #f0e6ff;
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
          max-width: 520px; margin-left: auto; margin-right: auto;
        }
        .sg-divider {
          width: 80px; height: 1px; margin: 28px auto;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
        }

        /* Search bar */
        .sg-search-wrap {
          position: relative; max-width: 360px; margin: 0 auto 24px;
        }
        .sg-search {
          width: 100%; padding: 12px 20px 12px 44px;
          background: rgba(20,5,50,0.7); border: 1px solid rgba(139,92,246,0.25);
          border-radius: 40px; color: #e9d5ff; font-family: 'Exo 2', sans-serif;
          font-size: 0.85rem; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          backdrop-filter: blur(10px);
        }
        .sg-search::placeholder { color: rgba(167,139,250,0.35); }
        .sg-search:focus { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 20px rgba(109,40,217,0.2); }
        .sg-search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(167,139,250,0.45); font-size: 0.9rem; pointer-events: none;
        }

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
          cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;
        }
        .sg-tab:hover, .sg-tab.active {
          background: rgba(109,40,217,0.25); color: #e9d5ff;
          border-color: rgba(139,92,246,0.6);
          box-shadow: 0 0 20px rgba(109,40,217,0.25);
        }

        .sg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 20px;
        }
        @media (max-width: 900px) { .sg-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 200px; } }
        @media (max-width: 580px) { .sg-grid { grid-template-columns: 1fr; grid-auto-rows: 240px; } }

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
          background: linear-gradient(to top, rgba(0,0,10,0.92) 0%, rgba(0,0,10,0.3) 50%, transparent 100%);
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
          margin-top: 3px; letter-spacing: 0.04em;
        }
        .gc-expand {
          display: inline-block; margin-top: 10px;
          padding: 6px 14px; border-radius: 20px; border: none;
          font-family: 'Orbitron', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; color: white; cursor: pointer;
        }
        .gc-corner {
          position: absolute; width: 16px; height: 16px;
          z-index: 6; pointer-events: none; transition: all 0.3s;
        }
        .gc-tl { top: 10px; left: 10px; border-top: 1.5px solid; border-left: 1.5px solid; border-radius: 4px 0 0 0; }
        .gc-br { bottom: 10px; right: 10px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-radius: 0 0 4px 0; }

        /* Stats strip */
        .sg-strip {
          display: flex; gap: 0;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 16px; overflow: hidden;
          margin-top: 48px;
        }
        .sg-strip-item {
          flex: 1; padding: 24px 20px; text-align: center;
          border-right: 1px solid rgba(139,92,246,0.1);
          background: rgba(5,0,20,0.7); transition: all 0.3s; cursor: default;
        }
        .sg-strip-item:last-child { border-right: none; }
        .sg-strip-num {
          font-family: 'Orbitron', monospace; font-size: 1.6rem;
          font-weight: 900; color: #e9d5ff;
          text-shadow: 0 0 15px rgba(167,139,250,0.4);
        }
        .sg-strip-label {
          font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(167,139,250,0.5);
          margin-top: 4px;
        }
        @media (max-width: 640px) { .sg-strip { flex-wrap: wrap; } .sg-strip-item { flex: 1 1 50%; border-bottom: 1px solid rgba(139,92,246,0.1); } }

        .sg-glow-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #0ea5e9, transparent);
          background-size: 200% 100%;
          animation: sg-bar 5s linear infinite;
        }
        @keyframes sg-bar { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Section headers */
        .sg-section-head {
          text-align: center; margin-bottom: 50px; padding-top: 80px;
        }
        .sg-section-label {
          font-family: 'Orbitron', monospace; font-size: 0.6rem;
          letter-spacing: 0.22em; color: rgba(167,139,250,0.55);
          margin-bottom: 12px;
        }
        .sg-section-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.5rem, 3vw, 2.4rem); font-weight: 900;
          color: #f0e6ff;
        }

        /* Timeline */
        .sg-timeline {
          position: relative; padding: 20px 0;
        }
        .sg-timeline-line {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(139,92,246,0.5) 10%, rgba(139,92,246,0.3) 90%, transparent);
          transform: translateX(-50%);
        }

        /* Quote wall */
        .sg-quotes-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        @media(max-width: 900px){ .sg-quotes-grid{grid-template-columns: repeat(2,1fr);} }
        @media(max-width: 580px){ .sg-quotes-grid{grid-template-columns: 1fr;} }

        /* No results */
        .sg-empty {
          text-align: center; padding: 60px 20px;
          color: rgba(167,139,250,0.4); font-family: 'Orbitron', monospace;
          font-size: 0.8rem; letter-spacing: 0.1em;
        }

        /* Lightbox */
        .lb-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .lb-blur {
          position: absolute; inset: 0;
          background: rgba(0,0,10,0.92); backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .lb-box {
          position: relative; z-index: 1;
          max-width: 1000px; width: 100%; max-height: 90vh;
          border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(139,92,246,0.25);
          box-shadow: 0 40px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(139,92,246,0.1);
          display: flex; transform-style: preserve-3d;
        }
        .lb-left {
          position: relative; width: 46%; flex-shrink: 0; min-height: 500px;
          overflow: hidden;
        }
        .lb-img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 500px; }
        .lb-img-overlay { position: absolute; inset: 0; pointer-events: none; }
        .lb-right {
          flex: 1; padding: 32px 28px; overflow-y: auto;
          background: rgba(5,0,20,0.98);
          display: flex; flex-direction: column;
        }
        .lb-right::-webkit-scrollbar { width: 3px; }
        .lb-right::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
        .lb-title {
          font-family: 'Orbitron', monospace; font-size: 1.4rem;
          font-weight: 900; color: #f0e6ff; letter-spacing: 0.06em;
        }
        .lb-sub {
          font-size: 0.82rem; color: rgba(196,181,253,0.55);
          margin-top: 5px; letter-spacing: 0.04em; font-family: 'Exo 2', sans-serif;
        }
        .lb-counter {
          font-family: 'Orbitron', monospace; font-size: 0.7rem;
          color: rgba(167,139,250,0.45); letter-spacing: 0.12em;
        }
        .lb-close {
          position: absolute; top: 16px; right: 16px;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(0,0,10,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px); z-index: 10;
        }
        .lb-close:hover { background: rgba(109,40,217,0.4); color: white; transform: scale(1.1) rotate(90deg); }
        .lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(0,0,10,0.7); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; font-size: 1.6rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; backdrop-filter: blur(10px); z-index: 10;
        }
        .lb-nav:hover { background: rgba(109,40,217,0.4); color: white; transform: translateY(-50%) scale(1.1); }
        .lb-prev { left: 14px; } .lb-next { right: 14px; }
        .lb-corner {
          position: absolute; width: 22px; height: 22px;
          z-index: 10; pointer-events: none;
        }
        .lb-tl { top: 14px; left: 14px; border-top: 2px solid; border-left: 2px solid; border-radius: 6px 0 0 0; }
        .lb-br { bottom: 14px; right: 14px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 6px 0; }
        @media(max-width: 700px){
          .lb-box { flex-direction: column; }
          .lb-left { width: 100%; min-height: 220px; }
          .lb-img { min-height: 220px; }
        }
      `}</style>

      <section className="sg-root" ref={sectionRef}>
        {/* Stars */}
        <div className="sg-stars">
          {STARS.map(s => (
            <div key={s.id} className="sg-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, "--dur": `${s.dur}s`, "--delay": `${s.delay}s` }} />
          ))}
        </div>

        {/* Floating particles */}
        {PARTICLES.map(p => (
          <div key={p.id} className="sg-particle" style={{ left: `${p.x}%`, bottom: 0, width: p.size, height: p.size, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` }} />
        ))}

        {/* Nebulae */}
        <div className="sg-neb" style={{ width: 650, height: 420, background: "radial-gradient(ellipse, #7c3aed, transparent)", top: "-80px", left: "-120px", "--dur": "9s", "--op-from": "0.09", "--op-to": "0.18" }} />
        <div className="sg-neb" style={{ width: 520, height: 320, background: "radial-gradient(ellipse, #0ea5e9, transparent)", bottom: "0", right: "-80px", "--dur": "11s", "--op-from": "0.07", "--op-to": "0.15" }} />
        <div className="sg-neb" style={{ width: 400, height: 400, background: "radial-gradient(ellipse, #db2777, transparent)", top: "50%", left: "40%", "--dur": "7s", "--op-from": "0.04", "--op-to": "0.1" }} />
        <div className="sg-neb" style={{ width: 300, height: 300, background: "radial-gradient(ellipse, #f97316, transparent)", top: "30%", right: "5%", "--dur": "13s", "--op-from": "0.03", "--op-to": "0.08" }} />

        <div className="sg-glow-bar" />

        <div className="sg-inner">

          {/* ── HEADER ── */}
          <motion.div style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="sg-eyebrow">
              <div className="sg-eyebrow-dot" />
              HALL OF COSMIC LEGENDS
            </div>
            <h2 className="sg-title">Space <span className="acc">Scientists</span></h2>
            <p className="sg-sub">
              Brilliant minds behind ISRO, nuclear breakthroughs, and deep-space discoveries — the legends who carried India's dreams to the stars.
            </p>
            <div className="sg-divider" />
          </motion.div>

          {/* ── SEARCH ── */}
          <motion.div className="sg-search-wrap"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <span className="sg-search-icon">🔍</span>
            <input className="sg-search" placeholder="Search scientists…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </motion.div>

          {/* ── FILTER TABS ── */}
          <motion.div className="sg-tabs"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {CATEGORIES.map((t, i) => (
              <motion.button key={t}
                className={`sg-tab ${activeFilter === t ? "active" : ""}`}
                onClick={() => setActiveFilter(t)}
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
              >
                {t}
                {t !== "All" && (
                  <span style={{ marginLeft: 6, opacity: 0.6, fontSize: "0.5rem" }}>
                    ({GALLERY.filter(g => g.category === t).length})
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* ── GALLERY GRID ── */}
          <AnimatePresence mode="wait">
            {filteredGallery.length === 0 ? (
              <motion.div key="empty" className="sg-empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                ✦ NO SCIENTISTS FOUND — TRY A DIFFERENT SEARCH
              </motion.div>
            ) : (
              <motion.div key={activeFilter + searchQuery} className="sg-grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredGallery.map((item, i) => (
                  <GalleryCard key={item.title} item={item} index={i} onClick={openLightbox} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ANIMATED STATS ── */}
          <motion.div className="sg-strip"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimCounter end={6} suffix="+" label="Legendary Scientists" icon="🧑‍🔬" />
            <AnimCounter end={60} suffix="+" label="Years of Research" icon="📡" />
            <AnimCounter end={14} suffix="" label="Major Breakthroughs" icon="🚀" />
            <AnimCounter end={4} suffix="" label="Nobel/Bharat Ratna" icon="🏆" />
          </motion.div>

          {/* ── QUOTES WALL ── */}
          <div className="sg-section-head">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div className="sg-section-label">💫 WORDS THAT MOVED THE WORLD</div>
              <h3 className="sg-section-title">Voices of <span style={{ background: "linear-gradient(135deg,#c084fc,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Genius</span></h3>
            </motion.div>
          </div>
          <div className="sg-quotes-grid">
            {GALLERY.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: `0 20px 50px ${item.color}25` }}
                style={{
                  padding: "24px", borderRadius: "18px",
                  background: `linear-gradient(135deg, ${item.color}0d 0%, rgba(5,0,20,0.92) 100%)`,
                  border: `1px solid ${item.color}30`, backdropFilter: "blur(10px)",
                  cursor: "pointer",
                }}
                onClick={() => setLightbox(i)}
              >
                <div style={{ fontSize: "1.8rem", opacity: 0.4, color: item.color, marginBottom: 10, fontFamily: "'Orbitron', monospace" }}>"</div>
                <p style={{ fontSize: "0.82rem", fontStyle: "italic", color: "rgba(210,200,255,0.8)", lineHeight: 1.7, marginBottom: 16, fontFamily: "'Exo 2', sans-serif" }}>{item.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={item.url} alt={item.title} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${item.color}60` }} />
                  <div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", fontWeight: 700, color: item.color }}>{item.title}</div>
                    <div style={{ fontSize: "0.6rem", color: "rgba(196,181,253,0.45)", letterSpacing: "0.06em" }}>{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── TIMELINE ── */}
          <div ref={timelineRef} className="sg-section-head">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div className="sg-section-label">📅 JOURNEY THROUGH TIME</div>
              <h3 className="sg-section-title">Scientific <span style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Timeline</span></h3>
              <p style={{ color: "rgba(196,181,253,0.5)", fontSize: "0.88rem", marginTop: 12, fontFamily: "'Exo 2', sans-serif" }}>Key milestones in India's scientific and space exploration history</p>
            </motion.div>
          </div>

          <div className="sg-timeline">
            <div className="sg-timeline-line" />
            {TIMELINE_EVENTS.map((ev, i) => (
              <TimelineEvent key={ev.year} event={ev} index={i} isLeft={i % 2 === 0} />
            ))}
          </div>

          {/* ── BOTTOM CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{
              marginTop: 80, padding: "60px 40px", textAlign: "center",
              background: "linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(5,0,20,0.9) 100%)",
              border: "1px solid rgba(139,92,246,0.15)", borderRadius: "24px",
              backdropFilter: "blur(12px)", position: "relative", overflow: "hidden",
            }}
          >
            {/* Animated ring */}
            {[400, 600, 800].map((s, i) => (
              <motion.div key={s} style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: s, height: s, borderRadius: "50%",
                border: "1px solid rgba(139,92,246,0.06)", pointerEvents: "none",
              }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌌</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem,3vw,2.4rem)", fontWeight: 900, color: "#f0e6ff", marginBottom: 14 }}>
                Inspired by <span style={{ background: "linear-gradient(135deg,#c084fc,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Legends?</span>
              </h3>
              <p style={{ color: "rgba(196,181,253,0.55)", fontSize: "0.95rem", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.75, fontFamily: "'Exo 2', sans-serif" }}>
                These scientists prove that curiosity has no limits. Explore their stories, their discoveries, and the cosmos they helped us understand.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {[["EXPLORE ALL PROFILES →", "transparent", "#a78bfa"], ["VIEW TIMELINE", "rgba(109,40,217,0.15)", "#818cf8"]].map(([label, bg, col]) => (
                  <motion.button key={label}
                    style={{ background: bg, border: `2px solid ${col}`, borderRadius: "50px", padding: "13px 32px", color: col, fontFamily: "'Orbitron', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", cursor: "pointer" }}
                    whileHover={{ background: col, color: "#000", y: -4, boxShadow: `0 16px 40px ${col}50` }}
                    transition={{ duration: 0.25 }}
                  >{label}</motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 50, paddingTop: 28, borderTop: "1px solid rgba(139,92,246,0.1)" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(100,80,150,0.45)" }}>
              SPACE SCIENTISTS GALLERY © 2025 — PER ASPERA AD ASTRA
            </div>
          </div>

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