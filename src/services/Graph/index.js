

function GraphService() {

}


GraphService.prototype.createGraph = function (input) {
    if (Array.isArray(input) && input.length > 0) {
        return input.reduce((acc, curr) => {
            if (Array.isArray(curr) && curr.length == 3 && !isNaN(curr[2])) {
                if (!acc[curr[0]]) acc[curr[0]] = {}
                acc[curr[0]][curr[1]] = Number(curr[2])
            } else throw new Error(`Invalid input ${curr}`)
            return acc
        }, {})
    } else throw new Error('Invalid input')
}

GraphService.prototype.findShortestPath = async function (graph, startNode, endNode) {

    // Rastrear a distancia da vertice inicial usando um objeto
    let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);

    // Rastrear os caminhos usando objeto
    let parents = { [endNode]: null };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }
    // Rastrear as vertices visitados
    let visited = [];
    // Encontrar a vertice mais proxima
    let node = shortestDistanceNode(distances, visited);

    while (node) {
        // Encontrar as distancias entre a vertice e seus "filhos"
        let distance = distances[node];
        let children = graph[node];

        // para cada vertice filha
        for (let child in children) {
            // Verificar que cada filho não é o mesmo escolhido como vertice inicial
            if (String(child) === String(startNode)) {
                continue;
            } else {
                // Salvar a distancia da vertice inicial até o filho
                let newdistance = distance + children[child];
                // if there's no recorded distance from the start node to the child node in the distances object
                // Caso não tem registro de distancia de vertice inicial para o filho  ou a distancia encontrada é menor da anterior 
                if (!distances[child] || distances[child] > newdistance) {
                    // Salvar a distancia
                    distances[child] = newdistance;
                    // salvar o caminho
                    parents[child] = node;
                }
            }
        }
        // marcar a vertice atual como vistiada
        visited.push(node);
        // encontrar a proxima vertice
        node = shortestDistanceNode(distances, visited);
    }

    // salvar o caminho mais curto
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    let results = {
        distance: distances[endNode],
        path: shortestPath,
    };

    if (results.distance === 'Infinity') return 'There is no path available!'
    return `${results.path.join(' - ')} > ${results.distance}`;
}

const shortestDistanceNode = (distances, visited) => {
    // criar um valor default
    let shortest = null;
    // para cada vertice no objeto distance
    for (let node in distances) {
        // se nenhuma vertice foi selecionada 
        // ou se a distancia da vertice atual é menor do que a menor escolhida
        let currentIsShortest =
            shortest === null || distances[node] < distances[shortest];

        // e se a vertice não foi visitada
        if (currentIsShortest && !visited.includes(node)) {
            // atualiza o menor com o atual
            shortest = node;
        }
    }
    return shortest;
};


module.exports = GraphService