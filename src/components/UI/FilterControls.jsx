import React from 'react';

const FilterControls = ({ 
  availableYears, // [2014, ..., 2018]
  selectedYear, // Currently selected year or null
  selectedWeek, 
  availableWeeks, // [1, ..., 53]
  onYearChange, // handleYearChange
  onWeekChange, 
  onClearFilters // clearFilters
}) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title mb-4">Data Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Year Filter */}
          <fieldset className="fieldset w-full">
            <label className="label font-semibold" htmlFor="year-select">
              Filter by Year
            </label>
            <select
              id="year-select"
              value={selectedYear || ''}
              onChange={onYearChange}
              className="select w-full"
            >
              <option value="">All Years (2014-2018)</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </fieldset>
          
          {/* Week Filter */}
          <fieldset className="fieldset w-full">
            <label className="label font-semibold" htmlFor="week-select">
              Filter by Week
            </label>
            <select
              id="week-select"
              value={selectedWeek || ''}
              onChange={onWeekChange}
              disabled={!selectedYear}
              className="select w-full"
            >
              <option value="">All Weeks (1-53)</option>
              {availableWeeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </fieldset>
          
          {/* Current Filter */}
          <fieldset className="fieldset w-full">
            <label className="label font-semibold" htmlFor="current-filter">
              Current Filter
            </label>
            <textarea 
              id="current-filter"
              value={selectedYear ? (selectedWeek ? `${selectedYear} - Week ${selectedWeek}` : `Year ${selectedYear}`) : 'All Data'}
              readOnly
              className="textarea w-full bg-base-200 resize-none min-h-12"
              rows="1"
            />
          </fieldset>
          
          {/* Clear filters */}
          <fieldset className="fieldset w-full">
            <div className="label h-8"></div>
            <button 
              onClick={onClearFilters}
              className="btn btn-outline btn-secondary w-full"
              disabled={!selectedYear && !selectedWeek}
            >
              Clear Filters
            </button>
          </fieldset>
        </div>
        
        {/* Dataset Info */}
        <article className="mt-4 p-3 bg-base-200 rounded-lg">
          <p className="text-sm text-base-content/70">
             <strong>Tip:</strong> Select a year first to enable week filtering. 
            The dataset contains weekly lab-confirmed dengue and dengue haemorrhagic fever cases from 2014 to 2018.
          </p>
          <footer className="text-xs text-base-content/60 mt-2">
             <strong>Data Source: </strong> 
             <cite>Ministry of Health (MOH) Singapore</cite> - {" "}
            <a 
              href="https://data.gov.sg/datasets/d_ac1eecf0886ff0bceefbc51556247015/view" 
              target="_blank" 
              rel="noopener noreferrer external"
              className="link link-primary"
            >
              Weekly Number of Dengue and Dengue Haemorrhagic Fever Cases
            </a>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default FilterControls;
