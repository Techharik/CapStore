import nodemailer from 'nodemailer'
const mailer = async ({message,email,subject})=>{
    
   
    var transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        }
      });

     

      const messages = {
        from: "techharik30@gmail.com", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
      };
    
    //   console.log(message)

      // send mail with defined transport object
      await transport.sendMail(messages);
      
}

export default mailer;