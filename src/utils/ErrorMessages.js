const ERRORS = {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    DEFAULT: 'An error ocurred, try again later',
    BAD_REQUEST: 'Bad request or missing parameters',
    NOT_FOUND: 'Resource not found',

}
const ERRORS_CODE = {
    DEFAULT: {
        message: 'An error ocurred, try again later',
        code: 0
    },
    BAD_REQUEST: {
        message: 'Bad request or missing parameters',
        code: 400
    },
    NOT_FOUND: {
        message: 'Resource not found',
        code: 404
    },
    INTERNAL_SERVER_ERROR: {
        message: 'Internal server error',
        code: 500
    },
}
function getErrorMessage(err) {
    let code = err.code || 500
    if (!code || typeof code != 'number') return ERRORS.DEFAULT
    let error = {}
    error = Object.values(ERRORS_CODE).find((error) => {
        return error.code == code
    })

    if (!error) return ERRORS.DEFAULT

    try {
        return error.message
    } catch (err) {
        console.error(err)
        return ERRORS.DEFAULT
    }
}

function getErrorStatusCode(error) {
    let code = 500
    if (error.code) {
        if (typeof error.code == 'string') {
            if (error.code == 'ENOENT') code = 404
        } else if (typeof error.code == 'number') code = error.code
    }
    return code
}


module.exports = {
    getErrorMessage,
    getErrorStatusCode
}