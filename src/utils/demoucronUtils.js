// node shape
/**
 * Our node will contain the following object
 * {
 *  node: Array(Object),
 *  nodeLink: Array(Object)
 * }
 * 
 * Object 1: {
 *  id: node id
 *  loc: (X Y)
 *  text: node name
 * }
 * 
 * Object 2: {
 *  from : id of current node
 *  to: id of next node
 *  value: value of the arc
 * }
 * 
 * FInal output should be like the following
 * {
 *  path: [ids]
 * }
 */


/**
 * Collect de donnee et creation du tableau
 */
let nodes = {
    node: [
        {"id":1,"loc":"120 120","text":"v1"},
        {"id":2,"loc":"330 120","text":"v2"},
        {"id":3,"loc":"226 376","text":"v3"},
        {"id":4,"loc":"60 276","text":"v4"},
        {"id":5,"loc":"60 276","text":"v5"},
        {"id":6,"loc":"60 276","text":"v6"},
        // {"id":7,"loc":"60 276","text":"v7"}
    ],
    nodeLink: [
        {"from":1,"to":2,"value":3},
        {"from":1,"to":3,"value":8},
        {"from":1,"to":4,"value":6},
        {"from":2,"to":4,"value":2},
        {"from":2,"to":5,"value":6},
        {"from":3,"to":5,"value":1},
        {"from":4,"to":3,"value":2},
        {"from":4,"to":6,"value":7},
        {"from":5,"to":6,"value":2},
        // {"from":6,"to":7,"value":4},
    ],
}

export const extractIndividualIds = (obj) => {
    const result = new Set();
    
    Object.keys(obj).forEach(key => {
        const [from, to] = key.split('-');
        result.add(from);
        result.add(to);
    });
    
    return Array.from(result);
}

export function transformNodeLinks(nodeLinks) {
    return Object.entries(nodeLinks).map(([key, value]) => ({
        from: parseInt(key.split('-')[0]),
        to: parseInt(key.split('-')[1]),
        value: parseInt(value)
    }));
}


export function generateAdjacencyMatrix(nodeElement, isMin=true, isUndirected=false) {
    const ids = extractIndividualIds(nodeElement);
    const size = ids.length;
    const matrix = [];
    const value_to_fill = isMin ? Infinity : -Infinity
    // Initialisation de la matrice
    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size).fill(value_to_fill);
    }

    // Mapping id -> index pour accéder facilement aux lignes/colonnes
    const idToIndex = {};
    ids.forEach((id, index) => {
        idToIndex[id] = index;
    });

    // Remplir la matrice avec les poids
    const nodeLink = transformNodeLinks(nodeElement)
    nodeLink.forEach(link => {
        const fromIndex = idToIndex[link.from];
        const toIndex = idToIndex[link.to];
        matrix[fromIndex][toIndex] = link.value;
        if (isUndirected) {
            matrix[toIndex][fromIndex] = link.value;
        }
    });

    return matrix;
}

export function buildAdjacencyList(nodeElement, isUndirected = false) {
    const edges = transformNodeLinks(nodeElement)
    const adjacency = {}

    const pushEdge = (from, to, value) => {
        if (!adjacency[from]) adjacency[from] = []
        adjacency[from].push({ to, value })
    }

    edges.forEach(({ from, to, value }) => {
        pushEdge(from, to, value)
        if (isUndirected) {
            pushEdge(to, from, value)
        }
    })

    Object.values(adjacency).forEach(neighbors => {
        neighbors.sort((a, b) => a.to - b.to)
    })

    return adjacency
}

export function getSortedNodeIds(nodeElement) {
    return extractIndividualIds(nodeElement)
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id))
        .sort((a, b) => a - b)
}

export function pathFromNodeSequence(path) {
    if (!path || path.length < 2) return []
    return path.slice(0, -1).map((node, index) => ({ from: node, to: path[index + 1] }))
}

