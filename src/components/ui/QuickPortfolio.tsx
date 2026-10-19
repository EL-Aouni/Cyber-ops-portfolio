import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { PROJECTS } from '../../constants/projects';

export const QuickPortfolio = ({ onClose }: { onClose: () => void }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050505',
      color: '#fff',
      fontFamily: 'monospace',
      zIndex: 100,
      overflowY: 'auto',
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'none',
          border: '1px solid #00f2ff',
          color: '#00f2ff',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          zIndex: 110
        }}
      >
        RETURN TO 3D WORLD [X]
      </button>

      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase', letterSpacing: '4px' }}>
          Mohammed <span style={{ color: '#00f2ff' }}>El-Aouni</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Cybersecurity Engineering | SOC & SIEM | Threat Intelligence</p>
      </header>

      <section style={{ maxWidth: '800px', width: '100%', marginBottom: '4rem' }}>
        <h2 style={{ color: '#00f2ff', borderBottom: '1px solid #00f2ff', paddingBottom: '0.5rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          Featured Projects
        </h2>
        <div style={{ display: 'grid', gap: '2rem' }}>
          {Object.values(PROJECTS).map(project => (
            <div key={project.id} style={{
              border: '1px solid #333',
              padding: '1.5rem',
              borderRadius: '4px',
              transition: 'border-color 0.3s',
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f2ff'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{project.title}</h3>
              <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '1rem' }}>{project.summary}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {project.tech.map(t => (
                  <span key={t} style={{ fontSize: '0.7rem', color: '#00f2ff', border: '1px solid #00f2ff', padding: '0.1rem 0.4rem' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '800px', width: '100%', marginBottom: '4rem' }}>
        <h2 style={{ color: '#00f2ff', borderBottom: '1px solid #00f2ff', paddingBottom: '0.5rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          Technical Arsenal
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Security Ops</h4>
            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>• SIEM Correlation (Splunk)</li>
              <li>• SOC Automation (Python)</li>
              <li>• Threat Hunting (MISP)</li>
              <li>• Log Analysis (Wazuh)</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Offensive Sec</h4>
            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>• Recon Frameworks (Python)</li>
              <li>• AD Exploitation</li>
              <li>• Network Pentesting</li>
              <li>• Vulnerability Analysis</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Infrastructure</h4>
            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>• Windows Server / AD</li>
              <li>• Linux Hardening</li>
              <li>• Docker & Virtualization</li>
              <li>• Network Architecture</li>
            </ul>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <a href="https://github.com/EL-Aouni" target="_blank" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '0.5rem 1rem' }}>GITHUB</a>
          <a href="https://www.linkedin.com/in/el-aouni-mohammed-662469318/" target="_blank" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '0.5rem 1rem' }}>LINKEDIN</a>
        </div>
      </footer>
    </div>
  );
};
