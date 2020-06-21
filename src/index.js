const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const routers = require('./routes')


let app = express()
if (process.env.NODE_ENV == 'development')
    app.use(morgan(':user-agent :method :url :status :response-time ms'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('PORT', process.env.PORT || 3000)


const BASE_PATH = 'v1'

app.use(`/${BASE_PATH}/path`, routers.path)


// Custom Handle Error
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).json({
            type: err.type, // it could be 'headers', 'body', 'query' or 'params'
            message: err.error.toString()
        })
    } else {
        // pass on to another error handler
        next(err)
    }
})



app.listen(app.get('PORT'), () => {
    console.log(`App is listening on port: ${app.get('PORT')}`)
})


module.exports = app
