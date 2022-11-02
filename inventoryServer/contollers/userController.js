


const register = async (req, res, next) => {
    if (!req.body.name) {
        console.log("code ran")
        res.status(400)
        const error = new Error("name field is required")
        next(error)
}
    // res.send("registration successful")

}


module.exports = {
    register
}
