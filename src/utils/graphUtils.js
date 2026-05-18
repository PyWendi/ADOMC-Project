// Fonctions utilitaires pour la manipulation des graphes

export function convertGraphDataToAdjacencyMatrix(graphData) {
  if (!graphData || !graphData.nodeCount) return []
  const size = graphData.nodeCount
  const matrix = Array.from({ length: size }, () => Array(size).fill(0))
  Object.entries(graphData.edges || {}).forEach(([key, weight]) => {
    const [from, to] = key.split('-').map(Number)
    matrix[from - 1][to - 1] = Number(weight)
  })
  return matrix
}