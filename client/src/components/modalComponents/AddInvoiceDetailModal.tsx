import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { createInvoiceDetail } from '../../services/apiService';
interface AddInvoiceDetailModalProps {
    open: boolean;
    onClose: () => void;
    products: Product[];
    productQuantityTypes: ProductQuantityType[];
    paymentStatuses: PaymentStatus[];
    selectedInvoiceDetailId: string; // Add this line
    fetchAndUpdateInvoices: () => void;  
    selectedBuyerData?: {
        kdv: number;
        stopaj: number;
        komisyon: number;
      };
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
const AddInvoiceDetailModal: React.FC<AddInvoiceDetailModalProps> = ({ open, onClose, products, productQuantityTypes, paymentStatuses, selectedInvoiceDetailId, selectedBuyerData, fetchAndUpdateInvoices }) => {
    const [formData, setFormData] = useState({
        productId: '', // Changed from productName to productId
        quantity: 0,
        pricePerUnit: 0,
        kdv: selectedBuyerData || 0,
        stopaj: selectedBuyerData || 0,
        komisyon: selectedBuyerData || 0,
        productQuantityTypeId: '', // Changed to store ID
        paymentStatusId: '', // Changed to store ID
    });

    useEffect(() => {
        if (selectedBuyerData) {
            setFormData(prevFormData => ({
                ...prevFormData,
                kdv: selectedBuyerData.kdv || 0,
                stopaj: selectedBuyerData.stopaj || 0,
                komisyon: selectedBuyerData.komisyon || 0
            }));
        }
    }, [selectedBuyerData]);


    const handleInvoiceDetailChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleInvoiceDetailSubmit = () => {
        console.log(formData);
        // Prepare data for API call
        const invoiceDetailData = {
            data: {
                product: formData.productId,
                quantity: Number(formData.quantity),
                price_per_unit: Number(formData.pricePerUnit),
                kdv: Number(formData.kdv),
                stopaj: Number(formData.stopaj),
                komisyon: Number(formData.komisyon),
                product_quantity_type: formData.productQuantityTypeId,
                payment_status: formData.paymentStatusId,
                invoice: selectedInvoiceDetailId,
            }
        };

        console.log('Invoice detail data:', invoiceDetailData);
        console.log('Invoice id data:', selectedInvoiceDetailId);

        // API call to add invoice detail
        createInvoiceDetail(invoiceDetailData).then(response => {
            console.log('Invoice detail added:', response);
            onClose();
  fetchAndUpdateInvoices(); // Refresh the invoice list
            // Refresh or update the data to show the new invoice detail
            // onFetchAndUpdate(); // If you have such a function
        }).catch(error => {
            console.error('Error response:', error.response);
            console.error('Error adding invoice detail:', error);
        });
    };

    const selectedProduct = products.find(product => product.id === formData.productId);
    return (
        <Modal open={open} onClose={onClose}>
            <Box p={2} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
                <Typography variant="h6">Add Invoice Detail</Typography>
                <FormControl fullWidth margin="normal">
                    <Select
                        value={formData.productId}
                        onChange={handleInvoiceDetailChange}
                        name="productId"
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>Select a Product</em>
                        </MenuItem>
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
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
                    <Select
                        value={formData.productQuantityTypeId}
                        onChange={handleInvoiceDetailChange}
                        name="productQuantityTypeId"
                        disabled={!selectedProduct}
                    >
                        {selectedProduct?.quantityTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Select
                        value={formData.paymentStatusId}
                        onChange={handleInvoiceDetailChange}
                        name="paymentStatusId"
                    >
                        {paymentStatuses.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                                {status.name}
                            </MenuItem>
                        ))}
                    </Select>
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
