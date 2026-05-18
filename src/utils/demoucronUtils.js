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


export function generateAdjacencyMatrix(nodeElement, isMin=true) {
    const ids = extractIndividualIds(nodeElement);
    const size = ids.length;
    const matrix = [];
    const value_to_fill = isMin ? Infinity : -Infinity
    console.log("before matrix -> ", matrix)
    // Initialisation de la matrice avec Infinity
    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size).fill(value_to_fill);
    }

    console.log("New matrix -> ", matrix)

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
        // Si le graphe est non orienté, décommenter cette ligne :
        // matrix[toIndex][fromIndex] = link.value;
    });
    console.log("Final matrix -> ",matrix)
    
    return matrix;
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
    const serialized = matrix.map(row =>
        row.map(cell => {
            if (typeof cell === "number" && !isFinite(cell)) {
                return cell === Infinity ? "Infinity" :
                       cell === -Infinity ? "-Infinity" :
                       "NaN";
            }
            return cell;
        })
    );
    return JSON.stringify(serialized);
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