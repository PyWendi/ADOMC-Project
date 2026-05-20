import { useState } from 'react'
import {
  breadthFirstSearch,
  depthFirstSearch,
  uniformCostSearch,
  aStarSearch,
  generateAdjacencyMatrix
} from '../utils/demoucronUtils.js'

export default function useGraphAlgorithm(graphData) {
  const [matrix, setMatrix] = useState(null)
  const [steps, setSteps] = useState(null)
  const [path, setPath] = useState(null)
  const [logs, setLogs] = useState(null)
  const [algorithmActif, setAlgorithmActif] = useState('BFS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateAlgorithm = async (algorithm = 'BFS', isUndirected = false) => {
    setLoading(true)
    setError(null)
    try {
      if (!graphData || !graphData.edges || Object.keys(graphData.edges).length === 0) {
        throw new Error('Aucun graphe valide n’a été fourni.')
      }

      let result
      switch (algorithm) {
        case 'BFS':
          result = breadthFirstSearch(graphData.edges, isUndirected)
          break
        case 'DFS':
          result = depthFirstSearch(graphData.edges, isUndirected)
          break
        case 'UCS':
          result = uniformCostSearch(graphData.edges, isUndirected)
          break
        case 'A*':
          result = aStarSearch(graphData.edges, isUndirected)
          break
        default:
          throw new Error(`Algorithme inconnu : ${algorithm}`)
      }

      setMatrix(result.finalMatrix || generateAdjacencyMatrix(graphData.edges, true, isUndirected))
      setSteps(result.steps || [])
      setPath(result.path || [])
      setLogs(result.logs || null)
      setAlgorithmActif(algorithm)
    } catch (err) {
      setError(err.message || 'Erreur lors du calcul. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return {
    matrix,
    steps,
    path,
    logs,
    loading,
    error,
    algorithmActif,
    setAlgorithmActif,
    calculateAlgorithm
  }
}
