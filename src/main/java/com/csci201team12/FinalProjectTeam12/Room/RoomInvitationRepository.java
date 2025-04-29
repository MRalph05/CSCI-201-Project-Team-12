package com.csci201team12.FinalProjectTeam12.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInvitationRepository extends JpaRepository<RoomInvitation, Long> {
    List<RoomInvitation> findByInviteeEmail(String inviteeEmail);
    
    List<RoomInvitation> findByInviteeEmailAndAcceptedIsNull(String inviteeEmail);
    
    List<RoomInvitation> findByRoomId(Long roomId);
    
    Optional<RoomInvitation> findByRoomIdAndInviteeEmail(Long roomId, String inviteeEmail);
    
    boolean existsByRoomIdAndInviteeEmailAndAcceptedIsNull(Long roomId, String inviteeEmail);
} 