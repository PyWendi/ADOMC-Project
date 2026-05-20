import { useState } from 'react'
import GraphInput from '../components/GraphInput'
import GraphVisualization from '../components/GraphVisualization'
import ResultDisplay from '../components/ResultDisplay'
import useGraphData from '../hooks/useGraphData'
import useMatrixCalculation from '../hooks/useMatrixCalculation'
import { floydWarshall } from '../utils/demoucronUtils.js'

const algorithmOptions = [
  { value: 'demoucron-min', label: 'Cho-Demoucron Min' },
  { value: 'demoucron-max', label: 'Cho-Demoucron Max' }
]

const ChoDemoucronPage = () => {
  const { graphData, handleGraphGenerate, handleGraphUpdate, resetGraph } = useGraphData()
  const { matrix, steps, path, logs, loading, error, calculateMatrix } = useMatrixCalculation(graphData)
  const [algorithm, setAlgorithm] = useState('demoucron-min')
  const [isUndirected, setIsUndirected] = useState(false)
  const [fwMatrix, setFwMatrix] = useState(null)
  const [fwSteps, setFwSteps] = useState([])
  const [fwLoading, setFwLoading] = useState(false)
  const [fwError, setFwError] = useState(null)

  const isComputeDisabled = !graphData || Object.keys(graphData.edges || {}).length === 0

  const runFloyd = async () => {
    setFwLoading(true)
    setFwError(null)
    try {
      if (!graphData || !graphData.edges) {
        throw new Error('Aucun graphe valide.')
      }
      const result = floydWarshall(graphData.edges, isUndirected)
      setFwMatrix(result.matrix)
      setFwSteps(result.steps)
    } catch (err) {
      setFwError(err.message || 'Erreur lors du calcul Floyd-Warshall.')
    } finally {
      setFwLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cho-Demoucron (Min/Max)</h1>
          <p className="text-gray-600 mt-2">Calcule les chemins min/max sur un graphe orienté ou non orienté, puis compare avec Floyd-Warshall.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <GraphInput onGraphGenerate={handleGraphGenerate} onReset={resetGraph} />
            <div className="bg-white shadow sm:rounded-lg p-4 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Algorithme</label>
                  <select
                    className="w-full rounded border p-2"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  >
                    {algorithmOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => calculateMatrix(algorithm, isUndirected)}
                  disabled={isComputeDisabled}
                >
                  Exécuter {algorithmOptions.find((option) => option.value === algorithm)?.label}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="undirected"
                  type="checkbox"
                  checked={isUndirected}
                  onChange={(e) => setIsUndirected(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="undirected" className="text-sm text-gray-700">Traiter le graphe comme non orienté</label>
              </div>
              <div className="border-t pt-4">
                <button
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  onClick={runFloyd}
                  disabled={isComputeDisabled}
                >
                  Calculer Floyd-Warshall
                </button>
                {fwLoading && <p className="mt-3 text-sm text-blue-600">Calcul en cours...</p>}
                {fwError && <p className="mt-3 text-sm text-red-600">{fwError}</p>}
              </div>
            </div>

            <ResultDisplay matrix={matrix} steps={steps} path={path} logs={logs} loading={loading} error={error} modeActif={algorithm} />
          </div>

          <div className="space-y-6">
            <GraphVisualization graphData={graphData} onGraphUpdate={handleGraphUpdate} path={path} />
            <div className="bg-white shadow sm:rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Floyd-Warshall</h2>
              {fwMatrix ? (
                <div>
                  <div className="overflow-auto">
                    <table className="table-auto border-collapse w-full text-center text-xs mb-4">
                      <tbody>
                        {fwMatrix.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="border px-2 py-1">{cell === Infinity ? '∞' : cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500">La matrice ci-dessus montre les distances les plus courtes pour chaque paire de nœuds.</p>
                </div>
              ) : (
                <p className="text-gray-500">Clique sur « Calculer Floyd-Warshall » pour générer la matrice des distances.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChoDemoucronPage
