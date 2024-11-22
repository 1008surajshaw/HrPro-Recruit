export const WelcomeRecruiterEmail = (name:string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Welcome to HrPro Recruit</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 10px;
              }
              h1 {
                  color: #007BFF;
              }
              p {
                  margin: 10px 0;
              }
              .cta {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #007BFF;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Welcome to HrPro Recruit, ${name}!</h1>
              <p>We’re thrilled to have you as part of our platform. Connect with top talent and grow your team effortlessly.</p>
              <p>To get started:</p>
              <ul>
                  <li><strong>Complete Your Company Profile:</strong> Add your company details to attract the best candidates.</li>
                  <li><strong>Pay the Platform Fee:</strong> A small fee enables you to post unlimited jobs and access top features.</li>
                  <li><strong>Start Posting Jobs:</strong> Reach thousands of talented job seekers.</li>
              </ul>
              <p>Take the first step towards building your dream team today!</p>
              <a href="https://yourplatform.com/company-profile" class="cta">Complete Your Profile</a>
          </div>
      </body>
      </html>
    `;
  };
  