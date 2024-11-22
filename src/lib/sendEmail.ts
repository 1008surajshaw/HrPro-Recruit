import nodemailer from 'nodemailer';

export async function sendEmail(
  email: string,
  title:string,
  body:string
) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT as string) ?? 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
         from :  'HrPro Recruit ',
         to:email,
         subject:title,
         html:body
    })

    return info;  
  } 
  catch (error) {
    console.error('Error sending email:', error);
  }
}
