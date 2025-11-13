import React, { useState, useEffect, useReducer } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import ChartsSection from './components/ChartsSection';
import TestCard from './components/TestCard';
import TestModal from './components/TestModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const initialFormState = {
  fullName: '',
  age: '',
  gender: '',
  currentMedication: '',
  recordingEnvironment: '',
  languageDialect: '',
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  question5: '',
  question6: '',
  question7: '',
  question8: ''
};

const initialConsentState = {
  voluntary: false,
  optOut: false,
  ageConfirm: false,
  aiRole: false,
  purpose: false,
  nonDiagnostic: false,
  dataType: false,
  anonymization: false,
  futureResearch: false,
  thirdParty: false
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
};

const consentReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_CONSENT':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialConsentState;
    default:
      return state;
  }
};

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0); // Start from 0 for consent
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [consentData, consentDispatch] = useReducer(consentReducer, initialConsentState);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert('Please record your voice before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      
      const payload = {
        // Personal Information (name is optional)
        fullName: formData.fullName || 'Anonymous',
        age: parseInt(formData.age),
        gender: formData.gender,
        currentMedication: formData.currentMedication,
        recordingEnvironment: formData.recordingEnvironment,
        languageDialect: formData.languageDialect,
        
        // PHQ-8 Questions (all 8)
        question1: parseInt(formData.question1),
        question2: parseInt(formData.question2),
        question3: parseInt(formData.question3),
        question4: parseInt(formData.question4),
        question5: parseInt(formData.question5),
        question6: parseInt(formData.question6),
        question7: parseInt(formData.question7),
        question8: parseInt(formData.question8),
        
        // Consent Data (all 10 checkboxes)
        consent: {
          voluntary: consentData.voluntary,
          optOut: consentData.optOut,
          ageConfirm: consentData.ageConfirm,
          aiRole: consentData.aiRole,
          purpose: consentData.purpose,
          nonDiagnostic: consentData.nonDiagnostic,
          dataType: consentData.dataType,
          anonymization: consentData.anonymization,
          futureResearch: consentData.futureResearch,
          thirdParty: consentData.thirdParty
        },
        
        // Audio Data
        audioData: audioBase64
      };

      const response = await fetch(`${API_BASE_URL}/api/submit_test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setTestResult(result);
      setStep(3);
      fetchStats();
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(0);
    dispatch({ type: 'RESET' });
    consentDispatch({ type: 'RESET' });
    setAudioBlob(null);
    setIsRecording(false);
    setMediaRecorder(null);
    setTestResult(null);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const validateStep1 = () => {
    const { 
      age, gender, currentMedication, recordingEnvironment, languageDialect,
      question1, question2, question3, question4, question5, question6, question7, question8 
    } = formData;
    
    return (
      age >= 18 && 
      gender !== '' &&
      currentMedication !== '' &&
      recordingEnvironment !== '' &&
      languageDialect !== '' &&
      question1 !== '' && 
      question2 !== '' && 
      question3 !== '' &&
      question4 !== '' &&
      question5 !== '' &&
      question6 !== '' &&
      question7 !== '' &&
      question8 !== ''
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsGrid stats={stats} />
        <ChartsSection stats={stats} />
        <TestCard onStartTest={() => setShowModal(true)} />
      </main>

      <TestModal
        showModal={showModal}
        step={step}
        formData={formData}
        dispatch={dispatch}
        consentData={consentData}
        consentDispatch={consentDispatch}
        isRecording={isRecording}
        audioBlob={audioBlob}
        submitting={submitting}
        testResult={testResult}
        onClose={resetModal}
        onNext={handleNext}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onReRecord={() => setAudioBlob(null)}
        onSubmit={handleSubmit}
        validateStep1={validateStep1}
      />
    </div>
  );
}

export default App;