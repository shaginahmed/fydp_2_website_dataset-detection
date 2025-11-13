import React from "react";
import { Users, ClipboardList, FileAudio, Database } from "lucide-react";

const StatsGrid = ({ stats }) => {
  const statsData = [
    {
      title: "মোট অংশগ্রহণকারী",
      value: stats?.totalTests || 0,
      icon: <Users className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "মোট জমা দেওয়া রেকর্ড"
    },
    {
      title: "মোট ভয়েস রেকর্ডিং",
      value: stats?.totalAudio || 0,
      icon: <FileAudio className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      description: "সংরক্ষিত অডিও ফাইল সংখ্যা"
    },
    {
      title: "গড় PHQ-8 স্কোর",
      value: stats?.averagePhq8 ? stats.averagePhq8.toFixed(1) : "0.0",
      icon: <ClipboardList className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      description: "গবেষণার গড় মান"
    },
    {
    title: "পুরুষ বনাম নারী অংশগ্রহণকারী",
    value: `${stats?.malePercent || 0}% / ${stats?.femalePercent || 0}%`,
    icon: <Users className="w-8 h-8" />,
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    description: "অংশগ্রহণকারীর লিঙ্গ অনুপাত"
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
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {stat.title}
                </p>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>

              <div
                className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg text-white transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
            </div>

            {/* Decorative bar (optional) */}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
