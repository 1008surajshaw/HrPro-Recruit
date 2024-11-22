const JobCreatedEmail = ( name:string, jobTitle:string) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Job Created Successfully</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .cta { padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; }
            .support { font-size: 14px; color: #999999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Job Created Successfully</h1>
            <div class="message">Dear ${name},</div>
            <div class="body">
                <p>Your job posting titled <strong>${jobTitle}</strong> has been successfully created.</p>
                <p>You can manage your job postings in your dashboard.</p>

            </div>
            <a href="https://recruitmentportal.com/dashboard" class="cta">Go to Dashboard</a>
            <div class="support">
                If you need any help, contact us at <a href="mailto:support@recruitmentportal.com">support@recruitmentportal.com</a>.
            </div>
        </div>
    </body>
    </html>`;
  };
  
export default JobCreatedEmail