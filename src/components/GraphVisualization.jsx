import { useEffect, useRef } from 'react'
import * as go from 'gojs'
import toast from 'react-hot-toast'

const GraphVisualization = ({ graphData, onGraphUpdate, path }) => {
  const divRef = useRef(null)
  const diagramRef = useRef(null)
  const skipUpdateRef = useRef(false)

  // Initialisation du diagramme une seule fois
  useEffect(() => {
    if (!divRef.current || diagramRef.current) return

    console.log('GraphVisualization - Première initialisation du diagramme')
    const $ = go.GraphObject.make
    const diagram = $(go.Diagram, divRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      // Pas de layout automatique : disposition libre des nœuds !
      allowDelete: true,
      allowLink: true,
      allowRelink: true,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      model: new go.GraphLinksModel([], []) // Initialiser avec un modèle vide
    })

    // Style des nœuds
    diagram.nodeTemplate = $(go.Node, "Auto",
      // Bind la position pour rendre le drag & drop persistant
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Circle", {
        fill: "white",
        stroke: "#2563eb",
        strokeWidth: 2,
        width: 40,
        height: 40
      }),
      $(go.TextBlock, {
        margin: 8,
        font: "bold 14px sans-serif"
      },
      new go.Binding("text", "key"))
    )

    // Style des liens
    diagram.linkTemplate = $(go.Link,
      {
        curve: go.Link.Bezier,
        relinkableFrom: true,
        relinkableTo: true,
      },
      // Lien principal
      $(go.Shape, {
        stroke: "#4b5563",
        strokeWidth: 2
      },
      new go.Binding('stroke', 'color').makeTwoWay()),
      // Flèche de destination
      $(go.Shape, {
        toArrow: "Standard",
        stroke: "#4b5563",
        fill: "#4b5563"
      }),
      // Label du poids
      $(go.Panel, "Auto",
        {
          segmentIndex: NaN,
          segmentFraction: 0.5,
          segmentOffset: new go.Point(0, -10)
        },
        $(go.Shape, "RoundedRectangle", {
          fill: "white",
          stroke: "#4b5563"
        }),
        $(go.TextBlock, {
          margin: 3,
          font: "12px sans-serif",
          editable: true
        },
        new go.Binding("text", "weight").makeTwoWay())
      )
    )

    // Activer les modifications
    diagram.allowDelete = true
    diagram.allowLink = true
    diagram.allowRelink = true

    // Toast rapide à chaque suppression (facultatif mais stylé)
    diagram.addDiagramListener('SelectionDeleted', (e) => {
      const part = e.subject.first();
      if (!part) return;
      const type = part instanceof go.Node ? 'Nœud' : 'Arête';
      toast.success(`${type} supprimé avec succès !`);
    })

    // Synchronisation avec le state React
    diagram.addModelChangedListener((e) => {
      if (!e.isTransactionFinished || !onGraphUpdate || skipUpdateRef.current) return
      
      const nodes = diagram.model.nodeDataArray
      const links = diagram.model.linkDataArray
      
      const updatedGraphData = {
        nodeCount: nodes.length,
        edges: links.reduce((acc, link) => {
          if (link.from && link.to && link.weight) {
            acc[`${link.from}-${link.to}`] = link.weight
          }
          return acc
        }, {})
      }
      
      // Éviter les mises à jour en cascade
      if (JSON.stringify(updatedGraphData) !== JSON.stringify(graphData)) {
        console.log('GraphVisualization - Mise à jour du graphe:', updatedGraphData)
        onGraphUpdate(updatedGraphData)
      }
    })

    diagramRef.current = diagram

    return () => {
      console.log('GraphVisualization - Nettoyage final du diagramme')
      if (diagram) {
        diagram.div = null
      }
      diagramRef.current = null
    }
  }, [onGraphUpdate])

  // Mise à jour des données du graphe
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    
    // Si graphData est null, clear le diagramme
    if (!graphData) {
      diagram.model.startTransaction('clear');
      diagram.model.nodeDataArray = [];
      diagram.model.linkDataArray = [];
      diagram.model.commitTransaction('clear');
      return;
    }
    console.log('GraphVisualization - Mise à jour des données du graphe:', graphData);
    try {
      skipUpdateRef.current = true
      
      // Générer les données des nœuds en conservant la position si elle existe
      const oldNodes = diagram.model.nodeDataArray || [];
      const nodes = Array.from({ length: graphData.nodeCount }, (_, i) => {
        const key = (i + 1).toString();
        const oldNode = oldNodes.find(n => n.key === key);
        return {
          key,
          // Si une position existe, la conserver, sinon placer en grille
          loc: oldNode && oldNode.loc ? oldNode.loc : go.Point.stringify(new go.Point((i % 3) * 100, Math.floor(i / 3) * 100))
        };
      });

      const links = Object.entries(graphData.edges || {}).map(([key, weight]) => {
        const [from, to] = key.split('-');
        return {
          from,
          to,
          weight: weight.toString()
        };
      });

      // Mettre à jour le modèle de manière sûre
      const model = diagram.model
      model.startTransaction('update data')
      model.nodeDataArray = nodes
      model.linkDataArray = links
      model.commitTransaction('update data')

      // Réorganiser le graphe
      diagram.layoutDiagram(true)

      console.log('GraphVisualization - Données mises à jour avec succès')
      skipUpdateRef.current = false
    } catch (error) {
      console.error('GraphVisualization - Erreur lors de la mise à jour:', error)
      skipUpdateRef.current = false
    }
  }, [graphData, path])

  // Coloration du chemin optimal à chaque changement de path ou de graphe
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    // Reset couleur de tous les liens
    diagram.links.each(link => {
      diagram.model.setDataProperty(link.data, 'color', '#4b5563');
    });

    // Colorer le chemin optimal
    if (path && Array.isArray(path) && path.length > 0) {
      path.forEach(edge => {
        diagram.links.each(link => {
          if (
            String(link.data.from) === String(edge.from) &&
            String(link.data.to) === String(edge.to)
          ) {
            diagram.model.setDataProperty(link.data, 'color', '#22c55e'); // vert
          }
        });
      });
    }
  }, [graphData, path]);

  return (
    <div className="bg-white shadow sm:rounded-lg p-4">
      {/*<ConfirmModal
        open={showConfirm}
        title={pendingType === 'nœud' ? 'Supprimer le nœud' : 'Supprimer l\'arête'}
        message={`Êtes-vous sûr de vouloir supprimer ce ${pendingType} ?`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Confirmer"
        cancelText="Annuler"
      /> */}
      <h2 className="text-lg font-semibold mb-4">Visualisation du Graphe</h2>
      <div 
        ref={divRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff'
        }}
        className="rounded-lg"
      />
      <div className="mt-2 text-sm text-gray-500">
        <p>• Double-cliquez sur un poids pour le modifier</p>
        <p>• Supprimez un nœud ou une arête avec la touche Suppr</p>
        <p>• Déplacez les nœuds pour réorganiser le graphe</p>
        <p>• Utilisez la molette pour zoomer</p>
      </div>
    </div>
  )
}

export default GraphVisualization
