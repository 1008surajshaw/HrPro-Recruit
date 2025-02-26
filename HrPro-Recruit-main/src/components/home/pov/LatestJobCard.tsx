import Image from "next/image";
import React from "react";


    interface JobCardProps {
        title: string;
        salary: string;
        company: string;
        location: string;
        type: string;
        isHot?: boolean;
        icon?: string;
      }

const LatestJobCard:React.FC<JobCardProps> = ({ title, salary, company, location, type, isHot, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && <Image src={icon} alt={`${title} icon`} className="w-10 h-10" />}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isHot && (
          <span className="bg-red-100 text-red-500 text-xs font-semibold px-2 py-1 rounded-md">
            Hot
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{salary}</p>
      <div className="flex items-center text-sm text-gray-500 space-x-1 mb-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 20a8 8 0 100-16 8 8 0 000 16zm1-9V5a1 1 0 10-2 0v6a1 1 0 001 1h3a1 1 0 100-2h-2z" />
        </svg>
        <span>{company}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 space-x-1 mb-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm2-7a1 1 0 10-2 0v4a1 1 0 001 1h1a1 1 0 100-2h-1v-3z" />
        </svg>
        <span>{location}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 space-x-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 9V3a1 1 0 10-2 0v6a1 1 0 001 1h3a1 1 0 100-2H9z" />
        </svg>
        <span>{type}</span>
      </div>
    </div>
  );
};


export default LatestJobCard