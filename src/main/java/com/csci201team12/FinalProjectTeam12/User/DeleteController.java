package com.csci201team12.FinalProjectTeam12.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.sql.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class DeleteController {
    @Autowired
    private UserManagement userManagement;

    @PostMapping("/deleteUser")
    ResponseEntity<String> deleteUser(@RequestParam("email") String email) {
        if(userManagement.deleteUser(email)) {
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }


}
