export const JobNotificationEmail = (userName: string, jobs: any[]) => {
    const baseUrl = 'https://hr-pro-recruit-npo1.vercel.app/jobs/';
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Today's New Job Opportunities</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
          }
          .job-card {
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              background-color: #f9f9f9;
          }
          .job-title {
              color: #333;
              font-size: 18px;
              margin-bottom: 10px;
              font-weight: bold;
          }
          .job-details {
              color: #666;
              margin-bottom: 10px;
          }
          .salary-info {
              color: #4CAF50;
              font-weight: bold;
          }
          .company-logo {
              max-width: 100px;
              max-height: 50px;
              margin-bottom: 10px;
          }
          .job-card-link {
              display: block;
              text-decoration: none;
              color: inherit;
          }
          .view-job-btn {
              display: inline-block;
              background-color: #2196F3;
              color: white;
              padding: 8px 15px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 10px;
              font-size: 14px;
          }
      </style>
  </head>
  <body>
      <h1>Hi ${userName},</h1>
      
      <p>Check out the exciting job opportunities we've found for you today:</p>
      
      ${jobs.map(job => `
      <div class="job-card">
          <a href="${baseUrl}${job.id}" class="job-card-link">
              <h2 class="job-title">${job.title}</h2>
              
              ${job.company ? `
              <div class="job-company">
                  <strong>Company:</strong> ${job.company.companyName}
                  ${job.company.companyLogo ? `<br><img src="${job.company.companyLogo}" alt="${job.company.companyName} Logo" class="company-logo">` : ''}
              </div>
              ` : ''}
              
              <div class="job-details">
                  <strong>Job Type:</strong> ${job.type}<br>
                  <strong>Category:</strong> ${job.category}<br>
                  <strong>Work Mode:</strong> ${job.workMode}
              </div>
              
              ${job.hasSalaryRange ? `
              <div class="salary-info">
                  <strong>Salary Range:</strong> 
                  ${job.currency} ${job.minSalary} - ${job.maxSalary}
              </div>
              ` : ''}
              
              ${job.hasExperiencerange ? `
              <div class="job-experience">
                  <strong>Experience Required:</strong> 
                  ${job.minExperience} - ${job.maxExperience} years
              </div>
              ` : ''}
              
              ${job.skills && job.skills.length > 0 ? `
              <div class="job-skills">
                  <strong>Skills Required:</strong> ${job.skills.join(', ')}
              </div>
              ` : ''}
              
              <a href="${baseUrl}${job.id}" class="view-job-btn">View Job Details</a>
          </a>
      </div>
      `).join('')}
      
      <p>
          <a href="https://hr-pro-recruit-npo1.vercel.app/jobs" style="
              display: inline-block; 
              background-color: #4CAF50; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px;
          ">
              View All Jobs
          </a>
      </p>
      
      <p>Best regards,<br>Your Job Portal Team</p>
  </body>
  </html>
    `;
  };