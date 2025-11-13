import React, { useState } from 'react';
import { X, Play, Square, Send, CheckCircle, AlertCircle, Shield, Volume2 } from 'lucide-react';

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
  validateStep1
}) => {
  if (!showModal) return null;

  // Check if all consent boxes are checked
  const allConsentsChecked = Object.values(consentData).every(val => val === true);

  const handleConsentChange = (key) => {
    consentDispatch({ type: 'UPDATE_CONSENT', field: key, value: !consentData[key] });
  };

  const QuestionField = ({ question, name, value, onChange }) => {
    const options = [
      { label: 'একেবারেই নয়', value: '0' },
      { label: 'কয়েক দিন', value: '1' },
      { label: 'অর্ধেকের বেশি দিন', value: '2' },
      { label: 'প্রায় প্রতিদিন', value: '3' }
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
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {step === 0 && 'সম্মতি এবং চুক্তি'}
                {step === 1 && 'PHQ-8 প্রশ্নপত্র'}
                {step === 2 && 'ভয়েস রেকর্ডিং'}
                {step === 3 && 'অ্যাসেসমেন্ট সম্পন্ন'}
              </h2>
              <p className="text-white/90 text-sm">
                {step === 0 && 'অংশগ্রহণের আগে দয়া করে পড়ুন এবং সম্মতি দিন'}
                {step === 1 && 'গত ২ সপ্তাহে আপনার অভিজ্ঞতা সম্পর্কে বলুন'}
                {step === 2 && 'প্রম্পটটি উচ্চস্বরে পড়ে রেকর্ড করুন'}
                {step === 3 && 'আপনার অ্যাসেসমেন্ট জমা দেওয়া হয়েছে'}
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
            {[0, 1, 2, 3].map((s) => (
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
          {/* Step 0: Consent */}
          {step === 0 && (
            <div className="space-y-6 animate-slideUp">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">
                      অবহিত সম্মতি এবং গোপনীয়তা চুক্তি
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      এই মানসিক স্বাস্থ্য মূল্যায়ন সিস্টেমে অংশগ্রহণ করার আগে, অনুগ্রহ করে নিম্নলিখিত শর্তাবলী 
                      সাবধানে পড়ুন এবং প্রতিটি চেকবক্সে সম্মতি প্রদান করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 mb-3">স্বায়ত্তশাসন এবং নিয়ন্ত্রণ:</h4>
                
                <ConsentCheckbox
                  id="voluntary"
                  checked={consentData.voluntary}
                  onChange={() => handleConsentChange('voluntary')}
                >
                  ✓ আমি বুঝতে পারছি যে আমার অংশগ্রহণ সম্পূর্ণ স্বেচ্ছামূলক এবং আমি যেকোনো সময় কোনো কারণ না দেখিয়ে আমার ডেটা প্রত্যাহার করার অধিকার রাখি।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="optOut"
                  checked={consentData.optOut}
                  onChange={() => handleConsentChange('optOut')}
                >
                  ✓ আমি নিশ্চিত করছি যে আমি একজন মানুষের মাধ্যমে মানসিক স্বাস্থ্য সহায়তা নেওয়ার বিকল্প সম্পর্কে অবহিত।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="ageConfirm"
                  checked={consentData.ageConfirm}
                  onChange={() => handleConsentChange('ageConfirm')}
                >
                  ✓ আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="aiRole"
                  checked={consentData.aiRole}
                  onChange={() => handleConsentChange('aiRole')}
                >
                  ✓ আমি বুঝতে পারছি যে এটি একটি গবেষণা ডেটা সংগ্রহ প্রোগ্রাম এবং এটি কোনো ডাক্তার বা ক্লিনিকাল রোগ নির্ণয়ের প্রতিস্থাপন নয়।
                </ConsentCheckbox>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">উদ্দেশ্য এবং সীমাবদ্ধতা:</h4>
                
                <ConsentCheckbox
                  id="purpose"
                  checked={consentData.purpose}
                  onChange={() => handleConsentChange('purpose')}
                >
                  ✓ আমার দেওয়া ভয়েস এবং প্রশ্নপত্রের ডেটা শুধুমাত্র মানসিক স্বাস্থ্য গবেষণার উদ্দেশ্যে সংগ্রহ ও সংরক্ষণ করা হবে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="nonDiagnostic"
                  checked={consentData.nonDiagnostic}
                  onChange={() => handleConsentChange('nonDiagnostic')}
                >
                  ✓ আমি স্বীকার করছি যে এই ডেটা সংগ্রহ শুধুমাত্র গবেষণার জন্য এবং কোনো তাৎক্ষণিক রোগ নির্ণয় বা চিকিৎসা পরামর্শ প্রদান করে না।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="dataType"
                  checked={consentData.dataType}
                  onChange={() => handleConsentChange('dataType')}
                >
                  ✓ আমি অনুমতি দিচ্ছি যে আমার ভয়েস রেকর্ডিং (বায়োমেট্রিক ডেটা) এবং PHQ-8 উত্তর (সংবেদনশীল স্বাস্থ্য ডেটা) সংগ্রহ করা হবে।
                </ConsentCheckbox>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">গোপনীয়তা এবং নিরাপত্তা:</h4>
                
                <ConsentCheckbox
                  id="anonymization"
                  checked={consentData.anonymization}
                  onChange={() => handleConsentChange('anonymization')}
                >
                  ✓ আমি সম্মতি দিচ্ছি যে আমার সংবেদনশীল ডেটা এনক্রিপশন এবং ছদ্মনামের মাধ্যমে সুরক্ষিতভাবে সংরক্ষণ ও ব্যবহার করা হবে, যাতে আমার পরিচয় প্রকাশ না পায়।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="futureResearch"
                  checked={consentData.futureResearch}
                  onChange={() => handleConsentChange('futureResearch')}
                >
                  ✓ আমি অনুমতি দিচ্ছি যে এই ডেটা (সম্পূর্ণরূপে বেনামী অবস্থায়) ভবিষ্যতে একাডেমিক গবেষণা এবং জনস্বাস্থ্যের উন্নতির জন্য ব্যবহৃত হতে পারে।
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="thirdParty"
                  checked={consentData.thirdParty}
                  onChange={() => handleConsentChange('thirdParty')}
                >
                  ✓ আমি বুঝতে পারছি যে ডেটা বিশ্লেষণের জন্য এটি সুরক্ষিত থার্ড-পার্টি সার্ভারে (যেমন ক্লাউড স্টোরেজ) প্রক্রিয়াজাত করা হবে।
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

          {/* Step 1: PHQ-8 Form */}
          {step === 1 && (
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

              {/* PHQ-8 Questions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  PHQ-8 মানসিক স্বাস্থ্য প্রশ্নপত্র
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  গত ২ সপ্তাহে, আপনি নিম্নলিখিত সমস্যাগুলির মধ্যে কোনটি দ্বারা কতবার বিরক্ত হয়েছেন?
                </p>
                <div className="space-y-6">
                  <QuestionField
                    question="১. কোনো কাজ করতে আগ্রহ বা আনন্দ কম অনুভব করা?"
                    name="question1"
                    value={formData.question1}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question1', value })}
                  />

                  <QuestionField
                    question="২. দুঃখিত, বিষণ্ন বা হতাশ অনুভব করা?"
                    name="question2"
                    value={formData.question2}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question2', value })}
                  />

                  <QuestionField
                    question="৩. ঘুমাতে সমস্যা, ঘুম থাকতে অসুবিধা, বা অতিরিক্ত ঘুমানো?"
                    name="question3"
                    value={formData.question3}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question3', value })}
                  />

                  <QuestionField
                    question="৪. ক্লান্ত অনুভব করা বা শক্তি কম থাকা?"
                    name="question4"
                    value={formData.question4}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question4', value })}
                  />

                  <QuestionField
                    question="৫. খাবারে অরুচি বা অতিরিক্ত খাওয়া?"
                    name="question5"
                    value={formData.question5}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question5', value })}
                  />

                  <QuestionField
                    question="৬. নিজের সম্পর্কে খারাপ অনুভব করা, বা নিজেকে ব্যর্থ ভাবা, অথবা নিজেকে বা পরিবারকে হতাশ করা?"
                    name="question6"
                    value={formData.question6}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question6', value })}
                  />

                  <QuestionField
                    question="৭. খবরের কাগজ পড়া বা টিভি দেখার মতো কাজে মনোযোগ দিতে সমস্যা হওয়া?"
                    name="question7"
                    value={formData.question7}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question7', value })}
                  />

                  <QuestionField
                    question="৮. এত ধীরে চলাফেরা বা কথা বলা যে অন্যরা তা লক্ষ্য করেছে? অথবা এর বিপরীত—এত অস্থির বা চঞ্চল থাকা যে স্বাভাবিকের চেয়ে অনেক বেশি নড়াচড়া করা?"
                    name="question8"
                    value={formData.question8}
                    onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'question8', value })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-900">দ্রষ্টব্য:</span> সকল ৮টি প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক। এই প্রশ্নপত্রটি PHQ-8 ক্লিনিকাল স্কেল অনুসরণ করে।
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

          {/* Step 2: Recording */}
          {step === 2 && (
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
                          disabled={submitting}
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

          {/* Step 3: Result */}
          {step === 3 && testResult && (
            <div className="space-y-6 text-center animate-slideUp">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ধন্যবাদ! আপনার তথ্য সফলভাবে জমা হয়েছে
              </h3>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-200">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  আপনার রেফারেন্স আইডি
                </h4>
                <p className="text-4xl font-mono font-bold text-indigo-600 mb-4">
                  {testResult.testId}
                </p>
                <p className="text-sm text-gray-600">
                  ভবিষ্যতে রেফারেন্সের জন্য এই আইডি সংরক্ষণ করুন
                </p>
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