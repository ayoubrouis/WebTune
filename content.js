// content.js - Script injecté dans toutes les pages web

// Éviter la double injection
if (window.cleanWebInjected) {
  console.log('CleanWeb déjà injecté');
} else {
  window.cleanWebInjected = true;

let editMode = false;
let hoveredElement = null;
let originalOutline = '';
let siteRules = {};
let dragMode = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let movedElements = {};
let multiSelectMode = false;
let selectionBox = null;
let selectionStartX = 0;
let selectionStartY = 0;
let selectedElements = [];

// Initialisation au chargement de la page
init();

async function init() {
  const domain = getDomain();
  const data = await chrome.storage.local.get(domain);
  siteRules = data[domain] || { hidden: [], enlarged: [], active: true };
  
  if (siteRules.active) {
    applyRules();
    await loadDragPositions();
  }
  
  setupMessageListener();
  setupKeyboardShortcuts();
}

// Récupérer le domaine actuel
function getDomain() {
  return window.location.hostname;
}

// Générer un sélecteur CSS unique pour un élément
function generateSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  let path = [];
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();
    
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes.slice(0, 3).join('.');
      }
    }
    
    // Ajouter un index si nécessaire pour l'unicité
    if (element.parentNode) {
      const siblings = Array.from(element.parentNode.children).filter(
        e => e.nodeName === element.nodeName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    
    path.unshift(selector);
    element = element.parentNode;
    
    if (path.length > 4) break; // Limiter la profondeur
  }
  
  return path.join(' > ');
}

// Appliquer les règles sauvegardées
function applyRules() {
  // Masquer les éléments
  siteRules.hidden.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('data-cleanweb-hidden', 'true');
      });
    } catch (e) {
      console.log('Sélecteur invalide:', selector);
    }
  });
  
  // Agrandir les éléments
  siteRules.enlarged.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.transform = 'scale(1.2)';
        el.style.transformOrigin = 'top left';
        el.style.zIndex = '1000';
        el.setAttribute('data-cleanweb-enlarged', 'true');
      });
    } catch (e) {
      console.log('Sélecteur invalide:', selector);
    }
  });
}

// Activer/Désactiver le mode édition
function toggleEditMode() {
  editMode = !editMode;
  
  if (editMode) {
    document.body.style.cursor = 'crosshair';
    showNotification('Mode édition activé', 'Cliquez pour masquer, Shift+Clic pour agrandir');
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
  } else {
    document.body.style.cursor = '';
    hideNotification();
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('click', handleClick);
    if (hoveredElement) {
      hoveredElement.style.outline = originalOutline;
      hoveredElement = null;
    }
  }
  
  // Informer le popup
  chrome.runtime.sendMessage({ 
    action: 'editModeChanged', 
    editMode: editMode 
  });
}

// Gestion du survol
function handleMouseOver(e) {
  if (!editMode) return;
  
  e.stopPropagation();
  
  if (hoveredElement) {
    hoveredElement.style.outline = originalOutline;
  }
  
  hoveredElement = e.target;
  originalOutline = hoveredElement.style.outline;
  hoveredElement.style.outline = '3px solid #3B82F6';
  hoveredElement.style.outlineOffset = '2px';
}

// Gestion de la sortie du survol
function handleMouseOut(e) {
  if (!editMode || !hoveredElement) return;
  hoveredElement.style.outline = originalOutline;
}

