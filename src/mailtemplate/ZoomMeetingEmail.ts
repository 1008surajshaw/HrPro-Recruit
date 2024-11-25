const ZoomMeetingEmail = (
    recipientName: string,
    role: 'HR' | 'USER',
    meetingDetails: {
      topic: string;
      startTime: Date;
      duration: number;
      joinUrl: string;
      hostJoinUrl?: string;
      password?: string | null;
      job: {
        title: string;
        type: string;
        category: string;
        workMode: string;
        company: {
          companyName: string;
          city: string;
          country: string;
        };
      };
    }
  ) => {
    const {
      topic,
      startTime,
      duration,
      joinUrl,
      hostJoinUrl,
      password,
      job,
    } = meetingDetails;
  
    const isHR = role === 'HR';
  
    return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>New Zoom Meeting Scheduled</title>
          <style>
              body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
              .body { font-size: 16px; margin-bottom: 20px; text-align: left; }
              .cta { padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
              .support { font-size: 14px; color: #999999; margin-top: 20px; text-align: left; }
              .details { font-size: 14px; margin-top: 20px; text-align: left; color: #555; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>${isHR ? "New Zoom Meeting Scheduled for Candidate" : "Your Interview Meeting Details"}</h1>
              <div class="message">Dear ${recipientName},</div>
              <div class="body">
                  <p>A new Zoom meeting has been scheduled.</p>
                  <p><strong>Meeting Topic:</strong> ${topic}</p>
                  <p><strong>Date & Time:</strong> ${new Date(startTime).toLocaleString()}</p>
                  <p><strong>Duration:</strong> ${duration} minutes</p>
                  ${password ? `<p><strong>Meeting Password:</strong> ${password}</p>` : ""}
                  ${isHR && hostJoinUrl ? `<p><strong>Host Join URL:</strong> <a href="${hostJoinUrl}">${hostJoinUrl}</a></p>` : ""}
                  <p><strong>Join URL:</strong> <a href="${joinUrl}">${joinUrl}</a></p>
              </div>
              <div class="details">
                  <h3>Job Details:</h3>
                  <p><strong>Title:</strong> ${job.title}</p>
                  <p><strong>Type:</strong> ${job.type}</p>
                  <p><strong>Category:</strong> ${job.category}</p>
                  <p><strong>Work Mode:</strong> ${job.workMode}</p>
                  <p><strong>Company:</strong> ${job.company.companyName}, ${job.company.city}, ${job.company.country}</p>
              </div>
              <a href="${isHR ? hostJoinUrl || joinUrl : joinUrl}" class="cta">
                  ${isHR ? "Start Meeting" : "Join Meeting"}
              </a>
              <div class="support">
                  If you need assistance, please contact us at <a href="mailto:support@recruitmentportal.com">support@recruitmentportal.com</a>.
              </div>
          </div>
      </body>
      </html>`;
  };
  
  export default ZoomMeetingEmail;
  