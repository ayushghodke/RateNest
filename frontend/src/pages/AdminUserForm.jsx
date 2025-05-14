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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const AdminUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If in edit mode, fetch the user data
    if (isEditMode) {
      const fetchUser = async () => {
        setFetchLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setServerError('Authentication required');
            navigate('/login');
            return;
          }

          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`http://localhost:5000/api/admin/users/${id}`, config);
          
          // Remove the password as we don't want to edit it directly
          const { password, ...userData } = response.data;
          setFormData(userData);
        } catch (err) {
          console.error('Error fetching user:', err);
          if (err.response?.status === 403) {
            setServerError('You do not have permission to edit users');
          } else if (err.response?.status === 404) {
            setServerError('User not found');
          } else {
            setServerError('Failed to load user data');
          }
        } finally {
          setFetchLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditMode, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      
      // Only send password if it's provided or if creating a new user
      const dataToSend = { ...formData };
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      let response;
      if (isEditMode) {
        response = await axios.put(
          `http://localhost:5000/api/admin/users/${id}`, 
          dataToSend, 
          config
        );
        setSuccess('User updated successfully');
      } else {
        response = await axios.post(
          'http://localhost:5000/api/admin/users', 
          dataToSend, 
          config
        );
        setSuccess('User created successfully');
        
        // Clear form after successful creation
        if (!isEditMode) {
          setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            role: 'user'
          });
        }
      }
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err) {
      console.error('Error saving user:', err);
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Failed to save user. Please try again.');
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
            onClick={() => navigate('/admin/users')}
            sx={{ mr: 2 }}
          >
            Back to Users
          </Button>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 1 }} />
            {isEditMode ? 'Edit User' : 'Add New User'}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label={isEditMode ? "Password (leave blank to keep current)" : "Password"}
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required={!isEditMode}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal" 
                variant="outlined"
                error={Boolean(errors.role)}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                  required
                >
                  <MenuItem value="user">Regular User</MenuItem>
                  <MenuItem value="store_owner">Store Owner</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={4}
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isEditMode ? 'Update User' : 'Create User'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminUserForm; 