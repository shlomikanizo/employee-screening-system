import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  PlusCircle,
  Search,
  TrendingUp
} from 'lucide-react';
import FormsList from '../components/Admin/FormsList';
import SubmissionsList from '../components/Admin/SubmissionsList';
import FormEditor from '../components/Admin/FormEditor';
import Statistics from '../components/Admin/Statistics';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [formsRes, submissionsRes, statsRes] = await Promise.all([
        api.get('/api/admin/forms'),
        api.get('/api/admin/submissions'),
        api.get('/api/admin/stats/overview')
      ]);
      
      setForms(formsRes.data);
      setSubmissions(submissionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'סקירה כללית', icon: LayoutDashboard },
    { id: 'forms', label: 'ניהול טפסים', icon: FileText },
    { id: 'submissions', label: 'שליחות', icon: Users },
    { id: 'settings', label: 'הגדרות', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  מערכת ניהול טפסים
                </h1>
                <p className="text-sm text-gray-500">
                  ניהול מלא של טפסים ומועמדים
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('forms');
                setSelectedForm({ isNew: true });
              }}
              className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>טופס חדש</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Statistics stats={stats} forms={forms} submissions={submissions} />
            )}

            {activeTab === 'forms' && (
              <div className="space-y-6">
                {selectedForm ? (
                  <FormEditor
                    form={selectedForm}
                    onSave={(updatedForm) => {
                      loadData();
                      setSelectedForm(null);
                    }}
                    onCancel={() => setSelectedForm(null)}
                  />
                ) : (
                  <FormsList
                    forms={forms}
                    onEdit={setSelectedForm}
                    onDelete={(formId) => {
                      loadData();
                    }}
                    onRefresh={loadData}
                  />
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <SubmissionsList
                submissions={submissions}
                forms={forms}
                onRefresh={loadData}
              />
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות מערכת</h2>
                <p className="text-gray-600">בקרוב: עיצוב, התאמות, ועוד...</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
