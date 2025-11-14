import React from 'react';
import { Mic, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

const TestCard = ({ onStartTest }) => {
  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'গবেষণা ডেটা সংগ্রহ', color: 'text-yellow-600' },
    { icon: <Shield className="w-5 h-5" />, text: 'সম্পূর্ণ বেনামী', color: 'text-blue-600' },
    { icon: <Clock className="w-5 h-5" />, text: '৫-মিনিটের প্রক্রিয়া', color: 'text-green-600' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'গবেষণা অবদান', color: 'text-purple-600' }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl animate-scaleIn" style={{ animationDelay: '600ms' }}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient"></div>
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative p-8 sm:p-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold">গবেষণা চলমান • আপনার অংশগ্রহণ মূল্যবান</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              গবেষণায় অংশগ্রহণ করতে প্রস্তুত?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              মানসিক স্বাস্থ্য গবেষণার জন্য আপনার ভয়েস এবং PHQ-8 তথ্য প্রদান করুন। আপনার অবদান ভবিষ্যতে মানসিক স্বাস্থ্য চিকিৎসা এবং গবেষণার উন্নতিতে গুরুত্বপূর্ণ ভূমিকা পালন করবে।
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="bg-white/20 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-center">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <button
              onClick={onStartTest}
              className="group relative bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Mic className="w-6 h-6 text-white" />
              </div>
              গবেষণায় অংশ নিন
              <div className="absolute -right-1 -top-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Free
              </div>
            </button>

            <p className="text-white/80 text-sm">
              ⚡ তাৎক্ষণিক সংগ্রহ • 🔒 সম্পূর্ণ বেনামী • 📊 গবেষণা উদ্দেশ্যে
            </p>
          </div>

          {/* Info Banner */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3 text-left">
              <Shield className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div className="text-white/90 text-sm">
                <span className="font-semibold">গোপনীয়তার নিশ্চয়তা:</span> আপনার ভয়েস ডেটা এনক্রিপ্ট করা হয় এবং সম্পূর্ণ বেনামী অবস্থায় গবেষণা ডেটাবেসে সংরক্ষিত হয়। কোনো ব্যক্তিগত পরিচয় তথ্য সংরক্ষণ করা হয় না। সকল ডেটা শুধুমাত্র একাডেমিক গবেষণা উদ্দেশ্যে ব্যবহৃত হবে।
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default TestCard;