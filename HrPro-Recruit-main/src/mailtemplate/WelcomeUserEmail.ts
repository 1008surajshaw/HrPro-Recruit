export const WelcomeUserEmail = (name:string) => {
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
                  color: #4CAF50;
              }
              p {
                  margin: 10px 0;
              }
              .cta {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #4CAF50;
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
              <p>We’re excited to have you on board. Our platform connects talented individuals like you with top recruiters across industries.</p>
              <p>To get started:</p>
              <ul>
                  <li><strong>Complete Your Profile:</strong> Add your education, skills, and work experience.</li>
                  <li><strong>Start Applying:</strong> Explore hundreds of job opportunities tailored to your preferences.</li>
              </ul>
              <p>Don’t miss out on your dream job. The sooner you complete your profile, the faster you can start applying!</p>
              <a href="https://yourplatform.com/profile" class="cta">Complete Your Profile Now</a>
          </div>
      </body>
      </html>
    `;
  };
  