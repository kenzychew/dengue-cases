import React from 'react';

const FilterControls = ({ 
  availableYears, 
  selectedYear, 
  selectedWeek, 
  availableWeeks,
  onYearChange, 
  onWeekChange, 
  onClearFilters 
}) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title mb-4">Data Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Year Filter */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Filter by Year</span>
            </label>
            <select
              value={selectedYear || ''}
              onChange={onYearChange}
              className="select select-bordered w-full"
            >
              <option value="">All Years (2014-2018)</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {/* Week Filter */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Filter by Week</span>
            </label>
            <select
              value={selectedWeek || ''}
              onChange={onWeekChange}
              disabled={!selectedYear}
              className="select select-bordered w-full"
            >
              <option value="">All Weeks (1-53)</option>
              {availableWeeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
          
          {/* Current Filter */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Current Filter</span>
            </label>
            <input 
              type="text"
              value={selectedYear ? (selectedWeek ? `${selectedYear} - Week ${selectedWeek}` : `Year ${selectedYear}`) : 'All Data'}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </div>
          
          {/* Clear filters */}
          <div className="form-control w-full">
            <div className="label h-8"></div>
            <button 
              onClick={onClearFilters}
              className="btn btn-outline btn-secondary w-full"
              disabled={!selectedYear && !selectedWeek}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Filter Description */}
        <div className="mt-4 p-3 bg-base-200 rounded-lg">
          <p className="text-sm text-base-content/70">
             <strong>Tip:</strong> Select a year first to enable week filtering. 
            The dataset contains weekly lab-confirmed dengue and dengue haemorrhagic fever cases from 2014 to 2018.
          </p>
          <p className="text-xs text-base-content/60 mt-2">
             <strong>Data Source:</strong> Ministry of Health (MOH) Singapore - {" "}
            <a 
              href="https://data.gov.sg/datasets/d_ac1eecf0886ff0bceefbc51556247015/view" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link link-primary"
            >
              Weekly Number of Dengue and Dengue Haemorrhagic Fever Cases
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
