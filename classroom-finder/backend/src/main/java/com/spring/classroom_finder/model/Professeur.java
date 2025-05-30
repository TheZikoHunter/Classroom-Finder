package com.spring.classroom_finder.model;
import jakarta.persistence.*;

@Entity
public class Professeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_professeur;

    private String email;
    private String mot_de_passe;
    private String nomProfesseur;
    private String prenomProfesseur;



    public Professeur(int id_professeur, String email, String mot_de_passe, String nom_professeur, String prénom_professeur) {
        this.id_professeur = id_professeur;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.nomProfesseur = nom_professeur;
        this.prenomProfesseur = prénom_professeur;

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

    public String getNomProfesseur() {
        return nomProfesseur;
    }

    public void setNomProfesseur(String nom_professeur) {
        this.nomProfesseur = nom_professeur;
    }

    public String getPrenomProfesseur() {
        return prenomProfesseur;
    }

    public void setPrenomProfesseur(String prénom_professeur) {
        this.prenomProfesseur = prénom_professeur;
    }

}
