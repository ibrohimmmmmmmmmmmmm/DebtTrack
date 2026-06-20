import React, { useEffect, useState } from "react";
import { useDebts } from "./debtsZustand";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Debts() {
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
  const debts = useDebts((state) => state.debts);
  const getDebts = useDebts((state) => state.getDebts);
  const postDebts = useDebts((state) => state.postDebts);
  const {register,handleSubmit,reset}= useForm();
  const onSubmit = (data: any) => {
    const newDebt = {
      contact_id:data.contact_id,
      direction:data.direction,
      amount: Number(data.amount),
      currency:data.currency,
      description:data.description,
      due_date:data.due_date
    }
    postDebts(newDebt)
    reset()
    setOpen(false)
  };
  useEffect(() => {
    getDebts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between p-5">
        <p>Debts</p>
        <button onClick={() => setOpen(true)}>+ Add Debt</button>
        <dialog open={open}>
           <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Contact ID" {...register("contact_id")} />
      <select {...register("direction")}>
        <option value="they_owe_me">They owe me</option>
        <option value="i_owe_them">I owe them</option>
      </select>
      <input type="number" placeholder="Amount" {...register("amount")} />
      <input placeholder="Currency" {...register("currency")} />
      <input placeholder="Description" {...register("description")} />
      <input type="date" {...register("due_date")} />
      <button type="submit">Create Debt</button>
    </form>
          <button onClick={() => setOpen(false)}>Close</button>
        </dialog>
      </div>
      {debts?.map((debt) => (
        <div key={debt.id} className="border p-3 mb-3 w-fit">
          <p>{debt.description}</p>
          <p>{debt.amount} {debt.currency}</p>
          <p>{debt.status}</p>
          <p>{debt.direction}</p>
          <button onClick={() => navigate(`/dashboard/debt/${debt.id}`)}>View More</button>
        </div>
      ))}
    </div>
  );
}