const userModel = require("../models/user")
require("dotenv").config()
const jwt = require("jsonwebtoken")





const protectUser = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (token) {
            const respo = await jwt.verify(token, process.env.JWT_SECRETE)
            if (respo) {
                const { id } = respo
                const user = await userModel.findOne({ id }).select("-password")
                if (user) {
                    req.user = user 
                    next()
                }
                else {
                    res.status(400)
                    const error = new Error("user not logged in, please login")
                    next(error)
                }
            } else {
                res.status(400)
                const error = new Error("session expires, please login")
                next(error)
            }
        } else {
            res.status(400)
            const error = new Error("user not logged in, please login")
            next(error)
        }
      } catch (error) {
        next(error)
      }
}

module.exports = protectUser