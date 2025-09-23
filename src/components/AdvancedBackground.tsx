import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced particle galaxy system
function GalaxyPoints() {
  const count = 3000;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create spiral galaxy pattern
      const angle = Math.random() * Math.PI * 4;
      const radius = Math.random() * 15 + 2;
      const spiralOffset = angle * 0.2;
      
      pos[i3] = Math.cos(angle + spiralOffset) * radius + (Math.random() - 0.5) * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * 4;
      pos[i3 + 2] = Math.sin(angle + spiralOffset) * radius + (Math.random() - 0.5) * 2;
      
      // Color variation based on distance from center
      const distanceFromCenter = Math.sqrt(pos[i3] ** 2 + pos[i3 + 2] ** 2);
      const hue = (distanceFromCenter / 15) * 0.3 + 0.8; // Pink to purple gradient
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }
    
    return [pos, col];
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
      
      // Animate individual particles
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(state.clock.elapsedTime + i * 0.01) * 0.005;
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
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

// Multiple animated geometric shapes
function AnimatedGeometry() {
  const centerSphereRef = useRef<THREE.Mesh>(null);
  const orbitingSpheres = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Center pulsing sphere
    if (centerSphereRef.current) {
      centerSphereRef.current.rotation.x += delta * 0.3;
      centerSphereRef.current.rotation.y += delta * 0.2;
      const scale = 1 + Math.sin(time * 2) * 0.15;
      centerSphereRef.current.scale.setScalar(scale);
    }
    
    // Orbiting spheres
    if (orbitingSpheres.current) {
      orbitingSpheres.current.rotation.y += delta * 0.5;
      orbitingSpheres.current.children.forEach((child, i) => {
        child.rotation.x += delta * (1 + i * 0.1);
        child.rotation.z += delta * 0.5;
      });
    }
  });

  return (
    <group>
      {/* Center main shape */}
      <mesh ref={centerSphereRef} position={[0, 0, -2]}>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color={new THREE.Color('#ff1493')} 
          wireframe 
          transparent 
          opacity={0.4}
          emissive={new THREE.Color('#330033')}
        />
      </mesh>
      
      {/* Orbiting shapes */}
      <group ref={orbitingSpheres}>
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh key={i} position={[x, 0, z]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(0.8 + i * 0.1, 0.7, 0.6)}
                transparent
                opacity={0.7}
                emissive={new THREE.Color().setHSL(0.8 + i * 0.1, 0.3, 0.1)}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// Floating energy rings
function EnergyRings() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x += delta * (0.2 + i * 0.1);
        ring.rotation.z += delta * (0.1 + i * 0.05);
        
        // Pulsing effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
        ring.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[0, 0, -8 - i * 2]}>
          <torusGeometry args={[3 + i * 0.5, 0.05, 16, 100]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.8 + i * 0.05, 0.8, 0.5)}
            transparent
            opacity={0.6}
            emissive={new THREE.Color().setHSL(0.8 + i * 0.05, 0.4, 0.2)}
          />
        </mesh>
      ))}
    </group>
  );
}

// Interactive mouse-following light
function InteractiveLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * 10;
      lightRef.current.position.y = mouse.y * 10;
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[0, 0, 5]} 
      intensity={2}
      color={new THREE.Color('#ff69b4')}
      distance={20}
    />
  );
}

// Dynamic background mesh
function DynamicBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.3 + time) * 0.5 + Math.cos(y * 0.2 + time) * 0.3;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]} rotation={[0, 0, Math.PI / 4]}>
      <planeGeometry args={[60, 60, 32, 32]} />
      <meshStandardMaterial 
        color={new THREE.Color('#1a0a2e')}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export default function AdvancedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 65 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        {/* Atmospheric fog */}
        <fog attach="fog" args={[new THREE.Color('#0f0420'), 12, 35]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} color={new THREE.Color('#4a1a4a')} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          color={new THREE.Color('#ff69b4')} 
          castShadow
        />
        <pointLight 
          position={[-8, 4, 3]} 
          intensity={0.8} 
          color={new THREE.Color('#9966cc')}
          distance={25}
        />
        <spotLight
          position={[0, 10, 0]}
          angle={Math.PI / 3}
          penumbra={0.5}
          intensity={0.5}
          color={new THREE.Color('#ff1493')}
          castShadow
        />

        <DynamicBackground />
        <GalaxyPoints />
        <AnimatedGeometry />
        <EnergyRings />
        <InteractiveLight />
      </Canvas>
    </div>
  );
}
