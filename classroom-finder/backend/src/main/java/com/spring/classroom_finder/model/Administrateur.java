package com.spring.classroom_finder.model;
import jakarta.persistence.*;

@Entity
public class Administrateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_administrateur;
    private String email;
    private String mot_de_passe;
    private String nom;
    private String prenom;



    public Administrateur(int id_administrateur, String email, String mot_de_passe, String nom, String prenom) {
        this.id_administrateur = id_administrateur;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.nom = nom;
        this.prenom = prenom;
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


}
