import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 1.5,
}));

const NAV_LINKS = [
  { label: "Home",     to: "/"         },
  { label: "Missions", to: "/missions" },
  { label: "Gallery",  to: "/gallery"  },
  { label: "Explore",  to: "/explore"  },
  { label: "Planets",  to: "/planets"  },
];

export default function SpaceNavbar() {
  const [open,              setOpen]              = useState(false);
  const [scrolled,          setScrolled]          = useState(false);
  const [hovered,           setHovered]           = useState(null);
  const [exploreHover,      setExploreHover]      = useState(false);
  const [mobileExploreHover,setMobileExploreHover]= useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* which nav item is active based on current URL */
  const getActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@300;400;600&display=swap');

        html { scroll-behavior: smooth; }

        .space-nav {
          position: fixed; width: 100%; z-index: 9999;
          font-family: 'Rajdhani', sans-serif; perspective: 1200px; top: 0;
        }

        .nav-shell {
          position: relative; overflow: hidden;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          background: ${scrolled
            ? "linear-gradient(135deg,rgba(4,0,20,0.97) 0%,rgba(10,0,40,0.97) 50%,rgba(4,0,20,0.97) 100%)"
            : "linear-gradient(135deg,rgba(4,0,20,0.85) 0%,rgba(10,0,40,0.85) 50%,rgba(4,0,20,0.85) 100%)"};
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139,92,246,0.25);
          box-shadow: ${scrolled
            ? "0 4px 60px rgba(109,40,217,0.3),inset 0 1px 0 rgba(255,255,255,0.05),0 0 0 1px rgba(139,92,246,0.1)"
            : "0 2px 20px rgba(109,40,217,0.1)"};
          transform-style: preserve-3d;
          animation: nav-in 0.7s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        @keyframes nav-in {
          from { transform: translateY(-100%) rotateX(-15deg); opacity: 0; }
          to   { transform: translateY(0) rotateX(0deg); opacity: 1; }
        }

        .star-field { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .star {
          position: absolute; border-radius: 50%; background: white; opacity: 0.6;
          animation: twinkle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(0.8); }
          to   { opacity: 0.9; transform: scale(1.2); }
        }

        .nebula { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(40px); opacity: 0.12; animation: nebula-drift 8s ease-in-out infinite alternate; }
        .nebula-1 { width:200px;height:80px;background:radial-gradient(circle,#7c3aed,transparent);top:-20px;left:10%; }
        .nebula-2 { width:150px;height:60px;background:radial-gradient(circle,#4f46e5,transparent);top:-10px;right:20%;animation-delay:-3s; }
        .nebula-3 { width:100px;height:100px;background:radial-gradient(circle,#db2777,transparent);bottom:-30px;left:50%;animation-delay:-5s;opacity:0.08; }
        @keyframes nebula-drift {
          from { transform: translateX(-10px) scale(1); }
          to   { transform: translateX(10px) scale(1.1); }
        }

        .scanline {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(139,92,246,0.015) 2px,rgba(139,92,246,0.015) 4px);
        }

        .glow-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,transparent,#7c3aed,#4f46e5,#db2777,#7c3aed,transparent);
          animation: glow-slide 1s linear infinite; background-size: 200% 100%;
        }
        @keyframes glow-slide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative; z-index: 2;
        }

        /* Logo */
        .logo {
          font-family: 'Orbitron', monospace; font-weight: 800; font-size: 0.9rem;
          letter-spacing: 0.15em; color: #e9d5ff; text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          text-shadow: 0 0 20px rgba(167,139,250,0.6),0 0 40px rgba(109,40,217,0.3);
          transition: all 0.3s ease; transform-style: preserve-3d;
        }
        .logo:hover {
          text-shadow: 0 0 30px rgba(167,139,250,0.9),0 0 60px rgba(109,40,217,0.5);
          transform:none;
        }
        .logo-icon {
          font-size: 1.4rem; display: inline-block;
          animation: rocket-pulse 2s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(167,139,250,0.8));
        }
        @keyframes rocket-pulse {
  0%,100% { 
    transform: translateY(0);
  }
  50% { 
    transform: translateY(-3px);
  }
}
        .logo-accent { color: #a78bfa; position: relative; }
        .logo-accent::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #a78bfa, transparent);
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer { 0%,100%{opacity:0.3} 50%{opacity:1} }

        /* Desktop links */
        .nav-links {
          display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0;
        }
        @media (max-width: 900px) { .nav-links { display: none; } }

        .nav-link-wrap { position: relative; }

        .nav-link {
          display: block; padding: 8px 14px;
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: #c4b5fd;
          text-decoration: none; position: relative; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          transform-style: preserve-3d; border-radius: 6px;
        }
        .nav-link::before {
          content: ''; position: absolute; inset: 0; border-radius: 6px;
          background: rgba(139,92,246,0); transition: background 0.3s ease; transform: translateZ(-1px);
        }
        .nav-link.is-hovered, .nav-link.is-active {
          color: #f5f3ff; text-shadow: 0 0 12px rgba(167,139,250,0.8);
          transform: translateY(-1px) translateZ(2px);
        }
        .nav-link.is-hovered::before, .nav-link.is-active::before { background: rgba(109,40,217,0.25); }

        .nav-link-underline {
          position: absolute; bottom: 2px; left: 14px; right: 14px; height: 1.5px;
          border-radius: 2px; background: linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed);
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
          filter: blur(0.5px); box-shadow: 0 0 8px rgba(139,92,246,0.8);
        }
        .nav-link.is-hovered .nav-link-underline,
        .nav-link.is-active  .nav-link-underline { transform: scaleX(1); }

        .nav-link-wrap:nth-child(1) .nav-link { animation: link-in 0.5s 0.20s both; }
        .nav-link-wrap:nth-child(2) .nav-link { animation: link-in 0.5s 0.27s both; }
        .nav-link-wrap:nth-child(3) .nav-link { animation: link-in 0.5s 0.34s both; }
        .nav-link-wrap:nth-child(4) .nav-link { animation: link-in 0.5s 0.41s both; }
        .nav-link-wrap:nth-child(5) .nav-link { animation: link-in 0.5s 0.48s both; }
        @keyframes link-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Explore CTA */
        .explore-btn {
          position: relative; padding: 10px 24px; border-radius: 40px;
          font-family: 'Orbitron', monospace; font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: white;
          text-decoration: none; display: inline-block; overflow: hidden;
          border: 1px solid rgba(139,92,246,0.5);
          transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
          transform-style: preserve-3d; cursor: pointer;
          background: linear-gradient(135deg,rgba(109,40,217,0.8),rgba(79,70,229,0.8));
          box-shadow: 0 4px 20px rgba(109,40,217,0.4),inset 0 1px 0 rgba(255,255,255,0.1),0 0 0 1px rgba(139,92,246,0.2);
        }
        @media (max-width: 900px) { .explore-btn { display: none; } }
        .explore-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(139,92,246,0.9),rgba(109,40,217,0.9));
          opacity: 0; transition: opacity 0.3s;
        }
        .explore-btn.is-hovered::before { opacity: 1; }
        .explore-btn.is-hovered {
          transform: translateY(-2px) translateZ(4px) scale(1.03);
          box-shadow: 0 8px 30px rgba(109,40,217,0.6),inset 0 1px 0 rgba(255,255,255,0.15),0 0 0 1px rgba(167,139,250,0.4);
          border-color: rgba(167,139,250,0.8);
        }
        .explore-btn-text { position: relative; z-index: 1; display: flex; align-items: center; gap: 6px; }
        .explore-btn-glow {
          position: absolute; inset: -2px; border-radius: inherit;
          background: linear-gradient(135deg,#7c3aed,#4f46e5,#db2777);
          filter: blur(8px); opacity: 0; transition: opacity 0.3s; z-index: -1;
        }
        .explore-btn.is-hovered .explore-btn-glow { opacity: 0.6; }

        /* Hamburger */
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 8px; background: none; border: none; position: relative; z-index: 2;
        }
        @media (max-width: 900px) { .hamburger { display: flex; } }
        .ham-line {
          width: 24px; height: 2px; background: #a78bfa; border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1); transform-origin: center;
          box-shadow: 0 0 6px rgba(167,139,250,0.6);
        }
        .hamburger.is-open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.is-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.is-open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          overflow: hidden; max-height: 0; opacity: 0; position: relative; z-index: 2;
          transition: max-height 0.5s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease;
        }
        .mobile-menu.is-open { max-height: 500px; opacity: 1; }
        .mobile-menu-inner {
          border-top: 1px solid rgba(139,92,246,0.15);
          padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 4px;
        }
        .mobile-link {
          display: block; padding: 12px 16px;
          font-family: 'Rajdhani', sans-serif; font-size: 1rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: #c4b5fd;
          text-decoration: none; border-radius: 8px; border: 1px solid transparent;
          transition: all 0.25s ease; position: relative; overflow: hidden; cursor: pointer;
        }
        .mobile-link::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg,#7c3aed,#a78bfa); border-radius: 0 2px 2px 0;
          transform: scaleY(0); transition: transform 0.25s ease;
        }
        .mobile-link:hover, .mobile-link.is-active {
          color: #f5f3ff; background: rgba(109,40,217,0.2);
          border-color: rgba(139,92,246,0.2); padding-left: 24px;
          text-shadow: 0 0 10px rgba(167,139,250,0.5);
        }
        .mobile-link:hover::before, .mobile-link.is-active::before { transform: scaleY(1); }
        .mobile-explore {
          margin-top: 12px; display: block; padding: 14px 24px; text-align: center;
          font-family: 'Orbitron', monospace; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; color: white;
          text-decoration: none; border-radius: 40px; cursor: pointer;
          background: linear-gradient(135deg,rgba(109,40,217,0.9),rgba(79,70,229,0.9));
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 4px 20px rgba(109,40,217,0.4),inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        .mobile-explore.is-hovered {
          transform: scale(1.02);
          box-shadow: 0 6px 30px rgba(109,40,217,0.6),inset 0 1px 0 rgba(255,255,255,0.15);
          border-color: rgba(167,139,250,0.6);
        }
      `}</style>

      <nav className="space-nav">
        <div className="nav-shell">
          <div className="star-field">
            {STARS.map(s => (
              <div key={s.id} className="star" style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                "--dur": `${s.duration}s`, "--delay": `${s.delay}s`,
              }} />
            ))}
          </div>
          <div className="nebula nebula-1" />
          <div className="nebula nebula-2" />
          <div className="nebula nebula-3" />
          <div className="scanline" />
          <div className="glow-bar" />

          <div className="nav-inner">

            {/* Logo */}
            <Link to="/" className="logo" onClick={() => setOpen(false)}>
              <span><img src="space1.jpeg" className="logo-icon w-8" alt="Space Organisation authority" /></span>
              <span>SPACE<span className="logo-accent"> Organisations </span><span>Authority</span></span>
            </Link>

            {/* Desktop links */}
            <ul className="nav-links">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label} className="nav-link-wrap">
                  <Link
                    to={to}
                    className={`nav-link ${hovered === label ? "is-hovered" : ""} ${getActive(to) ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {label}
                    <span className="nav-link-underline" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Explore CTA */}
            <Link
              to="/Programs"
              className={`explore-btn ${exploreHover ? "is-hovered" : ""}`}
              onMouseEnter={() => setExploreHover(true)}
              onMouseLeave={() => setExploreHover(false)}
            >
              <div className="explore-btn-glow" />
              <span className="explore-btn-text">
                <span style={{ fontSize: "0.85rem" }}>✦</span>
                Programes
              </span>
            </Link>

            {/* Hamburger */}
            <button
              className={`hamburger ${open ? "is-open" : ""}`}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`mobile-menu ${open ? "is-open" : ""}`}>
            <div className="mobile-menu-inner">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className={`mobile-link ${getActive(to) ? "is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/Programs"
                className={`mobile-explore ${mobileExploreHover ? "is-hovered" : ""}`}
                onMouseEnter={() => setMobileExploreHover(true)}
                onMouseLeave={() => setMobileExploreHover(false)}
                onClick={() => setOpen(false)}
              >
                ✦ EXPLORE THE UNIVERSE
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}