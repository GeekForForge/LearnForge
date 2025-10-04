import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrolling = ({ children }) => {
    const lenisRef = useRef(null);

    useEffect(() => {
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
            gsap.ticker.remove(() => {});
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScrolling;
