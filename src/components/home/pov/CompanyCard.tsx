import React from 'react';

// Define the interface for company data
export interface CompanyCardProps {
  name: string;
  jobs: number;
  location: string;
  // Icon: SvgIconComponent;  // Specify that the Icon prop is of type IconType
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, jobs, location }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4">
        {/* <Icon className="text-4xl text-red-500" /> */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-red-500 text-sm mt-2">{jobs} jobs</p>
      <p className="text-gray-500 text-sm">{location}</p>
    </div>
  );
};

export default CompanyCard