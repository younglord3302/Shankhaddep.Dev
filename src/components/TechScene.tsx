"use client";

import { useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  useAnimations, 
  ContactShadows, 
  Environment, 
  Center,
  Html
} from "@react-three/drei";
import * as THREE from "three";

// The famous LittlestTokyo model URL (Githack for clean CORS and Draco support)
const MODEL_URL = "https://raw.githack.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb";

function Model() {
  // Load model with Draco support automatically provided by useGLTF
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    // Play the first animation (which includes everything in LittlestTokyo)
    const animation = actions[names[0]];
    if (animation) {
      animation.play();
    }
    
    // Aesthetic: Make materials look more premium like the example
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [actions, names, scene]);

  return <primitive object={scene} scale={0.015} />;
}



export default function TechScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900/10 rounded-3xl animate-pulse">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ 
          antialias: false, // Disabling antialias for performance boost
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: false,
        }}
      >
        <PerspectiveCamera makeDefault position={[8, 7, 8]} fov={45} />
        
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[512, 512]} // Lower shadow map resolution
        />
        <directionalLight position={[-10, 10, 5]} intensity={0.5} />

        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-primary-500 font-mono text-xs uppercase tracking-widest whitespace-nowrap">
                Initializing Diorama
              </div>
            </div>
          </Html>
        }>
          <Environment preset="city" />
          <Center bottom>
            <Model />
          </Center>
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2.5} 
            far={4} 
            resolution={256} // Lower resolution for contact shadows
          />
        </Suspense>

        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5}
          enableZoom={true} 
          enablePan={false} // Disable panning for smoother interaction
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={5}
          maxDistance={25}
          makeDefault
        />
      </Canvas>
    </div>
  );
}

