export const PROJECTS = {
  soc: {
    id: 'soc',
    title: 'SOC Automation Hub',
    summary: 'End-to-end Security Operations Center automation and monitoring system.',
    problem: 'Manual log analysis and threat detection are slow and error-prone, leading to increased Mean Time to Respond (MTTR).',
    role: 'Lead Developer & Security Engineer',
    tech: ['Wazuh', 'Python', 'AbuseIPDB', 'Grok Cloud', 'SQLite', 'Streamlit', 'Discord API'],
    implementation: 'Implemented a pipeline that ingests Wazuh alerts, enriches them via AbuseIPDB and Grok Cloud, and notifies the team via Discord for high-severity events. Data is persisted in SQLite for historical analysis and visualized via a Streamlit dashboard.',
    results: 'Reduced incident triage time by 60% through automated enrichment and instant notification.',
    repo: 'https://github.com/EL-Aouni/Cyber-ops-portfolio', // Placeholder, will update to specific repo if found
    screenshots: [],
  },
  siem: {
    id: 'siem',
    title: 'Threat Intelligence Lab',
    summary: 'Integrated SIEM and Threat Intelligence platform for proactive defense.',
    problem: 'Lack of centralized threat intelligence makes it difficult to correlate local events with global threat trends.',
    role: 'Security Researcher',
    tech: ['Splunk', 'MISP', 'TheHive', 'OpenCTI'],
    implementation: 'Designed a correlation workflow between MISP (Threat Intelligence) and Splunk (SIEM) to automatically tag incoming logs with known malicious indicators (IoCs).',
    results: 'Improved detection of APT-related activity by automating the ingest of curated threat feeds.',
    repo: 'https://github.com/EL-Aouni',
    screenshots: [],
  },
  recon: {
    id: 'recon',
    title: 'Python Recon Framework',
    summary: 'Production-grade reconnaissance toolkit for authorized penetration testing.',
    problem: 'The initial reconnaissance phase of a pentest often involves fragmented tools, making data aggregation difficult.',
    role: 'Tool Developer',
    tech: ['Python', 'Nmap', 'Whois', 'Shodan API', 'Asyncio'],
    implementation: 'Built a modular framework (SosNetScanner) that automates network scanning, service identification, and OSINT gathering into a single structured report.',
    results: 'Accelerated the recon phase of engagements, providing a unified view of the target attack surface.',
    repo: 'https://github.com/EL-Aouni/SosNetScanner',
    screenshots: [],
  },
  enterprise: {
    id: 'enterprise',
    title: 'Enterprise Security Lab',
    summary: 'Full-scale Active Directory and Windows Server security environment.',
    problem: 'Simulating real-world corporate environments is necessary to test AD-specific attack vectors like Kerberoasting and Silver Tickets.',
    role: 'Infrastructure Architect',
    tech: ['Active Directory', 'Windows Server 2022', 'Group Policy', 'VMware'],
    implementation: 'Deployed a multi-domain forest with intentional misconfigurations to simulate a corporate environment, integrating centralized logging for monitoring attack paths.',
    results: 'Successfully simulated and remediated several privilege escalation paths in an AD environment.',
    repo: 'https://github.com/EL-Aouni',
    screenshots: [],
  }
};

export const WORLD_LOCATIONS = [
  { id: 'soc', title: 'SOC Command Center', position: [10, 0, -10], color: '#00f2ff' },
  { id: 'siem', title: 'Threat Intel Lab', position: [-15, 0, -15], color: '#bc13fe' },
  { id: 'recon', title: 'Reconnaissance Tower', position: [15, 0, 15], color: '#ffae00' },
  { id: 'enterprise', title: 'Enterprise Facility', position: [-15, 0, 15], color: '#00ff41' },
  { id: 'profile', title: 'Contact & Profile', position: [0, 0, 20], color: '#ffffff' },
];
