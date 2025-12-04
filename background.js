// background.js - Service Worker pour l'extension

// Installation de l'extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('CleanWeb installé avec succès !');
    
    // Ouvrir la page de bienvenue
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
    
    // Créer l'alarme de nettoyage
    chrome.alarms.create('cleanOldData', { periodInMinutes: 10080 }); // 7 jours
  } else if (details.reason === 'update') {
    console.log('CleanWeb mis à jour !');
    // Recréer l'alarme en cas de mise à jour
    chrome.alarms.create('cleanOldData', { periodInMinutes: 10080 }); // 7 jours
  }
  
  // Réinjecter les content scripts dans tous les onglets ouverts
  await injectContentScripts();
});

// Réinjecter les content scripts dans tous les onglets
async function injectContentScripts() {
  try {
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      // Ignorer les pages chrome://, edge://, about:, etc.
      if (tab.url && !tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('edge://') && 
          !tab.url.startsWith('about:') &&
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('moz-extension://')) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content.css']
          });
          console.log('Scripts injectés dans:', tab.url);
        } catch (e) {
          console.log('Impossible d\'injecter dans:', tab.url, e.message);
        }
      }
    }
  } catch (e) {
    console.log('Erreur lors de l\'injection:', e.message);
  }
}

// Gestion des commandes clavier
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      let action = '';
      
      if (command === 'toggle-edit-mode') {
        action = 'toggleEditMode';
      } else if (command === 'toggle-drag-mode') {
        action = 'toggleDragMode';
      } else if (command === 'toggle-multiselect-mode') {
        action = 'toggleMultiSelectMode';
      }
      
      if (action) {
        chrome.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Erreur:', chrome.runtime.lastError.message);
          }
        });
      }
    }
  });
});

// Écouter les messages des content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'rulesUpdated') {
    console.log('Règles mises à jour pour:', request.domain);
    
    // Mettre à jour le badge
    updateBadge(request.rules);
  } else if (request.action === 'editModeChanged') {
    // Mettre à jour l'icône selon le mode
    updateIcon(request.editMode);
  }
  
  return true;
});

// Mettre à jour le badge de l'icône
function updateBadge(rules) {
  const total = rules.hidden.length + rules.enlarged.length;
  
  chrome.action.setBadgeText({
    text: total > 0 ? total.toString() : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: total > 0 ? '#3B82F6' : '#9CA3AF'
  });
}

// Mettre à jour l'icône selon le mode édition
function updateIcon(editMode) {
  // Ici vous pourriez changer l'icône selon le mode
  // Pour l'instant, on change juste le titre
  chrome.action.setTitle({
    title: editMode ? 'CleanWeb - Mode Édition Actif' : 'CleanWeb'
  });
}

// Nettoyer les données anciennes (sites non visités depuis 90 jours)
async function cleanOldData() {
  const storage = await chrome.storage.local.get(null);
  const now = new Date();
  const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
  
  for (const [key, value] of Object.entries(storage)) {
    if (value.lastVisit) {
      const lastVisit = new Date(value.lastVisit);
      if (lastVisit < ninetyDaysAgo) {
        await chrome.storage.local.remove(key);
        console.log('Nettoyage des données anciennes pour:', key);
      }
    }
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanOldData') {
    cleanOldData();
  }
});

// Surveiller les changements d'onglet pour mettre à jour le badge
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  
  if (tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const data = await chrome.storage.local.get(domain);
      
      if (data[domain]) {
        updateBadge(data[domain]);
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
    } catch (e) {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});

// Gérer les clics sur l'icône de l'extension
chrome.action.onClicked.addListener((tab) => {
  // Le popup s'ouvre automatiquement, ce listener est optionnel
  console.log('Extension cliquée');
});

// Au démarrage du service worker, vérifier si on doit réinjecter
chrome.runtime.onStartup.addListener(async () => {
  console.log('CleanWeb démarré');
});