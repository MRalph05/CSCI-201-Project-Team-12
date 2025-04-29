package com.csci201team12.FinalProjectTeam12.Room;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_invitations")
public class RoomInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long roomId;
    
    @Column(nullable = false)
    private String inviterEmail;
    
    @Column(nullable = false)
    private String inviteeEmail;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime respondedAt;
    
    @Column
    private Boolean accepted;
    
    public RoomInvitation() {
        this.createdAt = LocalDateTime.now();
    }
    
    public RoomInvitation(Long roomId, String inviterEmail, String inviteeEmail) {
        this.roomId = roomId;
        this.inviterEmail = inviterEmail;
        this.inviteeEmail = inviteeEmail;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getRoomId() {
        return roomId;
    }
    
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
    
    public String getInviterEmail() {
        return inviterEmail;
    }
    
    public void setInviterEmail(String inviterEmail) {
        this.inviterEmail = inviterEmail;
    }
    
    public String getInviteeEmail() {
        return inviteeEmail;
    }
    
    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }
    
    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
    
    public Boolean getAccepted() {
        return accepted;
    }
    
    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }
} 