import { useMemo } from 'react'
import GraphInput from '../components/GraphInput'
import GraphVisualization from '../components/GraphVisualization'
import ResultDisplay from '../components/ResultDisplay'
import useGraphData from '../hooks/useGraphData'
import useGraphAlgorithm from '../hooks/useGraphAlgorithm'

const algorithmOptions = [
  { value: 'BFS', label: 'Breadth-First Search' },
  { value: 'DFS', label: 'Depth-First Search' },
  { value: 'UCS', label: 'Uniform Cost Search' },
  { value: 'A*', label: 'A* Search' }
]

const SearchPage = () => {
  const { graphData, handleGraphGenerate, handleGraphUpdate, resetGraph } = useGraphData()
  const {
    matrix,
    steps,
    path,
    logs,
    structure,
    visitOrder,
    loading,
    error,
    algorithmActif,
    setAlgorithmActif,
    calculateAlgorithm
  } = useGraphAlgorithm(graphData)

  const isComputeDisabled = !graphData || Object.keys(graphData.edges || {}).length === 0
  const selectedAlgorithm = algorithmOptions.find((option) => option.value === algorithmActif)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recherche aveugle & optimale</h1>
          <p className="text-gray-600 mt-2">Utilise BFS, DFS, UCS ou A* pour explorer ton graphe et visualiser le chemin trouvé.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <GraphInput onGraphGenerate={handleGraphGenerate} onReset={resetGraph} />
            <div className="bg-white shadow sm:rounded-lg p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Algorithme</label>
                  <select
                    className="w-full rounded border p-2"
                    value={algorithmActif}
                    onChange={(e) => setAlgorithmActif(e.target.value)}
                  >
                    {algorithmOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => calculateAlgorithm(algorithmActif)}
                  disabled={isComputeDisabled}
                >
                  Exécuter {selectedAlgorithm?.label}
                </button>
              </div>
            </div>
            <ResultDisplay matrix={matrix} steps={steps} path={path} logs={logs} structure={structure} visitOrder={visitOrder} loading={loading} error={error} modeActif={algorithmActif} />
          </div>

          <div className="space-y-6">
            <GraphVisualization graphData={graphData} onGraphUpdate={handleGraphUpdate} path={path} />
            <div className="bg-white shadow sm:rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Conseils</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Définis un graphe puis sélectionne un algorithme.</li>
                <li>La visualisation montre le chemin choisi dans le graphe.</li>
                <li>Pour A*, le graphe doit avoir des poids positifs pour être pertinent.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
