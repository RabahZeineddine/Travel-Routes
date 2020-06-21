const Joi = require('@hapi/joi')

const addRouteSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    cost: Joi.number().required()
})

const shortestPathQuerySchema = Joi.object({
    route: Joi.string().pattern(/\w+-\w+/).required()
})


module.exports = {
    addRouteSchema,
    shortestPathQuerySchema
}