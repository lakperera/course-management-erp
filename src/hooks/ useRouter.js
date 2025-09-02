import { useState, useCallback } from 'react';

export const useRouter = (defaultRoute = 'dashboard') => {
  const [currentRoute, setCurrentRoute] = useState(defaultRoute);
  const [routeHistory, setRouteHistory] = useState([defaultRoute]);

  const navigate = useCallback((route, replace = false) => {
    if (route === currentRoute) return;
    
    setCurrentRoute(route);
    
    if (replace) {
      setRouteHistory(prev => [...prev.slice(0, -1), route]);
    } else {
      setRouteHistory(prev => [...prev, route]);
    }
  }, [currentRoute]);

  const goBack = useCallback(() => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      setCurrentRoute(previousRoute);
      setRouteHistory(newHistory);
    }
  }, [routeHistory]);

  const canGoBack = routeHistory.length > 1;

  return { 
    currentRoute, 
    navigate, 
    goBack, 
    canGoBack,
    routeHistory 
  };
};