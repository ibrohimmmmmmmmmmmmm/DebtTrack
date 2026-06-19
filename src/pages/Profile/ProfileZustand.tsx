import { create } from 'zustand';
import { axiosRequest } from '../../utils/axios';

const useProfileStore = create((set) => ({
  profile: null,

  getProfile: async () => {
    const res = await axiosRequest.get('users/me');
    set({ profile: res.data });
  },

  updateProfile: async (profile: any) => {
    const res = await axiosRequest.patch('users/me', profile);
    set({ profile: res.data });
  },
}));

export default useProfileStore;