package com.spring.classroom_finder.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Salle {
    @Id
    private String nom_salle;

    @OneToMany(mappedBy = "salle")
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "salle")
    private List<Planning> plannings; // Entité d'association

    public Salle(String nom_salle, List<Reservation> reservations, List<Planning> plannings) {
        this.nom_salle = nom_salle;
        this.reservations = reservations;
        this.plannings = plannings;
    }

    public Salle() {
    }

    public String getNom_salle() {
        return nom_salle;
    }

    public void setNom_salle(String nom_salle) {
        this.nom_salle = nom_salle;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public List<Planning> getPlannings() {
        return plannings;
    }

    public void setPlannings(List<Planning> plannings) {
        this.plannings = plannings;
    }
}
