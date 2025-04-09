import axios from "./axios";


export const admissionService = {
    getChecklists: () => axios.get("/api/master/checklist/"),
    createChecklist: (data: any) => axios.post("/api/master/checklist/", data),
    updateChecklist: (id: number, data: any) =>
      axios.put(`/api/master/checklist/${id}/`, data),
    deleteChecklist: (id: number) => axios.delete(`/api/master/checklist/${id}/`),
    
};

export default admissionService;
