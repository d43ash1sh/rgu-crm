import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/* A slow-spinning torus knot with Gamusa-inspired red accent wireframe — same style as CareerHub ThreeScene but positioned center-left for the home hero */
function HomeShape() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[-2, 0.5, 0]}>
        <torusKnotGeometry args={[2.5, 0.7, 128, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.08}
          metalness={0.3}
        />
        {/* Gamusa subtle red accent wireframe */}
        <mesh wireframe>
          <torusKnotGeometry args={[2.52, 0.7, 64, 16]} />
          <meshBasicMaterial color="#ba1a1a" transparent opacity={0.12} />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function ThreeHome() {
  return (
    <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none opacity-50 overflow-hidden hidden md:block">
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#2563eb" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#ba1a1a" />
        <HomeShape />
      </Canvas>
    </div>
  );
}
