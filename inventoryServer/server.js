const express = require("express")
require("dotenv").config()
const cookieParser = require("cookie-parser")


const userRoute = require("./routes/userRoutes")


const app = express()

//MIDDLER WARES
app.use(express.json())
app.use(cookieParser())


//user middler ware



 
const dbConnect = require("./config/dB/dBConfig")
const errorHandler = require("./Middleware/errorhandler")
app.use("/api/users",userRoute)

const PORT = process.env.PORT 
app.use(errorHandler)


async function server() {
   try {
       const res = await dbConnect()
       if (res) app.listen(PORT, () => {
        console.log(`db connected and server running on port ${PORT}`)
    })
   } catch (error) {
       console.log(error.message)
       process.exit(1)
   }
}

server()