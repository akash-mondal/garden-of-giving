import { motion } from 'framer-motion';
import { Heart, Leaf, Sparkles, Droplets, Sun, Flower } from 'lucide-react';

interface GardenGridProps {
  donationCount?: number;
  totalDonated?: number;
  className?: string;
}

const GardenGrid: React.FC<GardenGridProps> = ({ 
  donationCount = 0, 
  totalDonated = 0,
  className = ""
}) => {
  // Calculate growth based on donations
  const growthLevel = Math.min(Math.floor(totalDonated / 1000), 5);
  const flowerCount = Math.min(donationCount, 12);

  const gardenElements = [
    { icon: Sun, color: 'text-yellow-400', delay: 0, name: 'sunshine' },
    { icon: Droplets, color: 'text-blue-400', delay: 0.1, name: 'water' },
    { icon: Leaf, color: 'text-green-400', delay: 0.2, name: 'growth' },
    { icon: Heart, color: 'text-primary', delay: 0.3, name: 'love' },
    { icon: Sparkles, color: 'text-purple-400', delay: 0.4, name: 'magic' },
    { icon: Flower, color: 'text-pink-400', delay: 0.5, name: 'bloom' },
  ];

  const seedsToFlowers = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    isBloom: i < flowerCount,
    delay: i * 0.1,
    x: (i % 4) * 25 + 12.5,
    y: Math.floor(i / 4) * 25 + 12.5,
  }));

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Background garden bed */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-green-100/50 rounded-3xl" />
      
      {/* Garden elements in corners */}
      <div className="absolute inset-0 p-8">
        {gardenElements.map(({ icon: Icon, color, delay, name }, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: delay + 0.5,
              type: "spring",
              stiffness: 100
            }}
            className={`absolute ${
              index === 0 ? 'top-4 left-4' :
              index === 1 ? 'top-4 right-4' :
              index === 2 ? 'bottom-4 left-4' :
              index === 3 ? 'bottom-4 right-4' :
              index === 4 ? 'top-1/2 left-4 -translate-y-1/2' :
              'top-1/2 right-4 -translate-y-1/2'
            }`}
          >
            <div className="relative">
              <Icon className={`w-8 h-8 ${color} drop-shadow-lg`} fill="currentColor" />
              <div className={`absolute inset-0 ${color} opacity-30 blur-xl scale-150 animate-pulse`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central garden grid */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-full max-w-sm">
          {/* Garden soil base */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent rounded-2xl" />
          
          {/* Growth grid */}
          <div className="relative grid grid-cols-4 gap-2 p-4">
            {seedsToFlowers.map(({ id, isBloom, delay, x, y }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: isBloom ? -2 : 0, 
                  scale: isBloom ? 1.2 : 0.8 
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: delay + 1,
                  type: "spring",
                  stiffness: 150
                }}
                className="aspect-square flex items-center justify-center"
              >
                {isBloom ? (
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: delay 
                    }}
                    className="relative"
                  >
                    <Flower 
                      className="w-6 h-6 text-primary drop-shadow-lg" 
                      fill="currentColor" 
                    />
                    <div className="absolute inset-0 text-primary opacity-40 blur-md">
                      <Flower className="w-6 h-6" fill="currentColor" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      y: [0, -1, 0],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: delay 
                    }}
                    className="w-3 h-3 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full shadow-sm"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Growth level indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center"
          >
            <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
              <Heart className="w-3 h-3 text-primary" fill="currentColor" />
              <span className="text-xs font-nunito font-medium text-foreground">
                {flowerCount} flowers blooming
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`floating-${i}`}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            y: [-10, -20, -10],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default GardenGrid;