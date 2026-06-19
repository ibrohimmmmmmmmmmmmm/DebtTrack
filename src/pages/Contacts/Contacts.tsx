import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useContactsZustand from "./ContactsZustand";

export default function Contacts() {
  const { contacts, getContacts, postContacts } =
    useContactsZustand((state) => state);

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { id } = useParams(); // folder_id
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getContacts(id);
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    if (!id) return;

    const newContact = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      note: data.note,
      folder_id: id, // ✅ MUST be real uuid from route
    };

    await postContacts(newContact);

    reset();
    setOpen(false);
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between p-3">
        <p>Contacts</p>

        <button onClick={() => setOpen(true)}>+ Add contacts</button>
      </div>

      <dialog open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Name" {...register("name")} />
          <input placeholder="Email" {...register("email")} />
          <input placeholder="Phone" {...register("phone")} />
          <input placeholder="Note" {...register("note")} />

          <button type="submit">Add contact</button>
        </form>

        <button onClick={() => setOpen(false)}>Close</button>
      </dialog>

      <div>
        {contacts.map((contact: any) => (
          <div key={contact.id} className="border p-3 mb-2">
            <h1>{contact.name}</h1>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>

            <button
              onClick={() =>
                navigate(`/dashboard/contact/${contact.id}`)
              }
            >
              View more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}