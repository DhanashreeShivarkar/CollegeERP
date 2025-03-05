import axios from "./axios";

export const programService = {
  // Branch Services
  getBranches: () => axios.get("/api/master/branch/"),
  createBranch: (data: any) => axios.post("/api/master/branch/", data),
  updateBranch: (id: number, data: any) =>
    axios.put(`/api/master/branch/${id}/`, data),
  deleteBranch: (id: number) => axios.delete(`/api/master/branch/${id}/`),

  // Program Services
  getUniversities: () => axios.get("/api/master/universities/"),
  getInstitutesByUniversity: (universityId: number) =>
    axios.get(`/api/master/institutes/?university=${universityId}`),
  getPrograms: () => axios.get("/api/master/program/"),
  createProgram: (data: any) => axios.post("/api/master/program/", data),
  updateProgram: (id: number, data: any) =>
    axios.put(`/api/master/program/${id}/`, data),
  deleteProgram: (id: number) => axios.delete(`/api/master/program/${id}/`),


 
  // 🔹 Year Services (Merged from yearservices.ts)
  getYears: () => axios.get("/api/master/year/"),  // Fetch all years
  getYearsByBranch: (branchId: number) =>
    axios.get(`/api/master/year/?branch=${branchId}`), // Fetch years by branch
  createYear: (data: any) => axios.post("/api/master/year/", data),
  updateYear: (id: number, data: any) =>
    axios.put(`/api/master/year/${id}/`, data),
  deleteYear: (id: number) => axios.delete(`/api/master/year/${id}/`),


  getSemesters: () => axios.get("/api/master/semester/"), // Fetch all semesters
  getSemestersByYear: (yearId: number) =>
    axios.get(`/api/master/semester/?year_id=${yearId}`), // Fetch semesters by branch
  createSemester: (data: any) => axios.post("/api/master/semester/", data),
  updateSemester: (id: number, data: any) =>
    axios.put(`/api/master/semester/${id}/`, data),
  deleteSemester: (id: number) => axios.delete(`/api/master/semester/${id}/`),
  


};

export default programService;
