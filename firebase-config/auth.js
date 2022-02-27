
var createError = require('http-errors')

const auth = (req, res, next) => {
    if (typeof req.session.user != "undefined") {

        next()
    } else {
        res.json("auth fail")

    }
}

module.exports = auth