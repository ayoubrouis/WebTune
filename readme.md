# 🎯 WebTune - Extension de Nettoyage Web

> **Nettoyez le web comme VOUS l'entendez !**

Une extension de navigateur puissante qui permet de masquer ou agrandir les éléments indésirables sur vos sites préférés, avec sauvegarde automatique de vos choix.

---

## ✨ Fonctionnalités

### Core Features

- 🎯 **Mode Édition Interactif** - Sélectionnez visuellement les éléments à modifier
- 🚫 **Masquage d'Éléments** - Cachez définitivement les bannières, pubs, pop-ups
- 📐 **Agrandissement d'Éléments** - Mettez en avant le contenu important (Shift+Clic)
- 💾 **Sauvegarde Persistante** - Vos choix sont mémorisés par domaine
- 🔄 **Gestion Facile** - Interface intuitive pour gérer tous vos sites

### Fonctionnalités Avancées

- ⌨️ **Raccourcis Clavier** - Accès rapide à tous les modes via `Ctrl+E`, `Ctrl+Q`, `Ctrl+M`
- 📊 **Statistiques en Temps Réel** - Visualisez le nombre de sites et d'éléments modifiés
- ⏸️ **Pause Temporaire** - Désactivez le nettoyage sans perdre vos réglages
- 🔍 **Détection Dynamique** - Fonctionne même sur les éléments chargés après coup (MutationObserver)
- 🧹 **Nettoyage Auto** - Suppression des données anciennes (90 jours)
- 📍 **Mode Déplacement (Drag & Drop)** - Repositionnez librement les éléments sur la page
- ⬚ **Mode Multi-Sélection** - Sélectionnez plusieurs éléments à la fois avec une boîte de sélection
- 👁️ **Surlignage Visuel** - Aperçu avec cadres colorés pour chaque mode
- 🎨 **Effets Visuels** - Notifications animées et retours utilisateur en temps réel
- 🔗 **Détection de Sélecteurs CSS** - Génération automatique de sélecteurs uniques et robustes

---

## 📦 Installation

### Chrome / Edge / Brave

1. **Téléchargez les fichiers**

   ```
   WebTune/
   ├── manifest.json
   ├── background.js
   ├── content.js
   ├── content.css
   ├── popup.html
   ├── popup.js
   └── icons/
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```

2. **Créez les icônes** (ou utilisez des icônes temporaires)

   - Créez un dossier `icons/`
   - Ajoutez trois images PNG (16x16, 48x48, 128x128)
   - Nommez-les `icon16.png`, `icon48.png`, `icon128.png`

3. **Chargez l'extension**
   - Ouvrez Chrome et allez sur `chrome://extensions/`
   - Activez le "Mode développeur" (coin supérieur droit)
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `WebTune/`
   - L'extension apparaît dans votre barre d'outils !

### Firefox

1. Créez les mêmes fichiers que pour Chrome
2. Allez sur `about:debugging#/runtime/this-firefox`
3. Cliquez sur "Charger un module complémentaire temporaire"
4. Sélectionnez le fichier `manifest.json`

---

## 🎨 Interface Utilisateur

### Popup Principal

- **Compteurs en temps réel** : Affiche le nombre de sites et d'éléments modifiés
- **Listes des sites** : Vue des domaines avec leurs statistiques
  - Nombre d'éléments masqués et agrandis
  - Statut actif/pause pour chaque site
  - Boutons de réinitialisation et suppression
- **Trois modes activables** : Édition, Déplacement, Multi-sélection
- **Bouton Réinitialiser Tout** : Reset global avec confirmation
- **Page À Propos** : Guide intégré des fonctionnalités

### Notifications In-Page

- **Notifications animées** : Feedback immédiat pour chaque action
- **Barres d'actions flottantes** : Menu contextuel en multi-sélection
- **Surbrillances visuelles** : Aperçu des éléments avant action
- **Boîtes de sélection** : Rectangle semi-transparent pour multi-select

### Effets Visuels & Animations

- **Particules flottantes** : Animation de fond dans le popup
- **Effets 3D au survol** : Cartes inclinées dans les statistiques
- **Animations de compteur** : Décompte fluide des chiffres
- **Effets ripple** : Onde visuelle au clic des boutons
- **Transitions fluides** : Animations de disparition/apparition
- **Feedback tactile** : Changements de curseur et couleurs

---

## 🚀 Utilisation

### Démarrage Rapide

1. **Activez le mode édition**

   - Cliquez sur l'icône WebTune dans votre navigateur
   - Cliquez sur "Activer le mode édition"
   - Ou utilisez le raccourci `Ctrl+E` (ou `Cmd+E` sur Mac)

