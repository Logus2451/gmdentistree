import React from 'react';

interface DentalChartProps {
  selectedTeeth: string[];
  onToothSelect: (tooth: string) => void;
  examinations: { [key: string]: any[] };
}

const DentalChart: React.FC<DentalChartProps> = ({ selectedTeeth, onToothSelect, examinations }) => {
  const upperTeeth = [
    ['18', '17', '16', '15', '14', '13', '12', '11'],
    ['21', '22', '23', '24', '25', '26', '27', '28']
  ];
  
  const lowerTeeth = [
    ['48', '47', '46', '45', '44', '43', '42', '41'],
    ['31', '32', '33', '34', '35', '36', '37', '38']
  ];

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

  const hasExamination = (tooth: string) => {
    return examinations[tooth] && examinations[tooth].length > 0;
  };

  const renderTooth = (tooth: string) => {
    const isUpperTooth = tooth.startsWith('1') || tooth.startsWith('2');
    const isLowerTooth = tooth.startsWith('3') || tooth.startsWith('4');
    
    return (
      <div
        key={tooth}
        onClick={() => onToothSelect(tooth)}
        className={`relative cursor-pointer p-1 rounded transition-all ${
          selectedTeeth.includes(tooth) ? 'bg-blue-200 ring-2 ring-blue-500' : 'hover:bg-gray-100'
        }`}
      >
        {isUpperTooth && (
          <img
            src={getToothImagePath(tooth, 'upper')}
            alt={`Tooth ${tooth} upper`}
            className="w-6 h-12 sm:w-8 sm:h-16 mx-auto mb-1"
            onError={(e) => {
              e.currentTarget.src = '/images/tooth-image/upper-teeth/11-18/11-tooth/11-tooth-upper.png';
            }}
          />
        )}
        
        <img
          src={getToothImagePath(tooth, 'front')}
          alt={`Tooth ${tooth} front`}
          className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
          onError={(e) => {
            e.currentTarget.src = '/images/tooth-image/upper-teeth/11-18/11-tooth/11-tooth-front.png';
          }}
        />
        
        {isLowerTooth && (
          <img
            src={getToothImagePath(tooth, 'upper')}
            alt={`Tooth ${tooth} upper`}
            className="w-6 h-12 sm:w-8 sm:h-16 mx-auto mt-1"
            onError={(e) => {
              e.currentTarget.src = '/images/tooth-image/lower-teeth/31-38/31-tooth/31-lower-tooth.png';
            }}
          />
        )}
        
        <div className="text-xs text-center font-medium mt-1">{tooth}</div>
        {hasExamination(tooth) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Dental Chart</h3>
      
      {/* Upper Teeth */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Upper Teeth</div>
        <div className="flex justify-center space-x-2 sm:space-x-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1">
            {upperTeeth[0].map(renderTooth)}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1">
            {upperTeeth[1].map(renderTooth)}
          </div>
        </div>
      </div>

      {/* Lower Teeth */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Lower Teeth</div>
        <div className="flex justify-center space-x-2 sm:space-x-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1">
            {lowerTeeth[0].map(renderTooth)}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1">
            {lowerTeeth[1].map(renderTooth)}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Click on teeth to select • Red dot indicates existing examination
      </div>
    </div>
  );
};

export default DentalChart;