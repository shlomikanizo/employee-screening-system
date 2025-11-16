import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  BarChart, 
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';

const FormsList = ({ forms, onEdit, onDelete, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleDelete = async (formId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק טופס זה?')) {
      return;
    }

    setDeletingId(formId);
    try {
      await api.delete(`/api/admin/forms/${formId}`);
      onDelete(formId);
      alert('הטופס נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('שגיאה במחיקת הטופס');
    } finally {
      setDeletingId(null);
    }
  };

  const copyFormLink = (formId) => {
    const url = `${window.location.origin}/?id=${formId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openFormPreview = (formId) => {
    window.open(`/?id=${formId}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          טפסים ({forms.length})
        </h2>
        <button
          onClick={onRefresh}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          רענן
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {forms.map((form) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {form.job_title}
                  </h3>
                  {form.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      פעיל
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      לא פעיל
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">חברה</p>
                    <p className="text-sm font-medium text-gray-900">
                      {form.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">מיקום</p>
                    <p className="text-sm font-medium text-gray-900">
                      {form.job_location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">שכר</p>
                    <p className="text-sm font-medium text-gray-900">
                      {form.salary_range}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">נוצר</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(form.created_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {form.screening_questions?.length || 0} שאלות
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {form.requirements?.length || 0} דרישות
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                  <span className="font-semibold">קישור:</span>
                  <span className="flex-1 truncate">
                    {window.location.origin}/?id={form.unique_id}
                  </span>
                  <button
                    onClick={() => copyFormLink(form.unique_id)}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {copiedId === form.unique_id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openFormPreview(form.unique_id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>תצוגה מקדימה</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(form)}
                className="flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>ערוך</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyFormLink(form.unique_id)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>העתק קישור</span>
              </motion.button>

              <div className="flex-1"></div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(form.unique_id)}
                disabled={deletingId === form.unique_id}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingId === form.unique_id ? 'מוחק...' : 'מחק'}</span>
              </motion.button>
            </div>
          </motion.div>
        ))}

        {forms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">אין טפסים עדיין</p>
            <button
              onClick={() => onEdit({ isNew: true })}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              צור טופס ראשון
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsList;