2. **Sélectionnez des éléments**

   - Survolez n'importe quel élément de la page
   - Un cadre bleu apparaît autour de l'élément survolé

3. **Masquez ou agrandissez**

   - **Clic simple** = Masquer l'élément
   - **Shift + Clic** = Agrandir l'élément
   - Les modifications sont sauvegardées automatiquement !

4. **Profitez du résultat**
   - Désactivez le mode édition
   - Vos modifications s'appliquent à chaque visite
   - Le site est maintenant nettoyé selon VOS besoins !

### Gestion des Sites

Dans le popup de l'extension :

- **Voir les statistiques** - Nombre de sites et éléments modifiés
- **Réinitialiser un site** - Remettre la page comme avant
- **Supprimer un site** - Retirer complètement de la liste
- **Tout réinitialiser** - Reset global de tous les sites

---

## ⌨️ Raccourcis Clavier

| Raccourci                  | Action                                                 |
| -------------------------- | ------------------------------------------------------ |
| `Ctrl+E` (Windows/Linux)   | Activer/Désactiver le mode édition                     |
| `Cmd+E` (Mac)              | Activer/Désactiver le mode édition                     |
| `Ctrl+Q` (Windows/Linux)   | Activer/Désactiver le mode déplacement                 |
| `Cmd+Q` (Mac)              | Activer/Désactiver le mode déplacement                 |
| `Ctrl+M` (Windows/Linux)   | Activer/Désactiver le mode multi-sélection             |
| `Cmd+M` (Mac)              | Activer/Désactiver le mode multi-sélection             |
| **Clic**                   | Masquer l'élément survolé (mode édition)               |
| **Shift+Clic**             | Agrandir l'élément survolé (mode édition)              |
| **Glisser-Déposer**        | Déplacer les éléments (mode déplacement)               |
| **Rectangle de sélection** | Sélectionner plusieurs éléments (mode multi-sélection) |

---

## 📍 Mode Déplacement

### Comment ça fonctionne ?

1. **Activation** : Appuyez sur `Ctrl+Q` pour activer le mode déplacement
2. **Survol** : Les éléments déplaçables s'affichent avec une bordure pointillée teal
3. **Sélection** : Cliquez et maintenez sur un élément pour le saisir (curseur devient "grabbing")
4. **Déplacement** : Déplacez la souris pour repositionner l'élément en temps réel
5. **Sauvegarde** : Au relâchement de la souris, la position est automatiquement sauvegardée

### Caractéristiques

- **Positioning Automatique** : Les éléments passent en `position: fixed` pour permettre le déplacement libre
- **Persistance** : Les positions sont sauvegardées par domaine (clé : `WebTune-drag-{domaine}`)
- **Visual Feedback** : L'élément en cours de déplacement a une ombre et une outline visible
- **Sauvegarde Auto** : Chaque position relâchée est immédiatement sauvegardée dans le stockage Chrome
- **Multi-éléments** : Vous pouvez déplacer plusieurs éléments différents sur la même page

### Exemple d'utilisation

```
Page d'accueil d'un site :
1. Appuyez Ctrl+Q
2. Survolez une banneau publicitaire → bordure teal apparaît
3. Cliquez et traînez-le vers le bas de la page
4. Relâchez la souris → position sauvegardée
5. À la prochaine visite, la banneau sera à la nouvelle position
```

---

## ⬚ Mode Multi-Sélection

### Comment ça fonctionne ?

1. **Activation** : Appuyez sur `Ctrl+M` pour activer le mode multi-sélection
2. **Dessiner une boîte** : Cliquez et glissez pour créer un rectangle de sélection
3. **Surbrillance** : Les éléments dans la boîte sont surlignés en violet
4. **Actions groupées** : Une barre d'actions apparaît avec 3 options :
   - 🚫 **Masquer tout** - Masquer tous les éléments sélectionnés d'un coup
   - ↔️ **Déplacer** - Déplacer tous les éléments ensemble
   - ❌ **Annuler** - Annuler la sélection

### Caractéristiques

- **Sélection Visual** : Rectangle semi-transparent avec bordure pointillée
- **Aperçu en Temps Réel** : Les éléments se surbrillancent pendant la sélection
- **Actions Groupées** : Masquez ou déplacez plusieurs éléments simultanément
- **Déplacement Synchronisé** : Tous les éléments se déplacent en bloc
- **Persistance** : Les modifications sont automatiquement sauvegardées
- **Feedback Utilisateur** : Compteur et notifications pour chaque action

