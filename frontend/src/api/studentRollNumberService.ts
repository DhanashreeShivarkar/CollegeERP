import axios from "./axios";

export const studentRollNumberService = {
  // Get students for a specific branch and academic year
  getStudents: (branchId: string, academicYear: string) =>
    axios.get(`/api/student/?branch_id=${branchId}&academic_year=${academicYear}`),

  // Get existing roll numbers for a specific branch and academic year
  getStudentRollNumbers: (branchId: string, academicYear: string) =>
    axios.get(`/api/master/rollnumbers/?branch_id=${branchId}&academic_year=${academicYear}`),

  // Save student roll number entries (bulk save)
  saveStudentRollNumbers: (data: any[]) =>
    axios.post("/api/master/rollnumbers/", data),
};

export default studentRollNumberService;
