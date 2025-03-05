import axios from "./axios";

export const masterService = {
  // Countries
  getCountries: () => axios.get("/api/master/countries/"),
  createCountry: (data: any) => axios.post("/api/master/countries/", data),
  updateCountry: (id: number, data: any) =>
    axios.put(`/api/master/countries/${id}/`, data),
  deleteCountry: (id: number) => axios.delete(`/api/master/countries/${id}/`),

  // States
  getStates: () => axios.get("/api/master/states/"),
  createState: (data: any) => axios.post("/api/master/states/", data),
  updateState: (id: number, data: any) =>
    axios.put(`/api/master/states/${id}/`, data),
  deleteState: (id: number) => axios.delete(`/api/master/states/${id}/`),

  // Cities
  getCities: () => axios.get("/api/master/cities/"),
  createCity: (data: any) => axios.post("/api/master/cities/", data),
  updateCity: (id: number, data: any) =>
    axios.put(`/api/master/cities/${id}/`, data),
  deleteCity: (id: number) => axios.delete(`/api/master/cities/${id}/`),

  // Currencies
  getCurrencies: () => axios.get("/api/master/currencies/"),
  createCurrency: (data: any) => axios.post("/api/master/currencies/", data),
  updateCurrency: (id: number, data: any) =>
    axios.put(`/api/master/currencies/${id}/`, data),
  deleteCurrency: (id: number) => axios.delete(`/api/master/currencies/${id}/`),

  // Languages
  getLanguages: () => axios.get("/api/master/languages/"),
  createLanguage: (data: any) => axios.post("/api/master/languages/", data),
  updateLanguage: (id: number, data: any) =>
    axios.put(`/api/master/languages/${id}/`, data),
  deleteLanguage: (id: number) => axios.delete(`/api/master/languages/${id}/`),

  // Designations
  getDesignations: () => axios.get("/api/master/designations/"),
  createDesignation: (data: any) =>
    axios.post("/api/master/designations/", data),
  updateDesignation: (id: number, data: any) =>
    axios.put(`/api/master/designations/${id}/`, data),
  deleteDesignation: (id: number) =>
    axios.delete(`/api/master/designations/${id}/`),

  // Categories
  getCategories: () => axios.get("/api/master/categories/"),
  createCategory: (data: any) => axios.post("/api/master/categories/", data),
  updateCategory: (id: number, data: any) =>
    axios.put(`/api/master/categories/${id}/`, data),
  deleteCategory: (id: number) => axios.delete(`/api/master/categories/${id}/`),

  // Departments
  getDepartments: () => axios.get("/api/master/departments/"),
  createDepartment: (data: any) => axios.post("/api/master/departments/", data),
  updateDepartment: (id: number, data: any) =>
    axios.put(`/api/master/departments/${id}/`, data),
  deleteDepartment: (id: number) =>
    axios.delete(`/api/master/departments/${id}/`),
};

export default masterService;
