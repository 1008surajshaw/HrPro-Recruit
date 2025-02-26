const FeedbackAcknowledgmentEmail = (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">

        <title>Thank You for Your Feedback, Hrpro Recruit</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .cta { padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
            .support { font-size: 14px; color: #999999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Thank You for Your Feedback!</h1>
            <div class="message">Dear ${name},</div>
            <div class="body">
                <p>We sincerely appreciate you taking the time to share your feedback with us.</p>
                <p>Your thoughts and suggestions are invaluable in helping us improve our platform and provide a better experience for all users.</p>
                <p>If you have any further insights or suggestions, don't hesitate to reach out to us.</p>
            </div>
            <a href="https://yourplatform.com/feedback" class="cta">Share More Feedback</a>
            <div class="support">
                For any questions or assistance, feel free to contact us at <a href="mailto:support@yourplatform.com">support@yourplatform.com</a>.
            </div>
        </div>
    </body>
    </html>`;
  
export default FeedbackAcknowledgmentEmail;
