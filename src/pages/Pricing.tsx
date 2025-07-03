import React from 'react';
import { Check, Crown, Key, Headphones, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
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
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover fade-in-up">
              <Crown className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-[#8b7dd8] text-sm font-semibold">Flexible Plans</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-6 text-glow fade-in-up-delay-1">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto fade-in-up-delay-2">
              Start free with key system or upgrade to premium for instant access and priority support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 relative overflow-hidden group hover:border-slate-600/50 transition-all duration-500 scale-hover shimmer fade-in-up-delay-3">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                    <Key className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white text-glow">Free Plan</h3>
                    <p className="text-slate-400">Key system required</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-4xl font-bold text-white mb-2 text-glow">$0</div>
                  <div className="text-slate-400">Forever free</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Access to all 5 games</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Regular script updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Community support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-300">Key system required</span>
                  </div>
                </div>

                <Link 
                  to="/key-system"
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-white py-4 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-600/50 hover:scale-105 hover:border-slate-500/50 shimmer flex items-center justify-center"
                >
                  Get Free Access
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-[#3834a4]/30 to-[#4c46b8]/30 backdrop-blur-md rounded-2xl border border-[#3834a4]/50 p-8 relative overflow-hidden group hover:border-[#3834a4]/70 transition-all duration-500 scale-hover fade-in-up-delay-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3834a4]/5 to-[#4c46b8]/5"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#3834a4]/20 to-[#4c46b8]/20 rounded-full blur-xl"></div>
              
              {/* Premium badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                POPULAR
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#3834a4] to-[#4c46b8] rounded-lg shadow-lg shadow-[#3834a4]/25">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white text-glow">Premium Plan</h3>
                    <p className="text-[#8b7dd8]">No key system</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-4xl font-bold text-white mb-2 text-glow">$9.99</div>
                  <div className="text-slate-400">per month</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#8b7dd8]" />
                    <span className="text-slate-300">No key system - instant access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-[#8b7dd8]" />
                    <span className="text-slate-300">Priority support (24/7)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#8b7dd8]" />
                    <span className="text-slate-300">Early access to new features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-[#8b7dd8]" />
                    <span className="text-slate-300">Premium-only scripts</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-4 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 hover:from-[#4c46b8] hover:to-[#5a54c2]">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 fade-in-up-delay-5">
            <p className="text-slate-400">
              Questions about pricing? 
              <a href="#" className="text-[#8b7dd8] hover:text-[#a094e0] ml-1 transition-colors duration-300 shimmer">Contact our team</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;