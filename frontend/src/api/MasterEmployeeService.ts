import axios from "./axios";

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
};

export default employeeService;
