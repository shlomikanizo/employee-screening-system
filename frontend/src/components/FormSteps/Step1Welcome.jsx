import { Building2, MapPin, Briefcase } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';

/**
 * שלב 1 - מסך פתיחה
 * מציג: לוגו, הסבר על המשרה, כתובת ומפה
 */
function Step1Welcome({ formData, onNext }) {
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${formData?.company_lat},${formData?.company_lng}&zoom=15`;

  return (
    <Card>
      {/* Company Logo */}
      {formData?.company_logo_url && (
        <div className="flex justify-center mb-6">
          <img 
            src={formData.company_logo_url} 
            alt={formData.company_name}
            className="h-20 object-contain"
          />
        </div>
      )}

      {/* Company Name */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 text-primary-600 mb-2">
          <Building2 className="w-6 h-6" />
          <h1 className="text-3xl font-bold">{formData?.company_name}</h1>
        </div>
        <p className="text-gray-600">מזמינה אותך להצטרף לצוות שלנו!</p>
      </div>

      {/* Job Title */}
      <div className="bg-primary-50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary-500 rounded-full p-2">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900">
            {formData?.job_title}
          </h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
          {formData?.job_description}
        </p>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">מיקום</p>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <p className="font-semibold text-gray-900">{formData?.job_location}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">שכר</p>
          <p className="font-semibold text-gray-900">{formData?.salary_range}</p>
        </div>
      </div>

      {/* Company Address & Map */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" />
          כתובת החברה
        </h3>
        <p className="text-gray-700 mb-3">{formData?.company_address}</p>
        
        {/* Google Maps Embed */}
        {formData?.company_lat && formData?.company_lng && import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="250"
              frameBorder="0"
              style={{ border: 0 }}
              src={googleMapsUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white text-center mb-6">
        <h3 className="text-xl font-bold mb-2">🎯 מוכן להתחיל?</h3>
        <p className="mb-4">בואו נתחיל בתהליך הסינון. זה יקח רק כמה דקות!</p>
      </div>

      {/* Next Button */}
      <Button 
        onClick={onNext}
        fullWidth
        size="lg"
      >
        התחל טופס סינון →
      </Button>
    </Card>
  );
}

export default Step1Welcome;
