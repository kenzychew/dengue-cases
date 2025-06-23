import React, { useState, useEffect } from 'react';

const DataTable = ({ data, totalRecords, showLimit = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / showLimit); // eg. on page 3 with 10 records per page
  const startIndex = (currentPage - 1) * showLimit; // (3 - 1) * 10 = 20 - start on record #20 
  const currentData = data.slice(startIndex, startIndex + showLimit); // [20, 30)
  
  // Resets to page 1 when new filter applied
  useEffect(() => setCurrentPage(1), [data]);

  // Math.min(page, totalPages) prevents going beyond last page
  // Math.max(1, ...) prevents going below 1
  // Combined they ensure page stays within valid range (1 to totalPages)
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Raw Data Records</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Year</th>
                <th>Week</th>
                <th>Type</th>
                <th>Cases</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((record, index) => (
                <tr key={startIndex + index}> 
                  <td>{record.year}</td>
                  <td>{record.eweek}</td>
                  <td>
                    <div className={`badge ${record.type_dengue === 'Dengue' ? 'badge-success' : 'badge-error'}`}>
                      {record.type_dengue}
                    </div>
                  </td>
                  <td>{record.number.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-base-content/70 text-sm">
            Showing {startIndex + 1}-{Math.min(startIndex + showLimit, data.length)} of {totalRecords} records
          </div>
          
          {totalPages > 1 && (
            <div className="join">
              <button className="join-item btn btn-sm" onClick={() => goToPage(currentPage - 10)} disabled={currentPage <= 10}>-10</button>
              <button className="join-item btn btn-sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
              <button className="join-item btn btn-sm btn-active">Page {currentPage} of {totalPages}</button>
              <button className="join-item btn btn-sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
              <button className="join-item btn btn-sm" onClick={() => goToPage(currentPage + 10)} disabled={currentPage > totalPages - 10}>+10</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
