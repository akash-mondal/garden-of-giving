import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Minimal, stable R3F background without drei dependencies
function StarsPoints() {
  const count = 1500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 60;
      arr[i3 + 1] = (Math.random() - 0.5) * 60;
      arr[i3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
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
        color={new THREE.Color('#ff69b4')}
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.15;
    const s = 1 + Math.sin(state.clock.elapsedTime) * 0.08;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial color={new THREE.Color('#ff69b4')} wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function GradientBackdrop() {
  return (
    <mesh position={[0, 0, -12]}>
      <planeGeometry args={[40, 24, 1, 1]} />
      <meshBasicMaterial color={new THREE.Color('#2a0a3a')} />
    </mesh>
  );
}

export default function AdvancedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color={new THREE.Color('#ff69b4')} />
        <pointLight position={[-5, -5, -2]} intensity={0.4} color={new THREE.Color('#9966cc')} />

        <GradientBackdrop />
        <StarsPoints />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
