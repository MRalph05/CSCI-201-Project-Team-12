package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
public class RegisterController {

    @PostMapping("/register")
    public String register(@RequestParam("fname") String fname, @RequestParam("lname") String lname, @RequestParam("username") String username, @RequestParam("password") String password) {
        if(UserManagement.createNewUser(fname, lname, username, password)){
            return "success";
        }
        else{
            return "fail";
        }
    }
}