import { api } from "@/utils/axios";
import { RegisterFormData } from "@/types/auth";

export const authService = {
    register: async (userData: RegisterFormData) => {
        try {
            const { data } = await api.post("/auth/register", userData);
            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    login: async (credentials: { email: string; password: string }) => {
        try {
            const { data } = await api.post("/auth/login", credentials);
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
};