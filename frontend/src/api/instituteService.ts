import axios from "./axios";

export const instituteService = {
  getInstitutes: () => axios.get("/api/master/institutes/"),
  createInstitute: (data: any) => axios.post("/api/master/institutes/", data),
  updateInstitute: (id: number, data: any) =>
    axios.put(`/api/master/institutes/${id}/`, data),
  deleteInstitute: (id: number) =>
    axios.delete(`/api/master/institutes/${id}/`),
};

export default instituteService;
