const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pereratdp@gmail.com',
        subject: 'Thank you for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get alone with the app`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pereratdp@gmail.com',
        subject: `Sorry to see you go, ${name}`,
        text: 'Please let us know what went wrong!'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}