// src/api/studentDocumentService.ts

import axios from './axios';

export const studentDocumentService = {
  // Corrected endpoint
  submitStudentDocuments: (payload: {
    student_id: string;
    document_ids: number[];
  }) => axios.post('/api/master/document-submission/', payload),
};

export default studentDocumentService;
