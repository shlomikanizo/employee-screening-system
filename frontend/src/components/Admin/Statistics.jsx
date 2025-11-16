import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    
    {trend !== undefined && (
      <div className="flex items-center gap-1 mt-4">
        {trend > 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              +{trend}%
            </span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 font-medium">
              {trend}%
            </span>
          </>
        )}
        <span className="text-sm text-gray-500">מהחודש הקודם</span>
      </div>
    )}
  </motion.div>
);

const Statistics = ({ stats, forms, submissions }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">טוען נתונים...</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'סה"כ טפסים',
      value: stats.total_forms,
      icon: FileText,
      color: 'bg-blue-500',
      subtitle: `${stats.active_forms} פעילים`
    },
    {
      title: 'סה"כ שליחות',
      value: stats.total_submissions,
      icon: Users,
      color: 'bg-purple-500',
      subtitle: `${stats.recent_submissions_30d} ב-30 הימים האחרונים`
    },
    {
      title: 'עברו סינון',
      value: stats.passed_screening,
      icon: CheckCircle,
      color: 'bg-green-500',
      subtitle: `${stats.pass_rate}% שיעור הצלחה`
    },
    {
      title: 'אישרו תנאים',
      value: stats.accepted_terms,
      icon: CheckCircle,
      color: 'bg-teal-500',
      subtitle: `${stats.acceptance_rate}% מהעוברים`
    }
  ];

  // חישוב נתונים לגרף
  const recentForms = forms?.slice(0, 5) || [];
  const recentSubmissions = submissions?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* כרטיסי סטטיסטיקה */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* שיעורי הצלחה */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            שיעור הצלחה בסינון
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">עברו</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.passed_screening} ({stats.pass_rate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.pass_rate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">נכשלו</span>
                <span className="text-sm font-medium text-red-600">
                  {stats.failed_screening} ({100 - stats.pass_rate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${100 - stats.pass_rate}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            אישור תנאים
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">אישרו</span>
                <span className="text-sm font-medium text-teal-600">
                  {stats.accepted_terms} ({stats.acceptance_rate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.acceptance_rate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">דחו</span>
                <span className="text-sm font-medium text-orange-600">
                  {stats.rejected_terms} ({100 - stats.acceptance_rate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all"
                  style={{ width: `${100 - stats.acceptance_rate}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* טפסים אחרונים */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          טפסים אחרונים
        </h3>
        <div className="space-y-3">
          {recentForms.length > 0 ? (
            recentForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{form.job_title}</p>
                  <p className="text-sm text-gray-500">{form.company_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {form.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      פעיל
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      לא פעיל
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">אין טפסים עדיין</p>
          )}
        </div>
      </motion.div>

      {/* שליחות אחרונות */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          שליחות אחרונות
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  שם
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  טלפון
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  סינון
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  תנאים
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  תאריך
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {submission.full_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {submission.phone_number}
                    </td>
                    <td className="py-3 px-4">
                      {submission.passed_screening ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {submission.accepted_terms ? (
                        <CheckCircle className="w-5 h-5 text-teal-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(submission.submitted_at).toLocaleDateString('he-IL')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    אין שליחות עדיין
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
