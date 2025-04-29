package com.csci201team12.FinalProjectTeam12.Room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private RoomMemberRepository roomMemberRepository;

    // Get all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    // Get rooms by leader email
    @GetMapping("/leader/{email}")
    public ResponseEntity<List<Room>> getRoomsByLeader(@PathVariable String email) {
        List<Room> rooms = roomRepository.findByLeaderEmail(email);
        return ResponseEntity.ok(rooms);
    }
    
    // Get rooms that a user is a member of
    @GetMapping("/member/{email}")
    public ResponseEntity<List<Room>> getRoomsByMember(@PathVariable String email) {
        List<RoomMember> memberships = roomMemberRepository.findByUserEmail(email);
        List<Long> roomIds = memberships.stream()
                .map(RoomMember::getRoomId)
                .collect(Collectors.toList());
        
        List<Room> rooms = roomRepository.findAllById(roomIds);
        return ResponseEntity.ok(rooms);
    }

    // Get a room by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isPresent()) {
            return ResponseEntity.ok(roomOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    // Create a new room
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        
        // Automatically add the leader as a member
        RoomMember leaderMember = new RoomMember(savedRoom.getId(), savedRoom.getLeaderEmail());
        roomMemberRepository.save(leaderMember);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // Update a room
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();
            room.setName(roomDetails.getName());
            // Only allow changing leader if it's specified
            if (roomDetails.getLeaderEmail() != null) {
                room.setLeaderEmail(roomDetails.getLeaderEmail());
            }
            
            Room updatedRoom = roomRepository.save(room);
            return ResponseEntity.ok(updatedRoom);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    // Delete a room
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return ResponseEntity.ok("Room deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }
    
    // Get members of a room
    @GetMapping("/{id}/members")
    public ResponseEntity<?> getRoomMembers(@PathVariable Long id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        
        List<RoomMember> members = roomMemberRepository.findByRoomId(id);
        List<String> memberEmails = members.stream()
                .map(RoomMember::getUserEmail)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(memberEmails);
    }
    
    // Add a member to a room
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestParam String userEmail) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        
        if (roomMemberRepository.existsByRoomIdAndUserEmail(id, userEmail)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User is already a member of this room");
        }
        
        RoomMember member = new RoomMember(id, userEmail);
        roomMemberRepository.save(member);
        
        return ResponseEntity.status(HttpStatus.CREATED).body("Member added successfully");
    }
    
    // Remove a member from a room
    @DeleteMapping("/{id}/members")
    public ResponseEntity<?> removeMember(@PathVariable Long id, @RequestParam String userEmail) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isPresent() && roomOpt.get().getLeaderEmail().equals(userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot remove the room leader");
        }
        
        if (!roomMemberRepository.existsByRoomIdAndUserEmail(id, userEmail)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User is not a member of this room");
        }
        
        roomMemberRepository.deleteByRoomIdAndUserEmail(id, userEmail);
        
        return ResponseEntity.ok("Member removed successfully");
    }
} 