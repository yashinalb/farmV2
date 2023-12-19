import { useState, useEffect } from 'react';
import { createProducts, fetchProductCategory, fetchProductQuantityType } from '../../services/apiService';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const AddProductComponents = ({ onFormSubmitProduct }) => {
    const [name, setName] = useState('');
    const [productCategoryId, setProductCategoryId] = useState('');
    const [productQuantityTypeIds, setProductQuantityTypeIds] = useState([]); // Changed to array
    const [productCategories, setProductCategories] = useState([]);
    const [quantityTypes, setQuantityTypes] = useState([]);
    const [quantityTypeSelections, setQuantityTypeSelections] = useState(['']);
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        fetchProductCategory().then(response => {
            setProductCategories(response.data.data);
        }).catch(error => {
            console.error('Error fetching product categories:', error);
        });

        fetchProductQuantityType().then(response => {
            setQuantityTypes(response.data.data);
        }).catch(error => {
            console.error('Error fetching quantity types:', error);
        });
    }, []);

    const handleQuantityTypeChange = (value, index) => {
        const updatedSelections = [...quantityTypeSelections];
        updatedSelections[index] = value;
        setQuantityTypeSelections(updatedSelections);
    };

    const addNewQuantityTypeSelect = () => {
        setQuantityTypeSelections([...quantityTypeSelections, '']);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const productQuantityTypeIds = quantityTypeSelections.filter(id => id);
        createProducts({ name, productCategoryId, productQuantityTypeIds })
            .then(() => {
                onFormSubmitProduct();
                setName('');
                setProductCategoryId('');
                setProductQuantityTypeIds([]);
                setQuantityTypeSelections(['']);
                alert('Product added successfully');
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
    };

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible);
    };


    return (
        <>
            <Button onClick={toggleFormVisibility} variant="contained" color="secondary">
                {isFormVisible ? 'Cancel' : 'Add Product'}
            </Button>
            {isFormVisible && (
                <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1 }, '& .MuiButton-root': { m: 1 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                label="Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
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
                    </Grid>
                    <Grid container spacing={2} >
                        <Grid item xs={12} lg={6} sx={{m:1}}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#fff' },  }}>Category</InputLabel>
                                <Select
                                    value={productCategoryId}
                                    onChange={(e) => setProductCategoryId(e.target.value)}
                                    label="Category"
                                    required
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
                                    <MenuItem value="">Select Category</MenuItem>
                                    {productCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>{category.attributes.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        {quantityTypeSelections.map((selection, index) => (
                            <Grid item xs={8} lg={6} key={index} sx={{m:1}}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#fff' } }}>Quantity Type</InputLabel>
                                    <Select
                                        value={selection}
                                        label="Quantity Type"
                                        onChange={(e) => handleQuantityTypeChange(e.target.value, index)}
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
                                        <MenuItem value="">Select Quantity Type</MenuItem>
                                        {quantityTypes.map((type) => (
                                            <MenuItem key={type.id} value={type.id}>{type.attributes.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ))}

                        <Grid item xs={4} lg={4}>
                            <Button onClick={addNewQuantityTypeSelect} variant="contained" color="secondary">
                                Add Type
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!name || !setProductCategoryId}>
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default AddProductComponents;