// Gestion du clic
async function handleClick(e) {
  if (!editMode) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const element = e.target;
  const selector = generateSelector(element);
  const isShiftKey = e.shiftKey;
  
  if (isShiftKey) {
    // Agrandir l'élément
    if (!siteRules.enlarged.includes(selector)) {
      siteRules.enlarged.push(selector);
      element.style.transform = 'scale(1.2)';
      element.style.transformOrigin = 'top left';
      element.style.zIndex = '1000';
      element.setAttribute('data-cleanweb-enlarged', 'true');
      showNotification('Élément agrandi', 'L\'élément sera toujours agrandi sur ce site');
    } else {
      // Retirer l'agrandissement
      siteRules.enlarged = siteRules.enlarged.filter(s => s !== selector);
      element.style.transform = '';
      element.style.zIndex = '';
      element.removeAttribute('data-cleanweb-enlarged');
      showNotification('Agrandissement annulé', '');
    }
  } else {
    // Masquer l'élément
    if (!siteRules.hidden.includes(selector)) {
      siteRules.hidden.push(selector);
      element.style.display = 'none';
      element.setAttribute('data-cleanweb-hidden', 'true');
      showNotification('Élément masqué', 'Il sera masqué à chaque visite');
    }
  }
  
  // Sauvegarder
  await saveRules();
  
  hoveredElement = null;
}

// Sauvegarder les règles
async function saveRules() {
  const domain = getDomain();
  siteRules.lastVisit = new Date().toISOString().split('T')[0];
  
  await chrome.storage.local.set({ [domain]: siteRules });
  
  // Informer le popup
  chrome.runtime.sendMessage({ 
    action: 'rulesUpdated',
    domain: domain,
    rules: siteRules
  });
}

// Réinitialiser le site
async function resetSite() {
  const domain = getDomain();
  
  // Retirer tous les styles
  document.querySelectorAll('[data-cleanweb-hidden]').forEach(el => {
    el.style.display = '';
    el.removeAttribute('data-cleanweb-hidden');
  });
  
  document.querySelectorAll('[data-cleanweb-enlarged]').forEach(el => {
    el.style.transform = '';
    el.style.zIndex = '';
    el.removeAttribute('data-cleanweb-enlarged');
  });
  
  // Réinitialiser les éléments déplacés
  document.querySelectorAll('[data-cleanweb-moved]').forEach(el => {
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.zIndex = '';
    el.removeAttribute('data-cleanweb-moved');
  });
  
  // Effacer les positions sauvegardées
  movedElements = {};
  const dragKey = `cleanweb-drag-${domain}`;
  await chrome.storage.local.remove(dragKey);
  
  siteRules = { hidden: [], enlarged: [], active: true };
  await chrome.storage.local.set({ [domain]: siteRules });
  
  showNotification('Site réinitialisé', 'Tous les changements ont été annulés');
}