export function breadthFirstSearch(nodeElement, isUndirected = false) {
    const ids = getSortedNodeIds(nodeElement)
    const adjacency = buildAdjacencyList(nodeElement, isUndirected)
    const start = ids[0]
    const target = ids[ids.length - 1]
    const queue = [[start]]
    const visited = new Set([start])
    const steps = [
        {
            description: `Initialisation de BFS`,
            logs: `Structure: File\nFile initiale: [${start}]\nVisité: []`
        }
    ]
    const visitOrder = []

    while (queue.length > 0) {
        const currentPath = queue.shift()
        const current = currentPath[currentPath.length - 1]
        visitOrder.push(current)

        const queueState = queue.map((p) => p[p.length - 1])
        steps.push({
            description: `Traitement du nœud ${current}`,
            logs: `Structure: File\nFile actuelle: [${[current, ...queueState].join(', ')}]\nOrdre de visite: [${visitOrder.join(' → ')}]`
        })

        if (current === target) {
            const pathResult = pathFromNodeSequence(currentPath)
            steps.push({
                description: `Cible ${target} atteinte`,
                logs: `Chemin trouvé : ${currentPath.join(' → ')}\nLongueur : ${currentPath.length - 1} arêtes`
            })

            return {
                path: pathResult,
                finalMatrix: null,
                structure: 'File',
                visitOrder,
                steps,
                logs: `Ordre de visite : ${visitOrder.join(' → ')}`
            }
        }

        const neighbors = adjacency[current] || []
        for (const { to } of neighbors) {
            if (!visited.has(to)) {
                visited.add(to)
                queue.push([...currentPath, to])
            }
        }
    }

    steps.push({
        description: `Aucun chemin trouvé`,
        logs: `Structure: File\nFile vide\nOrdre de visite: [${visitOrder.join(' → ')}]`
    })

    return {
        path: [],
        finalMatrix: null,
        structure: 'File',
        visitOrder,
        steps,
        logs: `Ordre de visite : ${visitOrder.join(' → ')}`
    }
}

export function depthFirstSearch(nodeElement, isUndirected = false) {
    const ids = getSortedNodeIds(nodeElement)
    const adjacency = buildAdjacencyList(nodeElement, isUndirected)
    const start = ids[0]
    const target = ids[ids.length - 1]
    const stack = [[start]]
    const visited = new Set()
    const steps = [
        {
            description: `Initialisation de DFS`,
            logs: `Structure: Pile\nPile initiale: [${start}]\nVisité: []`
        }
    ]
    const visitOrder = []

    while (stack.length > 0) {
        const currentPath = stack.pop()
        const current = currentPath[currentPath.length - 1]

        if (visited.has(current)) continue
        visited.add(current)
        visitOrder.push(current)

        const stackState = stack.map((p) => p[p.length - 1])
        steps.push({
            description: `Dépile ${current}`,
            logs: `Structure: Pile\nPile actuelle: [${[current, ...stackState].join(', ')}]\nOrdre de visite: [${visitOrder.join(' → ')}]`
        })

        if (current === target) {
            const pathResult = pathFromNodeSequence(currentPath)
            steps.push({
                description: `Cible ${target} atteinte`,
                logs: `Chemin trouvé : ${currentPath.join(' → ')}\nLongueur : ${currentPath.length - 1} arêtes`
            })

            return {
                path: pathResult,
                finalMatrix: null,
                structure: 'Pile',
                visitOrder,
                steps,
                logs: `Ordre de visite : ${visitOrder.join(' → ')}`
            }
        }

        const neighbors = adjacency[current] || []
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const { to } = neighbors[i]
            if (!visited.has(to)) {
                stack.push([...currentPath, to])
            }
        }
    }

    steps.push({
        description: `Aucun chemin trouvé`,
        logs: `Structure: Pile\nPile vide\nOrdre de visite: [${visitOrder.join(' → ')}]`
    })

    return {
        path: [],
        finalMatrix: null,
        structure: 'Pile',
        visitOrder,
        steps,
        logs: `Ordre de visite : ${visitOrder.join(' → ')}`
    }
}

