package com.csci201team12.FinalProjectTeam12.User;

import java.sql.*;

public class UserManagement {
    static boolean authenticateUser(String email, String password) {
        // TO DO
        // if User credentials have a match in database, return true
        // else return false

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/UserData", "root", "Iriganlc");
            String sql = "SELECT * FROM UserTable WHERE username = ? AND password = ?";
            preparedStatement = con.prepareStatement(sql);
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);

            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                try {
                    if (resultSet != null)
                        resultSet.close();
                    if (preparedStatement != null)
                        preparedStatement.close();
                    if (con != null)
                        con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                return true;
            } else {
                try {
                    if (resultSet != null)
                        resultSet.close();
                    if (preparedStatement != null)
                        preparedStatement.close();
                    if (con != null)
                        con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                return false;
            }

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
        // return true;
    }

    static boolean createNewUser(String fname, String name, String email, String password) {
        // TO DO
        // Adds to the User database using these parameters

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/UserData", "root", "Iriganlc");
            String existsSQL = "SELECT 1 FROM UserTable WHERE username = ?;";
            preparedStatement = con.prepareStatement(existsSQL);
            preparedStatement.setString(1, email);

            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                String sql = "INSERT INTO UserTable (fname, lname, username, password) VALUES (?, ?, ?, ?);";
                preparedStatement = con.prepareStatement(sql);
                preparedStatement.setString(1, fname);
                preparedStatement.setString(2, name);
                preparedStatement.setString(3, email);
                preparedStatement.setString(4, password);
                preparedStatement.execute();
                try {
                    if (resultSet != null)
                        resultSet.close();
                    if (preparedStatement != null)
                        preparedStatement.close();
                    if (con != null)
                        con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                return true;
            } else {
                try {
                    if (resultSet != null)
                        resultSet.close();
                    if (preparedStatement != null)
                        preparedStatement.close();
                    if (con != null)
                        con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                return false;
            }

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    void updatePassword(String email, String password) {
        // TO DO
        // Replaces user’s former password with new one in database
    }

    void deleteUser(String email) {
        // TO DO
        // Removes the User with the email from the database
    }
}

