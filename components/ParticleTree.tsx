import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData, Wish } from '../types';
import { 
  PARTICLE_COUNT, 
  TREE_HEIGHT, 
  TREE_RADIUS, 
  SCATTER_RADIUS, 
  COLORS 
} from '../constants';

interface ParticleTreeProps {
  state: TreeMorphState;
  wishes: Wish[];
}

// Custom Star Geometry Component for the topper
const StarGeometry: React.FC<{ args: [number, number, number] }> = ({ args: [outerRadius, innerRadius, points] }) => {
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    const angle = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(i * angle) * r;
      const y = Math.sin(i * angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, [outerRadius, innerRadius, points]);

  // Fix: Using intrinsic 'shapeGeometry' with @ts-ignore
  // @ts-ignore
  return <shapeGeometry args={[shape]} />;
};

// New Cat Head Component for wishes
const CatHead: React.FC<{ color: string }> = ({ color }) => (
  // @ts-ignore
  <group>
    {/* Main Head - Slightly oval sphere */}
    {/* Fix: Using intrinsic 'mesh', 'sphereGeometry', 'meshStandardMaterial' with @ts-ignore */}
    {/* @ts-ignore */}
    <mesh scale={[1, 0.85, 0.9]}>
      {/* @ts-ignore */}
      <sphereGeometry args={[0.5, 16, 16]} />
      {/* @ts-ignore */}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={20} 
        metalness={1} 
        roughness={0.1}
      />
    </mesh>
    {/* Left Ear - Tiny Cone */}
    {/* @ts-ignore */}
    <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, 0.3]}>
      {/* @ts-ignore */}
      <coneGeometry args={[0.18, 0.4, 3]} />
      {/* @ts-ignore */}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={20}
        metalness={1}
        roughness={0.1}
      />
    </mesh>
    {/* Right Ear - Tiny Cone */}
    {/* @ts-ignore */}
    <mesh position={[0.25, 0.35, 0]} rotation={[0, 0, -0.3]}>
      {/* @ts-ignore */}
      <coneGeometry args={[0.18, 0.4, 3]} />
      {/* @ts-ignore */}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={20}
        metalness={1}
        roughness={0.1}
      />
    </mesh>
  </group>
);

export const ParticleTree: React.FC<ParticleTreeProps> = ({ state, wishes }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const starRef = useRef<THREE.Group>(null);
  
  // Strictly Blue and Pink palette for the tree
  const palette = [
    COLORS.AURORA_BLUE,
    COLORS.SNOW_PINK,
    COLORS.SOFT_PINK,
    COLORS.HOT_PINK,
    '#00d2ff', // Electric Blue
    '#ff79c6', // Deep Pink
    '#8be9fd'  // Cyan Blue
  ];

  // Create particle data
  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    const tiers = 32;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const scatterPos: [number, number, number] = [
        (Math.random() - 0.5) * SCATTER_RADIUS * 2.5,
        (Math.random() - 0.5) * SCATTER_RADIUS * 2.5,
        (Math.random() - 0.5) * SCATTER_RADIUS * 2.5
      ];

      const ratio = Math.random(); 
      const tierIndex = Math.floor(ratio * tiers);
      const tierCenterH = (tierIndex / tiers) * TREE_HEIGHT;
      const verticalSpread = 0.15;
      const h = tierCenterH + (Math.random() - 0.5) * verticalSpread;
      
      const normalizedH = h / TREE_HEIGHT;
      const baseRadius = (1.0 - normalizedH) * TREE_RADIUS;
      
      const angle = ratio * Math.PI * 48 + (Math.random() * 0.15);
      const radialNoise = (Math.random() - 0.5) * 0.3;
      const r = baseRadius * (0.8 + Math.random() * 0.45);
      
      const treePos: [number, number, number] = [
        Math.cos(angle) * (r + radialNoise),
        h - TREE_HEIGHT / 2,
        Math.sin(angle) * (r + radialNoise)
      ];

      const color = palette[Math.floor(Math.random() * palette.length)];
      
      data.push({
        scatterPos,
        treePos,
        color,
        size: 0.002 + Math.random() * 0.015, 
        rotationSpeed: Math.random() * 0.08
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorAttr = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const lerpFactor = useRef(0);

  useMemo(() => {
    const colorObj = new THREE.Color();
    particles.forEach((p, i) => {
      colorObj.set(p.color);
      colorAttr[i * 3 + 0] = colorObj.r;
      colorAttr[i * 3 + 1] = colorObj.g;
      colorAttr[i * 3 + 2] = colorObj.b;
    });
  }, [particles]);

  useFrame((stateContext, delta) => {
    if (!meshRef.current) return;

    const targetLerp = state === TreeMorphState.TREE_SHAPE ? 1 : 0;
    lerpFactor.current = THREE.MathUtils.lerp(lerpFactor.current, targetLerp, delta * 1.5);

    const time = stateContext.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const x = THREE.MathUtils.lerp(p.scatterPos[0], p.treePos[0], lerpFactor.current);
      const y = THREE.MathUtils.lerp(p.scatterPos[1], p.treePos[1], lerpFactor.current);
      const z = THREE.MathUtils.lerp(p.scatterPos[2], p.treePos[2], lerpFactor.current);

      const flicker = 0.65 + Math.sin(time * 6 + i * 0.5) * 0.45;
      
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * flicker);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (starRef.current) {
        starRef.current.position.y = (TREE_HEIGHT / 2) + 0.6;
        starRef.current.rotation.y += delta * 1.8;
        const starScale = lerpFactor.current * (1.3 + Math.sin(time * 8) * 0.3);
        starRef.current.scale.set(starScale, starScale, starScale);
    }
  });

  return (
    // @ts-ignore
    <group>
      {/* Fix: Using intrinsic 'instancedMesh', 'sphereGeometry', 'instancedBufferAttribute', 'meshStandardMaterial' with @ts-ignore */}
      {/* @ts-ignore */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        {/* @ts-ignore */}
        <sphereGeometry args={[1, 3, 3]}>
           {/* @ts-ignore */}
           <instancedBufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
        </sphereGeometry>
        {/* @ts-ignore */}
        <meshStandardMaterial 
            vertexColors
            transparent
            opacity={0.8}
            roughness={0} 
            metalness={1} 
            emissive={COLORS.WHITE} 
            emissiveIntensity={0.8} 
        />
      </instancedMesh>

      {/* Main Topper Star - Strictly Blue/Pink */}
      {/* @ts-ignore */}
      <group ref={starRef}>
        {/* @ts-ignore */}
        <mesh>
          <StarGeometry args={[1.0, 0.45, 5]} />
          {/* @ts-ignore */}
          <meshBasicMaterial color={COLORS.AURORA_BLUE} wireframe />
        </mesh>
        {/* @ts-ignore */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <StarGeometry args={[1.0, 0.45, 5]} />
          {/* @ts-ignore */}
          <meshBasicMaterial color={COLORS.SNOW_PINK} transparent opacity={0.6} />
        </mesh>
        {/* @ts-ignore */}
        <pointLight intensity={20} distance={18} color={COLORS.AURORA_BLUE} />
      </group>

      {/* Wishes as Radiant Golden Cat Heads */}
      {wishes.map((wish, i) => (
        <WishCatHead key={wish.id} index={i} lerpFactor={lerpFactor.current} />
      ))}
    </group>
  );
};

const WishCatHead: React.FC<{ index: number; lerpFactor: number }> = ({ index, lerpFactor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const color = COLORS.GOLD; // Specifically golden as requested
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const angle = time * 0.35 + index * 1.5;
    const radius = 7 + Math.sin(time * 0.3 + index) * 2.5;
    const y = Math.sin(time * 0.7 + index) * 7;
    
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.position.y = y;
    
    groupRef.current.rotation.z = time * 0.9 + index;
    groupRef.current.rotation.y = time * 0.6;
    
    const s = (0.35 + Math.sin(time * 6 + index) * 0.15) * (0.3 + lerpFactor * 0.7);
    groupRef.current.scale.setScalar(s);
  });

  return (
    // @ts-ignore
    <group ref={groupRef}>
      <CatHead color={color} />
      {/* @ts-ignore */}
      <pointLight intensity={10} distance={12} color={color} />
    </group>
  );
};