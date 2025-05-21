package com.spring.classroom_finder.model;


import jakarta.persistence.*;
import java.util.List;

@Entity
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idFiliere;

    private String email_representant;
    private String nomFiliere;

    public Filiere() {
    }

    public Filiere(int idFiliere, String email_representant, String nomFiliere) {
        this.idFiliere = idFiliere;
        this.email_representant = email_representant;
        this.nomFiliere = nomFiliere;
    }

    public int getIdFiliere() {
        return idFiliere;
    }

    public void setIdFiliere(int idFiliere) {
        this.idFiliere = idFiliere;
    }


    public String getemail_representant() {
        return email_representant;
    }

    public void setemail_representant(String email_representant) {
        this.email_representant = email_representant;
    }

    public String getNomFiliere() {
        return nomFiliere;
    }

    public void setNomFiliere(String nomFiliere) {
        this.nomFiliere = nomFiliere;
    }


}
