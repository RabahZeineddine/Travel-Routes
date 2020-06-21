require('../../config/jsDoc')

/**
 * 
 * @param {FileService} fileService 
 */
function TravelPath(
    fileService,
    graphService
) {
    this.routeFileName = 'input-routes.csv'
    this.fileService = fileService
    this.graphService = graphService
}

TravelPath.prototype.addRoute = function (source, target, cost) {
    if ((source && typeof source == 'string' && source != '')
        && (target && typeof target == 'string' && target != '')
        && (typeof cost == 'number' && cost != undefined && cost != null)
        && this.fileService
    ) {
        return this.fileService.addLine(this.routeFileName, `${source},${target},${cost}`)
    } else throw new Error('Invalid parameters')
}

TravelPath.prototype.findShortestPath = function (source, target) {
    return new Promise(async (resolve, reject) => {
        try {
            this.fileService.getCsvFile(this.routeFileName)
                .then(this.graphService.createGraph)
                .then(graph => this.graphService.findShortestPath(graph, source, target))
                .then(resolve)
                .catch(reject)

            // const graph = await this.graphService.createGraph(input)
            // let result = await this.graphService.findShortestPath(graph, source, target)
            // resolve(result)
        } catch (error) {
            reject({ code: error.code || 500 })
        }
    })
}

module.exports = TravelPath