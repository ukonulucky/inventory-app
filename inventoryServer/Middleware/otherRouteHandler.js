const otherRouth =  (req, res, next) => {
    try {
        res.status(400).json({
            message:"invalid Route / Route not found"
        })
    } catch (error) {
        next(error.messsage)
    }
}

module.exports = otherRouth