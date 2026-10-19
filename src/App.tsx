import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, ContactShadows } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { World } from './components/world/World';
import { HUD } from './components/ui/HUD';
import { QuickPortfolio } from './components/ui/QuickPortfolio';

export default function App() {
  const [showQuick, setShowQuick] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      {!introFinished && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#00f2ff',
          fontFamily: 'monospace',
          textAlign: 'center',
          transition: 'opacity 1s ease'
        }}>
          <h1 style={{ fontSize: '4rem', margin: 0, textTransform: 'uppercase', letterSpacing: '10px', fontWeight: 'bold' }}>
            CYBER OPS
          </h1>
          <p style={{ fontSize: '1.5rem', margin: '1rem 0 2rem 0', color: '#fff', opacity: 0.8 }}>
            MOHAMMED EL-AOUNI | Cybersecurity Engineering
          </p>
          <button
            onClick={() => setIntroFinished(true)}
            style={{
              background: 'none',
              border: '2px solid #00f2ff',
              color: '#00f2ff',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00f2ff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#00f2ff';
            }}
          >
            Enter the World
          </button>
          <button
            onClick={() => setShowQuick(true)}
            style={{
              marginTop: '1rem',
              background: 'none',
              border: 'none',
              color: '#fff',
              opacity: 0.6,
              cursor: 'pointer',
              fontFamily: 'monospace',
              textDecoration: 'underline'
            }}
          >
            Quick Portfolio Mode
          </button>
        </div>
      )}

      {showQuick && <QuickPortfolio onClose={() => setShowQuick(false)} />}

      <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
        <color attach="background" args={['#050505']} />

        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="city" />

          <Physics debug={false}>
            <World />
          </Physics>

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={50}
            blur={2}
            far={10}
            resolution={256}
            color="#000000"
          />
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>

      <HUD />
    </div>
  );
}
