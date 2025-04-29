package com.csci201team12.FinalProjectTeam12.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserEmail(String userEmail);
    
    List<Friend> findByFriendEmail(String friendEmail);
    
    boolean existsByUserEmailAndFriendEmail(String userEmail, String friendEmail);
} 