// Afficher une notification
function showNotification(title, message) {
  const existingNotif = document.getElementById('cleanweb-notification');
  if (existingNotif) {
    existingNotif.remove();
  }
  
  const notif = document.createElement('div');
  notif.id = 'cleanweb-notification';
  notif.className = 'cleanweb-notification';
  notif.innerHTML = `
    <div class="cleanweb-notification-content">
      <strong>${title}</strong>
      ${message ? `<p>${message}</p>` : ''}
    </div>
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    hideNotification();
  }, 3000);
}

// Masquer la notification
function hideNotification() {
  const notif = document.getElementById('cleanweb-notification');
  if (notif) {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }
}

// Écouter les messages du popup
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleEditMode') {
      toggleEditMode();
      sendResponse({ editMode: editMode });
    } else if (request.action === 'toggleDragMode') {
      toggleDragMode();
      sendResponse({ dragMode: dragMode });
    } else if (request.action === 'toggleMultiSelectMode') {
      toggleMultiSelectMode();
      sendResponse({ multiSelectMode: multiSelectMode });
    } else if (request.action === 'resetSite') {
      resetSite();
      sendResponse({ success: true });
    } else if (request.action === 'getEditMode') {
      sendResponse({ editMode: editMode });
    } else if (request.action === 'toggleSiteActive') {
      siteRules.active = !siteRules.active;
      saveRules();
      if (siteRules.active) {
        applyRules();
      } else {
        // Retirer temporairement les règles
        document.querySelectorAll('[data-cleanweb-hidden]').forEach(el => {
          el.style.display = '';
        });
        document.querySelectorAll('[data-cleanweb-enlarged]').forEach(el => {
          el.style.transform = '';
        });
      }
      sendResponse({ active: siteRules.active });
    }
    return true;
  });
}

// Activer/Désactiver le mode de déplacement
function toggleDragMode() {
  dragMode = !dragMode;
  
  if (dragMode) {
    document.body.style.cursor = 'grab';
    showNotification('Mode déplacement activé', 'Glissez-déposez les éléments pour les déplacer');
    
    // Ajouter les écouteurs de drag
    document.addEventListener('mouseover', handleDragMouseOver);
    document.addEventListener('mouseout', handleDragMouseOut);
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  } else {
    document.body.style.cursor = '';
    hideNotification();
    
    // Retirer les écouteurs de drag
    document.removeEventListener('mouseover', handleDragMouseOver);
    document.removeEventListener('mouseout', handleDragMouseOut);
    document.removeEventListener('mousedown', handleDragStart);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    if (draggedElement) {
      draggedElement.style.outline = '';
      draggedElement.style.cursor = '';
      draggedElement = null;
    }
  }
  
  showNotification(
    dragMode ? 'Mode déplacement activé' : 'Mode déplacement désactivé',
    dragMode ? 'Glissez les éléments pour les déplacer' : ''
  );
  
  // Informer le popup
  chrome.runtime.sendMessage({ 
    action: 'dragModeChanged', 
    dragMode: dragMode 
  });
}

// Gestion du survol en mode déplacement
function handleDragMouseOver(e) {
  if (!dragMode) return;
  
  const element = e.target;
  if (element && element !== document.body && element !== document.documentElement) {
    element.style.cursor = 'grab';
    element.style.outline = '2px dashed #5AAFCA';
    element.style.outlineOffset = '2px';
    element.setAttribute('data-draggable', 'true');
  }
}

// Gestion de la sortie du survol en mode déplacement
function handleDragMouseOut(e) {
  if (!dragMode) return;
  
  const element = e.target;
  if (element && element !== document.body && element !== document.documentElement) {
    if (element !== draggedElement) {
      element.style.outline = '';
      element.style.cursor = '';
      element.removeAttribute('data-draggable');
    }
  }
}

// Démarrer le déplacement
function handleDragStart(e) {
  if (!dragMode) return;
  
  const element = e.target;
  if (element && element !== document.body && element !== document.documentElement && element.hasAttribute('data-draggable')) {
    e.preventDefault();
    e.stopPropagation();
    
    draggedElement = element;
    draggedElement.style.cursor = 'grabbing';
    draggedElement.style.outline = '3px solid #3B8EA5';
    draggedElement.style.position = 'fixed';
    draggedElement.style.zIndex = '999999';
    draggedElement.style.transition = 'none';
    
    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    draggedElement.setAttribute('data-dragging', 'true');
  }
}

// Déplacer l'élément
function handleDragMove(e) {
  if (!dragMode || !draggedElement) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  
  draggedElement.style.left = x + 'px';
  draggedElement.style.top = y + 'px';
}

// Arrêter le déplacement
function handleDragEnd(e) {
  if (!dragMode || !draggedElement) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  draggedElement.style.cursor = 'grab';
  draggedElement.removeAttribute('data-dragging');
  
  // Sauvegarder la position
  const selector = generateSelector(draggedElement);
  const position = {
    left: draggedElement.style.left,
    top: draggedElement.style.top,
    position: 'fixed',
    zIndex: draggedElement.style.zIndex
  };
  
  movedElements[selector] = position;
  saveDragPositions();
  
  showNotification('Position sauvegardée', `L'élément restera à cette position`);
  
  draggedElement = null;
}

// Sauvegarder les positions déplacées
function saveDragPositions() {
  const domain = getDomain();
  const key = `cleanweb-drag-${domain}`;
  chrome.storage.local.set({ [key]: movedElements });
}

// Charger les positions déplacées
async function loadDragPositions() {
  const domain = getDomain();
  const key = `cleanweb-drag-${domain}`;
  const data = await chrome.storage.local.get(key);
  
  if (data[key]) {
    movedElements = data[key];
    applyDragPositions();
  }
}

