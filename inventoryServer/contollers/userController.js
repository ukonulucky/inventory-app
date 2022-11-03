const userModel = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const errorGenerator = (message) => {
    const error = new Error(message)
    return error
}
const generateToken = (id) => {
return   jwt.sign({ id }, process.env.JWT_SECRETE, {
        expiresIn: "1d"
    })
}

const register = async (req, res, next) => {
    try {
    const { name, email, password, bio, phone } = req.body
    console.log(req.body)
   
    // checking if name, email and password exist
        if (!name || !email || !password) {
        res.status(400)
        next(errorGenerator("Required fields cannot be empty"))
        return
    }

    // find if a user exist in db
    if (email, name, password) {
        const user = await userModel.findOne({ email })
        if (user) {
            next(errorGenerator("use Alread exist in databaste"))
            return
        }
        if (!user) {
            res.status(401)
            const newUser = await userModel.create({
                email, name, password,
            })
            if (newUser) {
                const { _id, name, email, bio, photo } = newUser
                const token = generateToken(_id)
                res.cookie("token", token, {
                    expiresIn: new Date(Date.now() + (1000 * 60 * 60 * 24)),
                    httpOnly: true,
                    samesite: "none",
                    
                })
                res.status(200).json({
                    _id, name, email, bio, photo
                })
       }
        }
    

    }
  
} catch (error) {
   next(errorGenerator(error.message))
}   

}
// login user in
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        console.log(req.body)
        if (!email || !password) {
            res.status(400)
          const error = new Error("Please email and password field can not be empty")
            next(error)
            return
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(400)
            const error = new Error("Invalid email or password")
              next(error)
              return 
        } else {
           
            const respo = await bcrypt.compare(password, user.password)
            if (respo) {
               
                const { email, _id, name, photo} = user
                const token = generateToken(user._id)
                res.cookie("token", token, {
                    httpOnly: true,
                    expiresIn: new Date(Date.now() + (1000 * 60* 60 * 24))
                })
                res.status(200).json({
                    email, _id, name, photo
                })
            } else {
                res.status(400)
                const error = new Error("Invalid email or password")
                  next(error)
                  return 
            }
        }
       

    } catch (error) {
        res.status(400)
        next(error)
    }
}

const logout = async (req,res, next) => {
    res.cookie("token", "", {
      expiresIn: new Date(0)
    })
    res.status(200).json({
        message:"user logged out successfully"
    })
}
  
const getUser = (req,res) => {
  res.send(req.body)
}




module.exports = {
    register,
    login,
    logout,
    getUser
}
