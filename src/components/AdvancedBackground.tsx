import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Subtle floating particles with gentle movement
function SubtleParticles() {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      
      // Gentle floating animation
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.01) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff69b4"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Interactive sphere that responds to mouse
function InteractiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
      
      // Mouse interaction - subtle movement towards cursor
      const targetX = (mouse.x * viewport.width) / 8;
      const targetY = (mouse.y * viewport.height) / 8;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.02);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.02);
      
      // Subtle pulsing based on mouse distance
      const mouseDistance = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 + (1 - mouseDistance) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial 
        color="#ff69b4"
        wireframe
        transparent
        opacity={0.4}
        emissive="#ff1493"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Cursor-following light effect
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * 5;
      lightRef.current.position.y = mouse.y * 5;
      lightRef.current.position.z = 3;
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      intensity={0.8}
      color="#ff69b4"
      distance={8}
    />
  );
}

// Gentle ambient particles in background
function AmbientDust() {
  const count = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(state.clock.elapsedTime * 0.1 + i * 0.001) * 0.001;
        pos[i + 2] += Math.cos(state.clock.elapsedTime * 0.15 + i * 0.002) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9966cc"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.3}
      />
    </points>
  );
}

export default function AdvancedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          color="#ff69b4" 
        />
        
        <AmbientDust />
        <SubtleParticles />
        <InteractiveSphere />
        <CursorLight />
      </Canvas>
    </div>
  );
}
