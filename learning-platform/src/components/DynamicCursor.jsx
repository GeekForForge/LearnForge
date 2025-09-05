import React, { useEffect, useState } from 'react';

const DynamicCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateTrailPosition = () => {
      setTrailPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    const handleMouseOver = (e) => {
      if (e.target.matches('button, a, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    const trailInterval = setInterval(updateTrailPosition, 16);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      clearInterval(trailInterval);
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed w-6 h-6 border-2 rounded-full pointer-events-none z-[9999] transition-all duration-200 ${
          isHovering 
            ? 'border-neon-cyan scale-150 shadow-neon-cyan' 
            : 'border-neon-purple shadow-neon-purple'
        }`}
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `translate(0, 0)`,
        }}
      />
      
      {/* Trail cursor */}
      <div
        className="fixed w-2 h-2 bg-neon-purple rounded-full pointer-events-none z-[9998] opacity-70"
        style={{
          left: trailPosition.x - 4,
          top: trailPosition.y - 4,
          transform: `translate(0, 0)`,
          boxShadow: '0 0 10px #8B5CF6',
        }}
      />
    </>
  );

};
export default DynamicCursor;