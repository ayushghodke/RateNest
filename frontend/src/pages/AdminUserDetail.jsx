import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/api/admin/users/${id}`, config);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        if (err.response?.status === 403) {
          setError('You do not have permission to view user details');
        } else if (err.response?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load user details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const formatRoleDisplay = (role) => {
    switch(role) {
      case 'admin':
        return { label: 'Administrator', color: 'error', icon: <AdminPanelSettingsIcon /> };
      case 'store_owner':
        return { label: 'Store Owner', color: 'primary', icon: <StorefrontIcon /> };
      default:
        return { label: 'Regular User', color: 'default', icon: <PersonIcon /> };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">User information not available</Alert>
      </Container>
    );
  }

  const roleInfo = formatRoleDisplay(user.role);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/users')}
              sx={{ mr: 2 }}
            >
              Back to Users
            </Button>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
              {roleInfo.icon}
              <Box sx={{ ml: 1 }}>User Details</Box>
            </Typography>
          </Box>
          <Box>
            <IconButton 
              color="primary" 
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error" 
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" color="primary">{user.name}</Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <EmailIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <HomeIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body1">{user.address}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Member since: {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Chip 
                    icon={roleInfo.icon}
                    label={roleInfo.label} 
                    color={roleInfo.color}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* If user is a store owner, show their stores */}
          {user.role === 'store_owner' && (
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <StorefrontIcon sx={{ mr: 1 }} />
                    Owned Stores
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {user.stores && user.stores.length > 0 ? (
                    user.stores.map(store => (
                      <Card key={store.id} variant="outlined" sx={{ mb: 2, p: 1 }}>
                        <CardContent>
                          <Typography variant="h6">{store.name}</Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {store.address}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {store.email}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Rating value={parseFloat(store.averageRating) || 0} readOnly precision={0.5} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              ({store.totalRatings || 0} ratings)
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography color="textSecondary">
                      This user does not have any stores yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminUserDetail; 