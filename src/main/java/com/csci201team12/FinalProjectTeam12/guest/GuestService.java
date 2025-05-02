package com.csci201team12.FinalProjectTeam12.guest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepo;

    public Guest createGuest() {
        Guest guest = new Guest();
        guest.setGuestTasks("");
        return guestRepo.save(guest);
    }

    public void createTask(int guestID, String taskName) {
        Guest guest = getGuestOrThrow(guestID);
        String current = guest.getGuestTasks();
//        if (!current.isEmpty()) current += ",";
        if(current!=null && Arrays.asList(current.split(",")).contains(taskName)) {
            throw new IllegalArgumentException("Task name already exists");
        }
        if(current==null || current.isBlank()) {
            guest.setGuestTasks(taskName);
        }
        else{
            guest.setGuestTasks(current+","+taskName);
        }
//        guest.setGuestTasks(current + taskName);
        guestRepo.save(guest);
    }
    private String removeTask(String tasks, String task){
        return Arrays.stream(tasks.split(",")).map(String::trim).collect(Collectors.joining(","));
    }

    public void completeTask(int guestID, String taskName) {
        Guest guest = getGuestOrThrow(guestID);
//        String updatedTasks = Arrays.stream(guest.getGuestTasks().split(","))
//                .filter(task -> !task.trim().equals(taskName))
//                .collect(Collectors.joining(","));
        guest.setGuestTasks(removeTask(guest.getGuestTasks(), taskName));
        guestRepo.save(guest);
    }
    
    public void deleteTask(int guestID, String taskName) {
        Guest guest = getGuestOrThrow(guestID);
//        String updatedTasks = Arrays.stream(guest.getGuestTasks().split(","))
//                .filter(task -> !task.trim().equals(taskName))
//                .collect(Collectors.joining(","));
        guest.setGuestTasks(removeTask(guest.getGuestTasks(), taskName));
        guestRepo.save(guest);
    }

    public void addTutorialTask(int guestID) {
        createTask(guestID, "Tutorial task");
    }

    public void deleteGuest(int guestID) {
        guestRepo.deleteById(guestID);
    }

    public Guest getGuestOrThrow(int guestID) {
        return guestRepo.findById(guestID).orElseThrow(() -> new IllegalArgumentException("Guest not found"));
    }
}