### Exemple d'utilisation

```
Page d'actualités :
1. Appuyez Ctrl+M
2. Tracez un rectangle autour des banneurs publicitaires
3. Cliquez "Masquer tout" pour les supprimer ensemble
4. À la prochaine visite, tous les banners disparaissent
```

---

## 🎨 Cas d'Usage

### Sites d'actualités

- Masquez les bannières de cookies
- Supprimez les pop-ups d'abonnement
- Agrandissez les articles pour une meilleure lecture

### YouTube

- Masquez les suggestions indésirables
- Cachez les commentaires
- Agrandissez le lecteur vidéo

### Sites e-commerce

- Supprimez les publicités intrusives
- Masquez les éléments de tracking
- Agrandissez les descriptions de produits

### Sites d'entreprise

- Éliminez les widgets inutiles
- Masquez les chats support intrusifs
- Mettez en avant le contenu essentiel

---

## 🔧 Architecture Technique

### Fichiers

- **manifest.json** - Configuration de l'extension (permissions, scripts, commandes clavier)
- **background.js** - Service worker (gestion des commandes, nettoyage auto, mise à jour badge)
- **content.js** - Script injecté dans les pages (modes édition, déplacement, multi-sélection, détection dynamique)
- **content.css** - Styles pour les notifications, effets visuels, boîtes de sélection
- **popup.html** - Interface utilisateur du popup avec statistiques
- **popup.js** - Logique de l'interface, animations, communication avec content scripts
- **welcome.html** - Page d'accueil affichée lors de l'installation
- **welcome.js** - Script pour la page de bienvenue

### Stockage

Les données sont stockées via `chrome.storage.local` avec cette structure :

**Règles de modification (par domaine)**

```javascript
{
  "example.com": {
    "hidden": ["div.banner", "aside.sidebar"],
    "enlarged": ["article.main-content"],
    "active": true,
    "lastVisit": "2024-12-03"
  }
}
```

**Positions déplacées (clé séparée)**

```javascript
{
  "WebTune-drag-example.com": {
    "div.banner": {
      "left": "100px",
      "top": "200px",
      "position": "fixed",
      "zIndex": "999999"
    }
  }
}
```

### Sélecteurs CSS

L'extension génère des sélecteurs CSS intelligents et robustes :

- **Utilise les IDs** quand disponibles (`#elementId`)
- **Combine les classes principales** pour l'unicité (`div.class1.class2`)
- **Ajoute des indices** `:nth-of-type()` si nécessaire
- **Limite la profondeur** (max 4 niveaux) pour optimiser les performances
- **Gère les cas limites** (éléments sans ID ni classe)
- **Applique les sélecteurs dynamiquement** même après rechargement

### Détails de Fonctionnement

**Communication Message-Based**

- Les modes et actions communiquent via `chrome.runtime.sendMessage()`
- Le background.js orchestre les commandes clavier
- Les content scripts gèrent l'interaction avec la page

**Détection Dynamique (MutationObserver)**

- Observer surveille les changements du DOM (`childList`, `subtree`)
- Les règles s'appliquent automatiquement aux nouveaux éléments
- Optimisé pour les SPAs (Single Page Applications)

**Attributs de Suivi**

- `data-WebTune-hidden` - Marque les éléments masqués
- `data-WebTune-enlarged` - Marque les éléments agrandis
- `data-WebTune-moved` - Marque les éléments déplacés
- `data-WebTune-selected` - Marque les éléments sélectionnés (multi-select)
- `data-WebTune-highlight` - Marque les éléments en surbrillance
- `data-draggable` - Indique qu'un élément peut être dragué

**Styles Dynamiques**

- Mode édition : `cursor: crosshair`, outline bleu (`#3B82F6`)
- Mode déplacement : `cursor: grab`, outline teal pointillée (`#5AAFCA`)
- Mode multi-sélection : outline violet (`#6a5acd`)
- Éléments agrandis : `transform: scale(1.2)` avec `zIndex: 1000`
- Éléments déplacés : `position: fixed` avec `zIndex: 999999`

---

## 🛡️ Sécurité & Confidentialité

- ✅ **Aucune donnée envoyée** - Tout reste en local sur votre navigateur
- ✅ **Pas de tracking** - Aucune télémétrie ou analyse
- ✅ **Open Source** - Code transparent et auditable
- ✅ **Permissions minimales** - Seulement ce qui est nécessaire
- ✅ **Nettoyage automatique** - Suppression des anciennes données (90 jours)

