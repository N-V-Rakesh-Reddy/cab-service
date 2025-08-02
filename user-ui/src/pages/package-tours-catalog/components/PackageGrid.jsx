import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PackageGrid = ({ 
  packages = [], 
  loading = false, 
  hasMore = false,
  onLoadMore = () => {},
  onBookPackage = () => {},
  className = '' 
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore();
    setLoadingMore(false);
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="glass-morphism bg-card/95 rounded-xl border border-border overflow-hidden">
      <div className="h-48 sm:h-56 bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          <div className="h-8 bg-muted rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon name="Package" size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No packages found
      </h3>
      <p className="text-muted-foreground max-w-md">
        We couldn't find any packages matching your criteria. Try adjusting your filters or search terms.
      </p>
    </div>
  );

  if (!loading && packages?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={className}>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages?.map((pkg) => (
          <PackageCard
            key={pkg?.id}
            package={pkg}
            onBookNow={onBookPackage}
          />
        ))}
        
        {/* Loading Skeletons */}
        {loading && (
          <>
            {Array.from({ length: 6 })?.map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>
      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            loading={loadingMore}
            iconName="ChevronDown"
            iconPosition="right"
          >
            Load More Packages
          </Button>
        </div>
      )}
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center mt-8 py-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} />
            </div>
            <span className="text-sm">Loading more packages...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageGrid;