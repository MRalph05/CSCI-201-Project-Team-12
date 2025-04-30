package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserManagement userManagement;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("email") String email, @RequestParam("password") String password) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
        
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(password)) {
//                // Update last login time
//                user.setLastLogin(LocalDateTime.now());
//                userRepository.save(user);
//
//                return ResponseEntity.ok(user);
//            }
//        }
        if(userManagement.authenticateUser(email,password)){
            User user=userRepository.findByEmail(email).get();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam("firstname") String fname,@RequestParam("lastname") String lname,@RequestParam("email") String email, @RequestParam("password") String password) {
//        if (userRepository.existsByEmail(user.getEmail())) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
//        }
//
//        User savedUser = userRepository.save(user);
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        User savedUser=userManagement.createNewUser(fname,lname,email,password);
        if(savedUser!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }
    }
    
    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(
            @RequestParam("email") String email, 
            @RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword) {
        
//        Optional<User> userOpt = userRepository.findByEmail(email);
//
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(currentPassword)) {
//                user.setPassword(newPassword);
//                userRepository.save(user);
//                return ResponseEntity.ok("Password updated successfully");
//            } else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
//            }
//        }
//
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        if(userManagement.updatePassword(email,currentPassword,newPassword)){
            return ResponseEntity.status(HttpStatus.OK).body("Password updated successfully");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}