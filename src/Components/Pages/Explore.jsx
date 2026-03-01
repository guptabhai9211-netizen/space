 import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useSpring, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";

/* ══════════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════════ */
const T = {
  p:  "#7c3aed", s: "#4f46e5", a1: "#c084fc",
  a2: "#818cf8", a3: "#a78bfa", a4: "#e879f9",
  text: "#f0e6ff", muted: "rgba(196,181,253,0.6)",
  g1: "rgba(124,58,237,0.55)", g2: "rgba(129,140,248,0.55)",
};

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */
const STARS = Array.from({length:200},(_,i)=>({
  id:i, x:Math.random()*100, y:Math.random()*100,
  r:Math.random()*2.4+0.3, delay:Math.random()*7, dur:Math.random()*5+2
}));
const PARTICLES = Array.from({length:28},(_,i)=>({
  id:i, x:Math.random()*90+5, y:Math.random()*80+10,
  size:Math.random()*5+2, dur:Math.random()*14+8, delay:Math.random()*7
}));
const SHOOTS = Array.from({length:8},(_,i)=>({
  id:i, startX:Math.random()*65+5, startY:Math.random()*35,
  delay:i*3.5+Math.random()*2.5, dur:Math.random()*1.4+0.8, angle:16+Math.random()*24
}));

const EXPLORE_ITEMS = [
  {
    icon:"🚀", title:"Space Missions",
    desc:"Explore historic and upcoming missions pushing the boundaries of human discovery — from Apollo to Artemis and beyond.",
    color:"#818cf8", colorAlt:"#4f46e5", glow:"rgba(129,140,248,0.55)",
    tag:"ACTIVE MISSIONS", count:"320+", countLabel:"Missions tracked",
    detail:"Artemis III · JWST · Voyager · Cassini",
    facts:["47 currently active","12 agency partners","Next: Mars 2030"],
    bg:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
  },
  {
    icon:"🪐", title:"Planetary Systems",
    desc:"Dive into planets, moons, and distant exoplanets — from scorching Mercury to the ice giants at the edge of our solar system.",
    color:"#c084fc", colorAlt:"#9333ea", glow:"rgba(192,132,252,0.55)",
    tag:"SOLAR SYSTEM", count:"5,500+", countLabel:"Exoplanets found",
    detail:"Mercury · Venus · Earth · Mars · Jupiter",
    facts:["57 potentially habitable","8 solar planets","200B+ estimated galaxies"],
    bg:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
  },
  {
    icon:"🔭", title:"Deep Space Research",
    desc:"Discover cutting-edge research unlocking the secrets of dark matter, black holes, and the very first light of the universe.",
    color:"#a78bfa", colorAlt:"#7c3aed", glow:"rgba(167,139,250,0.55)",
    tag:"RESEARCH LAB", count:"40K+", countLabel:"Research papers",
    detail:"Hubble · JWST · Chandra · Event Horizon",
    facts:["13.8B light-years captured","28 telescopes active","Webb operational since 2022"],
    bg:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
  },
];

const UNIVERSE_SECTIONS = [
  {
    id:"nebulae", label:"Nebulae", icon:"🌌", headline:"Stellar Nurseries", sub:"Where stars are born",
    desc:"Nebulae are vast interstellar clouds of gas and dust — the birthplaces of stars and solar systems. Inside these cosmic nurseries, gravity pulls matter together until nuclear fusion ignites, creating new suns.",
    img:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=80",
    color:"#c084fc", colorAlt:"#9333ea", glow:"rgba(192,132,252,0.4)",
    stats:[{val:"1,000+",label:"Known nebulae"},{val:"100 ly",label:"Avg. diameter"},{val:"10K+",label:"Years to form"}],
    features:["Emission Nebulae — glow from ionised gas","Reflection Nebulae — scatter starlight","Planetary Nebulae — dying star remnants","Supernova Remnants — explosive endings"],
  },
  {
    id:"blackholes", label:"Black Holes", icon:"🕳️", headline:"Gravity's Abyss", sub:"Where space-time breaks",
    desc:"Black holes are regions where gravity is so intense that nothing — not even light — can escape. They warp space-time itself, and at their singularity, the known laws of physics cease to apply.",
    img:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=80",
    color:"#818cf8", colorAlt:"#4f46e5", glow:"rgba(129,140,248,0.4)",
    stats:[{val:"M87*",label:"First imaged"},{val:"6.5B M☉",label:"M87* mass"},{val:"26K ly",label:"Sgr A* distance"}],
    features:["Event Horizon — point of no return","Singularity — infinite density core","Hawking Radiation — slow evaporation","Gravitational Lensing — light bending"],
  },
  {
    id:"galaxies", label:"Galaxies", icon:"🌀", headline:"Island Universes", sub:"100 billion stars each",
    desc:"Galaxies are gravitationally bound systems of stars, stellar remnants, gas, dust, and dark matter. Our Milky Way is just one of an estimated 2 trillion galaxies in the observable universe.",
    img:"https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=900&q=80",
    color:"#a78bfa", colorAlt:"#7c3aed", glow:"rgba(167,139,250,0.4)",
    stats:[{val:"2T",label:"Galaxies visible"},{val:"100K ly",label:"Milky Way width"},{val:"2.5M ly",label:"To Andromeda"}],
    features:["Spiral galaxies — rotating disk arms","Elliptical — featureless spheroidal","Irregular — chaotic structure","Dwarf galaxies — small satellite systems"],
  },
  {
    id:"exoplanets", label:"Exoplanets", icon:"🌍", headline:"Worlds Beyond", sub:"Other Earths await",
    desc:"Exoplanets are planets orbiting stars outside our solar system. With over 5,500 confirmed, astronomers are discovering water-worlds, lava planets, and potentially habitable Earth-like worlds every year.",
    img:"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=900&q=80",
    color:"#7c3aed", colorAlt:"#6d28d9", glow:"rgba(124,58,237,0.4)",
    stats:[{val:"5,500+",label:"Confirmed"},{val:"57",label:"In habitable zone"},{val:"1,000 ly",label:"Farthest confirmed"}],
    features:["Hot Jupiters — massive close orbiters","Super-Earths — rocky & larger","Ocean Worlds — global water coverage","Rogue Planets — no host star"],
  },
];

/* NEW: Space Agencies */
const AGENCIES = [
  { name:"NASA", country:"United States", founded:"1958", missions:"200+", color:"#818cf8", icon:"🇺🇸",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/300px-NASA_logo.svg.png",
    desc:"National Aeronautics and Space Administration — pioneer of human spaceflight.", key:"Apollo, Space Shuttle, ISS, JWST" },
  { name:"ESA", country:"Europe", founded:"1975", missions:"90+", color:"#c084fc", icon:"🇪🇺",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/ESA_logo_simple.svg/300px-ESA_logo_simple.svg.png",
    desc:"European Space Agency — 22 member nations exploring together.", key:"Rosetta, Gaia, ExoMars, Ariane" },
  { name:"ISRO", country:"India", founded:"1969", missions:"130+", color:"#a78bfa", icon:"🇮🇳",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/300px-Indian_Space_Research_Organisation_Logo.svg.png",
    desc:"Indian Space Research Organisation — world's most cost-effective space agency.", key:"Chandrayaan, Mangalyaan, PSLV" },
  { name:"SpaceX", country:"Private/USA", founded:"2002", missions:"250+", color:"#e879f9", icon:"🚀",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/SpaceX-Logo.svg/300px-SpaceX-Logo.svg.png",
    desc:"Elon Musk's revolutionary private space company redefining reusability.", key:"Falcon 9, Starship, Dragon, Starlink" },
  { name:"JAXA", country:"Japan", founded:"2003", missions:"60+", color:"#7c3aed", icon:"🇯🇵",
    logo:"https://upload.wikimedia.org/wikipedia/en/thumb/b/be/JAXA_logo.svg/300px-JAXA_logo.svg.png",
    desc:"Japan Aerospace Exploration Agency — precision engineering in space.", key:"Hayabusa, HTV, H-IIA rocket" },
  { name:"CNSA", country:"China", founded:"1993", missions:"80+", color:"#f59e0b", icon:"🇨🇳",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/CNSA_logo.png/300px-CNSA_logo.png",
    desc:"China National Space Administration — fastest growing space power.", key:"Chang'e, Tiangong, Tianwen, BeiDou" },
];

