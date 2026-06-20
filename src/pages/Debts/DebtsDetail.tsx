import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDebts } from "./debtsZustand";

export default function DebtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const debt = useDebts((state: any) => state.debt);
  const payments = useDebts((state: any) => state.payments);
  
  const getDebtsById = useDebts((state: any) => state.getDebtsById);
  const deleteDebt = useDebts((state: any) => state.deleteDebt);
  const updateDebts = useDebts((state: any) => state.updateDebts);
  
  const getPayments = useDebts((state: any) => state.getPayments);
  const postPayment = useDebts((state: any) => state.postPayment);

  useEffect(() => {
    if (id) {
      getDebtsById(id);
      getPayments(id);
    }
  }, [id, getDebtsById, getPayments]);

  if (!debt) {
    return <p>Loading...</p>;
  }

  const handleDelete = async () => {
    if (id && window.confirm("Are you sure you want to delete this debt?")) {
      await deleteDebt(id);
      navigate("/debts");
    }
  };

  const handleUpdateStatus = async () => {
    if (id) {
      await updateDebts(id, { ...debt, status: "paid" });
    }
  };

  const handleAddPayment = async () => {
    if (id) {
      const amountStr = prompt("Enter payment amount:");
      if (!amountStr) return;
      const amount = Number(amountStr);
      if (isNaN(amount)) return alert("Invalid amount");
      
      const note = prompt("Enter payment note:") || "";
      
      await postPayment(id, {
        amount,
        note,
        paid_at: new Date().toISOString()
      });
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2>Debt Details</h2>

      <p><b>Status:</b> {debt.status}</p>
      <p><b>Amount:</b> {debt.amount} {debt.currency}</p>
      <p><b>Due Date:</b> {debt.due_date}</p>
      {debt.description && <p><b>Description:</b> {debt.description}</p>}

      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <button onClick={handleUpdateStatus}>Mark as Paid</button>
        <button onClick={handleDelete} style={{ color: "red" }}>Delete Debt</button>
      </div>

      <hr />

      <h3 style={{ marginTop: "15px" }}>Payments</h3>
      <ul style={{ marginBottom: "15px" }}>
        {(!payments || payments.length === 0) && <p>No payments found.</p>}
        {payments?.map((payment: any) => (
          <li key={payment.id} style={{ marginBottom: "5px" }}>
            <b>{payment.amount}</b> - {payment.note} 
            <br/><small>Paid at: {new Date(payment.paid_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <button onClick={handleAddPayment}>Add Payment</button>
    </div>
  );
}