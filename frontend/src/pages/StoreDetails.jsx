import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Rating,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const [storeResponse, ratingsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/stores/${id}`),
          axios.get(`http://localhost:5000/api/stores/${id}/ratings`)
        ]);
        setStore(storeResponse.data);
        setRatings(ratingsResponse.data);
      } catch (err) {
        setError('Failed to fetch store details');
      }
    };

    fetchStoreDetails();
  }, [id]);

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to rate this store');
        setOpenRatingDialog(false);
        return;
      }

      await axios.post(
        `http://localhost:5000/api/stores/${id}/ratings`,
        { 
          value: newRating,
          comment: comment 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh ratings
      const ratingsResponse = await axios.get(`http://localhost:5000/api/stores/${id}/ratings`);
      setRatings(ratingsResponse.data);
      
      setOpenRatingDialog(false);
      setNewRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (!store) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {store.name}
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Typography color="textSecondary" gutterBottom>
          {store.address}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Rating value={store.averageRating || 0} readOnly precision={0.5} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({store.totalRatings || 0} ratings)
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenRatingDialog(true)}
          sx={{ mb: 3 }}
        >
          Rate this Store
        </Button>

        <Typography variant="h6" gutterBottom>
          Ratings & Reviews
        </Typography>
        <List>
          {ratings.map((rating, index) => (
            <div key={rating.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={rating.value} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        by {rating.user?.name || 'Anonymous'}
                      </Typography>
                    </Box>
                  }
                  secondary={rating.comment}
                />
              </ListItem>
              {index < ratings.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Paper>

      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle>Rate this Store</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Rating
              value={newRating}
              onChange={(event, newValue) => setNewRating(newValue)}
              size="large"
            />
            <TextField
              label="Comment (optional)"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRatingSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StoreDetails; 