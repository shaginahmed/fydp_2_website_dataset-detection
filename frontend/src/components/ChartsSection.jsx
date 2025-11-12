import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const COLORS = ['#ef4444', '#22c55e', '#eab308'];
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
    { month: 'May', assessments: 98, atRisk: 32, healthy: 52, monitoring: 14 },
    { month: 'Jun', assessments: 112, atRisk: 35, healthy: 61, monitoring: 16 },
    { month: 'Jul', assessments: 125, atRisk: 38, healthy: 70, monitoring: 17 },
    { month: 'Aug', assessments: 138, atRisk: 40, healthy: 78, monitoring: 20 },
    { month: 'Sep', assessments: 145, atRisk: 42, healthy: 85, monitoring: 18 },
    { month: 'Oct', assessments: 156, atRisk: 44, healthy: 92, monitoring: 20 }
  ];

  const statusDistribution = stats?.statusDistribution || [
    { name: 'ঝুঁকিতে', value: 28.4 },
    { name: 'সুস্থ', value: 58.7 },
    { name: 'মনিটরিং', value: 12.9 }
  ];

  const ageDistribution = stats?.ageDistribution || [
    { ageGroup: '১৮-২৪', count: 45 },
    { ageGroup: '২৫-৩৪', count: 52 },
    { ageGroup: '৩৫-৪৪', count: 38 },
    { ageGroup: '৪৫-৫৪', count: 15 },
    { ageGroup: '৫৫+', count: 6 }
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
            <p className="text-sm text-gray-600">বর্তমান মূল্যায়নের বিশ্লেষণ</p>
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

        <div className="grid grid-cols-3 gap-4 mt-6">
          {statusDistribution.map((item, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[index] }}></div>
              <p className="text-sm font-semibold text-gray-700">{item.name}</p>
              <p className="text-lg font-bold" style={{ color: COLORS[index] }}>{item.value}%</p>
            </div>
          ))}
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
            <p className="text-sm text-gray-600">বিভিন্ন বয়সের মধ্যে বণ্টন</p>
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
            <p className="text-sm text-gray-600">মূল্যায়নের সংখ্যা ও অবস্থার পরিবর্তন</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="assessments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="atRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="healthy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="assessments" 
              stroke={CHART_COLORS.primary} 
              fillOpacity={1} 
              fill="url(#assessments)"
              name="মোট মূল্যায়ন"
              animationBegin={0}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="healthy" 
              stroke={CHART_COLORS.success} 
              fillOpacity={1} 
              fill="url(#healthy)"
              name="সুস্থ"
              animationBegin={200}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="atRisk" 
              stroke={CHART_COLORS.danger} 
              fillOpacity={1} 
              fill="url(#atRisk)"
              name="ঝুঁকিতে"
              animationBegin={400}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-indigo-700">প্রবণতা বিশ্লেষণ:</span> গত ৬ মাসে মোট মূল্যায়ন ৫৯% বৃদ্ধি পেয়েছে এবং সুস্থ ফলাফল ৭৭% উন্নতি দেখিয়েছে। প্রাথমিক হস্তক্ষেপ কর্মসূচি ইতিবাচক প্রভাব ফেলছে।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;











// ### english version ###

// import React from 'react';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
// import { TrendingUp, Users, Calendar } from 'lucide-react';

// const COLORS = ['#ef4444', '#22c55e', '#eab308'];
// const CHART_COLORS = {
//   primary: '#4f46e5',
//   secondary: '#9333ea',
//   accent: '#ec4899',
//   success: '#22c55e',
//   warning: '#eab308',
//   danger: '#ef4444'
// };

// const ChartsSection = ({ stats }) => {
//   // Demo data for 6-month trend
//   const trendData = [
//     { month: 'May', assessments: 98, atRisk: 32, healthy: 52, monitoring: 14 },
//     { month: 'Jun', assessments: 112, atRisk: 35, healthy: 61, monitoring: 16 },
//     { month: 'Jul', assessments: 125, atRisk: 38, healthy: 70, monitoring: 17 },
//     { month: 'Aug', assessments: 138, atRisk: 40, healthy: 78, monitoring: 20 },
//     { month: 'Sep', assessments: 145, atRisk: 42, healthy: 85, monitoring: 18 },
//     { month: 'Oct', assessments: 156, atRisk: 44, healthy: 92, monitoring: 20 }
//   ];

