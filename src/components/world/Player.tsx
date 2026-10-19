import React, { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export const Player = () => {
  const rb = useRef<any>(null);
  const setLocation = useGameStore((state) => state.setLocation);

  // Movement constants
  const MOVE_SPEED = 10;
  const TURN_SPEED = 2.5;

  // Keyboard state
  const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.w = true;
      if (e.key.toLowerCase() === 'a') keys.a = true;
      if (e.key.toLowerCase() === 's') keys.s = true;
      if (e.key.toLowerCase() === 'd') keys.d = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.w = false;
      if (e.key.toLowerCase() === 'a') keys.a = false;
      if (e.key.toLowerCase() === 's') keys.s = false;
      if (e.key.toLowerCase() === 'd') keys.d = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!rb.current) return;

    const impulse = { x: 0, y: 0, z: 0 };
    const rotation = { x: 0, y: 0, z: 0 };

    // Get current rotation of the player to calculate movement direction
    const currentRotation = new THREE.Euler().setFromQuaternion(rb.current.rotation());

    if (keys.w) {
      impulse.x += Math.sin(currentRotation.y) * MOVE_SPEED * delta;
      impulse.z += Math.cos(currentRotation.y) * MOVE_SPEED * delta;
    }
    if (keys.s) {
      impulse.x -= Math.sin(currentRotation.y) * MOVE_SPEED * delta;
      impulse.z -= Math.cos(currentRotation.y) * MOVE_SPEED * delta;
    }
    if (keys.a) {
      rotation.y += TURN_SPEED * delta;
    }
    if (keys.d) {
      rotation.y -= TURN_SPEED * delta;
    }

    rb.current.applyImpulse(impulse, true);

    // Simple rotation update for the physics body
    const currentQuat = rb.current.rotation();
    const newQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, currentQuat.getEuler().y + rotation.y, 0));
    rb.current.setRotation(newQuat, true);

    // Update camera to follow player
    const playerPos = rb.current.translation();
    const cameraOffset = new THREE.Vector3(0, 10, -20).applyQuaternion(newQuat);
    state.camera.position.lerp(new THREE.Vector3(playerPos.x + cameraOffset.x, playerPos.y + cameraOffset.y, playerPos.z + cameraOffset.z), 0.1);
    state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
  });

  return (
    <RigidBody
      ref={rb}
      colliders="cuboid"
      enabledRotations={[false, true, false]}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <boxGeometry args={[1, 1, 2]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.5} />
      </mesh>
    </RigidBody>
  );
};
