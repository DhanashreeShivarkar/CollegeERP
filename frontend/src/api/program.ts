import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Update as needed

// Fetch master tables (Program, Branch, Year, Semester, Course)
export const getProgramMasterTables = async () => {
  try {
    const response = await axios.get("http://localhost:8000/program-master/");
    console.log("Fetched Master Tables:", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error fetching master tables:", error);
    throw error;
  }
};

// Fetch data for a specific master table
export const getMasterTableData = async (tableName: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/master/${tableName}/`);
    console.log(`Fetched Data for ${tableName}:`, response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${tableName}:`, error);
    throw error;
  }
};
