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
  type: 'empty' | 'seed' | 'sprout' | 'flower' | 'tree' | 'rock' | 'water';
  level: number;
  color: string;
  planted: boolean;
}

const IsometricGarden: React.FC<IsometricGardenProps> = ({ 
  donationCount = 0, 
  totalDonated = 0,
  className = ""
}) => {
  const [tiles, setTiles] = useState<GardenTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const GRID_SIZE = 6;
  const TILE_SIZE = 50;

  // Plant colors based on growth stage
  const plantColors = {
    seed: '#8B4513',
    sprout: '#90EE90', 
    flower: '#FF69B4',
    tree: '#228B22'
  };

  // Initialize garden grid
  useEffect(() => {
    const newTiles: GardenTile[] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const tileId = `${x}-${y}`;
        let tileType: GardenTile['type'] = 'empty';
        let level = 0;
        let planted = false;
        
        // Place some decorative elements
        if ((x === 2 && y === 1) || (x === 4 && y === 3)) {
          tileType = 'rock';
        } else if (x === 1 && y === 4) {
          tileType = 'water';
        } else {
          // Plant based on donations
          const plantIndex = y * GRID_SIZE + x;
          const plantsToShow = Math.min(donationCount + 2, GRID_SIZE * GRID_SIZE - 3); // -3 for decorative elements
          
          if (plantIndex < plantsToShow) {
            planted = true;
            const growth = Math.min((totalDonated + plantIndex * 100) / 500, 1);
            
            if (growth < 0.2) {
              tileType = 'seed';
              level = 1;
            } else if (growth < 0.5) {
              tileType = 'sprout';
              level = Math.floor(growth * 3) + 1;
            } else if (growth < 0.8) {
              tileType = 'flower';
              level = Math.floor(growth * 4) + 1;
            } else {
              tileType = 'tree';
              level = Math.floor(growth * 5) + 1;
            }
          }
        }

        newTiles.push({
          id: tileId,
          x,
          y,
          type: tileType,
          level,
          color: plantColors[tileType as keyof typeof plantColors] || '#DEB887',
          planted
        });
      }
    }
    
    setTiles(newTiles);
  }, [donationCount, totalDonated]);

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

  // Render different tile types
  const renderTileContent = (tile: GardenTile) => {
    const isSelected = selectedTile === tile.id;
    const isHovered = hoveredTile === tile.id;
    
    switch (tile.type) {
      case 'seed':
        return (
          <div className="w-2 h-2 bg-amber-700 rounded-full mx-auto mt-6" />
        );
      case 'sprout':
        return (
          <div className="flex flex-col items-center mt-4">
            <div className="w-1 h-4 bg-green-600" />
            <div className="w-3 h-1 bg-green-400 rounded-full" />
          </div>
        );
      case 'flower':
        return (
          <div className="flex flex-col items-center mt-2">
            <div className="text-lg mb-1">🌸</div>
            <div className="w-1 h-3 bg-green-600" />
          </div>
        );
      case 'tree':
        return (
          <div className="flex flex-col items-center">
            <div className="text-2xl">🌳</div>
          </div>
        );
      case 'rock':
        return (
          <div className="text-xl mt-3">🪨</div>
        );
      case 'water':
        return (
          <div className="w-8 h-8 bg-blue-300 rounded-full opacity-60 mt-2 relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground opacity-50">
            {isHovered && !tile.planted && '🌱'}
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-border/20 shadow-[var(--shadow-garden)]"
        style={{ 
          minHeight: '400px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #fef7cd 100%)'
        }}
      >
        {/* Isometric Grid Container */}
        <div 
          className="relative mx-auto"
          style={{ 
            width: GRID_SIZE * TILE_SIZE,
            height: GRID_SIZE * TILE_SIZE / 2 + 100,
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
                className={`absolute cursor-pointer transition-all duration-200 ${
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
                whileHover={{ scale: 1.1, y: -5 }}
                animate={{ 
                  scale: isSelected ? 1.15 : 1,
                  y: isSelected ? -8 : 0
                }}
              >
                {/* Tile Base */}
                <div 
                  className={`w-full h-full relative ${
                    isSelected ? 'shadow-lg shadow-primary/30' : 
                    isHovered ? 'shadow-md shadow-primary/20' : ''
                  }`}
                  style={{
                    background: tile.type === 'empty' 
                      ? 'linear-gradient(135deg, #d4b896, #c4a484)' 
                      : 'linear-gradient(135deg, #8fbc8f, #7aa87a)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  {/* Tile Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {renderTileContent(tile)}
                  </div>
                  
                  {/* Selection Ring */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 border-2 border-primary rounded-full opacity-60"
                      animate={{ scale: [1, 1.1, 1] }}
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

        {/* Garden Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-sm">
            <p className="text-sm font-caveat text-primary font-semibold">
              {tiles.filter(t => t.planted).length === 0 ? "Click tiles to explore your garden 🌱" : 
               tiles.filter(t => t.type === 'tree').length > 0 ? "Magnificent garden paradise! 🌳" :
               tiles.filter(t => t.type === 'flower').length > 0 ? "Beautiful blooms everywhere 🌸" :
               "Your garden is growing nicely 🌿"}
            </p>
            <p className="text-xs text-muted-foreground">
              {tiles.filter(t => t.planted).length} plants • Interactive Mode
            </p>
          </div>
        </motion.div>

        {/* Tile Info Tooltip */}
        {selectedTile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-lg max-w-xs"
          >
            {(() => {
              const tile = tiles.find(t => t.id === selectedTile);
              if (!tile) return null;
              
              return (
                <div className="space-y-2">
                  <h4 className="font-nunito font-semibold text-primary capitalize">
                    {tile.type === 'empty' ? 'Empty Soil' : tile.type}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {tile.type === 'empty' && 'Ready for planting with your next donation'}
                    {tile.type === 'seed' && 'A seed of hope, just planted'}
                    {tile.type === 'sprout' && 'Growing with your generosity'}
                    {tile.type === 'flower' && 'Beautiful bloom from your kindness'}
                    {tile.type === 'tree' && 'Mighty tree of lasting impact'}
                    {tile.type === 'rock' && 'Decorative stone for zen vibes'}
                    {tile.type === 'water' && 'Life-giving water feature'}
                  </p>
                  {tile.level > 0 && (
                    <p className="text-xs text-primary">Level {tile.level}</p>
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