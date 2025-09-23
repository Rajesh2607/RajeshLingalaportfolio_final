import React from 'react';

const SkeletonLoaderForhome = () => {
  return (
    <div className="animate-pulse space-y-12 px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        {/* Text */}
        <div className="flex-1 space-y-5">
          <div className="h-6 sm:h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 sm:h-12 bg-gray-700 rounded w-2/3"></div>
          <div className="h-5 bg-gray-700 rounded w-1/2"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-md"></div>
          </div>
          <div className="h-10 w-40 bg-gray-700 rounded-full mt-4"></div>
        </div>

        {/* Profile Picture */}
        <div className="w-72 h-72 sm:w-96 sm:h-96 bg-gray-700 rounded-full flex-shrink-0"></div>
      </div>

      {/* About Section Skeleton */}
      <div className="bg-[#1b3a70] p-6 sm:p-10 md:p-12 lg:p-16 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
          <div className="h-6 sm:h-8 w-1/3 bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-4 mt-6">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-10 w-48 bg-gray-700 rounded-full mt-6"></div>
      </div>
    </div>
  );
};

export default SkeletonLoaderForhome;
