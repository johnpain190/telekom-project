import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Toggle these for testing - should match SecurityCheck.tsx
  const TURNSTILE_ENABLED = false; // set to false to bypass Turnstile
  const LOGIN_ENABLED = true; // set to false to bypass Login page
  
  const handleRedirect = useCallback(() => {
    if (!TURNSTILE_ENABLED) {
      // Turnstile disabled - redirect based on login setting
      if (LOGIN_ENABLED) {
        navigate("/login");
      } else {
        navigate("/survey");
      }
    } else {
      // Turnstile enabled - always go to security check first
      navigate("/security-check");
    }
  }, [navigate, TURNSTILE_ENABLED, LOGIN_ENABLED]);

  useEffect(() => {
    // Auto-redirect to security check
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default React.memo(Index);
