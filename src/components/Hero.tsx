import React from 'react';
import { Shield, Zap, Users, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen grid-background flex items-center justify-center overflow-hidden pt-20">
      {/* Animated floating elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse float-animation"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/5 to-purple-700/5 rounded-full blur-3xl animate-pulse delay-500 float-animation-slow"></div>
      
      {/* Particle Effects - Fixed positioning to spread across screen */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${5 + (i * 3.8)}%`, // Spread particles evenly across width
            animationDelay: `${i * 0.8}s`, // Stagger animation start times
            animationDuration: `${20 + (i % 10)}s`, // Vary animation speeds
          }}
        />
      ))}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8 fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Premium Roblox Scripts</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight text-glow fade-in-up-delay-1">
              Luminous
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed fade-in-up-delay-2">
              Premium Roblox exploits with undetected scripts for your favorite games
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up-delay-3">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 scale-hover shimmer">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-200">Undetected</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 scale-hover shimmer">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-200">Fast Updates</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 scale-hover shimmer">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-200">24/7 Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in-up-delay-4">
            <Link 
              to="/key-system"
              className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              to="/pricing"
              className="border border-slate-600 text-slate-200 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-500 hover:bg-slate-800/50 hover:border-purple-500/50 hover:text-purple-400 scale-hover shimmer backdrop-blur-md"
            >
              View Pricing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-purple-500/20 fade-in-up-delay-5">
            <div className="text-center group scale-hover">
              <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-500 text-glow">50K+</div>
              <div className="text-slate-400">Active Users</div>
            </div>
            <div className="text-center group scale-hover">
              <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-500 text-glow">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center group scale-hover">
              <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-500 text-glow">5</div>
              <div className="text-slate-400">Supported Games</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;