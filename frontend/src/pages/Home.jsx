import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Rating,
  Paper,
  Avatar,
  Divider,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Home() {
  const navigate = useNavigate();
  const [topStores, setTopStores] = useState([]);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userActivity, setUserActivity] = useState({
    ratings: [],
    recentActivity: [],
    loading: false
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    
    if (token && userFromStorage) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userFromStorage));
      fetchUserActivity(token);
    }

    const fetchTopStores = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stores/top');
        setTopStores(response.data);
      } catch (err) {
        setError('Failed to fetch top stores');
      }
    };

    fetchTopStores();
  }, []);

  const fetchUserActivity = async (token) => {
    setUserActivity(prev => ({ ...prev, loading: true }));
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch user ratings
      const ratingsResponse = await axios.get('http://localhost:5000/api/users/ratings', config);
      setUserActivity(prev => ({ 
        ...prev, 
        ratings: ratingsResponse.data.slice(0, 3), // Get only recent 3 ratings 
        loading: false 
      }));
    } catch (err) {
      console.error('Failed to fetch user activity:', err);
      setUserActivity(prev => ({ ...prev, loading: false }));
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

  // Rendering user dashboard for logged-in users
  const renderUserDashboard = () => {
    if (!userData) return null;

    return (
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}
          >
            {userData.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {userData.name}!
            </Typography>
            <Chip 
              label={formatRoleDisplay(userData.role)} 
              color={userData.role === 'admin' ? 'error' : userData.role === 'store_owner' ? 'primary' : 'default'} 
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Your Profile
                  </Box>
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                  {userData.address && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Address:</strong> {userData.address}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Member Type:</strong> {formatRoleDisplay(userData.role)}
                  </Typography>
                </Box>
                <Button 
                  component={RouterLink} 
                  to="/profile" 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    Quick Actions
                  </Box>
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<StoreIcon />}
                    onClick={() => navigate('/stores')}
                    fullWidth
                  >
                    Browse Stores
                  </Button>
                  
                  {userData.role === 'store_owner' && (
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => navigate('/my-stores')}
                      fullWidth
                    >
                      Manage My Stores
                    </Button>
                  )}
                  
                  <Button 
                    variant="outlined"
                    startIcon={<StarIcon />}
                    onClick={() => navigate('/profile')}
                    fullWidth
                  >
                    View My Ratings
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {userActivity.ratings.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Recent Ratings
                  </Typography>
                  
                  {userActivity.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {userActivity.ratings.map((rating) => (
                        <Grid item xs={12} sm={4} key={rating.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1">
                                {rating.Store?.name || rating.store?.name || 'Unknown Store'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                <Rating value={rating.value} readOnly size="small" />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  ({rating.value}/5)
                                </Typography>
                              </Box>
                              {rating.comment && (
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  "{rating.comment}"
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  };

  // Guest welcome content
  const renderGuestWelcome = () => (
    <>
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to Rox Store
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover and rate the best stores in your area. Join our community of shoppers
          and store owners to share your experiences and find great places to shop.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              For Shoppers
            </Typography>
            <Typography paragraph>
              • Discover new stores in your area<br />
              • Read and write reviews<br />
              • Rate your shopping experiences<br />
              • Save your favorite stores
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/register')}
            >
              Join as Shopper
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              For Store Owners
            </Typography>
            <Typography paragraph>
              • List your store<br />
              • Manage your store profile<br />
              • Engage with customers<br />
              • View store ratings and reviews
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/register')}
            >
              Register Your Store
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg">
      {isLoggedIn ? renderUserDashboard() : renderGuestWelcome()}

      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Top Rated Stores
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Grid container spacing={4}>
          {topStores.map((store) => (
            <Grid item key={store.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {store.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {store.address}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={store.averageRating || 0} readOnly precision={0.5} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({store.totalRatings || 0} ratings)
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/stores/${store.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home; 