# 🎯 CleanWeb - Extension de Nettoyage Web

> **Nettoyez le web comme VOUS l'entendez !**

Une extension de navigateur puissante qui permet de masquer ou agrandir les éléments indésirables sur vos sites préférés, avec sauvegarde automatique de vos choix.

---

## ✨ Fonctionnalités

### Core Features
- 🎯 **Mode Édition Interactif** - Sélectionnez visuellement les éléments à modifier
- 🚫 **Masquage d'Éléments** - Cachez définitivement les bannières, pubs, pop-ups
- 📐 **Agrandissement d'Éléments** - Mettez en avant le contenu important
- 💾 **Sauvegarde Persistante** - Vos choix sont mémorisés par domaine
- 🔄 **Gestion Facile** - Interface intuitive pour gérer tous vos sites

### Fonctionnalités Bonus
- ⌨️ **Raccourcis Clavier** - `Ctrl+E` pour activer le mode édition, `Alt+D` pour le mode déplacement
- 📊 **Statistiques** - Visualisez vos modifications par site
- ⏸️ **Pause Temporaire** - Désactivez le nettoyage sans perdre vos réglages
- 🔍 **Détection Dynamique** - Fonctionne même sur les éléments chargés après coup
- 🧹 **Nettoyage Auto** - Suppression des données anciennes (90 jours)
- 📍 **Mode Déplacement** - Repositionnez librement les éléments sur la page

---

## 📦 Installation

### Chrome / Edge / Brave

1. **Téléchargez les fichiers**
   ```
   cleanweb/
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
   - Sélectionnez le dossier `cleanweb/`
   - L'extension apparaît dans votre barre d'outils !

### Firefox

1. Créez les mêmes fichiers que pour Chrome
2. Allez sur `about:debugging#/runtime/this-firefox`
3. Cliquez sur "Charger un module complémentaire temporaire"
4. Sélectionnez le fichier `manifest.json`

---

## 🚀 Utilisation

### Démarrage Rapide

1. **Activez le mode édition**
   - Cliquez sur l'icône CleanWeb dans votre navigateur
   - Cliquez sur "✨ Activer le mode édition"
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

| Raccourci | Action |
|-----------|--------|
| `Ctrl+E` (Windows/Linux) | Activer/Désactiver le mode édition |
| `Cmd+E` (Mac) | Activer/Désactiver le mode édition |
| `Alt+D` | Activer/Désactiver le mode déplacement |
| **Clic** | Masquer l'élément survolé (mode édition) |
| **Shift+Clic** | Agrandir l'élément survolé (mode édition) |
| **Glisser-Déposer** | Déplacer les éléments (mode déplacement) |

---

## 📍 Mode Déplacement

### Comment ça fonctionne ?

1. **Activation** : Appuyez sur `Alt+D` pour activer le mode déplacement
2. **Survol** : Les éléments déplaçables s'affichent avec une bordure pointillée teal
3. **Sélection** : Cliquez et maintenez sur un élément pour le saisir (curseur devient "grabbing")
4. **Déplacement** : Déplacez la souris pour repositionner l'élément en temps réel
5. **Sauvegarde** : Au relâchement de la souris, la position est automatiquement sauvegardée

### Caractéristiques

- **Positioning Automatique** : Les éléments passent en `position: fixed` pour permettre le déplacement libre
- **Persistance** : Les positions sont sauvegardées par domaine (clé : `cleanweb-drag-{domaine}`)
- **Visual Feedback** : L'élément en cours de déplacement a une ombre et une outline visible
- **Sauvegarde Auto** : Chaque position relâchée est immédiatement sauvegardée dans le stockage Chrome
- **Multi-éléments** : Vous pouvez déplacer plusieurs éléments différents sur la même page

### Exemple d'utilisation

```
Page d'accueil d'un site :
1. Appuyez Alt+D
2. Survolez une banneau publicitaire → bordure teal apparaît
3. Cliquez et traînez-le vers le bas de la page
4. Relâchez la souris → position sauvegardée
5. À la prochaine visite, la banneau sera à la nouvelle position
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

- **manifest.json** - Configuration de l'extension (permissions, scripts)
- **background.js** - Service worker (gestion des commandes, nettoyage auto)
- **content.js** - Script injecté dans les pages (logique de sélection)
- **content.css** - Styles pour les notifications et effets visuels
- **popup.html** - Interface utilisateur du popup
- **popup.js** - Logique de l'interface et communication avec content script

### Stockage

Les données sont stockées via `chrome.storage.local` avec cette structure :
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

### Sélecteurs CSS

L'extension génère des sélecteurs CSS intelligents :
- Utilise les IDs quand disponibles
- Combine les classes principales
- Ajoute des indices `:nth-of-type()` si nécessaire
- Limite la profondeur pour optimiser les performances

---

## 🛡️ Sécurité & Confidentialité

- ✅ **Aucune donnée envoyée** - Tout reste en local sur votre navigateur
- ✅ **Pas de tracking** - Aucune télémétrie ou analyse
- ✅ **Open Source** - Code transparent et auditable
- ✅ **Permissions minimales** - Seulement ce qui est nécessaire
- ✅ **Nettoyage automatique** - Suppression des anciennes données (90 jours)

---

## 🐛 Dépannage

### L'extension ne fonctionne pas
- Vérifiez que le mode développeur est activé
- Rechargez l'extension depuis `chrome://extensions/`
- Vérifiez la console pour les erreurs

### Les éléments ne sont pas masqués
- Actualisez la page après avoir fait vos modifications
- Vérifiez que le site est "Actif" dans la liste
- Certains sites utilisent du contenu dynamique qui peut contourner les règles

### Le mode édition ne s'active pas
- Vérifiez que vous êtes sur une vraie page web (pas une page système)
- Rechargez la page et réessayez
- Utilisez le raccourci clavier `Ctrl+E`

---

## 🚧 Limitations Connues

- Les sélecteurs peuvent être fragiles sur les sites avec structure changeante
- Certains sites très dynamiques (ex: SPAs) peuvent nécessiter plusieurs sélections
- Les iframes externes ne peuvent pas être modifiées (restriction navigateur)
- Les pages système du navigateur ne sont pas accessibles

---

## 🔮 Roadmap Future

- [ ] Export/Import des configurations
- [ ] Partage de configurations entre utilisateurs
- [ ] Mode "avant/après" pour comparaison visuelle
- [ ] Suggestions automatiques d'éléments à masquer
- [ ] Synchronisation cloud (optionnelle)
- [ ] Support des regex pour les sélecteurs
- [ ] Historique des modifications avec undo/redo

---

## 📄 Licence

Ce projet est fourni "tel quel" à des fins éducatives.
Créé pour Platon Formation - Challenge "Nettoyez le web comme VOUS l'entendez !"

---

## 🤝 Contribution

Pour améliorer CleanWeb :
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

**Fait avec ❤️ pour un web plus propre et plus personnel !**"# CleanWeb01" 
