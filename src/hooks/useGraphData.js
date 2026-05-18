import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour la gestion du graphe (état + logique métier)
 * Fournit :
 *   - graphData : état courant du graphe
 *   - handleGraphGenerate : pour créer ou réinitialiser le graphe
 *   - handleGraphUpdate : pour mettre à jour le graphe (ex : drag/drop, suppression, etc)
 *   - resetGraph : reset complet
 */
export default function useGraphData() {
  const [graphData, setGraphData] = useState(null)

  // Génère un nouveau graphe ou le réinitialise
  const handleGraphGenerate = useCallback((data) => {
    if (data === null || (data.nodeCount === 0 && Object.keys(data.edges || {}).length === 0)) {
      setGraphData(null)
    } else {
      setGraphData(data)
    }
  }, [])

  // Met à jour le graphe (ex : après déplacement/suppression d'un nœud/arête)
  const handleGraphUpdate = useCallback((updatedData) => {
    if (!updatedData || (updatedData.nodeCount === 0 && Object.keys(updatedData.edges || {}).length === 0)) {
      setGraphData(null)
      return
    }
    setGraphData(updatedData)
  }, [])

  // Reset complet
  const resetGraph = useCallback(() => {
    setGraphData(null)
  }, [])

  return {
    graphData,
    handleGraphGenerate,
    handleGraphUpdate,
    resetGraph
  }
}
