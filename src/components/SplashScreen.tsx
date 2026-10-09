import React, { useEffect, useState } from "react";
import "./SplashScreen.css";
import { getLogoState, DEFAULT_LOGO_URL } from "../utils/logoManager";

export default function SplashScreen() {
  const [showLogo, setShowLogo] = useState(true);
  const [logoSrc, setLogoSrc] = useState<string>("/logo.png");

  useEffect(() => {
    try {
      const state = getLogoState();
      if (state.mode === 'custom' && state.customUrl) {
        setLogoSrc(state.customUrl);
      } else {
        setLogoSrc('/logo.png');
      }
    } catch {
      setLogoSrc('/logo.png');
    }

    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!showLogo) return null;

  return (
    <div className="splash-screen">
      <img
        src={logoSrc}
        alt="Gurudev Creative Logo"
        className="splash-logo"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_LOGO_URL;
        }}
      />
      <h2>Gurudev Creative_002</h2>
      <p>Video Editing & Designing</p>
    </div>
  );
}
