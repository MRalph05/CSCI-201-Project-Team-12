package com.csci201team12.FinalProjectTeam12.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByTaskId(Long taskId);
    
    List<TaskAssignment> findByUserEmail(String userEmail);
    
    boolean existsByTaskIdAndUserEmail(Long taskId, String userEmail);
    
    void deleteByTaskIdAndUserEmail(Long taskId, String userEmail);
} 