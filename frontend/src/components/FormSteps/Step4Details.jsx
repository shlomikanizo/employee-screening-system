import { useState } from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { submitForm } from '../../services/api';

/**
 * שלב 4 - פרטים אישיים
 * מילוי פרטי המועמד ושליחת הטופס
 */
function Step4Details({ formData, submissionData, onSubmit, onBack }) {
  const [details, setDetails] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    // נקה שגיאה עבור שדה זה
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // שם מלא
    if (!details.full_name || details.full_name.trim().length < 2) {
      newErrors.full_name = 'נא להזין שם מלא (לפחות 2 תווים)';
    }

    // טלפון
    const phoneRegex = /^(0[23489]|05\d)\d{7}$/;
    const cleanPhone = details.phone_number.replace(/[-\s]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone_number = 'נא להזין מספר טלפון תקין (לדוגמה: 050-1234567)';
    }

    // אימייל (אופציונלי אבל אם הוזן צריך להיות תקין)
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      newErrors.email = 'נא להזין כתובת אימייל תקינה';
    }

    // עיר
    if (!details.city || details.city.trim().length < 2) {
      newErrors.city = 'נא להזין עיר מגורים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // הכנת נתונים לשליחה
      const payload = {
        form_unique_id: formData.unique_id,
        screening_answers: submissionData.screening_answers,
        candidate_details: details,
        accepted_terms: submissionData.accepted_terms,
        additional_data: {}
      };

      // שליחת הטופס
      const response = await submitForm(payload);
      
      console.log('✅ Submission successful:', response);
      
      // המשך למסך הצלחה
      onSubmit(details);
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">📝</div>
        <h2 className="text-3xl font-bold text-primary-900 mb-2">
          כמעט סיימנו!
        </h2>
        <p className="text-gray-600 text-lg">
          נא למלא את הפרטים האישיים שלך
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800">
            <User className="w-5 h-5 text-primary-500" />
            שם מלא *
          </label>
          <input
            type="text"
            value={details.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition text-right ${
              errors.full_name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            placeholder="לדוגמה: ישראל ישראלי"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800">
            <Phone className="w-5 h-5 text-primary-500" />
            מספר טלפון *
          </label>
          <input
            type="tel"
            value={details.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition text-right ${
              errors.phone_number 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            placeholder="לדוגמה: 050-1234567"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800">
            <Mail className="w-5 h-5 text-primary-500" />
            אימייל (אופציונלי)
          </label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition text-right ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            placeholder="לדוגמה: israel@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* City */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800">
            <MapPin className="w-5 h-5 text-primary-500" />
            עיר מגורים *
          </label>
          <input
            type="text"
            value={details.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition text-right ${
              errors.city 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            placeholder="לדוגמה: תל אביב"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border-r-4 border-blue-400 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            🔒 הפרטים שלך מוגנים ומאובטחים. נשתמש בהם רק לצורך תהליך הקבלה לעבודה.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={onBack}
            variant="outline"
            type="button"
            disabled={loading}
            className="flex-1"
          >
            ← חזור
          </Button>
          <Button 
            type="submit"
            loading={loading}
            className="flex-1"
            size="lg"
          >
            שלח טופס 🚀
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default Step4Details;
