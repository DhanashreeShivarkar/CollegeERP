// src/api/studentReturnService.ts

import axios from './axios';

export const studentReturnService = {
  // Save return data (main POST request)
  submitStudentReturn: (payload: {
    STUDENT_ID: string;
    NAME: string;
    TEMPORARY_RETURN: boolean;
    PERMANENT_RETURN: boolean;
    DOCUMENTS: string[];
  }) => {
    return axios.post('/api/student-return', payload);
  },

  // Patch document submission with RETURN = 'Y'
  markDocumentReturned: (documentId: number, studentId: string) => {
    return axios.patch(`/api/master/document-submission/${documentId}/`, {
      RETURN: 'Y',
      STUDENT_ID: studentId,
    });
  },

  // Fetch documents submitted by student
  getSubmittedDocumentsByStudentId: (studentId: string) => {
    return axios.get(`/api/master/document-submission/?student_id=${studentId}`);
  },
};

export default studentReturnService;
