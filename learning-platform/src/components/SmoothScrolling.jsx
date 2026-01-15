import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrolling = ({ children }) => {
    const lenisRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        // Disable global smooth scroll for full-screen apps like AI Chat and Arena Game
        const isFullScreenPage = ['/ai', '/arena/play', '/arena/multiplayer'].some(path => location.pathname.startsWith(path));

        if (isFullScreenPage) {
            // Ensure any existing instance is cleaned up
            lenisRef.current?.destroy();
            lenisRef.current = null;
            return;
        }

        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenisRef.current?.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenisRef.current?.destroy();
            gsap.ticker.remove(() => { });
        };
    }, [location.pathname]); // Re-run when path changes

    return <>{children}</>;
};

export default SmoothScrolling;
