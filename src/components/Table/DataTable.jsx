import React, { useState, useEffect } from 'react';

const DataTable = ({ data, selectedYear, selectedWeek, showLimit = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Combines 2 rows into 1
  const weekly = {};
  data.forEach(record => {
    // Create uniqure key for the week eg. 2014-1
    const key = `${record.year}-${record.eweek}`;
    // Check if week exists in our weekly object
    if (!weekly[key]) {
      // If not create new entry { year: 2014, week: 1, dengue: 0, dhf: 0 }
      weekly[key] = { year: record.year, week: record.eweek, dengue: 0, dhf: 0 };
    }
    if (record.type_dengue === 'Dengue') {
      weekly[key].dengue = record.number; // weekly["2014-1"] = { year: 2014, week: 1, dengue: 436, dhf: 0 }
    } else {
      weekly[key].dhf = record.number; // weekly["2014-1"] = { year: 2014, week: 1, dengue: 436, dhf: 1 } etc
    }
  });
  
  // Convert weekly object to array and add total column
  const weeklyData = Object.values(weekly)
    .map(w => ({ ...w, total: w.dengue + w.dhf })) // spread and add new total column
    // Remove if certain that new data will always be sorted
    .sort((a, b) => a.year - b.year || a.week - b.week); // this ensures chronological order, but in our case data is already sorted

  const totalPages = Math.ceil(weeklyData.length / showLimit);
  const startIndex = (currentPage - 1) * showLimit;
  const currentData = weeklyData.slice(startIndex, startIndex + showLimit);
  
  // Reset to first page when data changes
  useEffect(() => setCurrentPage(1), [data]);

  // Auto-scroll to page containing selected week
  useEffect(() => {
    if (selectedWeek && selectedYear) {
      // User selects Year 2014, Week 21
      const selectedIndex = weeklyData.findIndex(w => w.year === selectedYear && w.week === selectedWeek);
      if (selectedIndex !== -1) { // which will be at index 20
        const targetPage = Math.floor(selectedIndex / showLimit) + 1; // Math.floor(20 / 10) + 1 = 3
        setCurrentPage(targetPage); // jump to page 3 where week 21 is visible
      }
    }
  }, [selectedWeek, selectedYear, weeklyData, showLimit]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Weekly Cases</h2>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Week</th>
                <th className="text-center">Dengue Cases</th>
                <th className="text-center">DHF Cases</th>
                <th className="text-center">Total Cases</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((record) => {
                const isSelected = selectedYear === record.year && selectedWeek === record.week;
                return (
                  <tr 
                    key={`${record.year}-W${record.week}`}
                    // selected week will have light blue background and blue left border
                    className={isSelected ? 'bg-primary/10 border-l-4 border-primary' : ''}
                  > 
                    <td className="font-medium">{record.year}</td>
                    <td className="font-medium">{record.week}</td>
                    <td className="text-center">
                      <span className="font-semibold text-success">{record.dengue.toLocaleString()}</span>
                    </td>
                    <td className="text-center">
                      <span className="font-semibold text-error">{record.dhf.toLocaleString()}</span>
                    </td>
                    <td className="text-center">
                      <span className="font-bold text-primary">{record.total.toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-base-content/70 text-sm">
            Showing {startIndex + 1}-{Math.min(startIndex + showLimit, weeklyData.length)} of {weeklyData.length} weeks
          </div>
          
          {totalPages > 1 && (
            <div className="join">
              <button 
                className="join-item btn btn-outline" 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className="join-item btn btn-outline">
                Page {currentPage} of {totalPages}
              </button>
              <button 
                className="join-item btn btn-outline" 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
