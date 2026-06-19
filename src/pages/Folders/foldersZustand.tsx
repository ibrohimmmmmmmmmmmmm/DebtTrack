import { create } from 'zustand';
import { axiosRequest } from '../../utils/axios';

const useFolderStore = create((set, get) => ({
  folders: [],

  getFolders: async () => {
    const res = await axiosRequest.get('folders');
    set({ folders: res.data });
  },

  postFolder: async (folder: any) => {
    const res = await axiosRequest.post('folders', folder);
    set({ folders: [...get().folders, res.data] });
  },

  updateFolder: async (folder: any) => {
    const res = await axiosRequest.patch(
      `folders/${folder.id}`,
      folder
    );

    set({
      folders: get().folders.map((f: any) =>
        f.id === folder.id ? res.data : f
      ),
    });
  },

  deleteFolder: async (id: string) => {
    await axiosRequest.delete(`folders/${id}`);

    set({
      folders: get().folders.filter((f: any) => f.id !== id),
    });
  },
}));

export default useFolderStore;