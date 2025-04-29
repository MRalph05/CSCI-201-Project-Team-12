package com.csci201team12.FinalProjectTeam12.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByRoomId(Long roomId);
    
    List<Task> findByCreatorEmail(String creatorEmail);
} 