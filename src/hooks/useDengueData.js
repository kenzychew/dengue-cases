import { useState, useEffect, useCallback } from 'react';
import {
  fetchDengueData,
  fetchChartData,
  fetchAvailableYears,
  fetchDengueDataByYear,
  fetchDengueDataByWeek,
} from '../services/services';

export const useDengueData = () => {
  // Data
  const [data, setData] = useState([]); // Original dataset
  const [filteredData, setFilteredData] = useState([]); // Currently displayed data
  const [chartData, setChartData] = useState({ dengue: [], dhf: [] }); // Chart Visualization
  const [availableYears, setAvailableYears] = useState([]); // Years for dropdown
  // UI states
  const [loading, setLoading] = useState(false);
  const [filtering, setFiltering] = useState(false); // Filter operation overlay
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [allData, years, charts] = await Promise.all([
          fetchDengueData(),
          fetchAvailableYears(),
          fetchChartData(),
        ]);

        if (allData.success) {
          const processedRecords = allData.result.records.map((record) => ({
            ...record,
            year: parseInt(record.year), // Convert string to number
            eweek: parseInt(record.eweek),
            number: parseInt(record.number) || 0,
          }));

          setData(processedRecords);
          setFilteredData(processedRecords);
        } else {
          throw new Error('Failed to fetch data');
        }

        setAvailableYears(years);
        setChartData(charts);
      } catch (err) {
        setError(err.message);
        console.error('Error loading dengue data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // useCallback bc passed as prop
  const filterByYear = useCallback(
    async (year) => {
      if (!year) {
        setFilteredData(data);
        setSelectedYear(null);
        setSelectedWeek(null);
        return;
      }

      setFiltering(true);
      setError(null);

      try {
        const yearData = await fetchDengueDataByYear(year);
        const yearChartData = await fetchChartData(year);

        if (yearData.success) {
          const processedRecords = yearData.result.records.map((record) => ({
            ...record,
            year: parseInt(record.year),
            eweek: parseInt(record.eweek),
            number: parseInt(record.number) || 0,
          }));

          setFilteredData(processedRecords);
          setChartData(yearChartData);
          setSelectedYear(year);
          setSelectedWeek(null);
        } else {
          throw new Error('Failed to fetch year data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error filtering by year:', err);
      } finally {
        setFiltering(false);
      }
    },
    [data]
  );

  const filterByWeek = useCallback(
    async (year, week) => {
      if (!year || !week) {
        if (year) {
          filterByYear(year);
        } else {
          setFilteredData(data);
          setSelectedYear(null);
          setSelectedWeek(null);
        }
        return;
      }

      setFiltering(true);
      setError(null);

      try {
        const weekData = await fetchDengueDataByWeek(year, week);

        if (weekData.success) {
          const processedRecords = weekData.result.records.map((record) => ({
            ...record,
            year: parseInt(record.year),
            eweek: parseInt(record.eweek),
            number: parseInt(record.number) || 0,
          }));

          setFilteredData(processedRecords);
          setSelectedYear(year);
          setSelectedWeek(week);

          // No need to fetch chart data for week filtering since charts show yearly data (only fetch if no data)
          if (!chartData.dengue.length || !chartData.dhf.length) {
            const yearChartData = await fetchChartData(year);
            setChartData(yearChartData);
          }
        } else {
          throw new Error('Failed to fetch week data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error filtering by week:', err);
      } finally {
        setFiltering(false);
      }
    },
    [data, filterByYear, chartData.dengue.length, chartData.dhf.length]
  );

  // Clears all filters
  const clearFilters = useCallback(async () => {
    setFiltering(true);
    setSelectedYear(null);
    setSelectedWeek(null);
    setFilteredData(data); // Reset to original

    try {
      const charts = await fetchChartData();
      setChartData(charts);
    } catch (err) {
      console.error('Error reloading chart data:', err);
    } finally {
      setFiltering(false);
    }
  }, [data]);

  return {
    // Data
    data,
    filteredData,
    chartData,
    availableYears,

    // State
    loading,
    filtering,
    error,
    selectedYear,
    selectedWeek,

    // Actions
    filterByYear,
    filterByWeek,
    clearFilters,

    // Computed values (for DataSummary)
    totalRecords: filteredData.length,
    dengueCount: filteredData.filter((r) => r.type_dengue === 'Dengue').reduce((sum, r) => sum + (r.number || 0), 0),
    dhfCount: filteredData.filter((r) => r.type_dengue === 'DHF').reduce((sum, r) => sum + (r.number || 0), 0),
  };
};
