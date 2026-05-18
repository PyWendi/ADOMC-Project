# Frontend Cho-Demoucron

Interface web pour la visualisation et l’exécution de l’algorithme de Cho-Demoucron (min/max path).

## Fonctionnalités principales
- Création interactive de graphes orientés pondérés
- Visualisation graphique (GoJS)
- Calcul du chemin optimal (min ou max) via backend
- Affichage dynamique : matrice finale, étapes détaillées, chemin optimal, logs
- UI/UX moderne, responsive, expérience utilisateur fluide

## Intégration Backend
- **Le backend doit fournir une API REST** pour le calcul min/max.
- **Point d’appel attendu** (exemple) :
  - `POST /api/calcul?mode=min` ou `mode=max`
  - Body : `{ graph: { nodes: [...], edges: [...] } }`
  - Réponse JSON attendue :
    ```json
    {
      "matrix": [[...]],
      "steps": [{ "description": "...", "matrix": [[...]], "logs": "..." }, ...],
      "path": [{ "from": 1, "to": 2 }, ...],
      "logs": "...",
      "mode": "min" // ou "max"
    }
    ```
- **Le hook `useMatrixCalculation.js`** contient le squelette d’appel API à compléter (`fetch` ou `axios`).

## Points d’entrée principaux
- `src/App.jsx` : structure de l’interface, gestion globale des états
- `src/components/GraphInput.jsx` : création/toggle du graphe
- `src/components/GraphVisualization.jsx` : affichage interactif du graphe
- `src/components/ResultDisplay.jsx` : affichage des résultats et étapes
- `src/hooks/useMatrixCalculation.js` : gestion de l’appel backend (à intégrer)

## Démarrage
```bash
npm install
npm run dev
```

## À faire côté backend
- Brancher l’URL du backend réel dans `useMatrixCalculation.js`
- Adapter le format de réponse si besoin (voir ci-dessus)

## Nettoyage effectué
- Faux backend supprimé (`src/services/api.js`)
- Code et dépendances inutiles nettoyés
- Prêt pour intégration backend réelle

---
**Contact** : voir le code ou contacter le responsable frontend pour toute question d’intégration.
