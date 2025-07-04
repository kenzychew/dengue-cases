import React from 'react';
import { useDengueData } from './hooks/useDengueData';
import DashboardLayout from './components/Layout/DashboardLayout';
import FilterControls from './components/UI/FilterControls';
import DataSummary from './components/UI/DataSummary';
import DengueChart from './components/Charts/DengueChart';
import DataTable from './components/Table/DataTable';
import './App.css';

const App = () => {
  const {
    loading,
    error,
    data,
    filteredData,
    chartData,
    availableYears,
    totalRecords,
    dengueCount,
    dhfCount,
    selectedYear,
    selectedWeek,
    filterByYear,
    filterByWeek,
    clearFilters
  } = useDengueData();

  const handleYearChange = (e) => {
    const year = e.target.value;
    if (year === '') {
      clearFilters();
    } else {
      filterByYear(parseInt(year));
    }
  };

  const handleWeekChange = (e) => {
    const week = e.target.value;
    if (week === '' || !selectedYear) {
      if (selectedYear) {
        filterByYear(selectedYear);
      } else {
        clearFilters();
      }
    } else {
      filterByWeek(selectedYear, parseInt(week));
    }
  };

  // Weeks for selected year from original dataset
  const getAvailableWeeks = () => {
    if (!selectedYear || !data.length) return [];
    
    const yearData = data.filter(record => record.year === selectedYear);
    const weeks = [...new Set(yearData.map(record => record.eweek))];
    return weeks.sort((a, b) => a - b);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div>
            <progress className="progress progress-primary mb-4"></progress>
            <p>Loading dengue data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div role="alert" className="alert alert-error">
            <div>
              <h3 className="font-bold">Error loading data</h3>
              <div>{error}</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FilterControls
        availableYears={availableYears}
        selectedYear={selectedYear}
        selectedWeek={selectedWeek}
        availableWeeks={getAvailableWeeks()}
        onYearChange={handleYearChange}
        onWeekChange={handleWeekChange}
        onClearFilters={clearFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DengueChart 
          data={chartData.dengue} 
          title="Dengue Cases Over Time"
          color="#10B981"
        />
        <DengueChart 
          data={chartData.dhf} 
          title="DHF Cases Over Time"
          color="#f87171"
        />
      </div>

      <DataSummary
        totalRecords={totalRecords}
        dengueCount={dengueCount}
        dhfCount={dhfCount}
      />

      <DataTable
        data={filteredData}
        totalRecords={totalRecords}
        showLimit={10}
      />
    </DashboardLayout>
  );
};

export default App;
