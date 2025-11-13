import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#dc2626'];
const CHART_COLORS = {
  primary: '#4f46e5',
  secondary: '#9333ea',
  accent: '#ec4899',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444'
};

const ChartsSection = ({ stats }) => {
  // Demo data for 6-month trend
  const trendData = [
    { month: 'May', assessments: 98, minimal: 42, mild: 28, moderate: 18, severe: 10 },
    { month: 'Jun', assessments: 112, minimal: 48, mild: 32, moderate: 20, severe: 12 },
    { month: 'Jul', assessments: 125, minimal: 55, mild: 35, moderate: 22, severe: 13 },
    { month: 'Aug', assessments: 138, minimal: 60, mild: 40, moderate: 24, severe: 14 },
    { month: 'Sep', assessments: 145, minimal: 65, mild: 42, moderate: 25, severe: 13 },
    { month: 'Oct', assessments: 156, minimal: 70, mild: 45, moderate: 27, severe: 14 }
  ];

  const statusDistribution = stats?.statusDistribution || [
    { name: 'সর্বনিম্ন (0-4)', value: 35.3 },
    { name: 'সামান্য (5-9)', value: 23.7 },
    { name: 'মাঝারি (10-14)', value: 18.6 },
    { name: 'মাঝারি থেকে গুরুতর (15-19)', value: 14.1 },
    { name: 'গুরুতর (20-24)', value: 8.3 }
  ];

  const ageDistribution = stats?.ageDistribution || [
    { ageGroup: '18-24', count: 45 },
    { ageGroup: '25-34', count: 52 },
    { ageGroup: '35-44', count: 38 },
    { ageGroup: '45-54', count: 15 },
    { ageGroup: '55+', count: 6 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-indigo-100">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
      {/* Mental Health Status Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              মানসিক স্বাস্থ্য অবস্থা বণ্টন
            </h2>
            <p className="text-sm text-gray-600">PHQ-8 তীব্রতা স্তর অনুযায়ী</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={statusDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {statusDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {statusDistribution.map((item, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[index] }}></div>
              <p className="text-xs font-semibold text-gray-700">{item.name}</p>
              <p className="text-lg font-bold" style={{ color: COLORS[index] }}>{item.value}%</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-indigo-700">স্কোর ব্যাখ্যা:</span> PHQ-8 স্কোর 0-4 সর্বনিম্ন, 5-9 সামান্য, 10-14 মাঝারি, 15-19 মাঝারি থেকে গুরুতর, এবং 20-24 গুরুতর বিষণ্নতা নির্দেশ করে।
          </p>
        </div>
      </div>

      {/* Age Demographics */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              বয়সভিত্তিক বণ্টন
            </h2>
            <p className="text-sm text-gray-600">বিভিন্ন বয়সের গ্রুপ</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={ageDistribution}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="ageGroup" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              name="সংখ্যা"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 6-Month Trend Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              ৬ মাসের প্রবণতা বিশ্লেষণ
            </h2>
            <p className="text-sm text-gray-600">মূল্যায়ন সংখ্যা এবং তীব্রতা ট্র্যাকিং</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="minimal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="mild" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="moderate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="severe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="minimal" 
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#minimal)"
              name="সর্বনিম্ন (0-4)"
              animationBegin={0}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="mild" 
              stroke="#eab308" 
              fillOpacity={1} 
              fill="url(#mild)"
              name="সামান্য (5-9)"
              animationBegin={200}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="moderate" 
              stroke="#f97316" 
              fillOpacity={1} 
              fill="url(#moderate)"
              name="মাঝারি (10-14)"
              animationBegin={400}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="severe" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#severe)"
              name="গুরুতর (15-24)"
              animationBegin={600}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-indigo-700">প্রবণতা বিশ্লেষণ:</span> গত ৬ মাসে মোট মূল্যায়ন 59% বৃদ্ধি পেয়েছে। সর্বনিম্ন এবং সামান্য বিষণ্নতার হার উন্নতি দেখাচ্ছে, যা প্রাথমিক হস্তক্ষেপ কার্যক্রমের ইতিবাচক প্রভাব নির্দেশ করে।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;