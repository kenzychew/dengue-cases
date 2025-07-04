import axios from 'axios';

const DENGUE_DATASET_ID = 'd_ac1eecf0886ff0bceefbc51556247015';
const BASE_URL = 'https://data.gov.sg/api/action/datastore_search';

// Fetch all dengue data
export const fetchDengueData = async (limit = 1000) => {
  const url = `${BASE_URL}?resource_id=${DENGUE_DATASET_ID}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data;
};
