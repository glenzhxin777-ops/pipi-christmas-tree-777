import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Experience } from './components/Experience';
import { OverlayUI } from './components/OverlayUI';
import { TreeMorphState, Wish } from './types';
import { AUDIO_URL } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const toggleState = useCallback(() => {
    setState(prev => 
      prev === TreeMorphState.SCATTERED ? TreeMorphState.TREE_SHAPE : TreeMorphState.SCATTERED
    );
    if (!audioStarted) {
        setAudioStarted(true);
    }
  }, [audioStarted]);

  const addWish = useCallback((text: string) => {
    const newWish: Wish = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      timestamp: Date.now()
    };
    setWishes(prev => [newWish, ...prev]);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden">
      {/* Background Music Handler */}
      {audioStarted && (
        <audio 
          src={AUDIO_URL} 
          autoPlay 
          loop 
          muted={isMuted}
          className="hidden"
        />
      )}

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]}>
        {/* Camera moved further away: z increased to 35 */}
        <PerspectiveCamera makeDefault position={[0, 8, 35]} fov={45} />
        <OrbitControls 
            enablePan={false} 
            maxDistance={60} 
            minDistance={5}
            autoRotate={state === TreeMorphState.TREE_SHAPE}
            autoRotateSpeed={0.5}
        />
        
        <Suspense fallback={null}>
          <Experience state={state} wishes={wishes} />
          <Environment preset="night" />
        </Suspense>

        {/* Fix: Adding fog using the intrinsic element 'fog' with @ts-ignore to handle environment type missing */}
        {/* @ts-ignore */}
        <fog attach="fog" args={['#020617', 20, 60]} />
      </Canvas>

      {/* UI Layers */}
      <OverlayUI 
        state={state} 
        onToggle={toggleState} 
        onAddWish={addWish}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      {/* Loading Screen Overlay (Implicitly handled by Suspense but nice to have custom) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 transition-opacity duration-1000 delay-500">
        <p className="text-white/20 font-light tracking-widest uppercase">Loading Signature Experience</p>
      </div>
    </div>
  );
};

export default App;