package com.csci201team12.FinalProjectTeam12.Task;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class TaskManagement
{
	Connection connection = null;
	Statement statement = null;
	ResultSet resultSet = null;
	String pass = "";


    TaskManagement() //Constructor
    {
		Scanner keyboard = new Scanner(System.in);
		pass = keyboard.next();
		keyboard.nextLine();
		keyboard.close();
		
		try
		{
			connection = DriverManager.getConnection("jdbc:mysql://localhost/Project?user=root&password=" + pass);
			statement = connection.createStatement();
		}
		catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
		}
    }
    

    boolean assignToTask(int assignmentID, int taskID, int roomID)
    {
        
        // Helper function for createNewTask
    	//Make sure that the assigner actually assigns the task to people in their same room
    	int temp = 0;
    	try
    	{
			resultSet = statement.executeQuery("SELECT roomID FROM Roommates WHERE userID = " + assignmentID + ";");
			if(resultSet.next())
			{
				temp = resultSet.getInt(roomID);
			}
			
			if(temp != roomID)
			{
				System.out.println("User with the userID " + assignmentID + " is not in the same room as this task.");
			}
			else
			{
				statement.executeUpdate("INSERT INTO Assignments (userID, taskID) VALUES ( "+ assignmentID + ", " + taskID + " )" );
			}
		}
    	catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
			return false;
		}
    	

    	return true;
    }

    boolean createNewTask(String taskName, String description, int assignerID, int[] assignmentIDs, String deadline) {
        
		// Adds a task to the task table, assigns all columns.
		// Returns true if successfully created, false if not.
    	try
    	{
	    	resultSet = statement.executeQuery("SELECT roomID FROM Roommates WHERE userID = " + assignerID + ";");
	    	int roomID = 0;
	    	if(resultSet.next())
	    	{
	    		roomID = resultSet.getInt("roomID"); //get from assignerID
	    	}
	    	
	    	resultSet = statement.executeQuery("SELECT t.taskName FROM Tasks t WHERE t.taskName = '"+ taskName + "';");
	    	
	    	while(resultSet.next())
	    	{
	    		if((resultSet.getString("taskName")).equals(taskName))
	    		{
	    			return false;
	    		}
	    	}
	    	
	    	String creationTime = DateAndTime.getDateAndTime();
	    	
	    	statement.executeUpdate(
"INSERT INTO Tasks (roomID, taskName, descript, creatorID, creationTime, deadline, stat) "
+ "VALUES (" + roomID + ", '" + taskName + "' , '" + description + "' ," + assignerID + ", '" + creationTime + "' , '" + deadline + "' ," + false + ");");
	    	
	    	//Should we account for multiple tasks having the same name?
	    	resultSet = statement.executeQuery("SELECT t.taskID FROM Tasks t WHERE t.taskName = '" + taskName + "';");
	    	
	    	int taskID = -1;
	    	if(resultSet.next())
	    	{
	    		taskID = resultSet.getInt("taskID");
	    	}
	    	
	    	for(int i = 0; i < assignmentIDs.length; i++)
	    	{
	    		if(!assignToTask(assignmentIDs[i], taskID, roomID))
	    		{
	    			return false;
	    		}
	    	}
	    		
	    }
    	
    	catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
			return false;
		}
    	
        return true;
    }
    
    
    

    
    
    
    
    
    
    void completeTask(int taskID)
    {
        
        // Assigns true to complete boolean in table entry
    	
    	try
    	{
			statement.executeUpdate("UPDATE Tasks SET stat = " + true + " WHERE taskID = " + taskID + ";");
		}
    	catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
		}
    }

    
    
    
    
    
    void deleteTask(int taskID)
    {
        
        // Remove entry from table
    	
    	try
    	{
    		statement.executeUpdate("DELETE FROM Assignments a WHERE a.taskID = " + taskID + ";");
			statement.executeUpdate("DELETE FROM Tasks t WHERE t.taskID = " + taskID + ";");
		}
    	catch (SQLException sqle)
    	{
    		System.out.println ("SQLException: " + sqle.getMessage());
		}
    }

    
    
    
    boolean changeAssignment(int taskID, int[] newlyAssignedIDs, int calleeID)
    {
        
        // If the calleeID is the same as the assignerID,
        // the task assigned IDs will be replaced with the list in argument
        // Returns true if calleeID matches, false if not
    	
    	try
    	{
	    	resultSet = statement.executeQuery("SELECT creatorID FROM Tasks WHERE taskID = " + taskID + ";");
	    	
	    	int tempCID = 0;
	    	if(resultSet.next())
	    	{
	    		tempCID = resultSet.getInt("creatorID");
	    	}
	    	
	    	if(calleeID != tempCID)
	    	{
	    		return false;
	    	}
	    	else
	    	{
	    		int roomID = -1;
	    		resultSet = statement.executeQuery("SELECT roomID FROM Roommates WHERE userID = " + calleeID + ";");
	    		if(resultSet.next())
	    		{
	    			roomID = resultSet.getInt("roomID");
	    		}
	    		
	    		statement.executeUpdate("DELETE FROM Assignments WHERE taskID = " + taskID + ";");
	    		for(int i = 0; i < newlyAssignedIDs.length; i++)
		    	{
		    		if(!assignToTask(newlyAssignedIDs[i], taskID, roomID))
		    		{
		    			return false;
		    		}
		    	}
	    	}
    	}
    	catch(SQLException sqle)
    	{
    		System.out.println ("SQLException: " + sqle.getMessage());
    	}
    	
    	
    	
        return true;
    }

    
    
    
    void updateTaskName(int taskID, String taskName)
    {
        
        // Replaces this task’s name in the table
    	
    	try
    	{
			statement.executeUpdate("UPDATE Tasks SET taskName = '" + taskName + "' WHERE taskID = " + taskID + ";");
		}
    	catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
		}
    }

    void updateTaskDescription(int taskID, String description)
    {
        
        // Replaces this task’s description in the table
    	
    	try
    	{
			statement.executeUpdate("UPDATE Tasks SET descript = '" + description + "' WHERE taskID = " + taskID + ";");
		}
    	catch (SQLException sqle)
		{
			System.out.println ("SQLException: " + sqle.getMessage());
		}
    }
    
    void cleanUp()
    {
    	try
		{
			if (resultSet != null)
			{
				resultSet.close();
			}
			if (statement != null)
			{
				statement.close();
			}
//			if (preparedStatement != null)
//			{
//				preparedStatement.close();
//			}
			if (connection != null)
			{
				connection.close();
			}
		}
		catch (SQLException sqle)
		{
			System.out.println("sqle: " + sqle.getMessage());
		}
    }

}
