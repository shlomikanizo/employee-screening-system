import { CheckCircle2, MessageCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';

/**
 * מסך הצלחה
 * מוצג לאחר שליחת טופס מוצלחת
 */
function StepSuccess({ candidateName }) {
  return (
    <Card className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="mb-6"
      >
        <div className="inline-block bg-green-100 rounded-full p-6">
          <CheckCircle2 className="w-24 h-24 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold text-green-600 mb-4">
          🎉 כל הכבוד!
        </h2>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          {candidateName}, הטופס נשלח בהצלחה
        </h3>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            תודה שמילאת את הטופס! הפרטים שלך התקבלו אצלנו ונמצאים כעת בבדיקה.
          </p>
        </div>

        {/* What's Next */}
        <div className="text-right space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">מה הלאה?</h4>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-right">
              <p className="font-semibold text-gray-800 mb-1">
                הודעת אישור בווטסאפ
              </p>
              <p className="text-gray-600">
                קיבלת הודעת אישור למספר שהזנת עם פרטי הטופס שמילאת
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="text-right">
              <p className="font-semibold text-gray-800 mb-1">
                PDF של הטופס
              </p>
              <p className="text-gray-600">
                נשלח אליך PDF מעוצב עם כל הפרטים שמילאת
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="text-right">
              <p className="font-semibold text-gray-800 mb-1">
                יצירת קשר
              </p>
              <p className="text-gray-600">
                נציג מטעמנו יצור איתך קשר בימים הקרובים לתיאום ריאיון
              </p>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl p-6">
          <p className="text-xl font-semibold mb-2">
            💼 מצפים לראות אותך!
          </p>
          <p className="text-lg opacity-90">
            בהצלחה בהמשך התהליך
          </p>
        </div>

        {/* Close Window Hint */}
        <p className="text-sm text-gray-500 mt-6">
          ניתן לסגור חלון זה בבטחה
        </p>
      </motion.div>
    </Card>
  );
}

export default StepSuccess;
