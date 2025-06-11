import React, { useState, useEffect } from 'react';
import { User, Clock, Activity, Key, LogOut, RefreshCw, AlertCircle, CheckCircle, Crown } from 'lucide-react';

interface DashboardProps {
  keyData: {
    note: string;
    total_executions: number;
    auth_expire: number;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ keyData, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = keyData.auth_expire - now;
      
      if (timeRemaining <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }
      
      const days = Math.floor(timeRemaining / 86400);
      const hours = Math.floor((timeRemaining % 86400) / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [keyData.auth_expire]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen grid-background pt-20 relative overflow-hidden">
      {/* Particle Effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover fade-in-up">
              <User className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-[#8b7dd8] text-sm font-semibold">User Dashboard</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-6 text-glow fade-in-up-delay-1">
              Welcome Back
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto fade-in-up-delay-2">
              Your key is active and ready to use. Monitor your usage and key status below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Key Status Alert */}
            {isExpired ? (
              <div className="bg-red-900/20 border border-red-700/30 rounded-2xl p-6 mb-8 backdrop-blur-md scale-hover shimmer fade-in-up-delay-3">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-400 text-glow">Key Expired</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Your key has expired. You need to generate a new key to continue using the service.
                </p>
                <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Generate New Key
                </button>
              </div>
            ) : (
              <div className="bg-green-900/20 border border-green-700/30 rounded-2xl p-6 mb-8 backdrop-blur-md scale-hover shimmer fade-in-up-delay-3">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400 text-glow">Key Active</h3>
                </div>
                <p className="text-slate-300">
                  Your key is valid and active. You can access all premium features.
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Key Type */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 scale-hover shimmer fade-in-up-delay-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#3834a4] to-[#4c46b8] rounded-lg shadow-lg shadow-[#3834a4]/25">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white text-glow">Key Type</h3>
                    <p className="text-slate-400 text-sm">Current Plan</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#8b7dd8] text-glow">{keyData.note}</div>
              </div>

              {/* Total Executions */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 scale-hover shimmer fade-in-up-delay-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                    <Activity className="w-6 h-6 text-[#8b7dd8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white text-glow">Executions</h3>
                    <p className="text-slate-400 text-sm">Total Usage</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#8b7dd8] text-glow">{keyData.total_executions.toLocaleString()}</div>
              </div>

              {/* Time Remaining */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 scale-hover shimmer fade-in-up-delay-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-500/20 border border-red-500/30' : 'bg-slate-700/50 border border-slate-600/50'}`}>
                    <Clock className={`w-6 h-6 ${isExpired ? 'text-red-400' : 'text-[#8b7dd8]'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white text-glow">Time Left</h3>
                    <p className="text-slate-400 text-sm">Until Expiry</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold text-glow ${isExpired ? 'text-red-400' : 'text-[#8b7dd8]'}`}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Key Details */}
            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 mb-8 scale-hover shimmer fade-in-up-delay-7">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-glow">
                <Key className="w-6 h-6 text-[#8b7dd8]" />
                Key Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Key Type</h4>
                  <p className="text-white font-medium">{keyData.note}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Total Executions</h4>
                  <p className="text-white font-medium">{keyData.total_executions.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Expires On</h4>
                  <p className="text-white font-medium">{formatDate(keyData.auth_expire)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Status</h4>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    isExpired 
                      ? 'text-red-400 bg-red-400/10 border border-red-400/20' 
                      : 'text-green-400 bg-green-400/10 border border-green-400/20'
                  }`}>
                    {isExpired ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up-delay-8">
              {isExpired && (
                <button className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Renew Key
                </button>
              )}
              <button 
                onClick={onLogout}
                className="border border-slate-600 text-slate-200 px-8 py-4 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;