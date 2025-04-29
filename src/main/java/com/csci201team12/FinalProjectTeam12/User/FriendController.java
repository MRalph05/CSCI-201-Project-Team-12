package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:3000")
public class FriendController {

    @Autowired
    private FriendRepository friendRepository;

    // Get all friends for a user
    @GetMapping("/{userEmail}")
    public ResponseEntity<List<String>> getFriends(@PathVariable String userEmail) {
        List<Friend> friends = friendRepository.findByUserEmail(userEmail);
        List<String> friendEmails = friends.stream()
                .map(Friend::getFriendEmail)
                .collect(Collectors.toList());
        return ResponseEntity.ok(friendEmails);
    }

    // Add a friend
    @PostMapping("/add")
    public ResponseEntity<?> addFriend(@RequestParam String userEmail, @RequestParam String friendEmail) {
        // Check if the friendship already exists
        if (friendRepository.existsByUserEmailAndFriendEmail(userEmail, friendEmail)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Friendship already exists");
        }

        Friend friend = new Friend(userEmail, friendEmail);
        friendRepository.save(friend);
        
        // Create the reverse friendship as well (bidirectional)
        Friend reverseFriend = new Friend(friendEmail, userEmail);
        friendRepository.save(reverseFriend);

        return ResponseEntity.status(HttpStatus.CREATED).body("Friend added successfully");
    }

    // Remove a friend
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam String userEmail, @RequestParam String friendEmail) {
        List<Friend> friends = friendRepository.findByUserEmail(userEmail);
        for (Friend friend : friends) {
            if (friend.getFriendEmail().equals(friendEmail)) {
                friendRepository.delete(friend);
            }
        }
        
        // Remove the reverse friendship as well
        List<Friend> reverseFriends = friendRepository.findByUserEmail(friendEmail);
        for (Friend friend : reverseFriends) {
            if (friend.getFriendEmail().equals(userEmail)) {
                friendRepository.delete(friend);
            }
        }
        
        return ResponseEntity.ok("Friend removed successfully");
    }
} 