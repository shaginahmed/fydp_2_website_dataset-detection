import React from 'react';
import { Users, TrendingUp, TrendingDown, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const StatsGrid = ({ stats }) => {
  const statsData = [
    {
      title: 'Total Assessments',
      value: stats?.totalTests || 156,
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      trend: '+12%',
      trendUp: true,
      description: 'This month'
    },
    {
      title: 'At Risk',
      value: `${stats?.percentageDepressed || 28.4}%`,
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      trend: '-3%',
      trendUp: false,
      description: 'Decreased'
    },
    {
      title: 'Healthy',
      value: `${stats?.percentageNotDepressed || 58.7}%`,
      icon: <TrendingDown className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      trend: '+8%',
      trendUp: true,
      description: 'Improved'
    },
    {
      title: 'Monitoring',
      value: `${stats?.percentageNeutral || 12.9}%`,
      icon: <Activity className="w-8 h-8" />,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      trend: '-2%',
      trendUp: false,
      description: 'Follow-up needed'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideUp">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {stat.title}
                </p>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {stat.trend}
                  </span>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </div>
              
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg text-white transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: typeof stat.value === 'string' && stat.value.includes('%') ? stat.value : '100%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;