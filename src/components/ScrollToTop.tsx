import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top of the page when a new route is opened. Simulates normal browser behavior */
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
