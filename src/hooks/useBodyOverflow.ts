import { useEffect } from 'react';

export const useBodyOverflow = (isOpen: boolean) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isOpen]);
};
