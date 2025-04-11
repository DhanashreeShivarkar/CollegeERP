// src/api/studentDocumentService.ts

import axios from './axios';

export const studentDocumentService = {
  submitStudentDocuments: (payload: {
    student_id: string;
    document_ids: number[];
  }) => {
    return axios.post('/api/master/document-submission/', payload);
  },
};

export default studentDocumentService;
