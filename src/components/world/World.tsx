import React, { Suspense } from 'react';
import { Float, Text, PerspectiveCamera } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS } from '../../constants/projects';
import { Player } from './Player';
import { Campus } from './Campus';

const LocationMarker = ({ location }: { location: typeof WORLD_LOCATIONS[0] }) => {
  const activeProject = useGameStore((state) => state.activeProject);
  const isActive = activeProject === location.id;
  const setActiveProject = useGameStore((state) => state.setActiveProject);

  return (
    <group
      position={location.position as [number, number, number]}
      onClick={(e) => {
        e.stopPropagation();
        setActiveProject(isActive ? null : location.id);
      }}
    >
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color={isActive ? location.color : "#333"}
            emissive={isActive ? location.color : "#000000"}
            emissiveIntensity={isActive ? 0.5 : 0}
          />
        </mesh>
      </Float>
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {location.title}
      </Text>
    </group>
  );
};

export const World = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={50} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={1} color="#00f2ff" />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

      <Campus />

      <Suspense fallback={null}>
        {WORLD_LOCATIONS.map((loc) => (
          <LocationMarker key={loc.id} location={loc} />
        ))}
      </Suspense>

      <Player />
    </>
  );
};
