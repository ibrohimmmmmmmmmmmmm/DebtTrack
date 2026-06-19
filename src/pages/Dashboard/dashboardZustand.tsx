import { create } from "zustand";
import { axiosRequest } from "../../utils/axios";

const useDashboard = create((set) => ({
    dashboard : null,
    getDashboard : async() => {
        const res = await axiosRequest.get("/dashboard/summary")
        set({dashboard:res.data})
    }
}))

export default useDashboard