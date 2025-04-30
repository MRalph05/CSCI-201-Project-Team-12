package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.*;
import java.util.Optional;
@Service
public class UserManagement {

    @Autowired
    private UserRepository userRepository;

    public boolean authenticateUser(String email, String password) {
        // TO DO
        // if User credentials have a match in database, return true
        // else return false

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
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//            return false;
//        } catch (SQLException e) {
//            e.printStackTrace();
//            return false;
//        }
        // return true;
        Optional<User> userList=userRepository.findByEmail(email);
        return userList.map(user -> user.getPassword().equals(password)).orElse(false);
    }

    public User createNewUser(String fname, String lname, String email, String password) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            return null; // Email already exists
        }
        
        // Create new user
        User newUser = new User(fname, lname, email, password);
        return userRepository.save(newUser);
    }

    public boolean updatePassword(String email, String oldPassword,String newPassword) {
        // TO DO
        // Replaces user's former password with new one in database
//        PreparedStatement preparedStatement = null;
//        int update=0;
//        try{
//            Class.forName("com.mysql.cj.jdbc.Driver");
//            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/UserData", "root", "Iriganlc");
//            String updateSQL = "UPDATE UserTable SET password = ? WHERE username = ?;";
//            preparedStatement= con.prepareStatement(updateSQL);
//            preparedStatement.setString(1,password);
//            preparedStatement.setString(2,email);
//            update= preparedStatement.executeUpdate();
//            if(update==1){
//                try {
//                    if (preparedStatement != null)
//                        preparedStatement.close();
//                    if (con != null)
//                        con.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//                return true;
//            }
//            else{
//                try {
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
//        catch(ClassNotFoundException e){
//            e.printStackTrace();
//            return false;
//        }
//        catch(SQLException e){
//            e.printStackTrace();
//            return false;
//        }
        Optional<User> user=userRepository.findByEmail(email);
        if (user.isPresent()) {
            User u=user.get();
            if(u.getPassword().equals(oldPassword)) {
                u.setPassword(newPassword);
                userRepository.save(u);
                return true;
            }
        }
        return false;
    }

   public boolean deleteUser(String email) {
//        PreparedStatement preparedStatement = null;
//        ResultSet resultSet = null;
//        int update=0;
//        try{
//            Class.forName("com.mysql.cj.jdbc.Driver");
//            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/UserData", "root", "Iriganlc");
//            String deleteSQL = "DELETE FROM UserTable WHERE username = ?;";
//            preparedStatement=con.prepareStatement(deleteSQL);
//            preparedStatement.setString(1,email);
//            update=preparedStatement.executeUpdate();
//            if(update==1){
//                try {
//                    if (preparedStatement != null)
//                        preparedStatement.close();
//                    if (con != null)
//                        con.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//                return true;
//            }
//            else{
//                try {
//                    if (preparedStatement != null)
//                        preparedStatement.close();
//                    if (con != null)
//                        con.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//                return false;
//            }
//        }
//        catch(ClassNotFoundException e){
//            e.printStackTrace();
//            return false;
//        }
//        catch(SQLException e){
//            e.printStackTrace();
//            return false;
//        }
//    }
       Optional<User> userList=userRepository.findByEmail(email);
       if(userList.isPresent()){
       userRepository.delete(userList.get());
       return true;
       }
       return false;
   }
}


