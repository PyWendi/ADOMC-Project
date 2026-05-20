const algorithmLabels = {
  'demoucron-min': 'Cho-Demoucron Min',
  'demoucron-max': 'Cho-Demoucron Max',
  'BFS': 'Breadth-First Search',
  'DFS': 'Depth-First Search',
  'UCS': 'Uniform Cost Search',
  'A*': 'A* Search'
}

const formatCell = (cell) => {
  if (cell === Infinity || cell === -Infinity) return '∞'
  return cell != null ? cell : '∞'
}

const ResultDisplay = ({ matrix, steps, path, logs, structure, visitOrder, loading, error, modeActif }) => {
  const algorithmLabel = algorithmLabels[modeActif] || modeActif
  const isTraversal = modeActif === 'BFS' || modeActif === 'DFS'
  return (
    <div className="space-y-4 mt-6 lg:space-y-2">
      {!isTraversal ? (
        <div className="rounded">
          <h2 className="text-lg font-semibold mb-4">Matrice Finale {modeActif ? <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold uppercase">{algorithmLabel}</span> : null}</h2>
          {matrix ? (
            <table className="min-w-full">
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-4 py-2 text-center">
                        {formatCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className="text-gray-500">La matrice finale s'affichera ici</span>
          )}
        </div>
      ) : (
        <div className="rounded bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Résumé de la recherche {modeActif ? <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold uppercase">{algorithmLabel}</span> : null}</h2>
          {visitOrder && visitOrder.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Les poids sont ignorés pour BFS et DFS : le parcours se base uniquement sur l'ordre d'exploration.</div>
              <div><span className="font-semibold">Ordre de visite des nœuds :</span> {visitOrder.join(' → ')}</div>
              <div><span className="font-semibold">Structure utilisée :</span> {structure || (modeActif === 'BFS' ? 'File' : 'Pile')}</div>
            </div>
          ) : (
            <span className="text-gray-500">Les informations de parcours s'afficheront ici.</span>
          )}
        </div>
      )}

      {/* Affichage des Étapes */}
      <div className="rounded pt-4">
        <div className="bg-white z-10 pb-2">
          <h2 className="text-lg font-semibold">Étapes de l'Algorithme {modeActif ? <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold uppercase">{algorithmLabel}</span> : null}</h2>
        </div>
        <div className="space-y-4">
          {steps && steps.length > 0 ? (
            steps.map((step, index) => (
              <div key={index} >
                <div className="font-semibold text-gray-700 mb-1">{step.description || `Étape ${index + 1}`}</div>
                {step.logs && <div className="text-xs text-gray-500 mb-1 whitespace-pre-wrap">{step.logs}</div>}
                {!isTraversal && step.matrix && (
                  <div className="overflow-auto">
                    <table className="table-auto border-collapse w-full text-center text-xs mb-2">
                      <tbody>
                        {step.matrix.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="border px-1 py-0.5">
                                {formatCell(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          ) : (
            <span className="text-gray-500">Les étapes s'afficheront ici</span>
          )}
        </div>
      </div>

      {/* Affichage du Chemin Optimal */}
      <div className="rounded pt-2">
        <h2 className="text-lg font-semibold mb-2">Chemin Optimal</h2>
        <div className="text-blue-700 font-semibold">
          {
            (() => {
              if (!path || path.length === 0) return "";

              const nodes = [];
              const visited = new Set();

              let current = path[0].from;
              nodes.push(current);
              visited.add(current);

              for (const edge of path) {
                if (!visited.has(edge.to)) {
                  nodes.push(edge.to);
                  visited.add(edge.to);
                } else {
                  break;
                }
              }

              return `${nodes.join(' → ')} (${path.length} arête${path.length > 1 ? 's' : ''})`
            })()
          }
        </div>
      </div>

      {/* Affichage des logs globaux si présents */}
      {logs && (
        <div className="rounded pt-2">
          <h2 className="text-lg font-semibold mb-2">Démonstrations</h2>
          <pre className="text-xs text-gray-500 whitespace-pre-wrap">{logs}</pre>
        </div>
      )}

      {/* Affichage état de chargement et erreur */}
      {loading && <div className="text-center text-blue-500">Calcul en cours...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}

export default ResultDisplay