// Appliquer les positions déplacées
function applyDragPositions() {
  for (const [selector, position] of Object.entries(movedElements)) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.position = position.position;
        el.style.left = position.left;
        el.style.top = position.top;
        el.style.zIndex = position.zIndex;
        el.setAttribute('data-cleanweb-moved', 'true');
      });
    } catch (e) {
      console.log('Sélecteur invalide:', selector);
    }
  }
}

// Raccourcis clavier
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      toggleEditMode();
    }
  });
}

// ============== MODE MULTI-SÉLECTION ==============

// Activer/Désactiver le mode multi-sélection
function toggleMultiSelectMode() {
  multiSelectMode = !multiSelectMode;
  
  if (multiSelectMode) {
    document.body.style.cursor = 'crosshair';
    showNotification('Mode multi-sélection activé', 'Dessinez un rectangle pour sélectionner plusieurs éléments');
    
    document.addEventListener('mousedown', handleMultiSelectStart);
    document.addEventListener('mousemove', handleMultiSelectMove);
    document.addEventListener('mouseup', handleMultiSelectEnd);
  } else {
    document.body.style.cursor = '';
    hideNotification();
    
    document.removeEventListener('mousedown', handleMultiSelectStart);
    document.removeEventListener('mousemove', handleMultiSelectMove);
    document.removeEventListener('mouseup', handleMultiSelectEnd);
    
    clearSelection();
  }
  
  chrome.runtime.sendMessage({ 
    action: 'multiSelectModeChanged', 
    multiSelectMode: multiSelectMode 
  });
}

