import { create } from "zustand";
import { axiosRequest } from "../../utils/axios";

const useContactsZustand = create((set, get) => ({
  contacts: [],
  getContacts: async (folderId: string) => {
    const res = await axiosRequest.get("/contacts", {
      params: { folder_id: folderId },
    });
    set({ contacts: res.data });
  },

 postContacts: async (contact: any) => {
  try {
    console.log("POSTING:", contact);
    const res = await axiosRequest.post("/contacts", contact);
    console.log("RESPONSE:", res.data);
    set((state) => ({
      contacts: [...state.contacts, res.data],
    }));
  } catch (error) {
    console.log("POST ERROR:", error);
  }
},

  updateContacts: async (contact: any) => {
    if (!contact?.id) return;
    const res = await axiosRequest.patch(
      `/contacts/${contact.id}`,contact
    );
    set((state) => ({
      contacts: state.contacts.map((c: any) =>
        c.id === contact.id ? res.data : c
      ),
    }));
  },

  deleteContacts: async (id: string) => {
    if (!id) return;
    await axiosRequest.delete(`/contacts/${id}`);
    set((state) => ({
      contacts: state.contacts.filter((c: any) => c.id !== id),
    }));
  },
}));

export default useContactsZustand;