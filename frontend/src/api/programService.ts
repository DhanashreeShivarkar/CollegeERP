import axios from "./axios";

export const programService = {
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
