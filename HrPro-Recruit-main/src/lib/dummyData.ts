export const dummyPricingPlans = [
        {
          id:'sub1',
          name: 'Basic',
          price: 29,
          jobPostLimit: 2,
          duration: 30, 
          features: ['2 job posts per month', 'Basic analytics', 'Email support'],
        },
        {
            id:'sub2',
          name: 'Pro',
          price: 119,
          jobPostLimit: 5,
          duration: 30, // 30 days for monthly
          features: ['5 job posts per month', 'Advanced analytics', 'Priority support'],
        },
        {
            id:'sub3',

          name: 'Enterprise',
          price: 299,
          jobPostLimit: -1, // Unlimited
          duration: 30, // 30 days for monthly
          features: ['Unlimited job posts', 'Custom analytics', '24/7 dedicated support'],
        },
      ]
  

 export  const paymentHistory = [
    { date: '2023-05-01', amount: 79, plan: 'Pro', status: 'Paid' },
    { date: '2023-04-01', amount: 79, plan: 'Pro', status: 'Paid' },
    { date: '2023-03-01', amount: 79, plan: 'Pro', status: 'Paid' },
  ]