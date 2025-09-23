import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IsometricGardenProps {
  donationCount?: number;
  totalDonated?: number;
  className?: string;
}

interface GardenTile {
  id: string;
  x: number;
  y: number;
  type: 'empty' | 'seed' | 'sprout' | 'flower' | 'tree' | 'rock' | 'water' | 'bush' | 'palm' | 'cherry' | 'lily';
  level: number;
  color: string;
  planted: boolean;
  animationDelay: number;
}

interface FloatingElement {
  id: string;
  type: 'bird' | 'butterfly' | 'bee';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
}

const IsometricGarden: React.FC<IsometricGardenProps> = ({ 
  donationCount = 0, 
  totalDonated = 0,
  className = ""
}) => {
  const [tiles, setTiles] = useState<GardenTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  const GRID_SIZE = 8; // Bigger grid
  const TILE_SIZE = 45;

  // Expanded plant varieties with emojis
  const plantEmojis = {
    seed: '🌰',
    sprout: '🌱',
    flower: ['🌸', '🌺', '🌻', '🌷', '🌹', '💐'],
    tree: ['🌳', '🌲', '🌴', '🍃'],
    bush: ['🌿', '☘️', '🍀'],
    palm: '🌴',
    cherry: '🌸',
    lily: '🪷',
    rock: ['🪨', '⛰️'],
    water: '💧'
  };

  // Initialize garden grid with more variety
  useEffect(() => {
    const newTiles: GardenTile[] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const tileId = `${x}-${y}`;
        let tileType: GardenTile['type'] = 'empty';
        let level = 0;
        let planted = false;
        
        // Create natural patterns - water features, rock formations
        if ((x === 1 && y === 1) || (x === 6 && y === 2)) {
          tileType = 'water';
        } else if ((x === 3 && y === 0) || (x === 5 && y === 5) || (x === 1 && y === 6)) {
          tileType = 'rock';
        } else {
          // Plant based on donations with more variety
          const plantIndex = y * GRID_SIZE + x;
          const plantsToShow = Math.min(donationCount * 2 + 5, GRID_SIZE * GRID_SIZE - 5); // More plants
          
          if (plantIndex < plantsToShow) {
            planted = true;
            const growth = Math.min((totalDonated + plantIndex * 80) / 400, 1);
            const variety = (plantIndex + x + y) % 10; // Add variety based on position
            
            if (growth < 0.15) {
              tileType = 'seed';
              level = 1;
            } else if (growth < 0.35) {
              tileType = 'sprout';
              level = Math.floor(growth * 4) + 1;
            } else if (growth < 0.6) {
              // Different flower types based on position
              if (variety < 3) tileType = 'flower';
              else if (variety < 5) tileType = 'bush';
              else if (variety < 7) tileType = 'lily';
              else tileType = 'cherry';
              level = Math.floor(growth * 5) + 1;
            } else {
              // Different tree types for mature plants
              if (variety < 4) tileType = 'tree';
              else if (variety < 6) tileType = 'palm';
              else if (variety < 8) tileType = 'bush';
              else tileType = 'flower';
              level = Math.floor(growth * 6) + 1;
            }
          }
        }

        newTiles.push({
          id: tileId,
          x,
          y,
          type: tileType,
          level,
          color: '#4ade80',
          planted,
          animationDelay: (x + y) * 0.1 // Staggered animations
        });
      }
    }
    
    setTiles(newTiles);
    
    // Add floating elements based on garden maturity
    const maturity = Math.min(totalDonated / 2000, 1);
    const elementCount = Math.floor(maturity * 6) + 2;
    
    const newFloatingElements: FloatingElement[] = [];
    for (let i = 0; i < elementCount; i++) {
      const types: FloatingElement['type'][] = ['bird', 'butterfly', 'bee'];
      newFloatingElements.push({
        id: `floating-${i}`,
        type: types[i % types.length],
        x: Math.random() * 400,
        y: Math.random() * 300,
        targetX: Math.random() * 400,
        targetY: Math.random() * 300,
        speed: 0.5 + Math.random() * 1
      });
    }
    
    setFloatingElements(newFloatingElements);
  }, [donationCount, totalDonated]);

  // Animate floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(element => {
        const dx = element.targetX - element.x;
        const dy = element.targetY - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
          // Reached target, set new target
          return {
            ...element,
            targetX: Math.random() * 400,
            targetY: Math.random() * 300
          };
        }
        
        // Move towards target
        const moveX = (dx / distance) * element.speed;
        const moveY = (dy / distance) * element.speed;
        
        return {
          ...element,
          x: element.x + moveX,
          y: element.y + moveY
        };
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Convert grid coordinates to isometric screen position
  const gridToIso = (gridX: number, gridY: number) => {
    const isoX = (gridX - gridY) * (TILE_SIZE / 2);
    const isoY = (gridX + gridY) * (TILE_SIZE / 4);
    return { x: isoX, y: isoY };
  };

  // Handle tile click
  const handleTileClick = (tileId: string) => {
    setSelectedTile(selectedTile === tileId ? null : tileId);
  };

  // Get random emoji from array
  const getRandomEmoji = (emojiArray: string | string[]) => {
    if (typeof emojiArray === 'string') return emojiArray;
    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
  };

  // Render different tile types with variety
  const renderTileContent = (tile: GardenTile) => {
    const isSelected = selectedTile === tile.id;
    const isHovered = hoveredTile === tile.id;
    
    const baseClass = "flex flex-col items-center justify-center h-full transition-transform duration-300";
    
    switch (tile.type) {
      case 'seed':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: tile.animationDelay }}
          >
            <span className="text-lg">{plantEmojis.seed}</span>
          </motion.div>
        );
      case 'sprout':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <span className="text-xl">{plantEmojis.sprout}</span>
          </motion.div>
        );
      case 'flower':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: tile.animationDelay }}
            >
              {getRandomEmoji(plantEmojis.flower)}
            </motion.span>
          </motion.div>
        );
      case 'tree':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: tile.animationDelay, type: "spring", duration: 0.8 }}
          >
            <motion.span 
              className="text-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: tile.animationDelay }}
            >
              {getRandomEmoji(plantEmojis.tree)}
            </motion.span>
          </motion.div>
        );
      case 'bush':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <span className="text-xl">{getRandomEmoji(plantEmojis.bush)}</span>
          </motion.div>
        );
      case 'palm':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: tile.animationDelay }}
            >
              {plantEmojis.palm}
            </motion.span>
          </motion.div>
        );
      case 'cherry':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <span className="text-2xl">{plantEmojis.cherry}</span>
          </motion.div>
        );
      case 'lily':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: tile.animationDelay, type: "spring" }}
          >
            <span className="text-2xl">{plantEmojis.lily}</span>
          </motion.div>
        );
      case 'rock':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: tile.animationDelay }}
          >
            <span className="text-xl">{getRandomEmoji(plantEmojis.rock)}</span>
          </motion.div>
        );
      case 'water':
        return (
          <motion.div 
            className={baseClass}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: tile.animationDelay }}
          >
            <motion.div 
              className="text-2xl relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: tile.animationDelay }}
            >
              <span className="opacity-80">{plantEmojis.water}</span>
              <motion.div
                className="absolute inset-0 text-blue-300 opacity-30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: tile.animationDelay + 0.5 }}
              >
                💧
              </motion.div>
            </motion.div>
          </motion.div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground opacity-50">
            {isHovered && !tile.planted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg"
              >
                🌱
              </motion.span>
            )}
          </div>
        );
    }
  };

  // Render floating elements
  const renderFloatingElement = (element: FloatingElement) => {
    const emojis = {
      bird: ['🦅', '🕊️', '🐦', '🦜'],
      butterfly: ['🦋', '🦋'],
      bee: ['🐝', '🐛']
    };
    
    return (
      <motion.div
        key={element.id}
        className="absolute pointer-events-none z-30 text-xl"
        style={{ left: element.x, top: element.y }}
        animate={{ 
          x: [0, 10, -5, 0],
          y: [0, -5, 5, 0] 
        }}
        transition={{ 
          duration: 2 + Math.random(), 
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      >
        {getRandomEmoji(emojis[element.type])}
      </motion.div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative"
        style={{ 
          minHeight: '500px',
          width: '100%'
        }}
      >
        {/* Background gradient - no container box */}
        <div className="absolute inset-0 bg-gradient-radial from-green-100/30 via-blue-50/20 to-yellow-50/10 blur-3xl -z-10" />
        
        {/* Floating elements */}
        {floatingElements.map(renderFloatingElement)}
        
        {/* Isometric Grid Container */}
        <div 
          className="relative mx-auto"
          style={{ 
            width: GRID_SIZE * TILE_SIZE + 100,
            height: GRID_SIZE * TILE_SIZE / 2 + 200,
            transform: 'translateY(50px)'
          }}
        >
          {tiles.map((tile) => {
            const { x, y } = gridToIso(tile.x, tile.y);
            const isSelected = selectedTile === tile.id;
            const isHovered = hoveredTile === tile.id;
            
            return (
              <motion.div
                key={tile.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isSelected ? 'z-20' : isHovered ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: x + GRID_SIZE * TILE_SIZE / 2,
                  top: y,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                }}
                onClick={() => handleTileClick(tile.id)}
                onMouseEnter={() => setHoveredTile(tile.id)}
                onMouseLeave={() => setHoveredTile(null)}
                whileHover={{ scale: 1.1, y: -8, zIndex: 15 }}
                animate={{ 
                  scale: isSelected ? 1.2 : 1,
                  y: isSelected ? -10 : 0
                }}
                initial={{ opacity: 0, scale: 0 }}
                transition={{ 
                  delay: tile.animationDelay,
                  type: "spring",
                  damping: 15
                }}
              >
                {/* Tile Base */}
                <div 
                  className={`w-full h-full relative ${
                    isSelected ? 'shadow-xl shadow-primary/40' : 
                    isHovered ? 'shadow-lg shadow-primary/30' : 'shadow-md shadow-black/10'
                  }`}
                  style={{
                    background: tile.type === 'empty' 
                      ? 'linear-gradient(135deg, #d4b896, #c4a484)' 
                      : tile.type === 'water'
                      ? 'linear-gradient(135deg, #7dd3fc, #0ea5e9)'
                      : 'linear-gradient(135deg, #86efac, #22c55e)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  {/* Tile Content */}
                  <div className="absolute inset-0">
                    {renderTileContent(tile)}
                  </div>
                  
                  {/* Selection Ring */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 border-2 border-primary opacity-70"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.3, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Garden Stats - positioned outside container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="bg-card/95 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50 shadow-lg">
            <p className="text-sm font-caveat text-primary font-semibold">
              {tiles.filter(t => t.planted).length === 0 ? "Click tiles to explore your magical garden 🌱" : 
               tiles.filter(t => t.type === 'tree').length > 3 ? "Enchanted paradise with wildlife! 🦋🐦" :
               tiles.filter(t => t.type === 'flower').length > 5 ? "Beautiful blooming wonderland 🌸🌺" :
               "Your garden ecosystem is thriving 🌿"}
            </p>
            <p className="text-xs text-muted-foreground">
              {tiles.filter(t => t.planted).length} plants • {floatingElements.length} creatures
            </p>
          </div>
        </motion.div>

        {/* Enhanced Tile Info Tooltip */}
        {selectedTile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-4 right-4 bg-card/98 backdrop-blur border border-border/50 shadow-xl rounded-2xl p-4 max-w-xs z-40"
          >
            {(() => {
              const tile = tiles.find(t => t.id === selectedTile);
              if (!tile) return null;
              
              const descriptions = {
                empty: { title: 'Fertile Soil', desc: 'Perfect earth awaiting your next generous donation to bloom' },
                seed: { title: 'Seed of Hope', desc: 'A precious beginning, planted with love and care' },
                sprout: { title: 'Growing Promise', desc: 'Tender shoots reaching skyward, nurtured by kindness' },
                flower: { title: 'Blooming Joy', desc: 'Beautiful petals unfurled by the warmth of generosity' },
                tree: { title: 'Mighty Impact', desc: 'Strong and tall, providing shelter and inspiration' },
                bush: { title: 'Thriving Life', desc: 'Dense with leaves, buzzing with beneficial insects' },
                palm: { title: 'Tropical Paradise', desc: 'Exotic beauty swaying in the breeze of compassion' },
                cherry: { title: 'Delicate Blossoms', desc: 'Ephemeral beauty celebrating the cycle of giving' },
                lily: { title: 'Pure Elegance', desc: 'Serene water flower reflecting inner peace' },
                rock: { title: 'Foundation Stone', desc: 'Steady presence providing stability to your garden' },
                water: { title: 'Life Source', desc: 'Crystal clear waters nourishing all around it' }
              };
              
              const info = descriptions[tile.type] || descriptions.empty;
              
              return (
                <div className="space-y-3">
                  <h4 className="font-nunito font-bold text-primary text-lg">
                    {info.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.desc}
                  </p>
                  {tile.level > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        Level {tile.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Growth Stage
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IsometricGarden;