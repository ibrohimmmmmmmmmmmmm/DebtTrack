import { create } from "zustand";
import { axiosRequest } from "../../utils/axios";

export const useDebts = create<any>((set: any) => ({
  debts: [],
  debt: null,
  payments: [],

  getDebts: async () => {
    try {
      const res = await axiosRequest.get("/debts");
      set({ debts: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  postDebts: async (debt: any) => {
    try {
      const res = await axiosRequest.post("/debts", debt);
      set((state : any) => ({
        debts: [res.data, ...state.debts],
      }));
    } catch (error) {
      console.error(error);
    }
  },

  getDebtsById: async (id: string) => {
    try {
      const res = await axiosRequest.get(`/debts/${id}`);
      set({ debt: res.data }); // ✅ FIXED
    } catch (error) {
      console.error(error);
      set({ debt: null });
    }
  },

  updateDebts: async (id: string, debt: any) => {
    try {
      const res = await axiosRequest.patch(`/debts/${id}`, debt);
      set((state: any) => ({
        debts: state.debts.map((d: any) =>
          d.id === id ? res.data : d
        ),
        debt: state.debt?.id === id ? res.data : state.debt,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteDebt: async (id: string) => {
    try {
      await axiosRequest.delete(`/debts/${id}`);
      set((state: any) => ({
        debts: state.debts.filter((d: any) => d.id !== id),
        debt: state.debt?.id === id ? null : state.debt,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  getPayments: async (id: string) => {
    try {
      const res = await axiosRequest.get(`/debts/${id}/payments`);
      set({ payments: res.data });
    } catch (error) {
      console.error(error);
      set({ payments: [] });
    }
  },

  postPayment: async (id: string, payment: any) => {
    try {
      const res = await axiosRequest.post(`/debts/${id}/payments`, payment);
      set((state: any) => ({
        payments: [...(state.payments || []), res.data],
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));