/* script.js
   - Theme (Light/Dark) toggle with persistence
   - Orbit animation pausing when hovering an icon
   - Panel selection and transitions
   - Minor accessibility & mobile touch handling
*/

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const orbit = document.getElementById('orbit');
const orbitItems = Array.from(document.querySelectorAll('.orbit-item'));
const panels = Array.from(document.querySelectorAll('.panel'));
const yearSpan = document.getElementById('year');

if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const THEME_KEY = 'site-theme';
let storedTheme = localStorage.getItem(THEME_KEY) || 'dark';

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeToggle.title = 'Switch to Dark Mode';
  } else {
    document.documentElement.classList.remove('light');
    themeIcon.classList.add('fa-moon');
    themeIcon.classList.remove('fa-sun');
    themeToggle.title = 'Switch to Light Mode';
  }
}
applyTheme(storedTheme);

themeToggle.addEventListener('click', () => {
  storedTheme = (localStorage.getItem(THEME_KEY) === 'light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, storedTheme);
  applyTheme(storedTheme);
});

/* Orbit item behavior
   - Pause orbit while hovering/focusing/touching an orbit item
   - Click opens the corresponding panel
*/
orbitItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    orbit.classList.add('paused');
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.style.transform = 'scale(1.02)';
  });
  item.addEventListener('mouseleave', () => {
    orbit.classList.remove('paused');
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.style.transform = '';
  });

  // touch behavior
  item.addEventListener('touchstart', () => {
    orbit.classList.add('paused');
  }, {passive:true});
  item.addEventListener('touchend', () => {
    orbit.classList.remove('paused');
  }, {passive:true});

  item.addEventListener('click', () => {
    const target = item.dataset.target;
    showPanel(target);
  });

  item.setAttribute('tabindex', '0');
  item.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = item.dataset.target;
      showPanel(target);
      e.preventDefault();
    }
  });

  item.addEventListener('focus', () => {
    orbit.classList.add('paused');
    const label = item.querySelector('.label');
    if (label) label.style.display = 'block';
  });
  item.addEventListener('blur', () => {
    orbit.classList.remove('paused');
    const label = item.querySelector('.label');
    if (label) label.style.display = '';
  });
});

let activePanel = null;
function showPanel(name) {
  const panel = panels.find(p => p.dataset.panel === name);
  if (!panel) return;

  if (activePanel === panel) {
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden','true');
    activePanel = null;
    return;
  }

  panels.forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden','true');
  });

  panel.classList.add('active');
  panel.setAttribute('aria-hidden','false');
  activePanel = panel;
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* close panels when clicking outside */
document.addEventListener('click', (event) => {
  const panelsContainer = document.getElementById('panels');
  if (!panelsContainer.contains(event.target) && !orbit.contains(event.target) && !themeToggle.contains(event.target)) {
    if (activePanel) {
      activePanel.classList.remove('active');
      activePanel.setAttribute('aria-hidden','true');
      activePanel = null;
    }
  }
});