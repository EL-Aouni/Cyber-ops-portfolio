import React from 'react';
import { PROJECTS } from '../../constants/projects';
import { useGameStore } from '../../store/gameStore';

export const HUD = () => {
  const location = useGameStore((state) => state.location);
  const xp = useGameStore((state) => state.xp);
  const activeProjectId = useGameStore((state) => state.activeProject);
  const setActiveProject = useGameStore((state) => state.setActiveProject);

  const activeProject = activeProjectId ? PROJECTS[activeProjectId as keyof typeof PROJECTS] : null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      color: '#00f2ff',
      fontFamily: 'monospace',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 10
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Cyber Ops <span style={{ color: '#fff' }}>| Portfolio</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
            Status: <span style={{ color: '#fff' }}>ACTIVE</span> | System: <span style={{ color: '#fff' }}>ONLINE</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>OPERATOR XP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{xp}</div>
        </div>
      </div>

      {/* Project Modal */}
      {activeProject && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          maxHeight: '80vh',
          backgroundColor: 'rgba(5, 5, 5, 0.95)',
          border: '2px solid #00f2ff',
          padding: '2rem',
          borderRadius: '8px',
          pointerEvents: 'auto',
          overflowY: 'auto',
          boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{activeProject.title}</h2>
            <button
              onClick={() => setActiveProject(null)}
              style={{
                background: 'none',
                border: '1px solid #00f2ff',
                color: '#00f2ff',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                fontFamily: 'monospace'
              }}
            >
              CLOSE [X]
            </button>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '1.5rem', lineHeight: '1.6' }}>{activeProject.summary}</p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#00f2ff', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Problem</h3>
            <p style={{ color: '#ddd', lineHeight: '1.6' }}>{activeProject.problem}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#00f2ff', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Implementation</h3>
            <p style={{ color: '#ddd', lineHeight: '1.6' }}>{activeProject.implementation}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#00f2ff', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tech Stack</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeProject.tech.map(t => (
                <span key={t} style={{
                  background: 'rgba(0, 242, 255, 0.1)',
                  border: '1px solid #00f2ff',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8rem',
                  color: '#fff'
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a
              href={activeProject.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#00f2ff',
                color: '#000',
                padding: '0.8rem 2rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}
            >
              VIEW REPOSITORY
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          Controls:<br />
          WASD - Move<br />
          Arrows - Rotate<br />
          ESC - Menu
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
            // Mohammed El-Aouni <br />
            // Cybersecurity Engineering
          </p>
        </div>
      </div>
    </div>
  );
};
