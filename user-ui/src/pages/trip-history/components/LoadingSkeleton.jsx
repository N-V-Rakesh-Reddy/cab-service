import React from 'react';

const LoadingSkeleton = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)]?.map((_, index) => (
        <div key={index} className="glass-morphism bg-card/30 rounded-xl border border-border p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-muted/50 shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted/50 rounded shimmer" />
                <div className="h-3 w-24 bg-muted/50 rounded shimmer" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-16 bg-muted/50 rounded-full shimmer" />
              <div className="h-6 w-6 bg-muted/50 rounded shimmer" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-3 w-16 bg-muted/50 rounded shimmer" />
              <div className="h-3 w-20 bg-muted/50 rounded shimmer" />
            </div>
            <div className="text-right space-y-1">
              <div className="h-5 w-16 bg-muted/50 rounded shimmer" />
              <div className="h-3 w-20 bg-muted/50 rounded shimmer" />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="h-8 flex-1 bg-muted/50 rounded-lg shimmer" />
            <div className="h-8 flex-1 bg-muted/50 rounded-lg shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;