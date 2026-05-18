import { useState, useCallback } from 'react'
import {
  extractIndividualIds,
  transformNodeLinks,
  decodeMatrix,
  generateAdjacencyMatrix,
  Demoucron,
  DemoucronMaxFixed
} from "../utils/demoucronUtils.js"

/**
 * Hook personnalisé pour la gestion du calcul de matrices et d'étapes de l'algorithme
 * Fournit :
 *   - matrix : la matrice d'adjacence ou résultat
 *   - steps : les étapes de calcul de l'algorithme
 *   - calculateMatrix : fonction pour lancer le calcul (API ou local)
 */
// TODO: Remplacer l'URL par celle du backend réel
// Exemple d'appel API pour calculer la matrice
// import axios from 'axios' (si besoin)


export default function useMatrixCalculation(graphData) {
  const [matrix, setMatrix] = useState(null)
  const [steps, setSteps] = useState(null)
  const [path, setPath] = useState(null)
  const [logs, setLogs] = useState(null)
  const [mode, setMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // type: 'min' ou 'max'
  const calculateMatrix = async (mode = 'min') => {
    setLoading(true)
    setError(null)
    console.log("Data to use", graphData);
    try {
      // TODO: Remplacer l'URL par celle du backend réel
      // Exemple avec fetch :
      // const response = await fetch(`http://localhost:5000/api/calcul?mode=${mode}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ graph: graphData })
      // })
      // const result = await response.json()
      // setMatrix(result.matrix)
      // setSteps(result.steps)
      // setPath(result.path)
      // setLogs(result.logs)
      // setMode(result.mode)

      // Pour l'instant, tout est réinitialisé

      // console.log("Before matrix calculation")
      let adjacencyMatrixMin = generateAdjacencyMatrix(graphData.edges, mode == "min");
      const ids = extractIndividualIds(graphData.edges)
      const result = mode == "min" ? Demoucron(ids.length, adjacencyMatrixMin, true) : DemoucronMaxFixed(adjacencyMatrixMin)

      if(mode == "min"){
        /* 
        Suite a un probleme de referencement de tableau en javascrypt
        J'ai du stringifier les matrices puis de les extraire pour pouvoir les afficher et les traiter
        */
        result.steps.forEach((element, index) => {
          const array = decodeMatrix(element.matrix)
          result.steps[index].matrix = array
        });
      }

      setMatrix(result.finalMatrix)
      setSteps(result.steps)
      setPath(result.path)
      setLogs(null)
      setMode(mode)
    } catch (err) {
      console.log(err)
      setError('Erreur lors du calcul. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return { matrix, steps, path, logs, mode, loading, error, calculateMatrix }
}

