import React from 'react';

const ProjectSkeleton = () => {
  return (
    <div className="bg-[#112240] rounded-2xl overflow-hidden shadow-md animate-pulse">
      {/* Image Skeleton */}
      <div className="h-56 bg-gray-700 w-full"></div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-600 rounded w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        </div>

        {/* Technologies Skeleton */}
        <div className="flex gap-2 flex-wrap mt-4">
          <div className="h-6 w-20 bg-gray-600 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-600 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
