import React from 'react';

const DataSummary = ({ dengueCount, dhfCount }) => {
  const totalCases = dengueCount + dhfCount;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">Total Cases</div>
        <div className="stat-value text-primary">{totalCases.toLocaleString()}</div>
      </div>
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">Dengue Cases</div>
        <div className="stat-value text-success">{dengueCount.toLocaleString()}</div>
      </div>
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">DHF Cases</div>
        <div className="stat-value text-error">{dhfCount.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default DataSummary;