export function uniformCostSearch(nodeElement, isUndirected = false) {
    const ids = getSortedNodeIds(nodeElement)
    const adjacency = buildAdjacencyList(nodeElement, isUndirected)
    const start = ids[0]
    const target = ids[ids.length - 1]
    const matrix = generateAdjacencyMatrix(nodeElement, true)
    const frontier = [{ node: start, cost: 0, path: [start] }]
    const bestCosts = { [start]: 0 }
    const visitedOrder = []

    while (frontier.length > 0) {
        frontier.sort((a, b) => a.cost - b.cost)
        const currentState = frontier.shift()
        const { node, cost, path } = currentState

        if (visitedOrder.indexOf(node) === -1) {
            visitedOrder.push(node)
        }

        if (node === target) {
            return {
                path: pathFromNodeSequence(path),
                finalMatrix: matrix,
                steps: [
                    {
                        description: `Uniform Cost Search de ${start} à ${target}`,
                        matrix: deepCloneMatrix(matrix),
                        logs: `Coût total : ${cost}\nOrdre de visite : ${visitedOrder.join(' → ')}`
                    }
                ]
            }
        }

        const neighbors = adjacency[node] || []
        for (const { to, value } of neighbors) {
            const newCost = cost + value
            if (bestCosts[to] == null || newCost < bestCosts[to]) {
                bestCosts[to] = newCost
                frontier.push({ node: to, cost: newCost, path: [...path, to] })
            }
        }
    }

    return {
        path: [],
        finalMatrix: matrix,
        steps: [
            {
                description: `Uniform Cost Search de ${start} à ${target}`,
                matrix: deepCloneMatrix(matrix),
                logs: `Aucun chemin trouvé.`
            }
        ]
    }
}

export function aStarSearch(nodeElement, isUndirected = false) {
    const ids = getSortedNodeIds(nodeElement)
    const adjacency = buildAdjacencyList(nodeElement, isUndirected)
    const start = ids[0]
    const target = ids[ids.length - 1]
    const matrix = generateAdjacencyMatrix(nodeElement, true, isUndirected)
    const frontier = [{ node: start, cost: 0, estimate: 0, path: [start] }]
    const bestCosts = { [start]: 0 }
    const visitedOrder = []

    while (frontier.length > 0) {
        frontier.sort((a, b) => a.estimate - b.estimate)
        const currentState = frontier.shift()
        const { node, cost, path } = currentState

        if (visitedOrder.indexOf(node) === -1) {
            visitedOrder.push(node)
        }

        if (node === target) {
            return {
                path: pathFromNodeSequence(path),
                finalMatrix: matrix,
                steps: [
                    {
                        description: `A* Search de ${start} à ${target}`,
                        matrix: deepCloneMatrix(matrix),
                        logs: `Coût total : ${cost}\nOrdre de visite : ${visitedOrder.join(' → ')}\nHeuristique utilisée : 0 (comportement UCS)`
                    }
                ]
            }
        }

        const neighbors = adjacency[node] || []
        for (const { to, value } of neighbors) {
            const newCost = cost + value
            const heuristic = 0
            const estimate = newCost + heuristic
            if (bestCosts[to] == null || newCost < bestCosts[to]) {
                bestCosts[to] = newCost
                frontier.push({ node: to, cost: newCost, estimate, path: [...path, to] })
            }
        }
    }

    return {
        path: [],
        finalMatrix: matrix,
        steps: [
            {
                description: `A* Search de ${start} à ${target}`,
                matrix: deepCloneMatrix(matrix),
                logs: `Aucun chemin trouvé.`
            }
        ]
    }
}