// Créer la boîte de sélection
function createSelectionBox() {
  if (selectionBox) return;
  
  selectionBox = document.createElement('div');
  selectionBox.id = 'cleanweb-selection-box';
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px dashed #6a5acd;
    background: rgba(106, 90, 205, 0.15);
    pointer-events: none;
    z-index: 999999;
    display: none;
  `;
  document.body.appendChild(selectionBox);
}

// Démarrer la sélection
function handleMultiSelectStart(e) {
  if (!multiSelectMode) return;
  if (e.target.id === 'cleanweb-notification' || e.target.closest('#cleanweb-notification')) return;
  if (e.target.closest('#cleanweb-selection-actions')) return;
  
  e.preventDefault();
  
  clearSelection();
  createSelectionBox();
  
  selectionStartX = e.clientX;
  selectionStartY = e.clientY;
  
  selectionBox.style.left = selectionStartX + 'px';
  selectionBox.style.top = selectionStartY + 'px';
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.style.display = 'block';
}

// Déplacer la sélection
function handleMultiSelectMove(e) {
  if (!multiSelectMode || !selectionBox || selectionBox.style.display === 'none') return;
  
  e.preventDefault();
  
  const currentX = e.clientX;
  const currentY = e.clientY;
  
  const left = Math.min(selectionStartX, currentX);
  const top = Math.min(selectionStartY, currentY);
  const width = Math.abs(currentX - selectionStartX);
  const height = Math.abs(currentY - selectionStartY);
  
  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
  
  highlightElementsInSelection(left, top, width, height);
}

// Terminer la sélection
function handleMultiSelectEnd(e) {
  if (!multiSelectMode || !selectionBox || selectionBox.style.display === 'none') return;
  
  e.preventDefault();
  
  const boxRect = selectionBox.getBoundingClientRect();
  
  if (boxRect.width > 10 && boxRect.height > 10) {
    selectElementsInBox(boxRect);
    
    if (selectedElements.length > 0) {
      showSelectionActions();
    }
  }
  
  selectionBox.style.display = 'none';
}

// Mettre en surbrillance les éléments dans la sélection
function highlightElementsInSelection(left, top, width, height) {
  document.querySelectorAll('[data-cleanweb-highlight]').forEach(el => {
    el.style.outline = '';
    el.removeAttribute('data-cleanweb-highlight');
  });
  
  const selectionRect = { left, top, right: left + width, bottom: top + height };
  
  const elements = document.body.querySelectorAll('*');
  elements.forEach(el => {
    if (el.id && el.id.startsWith('cleanweb-')) return;
    if (el === document.body || el === document.documentElement) return;
    
    const rect = el.getBoundingClientRect();
    if (isElementInSelection(rect, selectionRect)) {
      el.style.outline = '2px solid #6a5acd';
      el.setAttribute('data-cleanweb-highlight', 'true');
    }
  });
}

// Vérifier si un élément est dans la sélection
function isElementInSelection(elemRect, selRect) {
  const elemCenterX = elemRect.left + elemRect.width / 2;
  const elemCenterY = elemRect.top + elemRect.height / 2;
  
  return elemCenterX >= selRect.left && 
         elemCenterX <= selRect.right && 
         elemCenterY >= selRect.top && 
         elemCenterY <= selRect.bottom;
}

// Sélectionner les éléments dans la boîte
function selectElementsInBox(boxRect) {
  selectedElements = [];
  
  const elements = document.body.querySelectorAll('*');
  elements.forEach(el => {
    if (el.id && el.id.startsWith('cleanweb-')) return;
    if (el === document.body || el === document.documentElement) return;
    
    const rect = el.getBoundingClientRect();
    const selRect = { 
      left: boxRect.left, 
      top: boxRect.top, 
      right: boxRect.right, 
      bottom: boxRect.bottom 
    };
    
    if (isElementInSelection(rect, selRect)) {
      selectedElements.push(el);
      el.style.outline = '3px solid #6a5acd';
      el.setAttribute('data-cleanweb-selected', 'true');
    }
  });
}

// Afficher les actions de sélection
function showSelectionActions() {
  const existingActions = document.getElementById('cleanweb-selection-actions');
  if (existingActions) existingActions.remove();
  
  const actionsDiv = document.createElement('div');
  actionsDiv.id = 'cleanweb-selection-actions';
  actionsDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #4a4a7a 0%, #6a5acd 100%);
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(106, 90, 205, 0.5);
    z-index: 999999;
    display: flex;
    gap: 15px;
    align-items: center;
    font-family: 'Inter', -apple-system, sans-serif;
  `;
  
  actionsDiv.innerHTML = `
    <span style="color: white; font-size: 14px; font-weight: 500;">
      ${selectedElements.length} élément(s) sélectionné(s)
    </span>
    <button id="cleanweb-hide-selected" style="
      background: #e85d5d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
    ">Masquer tout</button>
    <button id="cleanweb-drag-selected" style="
      background: #4c8577;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
    ">Déplacer</button>
    <button id="cleanweb-cancel-selection" style="
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
    ">Annuler</button>
  `;
  
  document.body.appendChild(actionsDiv);
  
  document.getElementById('cleanweb-hide-selected').addEventListener('click', (e) => {
    e.stopPropagation();
    hideSelectedElements();
  });
  document.getElementById('cleanweb-drag-selected').addEventListener('click', (e) => {
    e.stopPropagation();
    startDragSelectedElements();
  });
  document.getElementById('cleanweb-cancel-selection').addEventListener('click', (e) => {
    e.stopPropagation();
    clearSelection();
  });
}

// Masquer les éléments sélectionnés
async function hideSelectedElements() {
  const count = selectedElements.length;
  
  for (const element of selectedElements) {
    const selector = generateSelector(element);
    
    if (!siteRules.hidden.includes(selector)) {
      siteRules.hidden.push(selector);
    }
    element.style.display = 'none';
    element.style.outline = '';
    element.setAttribute('data-cleanweb-hidden', 'true');
    element.removeAttribute('data-cleanweb-selected');
  }
  
  await saveRules();
  
  selectedElements = [];
  
  const actionsDiv = document.getElementById('cleanweb-selection-actions');
  if (actionsDiv) actionsDiv.remove();
  
  showNotification('Éléments masqués', `${count} élément(s) masqué(s)`);
}

// Variables pour le déplacement groupé
let isDraggingGroup = false;
let groupDragStartX = 0;
let groupDragStartY = 0;
let elementStartPositions = [];

