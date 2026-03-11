import { useState, useEffect } from 'react';
import { compassService } from '../services/compassService';

export function useCompass() {
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    compassService.start();
    const unsubscribe = compassService.addListener(setBearing);
    return () => {
      unsubscribe();
      compassService.stop();
    };
  }, []);

  return { bearing };
}
