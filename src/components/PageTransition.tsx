import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning, onTransitionComplete }) => {
  const overlayRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline>();
  const isOpenedRef = useRef(false);
  const allPointsRef = useRef<number[][]>([]);
  const pointsDelayRef = useRef<number[]>([]);
  const isInitializedRef = useRef(false);
  
  const numPoints = 10;
  const numPaths = 3;
  const delayPointsMax = 0.3;
  const delayPerPath = 0.25;

  const render = () => {
    for (let i = 0; i < numPaths; i++) {
      let path = pathsRef.current[i];
      let points = allPointsRef.current[i];
      
      if (!path || !points) continue;
      
      let d = "";
      d += isOpenedRef.current ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;
      
      for (let j = 0; j < numPoints - 1; j++) {
        let p = (j + 1) / (numPoints - 1) * 100;
        let cp = p - (1 / (numPoints - 1) * 100) / 2;
        d += ` ${cp} ${points[j]} ${cp} ${points[j+1]} ${p} ${points[j+1]}`;
      }
      
      d += isOpenedRef.current ? ` V 100 H 0` : ` V 0 H 0`;
      path.setAttribute("d", d);
    }  
  };

  const toggle = () => {
    if (!tlRef.current) return;
    
    console.log('Toggle called, isOpened:', isOpenedRef.current);
    tlRef.current.progress(0).clear();
    
    for (let i = 0; i < numPoints; i++) {
      pointsDelayRef.current[i] = Math.random() * delayPointsMax;
    }
    
    for (let i = 0; i < numPaths; i++) {
      let points = allPointsRef.current[i];
      let pathDelay = delayPerPath * (isOpenedRef.current ? i : (numPaths - i - 1));
          
      for (let j = 0; j < numPoints; j++) {      
        let delay = pointsDelayRef.current[j];      
        tlRef.current!.to(points, {
          [j]: 0
        }, delay + pathDelay);
      }
    }
  };

  useEffect(() => {
    // Initialize points
    allPointsRef.current = [];
    for (let i = 0; i < numPaths; i++) {
      let points = [];
      allPointsRef.current.push(points);
      for (let j = 0; j < numPoints; j++) {
        points.push(100);
      }
    }

    // Initialize points delay array
    pointsDelayRef.current = new Array(numPoints).fill(0);

    // Initialize timeline
    tlRef.current = gsap.timeline({ 
      onUpdate: render,
      onComplete: () => {
        console.log('Timeline complete, isOpened:', isOpenedRef.current);
        if (isOpenedRef.current) {
          // After opening transition is complete, close it
          setTimeout(() => {
            isOpenedRef.current = false;
            toggle();
          }, 100);
        } else {
          onTransitionComplete();
        }
      },
      defaults: {
        ease: "power2.inOut",
        duration: 0.9
      }
    });

    // Initial render
    setTimeout(() => {
      render();
      isInitializedRef.current = true;
    }, 10);

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [onTransitionComplete]);

  useEffect(() => {
    if (isTransitioning && isInitializedRef.current && !tlRef.current?.isActive()) {
      console.log('Starting page transition animation');
      isOpenedRef.current = true;
      toggle();
    }
  }, [isTransitioning]);

  return (
    <svg 
      ref={overlayRef}
      className="shape-overlays" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff8709"/>
          <stop offset="100%" stopColor="#f7bdf8"/>
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00bae2"/>
          <stop offset="100%" stopColor="#fec5fb"/>
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ae448"/>
          <stop offset="100%" stopColor="#0085d0"/>
        </linearGradient>
      </defs>
      <path 
        ref={el => pathsRef.current[0] = el!} 
        className="shape-overlays__path" 
        fill="url(#gradient1)"
      />
      <path 
        ref={el => pathsRef.current[1] = el!} 
        className="shape-overlays__path" 
        fill="url(#gradient2)"
      />
      <path 
        ref={el => pathsRef.current[2] = el!} 
        className="shape-overlays__path" 
        fill="url(#gradient3)"
      />
    </svg>
  );
};

export default PageTransition;