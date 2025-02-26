export interface SubscriptionTier {
    id: string;
    name: string;
    price: number;
    jobPostLimit: number;
    duration: number;
    features: string[];
  }
  
  export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
    paymentMethod: string;
    paymentIntentId: string | null;
    createdAt: Date;
  }
  
  export interface UserSubscription {
    subscriptionEndDate: Date | null;
    subscriptionStartDate: Date | null;
    subscriptionTier: {
      name: string;
      price: number;
      jobPostLimit: number;
      duration: number;
      payments: Payment[];
    } | null;
  }
  
  