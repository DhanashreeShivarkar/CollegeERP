import axiosInstance from './axios';

export const dashboardMasterService = {
    createDashboard: async (data: any) => {
        try {
            const response = await axiosInstance.post('/api/master/dashboard-master/', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getDashboards: async (instituteId?: string) => {
        try {
            const url = instituteId 
                ? `/api/master/dashboard-master/?institute_id=${instituteId}`
                : '/api/master/dashboard-master/';
            const response = await axiosInstance.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    }
};
