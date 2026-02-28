import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";

const STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  r: Math.random() * 2 + 0.3, delay: Math.random() * 6, dur: Math.random() * 4 + 2,
}));

const SHOOTS = Array.from({ length: 5 }, (_, i) => ({
  id: i, startX: Math.random() * 60 + 10, startY: Math.random() * 40,
  delay: i * 3.5 + Math.random() * 2, dur: Math.random() * 1.2 + 0.8,
  angle: 25 + Math.random() * 15,
}));

/* All nav links now use React Router `to` paths */
const NAV = [
  { label: "Home",     to: "/"         },
  { label: "Missions", to: "/missions" },
  { label: "Gallery",  to: "/gallery"  },
  { label: "Explore",  to: "/explore"  },
  { label: "Planets",  to: "/planets"  },
];

const RESOURCES = [
  { label: "Blog",     to: "#" },
  { label: "Guides",   to: "#" },
  { label: "Support",  to: "#" },
  { label: "FAQ",      to: "#" },
  { label: "API Docs", to: "#" },
];

const EXPLORE_LINKS = [
  { label: "Solar System", to: "/planets" },
  { label: "Exoplanets",   to: "/explore" },
  { label: "Deep Space",   to: "/explore" },
  { label: "Black Holes",  to: "/explore" },
];

const SOCIALS = [
  { icon: "𝕏",  label: "Twitter",  color: "#e9d5ff" },
  { icon: "in", label: "LinkedIn", color: "#818cf8" },
  { icon: "◎",  label: "YouTube",  color: "#f87171" },
  { icon: "◈",  label: "Discord",  color: "#a78bfa" },
  { icon: "◉",  label: "Reddit",   color: "#fb923c" },
];

/* ── Footer Link (uses React Router Link) ── */
function FooterLink({ to, label, color = "#a78bfa", index }) {
  const [hovered, setHovered] = useState(false);
  const isExternal = to === "#";
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      {isExternal ? (
        <a href="#" className="fl-link"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <FooterLinkInner hovered={hovered} color={color} label={label} />
        </a>
      ) : (
        <Link to={to} className="fl-link"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <FooterLinkInner hovered={hovered} color={color} label={label} />
        </Link>
      )}
    </motion.li>
  );
}

function FooterLinkInner({ hovered, color, label }) {
  return (
    <>
      <motion.span className="fl-arrow"
        animate={{ x: hovered ? 0 : -8, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ color }}
      >›</motion.span>
      <motion.span
        animate={{ x: hovered ? 4 : 0, color: hovered ? color : "rgba(196,181,253,0.55)" }}
        transition={{ duration: 0.25 }}
        style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "0.85rem", fontWeight: 400 }}
      >{label}</motion.span>
      {hovered && (
        <motion.span className="fl-underline"
          style={{ background: color }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </>
  );
}

/* ── Social Icon ── */
function SocialIcon({ icon, label, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a href="#" className="si-btn" title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.92 }}
      style={{
        border: `1px solid ${hovered ? color + "80" : "rgba(139,92,246,0.2)"}`,
        background: hovered ? `${color}15` : "rgba(5,0,20,0.6)",
        boxShadow: hovered ? `0 0 20px ${color}40,inset 0 0 20px ${color}08` : "none",
        transition: "border 0.3s,background 0.3s,box-shadow 0.3s",
      }}
    >
      <motion.span
        animate={{ color: hovered ? color : "rgba(196,181,253,0.5)" }}
        style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 700 }}
      >{icon}</motion.span>
    </motion.a>
  );
}