// Démarrer le déplacement des éléments sélectionnés
function startDragSelectedElements() {
  if (selectedElements.length === 0) return;
  
  isDraggingGroup = true;
  
  // Sauvegarder les positions initiales
  elementStartPositions = selectedElements.map(el => {
    const rect = el.getBoundingClientRect();
    return {
      element: el,
      startLeft: rect.left,
      startTop: rect.top
    };
  });
  
  // Préparer les éléments pour le déplacement
  selectedElements.forEach(el => {
    el.style.position = 'fixed';
    el.style.zIndex = '999998';
    el.style.transition = 'none';
    el.style.outline = '3px solid #4c8577';
  });
  
  // Masquer la barre d'actions temporairement
  const actionsDiv = document.getElementById('cleanweb-selection-actions');
  if (actionsDiv) actionsDiv.style.display = 'none';
  
  document.body.style.cursor = 'grabbing';
  
  showNotification('Mode déplacement groupé', 'Déplacez les éléments puis cliquez pour confirmer');
  
  document.addEventListener('mousemove', handleGroupDragMove);
  document.addEventListener('mousedown', handleGroupDragEnd);
}

// Déplacer le groupe d'éléments
function handleGroupDragMove(e) {
  if (!isDraggingGroup || elementStartPositions.length === 0) return;
  
  e.preventDefault();
  
  if (groupDragStartX === 0 && groupDragStartY === 0) {
    groupDragStartX = e.clientX;
    groupDragStartY = e.clientY;
  }
  
  const deltaX = e.clientX - groupDragStartX;
  const deltaY = e.clientY - groupDragStartY;
  
  elementStartPositions.forEach(item => {
    item.element.style.left = (item.startLeft + deltaX) + 'px';
    item.element.style.top = (item.startTop + deltaY) + 'px';
  });
}

// Terminer le déplacement groupé
async function handleGroupDragEnd(e) {
  if (!isDraggingGroup) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  document.removeEventListener('mousemove', handleGroupDragMove);
  document.removeEventListener('mousedown', handleGroupDragEnd);
  
  isDraggingGroup = false;
  document.body.style.cursor = 'crosshair';
  
  // Sauvegarder les nouvelles positions
  for (const item of elementStartPositions) {
    const selector = generateSelector(item.element);
    const position = {
      left: item.element.style.left,
      top: item.element.style.top,
      position: 'fixed',
      zIndex: '999998'
    };
    
    movedElements[selector] = position;
    item.element.setAttribute('data-cleanweb-moved', 'true');
    item.element.style.outline = '3px solid #6a5acd';
  }
  
  await saveDragPositions();
  
  groupDragStartX = 0;
  groupDragStartY = 0;
  elementStartPositions = [];
  
  showNotification('Positions sauvegardées', `${selectedElements.length} élément(s) déplacé(s)`);
  
  // Réafficher la barre d'actions
  const actionsDiv = document.getElementById('cleanweb-selection-actions');
  if (actionsDiv) actionsDiv.style.display = 'flex';
}

// Effacer la sélection
function clearSelection() {
  document.querySelectorAll('[data-cleanweb-selected]').forEach(el => {
    el.style.outline = '';
    el.removeAttribute('data-cleanweb-selected');
  });
  
  document.querySelectorAll('[data-cleanweb-highlight]').forEach(el => {
    el.style.outline = '';
    el.removeAttribute('data-cleanweb-highlight');
  });
  
  selectedElements = [];
  
  const actionsDiv = document.getElementById('cleanweb-selection-actions');
  if (actionsDiv) actionsDiv.remove();
  
  if (selectionBox) {
    selectionBox.style.display = 'none';
  }
}

// Observer les nouveaux éléments ajoutés dynamiquement
const observer = new MutationObserver(() => {
  if (siteRules.active && (siteRules.hidden.length > 0 || siteRules.enlarged.length > 0)) {
    applyRules();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

} // Fin du bloc if (!window.cleanWebInjected)