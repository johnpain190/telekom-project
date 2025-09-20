import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleRedirect = useCallback(() => {
    navigate("/security-check");
  }, [navigate]);

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
