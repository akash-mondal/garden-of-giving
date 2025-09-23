import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const NewLanding = () => {
  const { connect, isConnected } = useWallet();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple mouse move 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      const rotateY = deltaX * 15;
      const rotateX = -deltaY * 15;
      
      const title = containerRef.current.querySelector('.title-3d') as HTMLElement;
      const subtitle = containerRef.current.querySelector('.subtitle-3d') as HTMLElement;
      
      if (title) {
        title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      if (subtitle) {
        subtitle.style.transform = `perspective(1000px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="landing-3d">
      {/* Simple navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">CharityRewards</div>
        <div className="flex gap-6 items-center">
          <Link to="/marketplace" className="text-white hover:text-pink-300 transition-colors">
            Marketplace
          </Link>
          <Link to="/dashboard" className="text-white hover:text-pink-300 transition-colors">
            Dashboard
          </Link>
          <button 
            onClick={isConnected ? undefined : connect}
            className="px-6 py-2 border border-white/30 rounded-full text-white hover:bg-white/10 transition-all"
          >
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Main 3D text content */}
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="space-y-12">
          <h1 className="title-3d text-8xl md:text-9xl font-bold text-white leading-tight">
            CHARITY
            <br />
            REWARDS
          </h1>
          
          <p className="subtitle-3d text-2xl md:text-3xl text-white/80 max-w-2xl mx-auto">
            Transform compassion into digital rewards
            <br />
            in our garden of giving
          </p>
          
          <div className="flex gap-8 justify-center">
            <Link 
              to="/marketplace"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-lg font-semibold hover:bg-white/20 transition-all hover:scale-105"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLanding;