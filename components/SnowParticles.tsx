import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const SnowParticles: React.FC = () => {
  const count = 1500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    const colorPalette = [COLORS.AURORA_BLUE, COLORS.SNOW_PINK, COLORS.SOFT_PINK];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 50,
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)]
      });
    }
    return temp;
  }, []);

  const colorAttr = useMemo(() => {
    const attr = new Float32Array(count * 3);
    const colorObj = new THREE.Color();
    particles.forEach((p, i) => {
      colorObj.set(p.color);
      attr[i * 3 + 0] = colorObj.r;
      attr[i * 3 + 1] = colorObj.g;
      attr[i * 3 + 2] = colorObj.b;
    });
    return attr;
  }, [particles]);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      let { t, speed, x, z } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Update position
      particle.y -= speed * 2;
      if (particle.y < -25) particle.y = 25;

      dummy.position.set(
        x + a * 2,
        particle.y,
        z + b * 2
      );
      dummy.scale.setScalar(0.04 + s * 0.02);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    /* Fix: Using intrinsic 'instancedMesh', 'sphereGeometry', 'instancedBufferAttribute', 'meshBasicMaterial' with @ts-ignore */
    // @ts-ignore
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* @ts-ignore */}
      <sphereGeometry args={[1, 4, 4]}>
        {/* @ts-ignore */}
        <instancedBufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </sphereGeometry>
      {/* @ts-ignore */}
      <meshBasicMaterial vertexColors transparent opacity={0.5} />
    </instancedMesh>
  );
};