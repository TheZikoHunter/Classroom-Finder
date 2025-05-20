package com.spring.classroom_finder.model;


import jakarta.persistence.*;
import java.util.List;

@Entity
public class Filiere {
    @Id
    private int id_filiere;

    private int email_représentant;
    private String nom_filiere;

    public Filiere() {
    }

    public Filiere(int id_filiere, int email_représentant, String nom_filiere) {
        this.id_filiere = id_filiere;
        this.email_représentant = email_représentant;
        this.nom_filiere = nom_filiere;
    }

    public int getId_filiere() {
        return id_filiere;
    }

    public void setId_filiere(int id_filiere) {
        this.id_filiere = id_filiere;
    }


    public int getEmail_représentant() {
        return email_représentant;
    }

    public void setEmail_représentant(int email_représentant) {
        this.email_représentant = email_représentant;
    }

    public String getNom_filiere() {
        return nom_filiere;
    }

    public void setNom_filiere(String nom_filiere) {
        this.nom_filiere = nom_filiere;
    }


}
