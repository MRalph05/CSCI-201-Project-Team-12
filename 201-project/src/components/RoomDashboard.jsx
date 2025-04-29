import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const RoomDashboard = ({ rooms, onEditRoom, onDeleteRoom, onViewRoom }) => {
  const currentUserEmail = localStorage.getItem("userEmail");

  if (!rooms || rooms.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" align="center">
            No rooms found. Create a room to get started!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {rooms.map((room) => {
        const isLeader = room.leaderEmail === currentUserEmail;
        
        return (
          <Grid item xs={12} sm={6} md={6} lg={4} key={room.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div">
                    {room.name}
                  </Typography>
                  <Chip 
                    label={isLeader ? "Leader" : "Member"} 
                    color={isLeader ? "primary" : "default"} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                </Typography>
                
                {!isLeader && (
                  <Typography variant="body2" color="text.secondary">
                    Leader: {room.leaderEmail}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button 
                  startIcon={<VisibilityIcon />}
                  size="small" 
                  onClick={() => onViewRoom(room.id)}
                >
                  View
                </Button>
                
                {isLeader && (
                  <>
                    <IconButton 
                      size="small" 
                      onClick={() => onEditRoom(room)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteRoom(room.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RoomDashboard;
