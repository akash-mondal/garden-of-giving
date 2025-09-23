import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Heart, ArrowRight, Globe, Users } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';

// Import images
import charity1 from '../assets/charity-1.jpg';
import charity2 from '../assets/charity-2.jpg';
import charity3 from '../assets/charity-3.jpg';
import charity4 from '../assets/charity-4.jpg';
import charity5 from '../assets/charity-5.jpg';

// Register GSAP plugins
gsap.registerPlugin(Observer);

const AnimatedSectionsLanding = () => {
  const { connect, isConnected } = useWallet();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const outerWrappersRef = useRef<HTMLDivElement[]>([]);
  const innerWrappersRef = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const headingsRef = useRef<HTMLHeadingElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [animating, setAnimating] = useState(false);

  const sections = [
    {
      title: "Transform Lives Through Giving",
      subtitle: "Start your journey",
      image: charity1,
      action: (
        <div className="flex gap-4 mt-8">
          <Button 
            variant="premium" 
            size="lg"
            onClick={() => !animating && gotoSection(1, 1)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Discover Impact
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )
    },
    {
      title: "Blockchain-Powered Transparency",
      subtitle: "Every donation tracked",
      image: charity2,
      action: (
        <div className="flex gap-4 mt-8">
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => !animating && gotoSection(2, 1)}
          >
            <Globe className="w-5 h-5 mr-2" />
            See Transparency
          </Button>
        </div>
      )
    },
    {
      title: "Earn Rewards for Kindness",
      subtitle: "HEART tokens & NFT badges",
      image: charity3,
      action: (
        <div className="flex gap-4 mt-8">
          <Button 
            variant="premium" 
            size="lg"
            onClick={() => !animating && gotoSection(3, 1)}
          >
            Learn Rewards System
          </Button>
        </div>
      )
    },
    {
      title: "Join the Community",
      subtitle: "Connect with like-minded givers",
      image: charity4,
      action: (
        <div className="flex gap-4 mt-8">
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => !animating && gotoSection(4, 1)}
          >
            <Users className="w-5 h-5 mr-2" />
            Explore Community
          </Button>
        </div>
      )
    },
    {
      title: "Ready to Make a Difference?",
      subtitle: "Start your giving journey today",
      image: charity5,
      action: (
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {!isConnected ? (
            <Button 
              variant="premium" 
              size="lg"
              onClick={connect}
            >
              <Heart className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <Link to="/marketplace">
              <Button variant="premium" size="lg">
                <Globe className="w-5 h-5 mr-2" />
                Enter Marketplace
              </Button>
            </Link>
          )}
          <Link to="/dashboard">
            <Button variant="glass" size="lg">
              View Dashboard
            </Button>
          </Link>
        </div>
      )
    }
  ];

  const wrap = (index: number) => {
    if (index >= sections.length) return 0;
    if (index < 0) return sections.length - 1;
    return index;
  };

  const gotoSection = (index: number, direction: number) => {
    if (animating) return;
    
    index = wrap(index);
    setAnimating(true);
    setCurrentIndex(index);
    
    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    
    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => setAnimating(false)
    });

    if (currentIndex >= 0) {
      gsap.set(sectionsRef.current[currentIndex], { zIndex: 0 });
      tl.to(imagesRef.current[currentIndex], { yPercent: -15 * dFactor })
        .set(sectionsRef.current[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sectionsRef.current[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappersRef.current[index], innerWrappersRef.current[index]], 
      { yPercent: (i: number) => i ? -100 * dFactor : 100 * dFactor }, 
      { yPercent: 0 }, 
      0
    )
    .fromTo(imagesRef.current[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    .fromTo(
      headingsRef.current[index], 
      { autoAlpha: 0, yPercent: 150 * dFactor },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
      }, 
      0.2
    );
  };

  useEffect(() => {
    // Initialize GSAP
    gsap.set(outerWrappersRef.current, { yPercent: 100 });
    gsap.set(innerWrappersRef.current, { yPercent: -100 });

    // Create Observer
    const observer = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true
    });

    // Start with first section
    setTimeout(() => gotoSection(0, 1), 100);

    return () => {
      observer.kill();
    };
  }, [currentIndex, animating]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-[5%] h-28 text-white uppercase tracking-[0.5em] text-sm">
        <div className="font-shadows">Charity Rewards</div>
        <Link to="/marketplace" className="text-white/80 hover:text-white transition-colors">
          Enter Marketplace
        </Link>
      </header>

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={index}
          ref={(el) => { if (el) sectionsRef.current[index] = el; }}
          className="fixed top-0 w-full h-full invisible"
        >
          <div 
            ref={(el) => { if (el) outerWrappersRef.current[index] = el; }}
            className="w-full h-full overflow-hidden"
          >
            <div 
              ref={(el) => { if (el) innerWrappersRef.current[index] = el; }}
              className="w-full h-full overflow-hidden"
            >
              <div
                ref={(el) => { if (el) imagesRef.current[index] = el; }}
                className="absolute top-0 w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 100%), url('${section.image}')`,
                }}
              >
                <div className="text-center text-white z-50 px-4 max-w-4xl">
                  <h2
                    ref={(el) => { if (el) headingsRef.current[index] = el; }}
                    className="font-shadows text-4xl md:text-6xl lg:text-8xl font-semibold mb-4 leading-tight"
                    style={{
                      textShadow: '0 0 30px rgba(255, 105, 180, 0.5)',
                    }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-xl md:text-2xl font-caveat mb-8 text-white/90">
                    {section.subtitle}
                  </p>
                  {section.action}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Navigation hint */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 text-white/60 text-sm">
        Scroll or swipe to explore
      </div>
    </div>
  );
};

export default AnimatedSectionsLanding;