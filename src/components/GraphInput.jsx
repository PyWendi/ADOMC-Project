import { useState, useCallback } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

const GraphInput = ({ onGraphGenerate, onReset }) => {
  const [nodeCount, setNodeCount] = useState(0)
  const [showEdgeInputs, setShowEdgeInputs] = useState(false)
  const [edges, setEdges] = useState({})

  const handleCreateGraph = useCallback(() => {
    console.log('GraphInput - handleCreateGraph avec nodeCount:', nodeCount)
    if (nodeCount > 0) {
      setShowEdgeInputs(true)
      setEdges({})
      // Générer le graphe initial sans arêtes
      onGraphGenerate({
        nodeCount,
        edges: {}
      })
    }
  }, [nodeCount, onGraphGenerate])

  const handleEdgeChange = useCallback((from, to, value) => {
    const numValue = value === '' ? '' : Number(value);
    setEdges(prev => {
      const newEdges = { ...prev };
      if (value === '') {
        delete newEdges[`${from}-${to}`];
      } else {
        newEdges[`${from}-${to}`] = numValue;
      }
      onGraphGenerate({
        nodeCount,
        edges: newEdges
      });
      return newEdges;
    });
  }, [nodeCount, onGraphGenerate]);

  const handleReset = useCallback(() => {
    setNodeCount(0);
    setShowEdgeInputs(false);
    setEdges({});
    onGraphGenerate(null);
    if (onReset) onReset();
    // Afficher la notification toast
    import('react-hot-toast').then(({ toast }) => toast.success('Graphe réinitialisé !'));
  }, [onGraphGenerate, onReset]);

  const handleNodeCountChange = useCallback((value) => {
    const count = parseInt(value, 10)
    if (isNaN(count) || count < 0) {
      setNodeCount(0);
      setShowEdgeInputs(false);
      setEdges({});
      onGraphGenerate(null);
      return;
    }
    setNodeCount(count);
    if (count === 0) {
      setShowEdgeInputs(false);
      setEdges({});
      onGraphGenerate(null);
    }
  }, [onGraphGenerate]);

  const renderEdgeInputs = useCallback(() => {
    console.log('GraphInput - renderEdgeInputs pour nodeCount:', nodeCount)
    const inputs = []
    for (let i = 1; i <= nodeCount; i++) {
      for (let j = 1; j <= nodeCount; j++) {
        if (i !== j) {
          inputs.push(
            <div key={`${i}-${j}`} className="flex items-center space-x-2 mb-2">
              <span className="w-20">Nœud {i} → {j}:</span>
              <input
                type="number"
                min="0"
                className="border rounded p-1 w-24"
                placeholder="Poids"
                value={edges[`${i}-${j}`] || ''}
                onChange={(e) => handleEdgeChange(i, j, e.target.value)}
              />
            </div>
          )
        }
      }
    }
    return inputs
  }, [nodeCount, edges, handleEdgeChange])

  console.log('GraphInput - Rendu avec état:', { nodeCount, showEdgeInputs, edges })
  return (
    <div className="bg-white shadow sm:rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Création du Graphe</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="number"
          min="1"
          placeholder="Nombre de nœuds"
          className="border rounded p-2"
          value={nodeCount || ''}
          onChange={(e) => handleNodeCountChange(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
          onClick={handleCreateGraph}
          disabled={nodeCount <= 0}
        >
          Créer le graphe
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleReset}
        >
          Réinitialiser
        </button>
      </div>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          showEdgeInputs ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <h3 className="text-md font-semibold mb-3">Valeurs des Arêtes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderEdgeInputs()}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowEdgeInputs(prev => !prev)}
          className="text-blue-500 hover:text-blue-700 transition-all p-1"
          aria-label="Afficher/Masquer les inputs"
        >
          {showEdgeInputs ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default GraphInput
