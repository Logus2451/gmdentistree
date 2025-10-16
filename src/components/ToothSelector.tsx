import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Eye, EyeOff } from 'lucide-react';

interface ToothSelectorProps {
  selectedTeeth: string[];
  onTeethChange: (teeth: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ToothSelector: React.FC<ToothSelectorProps> = ({ selectedTeeth, onTeethChange, isOpen, onClose }) => {
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  React.useEffect(() => {
    setTempSelected(selectedTeeth);
  }, [selectedTeeth, isOpen]);

  const teethData = {
    'Upper Right': ['18', '17', '16', '15', '14', '13', '12', '11'],
    'Upper Left': ['21', '22', '23', '24', '25', '26', '27', '28'],
    'Lower Left': ['38', '37', '36', '35', '34', '33', '32', '31'],
    'Lower Right': ['41', '42', '43', '44', '45', '46', '47', '48']
  };

  const getToothType = (tooth: string): string => {
    const num = parseInt(tooth.slice(-1));
    if ([1, 2].includes(num)) return 'Inc';
    if ([3].includes(num)) return 'Can';
    if ([4, 5].includes(num)) return 'Pre';
    if ([6, 7, 8].includes(num)) return 'Mol';
    return '';
  };

  const getToothImagePath = (tooth: string, view: 'front' | 'upper') => {
    const quadrant = tooth.startsWith('1') || tooth.startsWith('2') ? 'upper-teeth' : 'lower-teeth';
    const range = tooth.startsWith('1') || tooth.startsWith('4') ? 
      (tooth.startsWith('1') ? '11-18' : '41-48') : 
      (tooth.startsWith('2') ? '21-28' : '31-38');
    
    if (quadrant === 'upper-teeth') {
      return `/images/tooth-image/${quadrant}/${range}/${tooth}-tooth/${tooth}-tooth-${view}.png`;
    } else {
      if (view === 'front') {
        return `/images/tooth-image/${quadrant}/${range}/${tooth}-tooth/${tooth}-lower-front.png`;
      } else {
        return `/images/tooth-image/${quadrant}/${range}/${tooth}-tooth/${tooth}-lower-tooth.png`;
      }
    }
  };

  const toggleTooth = (tooth: string) => {
    setTempSelected(prev => 
      prev.includes(tooth) 
        ? prev.filter(t => t !== tooth)
        : [...prev, tooth]
    );
  };

  const handleSave = () => {
    onTeethChange(tempSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Select Teeth</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showImages ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showImages ? 'Hide' : 'Show'} Teeth</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Abbreviation Guide */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tooth Type Abbreviations:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
              <span>Inc = Incisor</span>
              <span>Can = Canine</span>
              <span>Pre = Premolar</span>
              <span>Mol = Molar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(teethData).map(([quadrant, teeth]) => (
              <div key={quadrant} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">{quadrant}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {teeth.map((tooth) => (
                    <button
                      key={tooth}
                      onClick={() => toggleTooth(tooth)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        tempSelected.includes(tooth)
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {showImages ? (
                        <div className="flex items-center justify-between space-x-1">
                          {/* Column 1: Number and Type */}
                          <div className="flex flex-col items-center flex-1">
                            <div className="font-bold text-sm">{tooth}</div>
                            <div className="text-xs text-gray-600">{getToothType(tooth)}</div>
                          </div>
                          {/* Column 2: Upper Image */}
                          <div className="flex flex-col items-center flex-1">
                            <img
                              src={getToothImagePath(tooth, 'upper')}
                              alt={`Tooth ${tooth} upper`}
                              className="w-4 h-6 sm:w-5 sm:h-8"
                              onError={(e) => {
                                const isUpper = tooth.startsWith('1') || tooth.startsWith('2');
                                e.currentTarget.src = isUpper 
                                  ? '/images/tooth-image/upper-teeth/11-18/11-tooth/11-tooth-upper.png'
                                  : '/images/tooth-image/lower-teeth/31-38/31-tooth/31-lower-tooth.png';
                              }}
                            />
                          </div>
                          {/* Column 3: Front Image */}
                          <div className="flex flex-col items-center flex-1">
                            <img
                              src={getToothImagePath(tooth, 'front')}
                              alt={`Tooth ${tooth} front`}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              onError={(e) => {
                                e.currentTarget.src = '/images/tooth-image/upper-teeth/11-18/11-tooth/11-tooth-front.png';
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="font-bold">{tooth}</div>
                          <div className="text-xs text-gray-600">{getToothType(tooth)}</div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Selected Teeth:</h4>
            <div className="flex flex-wrap gap-2">
              {tempSelected.length === 0 ? (
                <span className="text-gray-500">No teeth selected</span>
              ) : (
                tempSelected.sort().map((tooth) => (
                  <span
                    key={tooth}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm"
                  >
                    {tooth}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Save Selection</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToothSelector;