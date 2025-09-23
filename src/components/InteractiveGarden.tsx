import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas as FabricCanvas, Circle, Path, Point } from 'fabric';

interface InteractiveGardenProps {
  donationCount?: number;
  totalDonated?: number;
  className?: string;
}

interface Flower {
  x: number;
  y: number;
  size: number;
  color: string;
  bloomStage: number;
  petals: number;
  stemHeight: number;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const InteractiveGarden: React.FC<InteractiveGardenProps> = ({ 
  donationCount = 0, 
  totalDonated = 0,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Calculate garden growth
  const maxFlowers = Math.min(Math.floor(donationCount * 1.5), 12);
  const gardenMaturity = Math.min(totalDonated / 5000, 1);

  const flowerColors = [
    '#FF69B4', // Hot pink
    '#FF1493', // Deep pink  
    '#FFB6C1', // Light pink
    '#FF6347', // Coral
    '#DDA0DD', // Plum
    '#98FB98', // Pale green
    '#87CEEB', // Sky blue
    '#DDA0DD', // Plum
  ];

  // Generate flowers based on donations
  useEffect(() => {
    const newFlowers: Flower[] = [];
    for (let i = 0; i < maxFlowers; i++) {
      const angle = (i / maxFlowers) * Math.PI * 2;
      const radius = 60 + Math.random() * 80;
      const centerX = 200;
      const centerY = 150;
      
      newFlowers.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        size: 8 + Math.random() * 12,
        color: flowerColors[i % flowerColors.length],
        bloomStage: Math.min(i / Math.max(donationCount, 1), 1),
        petals: 5 + Math.floor(Math.random() * 3),
        stemHeight: 20 + Math.random() * 15,
        angle: Math.random() * Math.PI * 2
      });
    }
    setFlowers(newFlowers);
  }, [donationCount, maxFlowers]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 300,
      backgroundColor: 'transparent',
      selection: false,
      hoverCursor: 'default',
      moveCursor: 'default'
    });

    fabricCanvas.renderOnAddRemove = false;
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvas) return;

    const animate = (timestamp: number) => {
      // Clear canvas
      canvas.clear();
      
      // Draw sky gradient background
      const ctx = canvas.getContext();
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)'); // Sky blue
      gradient.addColorStop(0.7, 'rgba(144, 238, 144, 0.2)'); // Light green
      gradient.addColorStop(1, 'rgba(34, 139, 34, 0.1)'); // Forest green
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);

      // Draw ground
      const groundGradient = ctx.createLinearGradient(0, 250, 0, 300);
      groundGradient.addColorStop(0, 'rgba(139, 69, 19, 0.2)');
      groundGradient.addColorStop(1, 'rgba(101, 67, 33, 0.3)');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, 250, 400, 50);

      // Draw flowers
      flowers.forEach((flower, index) => {
        const time = timestamp * 0.001;
        const sway = Math.sin(time + index) * 2;
        const growth = Math.min(flower.bloomStage * 2, 1);
        
        if (growth > 0) {
          // Draw stem
          ctx.strokeStyle = 'rgba(34, 139, 34, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(flower.x, flower.y + flower.stemHeight);
          ctx.lineTo(flower.x + sway, flower.y + flower.stemHeight - flower.stemHeight * growth);
          ctx.stroke();

          // Draw flower center
          const flowerX = flower.x + sway;
          const flowerY = flower.y + flower.stemHeight - flower.stemHeight * growth;
          
          // Petals
          ctx.fillStyle = flower.color;
          for (let p = 0; p < flower.petals; p++) {
            const petalAngle = (p / flower.petals) * Math.PI * 2 + flower.angle;
            const petalX = flowerX + Math.cos(petalAngle) * flower.size * growth;
            const petalY = flowerY + Math.sin(petalAngle) * flower.size * growth * 0.6;
            
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, flower.size * 0.3 * growth, flower.size * 0.6 * growth, petalAngle, 0, Math.PI * 2);
            ctx.fill();
          }

          // Flower center
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(flowerX, flowerY, flower.size * 0.3 * growth, 0, Math.PI * 2);
          ctx.fill();

          // Glow effect when hovered
          if (isHovered) {
            const distance = Math.sqrt((mousePos.x - flowerX) ** 2 + (mousePos.y - flowerY) ** 2);
            if (distance < 50) {
              ctx.shadowColor = flower.color;
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(flowerX, flowerY, flower.size * 0.4 * growth, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      });

      // Update and draw particles
      if (isHovered) {
        // Add new particles near mouse
        if (Math.random() < 0.3) {
          particles.push({
            x: mousePos.x + (Math.random() - 0.5) * 20,
            y: mousePos.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 60,
            maxLife: 60,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            size: 2 + Math.random() * 3
          });
        }
      }

      // Update particles
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
      );

      // Draw particles
      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw magical sparkles based on donation amount
      const sparkleCount = Math.floor(gardenMaturity * 10);
      for (let i = 0; i < sparkleCount; i++) {
        const sparkleTime = timestamp * 0.003 + i;
        const sparkleX = 50 + (i * 37) % 300;
        const sparkleY = 50 + Math.sin(sparkleTime) * 30 + (i * 23) % 100;
        const sparkleAlpha = (Math.sin(sparkleTime * 2) + 1) * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      canvas.renderAll();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvas, flowers, particles, mousePos, isHovered, gardenMaturity]);

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas 
          ref={canvasRef}
          className="rounded-3xl shadow-[var(--shadow-garden)] border border-border/20 cursor-none bg-gradient-to-b from-sky-50/30 to-green-50/30"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Growth indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-sm">
            <p className="text-sm font-caveat text-primary font-semibold">
              {maxFlowers === 0 ? "Plant your first seed!" : 
               maxFlowers < 3 ? "Your garden is sprouting 🌱" :
               maxFlowers < 6 ? "Beautiful blooms emerging 🌸" :
               maxFlowers < 9 ? "Garden flourishing 🌺" :
               "Paradise garden achieved! 🌷"}
            </p>
            <p className="text-xs text-muted-foreground">
              {maxFlowers} flowers • {Math.round(gardenMaturity * 100)}% mature
            </p>
          </div>
        </motion.div>

        {/* Hover instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0 : 0.7 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <p className="text-sm font-caveat text-muted-foreground">
              Hover to bring magic to your garden ✨
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveGarden;