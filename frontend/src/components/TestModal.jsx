import React from 'react';
import { X, Play, Square, Send, CheckCircle, AlertCircle, Shield, Volume2, ChevronLeft, Brain, Users, Heart } from 'lucide-react';
const TestModal = ({
  showModal,
  step,
  formData,
  dispatch,
  consentData,
  consentDispatch,
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
  validateStep1,
  onBack // Add this prop to handle back navigation properly
}) => {
  if (!showModal) return null;

  // Check if all consent boxes are checked
  const allConsentsChecked = Object.values(consentData).every(val => val === true);

  // Handle consent changes
  const handleConsentChange = (field) => {
    consentDispatch({ type: "UPDATE_CONSENT", field, value: !consentData[field] });
  };

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack(); // Use parent's back handler if provided
    }
  };

  // Toggle functions
  const handleSelectAll = () => {
    Object.keys(consentData).forEach((key) => {
      consentDispatch({ type: "UPDATE_CONSENT", field: key, value: true });
    });
  };

  const handleUnselectAll = () => {
    Object.keys(consentData).forEach((key) => {
      consentDispatch({ type: "UPDATE_CONSENT", field: key, value: false });
    });
  };

  const QuestionField = ({ question, name, value, onChange }) => {
    const options = [
      { label: 'একেবারেই নয়', value: '0' },
      { label: 'কয়েক দিন', value: '1' },
      { label: 'অর্ধেকের বেশি দিন', value: '2' },
      { label: 'প্রায় প্রতিদিন', value: '3' }
    ];

    const handleLabelClick = (optionValue, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Only update if value actually changed - prevents infinite loop
    if (value !== optionValue) {
      onChange(optionValue);
    }
  };

    return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">{question}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
            onClick={(e) => handleLabelClick(option.value, e)}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleLabelClick(option.value, e);
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => { }}
              className="w-5 h-5 text-indigo-600 pointer-events-none"
              readOnly
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
  const ConsentCheckbox = ({ id, checked, onChange, children }) => (
    <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all duration-200 group">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 mt-0.5 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
      />
      <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
        {children}
      </span>
    </label>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
  {step === 0 && 'গবেষণার পরিচিতি'}
  {step === 1 && 'সম্মতি এবং চুক্তি'}
  {step === 2 && 'PHQ-9 প্রশ্নপত্র'}
  {step === 3 && 'ভয়েস রেকর্ডিং'}
  {step === 4 && 'অ্যাসেসমেন্ট সম্পন্ন'}
</h2>
<p className="text-white/90 text-sm">
  {step === 0 && 'গবেষণা সম্পর্কে জানুন'}
  {step === 1 && 'অংশগ্রহণের আগে দয়া করে পড়ুন এবং সম্মতি দিন'}
  {step === 2 && 'গত ২ সপ্তাহে আপনার অভিজ্ঞতা সম্পর্কে বলুন'}
  {step === 3 && 'প্রম্পটটি উচ্চস্বরে পড়ে রেকর্ড করুন'}
  {step === 4 && 'আপনার অ্যাসেসমেন্ট জমা দেওয়া হয়েছে'}
</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {step > 0 && step < 4 && (
                <button
                  onClick={handleBack}
                  disabled={isRecording}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                  title="পিছনে যান"
                  aria-label="Go back to previous step"
                >
                  <ChevronLeft className="w-6 h-6" />
                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    পিছনে যান
                  </span>
                </button>
              )}

              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 group relative"
                title="বন্ধ করুন"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  বন্ধ করুন
                </span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-500 ${step >= s ? 'w-full' : 'w-0'}`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]" style={{ scrollBehavior: 'auto' }}>
          {/* Step 0: Introduction */}
{step === 0 && (
  <div className="space-y-6 animate-slideUp">
    {/* Main Introduction Card */}
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">
            আমরা কেন আপনার তথ্য সংগ্রহ করছি?
          </h3>
          <p className="text-base text-gray-700 leading-relaxed">
            আপনার মনের যত্ন নেওয়া এবং মানসিক স্বাস্থ্য পরিষেবা উন্নত করাই আমাদের প্রধান লক্ষ্য। এই ওয়েবসাইটটি একটি গুরুত্বপূর্ণ গবেষণার অংশ।
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Point 1 */}
        <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-700 font-bold">১</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">সহজভাবে শনাক্ত করা:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                বর্তমানে মানসিক স্বাস্থ্যের সমস্যা, যেমন বিষণ্ণতা (Depression), সহজে এবং দ্রুত শনাক্ত করার জন্য ভালো প্রযুক্তির অভাব আছে। আমরা আপনার তথ্য ব্যবহার করে এমন একটি নতুন আর্টিফিশিয়াল ইন্টেলিজেন্স (AI) মডেল তৈরি করতে চাই, যা আপনার মনের অবস্থা বুঝতে পারবে।
              </p>
            </div>
          </div>
        </div>

        {/* Point 2 */}
        <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-700 font-bold">২</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">প্রযুক্তির ব্যবহার:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                আমরা বিশ্বাস করি যে, আপনার কথাবার্তার ধরন (গলার আওয়াজ) এবং প্রশ্নের উত্তর (Modified-Nine PHQ-9) বিশ্লেষণ করে আমরা মানসিক স্বাস্থ্যের সমস্যা বোঝার ক্ষেত্রে অনেক এগিয়ে যেতে পারি।
              </p>
            </div>
          </div>
        </div>

        {/* Point 3 */}
        <div className="bg-white rounded-xl p-6 border-l-4 border-pink-500">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-700 font-bold">৩</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">জনস্বাস্থ্যের উন্নতি:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                এই গবেষণা সফল হলে, ভবিষ্যতে ডাক্তার এবং স্বাস্থ্যকর্মীরা দ্রুত এবং কার্যকরভাবে মানুষকে সাহায্য করতে পারবেন। এর ফলে মানুষের কষ্টের সময় কমে আসবে এবং মানসিক স্বাস্থ্য পরিষেবা সবার কাছে পৌঁছে যাবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Your Role Card */}
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            আপনার ভূমিকা কী?
          </h3>
          <p className="text-base text-gray-700 leading-relaxed">
            আপনার দেওয়া সামান্য তথ্য এই গবেষণায় বিশাল পরিবর্তন আনতে পারে। আপনি এখানে যে ডেটা দেবেন, তা সম্পূর্ণভাবে সুরক্ষিত, গোপন থাকবে এবং আপনার পরিচয় প্রকাশ পাবে না।
          </p>
        </div>
      </div>
    </div>

    {/* Summary Card */}
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
      <div className="flex items-start gap-4">
        <Heart className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-purple-900 mb-3">
            সংক্ষেপে:
          </h3>
          <p className="text-base text-gray-700 leading-relaxed">
            আমরা আপনার অংশগ্রহণের মাধ্যমে মানসিক স্বাস্থ্য নির্ণয়ের পদ্ধতিকে আধুনিক এবং উন্নত করতে চাই। আপনার সময় এবং সহযোগিতা আমাদের জন্য অত্যন্ত মূল্যবান।
          </p>
        </div>
      </div>
    </div>

    {/* Call to Action */}
    <button
      onClick={onNext}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      পরবর্তী: সম্মতি এবং চুক্তি
      <ChevronLeft className="w-5 h-5 rotate-180" />
    </button>
  </div>
)}
          
          
          
          {/* Step 1: Consent */}
          {step === 1 && (
            <div className="space-y-6 animate-slideUp">
              {/* TOGGLE ALL CONSENTS */}
              <button
                onClick={() => {
                  if (allConsentsChecked) handleUnselectAll();
                  else handleSelectAll();
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md"
              >
                {allConsentsChecked
                  ? "সব চুক্তি ✕ অপসারণ করুন"
                  : "সব চুক্তি ✓ নির্বাচন করুন"}
              </button>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">
                      অবহিত সম্মতি এবং গোপনীয়তা চুক্তি
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      এই মানসিক স্বাস্থ্য মূল্যায়নে অংশ নেওয়ার আগে, নিচে লেখা শর্তগুলি মন দিয়ে পড়ুন এবং প্রতিটি ঘরে টিক চিহ্ন দিয়ে সম্মতি দিন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 mb-3">ক. স্বায়ত্তশাসন এবং নিয়ন্ত্রণ</h4>

                <ConsentCheckbox
                  id="voluntary"
                  checked={consentData.voluntary}
                  onChange={() => handleConsentChange('voluntary')}
                >
                  ✓ আমি বুঝতে পারছি যে আমি আমার নিজের ইচ্ছেতে এই গবেষণায় যোগ দিচ্ছি এবং আমি যে কোনো সময়, কোনো কারণ না দেখিয়েই এখান থেকে বের হয়ে আসতে পারি বা আমার অংশ নেওয়া বন্ধ করতে পারি।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="dataAnonymization"
                  checked={consentData.dataAnonymization}
                  onChange={() => handleConsentChange('dataAnonymization')}
                >
                  ✓ আমি বুঝতে পারছি যে আমার তথ্য একবার পরিচয় গোপন করে এবং অনেকের তথ্যের সাথে মিশিয়ে বিশ্লেষণ করা হয়ে গেলে, প্রযুক্তিগত কারণে সেই ডেটা থেকে আমার তথ্য সম্পূর্ণভাবে খুঁজে বের করে মুছে ফেলা সম্ভব হবে না।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="optOut"
                  checked={consentData.optOut}
                  onChange={() => handleConsentChange('optOut')}
                >
                  ✓ আমি জানি যে আমি চাইলে অন্য একজন মানুষের কাছ থেকে মানসিক স্বাস্থ্য বিষয়ে সাহায্য নিতে পারি।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="ageConfirm"
                  checked={consentData.ageConfirm}
                  onChange={() => handleConsentChange('ageConfirm')}
                >
                  ✓ আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।
                </ConsentCheckbox>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">খ. উদ্দেশ্য এবং তথ্যের ব্যবহার</h4>

                <ConsentCheckbox
                  id="nonDiagnostic"
                  checked={consentData.nonDiagnostic}
                  onChange={() => handleConsentChange('nonDiagnostic')}
                >
                  ✓ আমি বুঝতে পারছি যে এটি শুধুমাত্র গবেষণার কাজ। এটি ডাক্তারের দেওয়া রোগ নির্ণয় বা চিকিৎসার পরামর্শ নয়, বা এর বিকল্পও নয়।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="dataType"
                  checked={consentData.dataType}
                  onChange={() => handleConsentChange('dataType')}
                >
                  ✓ আমি অনুমতি দিচ্ছি যে আমার কথাবার্তার ধরনে থাকা কিছু বৈশিষ্ট্য (যেমন: গলার আওয়াজ কতটা উঁচু-নিচু, কথা বলার গতি) এবং PHQ-9 প্রশ্নের উত্তর (যা আমার সংবেদনশীল স্বাস্থ্য তথ্য) শুধুমাত্র মানসিক স্বাস্থ্যের জন্য আর্টিফিশিয়াল ইন্টেলিজেন্স (AI) মডেল তৈরি ও পরীক্ষা করার জন্য নেওয়া হবে।
                </ConsentCheckbox>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">গ. আপনার তথ্যের সুরক্ষা (SDE পদ্ধতি)</h4>

                <ConsentCheckbox
                  id="sdeStorage"
                  checked={consentData.sdeStorage}
                  onChange={() => handleConsentChange('sdeStorage')}
                >
                  ✓ আমি রাজি আছি যে আমার সংবেদনশীল স্বাস্থ্য তথ্যগুলি একটি আলাদা করে রাখা এবং খুব সুরক্ষিত বিশেষ জায়গায় (সিকিউরিটি ডেটা এনভায়রনমেন্ট বা SDE) রাখা হবে। এই জায়গাটি তথ্যের সুরক্ষার জন্য খুব ভালো আন্তর্জাতিক নিয়ম (যেমন ISO 27001) মেনে চলে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="pseudonymization"
                  checked={consentData.pseudonymization}
                  onChange={() => handleConsentChange('pseudonymization')}
                >
                  ✓ আমি বুঝতে পারছি যে আমার ব্যক্তিগত তথ্য (যেমন: আমার কম্পিউটারের ঠিকানা বা IP অ্যাড্রেস) এবং আমার স্বাস্থ্য তথ্য দুটি ভিন্ন জায়গায় শক্তভাবে আলাদা রাখা হবে এবং কোড ব্যবহার করে নাম গোপন (Pseudonymization) করে প্রক্রিয়া করা হবে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="accessControl"
                  checked={consentData.accessControl}
                  onChange={() => handleConsentChange('accessControl')}
                >
                  ✓ আমি বুঝতে পারছি যে SDE-এর মধ্যে আমার তথ্য দেখার অনুমতি শুধুমাত্র নির্দিষ্ট কিছু গবেষক এবং ডেটা সুরক্ষার দায়িত্বে থাকা লোকজনের থাকবে। এই অ্যাক্সেস পেতে তাদের খুব কড়া নিরাপত্তা ব্যবস্থা (যেমন: জিরো ট্রাস্ট মডেল এবং দুটি ধাপে পরিচয় নিশ্চিতকরণ) পার হতে হবে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="futureResearch"
                  checked={consentData.futureResearch}
                  onChange={() => handleConsentChange('futureResearch')}
                >
                  ✓ আমি অনুমতি দিচ্ছি যে আমার সম্পূর্ণ পরিচয় গোপন করা এবং সবার সাথে মেশানো ডেটা ভবিষ্যতে কড়া নজরদারির মধ্যে থেকে অন্য গবেষণার কাজ এবং মানুষের উপকারের জন্য ব্যবহার করা যেতে পারে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="dataRetention"
                  checked={consentData.dataRetention}
                  onChange={() => handleConsentChange('dataRetention')}
                >
                  ✓ আমি বুঝতে পারছি যে গবেষণার কাজ শেষ হওয়ার পরেও এই তথ্যটি সর্বোচ্চ ১০ বছর পর্যন্ত SDE-এর মধ্যে নিরাপদে গুছিয়ে রাখা থাকতে পারে।
                </ConsentCheckbox>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-yellow-900 mb-2">গুরুত্বপূর্ণ বিজ্ঞপ্তি:</p>
                    <p className="mb-2">
                      যদি আপনি মানসিক স্বাস্থ্য সংকটে থাকেন বা আত্মহত্যার চিন্তা করছেন, অনুগ্রহ করে অবিলম্বে জরুরি সেবায় যোগাযোগ করুন:
                    </p>
                    <p className="font-bold">
                      🇧🇩 বাংলাদেশ জাতীয় হেল্পলাইন: 999 | কান পেতে রই: 09678 771 677
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onNext}
                disabled={!allConsentsChecked}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {allConsentsChecked ? 'সম্মতি প্রদান করুন এবং এগিয়ে যান' : 'সকল চেকবক্স নির্বাচন করুন'}
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: PHQ-9 Form */}
          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  ব্যক্তিগত তথ্য
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      পুরো নাম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'fullName', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="আপনার পুরো নাম লিখুন (ঐচ্ছিক)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        বয়স (ন্যূনতম 18) *
                      </label>
                      <input
                        type="number"
                        min="18"
                        value={formData.age}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'age', value: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="আপনার বয়স"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        লিঙ্গ / Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'gender', value: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="male">পুরুষ / Male</option>
                        <option value="female">মহিলা / Female</option>
                        <option value="other">অন্যান্য / Other</option>
                        <option value="prefer-not-to-say">বলতে চাই না / Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      বর্তমান ওষুধ সেবন / Current Medication Status *
                    </label>
                    <select
                      value={formData.currentMedication}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'currentMedication', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="yes">হ্যাঁ, মানসিক স্বাস্থ্যের ওষুধ সেবন করছি</option>
                      <option value="no">না, কোনো ওষুধ সেবন করছি না</option>
                      <option value="other">অন্যান্য ওষুধ সেবন করছি</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      রেকর্ডিং পরিবেশ / Recording Environment *
                    </label>
                    <select
                      value={formData.recordingEnvironment}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'recordingEnvironment', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="quiet">শান্ত / Quiet</option>
                      <option value="moderate">মাঝারি শব্দ / Moderate Noise</option>
                      <option value="loud">উচ্চ শব্দ / Loud Noise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ভাষা/উপভাষা / Language/Dialect *
                    </label>
                    <select
                      value={formData.languageDialect}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'languageDialect', value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="standard-bangla">প্রমিত বাংলা / Standard Bangla</option>
                      <option value="dhaka">ঢাকা / Dhaka</option>
                      <option value="chittagong">চট্টগ্রাম / Chittagong</option>
                      <option value="sylhet">সিলেট / Sylhet</option>
                      <option value="noakhali">নোয়াখালী / Noakhali</option>
                      <option value="barisal">বরিশাল / Barisal</option>
                      <option value="rajshahi">রাজশাহী / Rajshahi</option>
                      <option value="rangpur">রংপুর / Rangpur</option>
                      <option value="khulna">খুলনা / Khulna</option>
                      <option value="mymensingh">ময়মনসিংহ / Mymensingh</option>
                      <option value="other">অন্যান্য / Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PHQ-9 Questions */}
<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
  <h3 className="text-xl font-bold text-purple-900 mb-2">
    PHQ-9 মানসিক স্বাস্থ্য প্রশ্নপত্র
  </h3>
  <p className="text-sm text-gray-700 mb-6">
    গত ২ সপ্তাহে, আপনি নিম্নলিখিত সমস্যাগুলির মধ্যে কোনটি দ্বারা কতবার বিরক্ত হয়েছেন?
  </p>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Left Column - Questions 1-5 */}
    <div className="space-y-6" style={{ scrollMarginTop: '100px' }}>
      <QuestionField
        question="১. আগের মতো কোনো কিছুতে কি আর আনন্দ পাচ্ছেন না বা আগ্রহ পাচ্ছেন না? (যেমন: পছন্দের কাজ, শখ, বা আড্ডা দিতে)"
        name="question1"
        value={formData.question1}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question1', value })}
      />

      <QuestionField
        question="২. মন খুব খারাপ লাগছে, হতাশ লাগছে, বা মনে হচ্ছে জীবনে কোনো আশাই নেই?"
        name="question2"
        value={formData.question2}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question2', value })}
      />

      <QuestionField
        question="৩. রাতে ঠিকমতো ঘুম হচ্ছে না (ঘুম আসতে সমস্যা হচ্ছে বা ভেঙে যাচ্ছে), নাকি ঘুম অনেক বেশি হচ্ছে?"
        name="question3"
        value={formData.question3}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question3', value })}
      />

      <QuestionField
        question="৪. সব সময় খুব ক্লান্ত লাগছে, বা শরীরে শক্তি কম অনুভব করছেন?"
        name="question4"
        value={formData.question4}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question4', value })}
      />

      <QuestionField
        question="৫. খাবারে কি রুচি কমে গেছে বা একেবারেই রুচি নেই? নাকি, স্বাভাবিকের চেয়ে বেশি বেশি খাচ্ছেন?"
        name="question5"
        value={formData.question5}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question5', value })}
      />
    </div>

    {/* Right Column - Questions 6-9 */}
    <div className="space-y-6" style={{ scrollMarginTop: '100px' }}>
      <QuestionField
        question="৬. নিজেকে ব্যর্থ মনে হচ্ছে? বা মনে হচ্ছে আপনি কোনো কিছুতে সফল হতে পারেননি, বা নিজের কাছে/পরিবারের কাছে ব্যর্থ হয়েছেন?"
        name="question6"
        value={formData.question6}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question6', value })}
      />

      <QuestionField
        question="৭. কোনো কিছুতে মনোযোগ দিতে কষ্ট হচ্ছে? (যেমন: খবরের কাগজ পড়া, কোনো কাজ করা বা টিভি দেখা)"
        name="question7"
        value={formData.question7}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question7', value })}
      />

      <QuestionField
        question="৮. অন্যরা খেয়াল করেছে—এমনভাবে কি আপনি খুব ধীরে কথা বলছেন বা ধীরে ধীরে নড়াচড়া করছেন? নাকি, তার উল্টো—খুব বেশি ছটফট করছেন বা অস্থির হয়ে যাচ্ছেন?"
        name="question8"
        value={formData.question8}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question8', value })}
      />

      <QuestionField
        question="৯. আপনার জীবনে কি এমনটা মনে হয়েছে যে, আনন্দ বা মজার কোনো কিছুই আর নেই? অথবা, কখনো কি মনে হয়েছে যে আপনি আগামীকাল না থাকলেও আসলে কারোর কিছু যায় আসবে না?"
        name="question9"
        value={formData.question9}
        onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question9', value })}
      />
    </div>
  </div>
</div>

<div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
  <p className="text-sm text-gray-700">
    <span className="font-semibold text-blue-900">দ্রষ্টব্য:</span> সকল ৯টি প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক। এই প্রশ্নপত্রটি PHQ-9 ক্লিনিকাল স্কেল অনুসরণ করে।
  </p>
</div>

              <button
                onClick={onNext}
                disabled={!validateStep1()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                ভয়েস রেকর্ডিংয়ে যান
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 3: Recording */}
          {step === 3 && (
            <div className="space-y-6 animate-slideUp">
              {/* Environment Instructions */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  সর্বোত্তম রেকর্ডিংয়ের জন্য নির্দেশিকা:
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-green-700">১.</span>
                    <span><strong>নীরব পরিবেশ:</strong> একটি শান্ত স্থানে যান যেখানে ব্যাকগ্রাউন্ড নয়েজ নেই।</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-green-700">২.</span>
                    <span><strong>মাইক্রোফোনের দূরত্ব:</strong> ফোনটি মুখ থেকে প্রায় ৬ ইঞ্চি (১৫ সেমি) দূরে ধরে রাখুন।</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-green-700">৩.</span>
                    <span><strong>স্বাভাবিক গতি:</strong> স্বাভাবিক গতিতে স্পষ্ট ও উচ্চস্বরে প্রম্পটটি পড়ুন।</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-green-700">৪.</span>
                    <span><strong>পর্যাপ্ত সময়:</strong> কমপক্ষে ৬০-১২০ সেকেন্ড রেকর্ড করুন পর্যাপ্ত ডেটার জন্য।</span>
                  </div>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-10 border-2 border-indigo-200 shadow-lg">
                <div className="text-center">
                  <h3 className="font-bold text-indigo-900 mb-6 text-xl flex items-center justify-center gap-2">
                    <Volume2 className="w-7 h-7" />
                    অনুগ্রহ করে নিচের অনুচ্ছেদগুলো উচ্চস্বরে পড়ুন:
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 space-y-6 text-left">
                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-3">১. একটি সাধারণ বিবরণ:</h4>
                      <p className="text-base leading-relaxed text-gray-800">
                        আজকে আকাশ ছিল মেঘলা এবং বাতাস বইছিল শান্তভাবে। বাজারের কাছাকাছি একটি পুরোনো পুকুর আছে। সেই পুকুরের পাড়ে একটি বড় আম গাছ। প্রতিদিন সকালে সেখান দিয়ে অনেক মানুষ হেঁটে যায়। ঘড়িতে এখন দশটা বেজে পঁয়তাল্লিশ মিনিট। সামনের সপ্তাহ থেকে তাপমাত্রা একটু কমার সম্ভাবনা আছে।
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-3">২. অনুভূতি ও কষ্টের প্রকাশ:</h4>
                      <p className="text-base leading-relaxed text-gray-800">
                        অনেক দিন ধরেই মনটা কেমন যেন অস্থির হয়ে আছে। কোনো কিছুই যেন ভালো লাগে না, আনন্দ খুঁজে পাই না। মাঝেমধ্যে মনে হয় সব চেষ্টা বৃথা, আমি হয়তো ব্যর্থ। রাতে ঘুম আসে না, কেবলই শূন্যতা আর হতাশা ঘিরে ধরে। এই কষ্টটা কাউকে বোঝানোও কঠিন।
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-3">৩. দৈনন্দিন জীবনের বর্ণনা:</h4>
                      <p className="text-base leading-relaxed text-gray-800">
                        সকাল থেকে বিকেল পর্যন্ত কাজের মধ্যে থাকলেও কেমন একটা ক্লান্তি ঘিরে থাকে। চারপাশে সবার হাসিখুশি দেখলে নিজেকে আরও একা মনে হয়। ঘরের কোণে চুপ করে বসে থাকার ইচ্ছে হয় প্রায়ই। বাইরের কোলাহল, আলো—সবকিছুই যেন বিরক্তিকর লাগে। আশা করি, পরিস্থিতি একদিন স্বাভাবিক হবে। এখন শুধু অপেক্ষা করার পালা।
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-3">৪. ভাষা মিশ্রণ ও প্রযুক্তি:</h4>
                      <p className="text-base leading-relaxed text-gray-800">
                        স্মার্টফোন আমাদের জীবন অনেক সহজ করে দিয়েছে। এখন বেশিরভাগ মানুষই 'online' থাকে। কিন্তু এই প্রযুক্তির যুগেও মানসিক চাপ বাড়ছে। 'Mental health is a real issue.' সবাই ব্যস্ত, নিজেদের কথা বলার সময় নেই। 'I need some quiet time.' এখন আমাদের এই সমস্যাটি সমাধানের জন্য নতুন পথ খুঁজতে হবে।
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-3">৫. ইংরেজি বাক্য পাঠ:</h4>
                      <p className="text-base leading-relaxed text-gray-800">
                        'The quick brown fox jumps over the lazy dog.' 'She sells sea shells by the sea shore.' 'Hello, how are you feeling today?'
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex flex-col items-center gap-6">
                  {/* Recording Status */}
                  {isRecording && (
                    <div className="w-full">
                      <div className="flex items-center gap-3 text-red-600 bg-red-50 px-6 py-3 rounded-full animate-pulse mb-4 justify-center">
                        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                        <span className="font-bold text-lg">রেকর্ডিং চলছে...</span>
                      </div>
                      {/* Acoustic Feedback Visualization */}
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 text-center mb-2">অডিও লেভেল মনিটর:</p>
                        <div className="flex items-center justify-center gap-1 h-16">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 bg-gradient-to-t from-red-500 to-pink-500 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 60 + 20}%`,
                                animationDelay: `${i * 50}ms`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex items-center gap-3 text-green-600 bg-green-50 px-6 py-3 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-lg">রেকর্ডিং সফলভাবে সংরক্ষণ করা হয়েছে!</span>
                    </div>
                  )}

                  {!isRecording && !audioBlob && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">রেকর্ডিং শুরু করতে নিচের বোতামটি ক্লিক করুন</p>
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {!isRecording && !audioBlob && (
                      <button
                        onClick={onStartRecording}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Play className="w-6 h-6" />
                        রেকর্ডিং শুরু করুন
                      </button>
                    )}

                    {isRecording && (
                      <button
                        onClick={onStopRecording}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Square className="w-6 h-6" />
                        রেকর্ডিং বন্ধ করুন
                      </button>
                    )}

                    {audioBlob && !isRecording && (
                      <>
                        <button
                          onClick={onReRecord}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          পুনরায় রেকর্ড করুন
                        </button>
                        <button
                          onClick={onSubmit}
                          disabled={submitting || !audioBlob}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          <Send className="w-6 h-6" />
                          {submitting ? 'জমা দিচ্ছে...' : 'অ্যাসেসমেন্ট জমা দিন'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quality Reminder */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>মনে রাখবেন:</strong> উচ্চমানের রেকর্ডিং আরও সঠিক বিশ্লেষণে সাহায্য করে।
                    খুব জোরে (ক্লিপিং) বা খুব আস্তে (অস্পষ্ট) কথা না বলার চেষ্টা করুন।
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && testResult && (
            <div className="space-y-6 text-center animate-slideUp">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ধন্যবাদ! আপনার তথ্য সফলভাবে জমা হয়েছে
              </h3>

              {testResult.phq9Score !== undefined && (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
    <h4 className="text-lg font-bold text-purple-900 mb-4">
      PHQ-9 মূল্যায়ন ফলাফল
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Score Display */}
      <div className="bg-white rounded-xl p-6 border-2 border-purple-300">
        <p className="text-sm text-gray-600 mb-2">আপনার স্কোর</p>
        <p className="text-5xl font-bold text-purple-600 mb-1">
          {testResult.phq9Score}
          <span className="text-2xl text-gray-500">/27</span>
        </p>
      </div>

                    {/* Severity Category */}
                    <div className={`rounded-xl p-6 border-2 ${testResult.severity === 'minimal' ? 'bg-green-50 border-green-300' :
                        testResult.severity === 'mild' ? 'bg-blue-50 border-blue-300' :
                          testResult.severity === 'moderate' ? 'bg-yellow-50 border-yellow-300' :
                            testResult.severity === 'moderately-severe' ? 'bg-orange-50 border-orange-300' :
                              'bg-red-50 border-red-300'
                      }`}>
                      <p className="text-sm text-gray-600 mb-2">তীব্রতা স্তর</p>
                      <p className={`text-2xl font-bold mb-1 ${testResult.severity === 'minimal' ? 'text-green-700' :
                          testResult.severity === 'mild' ? 'text-blue-700' :
                            testResult.severity === 'moderate' ? 'text-yellow-700' :
                              testResult.severity === 'moderately-severe' ? 'text-orange-700' :
                                'text-red-700'
                        }`}>
                        {testResult.severity === 'minimal' && 'সর্বনিম্ন'}
                        {testResult.severity === 'mild' && 'সামান্য'}
                        {testResult.severity === 'moderate' && 'মাঝারি'}
                        {testResult.severity === 'moderately-severe' && 'মাঝারি থেকে গুরুতর'}
                        {testResult.severity === 'severe' && 'গুরুতর'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {testResult.severity === 'minimal' && '(0-4 পয়েন্ট)'}
                        {testResult.severity === 'mild' && '(5-9 পয়েন্ট)'}
                        {testResult.severity === 'moderate' && '(10-14 পয়েন্ট)'}
                        {testResult.severity === 'moderately-severe' && '(15-19 পয়েন্ট)'}
                        {testResult.severity === 'severe' && '(20-24 পয়েন্ট)'}
                      </p>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">ব্যাখ্যা:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {testResult.severity === 'minimal' &&
                        'আপনার স্কোর ন্যূনতম বিষণ্নতার লক্ষণ নির্দেশ করে। এটি সাধারণত স্বাভাবিক পরিসরের মধ্যে বিবেচিত হয়।'}
                      {testResult.severity === 'mild' &&
                        'আপনার স্কোর হালকা বিষণ্নতার লক্ষণ নির্দেশ করে। কিছু লক্ষণ উপস্থিত থাকতে পারে তবে দৈনন্দিন কার্যকলাপে সামান্য প্রভাব।'}
                      {testResult.severity === 'moderate' &&
                        'আপনার স্কোর মাঝারি বিষণ্নতার লক্ষণ নির্দেশ করে। পেশাদার মূল্যায়ন বিবেচনা করা উচিত।'}
                      {testResult.severity === 'moderately-severe' &&
                        'আপনার স্কোর মাঝারি থেকে গুরুতর বিষণ্নতার লক্ষণ নির্দেশ করে। একজন মানসিক স্বাস্থ্য পেশাদারের সাথে পরামর্শ করা সুপারিশ করা হয়।'}
                      {testResult.severity === 'severe' &&
                        'আপনার স্কোর গুরুতর বিষণ্নতার লক্ষণ নির্দেশ করে। অবিলম্বে একজন মানসিক স্বাস্থ্য পেশাদারের সাথে যোগাযোগ করা দৃঢ়ভাবে সুপারিশ করা হয়।'}
                    </p>
                  </div>

                  {/* Important Note */}
                  <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <p className="text-xs text-gray-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>দ্রষ্টব্য:</strong> এই স্কোর শুধুমাত্র একটি স্ক্রিনিং টুল এবং চূড়ান্ত রোগ নির্ণয় নয়। সঠিক মূল্যায়নের জন্য অনুগ্রহ করে একজন যোগ্য মানসিক স্বাস্থ্য পেশাদারের সাথে পরামর্শ করুন।
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-200">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  আপনার রেফারেন্স আইডি
                </h4>
                <p className="text-4xl font-mono font-bold text-indigo-600 mb-4">
                  {testResult.testId}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  ভবিষ্যতে রেফারেন্সের জন্য এই আইডি সংরক্ষণ করুন
                </p>

                {/* Audio Player */}
                {(() => {
                  const audioLink = testResult?.audioUrl || testResult?.audio_url;
                  if (!audioLink) return null;

                  return (
                    <div className="mt-6 p-4 bg-white rounded-lg border-2 border-indigo-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Volume2 className="w-5 h-5 text-indigo-600" />
                        <p className="text-sm font-semibold text-gray-700">আপনার রেকর্ডিং শুনুন:</p>
                      </div>

                      <audio controls className="w-full" style={{ height: '40px' }}>
                        <source src={audioLink} type="audio/webm" />
                        <source src={audioLink} type="audio/mp3" />
                        আপনার ব্রাউজার অডিও প্লেয়ার সাপোর্ট করে না।
                      </audio>

                      <div className="mt-3 flex items-center justify-between">
                        <a
                          href={audioLink}
                          download={`recording_${testResult.testId}.webm`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড করুন
                        </a>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(audioLink);
                            alert('লিংক কপি হয়েছে!');
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          লিংক কপি করুন
                        </button>
                      </div>
                    </div>
                  );
                })()}

              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-3">
                  আপনার অবদান
                </h4>
                <p className="text-gray-700 leading-relaxed text-left mb-4">
                  মানসিক স্বাস্থ্য গবেষণায় অংশগ্রহণ করার জন্য আপনাকে আন্তরিক ধন্যবাদ।
                  আপনার প্রদত্ত তথ্য ভবিষ্যতে মানসিক স্বাস্থ্য সেবার উন্নতিতে সাহায্য করবে।
                </p>
                <ul className="text-left space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>আপনার তথ্য সম্পূর্ণ সুরক্ষিত এবং বেনামী অবস্থায় সংরক্ষিত</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>ডেটা শুধুমাত্র একাডেমিক গবেষণার উদ্দেশ্যে ব্যবহৃত হবে</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>আপনার গোপনীয়তা সর্বোচ্চ অগ্রাধিকার</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>যেকোনো সময় আপনার ডেটা প্রত্যাহারের অধিকার রয়েছে</span>
                  </li>
                </ul>
              </div>

              {/* Data Usage Reminder */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200">
                <div className="flex items-start gap-3 text-left">
                  <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-indigo-900 mb-2">গোপনীয়তা এবং ডেটা নিরাপত্তা:</p>
                    <p>
                      আপনার সমস্ত তথ্য সম্পূর্ণরূপে এনক্রিপ্ট করা এবং সুরক্ষিত ডাটাবেজে সংরক্ষিত।
                      আপনার ব্যক্তিগত পরিচয় সম্পূর্ণভাবে সুরক্ষিত এবং আপনার তথ্য শুধুমাত্র গবেষণা
                      উদ্দেশ্যে ব্যবহৃত হবে যেমনটি আপনি সম্মতি দিয়েছেন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Research Note */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="flex items-start gap-3 text-left">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-yellow-900 mb-2">গুরুত্বপূর্ণ তথ্য:</p>
                    <p>
                      এই ডেটা সংগ্রহ প্রোগ্রাম শুধুমাত্র গবেষণার উদ্দেশ্যে। এটি কোনো চিকিৎসা পরামর্শ,
                      রোগ নির্ণয়, বা চিকিৎসা প্রদান করে না। যদি আপনি মানসিক স্বাস্থ্য সমস্যায় ভুগছেন,
                      অনুগ্রহ করে একজন যোগ্য মানসিক স্বাস্থ্য পেশাদারের সাথে পরামর্শ করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Crisis Support */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
                <h4 className="text-lg font-bold text-red-900 mb-3">
                  জরুরি সহায়তা প্রয়োজন?
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  যদি আপনি মানসিক স্বাস্থ্য সংকটে থাকেন বা আত্মহত্যার চিন্তা করছেন, অনুগ্রহ করে অবিলম্বে যোগাযোগ করুন:
                </p>
                <div className="bg-white rounded-lg p-4 space-y-2 text-left">
                  <p className="font-bold text-gray-900">🇧🇩 বাংলাদেশ জাতীয় হেল্পলাইন: <span className="text-red-600">999</span></p>
                  <p className="font-bold text-gray-900">কান পেতে রই হেল্পলাইন: <span className="text-red-600">09678 771 677</span></p>
                  <p className="text-sm text-gray-600 mt-2">এই সেবাগুলো ২৪/৭ উপলব্ধ এবং বিনামূল্যে।</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestModal;