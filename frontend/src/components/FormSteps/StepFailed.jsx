import { XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import Card from '../shared/Card';

/**
 * מסך כישלון
 * מוצג כאשר המועמד לא עבר את הסינון או לא אישר תנאים
 */
function StepFailed({ 
  title = "לא עברת את שלב הסינון", 
  message = "לצערנו, לא עמדת בדרישות המקדמיות למשרה זו.",
  showRetry = false,
  onRetry = null
}) {
  return (
    <Card className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="mb-6"
      >
        <div className="inline-block bg-red-100 rounded-full p-6">
          <XCircle className="w-24 h-24 text-red-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          {title}
        </h2>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-red-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Encouragement */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <p className="text-lg text-gray-700 mb-3">
            💙 אל תתייאש!
          </p>
          <p className="text-gray-600">
            תודה שהקדשת מזמנך למלא את הטופס.
            נשמח לראות אותך במשרות עתידיות שיתאימו יותר לפרופיל שלך.
          </p>
        </div>

        {/* Suggestions */}
        <div className="text-right space-y-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-1">
              📢 הישאר מעודכן
            </p>
            <p className="text-gray-600 text-sm">
              עקוב אחרינו ברשתות החברתיות למשרות חדשות
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-1">
              📧 נשמור על קשר
            </p>
            <p className="text-gray-600 text-sm">
              נשלח לך הודעה כשיפתחו משרות מתאימות
            </p>
          </div>
        </div>

        {/* Retry Button (if applicable) */}
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            fullWidth
            className="mb-4"
          >
            <RefreshCw className="w-5 h-5" />
            נסה שוב
          </Button>
        )}

        {/* Final Message */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl p-6">
          <p className="text-lg font-semibold">
            בהצלחה בהמשך הדרך! 🚀
          </p>
        </div>

        {/* Close Window Hint */}
        <p className="text-sm text-gray-500 mt-6">
          ניתן לסגור חלון זה
        </p>
      </motion.div>
    </Card>
  );
}

export default StepFailed;
