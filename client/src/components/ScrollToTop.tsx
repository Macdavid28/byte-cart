import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — dual-purpose component:
 * 1. Scrolls to top on every route/pathname change
 * 2. Renders a floating "Back to Top" button after scrolling 300px
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Toggle button visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: showButton ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: "#1e293b",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease, opacity 0.3s ease",
        opacity: showButton ? 1 : 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      <ArrowUp size={22} />
    </button>
  );
};

export default ScrollToTop;
