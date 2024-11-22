import { JobWithApplicant, User } from "@/types/jobs.types";
import { differenceInYears } from "date-fns";

export const calculateFitPercentage = (candidate: User, jobPosting: JobWithApplicant): number => {
    let score = 0;
    let totalWeight = 0;
    
    // Skills match (50% weight)
    if (candidate.skills?.length && jobPosting.skills?.length) {
      const candidateSkills = new Set(candidate.skills.map(skill => skill.toLowerCase()));
      const matchedSkills = jobPosting.skills.filter(skill => 
        candidateSkills.has(skill.toLowerCase())
      ).length;
      score += (matchedSkills / jobPosting.skills.length) * 50;
    }
    totalWeight += 50;
  
    // Experience match (50% weight)
    if (jobPosting.hasExperiencerange && jobPosting.minExperience ) {
      const totalExperience = candidate.experience?.reduce((total, exp) => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        return total + differenceInYears(endDate, startDate);
      }, 0) || 0;
  
      const targetExperience = jobPosting.minExperience;
      const maxExperience = jobPosting.maxExperience || targetExperience * 2;
      
      let experienceScore;
      if (totalExperience >= targetExperience && totalExperience <= maxExperience) {
        experienceScore = 50; // Perfect match
      } else if (totalExperience > maxExperience) {
        experienceScore = 40; // Overqualified but still valuable
      } else {
        experienceScore = (totalExperience / targetExperience) * 50;
      }
      
      score += experienceScore;
      totalWeight += 50;
    }
  
    // Calculate final percentage
    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  };
  
  // Helper function to get relevance level and color
export  const getRelevanceInfo = (percentage: number): { level: string; color: string } => {
    if (percentage >= 85) return { level: "Excellent Match", color: "text-green-600" };
    if (percentage >= 70) return { level: "Good Match", color: "text-blue-600" };
    if (percentage >= 40) return { level: "Fair Match", color: "text-yellow-600" };
    return { level: "Poor Match", color: "text-red-600" };
  };
  