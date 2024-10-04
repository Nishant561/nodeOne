const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    service:"Gmail",
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"nishantbaruwal560@gmail.com",
        pass:"tgknzcmwlifhxrgy"
    }
})

const mailOptions = {
    from:"nishant support@<nishant-api>",
    to:"sujatasuju33@gmail.com",
    subject:"Hello i am from the node.js nodemailer.",
    text:"I am trying to hack your gmail account using the node.js."
};

const sendEmail = async (resetConfiguration)=>{
    const{URL , to} = resetConfiguration
    const mailOptions = {
        from:"nishant support@<nishant-api>",
        to:to,
        subject:"Hello i am from the node.js nodemailer.",
        text:`Please follow the link to reset password ${URL}`
    };
    await transporter.sendMail(mailOptions , (error, info)=>{
        if(error){
            console.error("Error sending email: "+ error.message)
        }else{
            console.log("Email sent", info.response)
        }
    })
}

module.exports = {
    sendEmail
}