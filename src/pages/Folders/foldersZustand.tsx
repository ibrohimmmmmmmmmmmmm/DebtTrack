import { create } from 'zustand';
import { axiosRequest } from '../../utils/axios';

export interface Folder {
  id: string;
  name: string;
}

interface FolderStore {
  folders: Folder[];

  getFolders: () => Promise<void>;

  postFolder: (folder: Omit<Folder, 'id'>) => Promise<void>;

  updateFolder: (folder: Folder) => Promise<void>;

  deleteFolder: (id: string) => Promise<void>;
}

const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],

  getFolders: async () => {
    const res = await axiosRequest.get<Folder[]>('folders');

    set({
      folders: res.data,
    });
  },

  postFolder: async (folder) => {
    const res = await axiosRequest.post<Folder>('folders', folder);

    set({
      folders: [...get().folders, res.data],
    });
  },

  updateFolder: async (folder) => {
    const res = await axiosRequest.patch<Folder>(
      `folders/${folder.id}`,
      folder
    );

    set({
      folders: get().folders.map((f) =>
        f.id === folder.id ? res.data : f
      ),
    });
  },

  deleteFolder: async (id) => {
    await axiosRequest.delete(`folders/${id}`);

    set({
      folders: get().folders.filter((f) => f.id !== id),
    });
  },
}));

export default useFolderStore;