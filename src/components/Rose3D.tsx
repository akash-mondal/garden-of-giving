import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';

const RoseModel = () => {
  const roseRef = useRef<THREE.Group>(null);
  
  // Load the 3D rose model
  const obj = useLoader(OBJLoader, 'https://happy358.github.io/Images/Model/red_rose3.obj');
  
  // Auto-rotate the rose
  useFrame((state, delta) => {
    if (roseRef.current) {
      roseRef.current.rotation.y += delta * 0.3;
    }
  });

  // Clone and configure materials for different parts
  const configureMaterials = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const baseMaterial = new THREE.MeshStandardMaterial({
          metalness: 0,
          roughness: 0.8,
          side: THREE.DoubleSide
        });

        if (child.name === 'rose') {
          child.material = baseMaterial.clone();
          (child.material as THREE.MeshStandardMaterial).color.set('crimson');
        } else if (child.name === 'calyx') {
          child.material = baseMaterial.clone();
          (child.material as THREE.MeshStandardMaterial).color.set('#001a14');
        } else if (child.name === 'leaf1' || child.name === 'leaf2') {
          child.material = baseMaterial.clone();
          (child.material as THREE.MeshStandardMaterial).color.set('#00331b');
        } else {
          child.material = baseMaterial.clone();
          (child.material as THREE.MeshStandardMaterial).color.set('crimson');
        }
      }
    });
  };

  // Configure materials when model loads
  if (obj) {
    configureMaterials(obj);
  }

  return (
    <group ref={roseRef} rotation={[0, Math.PI / 1.7, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={obj} />
    </group>
  );
};

interface Rose3DProps {
  className?: string;
}

const Rose3D = ({ className }: Rose3DProps) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ 
          position: [0, 150, 250], 
          fov: 33,
          near: 1,
          far: 2000
        }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} color="white" />
        <pointLight 
          intensity={0.5} 
          color="white" 
          position={[0, 150, 250]} 
          castShadow 
        />

        {/* 3D Rose Model */}
        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[20, 16, 16]} />
            <meshStandardMaterial color="crimson" transparent opacity={0.3} />
          </mesh>
        }>
          <RoseModel />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={2}
          enableDamping={true}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
};

export default Rose3D;