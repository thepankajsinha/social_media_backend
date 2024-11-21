import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// export const useUserStore = create((set, get) => ({}))

export const useUserStore = create((set, get) => ({
    user: null,
    isLoading: false,
    notifications: null,
	connectionRequests: null,
    recommendedUsers: [],
    checkingAuth: true,

    signup: async ({ name, email, username, password }) => {
        set({ isLoading: true });

        try {
            const res = await axiosInstance.post("/auth/signup", { name, email, username, password });
            set({ user: res.data, isLoading: false });
            toast.success("Account created successfully!");
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },


    login: async ({username, password}) => {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/login", { username, password });
            set({ user: res.data, loading: false });
            toast.success("Logged in successfully!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred during login");
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/me");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({checkingAuth: false, user: null });
            toast.error(error.response?.data?.message || "Session expired, please login again");
        }
    },

    getNotifications: async () => {
        try {
            if (user) {
                const response = await axiosInstance.get("/notifications");
                set({ notifications: response.data });
                console.log(response.data);
            } else {
                set({ notifications: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during fetching notifications");
            set({ notifications: null });
        }
    },

	getConnectionRequests: async () => {
        try {
            if (user) {
                const response = await axiosInstance.get("/connections/requests");
                set({ connectionRequests: response.data });
                console.log(response.data);
            } else {
                set({ connectionRequests: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during fetching connection request");
            set({ connectionRequests: null });
        }
    },


    getRecommendedUsers: async () => {
        try {
            if (user) {
                const response = await axiosInstance.get("/user/suggestions");
                set({ recommendedUsers: response.data });
            } else {
                set({ recommendedUsers: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during fetching recommended users");
            // set({ recommendedUsers: null });
        }
    },

}));
