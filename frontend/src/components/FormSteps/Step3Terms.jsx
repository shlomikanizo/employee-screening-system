import { Coins, Clock, Gift, FileText } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';

/**
 * שלב 3 - תנאים ושכר
 * הצגת תנאי העבודה ואישור
 */
function Step3Terms({ formData, onAccept, onReject, onBack }) {
  const terms = formData?.terms_and_conditions || {};

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-3xl font-bold text-primary-900 mb-2">
          מצוין! עברת את השלב הראשון
        </h2>
        <p className="text-gray-600 text-lg">
          הנה פרטי התפקיד והתנאים שלנו
        </p>
      </div>

      {/* Salary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-4 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">₪</span>
          </div>
          <h3 className="text-2xl font-bold text-green-900">שכר</h3>
        </div>
        <p className="text-xl font-semibold text-gray-800">{terms.salary}</p>
      </div>

      {/* Work Hours */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-4 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-500 rounded-full p-2">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">שעות עבודה</h3>
        </div>
        <p className="text-xl font-semibold text-gray-800">{terms.work_hours}</p>
      </div>

      {/* Benefits */}
      {terms.benefits && terms.benefits.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-4 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500 rounded-full p-2">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900">הטבות</h3>
          </div>
          <ul className="space-y-2">
            {terms.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-800">
                <span className="text-purple-500">✓</span>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Info */}
      {terms.additional_info && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">מידע נוסף</h3>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{terms.additional_info}</p>
        </div>
      )}

      {/* Confirmation Box */}
      <div className="bg-yellow-50 border-r-4 border-yellow-400 p-5 rounded-lg mb-6">
        <h4 className="font-bold text-gray-800 mb-2">⚠️ חשוב לדעת:</h4>
        <p className="text-gray-700">
          על ידי לחיצה על "מאשר את התנאים", אתה מסכים לתנאים המפורטים לעיל ומעוניין להמשיך בתהליך הקבלה.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={onAccept}
          fullWidth
          size="lg"
          variant="success"
        >
          ✓ מאשר את התנאים והמשך →
        </Button>
        
        <div className="flex gap-3">
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            ← חזור
          </Button>
          <Button 
            onClick={onReject}
            variant="danger"
            className="flex-1"
          >
            ✗ לא מתאים לי
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Step3Terms;