export function floydWarshall(nodeElement, isUndirected = false) {
    const ids = getSortedNodeIds(nodeElement)
    const size = ids.length
    const matrix = generateAdjacencyMatrix(nodeElement, true, isUndirected)
    const distance = matrix.map(row => row.slice())
    for (let i = 0; i < size; i++) {
        distance[i][i] = 0
    }
    const steps = []

    for (let k = 0; k < size; k++) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const viaK = distance[i][k] + distance[k][j]
                if (distance[i][k] !== Infinity && distance[k][j] !== Infinity && viaK < distance[i][j]) {
                    distance[i][j] = viaK
                    steps.push({
                        description: `k=${k + 1}`,
                        matrix: deepCloneMatrix(distance),
                        logs: `Dist[${i + 1}][${j + 1}] = Dist[${i + 1}][${k + 1}] + Dist[${k + 1}][${j + 1}] = ${distance[i][k]} + ${distance[k][j]} = ${viaK}`
                    })
                }
            }
        }
    }

    if (steps.length === 0) {
        steps.push({
            description: 'Floyd-Warshall',
            matrix: deepCloneMatrix(distance),
            logs: 'Aucune amélioration nécessaire, la matrice initiale est déjà optimisée.'
        })
    }

    return {
        matrix: distance,
        steps
    }
}

function createUnionFind(size) {
    const parent = Array.from({ length: size }, (_, i) => i)
    const rank = new Array(size).fill(0)

    const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x])
        return parent[x]
    }

    const union = (x, y) => {
        const rootX = find(x)
        const rootY = find(y)
        if (rootX === rootY) return false
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX
        } else {
            parent[rootY] = rootX
            rank[rootX]++
        }
        return true
    }

    return { find, union }
}

export function kruskal(nodeElement) {
    const ids = getSortedNodeIds(nodeElement)
    const size = ids.length
    const idToIndex = Object.fromEntries(ids.map((id, index) => [id, index]))
    const edges = transformNodeLinks(nodeElement)
        .map(({ from, to, value }) => ({ from, to, value }))
        .sort((a, b) => a.value - b.value)

    const uf = createUnionFind(size)
    const selectedEdges = []
    const steps = []

    edges.forEach(({ from, to, value }) => {
        const u = idToIndex[from]
        const v = idToIndex[to]
        if (uf.union(u, v)) {
            selectedEdges.push({ from, to })
            steps.push({
                description: `Kruskal sélectionne ${from} → ${to}`,
                matrix: deepCloneMatrix(generateAdjacencyMatrix(nodeElement, true, true)),
                logs: `Arête sélectionnée : ${from} - ${to} (${value})`
            })
        }
    })

    const finalMatrix = Array.from({ length: size }, () => new Array(size).fill(Infinity))
    selectedEdges.forEach(({ from, to }) => {
        finalMatrix[idToIndex[from]][idToIndex[to]] = nodeElement[`${from}-${to}`] ?? nodeElement[`${to}-${from}`]
        finalMatrix[idToIndex[to]][idToIndex[from]] = nodeElement[`${from}-${to}`] ?? nodeElement[`${to}-${from}`]
    })

    return {
        path: selectedEdges,
        finalMatrix,
        steps,
        logs: `Arbre couvrant construit avec ${selectedEdges.length} arêtes.`
    }
}

