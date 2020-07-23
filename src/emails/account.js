const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, user) => {
    sgMail.send({
        to: email,
        from: 'ndeyura@hotmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the task manager app ${user}.Hope you like our services`

    })
}
const sendCancelationEmail = (email, user) => {
    sgMail.send({
        to: email,
        from: 'ndeyura@hotmail.com',
        subject: 'Thanks for using our app',
        text: `${user} your account has been deleted.Hope to see you in future again`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}