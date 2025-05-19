package com.spring.classroom_finder.model;

import java.time.LocalDateTime;

public class Reservation {
    private int id_reservation;
    private LocalDateTime date_reservation;
    private String remarque;

    public Reservation(int id_reservation, LocalDateTime date_reservation, String remarque) {
        this.id_reservation = id_reservation;
        this.date_reservation = date_reservation;
        this.remarque = remarque;
    }

    public Reservation() {
    }

    public int getId_reservation() {
        return id_reservation;
    }

    public void setId_reservation(int id_reservation) {
        this.id_reservation = id_reservation;
    }

    public LocalDateTime getDate_reservation() {
        return date_reservation;
    }

    public void setDate_reservation(LocalDateTime date_reservation) {
        this.date_reservation = date_reservation;
    }

    public String getRemarque() {
        return remarque;
    }

    public void setRemarque(String remarque) {
        this.remarque = remarque;
    }
}