export function prim(nodeElement) {
    const ids = getSortedNodeIds(nodeElement)
    const size = ids.length
    const adjacency = buildAdjacencyList(nodeElement, true)
    const idToIndex = Object.fromEntries(ids.map((id, index) => [id, index]))
    const visited = new Set([ids[0]])
    const selectedEdges = []
    const steps = []

    while (visited.size < size) {
        let bestEdge = null
        let bestWeight = Infinity

        visited.forEach((node) => {
            (adjacency[node] || []).forEach(({ to, value }) => {
                if (!visited.has(to) && value < bestWeight) {
                    bestWeight = value
                    bestEdge = { from: node, to, value }
                }
            })
        })

        if (!bestEdge) break
        selectedEdges.push({ from: bestEdge.from, to: bestEdge.to })
        visited.add(bestEdge.to)
        steps.push({
            description: `Prim ajoute ${bestEdge.from} → ${bestEdge.to}`,
            matrix: deepCloneMatrix(generateAdjacencyMatrix(nodeElement, true, true)),
            logs: `Arête ajoutée : ${bestEdge.from} - ${bestEdge.to} (${bestEdge.value})`
        })
    }

    const finalMatrix = Array.from({ length: size }, () => new Array(size).fill(Infinity))
    selectedEdges.forEach(({ from, to }) => {
        finalMatrix[idToIndex[from]][idToIndex[to]] = nodeElement[`${from}-${to}`] ?? nodeElement[`${to}-${from}`]
        finalMatrix[idToIndex[to]][idToIndex[from]] = nodeElement[`${from}-${to}`] ?? nodeElement[`${to}-${from}`]
    })

    return {
        path: selectedEdges,
        finalMatrix,
        steps,
        logs: `Arbre couvrant construit avec ${selectedEdges.length} arêtes.`
    }
}

function isInteger(value) {
    return typeof value === 'number' && !isNaN(value) && value % 1 === 0;
}

// Recupere les valeurs pour k-1 v(ij)
// return obj(value, indexes)
const getBefore = (isBefore, matrice, ktoindex) => {
    const permanentValue = []
    const permanentIndex = []
    if(isBefore){
        
        matrice.forEach((subArray, index) => {
            if(subArray[ktoindex] != Infinity && isInteger(subArray[ktoindex])){
                permanentValue.push(subArray[ktoindex])
                permanentIndex.push(index)
            }
        });
    } else {
        matrice[ktoindex].forEach((elem, index) => {
            if(elem != Infinity && isInteger(elem)){
                permanentValue.push(elem)
                permanentIndex.push(index)
            }
        });
    }

    return {
        value: permanentValue,
        indexes: permanentIndex
    }
}

export function deepCloneMatrix(matrix) {
    // Return a deep-cloned matrix (array of arrays) preserving special numeric values
    return matrix.map(row =>
        row.map(cell => {
            if (typeof cell === "number") {
                if (cell === Infinity) return Infinity
                if (cell === -Infinity) return -Infinity
                if (Number.isNaN(cell)) return NaN
                return cell
            }
            return cell
        })
    )
}

export function decodeMatrix(serializedMatrix) {
    const parsed = JSON.parse(serializedMatrix);

    return parsed.map(row =>
        row.map(cell => {
            if (cell === "Infinity") return Infinity;
            if (cell === "-Infinity") return -Infinity;
            if (cell === "NaN") return NaN;
            return cell;
        })
    );
}



