import axios from "./axios";


export const branchService = {
  getBranches: () => axios.get("/api/master/branch/"),
  createBranch: (data: any) => axios.post("/api/master/branch/", data),
  updateBranch: (id: number, data: any) =>
    axios.put(`/api/master/branch/${id}/`, data),
  deleteBranch: (id: number) => axios.delete(`/api/master/branch/${id}/`),
};

export default branchService;
