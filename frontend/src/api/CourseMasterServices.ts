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
};

export default programService;
