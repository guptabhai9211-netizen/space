import { useRef, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";

const ASTRONAUTS = [
  { name:"A total solar eclipse",
     role:"The Moon passes directly between the Sun and Earth, completely covering the Sun’s disk and plunging a narrow path on Earth into temporary darkness.",
      country:"🇷🇺 USSR", 
      missions:"Vostok 1", 
      img:"data:image/jpeg;base64,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", 
      color:"#a78bfa", 
      stat:"108 min in orbit" },
  { name:"A supermoon",
     role:"A full or new moon that coincides with perigee, the Moon's closest approach to Earth in its elliptical orbit, making it appear up to 14% larger and 30% brighter than at apogee.", 
     country:"🇺🇸 USA", missions:"Gemini 8 · Apollo 11",
      img:"https://science.nasa.gov/wp-content/uploads/2024/01/preview-supermoons.jpg", color:"#fbbf24", stat:"2h 31m moonwalk" },
  { name:"Meteor showers", 
    role:"annual celestial events where Earth passes through debris trails (dust and rock) left by comets or asteroids. These particles, often smaller than sand grains, burn up upon entering. ",
     country:"🇷🇺 USSR", missions:"Vostok 6", 
     img:"https://media.istockphoto.com/id/1902962146/photo/meteor-shower-composite-created-from-44-individual-photos-that-includes-the-milky-way.jpg?s=612x612&w=0&k=20&c=mZM-Ba3JqFjAPbS4hxjsKlIWob0_a9gYiJ6vr93yy5Y=", color:"#f472b6", stat:"71 hrs in orbit" },
  { name:"Planetary opposition",
     role:"occurs when Earth passes directly between the Sun and a superior planet (Mars, Jupiter, Saturn, Uranus, or Neptune), placing the planet opposite the Sun in the sky.",
      country:"🇨🇦 Canada",
       missions:"STS-74 · STS-100 · Soyuz",
        img:"https://c02.purpledshub.com/uploads/sites/48/2020/08/diagram-showing-saturn-at-opposition.jpg?webp=1&w=1200", color:"#38bdf8", stat:"166 days in space" },
];

const STARS = Array.from({length:120},(_,i)=>({ id:i, x:Math.random()*100, y:Math.random()*100, r:Math.random()*2+0.3, delay:Math.random()*5, dur:Math.random()*3+2 }));

function useTilt(str=10) {
  const ref = useRef(null);
  const rx = useSpring(0,{stiffness:160,damping:22});
  const ry = useSpring(0,{stiffness:160,damping:22});
  const gx = useSpring(50,{stiffness:90,damping:20});
  const gy = useSpring(50,{stiffness:90,damping:20});
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect(); if(!rect) return;
    const dx=(e.clientX-rect.left-rect.width/2)/(rect.width/2);
    const dy=(e.clientY-rect.top-rect.height/2)/(rect.height/2);
    rx.set(-dy*str); ry.set(dx*str); gx.set(50+dx*40); gy.set(50+dy*40);
  };
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };
  return {ref,rx,ry,gx,gy,onMove,onLeave};
}

function AstronautCard({ person, index }) {
  const [hovered, setHovered] = useState(false);
  const { ref, rx, ry, gx, gy, onMove, onLeave } = useTilt(10);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });

  return (
    <motion.div ref={inViewRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.14, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 900 }}>
      <motion.div ref={ref} className="ac-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={e => { setHovered(true); onMove(e); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        whileHover={{ z: 24 }}>

        <div className="ac-img-wrap">
          <motion.img src={person.img} alt={person.name} className="ac-img"
            animate={{ scale: hovered ? 1.1 : 1 }} transition={{ duration: 0.7 }}
            onError={e => e.target.src = `https://via.placeholder.com/400x400/1a1a2e/a78bfa?text=${person.name[0]}`}/>
          <motion.div className="ac-img-overlay"
            style={{ background: `linear-gradient(to top,${person.color}dd,transparent 55%)` }}
            animate={{ opacity: hovered ? 0.9 : 0.7 }}/>
          <motion.div className="ac-cursor-glow"
            style={{ background: `radial-gradient(circle at ${gx}% ${gy}%,${person.color}55 0%,transparent 65%)` }}
            animate={{ opacity: hovered ? 1 : 0 }}/>
        </div>

        <motion.div className="ac-border"
          animate={{ opacity: hovered ? 1 : 0, boxShadow: hovered ? `0 0 0 1px ${person.color}60,0 0 40px ${person.color}40` : "none" }}/>

        <div className="ac-info">
          <div className="ac-stat-badge" style={{ background: `${person.color}22`, color: person.color, border: `1px solid ${person.color}44` }}>
            {person.stat}
          </div>
          <h3 className="ac-name">{person.name}</h3>
          <p className="ac-role" style={{ color: person.color }}>{person.role}</p>
          <div className="ac-meta">
            <span className="ac-country">{person.country}</span>
            <span className="ac-missions">{person.missions}</span>
          </div>
        </div>

        <motion.div className="ac-shine"
          animate={hovered ? { x: ["-120%", "160%"], opacity: [0, 0.4, 0] } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ background: `linear-gradient(90deg,transparent,${person.color}55,transparent)` }}/>
      </motion.div>
    </motion.div>
  );
}

