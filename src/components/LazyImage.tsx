import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`${className} image-loading bg-gray-200`}
        aria-label={`Loading ${alt}`}
      />
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400 text-sm`}>
        Image not available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
    />
  );
};

export default LazyImage;