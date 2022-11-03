const express = require("express")
const { register, login, logout, getUser, updateUser, changePassword } = require("../contollers/userController")
const protectUser = require("../Middleware/authMiddleware")

const router = express.Router()



router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/getuser", protectUser, getUser)
router.patch("/updateUser", protectUser, updateUser)
router.patch("/changepassword", protectUser ,changePassword)


module.exports = router