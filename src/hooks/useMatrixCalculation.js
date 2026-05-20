import { useState, useCallback } from 'react'
import {
  extractIndividualIds,
  transformNodeLinks,
  decodeMatrix,
  generateAdjacencyMatrix,
  Demoucron,
  DemoucronMaxFixed,
  breadthFirstSearch,
  depthFirstSearch,
  uniformCostSearch
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
  const calculateMatrix = async (algorithm = 'demoucron-min', isUndirected = false) => {
    setLoading(true)
    setError(null)
    console.log("Data to use", graphData)

    try {
      if (!graphData || !graphData.edges || Object.keys(graphData.edges).length === 0) {
        throw new Error('Aucun graphe valide n’a été fourni.')
      }

      let result
      const adjacencyMatrix = generateAdjacencyMatrix(graphData.edges, algorithm === 'demoucron-min' || algorithm === 'demoucron-max', isUndirected)
      const ids = extractIndividualIds(graphData.edges)

      switch (algorithm) {
        case 'demoucron-min':
          result = Demoucron(ids.length, adjacencyMatrix, true)
            result.steps.forEach((element, index) => {
              // Some implementations previously serialized matrices to JSON strings.
              // Support both serialized string and already-cloned-array formats.
              if (typeof element.matrix === 'string') {
                const array = decodeMatrix(element.matrix)
                result.steps[index].matrix = array
              } else {
                result.steps[index].matrix = element.matrix
              }
            })
          break

        case 'demoucron-max':
          result = Demoucron(ids.length, adjacencyMatrix, false)
          break

        case 'BFS':
          result = breadthFirstSearch(graphData.edges)
          break

        case 'DFS':
          result = depthFirstSearch(graphData.edges)
          break

        case 'UCS':
          result = uniformCostSearch(graphData.edges)
          break

        default:
          throw new Error(`Algorithme inconnu : ${algorithm}`)
      }

      setMatrix(result.finalMatrix || adjacencyMatrix)
      setSteps(result.steps || [])
      setPath(result.path || [])
      setLogs(result.logs || null)
      setMode(algorithm)
    } catch (err) {
      console.log(err)
      setError(err.message || 'Erreur lors du calcul. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return { matrix, steps, path, logs, mode, loading, error, calculateMatrix }
}

