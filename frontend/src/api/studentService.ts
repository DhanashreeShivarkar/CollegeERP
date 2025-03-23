import axiosInstance from './axios';
import { AxiosResponse, AxiosError } from 'axios';

interface StudentData {
  STUDENT_ID?: string;
  INSTITUTE_CODE: string;
  ACADEMIC_YEAR: string;
  BATCH: string;
  ADMISSION_CATEGORY: string;
  ADMISSION_QUOTA?: string;
  FORM_NO: number;
  NAME_ON_CERTIFICATE?: string;
  NAME: string;
  SURNAME: string;
  PARENT_NAME: string;
  MOTHER_NAME?: string;
  FATHER_NAME?: string;
  GENDER: string;
  DOB: string;
  DOB_WORD?: string;
  MOB_NO: string;
  EMAIL_ID: string;
  PER_ADDRESS?: string;
  LOC_ADDRESS?: string;
  PER_STATE_ID?: number;
  LOC_STATE_ID?: number;
  PER_PHONE_NO?: string;
  LOC_PHONE_NO?: string;
  PER_CITY?: string;
  LOC_CITY?: string;
  NATIONALITY?: string;
  BLOOD_GR?: string;
  CASTE?: string;
  BRANCH_ID: number;
  ENROLMENT_NO?: string;
  IS_ACTIVE?: string;
  HANDICAPPED?: string;
  MARK_ID?: string;
  ADMISSION_DATE?: string;
  QUOTA_ID?: number;
  PER_PIN?: string;
  LOC_PIN?: string;
  YEAR_SEM_ID?: number;
  DATE_LEAVING?: string;
  RELIGION?: string;
  BANK_NAME?: string;
  BANK_ACC_NO?: string;
  [key: string]: any;
}

// Create new student
export const saveStudentData = async (data: StudentData): Promise<AxiosResponse> => {
  try {
    const formattedData = {
      ...data,
      INSTITUTE: data.INSTITUTE_CODE,
      IS_ACTIVE: 'YES',  // Changed to match max_length=3
      STATUS: 'ACTIVE',
      JOINING_STATUS: 'JOINED',
      LATERAL_STATUS: 'NO',
      HANDICAPPED: 'NO',
      CASTE: 'GENERAL',
      MARK_ID: '0',
      YEAR_SEM_ID: 1,
      QUOTA_ID: 1,
      ADMN_ROUND: '1'
    };

    // Debug log
    console.log('Sending formatted data:', formattedData);
    
    const response = await axiosInstance.post('/api/student/', formattedData);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error response:', error.response?.data);
    }
    throw error;
  }
};

// Get all students with pagination and filters
export const getStudents = async (
  page: number = 1, 
  limit: number = 10,
  filters?: {
    batch?: string;
    branch?: string;
    academicYear?: string;
  }
) => {
  try {
    const response = await axiosInstance.get('/api/student/list/', {
      params: {
        page,
        limit,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single student by ID
export const getStudentById = async (studentId: string) => {
  try {
    const response = await axiosInstance.get(`/api/student/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student
export const updateStudent = async (studentId: string, data: Partial<StudentData>) => {
  try {
    const response = await axiosInstance.put(`/api/student/${studentId}/update/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete student (soft delete)
export const deleteStudent = async (studentId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/student/${studentId}/delete/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search students
export const searchStudents = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get('/api/student/search/', {
      params: { query: searchQuery }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student statistics
export const getStudentStats = async (filters?: {
  batch?: string;
  branch?: string;
  academicYear?: string;
}) => {
  try {
    const response = await axiosInstance.get('/api/student/stats/', {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

