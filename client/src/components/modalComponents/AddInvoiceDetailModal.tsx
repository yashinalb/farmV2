import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, Select, MenuItem } from '@mui/material';
interface AddInvoiceDetailModalProps {
    open: boolean;
    onClose: () => void;
    products: Product[];
    productQuantityTypes: ProductQuantityType[];
    paymentStatuses: PaymentStatus[];
}

interface ProductQuantityType {
    id: string;
    name: string;
    // Add other fields if necessary
}

interface PaymentStatus {
    id: string;
    name: string;
    // Add other fields if necessary
}
const AddInvoiceDetailModal: React.FC<AddInvoiceDetailModalProps> = ({ open, onClose, products, productQuantityTypes, paymentStatuses }) => {
    const [formData, setFormData] = useState({
        productName: '',
        quantity: 0,
        pricePerUnit: 0,
        kdv: 0,
        stopaj: 0,
        komisyon: 0,
        productQuantityTypes: '',
        paymentStatus: '',
        // Add other fields as necessary
    });

    const handleInvoiceDetailChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleInvoiceDetailSubmit = () => {
        // Handle form submission logic here
        console.log(formData);
        onClose(); // Close the modal after submission
    };
    const selectedProduct = products.find(product => product.name === formData.productName);
    return (
        <Modal open={open} onClose={onClose}>
            <Box p={2} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
                <Typography variant="h6">Add Invoice Detail</Typography>
                <FormControl fullWidth margin="normal">
                    <Select
                        value={formData.productName}
                        onChange={handleInvoiceDetailChange}
                        name="productName"
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>Select a Product</em>
                        </MenuItem>
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.name}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Quantity" name="quantity" value={formData.quantity} onChange={handleInvoiceDetailChange} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Price Per Unit" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleInvoiceDetailChange} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="KDV" name="kdv" value={formData.kdv} onChange={handleInvoiceDetailChange} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Stopaj" name="stopaj" value={formData.stopaj} onChange={handleInvoiceDetailChange} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Komisyon" name="komisyon" value={formData.komisyon} onChange={handleInvoiceDetailChange} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        select
                        label="Product Quantity Type"
                        name="productQuantityTypes"
                        value={formData.productQuantityTypes}
                        onChange={handleInvoiceDetailChange}
                        disabled={!selectedProduct} // Disable if no product is selected
                    >
                        {selectedProduct?.quantityTypes.map((type) => (
                            <MenuItem key={type.id} value={type.name}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        select
                        label="Payment Status"
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleInvoiceDetailChange}
                    >
                        {paymentStatuses.map((status) => (
                            <MenuItem key={status.id} value={status.name}>
                                {status.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
                {/* Add other input fields as necessary */}
                <Button variant="contained" color="primary" onClick={handleInvoiceDetailSubmit}>
                    Add Detail
                </Button>
            </Box>
        </Modal>
    );
}

export default AddInvoiceDetailModal;
