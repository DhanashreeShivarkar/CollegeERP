import axios from "../utils/axios";
interface StudentData {
    "ACADEMIC_YEAR": "2024-25",
    "STATUS": "Active",
    "INSTITUTE": "INST001",
    "BRANCH_ID": 101,
    "ADMISSION_CATEGORY": "General",
    "ADMN_QUOTA_ID": 2,
    "BATCH": "2024",
    "FORM_NO": 123,
    "NAME": "John",
    "FATHER_NAME": "Doe",
    "SURNAME": "Smith",
    "NAME_ON_CERTIFICATE": "John Smith",
    "EMAIL_ID": "john@example.com",
    "GENDER": "male",
    "DOB": "2000-01-01",
    "MOB_NO": "9876543210"
    [key: string]: any; // Add this for flexibility with additional fields
  }

const API_URL = "http://localhost:8000/api";

// Save student data
export const saveStudentData = async (studentData: StudentData): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/student/StudentMaster/`, studentData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(), // If CSRF token is required
        },
      });
      return response.data; // Return response data if successful
    } catch (error: any) {
      console.error("Error saving student data:", error.response?.data || error.message);
      throw error; // Propagate error for handling in calling function
    }
  };

  // Fetch student data
export const getStudentData = async (studentId: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/student/StudentMaster/${studentId}/`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching student data:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // CSRF Token Helper (for Django)
  const getCSRFToken = (): string | undefined => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };