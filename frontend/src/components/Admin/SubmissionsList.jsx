import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Filter
} from 'lucide-react';

const SubmissionsList = ({ submissions, forms, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'passed') return sub.passed_screening;
    if (filter === 'failed') return !sub.passed_screening;
    if (filter === 'accepted') return sub.accepted_terms;
    return true;
  });

  const getFormTitle = (formId) => {
    const form = forms?.find(f => f.id === formId);
    return form?.job_title || 'לא ידוע';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          שליחות ({filteredSubmissions.length})
        </h2>
        
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">הכל</option>
            <option value="passed">עברו סינון</option>
            <option value="failed">נכשלו בסינון</option>
            <option value="accepted">אישרו תנאים</option>
          </select>

          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            רענן
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  שם מלא
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  טלפון
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  אימייל
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  עיר
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  טופס
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  סינון
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  תנאים
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  תאריך
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission, index) => (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {submission.full_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                    {submission.phone_number}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {submission.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {submission.city}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getFormTitle(submission.form_id)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {submission.passed_screening ? (
                      <CheckCircle className="w-5 h-5 text-green-500 inline-block" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 inline-block" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {submission.accepted_terms ? (
                      <CheckCircle className="w-5 h-5 text-teal-500 inline-block" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-500 inline-block" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(submission.submitted_at).toLocaleDateString('he-IL')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500">
                    אין שליחות להצגה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal לפרטי שליחה */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            dir="rtl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              פרטי שליחה
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">שם מלא</p>
                  <p className="font-medium">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">טלפון</p>
                  <p className="font-medium">{selectedSubmission.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">אימייל</p>
                  <p className="font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">עיר</p>
                  <p className="font-medium">{selectedSubmission.city}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">תשובות לשאלות סינון</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedSubmission.screening_answers, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">סינון:</span>
                  {selectedSubmission.passed_screening ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      עבר
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <XCircle className="w-4 h-4" />
                      נכשל
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">תנאים:</span>
                  {selectedSubmission.accepted_terms ? (
                    <span className="flex items-center gap-1 text-teal-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      אישר
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 font-medium">
                      <XCircle className="w-4 h-4" />
                      דחה
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  סגור
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