### Permissions Utilisées

| Permission   | Raison                                              |
| ------------ | --------------------------------------------------- |
| `activeTab`  | Accéder à l'onglet actif pour les actions           |
| `storage`    | Sauvegarder vos configurations et préférences       |
| `tabs`       | Lister les onglets pour les commandes globales      |
| `alarms`     | Nettoyer les données anciennes (toutes les 7 jours) |
| `scripting`  | Injecter les scripts de modification dans les pages |
| `<all_urls>` | Fonctionner sur tous les sites web                  |

### Données Collectées

**Aucune donnée personnelle n'est collectée.** L'extension stocke uniquement :

- Les sélecteurs CSS des éléments modifiés
- Les positions des éléments déplacés
- La date de dernière visite de chaque site
- Les paramètres actif/pause par site

Toutes ces données restent **locales et privées** sur votre navigateur.

---

## 🐛 Dépannage

### L'extension ne fonctionne pas

- Vérifiez que le mode développeur est activé
- Rechargez l'extension depuis `chrome://extensions/`
- Vérifiez la console (F12) pour les erreurs
- Assurez-vous que les fichiers d'icônes existent (icons/)

### Les éléments ne sont pas masqués

- Actualisez la page après avoir fait vos modifications
- Vérifiez que le site est "Actif" dans le popup
- Certains sites utilisent du contenu dynamique qui peut contourner les règles
- Essayez de générer un nouveau sélecteur pour l'élément

### Le mode édition ne s'active pas

- Vérifiez que vous êtes sur une vraie page web (pas une page système ou chrome://)
- Rechargez la page et réessayez
- Utilisez le raccourci clavier `Ctrl+E`
- Vérifiez que le content script a été injecté (F12 > Console)

### Les positions draggées ne se sauvegardent pas

- Vérifiez que le mode déplacement est bien activé (`Ctrl+Q`)
- Relâchez proprement la souris après avoir déplacé l'élément
- Actualisez la page pour voir la sauvegarde

### Le mode multi-sélection ne fonctionne pas

- Appuyez sur `Ctrl+M` pour l'activer
- Tracez un rectangle d'au moins 10x10 pixels
- Les éléments doivent avoir leur centre dans la boîte de sélection

---

## 🚧 Limitations Connues

- Les sélecteurs peuvent être fragiles sur les sites avec structure changeante
- Certains sites très dynamiques (ex: SPAs) peuvent nécessiter plusieurs sélections
- Les iframes externes ne peuvent pas être modifiées (restriction navigateur)
- Les pages système du navigateur ne sont pas accessibles

---

## 🎯 Modes de Fonctionnement

### 1. Mode Édition (Ctrl+E)

- Sélection individuelle d'éléments
- Clic = Masquer, Shift+Clic = Agrandir
- Cadre bleu autour de l'élément survolé
- Notifications en temps réel

### 2. Mode Déplacement (Ctrl+Q)

- Glisser-déposer les éléments
- Cadre teal pointillé autour des éléments draggables
- Curseur "grab" pour indiquer la possibilité de déplacer
- Sauvegarde automatique de la position

### 3. Mode Multi-Sélection (Ctrl+M)

- Sélection par rectangle (boîte de sélection)
- Surlignage violet des éléments dans la zone
- Actions groupées (masquage/déplacement en bloc)
- Barre d'actions flottante avec options

---

## 🔮 Roadmap Future

- [ ] Export/Import des configurations par site
- [ ] Partage de configurations entre utilisateurs
- [ ] Mode "avant/après" pour comparaison visuelle
- [ ] Suggestions automatiques d'éléments à masquer (IA)
- [ ] Synchronisation cloud (optionnelle et sécurisée)
- [ ] Support des regex pour les sélecteurs avancés
- [ ] Historique des modifications avec undo/redo
- [ ] Interface des paramètres améliorée

---

## 📄 Licence

Ce projet est fourni "tel quel" à des fins éducatives.
Créé pour Platon Formation - Challenge "Nettoyez le web comme VOUS l'entendez !"

---

## 🤝 Contribution

Pour améliorer WebTune :

1. Testez sur différents sites
2. Signalez les bugs rencontrés
3. Proposez de nouvelles fonctionnalités
4. Partagez vos configurations favorites

---

## 📞 Support

Pour toute question ou problème :

- Consultez la section "Guide" dans l'extension
- Vérifiez les issues GitHub (si disponible)
- Contactez l'équipe Platon Formation

---

**Fait avec ❤️ pour un web plus propre et plus personnel !**"# WebTune01"
