import { useState } from 'react';
import { Modal, TextField, Button, Select, MenuItem } from '@mui/material';

const AddPaymentModal = ({ open, onClose, onSave, paymentMethods }) => {
    const [paymentData, setPaymentData] = useState({ amount: '', date: '', paymentMethod: '' });
  
    const handleInputChange = (e) => {
      setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = () => {
      onSave(paymentData);
      onClose();
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        {/* Modal Content */}
        <TextField name="amount" value={paymentData.amount} onChange={handleInputChange} />
        <TextField name="date" type="date" value={paymentData.date} onChange={handleInputChange} />
        <Select name="paymentMethod" value={paymentData.paymentMethod} onChange={handleInputChange}>
          {paymentMethods.map((method) => (
            <MenuItem key={method.id} value={method.id}>{method.attributes.name}</MenuItem>
          ))}
        </Select>
        <Button onClick={handleSubmit}>Add Payment</Button>
      </Modal>
    );
  };
  
export default AddPaymentModal;