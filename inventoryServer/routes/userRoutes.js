const express = require("express")
const { register, login, logout, getUser } = require("../contollers/userController")
const protectUser = require("../Middleware/authMiddleware")

const router = express.Router()



router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/getuser", protectUser ,getUser)


module.exports = router