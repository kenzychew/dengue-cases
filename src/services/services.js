import axios from 'axios';

const DENGUE_DATASET_ID = 'd_ac1eecf0886ff0bceefbc51556247015';
const BASE_URL = 'https://data.gov.sg/api/action/datastore_search';

// Fetch all dengue data
export const fetchDengueData = async (limit = 1000) => {
  const url = `${BASE_URL}?resource_id=${DENGUE_DATASET_ID}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data;
};

// By year
export const fetchDengueDataByYear = async (year) => {
  const filters = JSON.stringify({ year: year.toString() });
  const url = `${BASE_URL}?resource_id=${DENGUE_DATASET_ID}&filters=${encodeURIComponent(filters)}&limit=200`;
  const res = await axios.get(url);
  return res.data;
};

// By week
export const fetchDengueDataByWeek = async (year, week) => {
  const filters = JSON.stringify({
    year: year.toString(),
    eweek: week.toString(),
  });
  const url = `${BASE_URL}?resource_id=${DENGUE_DATASET_ID}&filters=${encodeURIComponent(filters)}`;
  const res = await axios.get(url);
  return res.data;
};

// Get chart data - separate dengueData vs dhfData for 2 charts
export const fetchChartData = async (year = null) => {
  try {
    const data = year ? await fetchDengueDataByYear(year) : await fetchDengueData();

    if (!data.success) return { dengue: [], dhf: [] };

    const records = data.result.records;

    // dengueData and dhfData with proper type conversion
    const dengueData = records
      .filter((r) => r.type_dengue === 'Dengue')
      .map((r) => ({
        year: parseInt(r.year),
        week: parseInt(r.eweek),
        cases: parseInt(r.number) || 0,
        date: `${r.year}-W${String(r.eweek).padStart(2, '0')}`,
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);

    const dhfData = records
      .filter((r) => r.type_dengue === 'DHF')
      .map((r) => ({
        year: parseInt(r.year),
        week: parseInt(r.eweek),
        cases: parseInt(r.number) || 0,
        date: `${r.year}-W${String(r.eweek).padStart(2, '0')}`,
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);

    return { dengue: dengueData, dhf: dhfData };
  } catch (error) {
    console.error('fetchChartData error:', error);
    return { dengue: [], dhf: [] };
  }
};

// Get available years (as nums)
export const fetchAvailableYears = async () => {
  try {
    const data = await fetchDengueData();
    if (!data.success) return [2014, 2015, 2016, 2017, 2018];

    const years = [...new Set(data.result.records.map((r) => parseInt(r.year)))].sort((a, b) => a - b);

    return years;
  } catch (error) {
    console.error('fetchAvailableYears error:', error);
    return [2014, 2015, 2016, 2017, 2018];
  }
};
