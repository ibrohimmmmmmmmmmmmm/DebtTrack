import { create } from "zustand";
import { axiosRequest } from "../../utils/axios";

export const useDebts = create((set, get) => ({
  debts: [],
  debt: null,

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
      set((state) => ({
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
      set((state) => ({
        debts: state.debts.map((d: any) =>
          d.id === id ? res.data : d
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteDebt: async (id: string) => {
    try {
      await axiosRequest.delete(`/debts/${id}`);
      set((state) => ({
        debts: state.debts.filter((d: any) => d.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));