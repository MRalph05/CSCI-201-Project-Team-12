public class TestClass
{
	public static void main (String[] args) throws ClassNotFoundException
	{
		TaskManagement tm = new TaskManagement();
		

		
		int[] assignmentIDs = {4, 3};
		boolean taskSuccess = tm.createNewTask("Dishes", "Clean all the Plates and Bowls", 1, assignmentIDs, "Tomorrow (Placeholder)");
		
		if(!taskSuccess)
		{
			System.out.println("Unable to create the new task");
		}
		else
		{
			System.out.println("Task created successfully!");
		}
		
		tm.updateTaskDescription(1, "Wash all the clothes.");
		tm.updateTaskName(1, "Laundry");
		
		int[] newAssignmentIDs = {3};
		if(!tm.changeAssignment(1, newAssignmentIDs, 1))
		{
			System.out.println("The task creator is not the same as the caller of the funciton.");
		}
		
//		tm.deleteTask(1);
		
		tm.completeTask(1);
	
		tm.cleanUp();
	}
}