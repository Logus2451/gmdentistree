import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import DentalChart from './DentalChart';
import ExaminationForm from './ExaminationForm';

interface Examination {
  id: string;
  tooth_number: string;
  examination_type: string;
  findings: string;
  treatment_required: boolean;
  notes: string;
  examined_by: string;
  examination_date: string;
  created_at: string;
}

interface ExaminationTabProps {
  patientId: string;
}

const ExaminationTab: React.FC<ExaminationTabProps> = ({ patientId }) => {
  const { currentClinic } = useAuth();
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [examinationsByTooth, setExaminationsByTooth] = useState<{ [key: string]: Examination[] }>({});
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExamination, setEditingExamination] = useState<Examination | undefined>();
  const [selectedTooth, setSelectedTooth] = useState('');

  useEffect(() => {
    fetchExaminations();
  }, [patientId]);

  const fetchExaminations = async () => {
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('examinations')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinic_id', currentClinic.id)
        .order('examination_date', { ascending: false });

      if (error) throw error;

      const transformedExaminations: Examination[] = data?.map(e => ({
        id: e.id,
        tooth_number: e.tooth_number,
        examination_type: e.examination_type,
        findings: e.findings || '',
        treatment_required: e.treatment_required || false,
        notes: e.notes || '',
        examined_by: e.examined_by || '',
        examination_date: e.examination_date,
        created_at: e.created_at
      })) || [];

      setExaminations(transformedExaminations);

      // Group by tooth
      const grouped = transformedExaminations.reduce((acc, exam) => {
        if (!acc[exam.tooth_number]) acc[exam.tooth_number] = [];
        acc[exam.tooth_number].push(exam);
        return acc;
      }, {} as { [key: string]: Examination[] });

      setExaminationsByTooth(grouped);
    } catch (error) {
      console.error('Error fetching examinations:', error);
    }
  };

  const handleToothSelect = (tooth: string) => {
    setSelectedTooth(tooth);
    setSelectedTeeth([tooth]);
  };

  const handleAddExamination = () => {
    if (!selectedTooth) {
      alert('Please select a tooth first');
      return;
    }
    setEditingExamination(undefined);
    setShowForm(true);
  };

  const handleEditExamination = (examination: Examination) => {
    setSelectedTooth(examination.tooth_number);
    setEditingExamination(examination);
    setShowForm(true);
  };

  const handleDeleteExamination = async (id: string) => {
    if (!window.confirm('Delete this examination?')) return;

    try {
      const { error } = await supabase
        .from('examinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchExaminations();
    } catch (error) {
      console.error('Error deleting examination:', error);
      alert('Failed to delete examination');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dental Chart */}
        <div className="lg:col-span-2">
          <DentalChart
            selectedTeeth={selectedTeeth}
            onToothSelect={handleToothSelect}
            examinations={examinationsByTooth}
          />
        </div>

        {/* Right: Selection Form */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Examination</h3>
            <button
              onClick={handleAddExamination}
              disabled={!selectedTooth}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {selectedTooth ? (
            <div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Selected Tooth</div>
                <div className="text-lg font-semibold text-blue-700">#{selectedTooth}</div>
              </div>

              {examinationsByTooth[selectedTooth] && examinationsByTooth[selectedTooth].length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Existing Examinations</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {examinationsByTooth[selectedTooth].map((exam) => (
                      <div key={exam.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{exam.examination_type}</div>
                            <div className="text-gray-600 text-xs">
                              {new Date(exam.examination_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditExamination(exam)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteExamination(exam.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a tooth to view or add examinations
            </div>
          )}
        </div>
      </div>

      {/* Bottom: All Examinations List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">All Examinations</h3>
        </div>
        <div className="p-4">
          {examinations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No examinations found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examinations.map((exam) => (
                <div key={exam.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-medium text-gray-900">Tooth #{exam.tooth_number}</div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditExamination(exam)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteExamination(exam.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">{exam.examination_type}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(exam.examination_date).toLocaleDateString()}
                    </div>
                    {exam.treatment_required && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        Treatment Required
                      </span>
                    )}
                    {exam.findings && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-300">
                        <span className="font-medium">Findings:</span> {exam.findings}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ExaminationForm
        examination={editingExamination}
        patientId={patientId}
        selectedTooth={selectedTooth}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingExamination(undefined);
        }}
        onSave={() => {
          setShowForm(false);
          setEditingExamination(undefined);
          fetchExaminations();
        }}
      />
    </div>
  );
};

export default ExaminationTab;