/* ── Main Footer ── */
export default function SpaceFooter() {
  const footerRef = useRef(null);
  const inView    = useInView(footerRef, { once: true, margin: "-40px" });
  const navigate  = useNavigate();
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused,   setFocused]   = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) { setSubmitted(true); setEmail(""); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .sf-root { position:relative;background:#000;overflow:hidden;font-family:'Exo 2',sans-serif; }

        .sf-stars { position:absolute;inset:0;pointer-events:none;z-index:0; }
        .sf-star {
          position:absolute;border-radius:50%;background:white;
          animation:sf-tw var(--dur) var(--del) ease-in-out infinite alternate;
        }
        @keyframes sf-tw { from{opacity:0.04;transform:scale(0.5)} to{opacity:0.85;transform:scale(1.5)} }

        .sf-shoot {
          position:absolute;height:1px;pointer-events:none;
          background:linear-gradient(90deg,rgba(255,255,255,0.8),transparent);border-radius:1px;
          animation:sf-shoot-anim var(--dur) var(--del) linear infinite;opacity:0;
        }
        @keyframes sf-shoot-anim {
          0%{opacity:0;width:0;transform:translate(0,0) rotate(var(--ang))}
          5%{opacity:1} 60%{opacity:0.6;width:120px}
          100%{opacity:0;width:60px;transform:translate(240px,140px) rotate(var(--ang))}
        }

        .sf-neb {
          position:absolute;border-radius:50%;pointer-events:none;filter:blur(100px);
          animation:sf-neb-pulse var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sf-neb-pulse { from{opacity:var(--a);transform:scale(1)} to{opacity:var(--b);transform:scale(1.2)} }

        .sf-top-glow {
          position:relative;width:100%;height:1px;overflow:visible;
          background:linear-gradient(90deg,transparent 0%,#7c3aed 25%,#4f46e5 50%,#0ea5e9 75%,transparent 100%);
          background-size:200% 100%;animation:sf-glow-slide 5s linear infinite;
        }
        @keyframes sf-glow-slide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sf-top-glow::after {
          content:'';position:absolute;left:0;right:0;top:-3px;height:7px;
          background:inherit;filter:blur(6px);opacity:0.6;
        }

        .sf-grid {
          position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:72px 32px 56px;
          display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr;gap:48px;
        }
        @media(max-width:1100px){.sf-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:600px){.sf-grid{grid-template-columns:1fr;gap:36px;padding:48px 20px 40px}}

        .sf-logo {
          font-family:'Orbitron',monospace;font-weight:900;font-size:1.3rem;
          letter-spacing:0.12em;color:#e9d5ff;display:flex;align-items:center;gap:10px;
          text-shadow:0 0 20px rgba(167,139,250,0.6);margin-bottom:16px;text-decoration:none;
        }
        .sf-logo-rocket {
          font-size:1.5rem;animation:sf-rocket 2.5s ease-in-out infinite;
          filter:drop-shadow(0 0 8px rgba(167,139,250,0.8));display:inline-block;
        }
        @keyframes sf-rocket {
          0%,100%{transform:translateY(0) rotate(-45deg)} 50%{transform:translateY(-4px) rotate(-45deg)}
        }
        .sf-logo-acc{color:#a78bfa}

        .sf-tagline{font-size:0.83rem;font-weight:300;line-height:1.7;color:rgba(196,181,253,0.5);margin-bottom:28px;max-width:280px}

        .sf-status{padding:14px 16px;border-radius:14px;border:1px solid rgba(139,92,246,0.15);background:rgba(5,0,20,0.6);margin-bottom:24px}
        .sf-status-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .sf-status-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:sf-status-blink 1.8s ease-in-out infinite;flex-shrink:0}
        @keyframes sf-status-blink{0%,100%{opacity:1;box-shadow:0 0 8px #22c55e}50%{opacity:0.3;box-shadow:0 0 3px #22c55e}}
        .sf-status-label{font-family:'Orbitron',monospace;font-size:0.55rem;letter-spacing:0.18em;color:#22c55e}
        .sf-status-name{font-size:0.78rem;color:rgba(196,181,253,0.7);padding-left:17px}
        .sf-status-bar-track{height:3px;border-radius:2px;background:rgba(255,255,255,0.05);margin-top:8px}
        .sf-status-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#22c55e,#4ade80);box-shadow:0 0 8px #22c55e;animation:sf-bar-pulse 2s ease-in-out infinite alternate}
        @keyframes sf-bar-pulse{from{opacity:0.7}to{opacity:1}}

        .sf-social-row{display:flex;gap:8px;flex-wrap:wrap}
        .si-btn{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}

        .sf-col-head{font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#e9d5ff;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .sf-col-head::before{content:'';width:16px;height:1px;background:linear-gradient(90deg,#7c3aed,transparent)}

        .sf-links{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
        .fl-link{display:inline-flex;align-items:center;gap:4px;text-decoration:none;position:relative;cursor:pointer}
        .fl-arrow{display:inline-block;font-size:1rem;line-height:1}
        .fl-underline{position:absolute;bottom:-1px;left:0;right:0;height:1px;border-radius:1px;transform-origin:left}

        .sf-newsletter-box{padding:0}
        .sf-nl-desc{font-size:0.8rem;font-weight:300;line-height:1.6;color:rgba(196,181,253,0.5);margin-bottom:18px}
        .sf-nl-input-wrap{position:relative;margin-bottom:10px}
        .sf-nl-input{width:100%;padding:12px 16px;background:rgba(5,0,20,0.8);border-radius:12px;outline:none;font-family:'Exo 2',sans-serif;font-size:0.82rem;color:#e9d5ff;transition:border 0.3s,box-shadow 0.3s}
        .sf-nl-input::placeholder{color:rgba(167,139,250,0.3)}
        .sf-nl-input.focused{border-color:rgba(139,92,246,0.6)!important;box-shadow:0 0 20px rgba(109,40,217,0.25),inset 0 0 20px rgba(109,40,217,0.05)}
        .sf-nl-btn{width:100%;padding:11px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#7c3aed,#4f46e5);font-family:'Orbitron',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:white;cursor:pointer;box-shadow:0 6px 24px rgba(109,40,217,0.4),inset 0 1px 0 rgba(255,255,255,0.1);transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:8px}
        .sf-nl-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(109,40,217,0.6),inset 0 1px 0 rgba(255,255,255,0.15)}
        .sf-nl-success{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:12px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);color:#4ade80;font-family:'Orbitron',monospace;font-size:0.62rem;letter-spacing:0.1em}
        .sf-nl-perks{display:flex;flex-direction:column;gap:6px;margin-top:14px}
        .sf-nl-perk{display:flex;align-items:center;gap:8px;font-size:0.72rem;color:rgba(167,139,250,0.5)}
        .sf-nl-perk-dot{width:4px;height:4px;border-radius:50%;background:#7c3aed;flex-shrink:0}

        .sf-mid-divider{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:0 32px}
        .sf-mid-line{border:none;height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.2),rgba(79,70,229,0.2),transparent)}

        .sf-bottom{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        @media(max-width:640px){.sf-bottom{flex-direction:column;text-align:center}}

        .sf-copyright{font-family:'Orbitron',monospace;font-size:0.55rem;letter-spacing:0.15em;color:rgba(167,139,250,0.35)}
        .sf-bottom-links{display:flex;gap:24px;flex-wrap:wrap;justify-content:center}
        .sf-bottom-link{font-size:0.72rem;color:rgba(167,139,250,0.4);text-decoration:none;letter-spacing:0.06em;transition:color 0.25s}
        .sf-bottom-link:hover{color:#a78bfa}

        .sf-planet-strip{position:relative;z-index:10;overflow:hidden;height:2px;background:linear-gradient(90deg,transparent 0%,#c2944a 8%,transparent 10%,#e8a45a 18%,transparent 20%,#4a9eca 28%,transparent 30%,#c1440e 38%,transparent 40%,#c8956c 50%,transparent 52%,#d4a96a 60%,transparent 62%,transparent 100%);opacity:0.4;margin:0 32px}

        .sf-grid-lines{position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.03;background-image:linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px);background-size:80px 80px;mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.3) 40%,rgba(0,0,0,0.3) 80%,transparent 100%)}

        .sf-back-top{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:40px;cursor:pointer;border:1px solid rgba(139,92,246,0.25);background:rgba(109,40,217,0.1);font-family:'Orbitron',monospace;font-size:0.52rem;letter-spacing:0.15em;color:rgba(167,139,250,0.5);transition:all 0.3s;text-decoration:none}
        .sf-back-top:hover{background:rgba(109,40,217,0.25);color:#e9d5ff;border-color:rgba(139,92,246,0.5);transform:translateY(-2px)}
      `}</style>

      <footer className="sf-root">
        <div className="sf-stars">
          {STARS.map(s => (
            <div key={s.id} className="sf-star" style={{ left:`${s.x}%`, top:`${s.y}%`, width:s.r, height:s.r, "--dur":`${s.dur}s`, "--del":`${s.delay}s` }} />
          ))}
        </div>
        {SHOOTS.map(s => (
          <div key={s.id} className="sf-shoot" style={{ left:`${s.startX}%`, top:`${s.startY}%`, "--dur":`${s.dur}s`, "--del":`${s.delay}s`, "--ang":`${s.angle}deg` }} />
        ))}

        <div className="sf-neb" style={{ width:500, height:300, background:"radial-gradient(ellipse,#7c3aed,transparent)", top:"0", left:"-80px", "--dur":"10s","--a":"0.07","--b":"0.13" }} />
        <div className="sf-neb" style={{ width:400, height:400, background:"radial-gradient(ellipse,#4f46e5,transparent)", bottom:"0", right:"-60px", "--dur":"13s","--a":"0.06","--b":"0.11" }} />
        <div className="sf-neb" style={{ width:350, height:200, background:"radial-gradient(ellipse,#0ea5e9,transparent)", top:"30%", left:"40%", "--dur":"9s","--a":"0.04","--b":"0.08" }} />
        <div className="sf-grid-lines" />
        <div className="sf-top-glow" />

        <div className="sf-grid" ref={footerRef}>
          {/* Col 1 Brand */}
          <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,ease:[0.23,1,0.32,1]}}>
            <Link to="/" className="sf-logo">
              <span className="sf-logo-rocket">🚀</span>
              SPACE<span className="sf-logo-acc">SITE</span>
            </Link>
            <p className="sf-tagline">Explore galaxies, planets, and the deepest mysteries of the cosmos through our immersive space platform.</p>
            <div className="sf-status">
              <div className="sf-status-row">
                <div className="sf-status-dot" />
                <span className="sf-status-label">LIVE MISSION</span>
              </div>
              <div className="sf-status-name">Voyager 1 — Interstellar Space</div>
              <div className="sf-status-bar-track">
                <motion.div className="sf-status-bar-fill"
                  initial={{width:"0%"}} animate={inView?{width:"73%"}:{}}
                  transition={{duration:1.5,delay:0.5,ease:[0.23,1,0.32,1]}}
                />
              </div>
            </div>
            <div className="sf-social-row">
              {SOCIALS.map((s,i) => (
                <motion.div key={i} initial={{opacity:0,scale:0.7}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:0.4,delay:0.5+i*0.08}}>
                  <SocialIcon {...s} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Col 2 Navigation */}
          <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.12,ease:[0.23,1,0.32,1]}}>
            <div className="sf-col-head">Navigation</div>
            <ul className="sf-links">
              {NAV.map((n,i) => <FooterLink key={n.label} to={n.to} label={n.label} color="#a78bfa" index={i} />)}
            </ul>
          </motion.div>

          {/* Col 3 Explore + Resources */}
          <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.22,ease:[0.23,1,0.32,1]}}>
            <div className="sf-col-head">Explore</div>
            <ul className="sf-links" style={{marginBottom:32}}>
              {EXPLORE_LINKS.map((n,i) => <FooterLink key={n.label} to={n.to} label={n.label} color="#818cf8" index={i} />)}
            </ul>
            <div className="sf-col-head" style={{marginTop:8}}>Resources</div>
            <ul className="sf-links">
              {RESOURCES.map((n,i) => <FooterLink key={n.label} to={n.to} label={n.label} color="#c084fc" index={i} />)}
            </ul>
          </motion.div>

          {/* Col 4 Newsletter */}
          <motion.div className="sf-newsletter-box" initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.32,ease:[0.23,1,0.32,1]}}>
            <div className="sf-col-head">Deep Space Dispatch</div>
            <p className="sf-nl-desc">Weekly intel on launches, discoveries, and cosmic events — beamed directly to your inbox.</p>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.95}}>
                  <div className="sf-nl-input-wrap">
                    <input type="email" className={`sf-nl-input ${focused?"focused":""}`}
                      placeholder="commander@nasa.gov" value={email}
                      onChange={e=>setEmail(e.target.value)}
                      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                      onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                      style={{border:`1px solid ${focused?"rgba(139,92,246,0.6)":"rgba(139,92,246,0.18)"}`}}
                    />
                  </div>
                  <motion.button className="sf-nl-btn" onClick={handleSubmit} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
                    <span>🚀</span> Launch Subscription
                  </motion.button>
                  <div className="sf-nl-perks">
                    {["Weekly mission briefings","Exclusive JWST imagery","No spam, ever"].map((p,i)=>(
                      <div key={i} className="sf-nl-perk"><div className="sf-nl-perk-dot"/>{p}</div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{opacity:0,scale:0.9,y:10}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.5,ease:[0.23,1,0.32,1]}} className="sf-nl-success">
                  <span style={{fontSize:"1.2rem"}}>✦</span>
                  TRANSMISSION RECEIVED. WELCOME ABOARD.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="sf-planet-strip" />
        <div className="sf-mid-divider"><hr className="sf-mid-line" /></div>

        <motion.div className="sf-bottom" initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:0.8,delay:0.6}}>
          <div className="sf-copyright">© 2026 SPACESITE • ALL SYSTEMS OPERATIONAL</div>
          <div className="sf-bottom-links">
            {["Privacy Policy","Terms of Use","Cookie Policy","Sitemap"].map(l=>(
              <a key={l} href="#" className="sf-bottom-link">{l}</a>
            ))}
          </div>
          {/* Back to top — navigate to home */}
          <Link to="/" className="sf-back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
            ↑ BACK TO TOP
          </Link>
        </motion.div>
      </footer>
    </>
  );
}