package com.spring.classroom_finder.model;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Administrateur {
    @Id
    private int id_administrateur;
    private String email;
    private String mot_de_passe;
    private String nom;
    private String prenom;

    @OneToMany(mappedBy = "administrateur")
    private List<Reservation> reservations;

    public Administrateur(int id_administrateur, String email, String mot_de_passe, String nom, String prenom, List<Reservation> reservations) {
        this.id_administrateur = id_administrateur;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.nom = nom;
        this.prenom = prenom;
        this.reservations = reservations;
    }

    public Administrateur() {
    }

    public int getId_administrateur() {
        return id_administrateur;
    }

    public void setId_administrateur(int id_administrateur) {
        this.id_administrateur = id_administrateur;
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



    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }


    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }
}
