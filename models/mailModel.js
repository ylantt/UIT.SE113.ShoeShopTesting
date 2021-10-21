const mail = require('nodemailer');

exports.confirmationMail = function(userMail,title,content) {
    const transporter = mail.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL, 
            pass: process.env.PASS_MAIL
        }
    });
    
    const mailOptions = {
        from: process.env.MAIL,
        to: userMail,
        subject: title,
        html: content
    }

    transporter.sendMail(mailOptions,function(err,info){
        if (err) console.log(err);
        else console.log("Email sent: " + info.response);
    })
}
