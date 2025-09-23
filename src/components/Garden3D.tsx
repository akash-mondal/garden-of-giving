import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Text } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';

interface FloatingIslandProps {
  donationCount?: number;
  totalDonated?: number;
}

const FloatingIsland: React.FC<FloatingIslandProps> = ({ 
  donationCount = 0, 
  totalDonated = 0 
}) => {
  const islandRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += 0.005;
      islandRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Calculate growth based on donations
  const treeSize = Math.min(0.3 + (totalDonated / 10000) * 0.7, 1.0);
  const flowerCount = Math.min(Math.floor(donationCount / 2), 8);

  return (
    <group>
      {/* Floating Island Base */}
      <mesh ref={islandRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 0.4, 32]} />
        <meshStandardMaterial color="#8FBC8F" />
      </mesh>

      {/* Central Tree/Sapling */}
      <group position={[0, 0, 0]}>
        {/* Tree trunk */}
        <mesh position={[0, 0.2, 0]} scale={[0.1, treeSize, 0.1]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Tree crown */}
        <mesh position={[0, 0.4 + treeSize * 0.3, 0]} scale={treeSize}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Glowing core */}
        <Sphere args={[0.1]} position={[0, 0.4 + treeSize * 0.3, 0]}>
          <meshBasicMaterial color="#FF69B4" transparent opacity={0.8} />
        </Sphere>
      </group>

      {/* Surrounding Flowers */}
      {Array.from({ length: flowerCount }).map((_, i) => {
        const angle = (i / flowerCount) * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={i} position={[x, -0.2, z]}>
            {/* Flower stem */}
            <mesh scale={[0.02, 0.3, 0.02]}>
              <cylinderGeometry args={[1, 1, 1, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            
            {/* Flower bloom */}
            <mesh position={[0, 0.2, 0]} scale={0.1 + Math.random() * 0.1}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial 
                color={['#FF69B4', '#FADADD', '#E0F5F2'][i % 3]} 
                emissive={['#FF69B4', '#FADADD', '#E0F5F2'][i % 3]}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ambient magical particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Sphere 
          key={`particle-${i}`}
          args={[0.02]} 
          position={[
            (Math.random() - 0.5) * 3,
            Math.random() * 2,
            (Math.random() - 0.5) * 3
          ]}
        >
          <meshBasicMaterial 
            color="#FF69B4" 
            transparent 
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
};

interface Garden3DProps {
  donationCount?: number;
  totalDonated?: number;
  className?: string;
}

const Garden3D: React.FC<Garden3DProps> = ({ 
  donationCount = 0, 
  totalDonated = 0,
  className = ""
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF69B4" />
        
        <FloatingIsland 
          donationCount={donationCount} 
          totalDonated={totalDonated} 
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Garden3D;