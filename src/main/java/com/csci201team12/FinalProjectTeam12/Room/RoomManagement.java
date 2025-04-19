package com.csci201team12.FinalProjectTeam12.Room;

public class RoomManagement {
    RoomManagement() {

    }

    void createRoom(String userEmail, String RoomName) {
        // TO DO
        // Creates a new room and adds to our Room Table,
        // assigns a unique room ID and the Room Name. Assigns the userEmail as the
        // default RoomLeader
        /* Is only accessible by the room leader */
    }

    void leaveRoom(String userEmail) {
        // TO DO
        // User is deleted from the list of roommates of that room
    }

    void addRoommate(String userEmail) {
        // TO DO
        // Adds a Roommate to the Room. Adds a new user to the list of roommates in the
        // user
    }

    void deleteRoom() {
        // TO DO
        // Deletes the room
        /* Is only accessible by the room leader */
    }

    void inviteRoommate(String email) {
        // TO DO
        /* Can only access this function if the user is the CurrentRoomLeader */
    }

    void acceptInvitation(String roomID) {
        // TO DO
        // Prompts a user to accept or deny, adds the user to a room if they accept,
        // deletes the invitation from table if they deny
    }

    void makeTaskManager(String userEmail) {
        // TO DO
        /* Can only access this function if the user is the CurrentRoomLeader */
    }
}
