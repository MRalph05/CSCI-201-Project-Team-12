package com.csci201team12.FinalProjectTeam12.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csci201team12.FinalProjectTeam12.Room.RoomMemberRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskAssignmentRepository assignmentRepository;
    
    @Autowired
    private RoomMemberRepository roomMemberRepository;

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }
    
    // Get tasks by room ID
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Task>> getTasksByRoom(@PathVariable Long roomId) {
        List<Task> tasks = taskRepository.findByRoomId(roomId);
        return ResponseEntity.ok(tasks);
    }
    
    // Get tasks assigned to a user
    @GetMapping("/assigned/{userEmail}")
    public ResponseEntity<List<Task>> getTasksAssignedToUser(@PathVariable String userEmail) {
        List<TaskAssignment> assignments = assignmentRepository.findByUserEmail(userEmail);
        List<Long> taskIds = assignments.stream()
                .map(TaskAssignment::getTaskId)
                .collect(Collectors.toList());
        
        List<Task> tasks = taskRepository.findAllById(taskIds);
        return ResponseEntity.ok(tasks);
    }
    
    // Get a task by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            return ResponseEntity.ok(taskOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }
    
    // Create a new task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        // Verify the creator is a member of the room
        if (!roomMemberRepository.existsByRoomIdAndUserEmail(task.getRoomId(), task.getCreatorEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Creator must be a member of the room");
        }
        
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }
    
    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            
            // Check if the task belongs to the specified room
            if (taskDetails.getRoomId() != null && !task.getRoomId().equals(taskDetails.getRoomId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot change the room of a task");
            }
            
            // Update task details
            if (taskDetails.getName() != null) {
                task.setName(taskDetails.getName());
            }
            if (taskDetails.getDescription() != null) {
                task.setDescription(taskDetails.getDescription());
            }
            if (taskDetails.getDeadline() != null) {
                task.setDeadline(taskDetails.getDeadline());
            }
            task.setCompleted(taskDetails.isCompleted());
            
            Task updatedTask = taskRepository.save(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }
    
    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.ok("Task deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }
    
    // Get users assigned to a task
    @GetMapping("/{id}/assignees")
    public ResponseEntity<?> getTaskAssignees(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        
        List<TaskAssignment> assignments = assignmentRepository.findByTaskId(id);
        List<String> assigneeEmails = assignments.stream()
                .map(TaskAssignment::getUserEmail)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(assigneeEmails);
    }
    
    // Assign a user to a task
    @PostMapping("/{id}/assignees")
    public ResponseEntity<?> assignUserToTask(@PathVariable Long id, @RequestParam String userEmail) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (!taskOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        
        Task task = taskOpt.get();
        
        // Verify the user is a member of the room
        if (!roomMemberRepository.existsByRoomIdAndUserEmail(task.getRoomId(), userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User must be a member of the room");
        }
        
        if (assignmentRepository.existsByTaskIdAndUserEmail(id, userEmail)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User is already assigned to this task");
        }
        
        TaskAssignment assignment = new TaskAssignment(id, userEmail);
        assignmentRepository.save(assignment);
        
        return ResponseEntity.status(HttpStatus.CREATED).body("User assigned to task successfully");
    }
    
    // Remove a user from a task
    @DeleteMapping("/{id}/assignees")
    public ResponseEntity<?> removeUserFromTask(@PathVariable Long id, @RequestParam String userEmail) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        
        if (!assignmentRepository.existsByTaskIdAndUserEmail(id, userEmail)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User is not assigned to this task");
        }
        
        assignmentRepository.deleteByTaskIdAndUserEmail(id, userEmail);
        
        return ResponseEntity.ok("User removed from task successfully");
    }
} 