require("dotenv").config()

require("dotenv").config()
const errororHandler = (error, req, res, next) => {
    console.log("error ran")
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })

}

module.exports = errororHandler