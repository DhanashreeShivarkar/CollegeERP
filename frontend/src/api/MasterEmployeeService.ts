import axios from "./axios";

const API_URL = "http://localhost:8000/api";

export const employeeService = {
  createEmployee: async (formData: FormData) => {
    try {
      // Log form data for debugging (excluding file content)
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await axios.post(
        "/api/establishment/employees/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          transformRequest: [
            function (data) {
              return data; // Return FormData as-is
            },
          ],
          responseType: "json",
        }
      );

      return response;
    } catch (error: any) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  updateEmployee: async (employeeId: string, formData: FormData) => {
    try {
      const response = await axios.patch(
        // Changed from put to patch
        `/api/establishment/employees/${employeeId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          transformRequest: [
            function (data) {
              return data;
            },
          ],
          responseType: "json",
        }
      );
      return response;
    } catch (error: any) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  searchEmployees: (query: string) => {
    return axios.get(`${API_URL}/establishment/employees/search/`, {
      params: { query },
    });
  },

  getEmployee: (employeeId: string) => {
    return axios.get(`${API_URL}/establishment/employees/${employeeId}/`);
  },
};

export default employeeService;