/* NEW: Space Tech */
const TECH_ITEMS = [
  { icon:"🛰️", name:"Satellites", val:"7,500+", sub:"In orbit today", color:"#818cf8",
    desc:"From weather satellites to GPS networks, orbiting machines define modern life.",
    detail:"LEO / MEO / GEO orbits", progress:88 },
  { icon:"🤖", name:"Rovers & Probes", val:"50+", sub:"Active robotic explorers", color:"#c084fc",
    desc:"Robotic ambassadors crawl alien surfaces and dive into gas giant atmospheres.",
    detail:"Mars · Venus · Titan · Asteroid Belt", progress:72 },
  { icon:"🔬", name:"Space Telescopes", val:"28", sub:"Observing the cosmos", color:"#a78bfa",
    desc:"Each telescope unlocks a new wavelength — radio, infrared, X-ray, gamma.",
    detail:"Hubble · JWST · Chandra · Fermi", progress:65 },
  { icon:"🧬", name:"Space Medicine", val:"6,000+", sub:"Experiments conducted", color:"#e879f9",
    desc:"Zero-g biology, radiation shielding, and long-duration human survival research.",
    detail:"ISS · Mir · Skylab · Tiangong", progress:54 },
  { icon:"⚡", name:"Ion Propulsion", val:"10x", sub:"More efficient than chemical", color:"#7c3aed",
    desc:"Electric ion thrusters propel deep-space probes with astonishing efficiency.",
    detail:"Dawn · Hayabusa · BepiColombo", progress:78 },
  { icon:"🌐", name:"Space Internet", val:"6,000+", sub:"Starlink satellites", color:"#818cf8",
    desc:"Mega-constellations beam broadband to every corner of the Earth's surface.",
    detail:"Starlink · OneWeb · Amazon Kuiper", progress:91 },
];

/* NEW: Timeline milestones */
const TIMELINE = [
  { year:"1957", label:"Sputnik 1", desc:"First artificial satellite", icon:"📡", color:"#818cf8" },
  { year:"1961", label:"Yuri Gagarin", desc:"First human in space", icon:"👨‍🚀", color:"#c084fc" },
  { year:"1969", label:"Apollo 11", desc:"First Moon landing", icon:"🌕", color:"#fbbf24" },
  { year:"1977", label:"Voyager 1 & 2", desc:"Deepest space probes", icon:"🔵", color:"#a78bfa" },
  { year:"1990", label:"Hubble Launch", desc:"Eye in the sky", icon:"🔭", color:"#7c3aed" },
  { year:"1998", label:"ISS Construction", desc:"Humanity's outpost", icon:"🏗️", color:"#818cf8" },
  { year:"2012", label:"Curiosity Rover", desc:"Exploring Mars surface", icon:"🤖", color:"#e879f9" },
  { year:"2021", label:"JWST Launch", desc:"Deepest universe view", icon:"✨", color:"#c084fc" },
  { year:"2024", label:"Artemis Program", desc:"Return to the Moon", icon:"🚀", color:"#a78bfa" },
  { year:"2030", label:"Humans on Mars", desc:"Next giant leap", icon:"🔴", color:"#f87171" },
];

/* NEW: Space facts ticker */
const FACTS = [
  "🌌 The observable universe is 93 billion light-years in diameter",
  "⭐ There are more stars than grains of sand on all Earth's beaches",
  "🌡️ The temperature of space is −270.45°C — near absolute zero",
  "💨 A day on Venus is longer than a year on Venus",
  "🌊 Europa may have twice as much water as Earth's oceans",
  "⚡ Lightning on Saturn is 10,000x more powerful than on Earth",
  "🧲 A magnetar's magnetic field is 1 quadrillion times Earth's",
  "🕳️ Black holes can spin at 99.99% the speed of light",
  "🌍 Earth is the densest planet in the solar system",
  "🚀 It would take 70,000 years to reach Proxima Centauri by car",
];

