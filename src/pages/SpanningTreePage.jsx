import GraphInput from '../components/GraphInput'
import GraphVisualization from '../components/GraphVisualization'
import ResultDisplay from '../components/ResultDisplay'
import useGraphData from '../hooks/useGraphData'
import useSpanningTreeCalculation from '../hooks/useSpanningTreeCalculation'

const algorithmOptions = [
  { value: 'Kruskal', label: 'Kruskal' },
  { value: 'Prim', label: 'Prim' }
]

const SpanningTreePage = () => {
  const { graphData, handleGraphGenerate, handleGraphUpdate, resetGraph } = useGraphData()
  const {
    matrix,
    steps,
    path,
    logs,
    loading,
    error,
    algorithmActif,
    setAlgorithmActif,
    calculateSpanningTree
  } = useSpanningTreeCalculation(graphData)

  const isComputeDisabled = !graphData || Object.keys(graphData.edges || {}).length === 0

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Arbres couvrants</h1>
          <p className="text-gray-600 mt-2">Compare Kruskal et Prim et visualise les arêtes sélectionnées pour l’arbre couvrant minimal.</p>
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
                  onClick={() => calculateSpanningTree(algorithmActif)}
                  disabled={isComputeDisabled}
                >
                  Exécuter {algorithmOptions.find((option) => option.value === algorithmActif)?.label}
                </button>
              </div>
            </div>
            <ResultDisplay matrix={matrix} steps={steps} path={path} logs={logs} loading={loading} error={error} modeActif={algorithmActif} />
          </div>

          <div className="space-y-6">
            <GraphVisualization graphData={graphData} onGraphUpdate={handleGraphUpdate} path={path} />
            <div className="bg-white shadow sm:rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Résultats</h2>
              <p className="text-gray-600">Les arêtes sélectionnées sont mises en évidence dans le graphe.</p>
              <p className="text-sm text-gray-500 mt-3">Si le graphe n’est pas connecté, l’algorithme peut ne pas construire un arbre couvrant complet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpanningTreePage
