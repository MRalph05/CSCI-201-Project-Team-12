package com.csci201team12.FinalProjectTeam12.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    List<RoomMember> findByRoomId(Long roomId);
    
    List<RoomMember> findByUserEmail(String userEmail);
    
    boolean existsByRoomIdAndUserEmail(Long roomId, String userEmail);
    
    @Transactional
    void deleteByRoomIdAndUserEmail(Long roomId, String userEmail);
} 