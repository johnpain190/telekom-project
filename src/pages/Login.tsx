import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Login = () => {
  const [username, setUsername] = useState("");
  const [rememberUser, setRememberUser] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Telekom Logo */}
      <div className="absolute top-8 left-8 z-10">
        <div className="w-16 h-16 bg-telekom rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">T</span>
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0" 
           style={{ 
             background: 'linear-gradient(135deg, #E20074 0%, #B8005C 30%, #8E0040 60%, #6B0030 100%)',
             filter: 'blur(1px)'
           }} />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-8 border-0 bg-white/95 backdrop-blur-sm" 
              style={{ boxShadow: 'var(--shadow-card)' }}>
          
          {/* Help Icon */}
          <div className="flex justify-end mb-4">
            <button className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 text-sm">
              ?
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telekom focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-sm">
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
              <span className="text-sm text-gray-700">Benutzername merken</span>
            </div>
            <button className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-sm">
              ?
            </button>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-telekom hover:bg-telekom-dark text-white py-3 rounded-lg font-medium transition-colors"
              style={{ boxShadow: 'var(--shadow-button)' }}
            >
              Weiter
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Andere Anmeldeoptionen
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Neu hier? Jetzt registrieren
            </button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white/80 text-xs">
        <div>
          <div>© Telekom Deutschland GmbH</div>
          <div>26.22.0</div>
        </div>
        <div className="flex space-x-4">
          <button className="hover:text-white">Impressum</button>
          <button className="hover:text-white">Datenschutz</button>
        </div>
      </div>

      {/* Logo Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <div className="text-white/60 text-xs">Telekom Logo</div>
      </div>
    </div>
  );
};

export default Login;