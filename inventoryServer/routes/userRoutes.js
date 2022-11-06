const express = require("express")
const { userInfo } = require("os")
const { register, login, logout, getUser, updateUser, changePassword, isLoggedIn, forgotPassword, resetPassword } = require("../contollers/userController")
const protectUser = require("../Middleware/authMiddleware")

const router = express.Router()



router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/getuser", protectUser, getUser)
router.patch("/updateUser", protectUser, updateUser)
router.patch("/changepassword", protectUser ,changePassword)
router.get("/userloggedin", isLoggedIn)
router.post("/forgotpassword", forgotPassword)
router.patch("/resetpassword/:token", resetPassword)
module.exports = router