import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, ArrowDown, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import charity images
import charity1 from '../assets/charity-1.jpg';
import charity2 from '../assets/charity-2.jpg';
import charity3 from '../assets/charity-3.jpg';
import charity4 from '../assets/charity-4.jpg';
import charity5 from '../assets/charity-5.jpg';
import charity6 from '../assets/charity-6.jpg';
import pattern1 from '../assets/pattern-1.jpg';
import pattern2 from '../assets/pattern-2.jpg';
import pattern3 from '../assets/pattern-3.jpg';

// gsap.registerPlugin(Observer);

const GSAPVerticalGallery: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loopsRef = useRef<gsap.core.Timeline[]>([]);

  const columnData = [
    [pattern1, charity1, charity3, pattern2, charity5, pattern3],
    [pattern3, charity2, charity4, pattern1, charity6, charity1],
    [pattern2, charity3, charity2, pattern3, charity4, charity6]
  ];

  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const columns = gsap.utils.toArray('.gallery-column', wrapper) as HTMLElement[];
    
    // Set initial opacity to 0 for smooth fade in
    gsap.set(columns, { autoAlpha: 0 });
    
    let handleWheel: (e: WheelEvent) => void;

    const createVerticalLoop = (items: HTMLElement[], config: any = {}) => {
      items = gsap.utils.toArray(items) as HTMLElement[];
      config = config || {};
      
      const tl = gsap.timeline({
        repeat: config.repeat || -1,
        paused: config.paused || false,
        defaults: { ease: "none" },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
      });

      const length = items.length;
      const startY = (items[0] as HTMLElement).offsetTop;
      const times: number[] = [];
      const heights: number[] = [];
      const spaceBefore: number[] = [];
      const yPercents: number[] = [];
      const pixelsPerSecond = (config.speed || 1) * 100;
      const snap = (v: number) => Math.round(v);

      const populateHeights = () => {
        items.forEach((el, i) => {
          const element = el as HTMLElement;
          heights[i] = parseFloat(gsap.getProperty(element, "height", "px") as string);
          yPercents[i] = snap((parseFloat(gsap.getProperty(element, "y", "px") as string) / heights[i]) * 100 + 
                              parseFloat(gsap.getProperty(element, "yPercent") as string));
          if (i > 0) {
            spaceBefore[i] = element.offsetTop - (items[i-1] as HTMLElement).offsetTop - heights[i-1];
          } else {
            spaceBefore[i] = 0;
          }
        });
        gsap.set(items, { yPercent: (i) => yPercents[i] });
      };

      const populateTimeline = () => {
        tl.clear();
        const totalHeight = items.reduce((sum, item, i) => sum + heights[i] + spaceBefore[i], 0);
        
        items.forEach((item, i) => {
          const curY = (yPercents[i] / 100) * heights[i];
          const distanceToStart = (item as HTMLElement).offsetTop + curY - startY + spaceBefore[0];
          const distanceToLoop = distanceToStart + heights[i];
          
          tl.to(item, {
            yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond
          }, 0)
          .fromTo(item, {
            yPercent: snap(((curY - distanceToLoop + totalHeight) / heights[i]) * 100)
          }, {
            yPercent: yPercents[i],
            duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond,
            immediateRender: false
          }, distanceToLoop / pixelsPerSecond);
          
          times[i] = distanceToStart / pixelsPerSecond;
        });
      };

      gsap.set(items, { y: 0 });
      populateHeights();
      populateTimeline();
      
      tl.progress(1).progress(0);
      
      return tl;
    };

    // Wait for images to load
    const images = wrapper.querySelectorAll('img');
    let loadedImages = 0;
    
    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        initializeAnimation();
      }
    };

    images.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad);
      }
    });

    const initializeAnimation = () => {
      const loops = columns.map((column, i) => {
        const items = gsap.utils.toArray('.gallery-item', column) as HTMLElement[];
        return createVerticalLoop(items, {
          repeat: -1,
          paddingBottom: 10,
          paused: false,
          speed: 0.5
        });
      });

      loopsRef.current = loops;

      // Set different starting times and initial timeScale to 0
      gsap.set(loops, {
        time: (i) => (i % 2) + 1,
        timeScale: 0
      });

      // Fade in columns
      gsap.set(columns, { autoAlpha: 1 });

      // Create scroll interactions with wheel events
      let isScrolling = false;
      
      handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        if (isScrolling) return;
        isScrolling = true;
        
        const direction = e.deltaY > 0 ? 1 : -1;
        
        gsap.timeline()
          .to(loops, {
            timeScale: (i) => direction * (i % 2 > 0 ? 2 : 2.5),
            overwrite: true,
            duration: 0.2
          })
          .to(loops, {
            timeScale: 0,
            ease: "power1.in",
            onComplete: () => {
              isScrolling = false;
            }
          }, 1);
      };
      
      window.addEventListener('wheel', handleWheel, { passive: false });

      // Auto-scroll animation for scroll indicator
      const autoScrollTl = gsap.timeline({ repeat: -1, yoyo: true });
      autoScrollTl.to(loops, {
        timeScale: 0.3,
        duration: 3,
        ease: "power2.inOut"
      });

      // Show/hide scroll indicator based on interaction
      let interactionTimeout: NodeJS.Timeout;
      const showScrollIndicator = () => {
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.3 });
        }
        autoScrollTl.play();
      };

      const hideScrollIndicator = () => {
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.3 });
        }
        autoScrollTl.pause();
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(showScrollIndicator, 3000);
      };

      // Initially show scroll indicator
      showScrollIndicator();

      // Hide indicator on interaction
      window.addEventListener('wheel', hideScrollIndicator);
      window.addEventListener('touchstart', hideScrollIndicator);
    };

    // Cleanup function
    return () => {
      loopsRef.current.forEach(loop => loop.kill());
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Overlay Content */}
      <div 
        ref={contentRef}
        className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center"
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4 pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-primary font-nunito font-semibold text-lg">
                Web3 Charitable Platform
              </span>
            </div>
            
            <h1 className="text-7xl lg:text-8xl font-shadows text-foreground leading-tight">
              Transform Giving Into{' '}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Growing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of charitable giving with blockchain transparency, 
              HEART token rewards, and your personalized virtual garden that grows with every donation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/marketplace"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-2xl font-nunito font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Heart className="w-5 h-5" />
              <span>Start Growing</span>
            </Link>
            
            <Link
              to="/dashboard"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 rounded-2xl font-nunito font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Users className="w-5 h-5" />
              <span>Join Community</span>
            </Link>
          </div>
        </div>
      </div>

      {/* GSAP Gallery */}
      <div ref={wrapperRef} className="flex w-full h-screen gap-[2%] overflow-hidden">
        {columnData.map((columnImages, columnIndex) => (
          <div 
            key={columnIndex}
            className="gallery-column w-[32%] flex flex-col"
            style={{ willChange: 'transform' }}
          >
            {columnImages.map((imageSrc, imageIndex) => (
              <div 
                key={`${columnIndex}-${imageIndex}`}
                className="gallery-item w-full h-[300px] mb-[10px]"
              >
                <img 
                  src={imageSrc} 
                  alt={`Charity ${columnIndex + 1}-${imageIndex + 1}`}
                  className="w-full h-full object-cover object-center rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 text-center opacity-0"
      >
        <div className="text-muted-foreground text-sm mb-2">Scroll to explore</div>
        <ArrowDown className="w-6 h-6 text-primary mx-auto animate-bounce" />
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none z-10" />
    </div>
  );
};

export default GSAPVerticalGallery;