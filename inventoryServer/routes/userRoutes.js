const express = require("express")
const { register } = require("../contollers/userController")

const router = express.Router()


router.post("/register", register)


module.exports = router