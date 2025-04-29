import React, { useState, useEffect } from 'react';
import { 
  getPendingInvitations, 
  respondToInvitation, 
  getRoomById,
  getRoomsByLeader,
  getRoomsByMember
} from '../services/api';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography, 
  Paper, 
  Box,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

const InvitationList = ({ onInvitationResponded = () => {} }) => {
  const [invitations, setInvitations] = useState([]);
  const [roomDetails, setRoomDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(false);

  const userEmail = localStorage.getItem('userEmail');

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const invitationsData = await getPendingInvitations(userEmail);
      setInvitations(invitationsData);
      
      // Fetch room details for each invitation
      const roomDetailsMap = {};
      for (const invitation of invitationsData) {
        const roomData = await getRoomById(invitation.roomId);
        roomDetailsMap[invitation.roomId] = roomData;
      }
      
      setRoomDetails(roomDetailsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError('Failed to load invitations. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchInvitations();
    } else {
      setError('You must be logged in to view invitations');
      setLoading(false);
    }
  }, [userEmail]);

  const handleResponse = async (invitationId, accepted) => {
    try {
      setResponding(true);
      
      // Call the API to respond to the invitation
      await respondToInvitation(invitationId, accepted);
      
      // Remove the responded invitation from the list
      setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
      
      // If accepted, trigger a refresh of the parent component
      if (accepted) {
        onInvitationResponded();
      }

      setResponding(false);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      setError('Failed to respond to invitation. Please try again.');
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">{error}</Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Room Invitations
      </Typography>
      
      {invitations.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          You have no pending invitations
        </Typography>
      ) : (
        <List>
          {invitations.map((invitation, index) => (
            <React.Fragment key={invitation.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={roomDetails[invitation.roomId]?.name || `Room #${invitation.roomId}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        Invited by: {invitation.inviterEmail}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary">
                        {new Date(invitation.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }}
                    onClick={() => handleResponse(invitation.id, true)}
                    disabled={responding}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => handleResponse(invitation.id, false)}
                    disabled={responding}
                  >
                    Decline
                  </Button>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default InvitationList; 