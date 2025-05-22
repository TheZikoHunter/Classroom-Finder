package com.spring.classroom_finder.model;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Matiere {
    @Id
    private int id;

    private String nomMatiere;


    public Matiere() {
    }

    public Matiere(int id, String nom_matière, Professeur professeur, Filiere filiere, List<Planning> plannings) {
        this.id = id;
        this.nomMatiere = nom_matière;

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNomMatiere() {
        return nomMatiere;
    }

    public void setNomMatiere(String nom_matière) {
        this.nomMatiere = nom_matière;
    }

}
