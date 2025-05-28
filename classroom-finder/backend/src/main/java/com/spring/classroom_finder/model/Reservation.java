package com.spring.classroom_finder.model;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idReservation;

    @ManyToOne
    @JoinColumn(name = "nomSalle", nullable = false)
    private Salle salle;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private Matiere matiere;

    @ManyToOne
    @JoinColumn(name = "idHoraire", nullable = false)
    private Horaire horaire;

    @ManyToOne
    @JoinColumn(name = "id_professeur", nullable = false)
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "idFiliere", nullable = false)
    private Filiere filiere;

    private LocalDate reservationDate;

    // Constructors
    public Reservation() {
    }

    public Reservation(Salle salle, Matiere matiere, Horaire horaire, Professeur professeur, Filiere filiere, LocalDate reservationDate) {
        this.salle = salle;
        this.matiere = matiere;
        this.horaire = horaire;
        this.professeur = professeur;
        this.filiere = filiere;
        this.reservationDate = reservationDate;
    }

    // Getters and Setters
    public long getIdReservation() {
        return idReservation;
    }

    public void setIdReservation(long idReservation) {
        this.idReservation = idReservation;
    }

    public Salle getSalle() {
        return salle;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
    }

    public Matiere getMatiere() {
        return matiere;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    public Horaire getHoraire() {
        return horaire;
    }

    public void setHoraire(Horaire horaire) {
        this.horaire = horaire;
    }

    public Professeur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Professeur professeur) {
        this.professeur = professeur;
    }

    public Filiere getFiliere() {
        return filiere;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }

    // Equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reservation that = (Reservation) o;
        return Objects.equals(idReservation, that.idReservation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idReservation);
    }

    // Method to check if this reservation conflicts with another reservation
    public boolean conflictsWith(Reservation other) {
        // If it's the same time slot and date
        if (this.horaire.equals(other.horaire) && this.reservationDate.equals(other.reservationDate)) {
            // Check if same professor (professor can't be in two places at once)
            if (this.professeur.equals(other.professeur)) {
                return true;
            }

            // Check if same classroom (classroom can't host two classes at once)
            if (this.salle.equals(other.salle)) {
                return true;
            }

            // Check if same filiere at the same time (a major can't have two classes at once)
            if (this.filiere.equals(other.filiere)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + idReservation +
                ", salle=" + salle +
                ", matiere=" + matiere +
                ", horaire=" + horaire +
                ", professeur=" + professeur +
                ", filiere=" + filiere +
                ", reservationDate=" + reservationDate +
                '}';
    }
} 