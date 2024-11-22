const NotificationUpdate = (recipientName:string, senderName:string, messagePreview:string) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Message Notification</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .cta { padding: 10px 20px; background-color: #ffc107; color: #000000; text-decoration: none; border-radius: 5px; }
            .support { font-size: 14px; color: #999999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Message Notification</h1>
            <div class="message">Hello ${recipientName},</div>
            <div class="body">
                <p>You have received a new message from <strong>${senderName}</strong>.</p>
                <p>Message Preview:</p>
                <p>"${messagePreview}"</p>
            </div>
            <a href="https://recruitmentportal.com/messages" class="cta">View Message</a>
            <div class="support">
                If you have any questions, contact us at <a href="mailto:support@recruitmentportal.com">support@recruitmentportal.com</a>.
            </div>
        </div>
    </body>
    </html>`;
  };

  export default NotificationUpdate