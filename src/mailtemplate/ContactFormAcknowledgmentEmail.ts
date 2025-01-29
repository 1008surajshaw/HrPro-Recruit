export const ContactFormAcknowledgmentEmail = (
  name: string,
  email: string,
  finalTopic: string,
  message: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Thank You for Contacting Hrpro Recruit</title>
        <style>
          body { 
            background-color: #ffffff; 
            font-family: Arial, sans-serif; 
            font-size: 16px; 
            color: #333333; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            text-align: center; 
          }
          .message { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 20px; 
          }
          .body { 
            font-size: 16px; 
            margin-bottom: 20px; 
            text-align: left; 
            line-height: 1.5;
          }
          .cta { 
            padding: 10px 20px; 
            background-color: #ff0000; 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin-top: 10px; 
          }
          .support { 
            font-size: 14px; 
            color: #999999; 
            margin-top: 20px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Thank You for Contacting Us!</h1>
          <div class="message">Dear ${name},</div>
          <div class="body">
            <p>We have received your message regarding <strong>${finalTopic}</strong>, and appreciate you taking the time to reach out to us.</p>
            <p>Your message: <em>"${message}"</em><br>has been received, and our team will review your inquiry. We'll get back to you as soon as possible at ${email}.</p>
            <p>If you have any urgent matters, please don't hesitate to contact us directly.</p>
          </div>
          <a href="https://hrprorecruit.com/contact" class="cta">Visit Our Contact Page</a>
          <div class="support">
            For immediate assistance, feel free to call us at <a href="tel:+1234567890">+1 (234) 567-890</a>.
          </div>
        </div>
      </body>
    </html>
  `;
};

export default ContactFormAcknowledgmentEmail;