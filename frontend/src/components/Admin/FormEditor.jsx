import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../services/api';

const FormEditor = ({ form, onSave, onCancel }) => {
  const [formData, setFormData] = useState(form.isNew ? {
    job_title: '',
    job_description: '',
    job_location: '',
    salary_range: '',
    company_name: '',
    company_address: '',
    company_lat: 32.0853,
    company_lng: 34.7818,
    company_logo_url: '',
    screening_questions: [],
    requirements: [],
    terms_and_conditions: {
      salary: '',
      work_hours: '',
      benefits: [],
      additional_info: ''
    }
  } : form);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (form.isNew) {
        await api.post('/api/forms/', formData);
      } else {
        await api.put(`/api/admin/forms/${form.unique_id}`, formData);
      }
      alert('הטופס נשמר בהצלחה!');
      onSave(formData);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('שגיאה בשמירת הטופס');
    } finally {
      setIsSaving(false);
    }
  };

  // פונקציות עזר
  const addQuestion = () => {
    setFormData({
      ...formData,
      screening_questions: [...formData.screening_questions, {
        id: `q${Date.now()}`,
        question: '',
        type: 'boolean',
        required: true,
        options: null,
        correct_answer: null
      }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.screening_questions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, screening_questions: updated });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      screening_questions: formData.screening_questions.filter((_, i) => i !== index)
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, {
        text: '',
        is_mandatory: true
      }]
    });
  };

  const updateRequirement = (index, field, value) => {
    const updated = [...formData.requirements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, requirements: updated });
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      terms_and_conditions: {
        ...formData.terms_and_conditions,
        benefits: [...(formData.terms_and_conditions.benefits || []), '']
      }
    });
  };

  const updateBenefit = (index, value) => {
    const updated = [...formData.terms_and_conditions.benefits];
    updated[index] = value;
    setFormData({
      ...formData,
      terms_and_conditions: { ...formData.terms_and_conditions, benefits: updated }
    });
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      terms_and_conditions: {
        ...formData.terms_and_conditions,
        benefits: formData.terms_and_conditions.benefits.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {form.isNew ? 'טופס חדש' : 'עריכת טופס'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
            <span>ביטול</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'שומר...' : 'שמור'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* מידע בסיסי */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">מידע בסיסי על המשרה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כותרת המשרה *
              </label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="לדוגמה: מפתח Full Stack"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם החברה *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="לדוגמה: Tech Solutions Ltd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מיקום *
              </label>
              <input
                type="text"
                value={formData.job_location}
                onChange={(e) => setFormData({ ...formData, job_location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="לדוגמה: תל אביב"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טווח שכר *
              </label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="לדוגמה: 15,000-20,000 ₪"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור המשרה *
              </label>
              <textarea
                value={formData.job_description}
                onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="תאר את המשרה בפירוט..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כתובת החברה
              </label>
              <input
                type="text"
                value={formData.company_address}
                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="רחוב העצמאות 1, תל אביב"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                לוגו (URL)
              </label>
              <input
                type="url"
                value={formData.company_logo_url}
                onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </section>

        {/* דרישות מקדמיות */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">דרישות מקדמיות</h3>
            <button
              onClick={addRequirement}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף דרישה</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.requirements?.map((req, index) => (
              <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  value={req.text}
                  onChange={(e) => updateRequirement(index, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="נוסח הדרישה..."
                />
                <button
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* שאלות סינון */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">שאלות סינון</h3>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף שאלה</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.screening_questions?.map((q, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="נוסח השאלה..."
                  />
                  
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="boolean">כן/לא</option>
                    <option value="select">בחירה</option>
                    <option value="text">טקסט חופשי</option>
                    <option value="number">מספר</option>
                  </select>
                  
                  <button
                    onClick={() => removeQuestion(index)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>מחק</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* תנאי עבודה */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">תנאי עבודה</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שכר
              </label>
              <input
                type="text"
                value={formData.terms_and_conditions?.salary || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  terms_and_conditions: { ...formData.terms_and_conditions, salary: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="15,000-20,000 ₪ ברוטו לחודש"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שעות עבודה
              </label>
              <input
                type="text"
                value={formData.terms_and_conditions?.work_hours || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  terms_and_conditions: { ...formData.terms_and_conditions, work_hours: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="משרה מלאה, 9:00-18:00"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  הטבות
                </label>
                <button
                  onClick={addBenefit}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>הוסף הטבה</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.terms_and_conditions?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="הטבה..."
                    />
                    <button
                      onClick={() => removeBenefit(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מידע נוסף
              </label>
              <textarea
                value={formData.terms_and_conditions?.additional_info || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  terms_and_conditions: { ...formData.terms_and_conditions, additional_info: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="מידע נוסף על התנאים..."
              />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default FormEditor;
