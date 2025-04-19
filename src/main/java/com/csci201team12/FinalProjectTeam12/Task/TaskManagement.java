package com.csci201team12.FinalProjectTeam12.Task;

public class TaskManagement {
    TaskManagement() {

    }

    void assignToTask(String assignmentEmail, String taskName) {
        // TO DO
        // Helper function for createNewTask
    }

    boolean createNewTask(String taskName, String description, String assignerEmail, String[] assignmentEmails) {
        // TO DO
        // Adds a task to the task table, assigns name column.
        // Pulls relevant user first and last names from database and assigns to task
        // Returns true if successfully created, false if not.
        return true;
    }

    void completeTask(String taskName, int taskID) {
        // TO DO
        // Assigns true to complete boolean in table entry
    }

    void deleteTask(String taskName, int taskID) {
        // TO DO
        // Remove entry from table
    }

    boolean changeAssignment(String taskName, String[] newlyAssignedEmails, String calleeEmail) {
        // TO DO
        // If the callee Email is the same as the assignerEmail,
        // the task assigned emails will be replaced with the list in argument
        // Returns true if calleeEmail matches, false if not
        return true;
    }

    void updateTaskName(int taskID, String taskName) {
        // TO DO
        // Replaces this task’s name in the table
    }

    void updateTaskDescription(int taskID, String description) {
        // TO DO
        // Replaces this task’s description in the table
    }

}
