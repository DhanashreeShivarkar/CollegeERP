
import axiosInstance from "./axios";

export const markDocumentsReturned = async (studentId: string, documentIds: string[]) => {
  try {
    const response = await axiosInstance.put('/student/return-documents/', {
      student_id: studentId,
      document_ids: documentIds,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error marking documents as returned:", error);
    throw error;
  }
};