//   const statusDistribution = stats?.statusDistribution || [
//     { name: 'At Risk', value: 28.4 },
//     { name: 'Healthy', value: 58.7 },
//     { name: 'Monitoring', value: 12.9 }
//   ];

//   const ageDistribution = stats?.ageDistribution || [
//     { ageGroup: '18-24', count: 45 },
//     { ageGroup: '25-34', count: 52 },
//     { ageGroup: '35-44', count: 38 },
//     { ageGroup: '45-54', count: 15 },
//     { ageGroup: '55+', count: 6 }
//   ];

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 rounded-lg shadow-xl border border-indigo-100">
//           <p className="font-semibold text-gray-900 mb-2">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: <span className="font-bold">{entry.value}</span>
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="space-y-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
//       {/* Mental Health Status Distribution */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg">
//             <TrendingUp className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Mental Health Status Distribution
//             </h2>
//             <p className="text-sm text-gray-600">Current assessment breakdown</p>
//           </div>
//         </div>
        
//         <ResponsiveContainer width="100%" height={350}>
//           <PieChart>
//             <Pie
//               data={statusDistribution}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//               outerRadius={120}
//               fill="#8884d8"
//               dataKey="value"
//               animationBegin={0}
//               animationDuration={800}
//             >
//               {statusDistribution.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={COLORS[index % COLORS.length]}
//                   className="hover:opacity-80 transition-opacity cursor-pointer"
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>

//         <div className="grid grid-cols-3 gap-4 mt-6">
//           {statusDistribution.map((item, index) => (
//             <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
//               <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[index] }}></div>
//               <p className="text-sm font-semibold text-gray-700">{item.name}</p>
//               <p className="text-lg font-bold" style={{ color: COLORS[index] }}>{item.value}%</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Age Demographics */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
//             <Users className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               Age Group Demographics
//             </h2>
//             <p className="text-sm text-gray-600">Distribution across age ranges</p>
//           </div>
//         </div>
        
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={ageDistribution}>
//             <defs>
//               <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
//                 <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis dataKey="ageGroup" stroke="#6b7280" />
//             <YAxis stroke="#6b7280" />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar 
//               dataKey="count" 
//               fill="url(#barGradient)" 
//               radius={[8, 8, 0, 0]}
//               animationBegin={0}
//               animationDuration={800}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 6-Month Trend Analysis */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg">
//             <Calendar className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
//               6-Month Trend Analysis
//             </h2>
//             <p className="text-sm text-gray-600">Assessment volume and status tracking</p>
//           </div>
//         </div>
        
//         <ResponsiveContainer width="100%" height={350}>
//           <AreaChart data={trendData}>
//             <defs>
//               <linearGradient id="assessments" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
//               </linearGradient>
//               <linearGradient id="atRisk" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0.1}/>
//               </linearGradient>
//               <linearGradient id="healthy" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.1}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis dataKey="month" stroke="#6b7280" />
//             <YAxis stroke="#6b7280" />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Area 
//               type="monotone" 
//               dataKey="assessments" 
//               stroke={CHART_COLORS.primary} 
//               fillOpacity={1} 
//               fill="url(#assessments)"
//               name="Total Assessments"
//               animationBegin={0}
//               animationDuration={1000}
//             />
//             <Area 
//               type="monotone" 
//               dataKey="healthy" 
//               stroke={CHART_COLORS.success} 
//               fillOpacity={1} 
//               fill="url(#healthy)"
//               name="Healthy"
//               animationBegin={200}
//               animationDuration={1000}
//             />
//             <Area 
//               type="monotone" 
//               dataKey="atRisk" 
//               stroke={CHART_COLORS.danger} 
//               fillOpacity={1} 
//               fill="url(#atRisk)"
//               name="At Risk"
//               animationBegin={400}
//               animationDuration={1000}
//             />
//           </AreaChart>
//         </ResponsiveContainer>

//         <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
//           <p className="text-sm text-gray-700">
//             <span className="font-semibold text-indigo-700">Trend Insight:</span> Total assessments increased by 59% over the past 6 months, with healthy outcomes improving by 77%. Early intervention programs showing positive impact.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartsSection;