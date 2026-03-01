import { useRef, useState, useEffect } from "react";
import { motion, useInView, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

const COSMIC_EVENTS = [
  {
    name: "Total Solar Eclipse",
    role: "The Moon passes directly between the Sun and Earth, completely covering the Sun's disk and plunging a narrow path into temporary darkness.",
    country: "🌍 Global",
    missions: "Next: Aug 2026 · Spain & Africa",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Solar_eclipse_1999_4_NR.jpg/1280px-Solar_eclipse_1999_4_NR.jpg",
    color: "#f472b6",
    stat: "≤ 7 min 32 sec",
    icon: "☀️",
  },
  {
    name: "Supermoon Rising",
    role: "A full moon at perigee — the Moon's closest approach to Earth — appearing up to 14% larger and 30% brighter than at apogee.",
    country: "🌕 Lunar",
    missions: "Next: Oct 2025 · Perigee 357,200 km",
    img: "https://science.nasa.gov/wp-content/uploads/2024/01/preview-supermoons.jpg",
    color: "#fbbf24",
    stat: "14% Larger",
    icon: "🌕",
  },
  {
    name: "Perseid Meteor Shower",
    role: "Earth passes through the debris trail of comet Swift-Tuttle each August, producing up to 100 meteors per hour at peak.",
    country: "☄️ Comet Swift-Tuttle",
    missions: "Peak: Aug 11–13 annually",
    img: "https://media.istockphoto.com/id/1902962146/photo/meteor-shower-composite-created-from-44-individual-photos-that-includes-the-milky-way.jpg?s=612x612&w=0&k=20&c=mZM-Ba3JqFjAPbS4hxjsKlIWob0_a9gYiJ6vr93yy5Y=",
    color: "#38bdf8",
    stat: "100 meteors/hr",
    icon: "☄️",
  },
  {
    name: "Planetary Opposition",
    role: "Earth passes between the Sun and an outer planet, placing it opposite the Sun in the sky — the planet's closest, brightest appearance of the year.",
    country: "♃ Jupiter / ♄ Saturn",
    missions: "Jupiter opposition: Jun 2025",
    img: "https://c02.purpledshub.com/uploads/sites/48/2020/08/diagram-showing-saturn-at-opposition.jpg?webp=1&w=1200",
    color: "#a78bfa",
    stat: "Brightest of year",
    icon: "🪐",
  },
];

const MISSIONS = [
  {
    id: "artemis",
    title: "Artemis Program",
    agency: "NASA",
    status: "Active",
    statusColor: "#4ade80",
    year: "2025–2028",
    description:
      "Humanity's return to the Moon — and a stepping stone to Mars. Artemis III will land the first woman and first person of color on the lunar surface near the south pole.",
    tags: ["Lunar Landing", "SLS Rocket", "Orion Capsule", "Gateway Station"],
    img: "https://www.nasa.gov/wp-content/uploads/2023/03/artemis_ii_crew.jpg",
    accent: "#f472b6",
    stats: [
      { label: "Crew", value: "4" },
      { label: "Altitude", value: "385,000 km" },
      { label: "Duration", value: "21 days" },
    ],
  },
  {
    id: "starship",
    title: "SpaceX Starship",
    agency: "SpaceX",
    status: "Testing",
    statusColor: "#fb923c",
    year: "2024–2030",
    description:
      "The world's most powerful rocket, fully reusable and designed to carry 100+ people to Mars. Starship's Super Heavy booster is caught mid-air by mechanical arms at the launch pad.",
    tags: ["Mars Transit", "Fully Reusable", "Starlink Deployment", "Point-to-Point"],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/SpaceX_Starship_IFT-4_booster_catch_1_%28cropped%29.jpg/1280px-SpaceX_Starship_IFT-4_booster_catch_1_%28cropped%29.jpg",
    accent: "#fb923c",
    stats: [
      { label: "Payload LEO", value: "150 t" },
      { label: "Height", value: "121 m" },
      { label: "Thrust", value: "74.4 MN" },
    ],
  },
  {
    id: "jwst",
    title: "James Webb Space Telescope",
    agency: "NASA / ESA / CSA",
    status: "Operational",
    statusColor: "#4ade80",
    year: "2021–2031+",
    description:
      "Humanity's premier space science observatory, peering back over 13.5 billion years to witness the first galaxies forming — and discovering potentially habitable exoplanets.",
    tags: ["Infrared Optics", "L2 Orbit", "Exoplanet Atmospheres", "Deep Universe"],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/James_Webb_Space_Telescope_2009_top.jpg/1280px-James_Webb_Space_Telescope_2009_top.jpg",
    accent: "#38bdf8",
    stats: [
      { label: "Mirror", value: "6.5 m" },
      { label: "Wavelength", value: "0.6–28 μm" },
      { label: "Distance", value: "1.5M km" },
    ],
  },
  {
    id: "europa",
    title: "Europa Clipper",
    agency: "NASA / JPL",
    status: "En Route",
    statusColor: "#a78bfa",
    year: "2024–2030",
    description:
      "Investigating Jupiter's moon Europa and its subsurface ocean, which scientists believe could harbor conditions suitable for life beneath its icy shell.",
    tags: ["Ocean World", "Astrobiology", "Jupiter System", "Flyby Science"],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/PIA19048-Europa-BestResolutionView.jpg/1280px-PIA19048-Europa-BestResolutionView.jpg",
    accent: "#a78bfa",
    stats: [
      { label: "Flybys", value: "49" },
      { label: "Instruments", value: "9" },
      { label: "Distance", value: "628M km" },
    ],
  },
];

const STATS_DATA = [
  { label: "Active Satellites", value: 9083, suffix: "+", color: "#f472b6", icon: "🛰️" },
  { label: "ISS Crew-Days", value: 92320, suffix: "+", color: "#fbbf24", icon: "🧑‍🚀" },
  { label: "Exoplanets Found", value: 5700, suffix: "+", color: "#38bdf8", icon: "🪐" },
  { label: "Mars Sols Explored", value: 4800, suffix: "+", color: "#a78bfa", icon: "🔴" },
];

const TIMELINE = [
  { year: "1957", title: "Sputnik 1", desc: "First artificial Earth satellite launched by the Soviet Union, opening the Space Age.", color: "#f472b6" },
  { year: "1961", title: "First Human in Space", desc: "Yuri Gagarin orbits Earth in Vostok 1, 108 minutes that changed history forever.", color: "#fbbf24" },
  { year: "1969", title: "Moon Landing", desc: "Apollo 11 carries Armstrong & Aldrin to the lunar surface. 'One giant leap for mankind.'", color: "#4ade80" },
  { year: "1990", title: "Hubble Launched", desc: "Hubble Space Telescope opens a crystal-clear window to the cosmos from low Earth orbit.", color: "#38bdf8" },
  { year: "1998", title: "ISS Construction", desc: "International Space Station assembly begins — the largest structure ever built in space.", color: "#a78bfa" },
  { year: "2004", title: "Mars Rovers Land", desc: "Spirit and Opportunity touch down on Mars, transforming our understanding of the Red Planet.", color: "#fb923c" },
  { year: "2021", title: "JWST Deployment", desc: "James Webb Space Telescope deployed at L2, revolutionizing deep-space observation.", color: "#f472b6" },
  { year: "2024", title: "Starship Booster Catch", desc: "SpaceX catches a 71-meter Super Heavy booster with mechanical arms — a historic first.", color: "#38bdf8" },
];

const STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2 + 0.3,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}));

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useTilt(str = 10) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 160, damping: 22 });
  const ry = useSpring(0, { stiffness: 160, damping: 22 });
  const gx = useSpring(50, { stiffness: 90, damping: 20 });
  const gy = useSpring(50, { stiffness: 90, damping: 20 });
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rx.set(-dy * str);
    ry.set(dx * str);
    gx.set(50 + dx * 40);
    gy.set(50 + dy * 40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return { ref, rx, ry, gx, gy, onMove, onLeave };
}

