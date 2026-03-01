import { useRef, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";

const ASTRONAUTS = [
  { name:"Yuri Gagarin", role:"First Human in Space", country:"🇷🇺 USSR", missions:"Vostok 1", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yuri_Gagarin_in_Sweden%2C_1964.jpg/400px-Yuri_Gagarin_in_Sweden%2C_1964.jpg", color:"#a78bfa", stat:"108 min in orbit" },
  { name:"Neil Armstrong", role:"First on the Moon", country:"🇺🇸 USA", missions:"Gemini 8 · Apollo 11", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Neil_Armstrong_pose.jpg/400px-Neil_Armstrong_pose.jpg", color:"#fbbf24", stat:"2h 31m moonwalk" },
  { name:"Valentina Tereshkova", role:"First Woman in Space", country:"🇷🇺 USSR", missions:"Vostok 6", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Valentina_Vladimirovna_Tereshkova.jpg/400px-Valentina_Vladimirovna_Tereshkova.jpg", color:"#f472b6", stat:"71 hrs in orbit" },
  { name:"Chris Hadfield", role:"ISS Commander", country:"🇨🇦 Canada", missions:"STS-74 · STS-100 · Soyuz", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chris_Hadfield_official_portrait.jpg/400px-Chris_Hadfield_official_portrait.jpg", color:"#38bdf8", stat:"166 days in space" },
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
            <h2 className="as-title">Legendary <span className="acc">Astronauts</span></h2>
            <p className="as-sub">The brave pioneers who left Earth behind and expanded the frontier of human existence.</p>
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