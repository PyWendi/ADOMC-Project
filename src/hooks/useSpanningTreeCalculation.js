import { useState } from 'react'
import { kruskal, prim, generateAdjacencyMatrix } from '../utils/demoucronUtils.js'

export default function useSpanningTreeCalculation(graphData) {
  const [matrix, setMatrix] = useState(null)
  const [steps, setSteps] = useState(null)
  const [path, setPath] = useState(null)
  const [logs, setLogs] = useState(null)
  const [algorithmActif, setAlgorithmActif] = useState('Kruskal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateSpanningTree = async (algorithm = 'Kruskal') => {
    setLoading(true)
    setError(null)
    try {
      if (!graphData || !graphData.edges || Object.keys(graphData.edges).length === 0) {
        throw new Error('Aucun graphe valide n’a été fourni.')
      }

      let result
      switch (algorithm) {
        case 'Kruskal':
          result = kruskal(graphData.edges)
          break
        case 'Prim':
          result = prim(graphData.edges)
          break
        default:
          throw new Error(`Algorithme inconnu : ${algorithm}`)
      }

      setMatrix(result.finalMatrix || generateAdjacencyMatrix(graphData.edges, true, true))
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
    calculateSpanningTree
  }
}
