import React from 'react';

const DataSummary = ({ totalRecords, dengueCount, dhfCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">Total Records</div>
        <div className="stat-value text-primary">{totalRecords}</div>
      </div>
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">Dengue Cases</div>
        <div className="stat-value text-success">{dengueCount}</div>
      </div>
      <div className="stat bg-base-100 shadow-xl rounded-lg text-center">
        <div className="stat-title">DHF Cases</div>
        <div className="stat-value text-error">{dhfCount}</div>
      </div>
    </div>
  );
};

export default DataSummary;
