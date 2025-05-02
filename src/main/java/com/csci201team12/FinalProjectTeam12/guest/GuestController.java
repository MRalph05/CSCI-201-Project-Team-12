package com.csci201team12.FinalProjectTeam12.guest;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/guest")
@CrossOrigin(origins = "http://localhost:3000")
public class GuestController {

    @Autowired
    private GuestService guestService;

    @PostMapping("/create")
    public ResponseEntity<?> createGuest() {
        Guest newGuest = guestService.createGuest();
        return ResponseEntity.ok().body(Map.of("guestID", newGuest.getGuestID()));
    }

    @PostMapping("/createTask")
    public ResponseEntity<String> createTask(@RequestParam int guestID, @RequestParam String taskName) {
        guestService.createTask(guestID, taskName);
        return ResponseEntity.ok("Task created");
    }

    @PostMapping("/completeTask")
    public ResponseEntity<String> completeTask(@RequestParam int guestID, @RequestParam String taskName) {
        guestService.completeTask(guestID, taskName);
        return ResponseEntity.ok("Task completed");
    }
    
    @PostMapping("/deleteTask")
    public ResponseEntity<String> deleteTask(@RequestParam int guestID, @RequestParam String taskName) {
        guestService.deleteTask(guestID, taskName);
        return ResponseEntity.ok("Task deleted");
    }

    @PostMapping("/addTutorialTask")
    public ResponseEntity<String> addTutorialTask(@RequestParam int guestID) {
        guestService.addTutorialTask(guestID);
        return ResponseEntity.ok("Tutorial task added");
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getTasks(@RequestParam int guestID) {
        Guest guest = guestService.getGuestOrThrow(guestID);
        String raw = guest.getGuestTasks();
        if (raw == null || raw.isBlank()) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(Arrays.asList(raw.split(",")));
    }
}
