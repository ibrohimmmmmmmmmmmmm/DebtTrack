import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDebts } from "./debtsZustand";

export default function DebtDetail() {
  const { id } = useParams();

  const debt = useDebts((state) => state.debt);
  const getDebtsById = useDebts((state) => state.getDebtsById);

  useEffect(() => {
    if (id) {
      getDebtsById(id);
    }
  }, [id]);

  if (!debt) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2>Debt Details</h2>

      <p><b>Status:</b> {debt.status}</p>
      <p><b>Amount:</b> {debt.amount} {debt.currency}</p>
      <p><b>Due Date:</b> {debt.due_date}</p>

      <button>Mark as Paid</button>
    </div>
  );
}