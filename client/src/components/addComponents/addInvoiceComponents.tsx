import { useState, useEffect } from 'react';
import { fetchActiveBuyers, fetchActiveProducts, createInvoice, createInvoiceDetail, fetchProductQuantityTypes, fetchPaymentStatus } from '../../services/apiService';

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
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [isPaid, setIsPaid] = useState(false);


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


    }, []);

    // Modify setSelectedBuyer to also set selectedBuyerKdv
    const handleBuyerChange = (e) => {
        const buyerId = e.target.value;
        setSelectedBuyer(buyerId);

        const buyerKdv = buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.kdv;
        const buyerStopaj = buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.stopaj;
        const buyerKomisyon = buyers.find(buyer => buyer.id.toString() === buyerId)?.attributes.komisyon;
        setSelectedBuyerKdv(buyerKdv || '');
        setSelectedBuyerStopaj(buyerStopaj || '');
        setSelectedBuyerKomisyon(buyerKomisyon || '');
        const updatedProducts = selectedProducts.map(product => ({
            ...product,
            kdv: buyerKdv || '0',
            stopaj: buyerStopaj || '0',
            komisyon: buyerKomisyon || '0'
        }));
        setSelectedProducts(updatedProducts);
    };

    const handlePaymentStatusChange = (e) => {
        setSelectedPaymentStatus(e.target.value);
        const isGlobalPaid = paymentStatuses.find(status => status.id.toString() === e.target.value)?.attributes.name === 'Ödendi';
        setIsPaid(isGlobalPaid);
    };


    const handleIndividualKdvChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, kdv: value !== '' ? value : '0' } : product
        );
        setSelectedProducts(updatedProducts);
    };

    const handleIndividualStopajChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, stopaj: value !== '' ? value : '0' } : product
        );
        setSelectedProducts(updatedProducts);
    };

    const handleIndividualKomisyonChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, komisyon: value !== '' ? value : '0' } : product
        );
        setSelectedProducts(updatedProducts);
    };



    const addProductSelection = () => {
        setShowForm(true);
        setSelectedProducts([...selectedProducts, {
            productId: '', quantity: 0, quantityTypeId: '', pricePerUnit: '',
            kdv: selectedBuyerKdv, stopaj: selectedBuyerStopaj, komisyon: selectedBuyerKomisyon
        }]);
    };

    const removeProductSelection = (index) => {
        const updatedProducts = selectedProducts.filter((_, idx) => idx !== index);
        setSelectedProducts(updatedProducts);
    };

    const handlePricePerUnitChange = (index, value) => {
        const updatedProducts = selectedProducts.map((product, idx) =>
            idx === index ? { ...product, pricePerUnit: value } : product
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
        }
    };

    const handleQuantityChange = (index: number, value: string) => {
        const quantity = value.replace(/^0+|[^0-9]/g, '');

        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts[index].quantity = quantity === '' ? 0 : parseInt(quantity, 10);
        setSelectedProducts(newSelectedProducts);
    };


    const submitInvoice = () => {
        setSubmitting(true);

        if (selectedProducts.length === 0) {
            alert("No invoice details to submit.");
            setSubmitting(false);
            return;
        }

        if (!selectedBuyer) {
            alert("Please select a buyer.");
            return;
        }

        const totalAmount = selectedProducts.reduce((acc, curr) => acc + curr.quantity * products.find(p => p.id.toString() === curr.productId).attributes.price, 0);

        createInvoice({
            data: {
                buyers_info: selectedBuyer,
                date: invoiceDate, // This is the selected date
                total_amount: totalAmount,
            }
        })
            .then((invoiceResponse) => {
                const invoiceId = invoiceResponse.data.data.id;
                const detailPromises = selectedProducts.map((selectedProduct) => {
                    const pricePerUnit = isPaid && selectedProduct.pricePerUnit ? selectedProduct.pricePerUnit : products.find(p => p.id.toString() === selectedProduct.productId).attributes.price;

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

                return Promise.all(detailPromises);
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
                setSelectedPaymentStatus('');
                setSelectedBuyer(''); // Reset the buyers
                setSelectedBuyerKdv('');
                setSelectedBuyerStopaj('');
                setSelectedBuyerKomisyon('');
            });
    };
    return (
        <div>
            <h1>Create Invoice</h1>
            {!showForm && <button onClick={addProductSelection}>Add Product</button>}

            {showForm && (
                <>
                    <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                    <select onChange={handleBuyerChange} value={selectedBuyer}>
                        <option value="">Select buyer</option> {/* This will be shown by default */}
                        {buyers.map((buyer) => (
                            <option key={buyer.id} value={buyer.id}>{buyer.attributes.name}</option>
                        ))}
                    </select>
                    <div>
                        <h3>Payment Status</h3>
                        {paymentStatuses.map((status) => (
                            <label key={status.id}>
                                <input
                                    type="radio"
                                    name="paymentStatus"
                                    value={status.id}
                                    checked={selectedPaymentStatus === status.id.toString()}
                                    onChange={handlePaymentStatusChange}
                                />
                                {status.attributes.name}
                            </label>
                        ))}
                    </div>



                    {selectedProducts.map((selectedProduct, index) => (
                        <div key={index}>
                            <select
                                value={selectedProduct.productId}
                                onChange={(e) => handleProductChange(index, e.target.value)}
                            >
                                <option value="">Select product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.attributes.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={selectedProduct.quantity.toString()}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                            />
                            <select
                                value={selectedProduct.quantityTypeId}
                                onChange={(e) => handleQuantityTypeChange(index, e.target.value)}
                            >
                                <option value="">Select Quantity Type</option>
                                {
                                    productQuantityTypes[selectedProduct.productId]?.map(type => (
                                        <option key={type.id} value={type.id}>{type.attributes.name}</option>
                                    ))
                                }
                            </select>
                            {isPaid && (
                                <input
                                    type="number"
                                    placeholder="Price per unit"
                                    value={selectedProduct.pricePerUnit || ''}
                                    onChange={(e) => handlePricePerUnitChange(index, e.target.value)}
                                />
                            )}
                            {selectedProducts.length > 1 && (
                                <button type="button" onClick={() => removeProductSelection(index)}>-</button>
                            )}
                            <input
                                placeholder="KDV"
                                type="number"
                                value={selectedProduct.kdv}
                                onChange={(e) => handleIndividualKdvChange(index, e.target.value)}
                            />
                            <input
                                placeholder="Stopaj"
                                type="number"
                                value={selectedProduct.stopaj}
                                onChange={(e) => handleIndividualStopajChange(index, e.target.value)}
                            />
                            <input
                                placeholder="Komisyon"
                                type="number"
                                value={selectedProduct.komisyon}
                                onChange={(e) => handleIndividualKomisyonChange(index, e.target.value)}
                            />

                            {index === selectedProducts.length - 1 && (
                                <button type="button" onClick={addProductSelection}>+</button>
                            )}
                        </div>
                    ))}

                    <button onClick={submitInvoice} disabled={submitting || !selectedBuyer}>Submit Invoice</button>
                </>
            )}
        </div>
    );
};

export default AddInvoiceComponents;