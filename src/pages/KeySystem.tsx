import React, { useState } from 'react';
import { Key, CheckCircle, ExternalLink, AlertTriangle, Copy, X, Sparkles, Loader } from 'lucide-react';
import { validateKey, KeyValidationResult } from '../utils/keyValidation';
import Dashboard from '../components/Dashboard';

interface KeyProvider {
  name: string;
  checkpoints: number;
  description: string;
  link: string;
}

const keyProviders: KeyProvider[] = [
  {
    name: 'Linkvertise',
    checkpoints: 2,
    description: 'Quick and easy verification with just 2 simple steps',
    link: 'https://linkvertise.com/your-linkvertise-link' // Placeholder link
  },
  {
    name: 'Lootlabs',
    checkpoints: 3,
    description: 'More checkpoints but reliable verification process',
    link: 'https://loot-labs.com/your-lootlabs-link' // Placeholder link
  }
];

const KeySystem: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<KeyValidationResult | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleVerifyKey = async () => {
    if (!keyInput.trim()) return;
    
    setIsValidating(true);
    setValidationResult(null);
    
    try {
      const result = await validateKey(keyInput.trim());
      setValidationResult(result);
      
      if (result.isValid && result.data) {
        setShowDashboard(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        code: 'VALIDATION_ERROR',
        message: 'An unexpected error occurred during validation.'
      });
      setShowErrorModal(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setKeyInput('');
    setValidationResult(null);
    setSelectedProvider(null);
  };

  const getSelectedProviderLink = () => {
    const provider = keyProviders.find(p => p.name === selectedProvider);
    return provider?.link || '#';
  };

  // Show dashboard if key is valid
  if (showDashboard && validationResult?.isValid && validationResult.data) {
    return <Dashboard keyData={validationResult.data} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen unique-background pt-20 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>

      {/* Particle Effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            '--random-x': `${(Math.random() - 0.5) * 100}px`
          } as React.CSSProperties}
        />
      ))}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover fade-in-up">
              <Key className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-[#8b7dd8] text-sm font-semibold">Free Access</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-6 text-glow fade-in-up-delay-1">
              Key System Guide
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto fade-in-up-delay-2">
              Choose your preferred key provider and follow the simple steps to get your access key
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Provider Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {keyProviders.map((provider, index) => (
                <div
                  key={provider.name}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-500 backdrop-blur-md scale-hover shimmer ${
                    selectedProvider === provider.name
                      ? 'bg-[#3834a4]/10 border-[#3834a4]/50 shadow-lg shadow-[#3834a4]/20 scale-105'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/40'
                  } fade-in-up-delay-${index + 3}`}
                  onClick={() => setSelectedProvider(provider.name)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all duration-500 ${
                        selectedProvider === provider.name 
                          ? 'bg-gradient-to-br from-[#3834a4] to-[#4c46b8] shadow-lg shadow-[#3834a4]/25' 
                          : 'bg-slate-700/50 border border-slate-600/50'
                      }`}>
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white text-glow">{provider.name}</h3>
                        <div className="text-sm text-slate-400">{provider.checkpoints} checkpoints</div>
                      </div>
                    </div>
                    {selectedProvider === provider.name && (
                      <CheckCircle className="w-6 h-6 text-[#8b7dd8]" />
                    )}
                  </div>

                  <p className="text-slate-400 mb-4">{provider.description}</p>
                </div>
              ))}
            </div>

            {/* Step-by-Step Guide */}
            {selectedProvider && (
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer fade-in-up-delay-5">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-glow">
                  <Key className="w-6 h-6 text-[#8b7dd8]" />
                  How to Get Your {selectedProvider} Key
                </h3>

                <div className="space-y-6">
                  {/* Step indicators */}
                  <div className="flex items-center justify-between mb-8">
                    {Array.from({ length: keyProviders.find(p => p.name === selectedProvider)?.checkpoints || 0 }).map((_, index) => (
                      <React.Fragment key={index}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-[#3834a4] border-[#3834a4] shadow-lg shadow-[#3834a4]/25">
                          <span className="text-white font-semibold">{index + 1}</span>
                        </div>
                        {index < (keyProviders.find(p => p.name === selectedProvider)?.checkpoints || 0) - 1 && (
                          <div className="flex-1 h-0.5 mx-4 bg-[#3834a4]"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Steps content */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-md scale-hover shimmer">
                      <h4 className="font-semibold text-white mb-2 text-glow">Step 1: Click the Get Key Button</h4>
                      <p className="text-slate-400 text-sm mb-3">Click the button below to start the key generation process</p>
                      <a 
                        href={getSelectedProviderLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Get {selectedProvider} Key
                      </a>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-md scale-hover shimmer">
                      <h4 className="font-semibold text-white mb-2 text-glow">Step 2: Complete Verification</h4>
                      <p className="text-slate-400 text-sm">Follow the {selectedProvider.toLowerCase()} verification process and complete all required steps</p>
                    </div>

                    {selectedProvider === 'Lootlabs' && (
                      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-md scale-hover shimmer">
                        <h4 className="font-semibold text-white mb-2 text-glow">Step 3: Final Confirmation</h4>
                        <p className="text-slate-400 text-sm">Complete the final verification step to receive your key</p>
                      </div>
                    )}

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-md scale-hover shimmer">
                      <h4 className="font-semibold text-white mb-2 text-glow">Final: Enter Your Key</h4>
                      <p className="text-slate-400 text-sm mb-3">Copy the key and paste it in the input field below</p>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter your key here..."
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          className="flex-1 bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                          disabled={isValidating}
                        />
                        <button 
                          onClick={handleVerifyKey}
                          disabled={!keyInput.trim() || isValidating}
                          className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed hover:scale-105 flex items-center gap-2"
                        >
                          {isValidating ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-12 bg-[#3834a4]/20 border border-[#3834a4]/30 rounded-2xl p-6 backdrop-blur-md scale-hover shimmer fade-in-up-delay-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 text-glow">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Important Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>• Keep your key safe - don't share it with others</div>
                <div>• Keys expire after the specified duration</div>
                <div>• Use an ad-blocker for faster completion</div>
                <div>• Complete all steps in the same browser session</div>
                <div>• Contact support if you encounter issues</div>
                <div>• Premium users skip this entire process</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Modal */}
        {showErrorModal && validationResult && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full scale-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-red-400 flex items-center gap-3 text-glow">
                  <AlertTriangle className="w-6 h-6" />
                  Key Validation Failed
                </h3>
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="text-slate-400 hover:text-white transition-colors scale-hover"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-4">
                  <h4 className="text-red-400 font-semibold mb-2">Error Code: {validationResult.code}</h4>
                  <p className="text-slate-300 text-sm">{validationResult.message}</p>
                </div>

                <div className="text-sm text-slate-400">
                  <p className="mb-2">Common solutions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure you copied the entire key</li>
                    <li>Check that the key hasn't expired</li>
                    <li>Try generating a new key</li>
                    <li>Contact support if the issue persists</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default KeySystem;