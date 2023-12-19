import { useState, useEffect } from 'react';
import { fetchBuyerTypes, createBuyer } from '../../services/apiService';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const AddBuyerComponents = ({ onFormSubmit }) => {
    const [name, setName] = useState('');
    const [buyerType, setBuyerType] = useState('');
    const [buyerKdv, setBuyerKdv] = useState('');
    const [buyerStopaj, setBuyerStopaj] = useState('');
    const [buyerKomisyon, setBuyerKomisyon] = useState('');
    const [buyerContact, setContact] = useState('');
    const [buyerTypes, setBuyerTypes] = useState([]); // This will hold the fetched buyer types
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        fetchBuyerTypes()
            .then((response) => {
                setBuyerTypes(response.data.data); // Adjust according to the response structure
            })
            .catch((error) => {
                console.error('Error fetching buyer types:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        createBuyer({ name, buyerType, buyerKdv, buyerStopaj, buyerKomisyon, buyerContact })
            .then(() => {
                onFormSubmit();
                setName('');
                setBuyerType('');
                setBuyerKdv('');
                setBuyerStopaj('');
                setBuyerKomisyon('');
                setContact('');
                alert('Buyer added successfully');
            })
            .catch((error) => {
                console.error('Error adding buyer:', error);
            });
    };

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible);
    };

    return (
        <>
            <Button onClick={toggleFormVisibility} variant="contained" color="primary">
                {isFormVisible ? 'Cancel' : 'Add Buyer'}
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
                                color="primary" // Adjust the color for visibility
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

                        <Grid item xs={6}></Grid>
                        <Grid item xs={12} lg={3}>
                            <TextField
                                label="KDV"
                                type="number"
                                value={buyerKdv}
                                onChange={(e) => setBuyerKdv(e.target.value)}
                                fullWidth
                                color="primary" // Adjust the color for visibility
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
                        <Grid item xs={12} lg={3}>
                            <TextField
                                label="Stopaj"
                                type="number"
                                value={buyerStopaj}
                                onChange={(e) => setBuyerStopaj(e.target.value)}
                                fullWidth
                                color="primary" // Adjust the color for visibility
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
                        <Grid item xs={12} lg={3}>
                            <TextField
                                label="Komisyon"
                                type="number"
                                value={buyerKomisyon}
                                onChange={(e) => setBuyerKomisyon(e.target.value)}
                                fullWidth
                                color="primary" // Adjust the color for visibility
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
                        <Grid item xs={12} lg={3}>
                            <TextField
                                label="Contact Number"
                                type="text"
                                value={buyerContact}
                                onChange={(e) => setContact(e.target.value)}
                                fullWidth
                                color="primary" // Adjust the color for visibility
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
                        <Grid item xs={12} lg={6} sx={{ m: 1 }}>
                            <FormControl fullWidth color="primary">
                                <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#fff' } }}>Type</InputLabel>
                                <Select
                                    value={buyerType}
                                    label="Type"
                                    onChange={(e) => setBuyerType(e.target.value)}
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
                                    <MenuItem value="">
                                        <em>Select type</em>
                                    </MenuItem>
                                    {buyerTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>{type.attributes.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={5} sx={{ m: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!name || !buyerType || !buyerContact}
                                fullWidth
                            >
                                Add Buyer
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default AddBuyerComponents;
