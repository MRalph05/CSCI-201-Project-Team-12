package com.csci201team12.FinalProjectTeam12.Room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RoomManagement {

    private static final Logger LOG = LoggerFactory.getLogger(RoomManagement.class);

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @Autowired
    private RoomInvitationRepository invitationRepository;

    // Creates a new room and adds to our Room Table,
    // assigns a unique room ID and the Room Name. Assigns the userEmail as the
    // default RoomLeader
    Room createRoom(String userEmail, String roomName) {
        Room room = new Room(roomName, userEmail);
        Room savedRoom = roomRepository.save(room);
        roomMemberRepository.save(new RoomMember(savedRoom.getId(), userEmail));
        LOG.debug("Created new room: '{}', roomId: {}, currentLeader: '{}'", roomName, savedRoom.getId(), userEmail);
        return savedRoom;
    }

    // Delete room
    /* Can only access this function if the user is the CurrentRoomLeader */
    boolean deleteRoom(Long roomId, String userEmail) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            LOG.warn("Room with id {} does not exist", roomId);
            return false;
        }
        Room room = roomOpt.get();
        if (!room.getLeaderEmail().equals(userEmail)) {
            LOG.warn("deleteRoom is only accessible to CurrentRoomLeader");
            return false;
        }
        LOG.debug("Deleting room: '{}', roomId: {}, currentLeader: '{}'", room.getName(), roomId, room.getLeaderEmail());
        roomRepository.deleteById(roomId);
        return true;
    }
    
    // Send invitation for a user to join the room
    /* Can only access this function if the user is the CurrentRoomLeader */
    boolean inviteRoommate(Long roomId, String inviterEmail, String inviteeEmail) {
        if (!roomRepository.existsById(roomId)) {
            LOG.warn("Room with id {} does not exist", roomId);
            return false; // Room does not exist
        }
        if (!roomMemberRepository.existsByRoomIdAndUserEmail(roomId, inviterEmail)) {
            LOG.warn("inviteRoommate is only accessible to CurrentRoomLeader");
            return false; // Inviter is not in room
        }
        if (roomMemberRepository.existsByRoomIdAndUserEmail(roomId, inviteeEmail)) {
            return false; // Invitee is already in room
        }
        invitationRepository.save(new RoomInvitation(roomId, inviterEmail, inviteeEmail));
        return true;
    }

    // Resolves RoomInvitation according to invitee choice
    // If invitation accepted, create RoomMember entry and add to room
    boolean respondToInvitation(Long invitationId, boolean accepted) {
        Optional<RoomInvitation> invitationOpt = invitationRepository.findById(invitationId);
        if (invitationOpt.isEmpty()) {
            LOG.warn("Invitation with id {} does not exist", invitationId);
            return false;
        }
        RoomInvitation invitation = invitationOpt.get();
        if (invitation.getAccepted() != null) {
            LOG.warn("Cannot reply to a RoomInvitation multiple times");
            return false;
        }
        invitation.setAccepted(accepted);
        invitation.setRespondedAt(java.time.LocalDateTime.now());
        invitationRepository.save(invitation);
        if (accepted) {
            roomMemberRepository.save(new RoomMember(invitation.getRoomId(), invitation.getInviteeEmail()));
            LOG.debug("User {} joined room {}", invitation.getInviteeEmail(), invitation.getRoomId());
        }
        return true;
    }

    // User is deleted from the list of roommates of that room
    boolean leaveRoom(Long roomId, String userEmail) {
        // Check room exists
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            LOG.warn("Room with id {} does not exist", roomId);
            return false;
        }
        Room room = roomOpt.get();
        // Check user is not leader
        if (room.getLeaderEmail().equals(userEmail)) {
            LOG.warn("CurrentRoomLeader cannot leave room");
            return false;
        }
        roomMemberRepository.deleteByRoomIdAndUserEmail(roomId, userEmail);
        LOG.debug("User {} left room {}", userEmail, roomId);
        return true;
    }

    // Transfer leadership to another existing roommate
    /* Can only access this function if the user is the CurrentRoomLeader */
    boolean makeRoomLeader(Long roomId, String currentLeaderEmail, String newLeaderEmail) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            LOG.warn("Room with id {} does not exist", roomId);
            return false;
        }
        Room room = roomOpt.get();
        if (!room.getLeaderEmail().equals(currentLeaderEmail)) {
            LOG.warn("makeRoomLeader is only accessible to CurrentRoomLeader");
            return false;
        }
        if (!roomMemberRepository.existsByRoomIdAndUserEmail(roomId, newLeaderEmail)) {
            LOG.warn("Cannot make {} the leader of {} - User not in room", newLeaderEmail, room.getName());
            return false;
        }
        room.setLeaderEmail(newLeaderEmail);
        roomRepository.save(room);
        return true;
    }

}

