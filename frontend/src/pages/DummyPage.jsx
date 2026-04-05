import { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function FluidCore() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#2563eb" 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.5} 
          roughness={0.1} 
          distort={0.4} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}

export default function DummyPage({ title, badge }) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-7xl mx-auto w-full z-10 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>
        
        {/* 3D Visual Block */}
        <div className="w-full max-w-[400px] h-[300px] md:h-[400px] relative mb-4">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
          <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="relative z-10">
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={4} color="#ba1a1a" />
            <FluidCore />
          </Canvas>
        </div>

        {/* Text Content */}
        <div className="text-center max-w-2xl relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {badge && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
                {badge}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-light mb-10 leading-relaxed">
              This module is currently in active engineering. We're forging the infrastructure to bring you a premium experience soon.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl inline-flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-slate-400 absolute animate-spin" style={{ animationDuration: '4s' }}>settings</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-lg">System Initialization</p>
              <p className="text-sm text-slate-500">Deploying backend pathways...</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
