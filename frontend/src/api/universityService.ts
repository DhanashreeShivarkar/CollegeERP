import axios from "./axios";

export const universityService = {
  getUniversities: () => axios.get("/api/master/universities/"),
  createUniversity: (data: any) =>
    axios.post("/api/master/universities/", data),
  updateUniversity: (id: number, data: any) =>
    axios.put(`/api/master/universities/${id}/`, data),
  deleteUniversity: (id: number) =>
    axios.delete(`/api/master/universities/${id}/`),
};

export default universityService;