export const Demoucron = (node_size, matrice, isMin = true) => {
    const size = node_size - 1;
    let steps = [];

    console.log("🔍 Start Demoucron");
    // console.log("node_size =", node_size, "| size =", size);

    for (let ktoindex = 1, k = 2; ktoindex < size; ktoindex++, k++) {
        // console.log("➡️ Iteration ktoindex =", ktoindex, "k =", k);

        const beforeResult = getBefore(true, matrice, ktoindex);
        const afterResult = getBefore(false, matrice, ktoindex);

        const indexBefore = beforeResult.indexes || [];
        const indexAfter = afterResult.indexes || [];

        // console.log("🧩 indexBefore:", indexBefore);
        // console.log("🧩 indexAfter:", indexAfter);
        
        let stepData = {
            description: `K=${k}`,
            matrix: [],
            logs: ""
        };
        for (const bfIndex of indexBefore) {
            for (const afIndex of indexAfter) {

                // Vérifie que les indices sont valides
                if (
                    !matrice[bfIndex] || typeof matrice[bfIndex][ktoindex] === 'undefined' ||
                    !matrice[ktoindex] || typeof matrice[ktoindex][afIndex] === 'undefined' ||
                    typeof matrice[bfIndex][afIndex] === 'undefined'
                ) {
                    console.warn("❗ Indices invalides:", { bfIndex, ktoindex, afIndex });
                    continue;
                }

                const calc = matrice[bfIndex][ktoindex] + matrice[ktoindex][afIndex];
                const current = matrice[bfIndex][afIndex];
                const value = isFinite(current)
                    ? (isMin ? Math.min(calc, current) : Math.max(calc, current))
                    : calc;


                stepData.matrix = deepCloneMatrix(matrice);

                matrice[bfIndex][afIndex] = value;

                stepData.logs += `W${bfIndex+1}${afIndex+1}(${k-1}) = V${bfIndex+1}${k} + V${k}${afIndex+1} = ${matrice[bfIndex][ktoindex]} + ${matrice[ktoindex][afIndex]} = ${calc}; `;
                stepData.logs += `V${bfIndex+1}${afIndex+1}(${k}) = ${isMin ? 'MIN' : 'MAX'}(${calc}, ${current}) = ${value}\n`;                
            }
        }
        stepData.matrix = deepCloneMatrix(matrice);
        console.log("✅ StepData:", stepData);
        steps.push(stepData);
    }

    // === Reconstruction du chemin ===
    let currentIndex = size;
    const path = [];
    const visited = new Set();

    while (currentIndex > 1) {
        let bestValue = isMin ? Infinity : -Infinity;
        let bestIndex = -1;

        matrice.forEach((row, i) => {
            const val = row[currentIndex];
            if (isMin ? val < bestValue : val > bestValue) {
                bestValue = val;
                bestIndex = i;
            }
        });

        if (
            (isMin && bestValue === Infinity) ||
            (!isMin && bestValue === -Infinity) ||
            visited.has(currentIndex)
        ) {
            console.warn("⚠️ Boucle détectée ou aucun chemin disponible.");
            break;
        }

        path.push({ from: currentIndex + 1, to: bestIndex + 1 });
        visited.add(currentIndex);
        currentIndex = bestIndex;
    }

    path.push({ from: currentIndex + 1, to: 1 });

    console.log("🧭 Path trouvé:", path);
    console.log("🧾 Étapes calculées:", steps.length);
    console.log("📊 Matrice finale:", matrice);

    return {
        path,
        finalMatrix: matrice,
        steps
    };
};


export function DemoucronMaxFixed(matrice) {
    console.log("Callling mnax")
    let stepData = {
        description: `Suivant la methode de retracage de valeur maximum.`,
        matrix: [],
        logs: ""
    };

    const size = matrice.length;
    const longest = new Array(size).fill(-Infinity);
    const pred = new Array(size).fill(null);

    // Point de départ
    longest[0] = 0;
    console.log("Before loop")
    for (let from = 0; from < size; from++) {
        console.log("First loop iteration")
        for (let to = 0; to < size; to++) {
            console.log("Inner loop iteration++")
            if (matrice[from][to] !== -Infinity) {
                const newDist = longest[from] + matrice[from][to];
                if (newDist > longest[to]) {
                    longest[to] = newDist;
                    pred[to] = from;
                }
            }
        }
    }

    // Récupérer l'index avec la valeur max
    let target = longest.indexOf(Math.max(...longest));

    // Reconstruction du chemin
    const path = [];
    let current = target;
    const vertexList = [current + 1]; // liste des sommets

    while (pred[current] !== null) {
        path.push({ from: current + 1, to: pred[current] + 1 });
        current = pred[current];
        vertexList.push(current + 1);
    }

    vertexList.reverse();

    console.log("🛤️ Chemin maximal :", path);
    console.log("📍 Sommets traversés :", vertexList);
    console.log("📍 Dernier matrice :", matrice);
    console.log("💯 Valeur maximale totale :", longest[target]);

    stepData.logs = "Maximum value = " + longest[target]
    stepData.logs = "Maximum value = " + longest[target]
    stepData.matrix = [longest]

    return {
        path,
        finalMatrix: matrice,
        steps: [stepData]
    };

}