// EditInvoiceModal.js
import React, { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';

const EditInvoiceModal = ({ payment, onClose, onSave }) => {
  const [editedPayment, setEditedPayment] = useState(payment);

  const handleInputChange = (e) => {
    setEditedPayment({ ...editedPayment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Make PUT request to Strapi API
    // You will need to create a function in apiService for this
    updatePayment(editedPayment.id, editedPayment).then(() => {
      onSave(); // Update the list
      onClose(); // Close the modal
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div>
        {/* Form fields for editing payment */}
        <TextField
          label="Amount"
          name="amount"
          value={editedPayment.amount}
          onChange={handleInputChange}
        />
        {/* Add other fields as necessary */}
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default EditInvoiceModal;
