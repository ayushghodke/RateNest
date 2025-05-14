import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  FormHelperText,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const AdminStoreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  
  const [storeOwners, setStoreOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch all users with role 'store_owner'
    const fetchStoreOwners = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setServerError('Authentication required');
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          'http://localhost:5000/api/admin/users?role=store_owner', 
          config
        );
        setStoreOwners(response.data);
      } catch (err) {
        console.error('Error fetching store owners:', err);
        setServerError('Failed to load store owners');
      }
    };

    // If in edit mode, fetch the store data
    const fetchStore = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setServerError('Authentication required');
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/api/admin/stores/${id}`, config);
        
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          address: response.data.address || '',
          ownerId: response.data.ownerId || ''
        });
      } catch (err) {
        console.error('Error fetching store:', err);
        if (err.response?.status === 403) {
          setServerError('You do not have permission to edit stores');
        } else if (err.response?.status === 404) {
          setServerError('Store not found');
        } else {
          setServerError('Failed to load store data');
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStoreOwners();
    if (isEditMode) {
      fetchStore();
    }
  }, [id, isEditMode, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.ownerId) {
      newErrors.ownerId = 'Store owner is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setServerError('Authentication required');
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let response;
      if (isEditMode) {
        response = await axios.put(
          `http://localhost:5000/api/admin/stores/${id}`, 
          formData, 
          config
        );
        setSuccess('Store updated successfully');
      } else {
        response = await axios.post(
          'http://localhost:5000/api/admin/stores', 
          formData, 
          config
        );
        setSuccess('Store created successfully');
        
        // Clear form after successful creation
        if (!isEditMode) {
          setFormData({
            name: '',
            email: '',
            address: '',
            ownerId: ''
          });
        }
      }
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate('/admin/stores');
      }, 1500);
    } catch (err) {
      console.error('Error saving store:', err);
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Failed to save store. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/stores')}
            sx={{ mr: 2 }}
          >
            Back to Stores
          </Button>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <StoreIcon sx={{ mr: 1 }} />
            {isEditMode ? 'Edit Store' : 'Add New Store'}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Store Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                margin="normal" 
                variant="outlined"
                error={Boolean(errors.ownerId)}
              >
                <InputLabel id="owner-label">Store Owner</InputLabel>
                <Select
                  labelId="owner-label"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  label="Store Owner"
                  required
                >
                  <MenuItem value="" disabled>
                    <em>Select a store owner</em>
                  </MenuItem>
                  {storeOwners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </MenuItem>
                  ))}
                </Select>
                {errors.ownerId && <FormHelperText>{errors.ownerId}</FormHelperText>}
                {storeOwners.length === 0 && (
                  <FormHelperText error>
                    No store owners available. Please create a user with the "Store Owner" role first.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading || storeOwners.length === 0}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isEditMode ? 'Update Store' : 'Create Store'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminStoreForm; 