function useCountUp(target, inView, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function StarField() {
  return (
    <div className="star-field">
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, "--dur": `${s.dur}s`, "--del": `${s.delay}s` }}
        />
      ))}
    </div>
  );
}

function SectionEyebrow({ label }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" />
      {label}
    </div>
  );
}

function CosmicEventCard({ person, index }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(10);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.14, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        className="event-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ z: 24 }}
      >
        <div className="card-img-wrap">
          <motion.img
            src={person.img}
            alt={person.name}
            className="card-img"
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.7 }}
          />
          <motion.div
            className="card-img-overlay"
            style={{ background: `linear-gradient(to top,${person.color}dd,transparent 55%)` }}
            animate={{ opacity: hovered ? 0.9 : 0.7 }}
          />
          <motion.div
            className="card-cursor-glow"
            style={{ background: `radial-gradient(circle at ${gx}% ${gy}%,${person.color}55 0%,transparent 65%)` }}
            animate={{ opacity: hovered ? 1 : 0 }}
          />
          <div className="card-icon-badge">{person.icon}</div>
        </div>
        <motion.div
          className="card-border"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${person.color}60,0 0 40px ${person.color}40` : "none" }}
        />
        <div className="card-info">
          <div className="card-stat-badge" style={{ background: `${person.color}22`, color: person.color, border: `1px solid ${person.color}44` }}>
            {person.stat}
          </div>
          <h3 className="card-name">{person.name}</h3>
          <p className="card-role" style={{ color: `${person.color}cc` }}>{person.role}</p>
          <div className="card-meta">
            <span className="card-country">{person.country}</span>
            <span className="card-missions">{person.missions}</span>
          </div>
        </div>
        <motion.div
          className="card-shine"
          animate={hovered ? { x: ["-120%", "160%"], opacity: [0, 0.4, 0] } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ background: `linear-gradient(90deg,transparent,${person.color}55,transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

function MissionCard({ mission, index }) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { ref: tRef, rx, ry, onMove, onLeave } = useTilt(6);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 30 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={tRef}
        className="mission-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", borderColor: active ? `${mission.accent}60` : "rgba(255,255,255,0.07)" }}
        onMouseMove={(e) => { setActive(true); onMove(e); }}
        onMouseLeave={() => { setActive(false); onLeave(); }}
      >
        <div className="mission-img-wrap">
          <img src={mission.img} alt={mission.title} className="mission-img" onError={(e) => { e.target.style.display = "none"; }} />
          <div className="mission-img-grad" style={{ background: `linear-gradient(to right, #060214 30%, transparent)` }} />
          <div className="mission-year-badge" style={{ background: `${mission.accent}22`, color: mission.accent, border: `1px solid ${mission.accent}44` }}>
            {mission.year}
          </div>
        </div>
        <div className="mission-body">
          <div className="mission-header">
            <div>
              <div className="mission-agency">{mission.agency}</div>
              <h3 className="mission-title" style={{ color: "#f0e6ff" }}>{mission.title}</h3>
            </div>
            <div className="mission-status-dot" style={{ background: mission.statusColor, boxShadow: `0 0 10px ${mission.statusColor}` }}>
              <span>{mission.status}</span>
            </div>
          </div>
          <p className="mission-desc">{mission.description}</p>
          <div className="mission-tags">
            {mission.tags.map((t) => (
              <span key={t} className="mission-tag" style={{ background: `${mission.accent}18`, color: `${mission.accent}cc`, border: `1px solid ${mission.accent}33` }}>
                {t}
              </span>
            ))}
          </div>
          <div className="mission-stats">
            {mission.stats.map((s) => (
              <div key={s.label} className="mission-stat">
                <span className="mission-stat-val" style={{ color: mission.accent }}>{s.value}</span>
                <span className="mission-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          className="mission-glow"
          animate={{ opacity: active ? 1 : 0 }}
          style={{ background: `radial-gradient(ellipse at center, ${mission.accent}15 0%, transparent 70%)` }}
        />
      </motion.div>
    </motion.div>
  );
}

function StatCounter({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(item.value, inView, 2200 + index * 200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      className="stat-card"
      style={{ borderColor: `${item.color}30` }}
      whileHover={{ scale: 1.05, borderColor: `${item.color}60` }}
    >
      <motion.div
        className="stat-ring"
        style={{ borderColor: `${item.color}40`, boxShadow: `0 0 30px ${item.color}20` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="stat-icon">{item.icon}</div>
      <div className="stat-value" style={{ color: item.color }}>
        {count.toLocaleString()}{item.suffix}
      </div>
      <div className="stat-label">{item.label}</div>
      <div className="stat-bg-glow" style={{ background: `radial-gradient(circle, ${item.color}12 0%, transparent 70%)` }} />
    </motion.div>
  );
}

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -80 : 80 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={`tl-item ${isEven ? "tl-left" : "tl-right"}`}
    >
      <div className="tl-content" style={{ borderColor: `${item.color}30` }}>
        <div className="tl-year" style={{ color: item.color, borderColor: `${item.color}40`, background: `${item.color}12` }}>
          {item.year}
        </div>
        <h4 className="tl-title">{item.title}</h4>
        <p className="tl-desc">{item.desc}</p>
        <div className="tl-glow" style={{ background: `radial-gradient(ellipse at top left, ${item.color}10, transparent 60%)` }} />
      </div>
      <div className="tl-dot" style={{ background: item.color, boxShadow: `0 0 20px ${item.color}80, 0 0 40px ${item.color}40` }} />
    </motion.div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section className="hero-section" ref={ref}>
      <StarField />
      <div className="hero-nebula hero-neb1" />
      <div className="hero-nebula hero-neb2" />
      <div className="hero-nebula hero-neb3" />
      <div className="scan-line top" />
      <div className="scan-line bot" />

      <motion.div className="hero-inner" style={{ y, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionEyebrow label="SPACE EXPLORATION PROGRAMS" />
          <h1 className="hero-title">
            Beyond the <span className="hero-acc">Final</span>
            <br />
            <span className="hero-acc2">Frontier</span>
          </h1>
          <p className="hero-sub">
            From the first satellite beeping in orbit to mega-rockets catching themselves mid-air — humanity's greatest adventure is accelerating. Discover the programs, missions, and cosmic events shaping our species' destiny among the stars.
          </p>
          <div className="hero-cta-row">
            <motion.button
              className="hero-btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Missions →
            </motion.button>
            <motion.button
              className="hero-btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Watch Launch ▶
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="hero-orb-wrap"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="hero-orb">
            <div className="orb-ring orb-ring1" />
            <div className="orb-ring orb-ring2" />
            <div className="orb-ring orb-ring3" />
            <div className="orb-core">
              <div className="orb-pulse" />
              <span className="orb-emoji">🌌</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating data pills */}
      {[
        { text: "🛸 9,083 Satellites Active", left: "5%", top: "30%", delay: 0.6 },
        { text: "🔭 5,700+ Exoplanets", right: "5%", top: "25%", delay: 0.9 },
        { text: "🚀 Starship: 121m Tall", left: "8%", bottom: "25%", delay: 1.2 },
        { text: "🌙 Artemis III: 2026", right: "6%", bottom: "30%", delay: 1.5 },
      ].map((pill, i) => (
        <motion.div
          key={i}
          className="hero-pill"
          style={{ left: pill.left, right: pill.right, top: pill.top, bottom: pill.bottom }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pill.delay, duration: 0.6 }}
        >
          {pill.text}
        </motion.div>
      ))}

      {/* Video embed placeholder with overlay */}
      <motion.div
        className="hero-video-wrap"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="video-frame">
        <video src="space5.mp4" className="video-el mt-20" autoPlay loop muted ></video>
          <div className="video-overlay" />
          <div className="video-label">▶ LIVE LAUNCH FEED · SpaceX Starship IFT-5</div>
        </div>
      </motion.div>
    </section>
  );
}

function CosmicEventsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="cosmic-section" ref={ref}>
      <StarField />
      <div className="cosmic-neb cn1" />
      <div className="cosmic-neb cn2" />
      <div className="scan-line top" />
      <div className="scan-line bot" />

      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionEyebrow label="CELESTIAL PHENOMENA" />
          <h2 className="section-title">
            Astrophysical <span className="acc-text">Events</span>
          </h2>
          <p className="section-sub">
            Researchers are monitoring rare cosmic phenomena — supermassive black holes, dark matter interactions, fast-moving radio circles, and unexpected stellar dimming such as the Betelgeuse mystery.
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="events-grid">
          {COSMIC_EVENTS.map((a, i) => (
            <CosmicEventCard key={i} person={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-bg-grid" />
      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
        >
          <SectionEyebrow label="BY THE NUMBERS" />
          <h2 className="section-title">
            Space <span className="acc-text">Milestones</span>
          </h2>
          <div className="section-divider" />
        </motion.div>
        <div className="stats-grid">
          {STATS_DATA.map((item, i) => (
            <StatCounter key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="missions-section" ref={ref}>
      <StarField />
      <div className="missions-neb mn1" />
      <div className="missions-neb mn2" />

      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
        >
          <SectionEyebrow label="ACTIVE MISSIONS" />
          <h2 className="section-title">
            Defining <span className="acc-text">Programs</span>
          </h2>
          <p className="section-sub">
            The missions reshaping humanity's relationship with the cosmos — from Moon landings to searching for extraterrestrial life in the ocean moons of Jupiter.
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="missions-grid">
          {MISSIONS.map((m, i) => (
            <MissionCard key={m.id} mission={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="timeline-section" ref={ref}>
      <div className="tl-bg-dots" />
      <StarField />

      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
        >
          <SectionEyebrow label="SPACE HISTORY" />
          <h2 className="section-title">
            The <span className="acc-text">Journey</span> So Far
          </h2>
          <p className="section-sub">
            Six decades of daring — from a beeping metal sphere to reusable super-rockets that catch themselves mid-air.
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="timeline">
          <div className="tl-line" />
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const images = [
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvu8AB4VVZseN2w7JurGVGARa8CRdzSFj7Ag&s", label: "Pillars of Creation — JWST", span: "col-span-2 row-span-2" },
    { src: "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2025/07/STScI-01K0W8KWCERZBKHQN81KB7ZKHT.tif?w=4320&h=5740&fit=clip&crop=faces%2Cfocalpoint", label: "Hubble Ultra Deep Field", span: "" },
    { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLAfDpx6p4OYWY7_iS6ljp5HgLO7XeNDZk09mX79HxvBGGIAwoJnjkqy2VWew4GJDykX6MD9H3v5s3Oyai8sx8rJBXZ_cmxUj-s9q0VMmzlnkCPEQYnEMuJ9GTAcHibRQznXGRBhQmrxNK/s1600/BlueMarble-2001-2002.jpg", label: "Apollo 17 — Blue Marble", span: "" },
    { src: "https://science.nasa.gov/wp-content/uploads/2023/04/m51-and-companion_0-jpg.webp", label: "Whirlpool Galaxy M51", span: "col-span-2" },
    { src: "https://spaceplace.nasa.gov/europa/en/europa-cross-section.en.jpg", label: "Europa — Icy Ocean World", span: "" },
  ];

  return (
    <section className="gallery-section" ref={ref}>
      <StarField />
      <div className="gallery-neb gn1" />

      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
        >
          <SectionEyebrow label="COSMIC GALLERY" />
          <h2 className="section-title">
            The Universe in <span className="acc-text">Focus</span>
          </h2>
          <p className="section-sub">
            Iconic imagery captured by humanity's greatest telescopes and spacecraft — windows into the deep cosmos.
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="gallery-grid">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`gallery-item ${img.span}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
            >
              <img src={img.src} alt={img.label} className="gallery-img" />
              <div className="gallery-overlay">
                <span className="gallery-label">{img.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="cta-section" ref={ref}>
      <StarField />
      <div className="cta-neb" />

      <div className="section-inner">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="cta-glow" />
          <motion.div
            className="cta-orbit"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <SectionEyebrow label="JOIN THE MISSION" />
          <h2 className="cta-title">
            Ready to Explore<br />
            <span className="acc-text">The Cosmos?</span>
          </h2>
          <p className="cta-sub">
            Stay updated with real-time launch alerts, mission briefings, and exclusive deep-sky imagery. The universe is expanding — and so is your knowledge.
          </p>
          <div className="cta-input-row">
            <input className="cta-input" placeholder="your@email.com" type="email" />
            <motion.button
              className="cta-btn"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px #f472b680" }}
              whileTap={{ scale: 0.97 }}
            >
              Launch →
            </motion.button>
          </div>
          <p className="cta-fine">No spam. Mission updates only. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function SpacePrograms() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&family=JetBrains+Mono:wght@300;400&display=swap');

        :root {
          --font-d: 'Orbitron', monospace;
          --font-b: 'Exo 2', sans-serif;
          --font-m: 'JetBrains Mono', monospace;
          --muted: rgba(196,181,253,0.5);
          --bg: #000008;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── SHARED ── */
        .star-field { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .star { position: absolute; border-radius: 50%; background: #fff; animation: tw var(--dur) var(--del) ease-in-out infinite alternate; }
        @keyframes tw { from { opacity:0.04; transform:scale(0.5) } to { opacity:0.9; transform:scale(1.5) } }

        .scan-line { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #f472b6, #a78bfa, transparent); background-size: 200% 100%; animation: gs 6s linear infinite; z-index: 20; }
        .scan-line.top { top: 0; }
        .scan-line.bot { bottom: 0; animation-delay: -3s; }
        @keyframes gs { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

        .eyebrow { display: inline-flex; align-items: center; gap: 10px; padding: 6px 18px; border-radius: 40px; border: 1px solid rgba(139,92,246,0.35); background: rgba(109,40,217,0.1); font-family: var(--font-m); font-size: 0.6rem; letter-spacing: 0.2em; color: #a78bfa; margin-bottom: 22px; }
        .eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 8px #a78bfa; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0.1 } }

        .section-inner { position: relative; z-index: 10; max-width: 1260px; margin: 0 auto; padding: 0 32px; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-title { font-family: var(--font-d); font-size: clamp(2rem, 4vw, 3.4rem); font-weight: 900; line-height: 1.05; color: #f0e6ff; text-shadow: 0 0 40px rgba(244,114,182,0.25); }
        .section-sub { margin-top: 14px; font-size: 1rem; font-weight: 300; color: var(--muted); line-height: 1.7; max-width: 580px; margin-left: auto; margin-right: auto; font-family: var(--font-b); }
        .section-divider { width: 80px; height: 1px; margin: 28px auto 0; background: linear-gradient(90deg, transparent, rgba(244,114,182,0.6), transparent); }
        .acc-text { background: linear-gradient(135deg, #f472b6, #a78bfa, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* ── HERO ── */
        .hero-section { position: relative; min-height: 100vh; background: linear-gradient(180deg, #000008, #08000f, #000); overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 32px 60px; }
        .hero-nebula { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); }
        .hero-neb1 { width: 700px; height: 500px; background: radial-gradient(ellipse, #f472b620, transparent); bottom: -100px; left: -150px; animation: np 12s ease-in-out infinite alternate; }
        .hero-neb2 { width: 600px; height: 450px; background: radial-gradient(ellipse, #a78bfa18, transparent); top: -80px; right: -100px; animation: np 10s ease-in-out infinite alternate; }
        .hero-neb3 { width: 400px; height: 400px; background: radial-gradient(ellipse, #38bdf415, transparent); top: 40%; left: 40%; transform: translate(-50%, -50%); animation: np 8s ease-in-out infinite alternate; }
        @keyframes np { from { transform: scale(1) } to { transform: scale(1.25) } }

        .hero-inner { position: relative; z-index: 10; max-width: 1260px; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 40px; }
        .hero-title { font-family: var(--font-d); font-size: clamp(3rem, 7vw, 6rem); font-weight: 900; line-height: 1; color: #f0e6ff; text-shadow: 0 0 60px rgba(244,114,182,0.3); }
        .hero-acc { background: linear-gradient(135deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-acc2 { background: linear-gradient(135deg, #38bdf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: 1.1rem; color: var(--muted); line-height: 1.8; max-width: 620px; font-family: var(--font-b); font-weight: 300; }
        .hero-cta-row { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .hero-btn-primary { padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, #f472b6, #a78bfa); border: none; color: #fff; font-family: var(--font-d); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: box-shadow 0.3s; }
        .hero-btn-primary:hover { box-shadow: 0 0 40px #f472b680; }
        .hero-btn-secondary { padding: 14px 32px; border-radius: 50px; background: transparent; border: 1px solid rgba(244,114,182,0.5); color: #f472b6; font-family: var(--font-d); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s; }
        .hero-btn-secondary:hover { background: rgba(244,114,182,0.1); border-color: #f472b6; }

        .hero-pill { position: absolute; padding: 8px 16px; border-radius: 40px; background: rgba(6,2,20,0.8); border: 1px solid rgba(139,92,246,0.3); font-family: var(--font-m); font-size: 0.6rem; color: rgba(196,181,253,0.8); letter-spacing: 0.1em; backdrop-filter: blur(10px); z-index: 15; }
        @media (max-width: 768px) { .hero-pill { display: none; } }

        .hero-orb-wrap { position: absolute; right: 10%; top: 50%; transform: translateY(-50%); }
        @media (max-width: 900px) { .hero-orb-wrap { display: none; } }
        .hero-orb { position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; }
        .orb-ring { position: absolute; border-radius: 50%; border: 1px solid; animation: spin linear infinite; }
        .orb-ring1 { width: 200px; height: 200px; border-color: rgba(244,114,182,0.25); animation-duration: 12s; }
        .orb-ring2 { width: 150px; height: 150px; border-color: rgba(167,139,250,0.3); animation-duration: 8s; animation-direction: reverse; }
        .orb-ring3 { width: 100px; height: 100px; border-color: rgba(56,189,248,0.35); animation-duration: 5s; }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .orb-core { width: 70px; height: 70px; border-radius: 50%; background: radial-gradient(circle, #a78bfa40, #06020e); border: 1px solid rgba(167,139,250,0.5); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px #a78bfa40; }
        .orb-pulse { position: absolute; width: 70px; height: 70px; border-radius: 50%; background: #a78bfa20; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.5 } 50% { transform: scale(1.5); opacity: 0 } }
        .orb-emoji { font-size: 1.8rem; position: relative; z-index: 1; }

        .hero-video-wrap { width: 100%; max-width: 900px; position: relative; z-index: 10; }
        .video-frame { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(244,114,182,0.2); box-shadow: 0 0 60px rgba(244,114,182,0.15), 0 40px 80px rgba(0,0,0,0.5); aspect-ratio: 16/7; }
        .video-el { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
        .video-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,8,0.2), rgba(0,0,8,0.5)); }
        .video-label { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); font-family: var(--font-m); font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(244,114,182,0.8); background: rgba(0,0,8,0.7); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(244,114,182,0.2); backdrop-filter: blur(6px); white-space: nowrap; }

        /* ── COSMIC EVENTS ── */
        .cosmic-section { position: relative; padding: 120px 0; background: linear-gradient(180deg, #000, #040010, #000); overflow: hidden; }
        .cosmic-neb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); opacity: 0.1; animation: np 11s ease-in-out infinite alternate; }
        .cn1 { width: 600px; height: 400px; background: radial-gradient(ellipse, #f472b6, transparent); bottom: -100px; left: -100px; }
        .cn2 { width: 500px; height: 400px; background: radial-gradient(ellipse, #a78bfa, transparent); top: -80px; right: -80px; animation-duration: 9s; }

        .events-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 1000px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .events-grid { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; } }

        .event-card { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); background: rgba(6,2,20,0.95); cursor: default; transform-style: preserve-3d; }
        .card-img-wrap { position: relative; height: 280px; overflow: hidden; }
        .card-img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .card-img-overlay { position: absolute; inset: 0; }
        .card-cursor-glow { position: absolute; inset: 0; pointer-events: none; }
        .card-icon-badge { position: absolute; top: 12px; left: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(6,2,20,0.8); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1rem; backdrop-filter: blur(8px); }
        .card-border { position: absolute; inset: 0; border-radius: 20px; pointer-events: none; }
        .card-info { position: relative; z-index: 5; padding: 16px 18px 20px; }
        .card-stat-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-family: var(--font-m); font-size: 0.55rem; letter-spacing: 0.12em; margin-bottom: 10px; }
        .card-name { font-family: var(--font-d); font-size: 0.9rem; font-weight: 900; color: #f0e6ff; letter-spacing: 0.05em; margin-bottom: 4px; }
        .card-role { font-size: 0.75rem; font-weight: 400; margin-bottom: 10px; letter-spacing: 0.02em; font-family: var(--font-b); line-height: 1.5; }
        .card-meta { display: flex; flex-direction: column; gap: 3px; }
        .card-country, .card-missions { font-family: var(--font-m); font-size: 0.62rem; color: rgba(196,181,253,0.45); letter-spacing: 0.06em; }
        .card-shine { position: absolute; inset: 0; width: 60%; pointer-events: none; z-index: 6; }

        /* ── STATS ── */
        .stats-section { position: relative; padding: 120px 0; background: linear-gradient(180deg, #000, #020008); overflow: hidden; }
        .stats-bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px); background-size: 60px 60px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }

        .stat-card { position: relative; padding: 40px 24px; border-radius: 20px; background: rgba(6,2,20,0.9); border: 1px solid; text-align: center; overflow: hidden; transition: border-color 0.3s; cursor: default; }
        .stat-ring { position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; border: 1px solid; pointer-events: none; }
        .stat-icon { font-size: 2.5rem; margin-bottom: 16px; display: block; }
        .stat-value { font-family: var(--font-d); font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 900; display: block; margin-bottom: 8px; }
        .stat-label { font-family: var(--font-m); font-size: 0.65rem; letter-spacing: 0.15em; color: var(--muted); text-transform: uppercase; }
        .stat-bg-glow { position: absolute; inset: 0; pointer-events: none; }

        /* ── MISSIONS ── */
        .missions-section { position: relative; padding: 120px 0; background: linear-gradient(180deg, #020008, #040010, #000); overflow: hidden; }
        .missions-neb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(110px); opacity: 0.09; animation: np 13s ease-in-out infinite alternate; }
        .mn1 { width: 700px; height: 500px; background: radial-gradient(ellipse, #38bdf8, transparent); top: -100px; right: -150px; }
        .mn2 { width: 600px; height: 400px; background: radial-gradient(ellipse, #f472b6, transparent); bottom: -80px; left: -100px; animation-duration: 10s; }

        .missions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
        @media (max-width: 900px) { .missions-grid { grid-template-columns: 1fr; } }

        .mission-card { position: relative; display: grid; grid-template-columns: 200px 1fr; border-radius: 20px; overflow: hidden; border: 1px solid; background: rgba(4,1,16,0.96); cursor: default; transform-style: preserve-3d; transition: border-color 0.3s; }
        @media (max-width: 600px) { .mission-card { grid-template-columns: 1fr; } }
        .mission-img-wrap { position: relative; overflow: hidden; min-height: 200px; }
        .mission-img { width: 100%; height: 100%; object-fit: cover; }
        .mission-img-grad { position: absolute; inset: 0; }
        .mission-year-badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 20px; font-family: var(--font-m); font-size: 0.55rem; letter-spacing: 0.1em; backdrop-filter: blur(8px); }
        .mission-body { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .mission-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .mission-agency { font-family: var(--font-m); font-size: 0.6rem; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 4px; }
        .mission-title { font-family: var(--font-d); font-size: 1rem; font-weight: 900; letter-spacing: 0.03em; }
        .mission-status-dot { display: flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; background: rgba(0,0,0,0.4); white-space: nowrap; }
        .mission-status-dot::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: inherit; flex-shrink: 0; }
        .mission-status-dot span { font-family: var(--font-m); font-size: 0.58rem; letter-spacing: 0.1em; color: inherit; }
        .mission-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.65; font-family: var(--font-b); }
        .mission-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .mission-tag { padding: 3px 10px; border-radius: 20px; font-family: var(--font-m); font-size: 0.58rem; letter-spacing: 0.08em; }
        .mission-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
        .mission-stat { text-align: center; }
        .mission-stat-val { font-family: var(--font-d); font-size: 0.9rem; font-weight: 700; display: block; margin-bottom: 4px; }
        .mission-stat-label { font-family: var(--font-m); font-size: 0.55rem; letter-spacing: 0.1em; color: var(--muted); }
        .mission-glow { position: absolute; inset: 0; pointer-events: none; }

        /* ── TIMELINE ── */
        .timeline-section { position: relative; padding: 120px 0; background: linear-gradient(180deg, #000, #050012, #000); overflow: hidden; }
        .tl-bg-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(167,139,250,0.08) 1px, transparent 1px); background-size: 40px 40px; }

        .timeline { position: relative; max-width: 900px; margin: 0 auto; }
        .tl-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(167,139,250,0.3), transparent); transform: translateX(-50%); }
        @media (max-width: 700px) { .tl-line { left: 20px; } }

        .tl-item { position: relative; display: flex; justify-content: flex-end; padding: 0 56px 48px 0; }
        .tl-item.tl-right { justify-content: flex-start; padding: 0 0 48px 56px; }
        @media (max-width: 700px) { .tl-item { justify-content: flex-start !important; padding: 0 0 40px 48px !important; } }

        .tl-content { position: relative; width: calc(50% - 36px); padding: 24px 28px; border-radius: 16px; background: rgba(4,1,16,0.95); border: 1px solid; overflow: hidden; }
        @media (max-width: 700px) { .tl-content { width: 100%; } }
        .tl-year { display: inline-block; padding: 4px 12px; border-radius: 20px; font-family: var(--font-d); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 10px; border: 1px solid; }
        .tl-title { font-family: var(--font-d); font-size: 0.95rem; font-weight: 900; color: #f0e6ff; margin-bottom: 8px; }
        .tl-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; font-family: var(--font-b); }
        .tl-glow { position: absolute; inset: 0; pointer-events: none; }

        .tl-dot { position: absolute; left: 50%; top: 24px; width: 14px; height: 14px; border-radius: 50%; transform: translateX(-50%); z-index: 5; }
        .tl-right .tl-dot { left: 50%; }
        @media (max-width: 700px) { .tl-dot { left: 14px; } }

        /* ── GALLERY ── */
        .gallery-section { position: relative; padding: 120px 0; background: linear-gradient(180deg, #000, #020009); overflow: hidden; }
        .gallery-neb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(110px); }
        .gn1 { width: 800px; height: 500px; background: radial-gradient(ellipse, #a78bfa12, transparent); top: 0; left: 50%; transform: translateX(-50%); }

        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; gap: 16px; }
        @media (max-width: 800px) { .gallery-grid { grid-template-columns: 1fr; } }
        .gallery-item { position: relative; border-radius: 16px; overflow: hidden; cursor: pointer; }
        .col-span-2 { grid-column: span 2; }
        .row-span-2 { grid-row: span 2; }
        @media (max-width: 800px) { .col-span-2, .row-span-2 { grid-column: span 1; grid-row: span 1; } }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; min-height: 220px; display: block; transition: transform 0.6s ease; }
        .gallery-item:hover .gallery-img { transform: scale(1.06); }
        .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,8,0.8) 0%, transparent 50%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 20px; }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-label { font-family: var(--font-m); font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(244,114,182,0.9); }

        /* ── CTA ── */
        .cta-section { position: relative; padding: 120px 0 160px; background: linear-gradient(180deg, #000, #070012); overflow: hidden; }
        .cta-neb { position: absolute; inset: 0; background: radial-gradient(ellipse at center, #a78bfa10 0%, transparent 60%); pointer-events: none; }

        .cta-box { position: relative; max-width: 680px; margin: 0 auto; text-align: center; padding: 60px 40px; border-radius: 28px; border: 1px solid rgba(167,139,250,0.2); background: rgba(4,1,16,0.95); overflow: hidden; }
        .cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at center, #a78bfa10, transparent 70%); pointer-events: none; }
        .cta-orbit { position: absolute; top: -80px; right: -80px; width: 240px; height: 240px; border-radius: 50%; border: 1px solid rgba(167,139,250,0.1); pointer-events: none; }
        .cta-title { font-family: var(--font-d); font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 900; color: #f0e6ff; line-height: 1.1; margin-bottom: 16px; }
        .cta-sub { font-size: 1rem; color: var(--muted); line-height: 1.7; font-family: var(--font-b); margin-bottom: 32px; }
        .cta-input-row { display: flex; gap: 12px; max-width: 480px; margin: 0 auto 16px; }
        .cta-input { flex: 1; padding: 14px 20px; border-radius: 50px; background: rgba(255,255,255,0.05); border: 1px solid rgba(167,139,250,0.25); color: #f0e6ff; font-family: var(--font-b); font-size: 0.9rem; outline: none; transition: border-color 0.3s; }
        .cta-input:focus { border-color: rgba(244,114,182,0.5); }
        .cta-input::placeholder { color: var(--muted); }
        .cta-btn { padding: 14px 28px; border-radius: 50px; background: linear-gradient(135deg, #f472b6, #a78bfa); border: none; color: #fff; font-family: var(--font-d); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; white-space: nowrap; transition: all 0.3s; }
        .cta-fine { font-family: var(--font-m); font-size: 0.58rem; color: rgba(196,181,253,0.3); letter-spacing: 0.1em; }

        @media (max-width: 480px) { .cta-input-row { flex-direction: column; } .hero-cta-row { flex-direction: column; align-items: center; } }
      `}</style>

      <HeroSection />
      <CosmicEventsSection />
      <StatsSection />
      <MissionsSection />
      <TimelineSection />
      <GallerySection />
      <CtaSection />
    </>
  );
}