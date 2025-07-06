import { useState, useEffect } from 'react';
import { fetchDengueData } from '../services/services';

export const useDengueData = () => {
  // Data
  const [data, setData] = useState([]); // Stores processed data
  const [filteredData, setFilteredData] = useState([]); // Currently displayed data
  const [chartData, setChartData] = useState({ dengue: [], dhf: [] });
  const [availableYears, setAvailableYears] = useState([]);
  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const caseCountByType = (records, type) => {
    let totalCases = 0;

    for (let record of records) {
      if (record.type_dengue === type) {
        totalCases += record.number || 0;
      }
    }

    return totalCases;
  };

  // Transform records into chart format
  const processChartData = (records) => {
    // Split data by type
    const dengueData = records
      .filter((r) => r.type_dengue === 'Dengue')
      .map((r) => ({
        year: r.year,
        week: r.eweek,
        cases: r.number || 0,
        date: `${r.year}-W${String(r.eweek).padStart(2, '0')}`,
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);

    const dhfData = records
      .filter((r) => r.type_dengue === 'DHF')
      .map((r) => ({
        year: r.year,
        week: r.eweek,
        cases: r.number || 0,
        date: `${r.year}-W${String(r.eweek).padStart(2, '0')}`,
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);

    return { dengue: dengueData, dhf: dhfData };
  };

  useEffect(() => {
    const loadDengueData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchDengueData(); // Single API call
        // console.log(res);

        // Data transformation
        if (res.success) {
          const processedRecords = res.result.records.map((record) => ({
            ...record,
            year: parseInt(record.year),
            eweek: parseInt(record.eweek),
            number: parseInt(record.number) || 0,
          }));

          // Extract unique years from processed data
          const extractedYears = [...new Set(processedRecords.map((r) => r.year))].sort((a, b) => a - b);

          setData(processedRecords); // Stores the original transformed data
          setFilteredData(processedRecords); // Initially shows all data
          setChartData(processChartData(processedRecords));
          setAvailableYears(extractedYears);
        } else {
          throw new Error('Failed to fetch dengue data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading dengue data:', err);
        // Fallback
        setAvailableYears([2014, 2015, 2016, 2017, 2018]);
      } finally {
        setLoading(false);
      }
    };

    loadDengueData();
  }, []);

  // Filter by year
  const filterByYear = (year) => {
    const yearData = data.filter((r) => r.year === year);
    setFilteredData(yearData);
    setChartData(processChartData(yearData));
    setSelectedYear(year);
    setSelectedWeek(null);
  };

  // Filter by week - show all weeks in year but tracks the selected week
  const filterByWeek = (year, week) => {
    const yearData = data.filter((r) => r.year === year);
    setFilteredData(yearData); //
    setSelectedYear(year);
    setSelectedWeek(week);
  };

  // Clear filters
  const clearFilters = () => {
    setFilteredData(data);
    setChartData(processChartData(data));
    setSelectedYear(null);
    setSelectedWeek(null);
  };

  // Calculate summary stats - use selected week data if week is selected
  const getSummaryData = () => {
    if (selectedWeek && selectedYear) {
      // Show numbers for the selected week only
      const weekData = data.filter((r) => r.year === selectedYear && r.eweek === selectedWeek);
      return {
        dengueCount: caseCountByType(weekData, 'Dengue'),
        dhfCount: caseCountByType(weekData, 'DHF'),
      };
    } else {
      // Show numbers for the filtered data (year or all data)
      return {
        dengueCount: caseCountByType(filteredData, 'Dengue'),
        dhfCount: caseCountByType(filteredData, 'DHF'),
      };
    }
  };

  const summaryData = getSummaryData();

  return {
    // Data
    data,
    filteredData,
    chartData,
    availableYears,

    // State
    loading,
    error,
    selectedYear,
    selectedWeek,

    // Actions
    filterByYear,
    filterByWeek,
    clearFilters,

    // Values (DataSummary)
    dengueCount: summaryData.dengueCount,
    dhfCount: summaryData.dhfCount,
  };
};
