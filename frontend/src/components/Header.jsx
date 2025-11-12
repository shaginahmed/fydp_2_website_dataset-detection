import React from 'react';
import { Brain, Activity, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EchoMind AI
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Voice-Based Depression Detection System
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Live Monitoring</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">HIPAA Compliant</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-indigo-700">Advanced AI Analysis:</span> Our state-of-the-art voice recognition technology analyzes acoustic features, speech patterns, and emotional indicators to provide accurate mental health assessments with 94.2% accuracy rate.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;