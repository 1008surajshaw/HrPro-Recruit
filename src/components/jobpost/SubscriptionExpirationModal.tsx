"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SubscriptionExpirationModalProps {
  hasSubscription: boolean;
}

const SubscriptionExpirationModal = ({ 
  hasSubscription 
}: SubscriptionExpirationModalProps) => {
  const [isOpen] = useState(true);
  const router = useRouter();

  const handleGoToHome = () => {
    router.push('/');
  };

  const handleGoToPricing = () => {
    router.push('/pricing');
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {hasSubscription 
              ? "Subscription Expired" 
              : "No Active Subscription"}
          </DialogTitle>
          <DialogDescription>
            {hasSubscription 
              ? "Your current subscription has expired." 
              : "You do not have an active subscription."}
            
            Please choose a plan to continue posting jobs.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGoToHome}
          >
            Go to Home
          </Button>
          
          <Button 
            onClick={handleGoToPricing}
          >
            Choose a Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionExpirationModal;