const Router = require('express').Router
const validator = require('../../utils/Validator')
const schemas = require('./schemas')
const TravelPathService = require('../../services/TravelPath')
const FileService = require('../../services/File')
const GraphService = require('../../services/Graph')
const getErrorMessage = require('../../utils/ErrorMessages').getErrorMessage
const getErrorStatusCode = require('../../utils/ErrorMessages').getErrorStatusCode

const router = Router()


const initRouter = () => {

    router.route('/')
        .post(
            validator.body(schemas.addRouteSchema),
            addPathRoute
        )

    router.route('/:route')
        .get(
            validator.params(schemas.shortestPathQuerySchema),
            findShortestPathRoute
        )

    return router
}

const addPathRoute = (req, res) => {
    try {
        const { from, to, cost } = req.body
        const travelPathService = new TravelPathService(new FileService())
        travelPathService.addRoute(from, to, cost)
            .then(result => res.status(201).end())
            .catch(error => {
                res.status(getErrorStatusCode(error)).json({ message: getErrorMessage(error) })
            })
    } catch (error) {
        console.error(error)
        res.status(error.code || 500).json({ message: getErrorMessage(error) })
    }
}


const findShortestPathRoute = (req, res) => {
    try {
        const { route } = req.params
        const source = route.split('-')[0]
        const target = route.split('-')[1]
        const travelPathService = new TravelPathService(
            new FileService(),
            new GraphService()
        )
        travelPathService.findShortestPath(source, target)
            .then(result => res.status(200).json({ message: result }))
            .catch(error => res.status(getErrorStatusCode(error)).json({ message: getErrorMessage(error) }))

    } catch (error) {
        res.status(getErrorStatusCode(error)).json({ message: getErrorMessage(error) })
    }
}


module.exports = initRouter()