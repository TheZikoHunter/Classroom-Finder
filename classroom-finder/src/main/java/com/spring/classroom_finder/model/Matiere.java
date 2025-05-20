package com.spring.classroom_finder.model;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Matiere {
    @Id
    @GeneratedValue
    private Long id;

    private String nom_matière;


    public Matiere() {
    }

    public Matiere(Long id, String nom_matière, Professeur professeur, Filiere filiere, List<Planning> plannings) {
        this.id = id;
        this.nom_matière = nom_matière;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom_matière() {
        return nom_matière;
    }

    public void setNom_matière(String nom_matière) {
        this.nom_matière = nom_matière;
    }

}
