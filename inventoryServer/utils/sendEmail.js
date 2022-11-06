require("dotenv").config()
const nodemailer = require("nodemailer")


const sendMail = (res,next, sendFrom, sendTo, message, replyTo, subject) => {
  

  // setting our transportter function for mail sending
    const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com',{
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD
        },
        // tls: {
        //  rejectUnauthorized: false   
        // }
      
    })

    // creating out options for mail sending
    const  options ={
        to: sendTo,
        from: sendFrom,
        subject: subject,
        replyTo: replyTo,
        html: message
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log("error from mail",err)
          res.status(500)
            const errorMessage = new Error("mail sending failed")
            next(errorMessage)
            return
        } else {
            res.status(200).json({
                message: "mail Sent Successfullt",
                mailSent: true
            })
    }
})
 
}

module.exports = sendMail