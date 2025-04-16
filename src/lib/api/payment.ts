import { api } from "@/utils/axios";

export const paymentService = {
  // Lấy danh sách payment
  // src/lib/api/payment.ts
  getPaymentList: async (params?: Record<string, unknown>) => {
    try {
      const { data } = await api.get("/admin/payments", { params });
      return data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  },

  // Tạo payment mới
  createPayment: async (paymentData: unknown) => {
    try {
      const { data } = await api.post("/payments", paymentData);
      return data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },

  // Xóa payment
  deletePayment: async (id: string) => {
    try {
      const { data } = await api.delete(`/payments/${id}`);
      return data;
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw error;
    }
  },

  // (Tùy chọn) Lấy chi tiết payment
  getPaymentDetail: async (id: string) => {
    try {
      const { data } = await api.get(`/payments/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching payment detail:", error);
      throw error;
    }
  },
};
