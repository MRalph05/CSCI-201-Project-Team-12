package com.csci201team12.FinalProjectTeam12.guest;

import jakarta.persistence.*;

@Entity
@Table(name = "guests")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int guestID;

    private Integer guestRoomID;

    @Column(length = 1000)
    private String guestTasks;

    // Getter and Setter for guestID
    public int getGuestID() {
        return guestID;
    }

    public void setGuestID(int guestID) {
        this.guestID = guestID;
    }

    // Getter and Setter for guestRoomID
    public Integer getGuestRoomID() {
        return guestRoomID;
    }

    public void setGuestRoomID(Integer guestRoomID) {
        this.guestRoomID = guestRoomID;
    }

    // Getter and Setter for guestTasks
    public String getGuestTasks() {
        return guestTasks;
    }

    public void setGuestTasks(String guestTasks) {
        this.guestTasks = guestTasks;
    }
}
