package com.spring.classroom_finder.model;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Professeur {
    @Id
    private int id_professeur;

    private String email;
    private String mot_de_passe;
    private String nom_professeur;
    private String prénom_professeur;

    @OneToMany(mappedBy = "professeur")
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "professeur")
    private List<Matiere> matieres;

    public Professeur(int id_professeur, String email, String mot_de_passe, String nom_professeur, String prénom_professeur, List<Reservation> reservations, List<Matiere> matieres) {
        this.id_professeur = id_professeur;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.nom_professeur = nom_professeur;
        this.prénom_professeur = prénom_professeur;
        this.reservations = reservations;
        this.matieres = matieres;
    }

    public Professeur() {
    }

    public int getId_professeur() {
        return id_professeur;
    }

    public void setId_professeur(int id_professeur) {
        this.id_professeur = id_professeur;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMot_de_passe() {
        return mot_de_passe;
    }

    public void setMot_de_passe(String mot_de_passe) {
        this.mot_de_passe = mot_de_passe;
    }

    public String getNom_professeur() {
        return nom_professeur;
    }

    public void setNom_professeur(String nom_professeur) {
        this.nom_professeur = nom_professeur;
    }

    public String getPrénom_professeur() {
        return prénom_professeur;
    }

    public void setPrénom_professeur(String prénom_professeur) {
        this.prénom_professeur = prénom_professeur;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public List<Matiere> getMatieres() {
        return matieres;
    }

    public void setMatieres(List<Matiere> matieres) {
        this.matieres = matieres;
    }
}
