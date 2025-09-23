import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import GardenParticles from '../components/GardenParticles';

const NewLanding = () => {
  const { connect, isConnected } = useWallet();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle 3D mouse tracking effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      const rotateY = deltaX * 8;
      const rotateX = -deltaY * 8;
      
      const hero = containerRef.current.querySelector('.hero-3d') as HTMLElement;
      
      if (hero) {
        hero.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <GardenParticles />
      
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="hero-3d transition-transform duration-100 ease-out transform-gpu">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 px-4"
          >
            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-shadows text-6xl md:text-8xl lg:text-9xl text-foreground leading-tight"
              >
                CHARITY
                <span className="block text-garden-glow">REWARDS</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center"
              >
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl md:text-3xl font-caveat text-garden-text-accent max-w-3xl mx-auto leading-relaxed"
            >
              Transform your compassion into digital rewards
              <br />
              <span className="text-primary">Grow your garden of giving</span>
            </motion.p>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <Link 
                to="/marketplace"
                className="btn-garden-primary flex items-center space-x-2 group"
              >
                <Globe className="w-5 h-5" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {!isConnected && (
                <button 
                  onClick={connect}
                  className="btn-garden-secondary flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-4xl md:text-5xl font-shadows text-foreground mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'Donate',
                description: 'Support verified charity campaigns with cryptocurrency donations'
              },
              {
                icon: Sparkles,
                title: 'Earn',
                description: 'Receive HEART tokens and unique NFT badges for your contributions'
              },
              {
                icon: Globe,
                title: 'Impact',
                description: 'Track your real-world impact and grow your digital garden'
              }
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-garden p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-nunito font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground font-nunito">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewLanding;