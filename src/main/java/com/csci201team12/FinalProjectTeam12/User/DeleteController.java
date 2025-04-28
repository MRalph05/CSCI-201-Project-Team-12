package com.csci201team12.FinalProjectTeam12.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.sql.*;
@RestController
@RequestMapping()
public class DeleteController {
    @PostMapping("/deleteUser")
    public String deleteU(@RequestParam String username){
        if(UserManagement.deleteUser(username)){
            return "User deleted successfully";
        }
        else{
            return "User could not be deleted";
        }
    }
    
}
