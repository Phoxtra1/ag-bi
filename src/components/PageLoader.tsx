import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';

interface PageLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({ children, minLoadTime = 1500 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return <>{children}</>;
};

export default PageLoader;
