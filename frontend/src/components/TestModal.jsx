import React from 'react';
import { X, Play, Square, Send, CheckCircle, AlertCircle } from 'lucide-react';

const TestModal = ({
  showModal,
  step,
  formData,
  dispatch,
  isRecording,
  audioBlob,
  submitting,
  testResult,
  onClose,
  onNext,
  onStartRecording,
  onStopRecording,
  onReRecord,
  onSubmit,
  validateStep1
}) => {
  if (!showModal) return null;

  const QuestionField = ({ question, name, value, onChange }) => {
    const options = [
      { label: 'Not at all', value: '0' },
      { label: 'Several days', value: '1' },
      { label: 'More than half the days', value: '2' },
      { label: 'Nearly every day', value: '3' }
    ];

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">{question}</label>
        <div className="space-y-2">
          {options.map((option) => (
            <label 
              key={option.value} 
              className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {step === 1 && 'Pre-Assessment Screening'}
                {step === 2 && 'Voice Recording'}
                {step === 3 && 'Assessment Complete'}
              </h2>
              <p className="text-white/90 text-sm">
                {step === 1 && 'Please answer these questions honestly'}
                {step === 2 && 'Record your response to the prompt'}
                {step === 3 && 'Your assessment has been submitted'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-500 ${step >= s ? 'w-full' : 'w-0'}`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Form */}
          {step === 1 && (
            <div className="space-y-6 animate-slideUp">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'fullName', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age (Minimum 18) *
                    </label>
                    <input
                      type="number"
                      min="18"
                      value={formData.age}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'age', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
              </div>

              {/* Mental Health Questions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-purple-900 mb-4">
                  Over the last 2 weeks, how often have you been bothered by:
                </h3>
                <div className="space-y-6">
                  <QuestionField
                    question="1. Little interest or pleasure in doing things?"
                    name="question1"
                    value={formData.question1}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question1', value })}
                  />

                  <QuestionField
                    question="2. Feeling down, depressed, or hopeless?"
                    name="question2"
                    value={formData.question2}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question2', value })}
                  />

                  <QuestionField
                    question="3. Trouble falling or staying asleep, or sleeping too much?"
                    name="question3"
                    value={formData.question3}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question3', value })}
                  />
                </div>
              </div>

              <button
                onClick={onNext}
                disabled={!validateStep1()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                Continue to Voice Recording
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Recording */}
          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              {/* Prompt Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-lg">
                <div className="text-center">
                  <h3 className="font-bold text-indigo-900 mb-4 text-lg">
                    Please read this prompt aloud:
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4">
                    <p className="text-3xl font-bold text-indigo-900 mb-3">
                      আপনাকে কি হতাশ বা দুঃখিত লাগছে?
                    </p>
                    <p className="text-lg text-gray-600 italic">
                      (Are you feeling depressed or sad?)
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    💡 Tip: Speak naturally and clearly for the best results
                  </p>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex flex-col items-center gap-6">
                  {/* Recording Status */}
                  {isRecording && (
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 px-6 py-3 rounded-full animate-pulse">
                      <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                      <span className="font-bold text-lg">Recording in progress...</span>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex items-center gap-3 text-green-600 bg-green-50 px-6 py-3 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-lg">Recording saved successfully!</span>
                    </div>
                  )}

                  {!isRecording && !audioBlob && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">Click the button below to start recording</p>
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex gap-4">
                    {!isRecording && !audioBlob && (
                      <button
                        onClick={onStartRecording}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Play className="w-6 h-6" />
                        Start Recording
                      </button>
                    )}

                    {isRecording && (
                      <button
                        onClick={onStopRecording}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Square className="w-6 h-6" />
                        Stop Recording
                      </button>
                    )}

                    {audioBlob && !isRecording && (
                      <>
                        <button
                          onClick={onReRecord}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Re-record
                        </button>
                        <button
                          onClick={onSubmit}
                          disabled={submitting}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          <Send className="w-6 h-6" />
                          {submitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && testResult && (
            <div className="space-y-6 text-center animate-slideUp">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Assessment Submitted Successfully!
              </h3>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-200">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Your Assessment ID
                </h4>
                <p className="text-4xl font-mono font-bold text-indigo-600 mb-4">
                  {testResult.testId}
                </p>
                <p className="text-sm text-gray-600">
                  Save this ID to track your assessment results
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="flex items-start gap-4 text-left">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900 mb-2">
                      Processing Your Assessment
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Our AI system is currently analyzing your voice patterns and questionnaire responses. 
                      Due to the comprehensive nature of our analysis, results will be available within 24-48 hours. 
                      You'll receive a notification once your detailed report is ready.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-3">
                  What happens next?
                </h4>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Voice analysis using advanced machine learning models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Questionnaire evaluation and risk assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Comprehensive report generation with recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Notification when results are ready</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestModal;