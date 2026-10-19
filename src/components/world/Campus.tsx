import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Grid } from '@react-three/drei';

export const Campus = () => {
  return (
    <>
      {/* Technical Grid Floor */}
      <Grid
        args={[100, 100]}
        sectionColor="#00f2ff"
        sectionThickness={1}
        cellColor="#222"
        cellThickness={1}
        fadeDistance={30}
        fadeStrength={2}
      />

      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
        </mesh>
      </RigidBody>

      {/* Futuristic Pillars for Spatial Depth */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 30;
        return (
          <RigidBody key={i} type="fixed" position={[Math.cos(angle) * dist, 5, Math.sin(angle) * dist]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.5, 10, 6]} />
              <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
              {/* Glowing strip on the pillar */}
              <mesh position={[0, 0, 0.51]}>
                <boxGeometry args={[0.1, 4, 0.1]} />
                <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
              </mesh>
            </mesh>
          </RigidBody>
        );
      })}

      {/* Boundaries as Glowing Walls */}
      <RigidBody type="fixed" position={[0, 2, -50]}>
        <mesh castShadow>
          <boxGeometry args={[100, 4, 1]} />
          <meshStandardMaterial color="#111" emissive="#00f2ff" emissiveIntensity={0.1} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 2, 50]}>
        <mesh castShadow>
          <boxGeometry args={[100, 4, 1]} />
          <meshStandardMaterial color="#111" emissive="#00f2ff" emissiveIntensity={0.1} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-50, 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 4, 100]} />
          <meshStandardMaterial color="#111" emissive="#00f2ff" emissiveIntensity={0.1} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[50, 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 4, 100]} />
          <meshStandardMaterial color="#111" emissive="#00f2ff" emissiveIntensity={0.1} />
        </mesh>
      </RigidBody>
    </>
  );
};
