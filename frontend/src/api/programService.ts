import axios from "./axios";

export const programService = {
  getUniversities: () => axios.get("/api/master/universities/"),
  getInstitutesByUniversity: (universityId: number) =>
    axios.get(`/api/master/institutes/?university=${universityId}`),
  getPrograms: () => axios.get("/api/master/course/"),
  createProgram: (data: any) => axios.post("/api/master/course/", data),
  updateProgram: (id: number, data: any) =>
    axios.put(`/api/master/course/${id}/`, data),
  deleteProgram: (id: number) =>
    axios.delete(`/api/master/course/${id}/`),
};

export default programService;
