import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import StoreIcon from '@mui/icons-material/Store';
import axios from 'axios';

const AdminStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // Fetch stores with applied filters
  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        navigate('/login');
        return;
      }

      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/admin/stores?${params.toString()}`, config);
      setStores(response.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to access store management');
      } else {
        setError('Failed to load stores');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchStores();
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      email: '',
      address: ''
    });
    fetchStores();
  };

  const handleDeleteClick = (store) => {
    setSelectedStore(store);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/stores/${selectedStore.id}`, config);
      
      // Refresh the store list
      fetchStores();
      setSuccess(`Store "${selectedStore.name}" has been deleted successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting store:', err);
      setError('Failed to delete store');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStore(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedStore(null);
  };

  const handleViewStore = (storeId) => {
    navigate(`/admin/stores/${storeId}`);
  };

  const handleEditStore = (storeId) => {
    navigate(`/admin/stores/edit/${storeId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <StoreIcon sx={{ mr: 1 }} />
            Store Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/add-store')}
          >
            Add New Store
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Filters */}
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
          onClick={() => setOpenFilters(!openFilters)}
          sx={{ mb: 2 }}
        >
          {openFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {openFilters && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleSearch}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="name"
                    label="Filter by Name"
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterChange}
                    margin="normal"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="email"
                    label="Filter by Email"
                    fullWidth
                    value={filters.email}
                    onChange={handleFilterChange}
                    margin="normal"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="address"
                    label="Filter by Address"
                    fullWidth
                    value={filters.address}
                    onChange={handleFilterChange}
                    margin="normal"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    startIcon={<SearchIcon />}
                  >
                    Apply Filters
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}

        {/* Stores Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : stores.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No stores found matching your filters.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Store Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stores
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((store) => (
                      <TableRow key={store.id}>
                        <TableCell>{store.name}</TableCell>
                        <TableCell>{store.email}</TableCell>
                        <TableCell>
                          {store.address.length > 30
                            ? `${store.address.substring(0, 30)}...`
                            : store.address}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={parseFloat(store.averageRating) || 0} readOnly precision={0.5} size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              ({store.totalRatings || 0})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {store.owner?.name || 'Unknown Owner'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="info" 
                            size="small"
                            onClick={() => handleViewStore(store.id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleEditStore(store.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteClick(store)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={stores.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the store "{selectedStore?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminStores; 