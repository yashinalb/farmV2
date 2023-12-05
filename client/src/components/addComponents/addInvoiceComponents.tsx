import { useState, useEffect } from 'react';
import { fetchActiveBuyers, fetchActiveProducts, createInvoice, createInvoiceDetail, fetchProductQuantityTypes, fetchPaymentStatus, createPayment, fetchPaymentMethods } from '../../services/apiService';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const AddInvoiceComponents = ({ onFormSubmit }) => {
    const [buyers, setBuyers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedBuyerKdv, setSelectedBuyerKdv] = useState('');
    const [selectedBuyerStopaj, setSelectedBuyerStopaj] = useState('');
    const [selectedBuyerKomisyon, setSelectedBuyerKomisyon] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<{ productId: string, quantity: number, quantityTypeId: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [showForm, setShowForm] = useState(false);
    const [productQuantityTypes, setProductQuantityTypes] = useState({});
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const defaultPaymentStatus = '2';
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(defaultPaymentStatus);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [payments, setPayments] = useState([]);


    useEffect(() => {
        fetchActiveBuyers()
            .then((response) => {
                const fetchedBuyers = response.data.data;
                setBuyers(fetchedBuyers);
            })
            .catch((error) => {
                console.error('Error fetching buyers:', error);
            });

        fetchActiveProducts()
            .then((response) => {
                setProducts(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });

        fetchPaymentStatus()
            .then((response) => {
                const fetchedPaymentStatuses = response.data.data;
                setPaymentStatuses(fetchedPaymentStatuses);
            })
            .catch((error) => {
                console.error('Error fetching payment statuses:', error);
            });

        fetchPaymentMethods()
            .then((response) => {
                setPaymentMethods(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching payment methods:', error);
            });

    }, []);

    // Modify setSelectedBuyer to also set selectedBuyerKdv
    const handleBuyerChange = (e) => {
        const buyerId = e.target.value;
        setSelectedBuyer(buyerId);

        const buyerKdv = Number(buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.kdv);
        const buyerStopaj = Number(buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.stopaj);
        const buyerKomisyon = Number(buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.komisyon);
        setSelectedBuyerKdv(buyerKdv || 0);
        setSelectedBuyerStopaj(buyerStopaj || 0);
        setSelectedBuyerKomisyon(buyerKomisyon || 0);
        const updatedProducts = selectedProducts.map(product => ({
            ...product,
            kdv: buyerKdv || 0,
            stopaj: buyerStopaj || 0,
            komisyon: buyerKomisyon || 0
        }));
        setSelectedProducts(updatedProducts);
    };

    const handlePaymentStatusChange = (e) => {
        const selectedStatusId = e.target.value; // Declare the variable here
        setSelectedPaymentStatus(selectedStatusId);

        // Assuming '1' is the ID for 'Ödendi' (Fully Paid)
        // and '3' is for a status like 'Partially Paid'
        const isPaidStatus = selectedStatusId === '1' || selectedStatusId === '3';
        setIsPaid(isPaidStatus);
        if (isPaidStatus && payments.length === 0) {
            addPayment();
        }
    };

    const handleIndividualKdvChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, kdv: value !== '' ? Number(value) : 0 } : product
        );
        setSelectedProducts(updatedProducts);
    };

    const handleIndividualStopajChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, stopaj: value !== '' ? Number(value) : 0 } : product
        );
        setSelectedProducts(updatedProducts);
    };

    const handleIndividualKomisyonChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, komisyon: value !== '' ? Number(value) : 0 } : product
        );
        setSelectedProducts(updatedProducts);
    };


    const addProductSelection = () => {
        setShowForm(true);
        setSelectedProducts([...selectedProducts, {
            payment_status: defaultPaymentStatus,
            productId: '',
            quantity: 0,
            quantityTypeId: '',
            pricePerUnit: '',
            kdv: selectedBuyerKdv,
            stopaj: selectedBuyerStopaj,
            komisyon: selectedBuyerKomisyon,
        }]);
    };

    const removeProductSelection = (index) => {
        const updatedProducts = selectedProducts.filter((_, idx) => idx !== index);
        setSelectedProducts(updatedProducts);
    };

    const handlePricePerUnitChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, pricePerUnit: isPaid ? Number(value) : 0 } : product
        );
        setSelectedProducts(updatedProducts);
    };


    const handleQuantityTypeChange = (index, quantityTypeId) => {
        const updatedProducts = selectedProducts.map((sp, idx) =>
            idx === index ? { ...sp, quantityTypeId: quantityTypeId } : sp
        );
        setSelectedProducts(updatedProducts);
    };

    const handleProductChange = (index, productId) => {

        if (productId) {
            fetchProductQuantityTypes(productId)
                .then(response => {
                    if (response.data && response.data.data && response.data.data.attributes && response.data.data.attributes.product_quantity_types) {
                        const quantityTypes = response.data.data.attributes.product_quantity_types.data;

                        // If there is only one quantity type, automatically select it
                        let quantityTypeId = '';
                        if (quantityTypes.length === 1) {
                            quantityTypeId = quantityTypes[0].id;
                        }

                        // Update state for product quantity types
                        setProductQuantityTypes(prev => ({ ...prev, [productId]: quantityTypes }));

                        // Update state for selected products including the quantity type ID
                        const updatedProducts = selectedProducts.map((sp, idx) =>
                            idx === index ? { ...sp, productId: productId, quantityTypeId: quantityTypeId } : sp
                        );
                        setSelectedProducts(updatedProducts);
                    }
                })
                .catch(error => console.error('Error fetching quantity types:', error));
        } else {
            // Handle the case when no product is selected (resetting the product and quantity type)
            const updatedProducts = selectedProducts.map((sp, idx) =>
                idx === index ? { ...sp, productId: '', quantityTypeId: '' } : sp
            );
            setSelectedProducts(updatedProducts);
            console.log("Updated Selected Products State:", selectedProducts);
        }
    };

    const handleQuantityChange = (index: number, value: string) => {
        const quantity = value.replace(/^0+|[^0-9]/g, '');

        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts[index].quantity = quantity === '' ? 0 : parseInt(quantity, 10);
        setSelectedProducts(newSelectedProducts);
    };

    const addPayment = () => {
        setPayments([...payments, { amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: '' }]);
    };
    const removePayment = (index) => {
        setPayments(payments.filter((_, idx) => idx !== index));
    };


    const handlePaymentChange = (index, field, value) => {
        const updatedPayments = [...payments];
        updatedPayments[index] = {
            ...updatedPayments[index],
            [field]: value
        };
        setPayments(updatedPayments);
    };

    const submitInvoice = () => {
        setSubmitting(true);

        const isQuantityInvalid = selectedProducts.some(product => product.quantity <= 0);
        if (isQuantityInvalid) {
            alert("Please enter a valid quantity for all products.");
            setSubmitting(false);
            return;
        }

        const isQuantityTypeMissing = selectedProducts.some(product => !product.quantityTypeId);
        if (isQuantityTypeMissing) {
            alert("Please select a quantity type for all products.");
            setSubmitting(false);
            return;
        }

        const isPricePerUnitRequired = selectedPaymentStatus === '1';
        const isPricePerUnitEmpty = selectedProducts.some(product => isPricePerUnitRequired && (!product.pricePerUnit || product.pricePerUnit === ''));
        if (isPricePerUnitEmpty) {
            alert("Please enter 'Price per unit' for all products.");
            setSubmitting(false);
            return;
        }

        if (selectedProducts.length === 0) {
            alert("No invoice details to submit.");
            setSubmitting(false);
            return;
        }

        if (!selectedBuyer) {
            alert("Please select a buyer.");
            return;
        }

        const totalAmount = selectedProducts.reduce((acc, curr) => {
            const pricePerUnit = curr.pricePerUnit ? Number(curr.pricePerUnit) : 0;
            const quantity = Number(curr.quantity);

            // Calculate amounts
            const basePrice = pricePerUnit * quantity;
            const kdvAmount = basePrice * (Number(curr.kdv) / 100);
            const stopajAmount = basePrice * (Number(curr.stopaj) / 100);
            const komisyonAmount = basePrice * (Number(curr.komisyon) / 100);

            // Total amount for current product
            const totalForCurrentProduct = basePrice + kdvAmount - stopajAmount - komisyonAmount;

            // Accumulate total
            return acc + totalForCurrentProduct;
        }, 0);


        createInvoice({
            data: {
                buyers_info: selectedBuyer,
                date: invoiceDate, // This is the selected date
                total_amount: totalAmount,
            }
        })
            .then((invoiceResponse) => {
                const invoiceId = invoiceResponse.data.data.id; // Newly created invoice ID

                const detailPromises = selectedProducts.map((selectedProduct) => {
                    /*   const pricePerUnit = isPaid && selectedProduct.pricePerUnit ? selectedProduct.pricePerUnit : products.find(p => p.id.toString() === selectedProduct.productId).attributes.price;*/
                    const pricePerUnit = isPaid && selectedProduct.pricePerUnit ? Number(selectedProduct.pricePerUnit) : products.find(p => p.id.toString() === selectedProduct.productId).attributes.price;

                    return createInvoiceDetail({
                        data: {
                            invoice: invoiceId,
                            product: selectedProduct.productId,
                            quantity: selectedProduct.quantity,
                            price_per_unit: pricePerUnit, // Use the dynamically determined price per unit here
                            kdv: parseFloat(selectedProduct.kdv),
                            stopaj: parseFloat(selectedProduct.stopaj),
                            komisyon: parseFloat(selectedProduct.komisyon),
                            payment_status: selectedPaymentStatus,
                            product_quantity_type: selectedProduct.quantityTypeId,
                        }
                    });
                });
                // Create payments if the invoice is paid or partially paid
                const paymentPromises = isPaid ? payments.map((payment) => {
                    if (!payment.amount || !payment.paymentMethod) {
                        throw new Error('Payment details are not complete.');
                    }
                    return createPayment({
                        data: {
                            amount: payment.amount,
                            date: payment.date,
                            payment_method: payment.paymentMethod,
                            invoice: invoiceId
                        }
                    });
                }) : [];
                return Promise.all([...detailPromises, ...paymentPromises]);
            })
            .then(() => {
                // After successful submission and handling of details
                onFormSubmit(); // Refresh the invoices list
            })
            .catch((error) => {
                setSubmitting(false);
                console.error("Error creating invoice detail:", error.response.data);
                alert("Error creating invoice and details.");
            })
            .finally(() => {
                onFormSubmit(); // Refresh the invoices list
                setSubmitting(false);
                alert("Invoice and details submitted successfully."); // Using alert for success feedback
                setShowForm(false); // Hide the form after submission
                setSelectedProducts([]); // Reset the products
                setSelectedBuyer(''); // Reset the buyers
                setSelectedBuyerKdv('');
                setSelectedBuyerStopaj('');
                setSelectedBuyerKomisyon('');
                setSelectedPaymentStatus(defaultPaymentStatus);
                setIsPaid(false);
                setSubmitting(false);
            });
    };
    return (
        <div>
            <Typography variant="h4" gutterBottom>Create Invoice</Typography>
            {!showForm && (
                <Button variant="contained" color="primary" onClick={addProductSelection}>
                    Add Product
                </Button>
            )}


            {showForm && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4}>
                            <TextField
                                label="Invocie Date"
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                    style: { color: '#fff' } // Adjust the label color
                                }}
                                InputProps={{
                                    style: { color: '#fff' } // Adjust the input text color
                                }}

                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#fff', // default
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#fff', // hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#fff', // focused
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <select onChange={handleBuyerChange} value={selectedBuyer}
                                className='invoice_select_buyer'>
                                <option value="">Select buyer</option> {/* This will be shown by default */}
                                {buyers.map((buyer) => (
                                    <option key={buyer.id} value={buyer.id}>{buyer.attributes.name}</option>
                                ))}
                            </select>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <RadioGroup row aria-label="paymentStatus" name="paymentStatus" value={selectedPaymentStatus} onChange={handlePaymentStatusChange}>
                                {paymentStatuses.map((status) => (
                                    <FormControlLabel key={status.id} value={status.id} control={<Radio />} label={status.attributes.name} />
                                ))}
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {isPaid && payments.map((payment, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={12} lg={3}>
                                <TextField
                                    label="Payment Amount"
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        style: { color: '#fff' } // Adjust the label color
                                    }}
                                    InputProps={{
                                        style: { color: '#fff' } // Adjust the input text color
                                    }}

                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#fff', // default
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#fff', // hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff', // focused
                                            },
                                        },
                                        margin: 1
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <TextField
                                    label="Payment Date"
                                    type="date"
                                    value={payment.date}
                                    onChange={(e) => handlePaymentChange(index, 'date', e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        style: { color: '#fff' } // Adjust the label color
                                    }}
                                    InputProps={{
                                        style: { color: '#fff' } // Adjust the input text color
                                    }}
    
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#fff', // default
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#fff', // hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff', // focused
                                            },
                                        },
                                        margin: 1
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <FormControl fullWidth>
                                <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#fff' }, }}>Select Payment Method</InputLabel>
                                    <Select
                                        value={payment.paymentMethod}
                                        onChange={(e) => handlePaymentChange(index, 'paymentMethod', e.target.value)} 
                                        sx={{
                                            color: '#fff',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#fff'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            margin: 1
                                        }}
                                    >
                                    <MenuItem value="">
                                        <em>Select Method Type</em>
                                    </MenuItem>
                                        {paymentMethods.map((method) => (
                                            <MenuItem key={method.id} value={method.id}>{method.attributes.name}</MenuItem>
                                        ))}
                                        
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} lg={1}>
                                {payments.length > 1 && (
                                    <Button type="button" onClick={() => removePayment(index)} variant="contained" color="secondary" sx={{ margin: 2 }}>
                                        -
                                    </Button>
                                )}
                            </Grid>
                            <Grid item xs={2} lg={1}>
                                {index === payments.length - 1 && (
                                    <Button type="button" onClick={addPayment} variant="contained" color="primary" sx={{ margin: 2 }}>
                                        +
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    ))}



                    {selectedProducts.map((selectedProduct, index) => (
                        <Box key={index}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={2}>
                                    <select
                                        value={selectedProduct.productId}
                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                        className='invoice_select_product'
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>{product.attributes.name}</option>
                                        ))}
                                    </select>
                                </Grid>
                                <Grid item xs={12} lg={2}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        value={selectedProduct.quantity.toString()}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        InputLabelProps={{
                                            style: { color: '#fff' } // Adjust the label color
                                        }}
                                        InputProps={{
                                            style: { color: '#fff' } // Adjust the input text color
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#fff', // default
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#fff', // hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#fff', // focused
                                                },
                                            },
                                            margin: 1
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2}>
                                    <FormControl fullWidth sx={{ margin: 1 }}>
                                        <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#fff' }, }}>Select Quantity Type</InputLabel>
                                        <Select
                                            value={selectedProduct.quantityTypeId}
                                            onChange={(e) => handleQuantityTypeChange(index, e.target.value)}
                                            displayEmpty
                                            sx={{
                                                color: '#fff',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#fff'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main'
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Quantity Type</em>
                                            </MenuItem>
                                            {productQuantityTypes[selectedProduct.productId]?.map(type => (
                                                <MenuItem key={type.id} value={type.id}>{type.attributes.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={1}>
                                    <TextField
                                        label="KDV"
                                        type="number"
                                        value={selectedProduct.kdv || ''}
                                        onChange={(e) => handleIndividualKdvChange(index, e.target.value)}
                                        fullWidth
                                        InputLabelProps={{
                                            style: { color: '#fff' } // Adjust the label color
                                        }}
                                        InputProps={{
                                            style: { color: '#fff' } // Adjust the input text color
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#fff', // default
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#fff', // hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#fff', // focused
                                                },
                                            },
                                            margin: 1
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={1}>
                                    <TextField
                                        label="Stopaj"
                                        type="number"
                                        value={selectedProduct.stopaj || ''}
                                        onChange={(e) => handleIndividualStopajChange(index, e.target.value)}
                                        fullWidth
                                        InputLabelProps={{
                                            style: { color: '#fff' } // Adjust the label color
                                        }}
                                        InputProps={{
                                            style: { color: '#fff' } // Adjust the input text color
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#fff', // default
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#fff', // hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#fff', // focused
                                                },
                                            },
                                            margin: 1
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={1}>
                                    <TextField
                                        label="Komisyon"
                                        type="number"
                                        value={selectedProduct.komisyon || ''}
                                        onChange={(e) => handleIndividualKomisyonChange(index, e.target.value)}
                                        fullWidth
                                        InputLabelProps={{
                                            style: { color: '#fff' } // Adjust the label color
                                        }}
                                        InputProps={{
                                            style: { color: '#fff' } // Adjust the input text color
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#fff', // default
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#fff', // hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#fff', // focused
                                                },
                                            },
                                            margin: 1
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2}>
                                    {isPaid && (
                                        <TextField
                                            label="Price per unit"
                                            type="number"
                                            placeholder="Price per unit"
                                            value={selectedProduct.pricePerUnit || ''}
                                            onChange={(e) => handlePricePerUnitChange(index, e.target.value)}
                                            InputLabelProps={{
                                                style: { color: '#fff' } // Adjust the label color
                                            }}
                                            InputProps={{
                                                style: { color: '#fff' } // Adjust the input text color
                                            }}

                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#fff', // default
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#fff', // hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fff', // focused
                                                    },
                                                },
                                                margin: 1
                                            }}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={2} lg={1}>
                                    {selectedProducts.length > 1 && (
                                        <Button type="button" onClick={() => removeProductSelection(index)} variant="contained" color="secondary" sx={{ margin: 2 }}>
                                            -
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item xs={2} lg={1}>
                                    {index === selectedProducts.length - 1 && (
                                        <Button type="button" onClick={addProductSelection} variant="contained" color="primary" sx={{ margin: 2 }}>
                                            +
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    ))}

                    <Button onClick={submitInvoice} disabled={submitting || !selectedBuyer} variant="contained" color="primary" sx={{ margin: 1 }}>
                        Submit Invoice
                    </Button>
                </>
            )}
        </div>
    );
};

export default AddInvoiceComponents;