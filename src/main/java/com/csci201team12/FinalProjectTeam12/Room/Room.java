package com.csci201team12.FinalProjectTeam12.Room;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String leaderEmail;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public Room() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Room(String name, String leaderEmail) {
        this.name = name;
        this.leaderEmail = leaderEmail;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLeaderEmail() {
        return leaderEmail;
    }
    
    public void setLeaderEmail(String leaderEmail) {
        this.leaderEmail = leaderEmail;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 