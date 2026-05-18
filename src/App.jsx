import GraphInput from './components/GraphInput'
import GraphVisualization from './components/GraphVisualization'
import { Toaster } from 'react-hot-toast'
import ResultDisplay from './components/ResultDisplay'
import useGraphData from './hooks/useGraphData'
import useMatrixCalculation from './hooks/useMatrixCalculation'

import { useState } from 'react'

function App() {
  const { graphData, handleGraphGenerate, handleGraphUpdate, resetGraph } = useGraphData()
  const { matrix, steps, path, logs, loading, error, calculateMatrix, setMatrix, setSteps, setPath, setLogs } = useMatrixCalculation(graphData)
  const [modeActif, setModeActif] = useState(null)

  // Reset complet
  const handleFullReset = () => {
    resetGraph()
    setMatrix && setMatrix(null)
    setSteps && setSteps(null)
    setPath && setPath(null)
    setLogs && setLogs(null)
    setModeActif(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Algorithme de Cho-Demoucron
          </h1>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start min-h-[calc(100vh-80px)]">
          {/* Visualisation du graphe */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Bloc Création du graphe (affichable/masquable) */}
            <div>
              <GraphInput onGraphGenerate={handleGraphGenerate} onReset={handleFullReset} />
            </div>
            {/* Bloc Visualisation du graphe */}
            <div className="bg-white shadow sm:rounded-lg flex-1 min-h-[400px]">
              <GraphVisualization 
                graphData={graphData} 
                onGraphUpdate={handleGraphUpdate} 
                path={path} 
              />
            </div>
          </div>

          {/* Contrôles et résultats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-4 h-[calc(145vh-200px)] overflow-auto">
              <h2 className="text-lg font-semibold mb-4">Contrôles</h2>
              <div className="space-y-2">
                <button
                  className={`w-full px-4 py-2 rounded mb-2 disabled:opacity-50 transition-all font-semibold
                    ${modeActif === 'min' ? 'bg-green-600 text-white ring-2 ring-green-800' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  onClick={() => { setModeActif('min'); calculateMatrix('min') }}
                  disabled={!graphData || Object.keys(graphData?.edges || {}).length === 0}
                >
                  Calculer Min
                </button>
                <button
                  className={`w-full px-4 py-2 rounded disabled:opacity-50 transition-all font-semibold
                    ${modeActif === 'max' ? 'bg-purple-700 text-white ring-2 ring-purple-900' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                  onClick={() => { setModeActif('max'); calculateMatrix('max') }}
                  disabled={!graphData || Object.keys(graphData?.edges || {}).length === 0}
                >
                  Calculer Max
                </button>
              </div>

              {/* Résultats et étapes */}
              <ResultDisplay matrix={matrix} steps={steps} path={path} logs={logs} loading={loading} error={error} modeActif={modeActif} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App