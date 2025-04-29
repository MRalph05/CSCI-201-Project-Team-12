import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskIcon from '@mui/icons-material/Task';
import {
  getRoomById,
  getRoomMembers,
  removeRoomMember,
  inviteUserToRoom
} from '../services/api';

const RoomDetails = ({ roomId, onRoomUpdated = () => {} }) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  const currentUserEmail = localStorage.getItem('userEmail');
  
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch room details
      const roomData = await getRoomById(roomId);
      setRoom(roomData);

      // Fetch room members
      const membersData = await getRoomMembers(roomId);
      setMembers(membersData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      setError('Failed to load room details. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.trim()) {
      setInviteError('Please enter an email address');
      return;
    }

    try {
      setInviteLoading(true);
      setInviteError(null);
      setInviteSuccess(null);

      const result = await inviteUserToRoom(roomId, currentUserEmail, inviteEmail.trim());
      
      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteLoading(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      if (error.message.includes('409')) {
        setInviteError('User already has a pending invitation or is a member of this room');
      } else if (error.message.includes('404')) {
        setInviteError('User not found. Please check the email address');
      } else {
        setInviteError('Failed to send invitation. Please check the email and try again.');
      }
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (email) => {
    // Prevent removing the room leader
    if (room && room.leaderEmail === email) {
      setError('Cannot remove the room leader');
      return;
    }

    // Prevent removing yourself
    if (email === currentUserEmail) {
      setError('Use the "Leave Room" button to remove yourself');
      return;
    }

    try {
      await removeRoomMember(roomId, email);
      // Refresh members list
      const membersData = await getRoomMembers(roomId);
      setMembers(membersData);
      onRoomUpdated();
    } catch (error) {
      console.error('Error removing member:', error);
      setError('Failed to remove member. Please try again.');
    }
  };

  const handleViewTasks = () => {
    navigate(`/tasks/${roomId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!room) {
    return <Alert severity="info">Room not found</Alert>;
  }

  const isRoomLeader = room.leaderEmail === currentUserEmail;
  
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {room.name}
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Created: {new Date(room.createdAt).toLocaleString()}
      </Typography>
      
      <Button
        variant="contained" 
        color="secondary"
        startIcon={<TaskIcon />}
        onClick={handleViewTasks}
        sx={{ mb: 2 }}
      >
        View Tasks
      </Button>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Members ({members.length})
      </Typography>
      
      <List>
        {members.map((email) => (
          <ListItem
            key={email}
            secondaryAction={
              isRoomLeader && email !== room.leaderEmail ? (
                <IconButton edge="end" onClick={() => handleRemoveMember(email)}>
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
          >
            <ListItemText
              primary={email}
              secondary={email === room.leaderEmail ? 'Room Leader' : (email === currentUserEmail ? 'You' : '')}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Invite User
      </Typography>
      
      <Box component="form" onSubmit={handleInviteUser} sx={{ mb: 2 }}>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          margin="normal"
          size="small"
          helperText="Enter the email address of the user you want to invite"
          disabled={inviteLoading}
          error={!!inviteError}
        />
        
        {inviteError && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {inviteError}
          </Alert>
        )}
        
        {inviteSuccess && (
          <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
            {inviteSuccess}
          </Alert>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={inviteLoading}
          sx={{ mt: 1 }}
        >
          {inviteLoading ? <CircularProgress size={24} /> : 'Send Invitation'}
        </Button>
      </Box>
    </Paper>
  );
};

export default RoomDetails; 