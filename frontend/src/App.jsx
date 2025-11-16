import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import Step1Welcome from './components/FormSteps/Step1Welcome';
import Step2Screening from './components/FormSteps/Step2Screening';
import Step3Terms from './components/FormSteps/Step3Terms';
import Step4Details from './components/FormSteps/Step4Details';
import StepSuccess from './components/FormSteps/StepSuccess';
import StepFailed from './components/FormSteps/StepFailed';
import AdminDashboard from './pages/AdminDashboard';

import { getForm } from './services/api';

function App() {
  // בדיקה אם זה דף Admin
  const isAdminPath = window.location.pathname === '/admin';
  
  if (isAdminPath) {
    return <AdminDashboard />;
  }
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    screening_answers: {},
    accepted_terms: false,
    candidate_details: {
      full_name: '',
      phone_number: '',
      email: '',
      city: ''
    }
  });

  // קבלת form ID מה-URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get('id') || 'demo'; // demo לבדיקות
    
    loadForm(formId);
  }, []);

  const loadForm = async (formId) => {
    try {
      setLoading(true);
      const data = await getForm(formId);
      setFormData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading form:', err);
      setError('שגיאה בטעינת הטופס. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSubmissionData = (field, value) => {
    setSubmissionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScreeningComplete = (answers, passed) => {
    updateSubmissionData('screening_answers', answers);
    
    if (passed) {
      nextStep();
    } else {
      setCurrentStep(99); // Failed screen
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-500 to-purple-600">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
          <p className="text-xl">טוען טופס...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-500 to-purple-600">
        <div className="text-center text-white bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
          <p className="text-2xl mb-4">⚠️</p>
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Welcome 
            formData={formData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2Screening 
            formData={formData}
            onComplete={handleScreeningComplete}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3Terms 
            formData={formData}
            onAccept={() => {
              updateSubmissionData('accepted_terms', true);
              nextStep();
            }}
            onReject={() => {
              updateSubmissionData('accepted_terms', false);
              setCurrentStep(98); // Declined terms
            }}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4Details 
            formData={formData}
            submissionData={submissionData}
            onSubmit={(candidateDetails) => {
              updateSubmissionData('candidate_details', candidateDetails);
              setCurrentStep(100); // Success
            }}
            onBack={prevStep}
          />
        );
      case 98:
        return (
          <StepFailed 
            title="לא אישרת את התנאים"
            message="על מנת להמשיך בתהליך, עליך לאשר את תנאי העבודה."
            showRetry={true}
            onRetry={() => setCurrentStep(3)}
          />
        );
      case 99:
        return (
          <StepFailed 
            title="לא עברת את שלב הסינון"
            message="לצערנו, לא עמדת בדרישות המקדמיות למשרה זו. נשמח לראות אותך במשרות עתידיות!"
          />
        );
      case 100:
        return (
          <StepSuccess 
            candidateName={submissionData.candidate_details.full_name}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-500 to-purple-600 md:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        {currentStep >= 1 && currentStep <= 4 && (
          <div className="mb-4 bg-white/10 backdrop-blur-lg rounded-t-2xl md:rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">שלב {currentStep} מתוך 4</span>
              <span className="text-white text-sm font-semibold">{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div 
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
