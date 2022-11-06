const mongoose = require("mongoose")
const bycrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please name is required"]
    },
    email:{
        type: String,
        required: [true, "Please email is required"],
        trim: true,
        unique: true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,"Please enter a valid email format"]
    },
    password: {
        type: String,
        required: [true, "Please password is required"],
        minLength: [6, "password should have a minimum length of six characters"]
        
    },
    photo: {
        type: String,
        default:"https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635450_960_720.png"
    },
   bio:{
       type: String,
       default: "bio",
       maxLength:[250, "Please bio should not be more than 250 words"]
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
       return 
    }

// salting and hashing of password before save
    const salt = await bycrypt.genSalt()
    this.password = await bycrypt.hash(this.password, salt)
    next()

})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel