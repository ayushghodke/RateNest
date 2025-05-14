import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    usersByRole: [],
    topStores: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', config);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 403) {
          setError('You do not have permission to access the admin dashboard');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Format role data for display
  const getRoleData = () => {
    if (!dashboardData?.usersByRole || !Array.isArray(dashboardData.usersByRole) || dashboardData.usersByRole.length === 0) {
      return [
        { name: 'Regular Users', count: 0, icon: getRoleIcon('user') },
        { name: 'Store Owners', count: 0, icon: getRoleIcon('store_owner') },
        { name: 'Administrators', count: 0, icon: getRoleIcon('admin') }
      ];
    }
    
    return dashboardData.usersByRole.map(role => ({
      name: formatRoleName(role.role),
      count: role.count,
      icon: getRoleIcon(role.role)
    }));
  };

  const formatRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrators';
      case 'store_owner':
        return 'Store Owners';
      default:
        return 'Regular Users';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettingsIcon fontSize="large" color="error" />;
      case 'store_owner':
        return <StorefrontIcon fontSize="large" color="primary" />;
      default:
        return <PeopleIcon fontSize="large" color="action" />;
    }
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">Total Users</Typography>
                  <PersonIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData?.totalUsers || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ height: '100%', bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="success.dark">Total Stores</Typography>
                  <StoreIcon color="success" fontSize="large" />
                </Box>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData?.totalStores || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ height: '100%', bgcolor: '#fff8e1' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="warning.dark">Total Ratings</Typography>
                  <StarIcon color="warning" fontSize="large" />
                </Box>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData?.totalRatings || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users by Role */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            User Distribution
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {getRoleData().map((role, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {role.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {role.name}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="text.secondary">
                      {role.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/admin/users')}
              sx={{ flex: 1 }}
            >
              Manage Users
            </Button>
            <Button 
              variant="contained" 
              size="large"
              color="secondary"
              startIcon={<StoreIcon />}
              onClick={() => navigate('/admin/stores')}
              sx={{ flex: 1 }}
            >
              Manage Stores
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/admin/add-user')}
              sx={{ flex: 1 }}
            >
              Add New User
            </Button>
          </Stack>
        </Paper>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 