const MARQUEE = [
  "🚀 Space Missions","🪐 Planetary Science","🔭 Deep Space Imaging",
  "🌌 Galactic Cartography","☄️ Asteroid Tracking","🛰️ Satellite Networks",
  "🌍 Earth Observation","⭐ Stellar Evolution","🕳️ Black Hole Research","🌊 Exoplanet Oceans",
  "🧬 Astrobiology","⚛️ Nuclear Fusion","🌐 Space Internet","🤖 Robotic Explorers",
];

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */
function useTilt(str=13) {
  const ref = useRef(null);
  const rx = useSpring(0,{stiffness:160,damping:24});
  const ry = useSpring(0,{stiffness:160,damping:24});
  const gx = useSpring(50,{stiffness:90,damping:20});
  const gy = useSpring(50,{stiffness:90,damping:20});
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx=(e.clientX-rect.left-rect.width/2)/(rect.width/2);
    const dy=(e.clientY-rect.top-rect.height/2)/(rect.height/2);
    rx.set(-dy*str); ry.set(dx*str);
    gx.set(50+dx*40); gy.set(50+dy*40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return {ref,rx,ry,gx,gy,onMove,onLeave};
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════════ */

/* Animated counter */
function CountUp({ to, duration=2, suffix="" }) {
  const [count,setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref,{once:true});
  useEffect(()=>{
    if (!inView) return;
    let start=0; const end=parseInt(to.replace(/\D/g,""))||0;
    if (end===0) { setCount(to); return; }
    const step = end / (duration*60);
    const timer = setInterval(()=>{
      start+=step;
      if (start>=end){ setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start)+suffix);
    },1000/60);
    return ()=>clearInterval(timer);
  },[inView]);
  return <span ref={ref}>{count || "0"}</span>;
}

/* Orbital ring loader */
function OrbitalRing({ color, size=120, speed=4, delay=0, dotSize=8 }) {
  return (
    <div style={{ position:"absolute", width:size, height:size, borderRadius:"50%",
      border:`1px solid ${color}20`, top:"50%", left:"50%",
      transform:"translate(-50%,-50%)", pointerEvents:"none" }}>
      <motion.div style={{ position:"absolute", top:-(dotSize/2), left:"50%",
        marginLeft:-(dotSize/2), width:dotSize, height:dotSize,
        borderRadius:"50%", background:color,
        boxShadow:`0 0 ${dotSize*2}px ${color}, 0 0 ${dotSize*4}px ${color}40` }}
        animate={{ rotate: 360 }}
        transition={{ duration:speed, repeat:Infinity, ease:"linear", delay }}
        style={{ transformOrigin:`${size/2}px ${size/2 + dotSize/2}px` }}
      />
    </div>
  );
}

/* Glitch text */
function GlitchText({ text, color="#a78bfa" }) {
  return (
    <span className="glitch-wrap" data-text={text} style={{ color, position:"relative", display:"inline-block" }}>
      {text}
    </span>
  );
}

/* Explore Card */
function ExploreCard({ item, index }) {
  const [hovered,setHovered] = useState(false);
  const [imgErr,setImgErr] = useState(false);
  const {ref,rx,ry,gx,gy,onMove,onLeave} = useTilt(11);
  return (
    <motion.div
      initial={{ opacity:0, y:70, rotateX:-20, scale:0.85 }}
      whileInView={{ opacity:1, y:0, rotateX:0, scale:1 }}
      viewport={{ once:true, margin:"-40px" }}
      transition={{ duration:1, delay:index*0.15, ease:[0.23,1,0.32,1] }}
      style={{ perspective:1000, width:"100%" }}
    >
      <motion.div ref={ref} className="ec-card"
        style={{ rotateX:rx, rotateY:ry, transformStyle:"preserve-3d" }}
        onMouseMove={e=>{ setHovered(true); onMove(e); }}
        onMouseLeave={()=>{ setHovered(false); onLeave(); }}
        whileHover={{ scale:1.04, z:30 }}
        transition={{ type:"spring", stiffness:220, damping:28 }}
      >
        {!imgErr
          ? <motion.img src={item.bg} alt="" className="ec-bg-img"
              animate={{ scale:hovered?1.12:1.03 }}
              transition={{ duration:0.85 }}
              onError={()=>setImgErr(true)}
            />
          : <div className="ec-bg-img" style={{ background:`radial-gradient(ellipse at 30% 30%,${item.color}25,transparent)` }} />
        }
        <div className="ec-dark" />
        <motion.div className="ec-cursor-glow"
          style={{ background:`radial-gradient(circle at ${gx}% ${gy}%,${item.glow} 0%,transparent 60%)` }}
          animate={{ opacity:hovered?1:0 }} transition={{ duration:0.35 }}
        />
        <motion.div className="ec-border-glow"
          animate={{ opacity:hovered?1:0, boxShadow:hovered?`0 0 0 1px ${item.color}70,0 0 70px ${item.glow}`:"none" }}
          transition={{ duration:0.45 }}
        />
        <motion.div className="ec-scan"
          animate={hovered?{y:["0%","100%"],opacity:[0,0.45,0]}:{opacity:0}}
          transition={{ duration:2, repeat:hovered?Infinity:0, ease:"linear" }}
          style={{ background:`linear-gradient(to bottom,transparent,${item.color}55,transparent)` }}
        />
        {/* Pulse rings on hover */}
        {hovered && [0,1,2].map(i=>(
          <motion.div key={i} style={{
            position:"absolute", inset:0, borderRadius:22,
            border:`1px solid ${item.color}40`, pointerEvents:"none", zIndex:8,
          }}
            initial={{ scale:1, opacity:0.6 }}
            animate={{ scale:1.05+i*0.08, opacity:0 }}
            transition={{ duration:1.5, delay:i*0.4, repeat:Infinity }}
          />
        ))}
        <motion.div className="ec-badge"
          style={{ background:`${item.color}1a`, border:`1px solid ${item.color}55`, color:item.color }}
          animate={{ opacity:hovered?1:0.55, y:hovered?0:-4 }}
        >✦ {item.tag}</motion.div>
        <div className="ec-num" style={{ color:`${item.color}35` }}>{String(index+1).padStart(2,"0")}</div>
        <div className="ec-content" style={{ transform:"translateZ(18px)" }}>
          <div className="ec-top-row">
            <motion.span className="ec-icon"
              animate={hovered?{scale:1.3,y:-7,filter:`drop-shadow(0 0 20px ${item.color})`}:{scale:1,y:0,filter:`drop-shadow(0 0 8px ${item.color}80)`}}
              transition={{ duration:0.45 }}
            >{item.icon}</motion.span>
            <motion.div className="ec-count-box"
              style={{ borderColor:`${item.color}35`, background:`${item.color}0d` }}
              animate={{ opacity:hovered?1:0, scale:hovered?1:0.88 }}
              transition={{ duration:0.3, delay:hovered?0.06:0 }}
            >
              <span className="ec-count" style={{ color:item.color }}>{item.count}</span>
              <span className="ec-count-label">{item.countLabel}</span>
            </motion.div>
          </div>
          <h3 className="ec-title">{item.title}</h3>
          <p className="ec-desc">{item.desc}</p>
          <motion.div className="ec-detail" style={{ color:`${item.color}80` }}
            animate={{ opacity:hovered?0.75:0.3 }} transition={{ duration:0.3 }}
          >{item.detail}</motion.div>
          <motion.div className="ec-facts"
            animate={{ opacity:hovered?1:0, y:hovered?0:14 }}
            transition={{ duration:0.35, delay:hovered?0.07:0 }}
          >
            {item.facts.map((f,i)=>(
              <div key={i} className="ec-fact">
                <span className="ec-fact-dot" style={{ background:item.color, boxShadow:`0 0 6px ${item.color}` }} />
                {f}
              </div>
            ))}
          </motion.div>
          <motion.button className="ec-cta"
            style={{ background:`linear-gradient(135deg,${item.color},${item.colorAlt})`, boxShadow:`0 6px 26px ${item.glow}` }}
            animate={{ opacity:hovered?1:0, y:hovered?0:16 }}
            transition={{ duration:0.3, delay:hovered?0.1:0 }}
            whileTap={{ scale:0.95 }}
          >Explore Now →</motion.button>
        </div>
        <div className="ec-corner ec-tl" style={{ borderColor:`${item.color}80` }} />
        <div className="ec-corner ec-br" style={{ borderColor:`${item.color}80` }} />
      </motion.div>
    </motion.div>
  );
}

/* Universe Tab Section */
function UniverseSection({ inView }) {
  const [active,setActive] = useState(0);
  const [imgErr,setImgErr] = useState(false);
  const item = UNIVERSE_SECTIONS[active];
  return (
    <div className="us-root">
      <motion.div className="us-header"
        initial={{ opacity:0, y:30 }}
        animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.8, ease:[0.23,1,0.32,1] }}
      >
        <div className="us-eyebrow"><div className="us-eyebrow-dot" />EXPLORE THE UNIVERSE</div>
        <h2 className="us-title">Cosmic <span className="us-acc">Wonders</span></h2>
        <p className="us-sub">From nebulae to black holes — discover the most extraordinary phenomena in the cosmos.</p>
        <div className="us-divider" />
      </motion.div>
      <motion.div className="us-tabs"
        initial={{ opacity:0, y:20 }}
        animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.7, delay:0.2 }}
      >
        {UNIVERSE_SECTIONS.map((sec,i)=>(
          <motion.button key={sec.id} className={`us-tab ${active===i?"active":""}`}
            onClick={()=>{ setActive(i); setImgErr(false); }}
            style={active===i?{ background:`${sec.color}1a`, border:`1px solid ${sec.color}60`, color:sec.color, boxShadow:`0 0 20px ${sec.color}25` }:{}}
            whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.96 }}
            transition={{ type:"spring", stiffness:300, damping:24 }}
          >
            <span>{sec.icon}</span><span>{sec.label}</span>
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={active} className="us-panel"
          initial={{ opacity:0, y:32, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:-22, scale:0.97 }}
          transition={{ duration:0.55, ease:[0.23,1,0.32,1] }}
        >
          <div className="us-img-wrap">
            <div className="us-img-frame" style={{ boxShadow:`0 0 70px ${item.glow},0 0 0 1px ${item.color}30` }}>
              {!imgErr
                ? <img src={item.img} alt={item.label} className="us-img" onError={()=>setImgErr(true)} />
                : <div className="us-img" style={{ background:`radial-gradient(ellipse,${item.color}25,transparent)` }} />
              }
              <div className="us-img-overlay" style={{ background:`linear-gradient(135deg,${item.color}10 0%,transparent 60%)` }} />
              <div className="us-img-scanlines" />
              {/* Animated scan beam */}
              <motion.div style={{
                position:"absolute", left:0, right:0, height:"3px",
                background:`linear-gradient(90deg,transparent,${item.color}80,transparent)`,
                pointerEvents:"none",
              }}
                animate={{ top:["0%","100%","0%"] }}
                transition={{ duration:4, repeat:Infinity, ease:"linear" }}
              />
              <div className="us-img-corner us-img-tl" style={{ borderColor:`${item.color}80` }} />
              <div className="us-img-corner us-img-br" style={{ borderColor:`${item.color}80` }} />
              <div className="us-img-label" style={{ background:`${item.color}18`, border:`1px solid ${item.color}50`, color:item.color }}>
                {item.icon} {item.label}
              </div>
            </div>
            <div className="us-stats-row">
              {item.stats.map((s,i)=>(
                <motion.div key={i} className="us-stat-box"
                  style={{ borderColor:`${item.color}25`, background:`${item.color}08` }}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.09+0.15 }}
                  whileHover={{ background:`${item.color}15`, scale:1.04 }}
                >
                  <span className="us-stat-val" style={{ color:item.color }}>{s.val}</span>
                  <span className="us-stat-lbl">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="us-text-wrap">
            <div className="us-tag" style={{ background:`${item.color}18`, border:`1px solid ${item.color}50`, color:item.color }}>✦ {item.sub}</div>
            <h3 className="us-headline">{item.headline}</h3>
            <p className="us-desc">{item.desc}</p>
            <div className="us-features-label">Key Phenomena</div>
            <div className="us-features">
              {item.features.map((f,i)=>(
                <motion.div key={i} className="us-feature"
                  initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.09+0.2 }}
                  whileHover={{ background:`rgba(167,139,250,0.1)`, x:4 }}
                >
                  <div className="us-feature-dot" style={{ background:item.color, boxShadow:`0 0 10px ${item.color}` }} />
                  <span>{f}</span>
                </motion.div>
              ))}
            </div>
            <motion.button className="us-cta-btn"
              style={{ background:`linear-gradient(135deg,${item.color},${item.colorAlt||"#4f46e5"})`, boxShadow:`0 8px 32px ${item.glow}` }}
              whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.96 }}
            >Discover {item.label} →</motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Space Agencies Section — NEW */
