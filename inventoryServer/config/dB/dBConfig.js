const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

async function dbConnect() {
    try {
        const dbURL = process.env.MONGU_URL 
    const res = await mongoose.connect(dbURL)
    return res
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = dbConnect