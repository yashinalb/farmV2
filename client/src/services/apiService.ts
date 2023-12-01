import axios from 'axios';

export const fetchBuyers = () => {
  return axios.get('http://localhost:1337/api/buyers-infos?populate=buyer_type', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchActiveBuyers = () => {
  return axios.get('http://localhost:1337/api/buyers-infos?filters[active][$eq]=true&populate=buyer_type', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchBuyerTypes = () => {
  return axios.get('http://localhost:1337/api/buyer-types', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const createBuyer = (buyer) => {
  const data = {
    data: {
      name: buyer.name,
      buyer_type: buyer.buyerType,
      contact_number: buyer.buyerContact,
      ...(buyer.buyerKdv && parseFloat(buyer.buyerKdv) ? { kdv: parseFloat(buyer.buyerKdv) } : {}),
      ...(buyer.buyerStopaj && parseFloat(buyer.buyerStopaj) ? { stopaj: parseFloat(buyer.buyerStopaj) } : {}),
      ...(buyer.buyerKomisyon && parseFloat(buyer.buyerKomisyon) ? { komisyon: parseFloat(buyer.buyerKomisyon) } : {}),
      // Add other fields if necessary
    }
  };
  return axios.post('http://localhost:1337/api/buyers-infos', data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchProducts = () => {
  return axios.get('http://localhost:1337/api/products?populate=*', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchActiveProducts = () => {
  return axios.get('http://localhost:1337/api/products?filters[active][$eq]=true&populate=*', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchProductCategory = () => {
  return axios.get('http://localhost:1337/api/product-categories', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const fetchProductQuantityType = () => {
  return axios.get('http://localhost:1337/api/product-quantity-types', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const createProducts = (product) => {
  const data = {
    data: {
      name: product.name,
      product_category: product.productCategoryId ? { id: product.productCategoryId } : null,
      product_quantity_types: product.productQuantityTypeIds.map(id => ({ id }))
    }
  };
  return axios.post('http://localhost:1337/api/products?populate=*', data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const createInvoice = (invoiceData) => {
  return axios.post('http://localhost:1337/api/invoices?fields*&populate=*', invoiceData, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const createInvoiceDetail = (invoiceDetailData) => {
  return axios.post('http://localhost:1337/api/invoice-details?populate=*', invoiceDetailData, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};
   
export const fetchInvoices = () => {
  return axios.get('http://localhost:1337/api/invoices?populate[0]=buyers_info&populate[1]=payments_tables.payment_method&populate[2]=invoice_details.product&populate[3]=invoice_details.product_quantity_type&populate[4]=invoice_details.payment_status', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};


export const fetchProductQuantityTypes = (productId) => {
  return axios.get(`http://localhost:1337/api/products/${productId}?populate=product_quantity_types`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};           

export const fetchPaymentStatus = () => {
  return axios.get(`http://localhost:1337/api/payment-statuses`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};      

export const fetchPaymentMethods = () => {
  return axios.get(`http://localhost:1337/api/payment-methods`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const createPayment = (paymentData) => {
  return axios.post('http://localhost:1337/api/payments-tables?fields*&populate=*', paymentData, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const updatePayment = (paymentId, paymentData) => {
  return axios.put(`http://localhost:1337/api/payments-tables/${paymentId}?populate=*`, paymentData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const deletePayment = (paymentId) => {
  return axios.delete(`http://localhost:1337/api/payments-tables/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};
