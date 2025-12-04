// popup.js - Enhanced with smooth animations and particle effects

let editMode = false;
let dragMode = false;
let multiSelectMode = false;

// Initialize particles on load
document.addEventListener('DOMContentLoaded', async () => {
  createParticles();
  await loadData();
  setupEventListeners();
  checkEditMode();
  initCardHoverEffects();
});

// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particle.style.opacity = 0.2 + Math.random() * 0.3;
    particle.style.width = (3 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// Initialize 3D hover effects for stat cards
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// Load data from storage with animation
async function loadData() {
  const data = await chrome.storage.local.get(null);
  
  let totalSites = 0;
  let totalElements = 0;
  const sites = [];
  
  for (const [domain, rules] of Object.entries(data)) {
    if (rules.hidden || rules.enlarged) {
      totalSites++;
      totalElements += (rules.hidden?.length || 0) + (rules.enlarged?.length || 0);
      sites.push({
        domain,
        hidden: rules.hidden?.length || 0,
        enlarged: rules.enlarged?.length || 0,
        active: rules.active !== false,
        lastVisit: rules.lastVisit || 'Inconnue'
      });
    }
  }
  
  sites.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  
  // Animate counter updates
  animateCounter('totalSites', totalSites);
  animateCounter('totalElements', totalElements);
  
  displaySites(sites);
}

// Smooth counter animation
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  const duration = 800;
  const startValue = parseInt(element.textContent) || 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Display sites with staggered animation
function displaySites(sites) {
  const container = document.getElementById('sitesList');
  
  if (sites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <p><strong>Aucun site nettoyé</strong></p>
        <p class="hint">Activez le mode édition pour commencer</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sites.map((site, index) => `
    <div class="site-item" style="animation-delay: ${index * 0.1}s">
      <div class="site-header">
        <span class="site-domain">${site.domain}</span>
        <span class="site-status">
          <span class="status-dot ${site.active ? 'active' : 'paused'}"></span>
          ${site.active ? 'Actif' : 'Pause'}
        </span>
      </div>
      <div class="site-stats">
        <span>🚫 ${site.hidden} masqués</span>
        <span>📐 ${site.enlarged} agrandis</span>
      </div>
      <div class="site-actions">
        <button class="btn btn-reset" data-domain="${site.domain}" data-action="reset">
          Réinitialiser
        </button>
        <button class="btn btn-delete" data-domain="${site.domain}" data-action="delete">
          Supprimer
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners with ripple effect
  container.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handleSiteAction);
    btn.addEventListener('click', createRippleEffect);
  });
}

// Create ripple effect on button click
function createRippleEffect(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  
  ripple.style.cssText = `
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: ${e.clientX - rect.left}px;
    top: ${e.clientY - rect.top}px;
  `;
  
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Handle site actions with animation feedback
async function handleSiteAction(e) {
  const domain = e.target.dataset.domain;
  const action = e.target.dataset.action;
  const siteItem = e.target.closest('.site-item');
  
  if (action === 'reset') {
    siteItem.style.transform = 'scale(0.98)';
    siteItem.style.opacity = '0.7';
    
    await chrome.storage.local.set({
      [domain]: { hidden: [], enlarged: [], active: true }
    });
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'resetSite' }).catch(() => {});
    }
    
    setTimeout(async () => {
      siteItem.style.transform = 'translateX(-100%)';
      siteItem.style.opacity = '0';
      setTimeout(() => loadData(), 300);
    }, 200);
    
  } else if (action === 'delete') {
    siteItem.style.transform = 'translateX(100%) rotateY(20deg)';
    siteItem.style.opacity = '0';
    
    setTimeout(async () => {
      await chrome.storage.local.remove(domain);
      await loadData();
    }, 300);
  }
}

// Setup event listeners
function setupEventListeners() {
  const toggleBtn = document.getElementById('toggleEdit');
  const toggleDragBtn = document.getElementById('toggleDrag');
  
  toggleBtn.addEventListener('click', async () => {
    // Add click animation
    toggleBtn.style.transform = 'translateY(-2px) scale(0.98)';
    setTimeout(() => {
      toggleBtn.style.transform = '';
    }, 100);
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleEditMode' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Content script not available on this tab');
          return;
        }
        if (response) {
          editMode = response.editMode;
          updateToggleButton();
        }
      });
    }
  });

  // Bouton mode déplacement
  toggleDragBtn.addEventListener('click', async () => {
    toggleDragBtn.style.transform = 'translateY(-2px) scale(0.98)';
    setTimeout(() => {
      toggleDragBtn.style.transform = '';
    }, 100);
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      try {
        const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDragMode' });
        if (response) {
          dragMode = response.dragMode;
          updateDragButton();
        }
      } catch (error) {
        console.log('Content script not available on this tab');
      }
    }
  });

  // Bouton mode multi-sélection
  const toggleMultiSelectBtn = document.getElementById('toggleMultiSelect');
  toggleMultiSelectBtn.addEventListener('click', async () => {
    toggleMultiSelectBtn.style.transform = 'translateY(-2px) scale(0.98)';
    setTimeout(() => {
      toggleMultiSelectBtn.style.transform = '';
    }, 100);
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      try {
        const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleMultiSelectMode' });
        if (response) {
          multiSelectMode = response.multiSelectMode;
          updateMultiSelectButton();
        }
      } catch (error) {
        console.log('Content script not available on this tab');
      }
    }
  });
  
  const resetAllBtn = document.getElementById('resetAll');
  resetAllBtn.addEventListener('click', async () => {
    // Spin animation on icon
    const icon = resetAllBtn.querySelector('.icon');
    icon.style.transform = 'rotate(360deg)';
    
    if (confirm('Voulez-vous vraiment réinitialiser tous les sites ?')) {
      await chrome.storage.local.clear();
      await loadData();
      
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    }
    
    setTimeout(() => {
      icon.style.transform = '';
    }, 400);
  });
  
  const aboutBtn = document.getElementById('aboutExtension');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      showAboutPage();
    });
  }
}

// Afficher la page À propos dans le popup
function showAboutPage() {
  const contentWrapper = document.querySelector('.content-wrapper');
  contentWrapper.innerHTML = `
    <div class="about-page">
      <button class="back-button" id="backButton">
        <span>←</span> Retour
      </button>
      
      <div class="about-header">
        <div class="about-logo">🎯</div>
        <h1>CleanWeb</h1>
        <p class="about-subtitle">Le web comme VOUS l'entendez !</p>
      </div>
      
      <div class="about-section">
        <h2>✨ Fonctionnalités</h2>
        <div class="feature-item">
          <span class="feature-icon">🚫</span>
          <div>
            <strong>Masquer les éléments</strong>
            <p>Bannières, pop-ups, publicités... Un clic et ils disparaissent !</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📐</span>
          <div>
            <strong>Agrandir le contenu</strong>
            <p>Shift+Clic en mode édition pour agrandir un élément.</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">↔️</span>
          <div>
            <strong>Déplacer les éléments</strong>
            <p>Réorganisez la page selon vos préférences.</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⬚</span>
          <div>
            <strong>Multi-sélection</strong>
            <p>Sélectionnez plusieurs éléments d'un coup.</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💾</span>
          <div>
            <strong>Sauvegarde automatique</strong>
            <p>Vos modifications sont mémorisées par site.</p>
          </div>
        </div>
      </div>
      
      <div class="about-section">
        <h2>⌨️ Raccourcis clavier</h2>
        <div class="step-item">
          <span class="step-num">E</span>
          <span><strong>Ctrl+E</strong> — Mode édition</span>
        </div>
        <div class="step-item">
          <span class="step-num">Q</span>
          <span><strong>Ctrl+Q</strong> — Mode déplacement</span>
        </div>
        <div class="step-item">
          <span class="step-num">M</span>
          <span><strong>Ctrl+M</strong> — Mode multi-sélection</span>
        </div>
        <div class="step-item">
          <span class="step-num">
            <img src="icons/Click.png" alt="Flèche haut" class="arrow-icon" style="width: 16px; height: 16px;">
          </span>
          <span><strong>Shift+Click</strong> — Agrandir un élément (En mode édition)</span>
        </div>
      
      <div class="about-footer">
        <p>Fait avec ❤️ pour Platon Formation</p>
        <p class="version">Version 1.0</p>
      </div>
    </div>
  `;
  
  document.getElementById('backButton').addEventListener('click', () => {
    location.reload();
  });
}

// Check edit mode status
async function checkEditMode() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getEditMode' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not available on this tab');
        return;
      }
      if (response) {
        editMode = response.editMode;
        updateToggleButton();
      }
    });
  }
}

// Update toggle button with animation
function updateToggleButton() {
  const btn = document.getElementById('toggleEdit');
  const icon = btn.querySelector('.icon');
  const text = btn.querySelector('.text');
  
  if (editMode) {
    btn.classList.add('active');
    icon.textContent = '📝';
    text.textContent = 'Mode édition actif';
    icon.style.animation = 'none';
    setTimeout(() => {
      icon.style.animation = 'sparkle 1s ease-in-out infinite';
    }, 10);
  } else {
    btn.classList.remove('active');
    icon.textContent = '✏️';
    text.textContent = 'Activer le mode édition';
  }
}

// Update drag button with animation
function updateDragButton() {
  const btn = document.getElementById('toggleDrag');
  const icon = btn.querySelector('.icon');
  const text = btn.querySelector('.text');
  
  if (dragMode) {
    btn.classList.add('active');
    icon.textContent = '✋';
    text.textContent = 'Mode déplacement actif';
    icon.style.animation = 'none';
    setTimeout(() => {
      icon.style.animation = 'sparkle 1s ease-in-out infinite';
    }, 10);
  } else {
    btn.classList.remove('active');
    icon.textContent = '↔️';
    text.textContent = 'Activer le mode déplacement';
  }
}

// Update multi-select button with animation
function updateMultiSelectButton() {
  const btn = document.getElementById('toggleMultiSelect');
  const icon = btn.querySelector('.icon');
  const text = btn.querySelector('.text');
  
  if (multiSelectMode) {
    btn.classList.add('active');
    icon.textContent = '✓';
    text.textContent = 'Mode multi-sélection actif';
    icon.style.animation = 'none';
    setTimeout(() => {
      icon.style.animation = 'sparkle 1s ease-in-out infinite';
    }, 10);
  } else {
    btn.classList.remove('active');
    icon.textContent = '⬚';
    text.textContent = 'Activer le mode multi-sélection';
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'rulesUpdated') {
    loadData();
  } else if (request.action === 'editModeChanged') {
    editMode = request.editMode;
    updateToggleButton();
  } else if (request.action === 'dragModeChanged') {
    dragMode = request.dragMode;
    updateDragButton();
  } else if (request.action === 'multiSelectModeChanged') {
    multiSelectMode = request.multiSelectMode;
    updateMultiSelectButton();
  }
});

// Add ripple keyframes style
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
