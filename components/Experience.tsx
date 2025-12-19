import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette, Scanline } from '@react-three/postprocessing';
import { ParticleTree } from './ParticleTree';
import { SnowParticles } from './SnowParticles';
import { TreeMorphState, Wish } from '../types';

interface ExperienceProps {
  state: TreeMorphState;
  wishes: Wish[];
}

export const Experience: React.FC<ExperienceProps> = ({ state, wishes }) => {
  return (
    <>
      {/* Fix: Using intrinsic 'color' for background with @ts-ignore */}
      {/* @ts-ignore */}
      <color attach="background" args={['#000205']} />
      {/* Fix: Using intrinsic 'ambientLight' with @ts-ignore */}
      {/* @ts-ignore */}
      <ambientLight intensity={0.05} />
      
      {/* High-contrast rim lighting */}
      {/* Fix: Using intrinsic 'pointLight' with @ts-ignore */}
      {/* @ts-ignore */}
      <pointLight position={[0, 8, 0]} intensity={3} color="#ffffff" distance={25} />
      {/* @ts-ignore */}
      <pointLight position={[15, -2, 10]} intensity={2} color="#00f2ff" />
      {/* @ts-ignore */}
      <pointLight position={[-15, -2, -10]} intensity={1.5} color="#ffb7c5" />
      
      <ParticleTree state={state} wishes={wishes} />
      <SnowParticles />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.15} 
          mipmapBlur 
          intensity={3.0} // Increased intensity for that shimmering glow
          radius={0.7} 
        />
        <Scanline opacity={0.015} density={1.2} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.05} darkness={1.3} />
      </EffectComposer>
    </>
  );
};