export default function Programs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=JetBrains+Mono:wght@300;400&display=swap');
        :root{--font-d:'Orbitron',monospace;--font-b:'Exo 2',sans-serif;--font-m:'JetBrains Mono',monospace;--muted:rgba(196,181,253,0.5);}
        *{box-sizing:border-box;margin:0;padding:0;}
        .as-root{position:relative;background:linear-gradient(180deg,#000,#0a0008,#000);color:#fff;padding:120px 0;overflow:hidden;font-family:var(--font-b);}
        .as-stars{position:absolute;inset:0;pointer-events:none;z-index:0;}
        .as-star{position:absolute;border-radius:50%;background:#fff;animation:tw var(--dur) var(--del) ease-in-out infinite alternate;}
        @keyframes tw{from{opacity:0.04;transform:scale(0.5)}to{opacity:0.9;transform:scale(1.5)}}
        .as-neb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px);opacity:0.1;animation:np var(--dur) ease-in-out infinite alternate;}
        @keyframes np{from{transform:scale(1)}to{transform:scale(1.2)}}
        .as-glow{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#f472b6,#a78bfa,transparent);background-size:200% 100%;animation:gs 6s linear infinite;}
        .as-glow.top{top:0}.as-glow.bot{bottom:0;animation-delay:-3s;}
        @keyframes gs{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .as-inner{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:0 32px;}
        .as-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:6px 18px;border-radius:40px;border:1px solid rgba(139,92,246,0.35);background:rgba(109,40,217,0.1);font-family:var(--font-m);font-size:0.6rem;letter-spacing:0.2em;color:#a78bfa;margin-bottom:22px;}
        .as-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:#a78bfa;box-shadow:0 0 8px #a78bfa;animation:blink 1.4s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
        .as-title{font-family:var(--font-d);font-size:clamp(2.4rem,5vw,4.2rem);font-weight:900;line-height:1.05;color:#f0e6ff;text-shadow:0 0 40px rgba(244,114,182,0.3);}
        .as-title .acc{background:linear-gradient(135deg,#f472b6,#a78bfa,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .as-sub{margin-top:14px;font-size:1rem;font-weight:300;color:var(--muted);line-height:1.7;max-width:500px;margin-left:auto;margin-right:auto;}
        .as-divider{width:80px;height:1px;margin:28px auto 60px;background:linear-gradient(90deg,transparent,rgba(244,114,182,0.6),transparent);}
        .as-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
        @media(max-width:1000px){.as-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.as-grid{grid-template-columns:1fr;max-width:360px;margin:0 auto;}}
        .ac-card{position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);background:rgba(6,2,20,0.95);cursor:default;transform-style:preserve-3d;}
        .ac-img-wrap{position:relative;height:280px;overflow:hidden;}
        .ac-img{width:100%;height:100%;object-fit:cover;object-position:top;}
        .ac-img-overlay{position:absolute;inset:0;}
        .ac-cursor-glow{position:absolute;inset:0;pointer-events:none;}
        .ac-border{position:absolute;inset:0;border-radius:20px;pointer-events:none;}
        .ac-info{position:relative;z-index:5;padding:16px 18px 20px;}
        .ac-stat-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-family:var(--font-m);font-size:0.55rem;letter-spacing:0.12em;margin-bottom:10px;}
        .ac-name{font-family:var(--font-d);font-size:0.9rem;font-weight:900;color:#f0e6ff;letter-spacing:0.05em;margin-bottom:4px;}
        .ac-role{font-size:0.75rem;font-weight:400;margin-bottom:10px;letter-spacing:0.04em;}
        .ac-meta{display:flex;flex-direction:column;gap:3px;}
        .ac-country,.ac-missions{font-family:var(--font-m);font-size:0.62rem;color:rgba(196,181,253,0.45);letter-spacing:0.06em;}
        .ac-shine{position:absolute;inset:0;width:60%;pointer-events:none;z-index:6;}
        @media(max-width:640px){.as-inner{padding:0 16px;}}
      `}</style>

      <section className="as-root" ref={ref}>
        <div className="as-stars">
          {STARS.map(s=>(<div key={s.id} className="as-star" style={{left:`${s.x}%`,top:`${s.y}%`,width:s.r,height:s.r,"--dur":`${s.dur}s`,"--del":`${s.delay}s`}}/>))}
        </div>
        <div className="as-neb" style={{width:600,height:400,background:"radial-gradient(ellipse,#f472b6,transparent)",bottom:"-100px",left:"-100px","--dur":"11s"}}/>
        <div className="as-neb" style={{width:500,height:400,background:"radial-gradient(ellipse,#a78bfa,transparent)",top:"-80px",right:"-80px","--dur":"9s"}}/>
        <div className="as-glow top"/><div className="as-glow bot"/>

        <div className="as-inner">
          <motion.div style={{textAlign:"center"}}
            initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.85,ease:[0.23,1,0.32,1]}}>
            <div className="as-eyebrow"><div className="as-eyebrow-dot"/>HALL OF FAME</div>
            <h2 className="as-title">Astrophysical<span className="acc">  Events</span></h2>
            <p className="as-sub">Researchers are currently monitoring rare cosmic phenomena, including supermassive black holes dragging stars, potential dark matter interactions, fast-moving radio circles (ORCs), and unexpected stellar dimming, such as that seen in Betelgeuse.</p>
            <div className="as-divider"/>
          </motion.div>
          <div className="as-grid">
            {ASTRONAUTS.map((a,i)=>(<AstronautCard key={i} person={a} index={i}/>))}
          </div>
        </div>
      </section>
    </>
  );
}