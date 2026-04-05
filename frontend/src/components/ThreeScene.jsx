import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function AbstractShape() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[2, 0, 0]}>
        <torusKnotGeometry args={[2, 0.6, 128, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.1} 
          metalness={0.2}
        />
        {/* Gamusa subtle red accent wireframe */}
        <mesh wireframe>
          <torusKnotGeometry args={[2.02, 0.6, 64, 16]} />
          <meshBasicMaterial color="#ba1a1a" transparent opacity={0.15} />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute top-0 right-0 w-full h-[700px] z-0 pointer-events-none opacity-60 overflow-hidden hidden md:block">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#2563eb" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ba1a1a" />
        <AbstractShape />
      </Canvas>
    </div>
  );
}
