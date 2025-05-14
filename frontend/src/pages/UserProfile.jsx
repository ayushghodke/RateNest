import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';

function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userStores, setUserStores] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          setError('Please login to view profile');
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // First get the user profile data
        const userResponse = await axios.get('http://localhost:5000/api/users/profile', config);
        if (userResponse.data) {
          setUser(userResponse.data);
          setFormData({
            name: userResponse.data.name || '',
            email: userResponse.data.email || '',
            address: userResponse.data.address || '',
          });
        } else {
          throw new Error('Failed to fetch user profile');
        }

        // Then get stores if user is a store owner
        if (userResponse.data.role === 'store_owner') {
          try {
            const storesResponse = await axios.get('http://localhost:5000/api/users/stores', config);
            setUserStores(storesResponse.data || []);
          } catch (storeErr) {
            console.error('Failed to fetch stores:', storeErr);
            // Don't set the main error, just log it
          }
        }

        // Get ratings
        try {
          const ratingsResponse = await axios.get('http://localhost:5000/api/users/ratings', config);
          setUserRatings(ratingsResponse.data || []);
        } catch (ratingErr) {
          console.error('Failed to fetch ratings:', ratingErr);
          // Don't set the main error, just log it
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to fetch user data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdateSuccess(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Your session has expired. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(response.data);
      setIsEditing(false);
      setUpdateSuccess(true);

      // Update the user in localStorage to keep it in sync
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...currentUser,
        name: response.data.name,
        email: response.data.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const formatRoleDisplay = (role) => {
    switch(role) {
      case 'store_owner':
        return 'Store Owner';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user && error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography>Loading user information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                Profile
              </Typography>
              <Chip 
                label={formatRoleDisplay(user.role)} 
                color={user.role === 'admin' ? 'error' : user.role === 'store_owner' ? 'primary' : 'default'} 
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  inputProps={{ minLength: 2, maxLength: 100 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                />
                <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {user.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Address:</strong> {user.address}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        {user.role === 'store_owner' && (
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                My Stores
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {userStores.length === 0 ? (
                <Typography color="text.secondary">
                  You haven't added any stores yet. Go to "My Stores" section to add one.
                </Typography>
              ) : (
                userStores.map((store) => (
                  <Card key={store.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{store.name}</Typography>
                      <Typography color="textSecondary">{store.address}</Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {store.email}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={store.averageRating || 0} readOnly precision={0.5} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({store.totalRatings || 0} ratings)
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
              
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/my-stores')}
                sx={{ mt: 2 }}
              >
                Manage Stores
              </Button>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              My Ratings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {userRatings.length === 0 ? (
              <Typography color="text.secondary">
                You haven't rated any stores yet. Browse stores to add ratings.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {userRatings.map((rating) => (
                  <Grid item xs={12} sm={6} md={4} key={rating.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6">{rating.Store?.name || rating.store?.name || 'Unknown Store'}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Rated on {new Date(rating.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Rating value={rating.value} readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({rating.value}/5)
                          </Typography>
                        </Box>
                        {rating.comment && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            "{rating.comment}"
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/stores')}
              sx={{ mt: 3 }}
            >
              Browse Stores
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserProfile; 