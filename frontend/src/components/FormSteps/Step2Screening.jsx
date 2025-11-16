import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';

/**
 * שלב 2 - שאלות סינון
 * מציג דרישות מקדמיות ושאלות סינון
 */
function Step2Screening({ formData, onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [requirementsAccepted, setRequirementsAccepted] = useState(false);

  const requirements = formData?.requirements || [];
  const questions = formData?.screening_questions || [];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const checkIfPassed = () => {
    // בדיקה אם כל השאלות נענו
    const allAnswered = questions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('נא לענות על כל השאלות');
      return;
    }

    // בדיקה מול תשובות נכונות
    let passed = true;
    questions.forEach(q => {
      if (q.correct_answer !== null && q.correct_answer !== undefined) {
        if (answers[q.id] !== q.correct_answer) {
          passed = false;
        }
      }
    });

    setShowResults(true);
    
    // המתן קצת ואז המשך
    setTimeout(() => {
      onComplete(answers, passed);
    }, 2000);
  };

  const renderQuestion = (question) => {
    const { id, question: text, type, options, required } = question;

    switch (type) {
      case 'boolean':
      case 'select':
        return (
          <div key={id} className="mb-6 p-4 bg-gray-50 rounded-xl">
            <label className="block text-lg font-semibold mb-3 text-gray-800">
              {text}
              {required && <span className="text-red-500 mr-1">*</span>}
            </label>
            
            <div className="space-y-2">
              {type === 'boolean' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(id, true)}
                    className={`w-full p-3 rounded-lg border-2 transition text-right ${
                      answers[id] === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    ✓ כן
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(id, false)}
                    className={`w-full p-3 rounded-lg border-2 transition text-right ${
                      answers[id] === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    ✗ לא
                  </button>
                </>
              ) : (
                options?.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerChange(id, option)}
                    className={`w-full p-3 rounded-lg border-2 transition text-right ${
                      answers[id] === option
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <ChevronRight className="inline w-4 h-4 ml-2" />
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={id} className="mb-6 p-4 bg-gray-50 rounded-xl">
            <label className="block text-lg font-semibold mb-3 text-gray-800">
              {text}
              {required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <input
              type="text"
              value={answers[id] || ''}
              onChange={(e) => handleAnswerChange(id, e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-right"
              placeholder="הכנס תשובתך כאן..."
            />
          </div>
        );

      case 'number':
        return (
          <div key={id} className="mb-6 p-4 bg-gray-50 rounded-xl">
            <label className="block text-lg font-semibold mb-3 text-gray-800">
              {text}
              {required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <input
              type="number"
              value={answers[id] || ''}
              onChange={(e) => handleAnswerChange(id, parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-right"
              placeholder="הכנס מספר..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!requirementsAccepted) {
    return (
      <Card>
        <h2 className="text-3xl font-bold mb-6 text-primary-900">
          📋 דרישות מקדמיות
        </h2>
        
        <p className="text-lg text-gray-700 mb-6">
          לפני שנמשיך, וודא שאתה עומד בדרישות הבסיסיות הבאות:
        </p>

        <div className="space-y-3 mb-8">
          {requirements.map((req, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg"
            >
              <CheckCircle2 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-medium text-gray-800">{req.text}</p>
                {req.is_mandatory && (
                  <span className="text-sm text-primary-600 font-semibold">* חובה</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <p className="text-gray-700">
            ⚠️ אם אינך עומד בדרישות אלו, ייתכן שלא תוכל להמשיך בתהליך.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            ← חזור
          </Button>
          <Button 
            onClick={() => setRequirementsAccepted(true)}
            className="flex-1"
          >
            אני עומד בדרישות →
          </Button>
        </div>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-2xl font-bold mb-2">בודק תשובות...</h3>
          <p className="text-gray-600">רגע אחד בבקשה</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-3xl font-bold mb-2 text-primary-900">
        ❓ שאלות סינון
      </h2>
      <p className="text-gray-600 mb-6">אנא ענה על השאלות הבאות:</p>

      <form onSubmit={(e) => { e.preventDefault(); checkIfPassed(); }}>
        {questions.map(renderQuestion)}

        <div className="flex gap-3 mt-8">
          <Button 
            onClick={onBack} 
            variant="outline"
            type="button"
            className="flex-1"
          >
            ← חזור
          </Button>
          <Button 
            type="submit"
            className="flex-1"
          >
            המשך →
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default Step2Screening;