function AgenciesSection({ inView }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div className="ag-root">
      <motion.div className="section-header"
        initial={{ opacity:0, y:35 }} animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.85, ease:[0.23,1,0.32,1] }}
      >
        <div className="eyebrow-pill" style={{ borderColor:"rgba(129,140,248,0.35)", background:"rgba(79,70,229,0.1)", color:"#a5b4fc" }}>
          <div className="eyebrow-dot" style={{ background:"#a5b4fc", boxShadow:"0 0 8px #a5b4fc" }} />
          SPACE AGENCIES
        </div>
        <h2 className="section-title">Global <span className="grad-text">Explorers</span></h2>
        <p className="section-sub">The organizations racing to the stars — meet the builders of humanity's cosmic future.</p>
        <div className="section-divider" />
      </motion.div>

      <div className="ag-grid">
        {AGENCIES.map((ag,i)=>(
          <motion.div key={ag.name} className="ag-card"
            initial={{ opacity:0, y:50, scale:0.9 }}
            whileInView={{ opacity:1, y:0, scale:1 }}
            viewport={{ once:true, margin:"-30px" }}
            transition={{ duration:0.75, delay:i*0.1, ease:[0.23,1,0.32,1] }}
            onHoverStart={()=>setHoveredIdx(i)}
            onHoverEnd={()=>setHoveredIdx(null)}
            whileHover={{ y:-10, scale:1.03 }}
            style={{
              border: hoveredIdx===i ? `1px solid ${ag.color}60` : "1px solid rgba(167,139,250,0.12)",
              boxShadow: hoveredIdx===i ? `0 24px 60px ${ag.color}25, 0 0 0 1px ${ag.color}20` : "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {/* Glow orb */}
            <motion.div style={{
              position:"absolute", top:-30, right:-30, width:100, height:100,
              borderRadius:"50%", background:`radial-gradient(circle,${ag.color}30,transparent)`,
              pointerEvents:"none",
            }}
              animate={{ scale: hoveredIdx===i ? 1.8 : 1 }}
              transition={{ duration:0.5 }}
            />
            <div className="ag-top">
              <div className="ag-icon-wrap" style={{ background:`${ag.color}15`, border:`1px solid ${ag.color}30` }}>
                <span style={{ fontSize:"1.6rem" }}>{ag.icon}</span>
              </div>
              <div>
                <div className="ag-name" style={{ color: hoveredIdx===i ? ag.color : "#f0e6ff" }}>{ag.name}</div>
                <div className="ag-country">{ag.country} · Est. {ag.founded}</div>
              </div>
            </div>
            <p className="ag-desc">{ag.desc}</p>
            <div className="ag-missions" style={{ background:`${ag.color}12`, border:`1px solid ${ag.color}25` }}>
              <span className="ag-m-val" style={{ color:ag.color }}>{ag.missions}</span>
              <span className="ag-m-label">missions</span>
            </div>
            <div className="ag-key" style={{ color:`${ag.color}70` }}>
              <span style={{ fontSize:"0.55rem", letterSpacing:"2px", fontFamily:"'Orbitron',monospace", textTransform:"uppercase", marginRight:6, color:`${ag.color}50` }}>KEY:</span>
              {ag.key}
            </div>
            <motion.div style={{
              position:"absolute", bottom:0, left:0, right:0, height:2,
              background:`linear-gradient(90deg,transparent,${ag.color}80,transparent)`,
              borderRadius:"0 0 20px 20px",
            }}
              animate={{ opacity: hoveredIdx===i ? 1 : 0.2 }}
              transition={{ duration:0.4 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Space Tech Section — NEW */
function TechSection({ inView }) {
  return (
    <div className="tech-root">
      <motion.div className="section-header"
        initial={{ opacity:0, y:35 }} animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.85, delay:0.1 }}
      >
        <div className="eyebrow-pill" style={{ borderColor:"rgba(192,132,252,0.35)", background:"rgba(124,58,237,0.1)", color:"#c084fc" }}>
          <div className="eyebrow-dot" style={{ background:"#c084fc", boxShadow:"0 0 8px #c084fc" }} />
          SPACE TECHNOLOGY
        </div>
        <h2 className="section-title">Tools of <span className="grad-text">Exploration</span></h2>
        <p className="section-sub">The incredible machinery humanity has built to reach, observe, and understand the cosmos.</p>
        <div className="section-divider" />
      </motion.div>

      <div className="tech-grid">
        {TECH_ITEMS.map((t,i)=>(
          <motion.div key={t.name} className="tech-card"
            initial={{ opacity:0, x:i%2===0?-40:40, y:20 }}
            whileInView={{ opacity:1, x:0, y:0 }}
            viewport={{ once:true, margin:"-20px" }}
            transition={{ duration:0.75, delay:i*0.1 }}
            whileHover={{ y:-6, scale:1.02, boxShadow:`0 20px 50px ${t.color}25` }}
          >
            <div className="tech-top">
              <motion.span style={{ fontSize:"2.2rem" }}
                whileHover={{ scale:1.3, rotate:10, filter:`drop-shadow(0 0 14px ${t.color})` }}
              >{t.icon}</motion.span>
              <div>
                <div className="tech-name" style={{ color:t.color }}>{t.name}</div>
                <div className="tech-sub">{t.sub}</div>
              </div>
              <div className="tech-val" style={{ color:t.color }}>{t.val}</div>
            </div>
            <p className="tech-desc">{t.desc}</p>
            <div className="tech-detail" style={{ color:`${t.color}60` }}>{t.detail}</div>
            {/* Progress bar */}
            <div className="tech-bar-wrap">
              <div className="tech-bar-track">
                <motion.div className="tech-bar-fill"
                  style={{ background:`linear-gradient(90deg,${t.color}90,${t.color})`, boxShadow:`0 0 10px ${t.color}60` }}
                  initial={{ width:0 }}
                  whileInView={{ width:`${t.progress}%` }}
                  viewport={{ once:true }}
                  transition={{ duration:1.2, delay:i*0.1, ease:[0.23,1,0.32,1] }}
                />
              </div>
              <span className="tech-pct" style={{ color:`${t.color}80` }}>{t.progress}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Timeline Section — NEW */
function TimelineSection({ inView }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div className="tl-root">
      <motion.div className="section-header"
        initial={{ opacity:0, y:35 }} animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.85 }}
      >
        <div className="eyebrow-pill" style={{ borderColor:"rgba(167,139,250,0.35)", background:"rgba(124,58,237,0.1)", color:"#a78bfa" }}>
          <div className="eyebrow-dot" style={{ background:"#a78bfa", boxShadow:"0 0 8px #a78bfa" }} />
          SPACE HISTORY
        </div>
        <h2 className="section-title">Journey <span className="grad-text">Through Time</span></h2>
        <p className="section-sub">Key milestones that define humanity's greatest adventure — from Sputnik to the stars.</p>
        <div className="section-divider" />
      </motion.div>

      <div className="tl-track">
        {/* Central line */}
        <motion.div className="tl-line"
          initial={{ scaleY:0 }} whileInView={{ scaleY:1 }}
          viewport={{ once:true }} transition={{ duration:1.5, ease:[0.23,1,0.32,1] }}
        />
        {TIMELINE.map((item,i)=>{
          const isLeft = i%2===0;
          return (
            <motion.div key={i} className={`tl-item ${isLeft?"tl-left":"tl-right"}`}
              initial={{ opacity:0, x:isLeft?-50:50, y:20 }}
              whileInView={{ opacity:1, x:0, y:0 }}
              viewport={{ once:true, margin:"-20px" }}
              transition={{ duration:0.75, delay:i*0.08 }}
              onHoverStart={()=>setHoveredIdx(i)}
              onHoverEnd={()=>setHoveredIdx(null)}
            >
              {/* Connector dot */}
              <motion.div className="tl-dot"
                style={{ background:item.color, boxShadow:`0 0 0 4px ${item.color}30` }}
                animate={{ scale: hoveredIdx===i ? 1.5 : 1, boxShadow: hoveredIdx===i ? `0 0 0 8px ${item.color}20, 0 0 20px ${item.color}60` : `0 0 0 4px ${item.color}30` }}
                transition={{ duration:0.3 }}
              />
              {/* Connector line */}
              <div className="tl-connector" style={{ background:`linear-gradient(${isLeft?"90deg":"270deg"},transparent,${item.color}50)` }} />
              {/* Card */}
              <motion.div className="tl-card"
                style={{ border: hoveredIdx===i ? `1px solid ${item.color}60` : "1px solid rgba(167,139,250,0.12)" }}
                whileHover={{ y:-4 }}
              >
                <motion.div style={{
                  position:"absolute", top:0, left:0, right:0, height:2,
                  background:`linear-gradient(90deg,transparent,${item.color}80,transparent)`,
                }}
                  animate={{ opacity: hoveredIdx===i ? 1 : 0 }}
                />
                <div className="tl-year" style={{ color:item.color }}>{item.year}</div>
                <div className="tl-card-icon">{item.icon}</div>
                <div className="tl-card-label">{item.label}</div>
                <div className="tl-card-desc">{item.desc}</div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* Space Facts Ticker — NEW */
function FactsTicker({ inView }) {
  const [idx,setIdx] = useState(0);
  const [anim,setAnim] = useState(true);
  useEffect(()=>{
    const id = setInterval(()=>{
      setAnim(false);
      setTimeout(()=>{ setIdx(i=>(i+1)%FACTS.length); setAnim(true); },350);
    },4000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <motion.div className="facts-ticker"
      initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.8, delay:0.5 }}
    >
      <div className="facts-label">
        <motion.div className="facts-dot" animate={{ scale:[1,1.4,1] }} transition={{ duration:1.2, repeat:Infinity }} />
        LIVE FACT
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} className="facts-text"
          initial={{ opacity:0, y:16, filter:"blur(6px)" }}
          animate={{ opacity:1, y:0, filter:"blur(0px)" }}
          exit={{ opacity:0, y:-16, filter:"blur(6px)" }}
          transition={{ duration:0.4 }}
        >
          {FACTS[idx]}
        </motion.div>
      </AnimatePresence>
      <div className="facts-dots">
        {FACTS.map((_,i)=>(
          <motion.div key={i} className="facts-pip"
            animate={{ background: i===idx ? "#a78bfa" : "rgba(167,139,250,0.2)", scale: i===idx ? 1.3 : 1 }}
            transition={{ duration:0.3 }}
            onClick={()=>setIdx(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* Newsletter/CTA — enhanced */
function NewsletterSection({ inView }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <motion.div className="nl-root"
      initial={{ opacity:0, y:40 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.9, delay:0.3 }}
    >
      {/* Animated border */}
      <motion.div className="nl-border-anim" />
      <div className="nl-glow" />
      <div className="nl-inner">
        <div className="nl-icon">📡</div>
        <h3 className="nl-title">Stay in <span style={{ color:"#c084fc" }}>Orbit</span></h3>
        <p className="nl-sub">Get weekly mission updates, launch alerts, and cosmic discoveries straight to your inbox.</p>
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" className="nl-form"
              initial={{ opacity:1 }} exit={{ opacity:0, scale:0.9 }}
            >
              <input className="nl-input" type="email" placeholder="your@email.com"
                value={email} onChange={e=>setEmail(e.target.value)}
              />
              <motion.button className="nl-btn"
                whileHover={{ scale:1.06, boxShadow:"0 8px 32px rgba(124,58,237,0.65)" }}
                whileTap={{ scale:0.96 }}
                onClick={()=>{ if(email) setSent(true); }}
              >
                Launch →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="sent" className="nl-sent"
              initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ type:"spring", stiffness:200, damping:18 }}
            >
              <span style={{ fontSize:"2rem" }}>🚀</span>
              <span style={{ color:"#a78bfa", fontFamily:"'Orbitron',monospace", fontSize:"0.8rem", letterSpacing:"2px" }}>YOU'RE IN ORBIT!</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="nl-stats">
          {[["40K+","Subscribers"],["Weekly","Updates"],["Free","Forever"]].map(([v,l])=>(
            <div key={l} className="nl-stat">
              <span className="nl-stat-val">{v}</span>
              <span className="nl-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export default function ExploreSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef,{once:true,margin:"-60px"});
  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["0%","15%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&display=swap');

        /* ── Reset ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Root ── */
        .es-root {
          position: relative;
          background: linear-gradient(180deg,#000 0%,#04000e 30%,#0a0020 60%,#050010 80%,#000 100%);
          color: white; font-family: 'Exo 2', sans-serif;
          padding: 120px 0 0; overflow: hidden;
        }

        /* ── Stars ── */
        .es-stars { position:absolute; inset:0; pointer-events:none; z-index:0; }
        .es-star {
          position:absolute; border-radius:50%; background:white;
          animation:es-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes es-tw { from{opacity:0.03;transform:scale(0.5)} to{opacity:0.9;transform:scale(1.5)} }

        /* ── Shoots ── */
        .es-shoot {
          position:absolute; height:1.5px; pointer-events:none;
          background:linear-gradient(90deg,rgba(255,255,255,0.9),transparent);
          opacity:0; border-radius:2px;
          animation:es-sa var(--dur) var(--del) linear infinite;
        }
        @keyframes es-sa {
          0%{opacity:0;width:0;transform:translate(0,0) rotate(var(--ang))}
          6%{opacity:1}
          55%{opacity:0.8;width:130px}
          100%{opacity:0;width:60px;transform:translate(260px,140px) rotate(var(--ang))}
        }

        /* ── Particles ── */
        .es-particle {
          position:absolute; border-radius:50%; pointer-events:none; z-index:1;
          background:radial-gradient(circle,rgba(167,139,250,0.55),transparent);
          animation:es-float var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes es-float { from{transform:translateY(0) scale(1);opacity:0.15} to{transform:translateY(-30px) scale(1.35);opacity:0.5} }

        /* ── Nebulae ── */
        .es-neb {
          position:absolute; border-radius:50%; pointer-events:none; filter:blur(110px);
          animation:es-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes es-pulse { from{opacity:var(--a);transform:scale(1)} to{opacity:var(--b);transform:scale(1.25)} }

        /* ── Warp grid ── */
        .es-warp {
          position:absolute; inset:0; pointer-events:none; z-index:1; opacity:0.025;
          background-image:linear-gradient(rgba(167,139,250,1) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,1) 1px,transparent 1px);
          background-size:80px 80px;
          mask-image:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0.55) 0%,transparent 75%);
        }

        /* ── Glow bars ── */
        .es-gbar {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,#7c3aed,#818cf8,#c084fc,transparent);
          background-size:200% 100%; animation:es-barslide 5s linear infinite;
        }
        .es-gbar.top{top:0} .es-gbar.bot{bottom:0;animation-delay:-2.5s}
        @keyframes es-barslide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── Glitch ── */
        .glitch-wrap { display:inline-block; position:relative; }
        .glitch-wrap::before, .glitch-wrap::after {
          content:attr(data-text); position:absolute; top:0; left:0;
          width:100%; height:100%; opacity:0;
        }
        .glitch-wrap::before { color:#c084fc; animation:glitch1 5s infinite steps(1); clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%); }
        .glitch-wrap::after  { color:#818cf8; animation:glitch2 5s infinite steps(1); clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%); }
        @keyframes glitch1 { 0%,90%{opacity:0;transform:none} 92%{opacity:0.8;transform:translate(-3px,1px)} 95%{opacity:0;transform:none} }
        @keyframes glitch2 { 0%,93%{opacity:0;transform:none} 95%{opacity:0.8;transform:translate(3px,-1px)} 98%{opacity:0;transform:none} }

        /* ── Inner ── */
        .es-inner {
          position:relative; z-index:10;
          max-width:1320px; margin:0 auto; padding:0 32px;
        }
        @media(max-width:768px){.es-inner{padding:0 20px}}

        /* ── Eyebrow / Headings helpers ── */
        .eyebrow-pill {
          display:inline-flex; align-items:center; gap:10px;
          padding:6px 18px; border-radius:40px; border:1px solid;
          font-family:'Orbitron',monospace; font-size:0.58rem;
          letter-spacing:0.22em; margin-bottom:22px;
        }
        .eyebrow-dot {
          width:5px; height:5px; border-radius:50%;
          animation:es-blink 1.4s ease-in-out infinite;
        }
        @keyframes es-blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

        .section-header { text-align:center; margin-bottom:56px; }
        .section-title {
          font-family:'Orbitron',monospace;
          font-size:clamp(2rem,4vw,3.6rem); font-weight:900; line-height:1.06;
          color:#f0e6ff;
        }
        .grad-text {
          background:linear-gradient(135deg,#c084fc,#a78bfa,#7c3aed);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .section-sub {
          margin-top:14px; font-size:0.95rem; font-weight:300;
          color:rgba(196,181,253,0.55); line-height:1.75;
          max-width:540px; margin-left:auto; margin-right:auto;
        }
        .section-divider {
          width:80px; height:1px; margin:24px auto;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent);
        }

        /* ── Explore Cards ── */
        .es-eyebrow {
          display:inline-flex; align-items:center; gap:10px;
          padding:6px 18px; border-radius:40px;
          border:1px solid rgba(129,140,248,0.35); background:rgba(79,70,229,0.1);
          font-family:'Orbitron',monospace; font-size:0.58rem;
          letter-spacing:0.22em; color:#a5b4fc; margin-bottom:22px;
        }
        .es-eyebrow-dot {
          width:5px; height:5px; border-radius:50%;
          background:#a5b4fc; box-shadow:0 0 8px #a5b4fc;
          animation:es-blink 1.4s ease-in-out infinite;
        }
        .es-title {
          font-family:'Orbitron',monospace;
          font-size:clamp(2.2rem,4.5vw,4.2rem); font-weight:900; line-height:1.05;
          color:#f0e6ff; text-shadow:0 0 60px rgba(129,140,248,0.3);
        }
        .es-title-acc {
          background:linear-gradient(135deg,#a5b4fc,#818cf8,#c084fc);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .es-sub {
          margin-top:16px; font-size:0.95rem; font-weight:300;
          color:rgba(196,181,253,0.55); line-height:1.75;
          max-width:540px; margin-left:auto; margin-right:auto;
        }
        .es-divider {
          width:80px; height:1px; margin:28px auto;
          background:linear-gradient(90deg,transparent,rgba(129,140,248,0.6),transparent);
        }
        .es-grid {
          display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
          grid-auto-rows:520px; gap:26px; margin-top:56px;
        }
        @media(max-width:980px){.es-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:500px}}
        @media(max-width:620px){.es-grid{grid-template-columns:minmax(0,1fr);grid-auto-rows:500px}}

        /* ── EC Card ── */
        .ec-card {
          position:relative; border-radius:22px; overflow:hidden;
          border:1px solid rgba(167,139,250,0.1); background:rgba(4,0,18,0.96);
          width:100%; height:100%; cursor:pointer;
          display:flex; flex-direction:column; transform-style:preserve-3d;
        }
        .ec-bg-img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.2 }
        .ec-card:hover .ec-bg-img{opacity:0.38}
        .ec-dark { position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,0,12,0.97) 0%,rgba(0,0,12,0.5) 55%,rgba(0,0,12,0.12) 100%) }
        .ec-cursor-glow{position:absolute;inset:0;z-index:2;pointer-events:none}
        .ec-border-glow{position:absolute;inset:0;border-radius:22px;z-index:3;pointer-events:none}
        .ec-scan{position:absolute;left:0;right:0;top:0;height:50%;z-index:4;pointer-events:none}
        .ec-badge{position:absolute;top:14px;left:14px;z-index:6;padding:4px 12px;border-radius:20px;font-family:'Orbitron',monospace;font-size:0.5rem;letter-spacing:0.14em;font-weight:700}
        .ec-num{position:absolute;top:12px;right:14px;z-index:6;font-family:'Orbitron',monospace;font-size:1.7rem;font-weight:900}
        .ec-content{position:relative;z-index:6;padding:22px 20px 24px;display:flex;flex-direction:column;flex:1;justify-content:flex-end;margin-top:auto}
        .ec-top-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}
        .ec-icon{font-size:2.9rem;display:inline-block;transform-origin:center}
        .ec-count-box{display:flex;flex-direction:column;align-items:flex-end;padding:6px 12px;border-radius:10px;border:1px solid;gap:2px}
        .ec-count{font-family:'Orbitron',monospace;font-size:1rem;font-weight:900}
        .ec-count-label{font-size:0.55rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(196,181,253,0.45)}
        .ec-title{font-family:'Orbitron',monospace;font-size:1.05rem;font-weight:900;color:#f0e6ff;letter-spacing:0.05em;margin-bottom:8px}
        .ec-desc{font-size:0.8rem;font-weight:300;color:rgba(196,181,253,0.6);line-height:1.65;margin-bottom:8px}
        .ec-detail{font-family:'Orbitron',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;line-height:1.7}
        .ec-facts{display:flex;flex-direction:column;gap:5px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.05);margin-bottom:14px}
        .ec-fact{display:flex;align-items:center;gap:8px;font-size:0.72rem;color:rgba(196,181,253,0.55)}
        .ec-fact-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
        .ec-cta{padding:9px 20px;border-radius:40px;border:none;cursor:pointer;font-family:'Orbitron',monospace;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;color:white;align-self:flex-start}
        .ec-corner{position:absolute;width:14px;height:14px;z-index:7;pointer-events:none}
        .ec-tl{top:8px;left:8px;border-top:1.5px solid;border-left:1.5px solid;border-radius:3px 0 0 0}
        .ec-br{bottom:8px;right:8px;border-bottom:1.5px solid;border-right:1.5px solid;border-radius:0 0 3px 0}

        /* ── Marquee ── */
        .es-marquee-wrap{overflow:hidden;margin-top:60px;border-top:1px solid rgba(167,139,250,0.1);border-bottom:1px solid rgba(167,139,250,0.1);padding:14px 0;position:relative}
        .es-marquee-wrap::before,.es-marquee-wrap::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none}
        .es-marquee-wrap::before{left:0;background:linear-gradient(90deg,#000,transparent)}
        .es-marquee-wrap::after{right:0;background:linear-gradient(-90deg,#000,transparent)}
        .es-marquee{display:flex;gap:40px;width:max-content;animation:es-marq 32s linear infinite}
        @keyframes es-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .es-marquee-item{display:flex;align-items:center;gap:10px;white-space:nowrap;font-family:'Orbitron',monospace;font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(167,139,250,0.4)}
        .es-marquee-dot{width:4px;height:4px;border-radius:50%;background:rgba(167,139,250,0.5);flex-shrink:0}

        /* ══ Universe Section ══ */
        .us-root{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:100px 32px 0}
        @media(max-width:768px){.us-root{padding:80px 20px 0}}
        .us-header{text-align:center;margin-bottom:48px}
        .us-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:6px 18px;border-radius:40px;border:1px solid rgba(124,58,237,0.4);background:rgba(124,58,237,0.08);font-family:'Orbitron',monospace;font-size:0.58rem;letter-spacing:0.22em;color:#c084fc;margin-bottom:22px}
        .us-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:#c084fc;box-shadow:0 0 8px #c084fc;animation:es-blink 1.4s ease-in-out infinite}
        .us-title{font-family:'Orbitron',monospace;font-size:clamp(2.2rem,4.5vw,4rem);font-weight:900;line-height:1.06;color:#f0e6ff}
        .us-acc{background:linear-gradient(135deg,#c084fc,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .us-sub{margin-top:14px;font-size:0.95rem;font-weight:300;color:rgba(196,181,253,0.55);line-height:1.75;max-width:540px;margin-left:auto;margin-right:auto}
        .us-divider{width:80px;height:1px;margin:24px auto;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent)}
        .us-tabs{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:40px}
        .us-tab{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:40px;cursor:pointer;border:1px solid rgba(167,139,250,0.2);background:rgba(5,0,20,0.6);font-family:'Orbitron',monospace;font-size:0.6rem;letter-spacing:0.12em;color:rgba(196,181,253,0.5);transition:color 0.3s;white-space:nowrap}
        .us-panel{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
        @media(max-width:880px){.us-panel{grid-template-columns:1fr;gap:32px}}
        .us-img-wrap{display:flex;flex-direction:column;gap:16px}
        .us-img-frame{position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(167,139,250,0.15);aspect-ratio:16/10}
        .us-img{width:100%;height:100%;object-fit:cover;display:block}
        .us-img-overlay{position:absolute;inset:0;pointer-events:none}
        .us-img-scanlines{position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px);opacity:0.4}
        .us-img-corner{position:absolute;width:18px;height:18px;pointer-events:none}
        .us-img-tl{top:10px;left:10px;border-top:2px solid;border-left:2px solid;border-radius:4px 0 0 0}
        .us-img-br{bottom:10px;right:10px;border-bottom:2px solid;border-right:2px solid;border-radius:0 0 4px 0}
        .us-img-label{position:absolute;bottom:14px;left:14px;padding:5px 14px;border-radius:20px;font-family:'Orbitron',monospace;font-size:0.55rem;letter-spacing:0.12em;font-weight:700}
        .us-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .us-stat-box{padding:14px 12px;border-radius:14px;border:1px solid;text-align:center;cursor:default}
        .us-stat-val{font-family:'Orbitron',monospace;font-size:0.9rem;font-weight:900;display:block;margin-bottom:4px}
        .us-stat-lbl{font-size:0.58rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(196,181,253,0.4)}
        .us-text-wrap{display:flex;flex-direction:column;gap:0}
        .us-tag{display:inline-block;align-self:flex-start;padding:4px 14px;border-radius:20px;font-family:'Orbitron',monospace;font-size:0.5rem;letter-spacing:0.14em;font-weight:700;margin-bottom:18px}
        .us-headline{font-family:'Orbitron',monospace;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:900;color:#f0e6ff;line-height:1.1;margin-bottom:16px}
        .us-desc{font-size:0.88rem;font-weight:300;color:rgba(196,181,253,0.6);line-height:1.75;margin-bottom:24px}
        .us-features-label{font-family:'Orbitron',monospace;font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(167,139,250,0.45);margin-bottom:12px}
        .us-features{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
        .us-feature{display:flex;align-items:center;gap:10px;font-size:0.82rem;color:rgba(196,181,253,0.7);padding:8px 14px;border-radius:10px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.08);cursor:default}
        .us-feature-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .us-cta-btn{padding:12px 28px;border-radius:40px;border:none;cursor:pointer;font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;color:white;align-self:flex-start}

        /* ══ Agencies ══ */
        .ag-root{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:100px 32px 0}
        @media(max-width:768px){.ag-root{padding:80px 20px 0}}
        .ag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
        @media(max-width:1000px){.ag-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:580px){.ag-grid{grid-template-columns:1fr}}
        .ag-card{position:relative;border-radius:20px;padding:24px;background:rgba(4,0,18,0.95);overflow:hidden;cursor:default;transition:border-color 0.3s}
        .ag-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}
        .ag-icon-wrap{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ag-name{font-family:'Orbitron',monospace;font-size:1rem;font-weight:900;transition:color 0.3s}
        .ag-country{font-size:0.72rem;color:rgba(196,181,253,0.45);margin-top:2px;font-family:'Orbitron',monospace;letter-spacing:1px}
        .ag-desc{font-size:0.8rem;color:rgba(196,181,253,0.6);line-height:1.65;margin-bottom:16px}
        .ag-missions{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;margin-bottom:12px}
        .ag-m-val{font-family:'Orbitron',monospace;font-size:0.9rem;font-weight:900}
        .ag-m-label{font-size:0.65rem;color:rgba(196,181,253,0.5);font-family:'Orbitron',monospace;letter-spacing:1px}
        .ag-key{font-size:0.72rem;color:rgba(196,181,253,0.5);line-height:1.5}

        /* ══ Tech ══ */
        .tech-root{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:100px 32px 0}
        @media(max-width:768px){.tech-root{padding:80px 20px 0}}
        .tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        @media(max-width:1000px){.tech-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:580px){.tech-grid{grid-template-columns:1fr}}
        .tech-card{position:relative;padding:22px;border-radius:18px;border:1px solid rgba(167,139,250,0.12);background:rgba(4,0,14,0.94);overflow:hidden;cursor:default}
        .tech-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .tech-name{font-family:'Orbitron',monospace;font-size:0.85rem;font-weight:700}
        .tech-sub{font-size:0.68rem;color:rgba(196,181,253,0.4);margin-top:2px;letter-spacing:1px}
        .tech-val{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;margin-left:auto;white-space:nowrap}
        .tech-desc{font-size:0.78rem;color:rgba(196,181,253,0.58);line-height:1.6;margin-bottom:10px}
        .tech-detail{font-family:'Orbitron',monospace;font-size:0.5rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
        .tech-bar-wrap{display:flex;align-items:center;gap:10px}
        .tech-bar-track{flex:1;height:4px;border-radius:4px;background:rgba(167,139,250,0.1);overflow:hidden}
        .tech-bar-fill{height:100%;border-radius:4px}
        .tech-pct{font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;flex-shrink:0;min-width:32px;text-align:right}

        /* ══ Timeline ══ */
        .tl-root{position:relative;z-index:10;max-width:1100px;margin:0 auto;padding:100px 32px 0}
        @media(max-width:768px){.tl-root{padding:80px 20px 0}}
        .tl-track{position:relative;padding:20px 0}
        .tl-line{position:absolute;left:50%;transform:translateX(-50%);width:2px;top:0;bottom:0;background:linear-gradient(180deg,transparent,rgba(167,139,250,0.4) 10%,rgba(167,139,250,0.4) 90%,transparent);transform-origin:top center}
        @media(max-width:700px){.tl-line{left:16px}}
        .tl-item{display:flex;align-items:center;margin-bottom:32px;position:relative}
        .tl-left{flex-direction:row-reverse}
        .tl-right{flex-direction:row}
        @media(max-width:700px){.tl-left,.tl-right{flex-direction:row;padding-left:48px}}
        .tl-dot{position:absolute;left:50%;transform:translate(-50%,-50%);top:50%;width:12px;height:12px;border-radius:50%;z-index:2;flex-shrink:0}
        @media(max-width:700px){.tl-dot{left:16px}}
        .tl-connector{width:60px;height:1px;flex-shrink:0}
        @media(max-width:700px){.tl-connector{display:none}}
        .tl-card{flex:1;max-width:44%;padding:18px 20px;border-radius:16px;background:rgba(4,0,14,0.95);border:1px solid;position:relative;overflow:hidden;cursor:default}
        @media(max-width:700px){.tl-card{max-width:100%}}
        .tl-year{font-family:'Orbitron',monospace;font-size:0.65rem;font-weight:900;letter-spacing:3px;margin-bottom:4px}
        .tl-card-icon{font-size:1.6rem;margin-bottom:6px}
        .tl-card-label{font-family:'Orbitron',monospace;font-size:0.82rem;font-weight:700;color:#f0e6ff;margin-bottom:4px}
        .tl-card-desc{font-size:0.75rem;color:rgba(196,181,253,0.55)}

        /* ══ Facts Ticker ══ */
        .facts-ticker{
          max-width:1320px; margin:60px auto 0; padding:0 32px;
          position:relative; z-index:10;
        }
        .facts-ticker > div:first-child { padding:28px 36px; border-radius:20px;
          border:1px solid rgba(167,139,250,0.18); background:rgba(4,0,16,0.9);
          backdrop-filter:blur(10px); display:flex; align-items:center; gap:24px;
          flex-wrap:wrap;
        }
        /* override: put children inside */
        .facts-ticker-inner{padding:28px 36px;border-radius:20px;border:1px solid rgba(167,139,250,0.18);background:rgba(4,0,16,0.9);backdrop-filter:blur(10px);display:flex;align-items:center;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden}
        .facts-label{font-family:'Orbitron',monospace;font-size:0.58rem;letter-spacing:3px;color:rgba(167,139,250,0.5);display:flex;align-items:center;gap:8px;flex-shrink:0;white-space:nowrap}
        .facts-dot{width:7px;height:7px;border-radius:50%;background:#a78bfa;box-shadow:0 0 10px #a78bfa}
        .facts-text{flex:1;font-size:0.88rem;color:rgba(196,181,253,0.8);font-style:italic;font-weight:300;min-width:200px}
        .facts-dots{display:flex;gap:6px;flex-shrink:0}
        .facts-pip{width:6px;height:6px;border-radius:50%;cursor:pointer;transition:background 0.2s}

        /* ══ Newsletter ══ */
        .nl-root{position:relative;z-index:10;max-width:680px;margin:0 auto;padding:0 32px}
        .nl-inner{position:relative;z-index:1;text-align:center;padding:56px 44px;border-radius:28px;border:1px solid rgba(167,139,250,0.2);background:rgba(4,0,16,0.92);backdrop-filter:blur(12px);overflow:hidden}
        .nl-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.15),transparent 65%);pointer-events:none}
        .nl-border-anim{position:absolute;inset:0;border-radius:28px;pointer-events:none;background:transparent;border:1px solid;border-image:linear-gradient(135deg,#7c3aed,#c084fc,#818cf8,#7c3aed) 1;animation:borderSpin 4s linear infinite;opacity:0.4}
        @keyframes borderSpin{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}
        .nl-icon{font-size:3rem;margin-bottom:16px;display:block}
        .nl-title{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;color:#f0e6ff;margin-bottom:10px}
        .nl-sub{font-size:0.88rem;color:rgba(196,181,253,0.55);line-height:1.7;margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto}
        .nl-form{display:flex;gap:10px;max-width:420px;margin:0 auto 24px}
        .nl-input{flex:1;padding:12px 18px;border-radius:40px;border:1px solid rgba(167,139,250,0.3);background:rgba(10,0,30,0.8);color:#f0e6ff;font-family:'Exo 2',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.3s}
        .nl-input:focus{border-color:rgba(167,139,250,0.7)}
        .nl-input::placeholder{color:rgba(196,181,253,0.35)}
        .nl-btn{padding:12px 24px;border-radius:40px;border:none;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;letter-spacing:2px;white-space:nowrap}
        .nl-sent{display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px 0}
        .nl-stats{display:flex;gap:32px;justify-content:center;margin-top:28px;flex-wrap:wrap}
        .nl-stat{text-align:center}
        .nl-stat-val{display:block;font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;color:#a78bfa}
        .nl-stat-label{display:block;font-size:0.65rem;color:rgba(196,181,253,0.4);letter-spacing:2px;font-family:'Orbitron',monospace;text-transform:uppercase;margin-top:4px}

        /* ══ Bottom CTA ══ */
        .es-cta-section{position:relative;z-index:10;max-width:1320px;margin:80px auto 0;padding:0 32px 100px}
        @media(max-width:768px){.es-cta-section{padding:0 20px 80px}}
        .es-cta-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;padding:44px 50px;border-radius:26px;border:1px solid rgba(129,140,248,0.18);background:rgba(5,0,20,0.88);position:relative;overflow:hidden}
        @media(max-width:640px){.es-cta-row{padding:30px 24px;flex-direction:column;align-items:flex-start}}
        .es-cta-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 25% 50%,rgba(124,58,237,0.12) 0%,transparent 65%)}
        .es-cta-gbar{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#7c3aed,#4f46e5,#c084fc,transparent);background-size:200% 100%;animation:es-barslide 4s linear infinite}
        .es-cta-title{font-family:'Orbitron',monospace;font-size:clamp(1rem,2vw,1.2rem);font-weight:900;color:#f0e6ff}
        .es-cta-sub{font-size:0.82rem;font-weight:300;color:rgba(196,181,253,0.5);margin-top:6px}
        .es-cta-btns{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
        .es-cta-btn-primary{padding:13px 28px;border-radius:40px;border:none;cursor:pointer;font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;color:white;background:linear-gradient(135deg,#7c3aed,#4f46e5);box-shadow:0 6px 24px rgba(124,58,237,0.45);transition:all 0.3s}
        .es-cta-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,58,237,0.65)}
        .es-cta-btn-sec{padding:12px 24px;border-radius:40px;border:1px solid rgba(167,139,250,0.3);background:transparent;font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:600;letter-spacing:0.1em;color:#a78bfa;cursor:pointer;transition:all 0.3s}
        .es-cta-btn-sec:hover{background:rgba(124,58,237,0.12);border-color:rgba(167,139,250,0.6);color:white;transform:translateY(-2px)}
      `}</style>

      <section className="es-root" ref={sectionRef}>

        {/* Stars */}
        <div className="es-stars">
          {STARS.map(s=>(
            <div key={s.id} className="es-star" style={{
              left:`${s.x}%`, top:`${s.y}%`, width:s.r, height:s.r,
              "--dur":`${s.dur}s`, "--del":`${s.delay}s`
            }} />
          ))}
        </div>

        {/* Shooting stars */}
        {SHOOTS.map(s=>(
          <div key={s.id} className="es-shoot" style={{
            left:`${s.startX}%`, top:`${s.startY}%`,
            "--dur":`${s.dur}s`, "--del":`${s.delay}s`, "--ang":`${s.angle}deg`
          }} />
        ))}

        {/* Particles */}
        {PARTICLES.map(p=>(
          <div key={p.id} className="es-particle" style={{
            left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size,
            "--dur":`${p.dur}s`, "--del":`${p.delay}s`
          }} />
        ))}

        {/* Nebulae */}
        <div className="es-neb" style={{ width:640,height:440,background:"radial-gradient(ellipse,#4f46e5,transparent)",top:"-70px",left:"-130px","--dur":"10s","--a":"0.07","--b":"0.15" }} />
        <div className="es-neb" style={{ width:540,height:440,background:"radial-gradient(ellipse,#7c3aed,transparent)",bottom:"200px",right:"-90px","--dur":"13s","--a":"0.05","--b":"0.1" }} />
        <div className="es-neb" style={{ width:420,height:420,background:"radial-gradient(ellipse,#c084fc,transparent)",top:"45%",left:"35%","--dur":"9s","--a":"0.04","--b":"0.08" }} />
        <div className="es-neb" style={{ width:300,height:300,background:"radial-gradient(ellipse,#818cf8,transparent)",top:"20%",right:"20%","--dur":"15s","--a":"0.03","--b":"0.07" }} />

        <div className="es-warp" />
        <div className="es-gbar top" />
        <div className="es-gbar bot" />

        {/* ── SECTION 1: Explore Cards ── */}
        <div className="es-inner">
          <motion.div style={{ textAlign:"center" }}
            initial={{ opacity:0, y:45 }}
            animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.95, ease:[0.23,1,0.32,1] }}
          >
            <div className="es-eyebrow"><div className="es-eyebrow-dot" />DISCOVERY PORTAL</div>
            <h2 className="es-title">Explore The <span className="es-title-acc"><GlitchText text="Universe" color="#818cf8" /></span></h2>
            <p className="es-sub">Journey through missions, planets, and discoveries that expand our understanding of the cosmos.</p>
            <div className="es-divider" />
          </motion.div>

          <div className="es-grid">
            {EXPLORE_ITEMS.map((item,i)=><ExploreCard key={i} item={item} index={i} />)}
          </div>

          {/* Marquee */}
          <motion.div className="es-marquee-wrap"
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
            transition={{ duration:0.8, delay:0.65 }}
          >
            <div className="es-marquee">
              {[...Array(2)].map((_,ri)=>
                MARQUEE.map((label,i)=>(
                  <div key={`${ri}-${i}`} className="es-marquee-item">
                    <div className="es-marquee-dot" />{label}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 2: Universe Tabs ── */}
        <UniverseSection inView={inView} />

        {/* ── SECTION 3: Facts Ticker ── */}
        <FactsTicker inView={inView} />

        {/* ── SECTION 4: Space Agencies ── */}
        <AgenciesSection inView={inView} />

        {/* ── SECTION 5: Space Tech ── */}
        <TechSection inView={inView} />

        {/* ── SECTION 6: Timeline ── */}
        <TimelineSection inView={inView} />

        {/* ── SECTION 7: Newsletter ── */}
        <div style={{ padding:"100px 0 0", position:"relative", zIndex:10 }}>
          <motion.div className="section-header"
            initial={{ opacity:0, y:35 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.85 }}
            style={{ maxWidth:1320, margin:"0 auto", padding:"0 32px" }}
          >
            <div className="eyebrow-pill" style={{ borderColor:"rgba(232,121,249,0.35)", background:"rgba(124,58,237,0.1)", color:"#e879f9" }}>
              <div className="eyebrow-dot" style={{ background:"#e879f9", boxShadow:"0 0 8px #e879f9" }} />
              STAY CONNECTED
            </div>
          </motion.div>
          <NewsletterSection inView={inView} />
        </div>

        {/* ── Bottom CTA ── */}
        <div className="es-cta-section">
          <motion.div className="es-cta-row"
            initial={{ opacity:0, y:32 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.85 }}
          >
            <div className="es-cta-bg" />
            <div className="es-cta-gbar" />
            {/* Pulse rings */}
            {[0,1].map(i=>(
              <motion.div key={i} style={{
                position:"absolute", inset:0, borderRadius:26,
                border:"1px solid rgba(124,58,237,0.3)", pointerEvents:"none",
              }}
                animate={{ scale:1.02+i*0.04, opacity:0 }}
                transition={{ duration:2.5, delay:i*0.8, repeat:Infinity }}
              />
            ))}
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="es-cta-title">Ready to Begin Your Journey?</div>
              <div className="es-cta-sub">Join 40,000+ explorers discovering the cosmos every day.</div>
            </div>
            <div className="es-cta-btns">
              <motion.button className="es-cta-btn-primary" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}>🚀 Start Exploring</motion.button>
              <motion.button className="es-cta-btn-sec" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}>View All Missions</motion.button>
            </div>
          </motion.div>
        </div>

      </section>
    </>
  );
}