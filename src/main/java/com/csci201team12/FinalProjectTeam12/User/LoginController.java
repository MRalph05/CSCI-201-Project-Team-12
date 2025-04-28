package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.sql.*;

@RestController
@RequestMapping()
public class LoginController {
    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {
        if(UserManagement.authenticateUser(username, password)){
            return "success";
        }
        else{
            return "fail";
        }
    }
//    private boolean isValid(String email, String password) {
//
//        PreparedStatement preparedStatement = null;
//        ResultSet resultSet = null;
//
//        try {
//            Class.forName("com.mysql.cj.jdbc.Driver");
//            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/UserData", "root", "Iriganlc");
//            String sql = "SELECT * FROM UserTable WHERE username = ? AND password = ?";
//            preparedStatement = con.prepareStatement(sql);
//            preparedStatement.setString(1, email);
//            preparedStatement.setString(2, password);
//
//            resultSet = preparedStatement.executeQuery();
//            if (resultSet.next()) {
//                try {
//                    if (resultSet != null)
//                        resultSet.close();
//                    if (preparedStatement != null)
//                        preparedStatement.close();
//                    if (con != null)
//                        con.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//                return true;
//            } else {
//                try {
//                    if (resultSet != null)
//                        resultSet.close();
//                    if (preparedStatement != null)
//                        preparedStatement.close();
//                    if (con != null)
//                        con.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//                return false;
//            }
//
//        }
//        catch(ClassNotFoundException e)  {
//            e.printStackTrace();
//            return false;
//        }
//        catch (SQLException e) {
//            e.printStackTrace();
//            return false;
//        }
//
//    }

}