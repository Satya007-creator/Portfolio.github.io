/* ─── CURSOR ─── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .skill-tag, .interest-chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.8)';
    cursorRing.style.borderColor = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.borderColor = 'rgba(0,255,231,0.4)';
  });
});

/* ─── SCROLL PROGRESS ─── */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  scrollProgress.style.height = (pct * 100) + 'vh';
});

/* ─── INTERSECTION OBSERVER ─── */
const fadeEls = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));

/* ─── TYPEWRITER ─── */
const phrases = [
  'Building LSTM-based Intrusion Detection Systems...',
  'Scanning web apps for XSS & SQL Injection...',
  'Monitoring network traffic in real-time...',
  'Hunting zero-day threats...',
  'Breaking things ethically since 2021...'
];
let ph = 0, ch = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  const cur = phrases[ph];
  if (!deleting) {
    tw.textContent = cur.substring(0, ++ch);
    if (ch === cur.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    tw.textContent = cur.substring(0, --ch);
    if (ch === 0) { deleting = false; ph = (ph + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 65);
}
type();

/* ─── GITHUB API ─── */
const GITHUB_USER = 'Satya007-creator';
const FEATURED_REPO = 'IDS'; // Featured repo from resume

// Resume project descriptions (fallback enrichment)
const resumeProjects = {
  'IDS': {
    description: 'Advanced Intrusion Detection System using LSTM networks to detect anomalies and attacks in network traffic. Achieves high accuracy against both known and zero-day threats.',
    tech: ['LSTM', 'Python', 'TensorFlow', 'Deep Learning'],
    icon: '🛡️',
    featured: true
  }
};

// Color mapping for languages
const langColors = {
  'Python': '#3572A5', 'JavaScript': '#f1e05a', 'Java': '#b07219',
  'C': '#555555', 'Shell': '#89e051', 'HTML': '#e34c26',
  'Jupyter Notebook': '#DA5B0B', 'TypeScript': '#2b7489'
};

async function fetchGitHubRepos() {
  const statusEl = document.getElementById('github-status');
  const gridEl = document.getElementById('projects-grid');

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) throw new Error('GitHub API error');

    const repos = await res.json();
    statusEl.textContent = `SYNCED // ${repos.length} repos found · Last updated: ${new Date().toLocaleDateString()}`;
    statusEl.style.color = 'var(--accent)';

    // Build project cards
    gridEl.innerHTML = '';

    // Sort: featured first
    const sorted = [...repos].sort((a, b) => {
      if (a.name === FEATURED_REPO) return -1;
      if (b.name === FEATURED_REPO) return 1;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    sorted.forEach((repo, i) => {
      const isFeatured = repo.name === FEATURED_REPO;
      const resume = resumeProjects[repo.name] || {};
      const desc = repo.description || resume.description || 'No description provided.';
      const tech = resume.tech || (repo.language ? [repo.language] : ['Code']);
      const icon = resume.icon || '⚡';
      const langColor = langColors[repo.language] || '#00ffe7';
      const stars = repo.stargazers_count;
      const forks = repo.forks_count;

      const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      const card = document.createElement('div');
      card.className = `project-card${isFeatured ? ' featured' : ''} fade-up`;
      card.style.animationDelay = `${i * 80}ms`;

      card.innerHTML = `
        <div class="project-header">
          <div class="project-icon">${icon}</div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="project-link">↗ CODE</a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">↗ LIVE</a>` : ''}
          </div>
        </div>
        <div class="project-name">${repo.name.toUpperCase().replace(/-/g,' ')}</div>
        <p class="project-desc">${desc}</p>
        <div class="project-tech">
          ${tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
        <div class="project-meta">
          <div class="meta-item">
            <div class="dot" style="background:${langColor}"></div>
            ${repo.language || 'Multi-lang'}
          </div>
          <div class="meta-item">★ ${stars}</div>
          <div class="meta-item">⑂ ${forks}</div>
          <div class="meta-item">↻ ${updatedDate}</div>
        </div>
      `;

      gridEl.appendChild(card);

      // Re-observe for fade-in
      setTimeout(() => {
        obs.observe(card);
        setTimeout(() => card.classList.add('visible'), i * 80);
      }, 10);
    });

  } catch (err) {
    statusEl.textContent = `ERROR // Using cached data`;
    statusEl.style.color = 'var(--accent2)';

    // Fallback: show resume projects
    gridEl.innerHTML = '';
    const fallback = [
      {
        name: 'IDS', icon: '🛡️', featured: true,
        description: 'Advanced Intrusion Detection System using LSTM networks for detecting anomalies and attacks in network traffic. Achieves high accuracy in detecting both known and zero-day threats.',
        tech: ['LSTM', 'Python', 'TensorFlow'],
        link: 'https://github.com/Satya007-creator/IDS'
      },
      {
        name: 'Network Monitor', icon: '📡', featured: false,
        description: 'Real-Time Network Monitoring using Snappy compression for efficient data capture. Enables real-time detection of abnormal network behavior with minimal overhead.',
        tech: ['Snappy', 'Python', 'Networking'],
        link: 'https://github.com/Satya007-creator'
      },
      {
        name: 'Vuln Scanner', icon: '🔍', featured: false,
        description: 'Python-based Web Application Vulnerability Scanner for identifying XSS and SQL Injection. Includes automated reporting for analysis and patch management.',
        tech: ['Python', 'MySQL', 'Web Security'],
        link: 'https://github.com/Satya007-creator'
      }
    ];

    fallback.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = `project-card${p.featured ? ' featured' : ''} fade-up visible`;
      card.innerHTML = `
        <div class="project-header">
          <div class="project-icon">${p.icon}</div>
          <div class="project-links">
            <a href="${p.link}" target="_blank" class="project-link">↗ CODE</a>
          </div>
        </div>
        <div class="project-name">${p.name.toUpperCase()}</div>
        <p class="project-desc">${p.description}</p>
        <div class="project-tech">${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
      `;
      gridEl.appendChild(card);
    });
  }
}

fetchGitHubRepos();

// Auto-refresh every 5 minutes
setInterval(fetchGitHubRepos, 5 * 60 * 1000);