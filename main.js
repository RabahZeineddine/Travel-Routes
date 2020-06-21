const readline = require('readline');
const FileService = require('./src/services/File')
const GraphService = require('./src/services/Graph')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const graphService = new GraphService()


function main(args) {
    try {

        if (Array.isArray(args) && args.length >= 3) {
            const path = args[2]
            const fileService = new FileService()

            const extension = fileService.getFileExtension(path)

            if (verifyAllowedExtensions(extension)) {
                fileService.getCsvFile(path)
                    .then(graphService.createGraph)
                    .then(getRouteAndShortestPath)
                    .catch(error => {
                        console.error(error.message)
                        throw error
                    })
            } else throw new Error("Invalid file extension")
        } else {
            process.exit(9)
        }
    } catch (error) {
        throw error
    }
}

async function getRouteAndShortestPath(graph) {
    rl.question('Please enter the route: ', async (answer) => {
        if (answer == 'exit')
            return rl.close();
        if (answer && typeof answer === 'string' && answer.split('-').length == 2) {
            const nodes = answer.split('-')
            const startNode = nodes[0]
            const endNode = nodes[1]
            graphService.findShortestPath(graph, startNode, endNode)
                .then(async result => {
                    console.log(result)
                    return await getRouteAndShortestPath(graph)
                })
                .catch(error => {
                    throw error
                })
        } else {
            console.log('Invalid input. follow an example of a valid input: GRU-BEY')
        }
    });
}

function verifyAllowedExtensions(extension) {
    if (extension && extension === 'csv') return true
    else return false
}


process.on('exit', (code) => {
    if (code === 9) console.error('Invalid arguments')
    else console.error('process exist')
})



main(process.argv)