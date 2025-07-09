import React, { useEffect, useState } from 'react';
import { Shield, Zap, Users, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGames } from '../utils/gameStorage';

const Hero: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
    randomX: number;
  }>>([]);
  const [gameCount, setGameCount] = useState(5);

  useEffect(() => {
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 15,
      animationDuration: 15 + Math.random() * 10,
      randomX: (Math.random() - 0.5) * 100
    }));
    setParticles(particleArray);

    // Get actual game count
    const games = getGames();
    setGameCount(games.length);
  }, []);

  return (
    <section className="relative min-h-screen unique-background flex items-center justify-center overflow-hidden pt-20">
      {/* Floating orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>
      
      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              '--random-x': `${particle.randomX}px`
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8 fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover">
              <Sparkles className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-[#8b7dd8] text-sm font-semibold">Premium Roblox Scripts</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-6 leading-tight text-glow fade-in-up-delay-1">
              Luminous Scripts
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed fade-in-up-delay-2">
              Premium Roblox exploits with undetected scripts for your favorite games
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up-delay-3">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-[#3834a4]/50 transition-all duration-500 scale-hover shimmer">
              <Shield className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-sm text-slate-200">Undetected</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-[#3834a4]/50 transition-all duration-500 scale-hover shimmer">
              <Zap className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-sm text-slate-200">Fast Updates</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-md rounded-full border border-slate-700/50 hover:border-[#3834a4]/50 transition-all duration-500 scale-hover shimmer">
              <Users className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-sm text-slate-200">24/7 Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in-up-delay-4">
            <Link 
              to="/key-system"
              className="group bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              to="/pricing"
              className="border border-slate-600 text-slate-200 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md"
            >
              View Pricing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-[#3834a4]/20 fade-in-up-delay-5">
            <div className="text-center group scale-hover mx-auto">
              <div className="text-3xl font-bold text-[#8b7dd8] mb-2 group-hover:scale-110 transition-transform duration-500 text-glow">{gameCount}</div>
              <div className="text-slate-400">Supported Games</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;