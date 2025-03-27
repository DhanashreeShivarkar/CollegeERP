// import axios from "./axios";

// export const instituteService = {
//   getInstitutes: () => axios.get("/api/master/institutes/"),
//   createInstitute: (data: any) => axios.post("/api/master/institutes/", data),
//   updateInstitute: (id: number, data: any) =>
//     axios.put(`/api/master/institutes/${id}/`, data),
//   deleteInstitute: (id: number) =>
//     axios.delete(`/api/master/institutes/${id}/`),
// };

// export default instituteService;



import axios from "./axios";

export const instituteService = {
  // getInstitutes: () => axios.get("/api/master/institutes/"),
  getInstitutes: (universityId?: string) => 
    axios.get(`/api/master/institutes/${universityId ? `?university_id=${universityId}` : ""}`),
  
  createInstitute: (data: any) => axios.post("/api/master/institutes/", data),
  updateInstitute: (id: number, data: any) =>
    axios.put(`/api/master/institutes/${id}/`, data),
  deleteInstitute: (id: number) =>
    axios.delete(`/api/master/institutes/${id}/`),
};

export default instituteService;