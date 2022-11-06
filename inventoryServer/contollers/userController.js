const userModel = require("../models/user")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const tokenModel = require("../models/token")
const sendMail = require("../utils/sendEmail")
 require("dotenv").config()


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
                email, name, password, bio, phone
            })
            if (newUser) {
                const { _id, name, email, bio, photo, phone } = newUser
                const token = generateToken(_id)
                res.cookie("token", token, {
                    expiresIn: new Date(Date.now() + (1000 * 60 * 60 * 24)),
                    httpOnly: true,
                    samesite: "none",
                    
                })
                res.status(200).json({
                    _id, name, email, bio, photo, phone
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
//updating user details
const updateUser = async  (req,res,next) => {
try {
    console.log("code ran",req.body)
    const { _id } = req.user
    const { name, bio,photo, email } = req.body
   
    const user = await userModel.findOne({_id})
    if (user) {
        console.log(user)
        user.email = user.email
        user.name = name || user.name
        user.bio = bio || user.bio
        user.photo = photo || user.photo
        console.log(user.password)
        const updatedUser = await user.save()
        if (updatedUser) {
            console.log("code ran 2")
            res.status(200).json({
                name,
                bio,
                email,
                photo: user.photo


            })
        } else {
            res.status(500)
            const error = new Error("user update failed")
            next(error)
        }
    } else {
        res.status(500)
        const error = new Error("user not found")
        next(error)
    }
    
   
} catch (error) {
    res.status(500)
    const error2 = new Error(error.message)
    next(error2)
}
}

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword} = req.body
        const { _id } = req.user
        const user = await userModel.findOne({ _id })
    
        if (user) {
            console.log(user)
            const { password: userPassword } = user
            console.log(userPassword, oldPassword)
            const passwordCorrect = bcrypt.compare(userPassword,oldPassword )
            if (passwordCorrect) {
                user.password = newPassword
                const updatePassword = await user.save()
                if (updatePassword) {
                    res.status(200).json({
                        message: "password set successfully"
                    })
                
                } else {
                    res.status(400)
                    const error = new Error("failed to change password please retry")
                    next(error)
                    return
                }
            }else{
                res.status(400)
                const error = new Error("Please old password  does not match with any user")
                next(error)
                return   
            }
        } else {
            res.status(400)
            const error = new Error("user not Found")
            next(error)
            return
        }
    
  } catch (error) {
        res.status(500)
        const newError = new Error(error.message)
        next(newError)
        return
  }
}

const isLoggedIn = (req, res, next) => {
try {
    const { token } = req.cookies
    if (token) {
        res.status(200).json({
            message: true
        })
    } else {
        res.status(200).json({
            message: false
        })
    }
} catch (error) {
    res.status(400)
    const err = new Error(error.message)
    next(err)
}
}

const forgotPassword = async(req, res, next) => {
  try {
      const { email } = req.body
      const user = await userModel.findOne({ email })
      console.log(user)
      if (!user) {
    res.status(404)
    const err = new Error("email not found")
    next(err)
      }

 // checking for previous  saved token
      const oldToken = await tokenModel.findOne({ userId: user._id })
      if (oldToken) {
          console.log("old token check ran")
            await oldToken.deleteOne()
      }

      const token = crypto.randomBytes(30).toString("hex") + user._id
      const hash = crypto.createHash("sha256").update(token).digest("hex")
  console.log("this is the token",token)
      // saving token to database
   const newTokenModel = await tokenModel.create({
          userId: user._id,
          token: hash,
          createdAt: Date.now(),
          expiresAt: Date.now() + (30 * 60 * 1000) // note the time is in milli seconds
   })
      if (newTokenModel) {
          const tokenData = await newTokenModel.save()
          console.log(tokenData)
      }
      // message to send to user
      const resetUrl = `${process.env.FRONT_END}/resetpassword/${token}`
      const message = `
     <p> Hello ${user.name}</p>
     <p>Please use the reset link below to change your password</p>
     <p>This reset link is only valid for a period of 30 minutes</p>
     <a clicktracking=off href=${resetUrl}>${resetUrl}</a>
     <p>Best Regards.... </p>
      `
      const sendTo = user.email
      const sendFrom = process.env.EMAIL_USER
      const subject = "Password Reset"

    // await sendMail(res,next, req, sendFrom, sendTo, message,subject)
      res.status(200).json({
          message:"running properly"
      })
  } catch (error) {
    res.status(400)
    const err = new Error(error.message)
    next(err)
  }
}

const resetPassword = async (req, res, next) => {
  try {
      const { password } = req.body
      const { token } = req.params
    

      // hashing the userTken before finding user in database
      const hash = crypto.createHash("sha256").update(token).digest("hex")
      const userToken = await tokenModel.findOne({
          token: hash,
          expiresAt: {
              $gt: Date.now()
          }
      })
 
      if (!userToken) {
          res.status(404)
          const errorMessage = new Error("invalid token or token has expired")
          next(errorMessage)
          return
      }
   
      const user = await userModel.findOne({
          _id: userToken.userId
      })
      if (user) {
          user.password = password
          await user.save()
          res.status(200).json({
              message: "password changed successfully please login"
          })
      } else {
        res.status(500)
        const errorMessage = new Error("invalid login credentials")
        next(errorMessage)
        return
      }


  } catch (error) {
      res.status(500)
    next(error.message)
  }
}

module.exports = {
    register,
    login,
    logout,
    getUser,
    updateUser,
    changePassword,
    isLoggedIn,
    forgotPassword,
    resetPassword
}
 