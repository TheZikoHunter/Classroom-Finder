package com.spring.classroom_finder.model;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Matiere {
    @Id
    @GeneratedValue
    private Long id;

    private String nom_matière;

    @ManyToOne
    @JoinColumn(name = "id_professeur")
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "id_filiere")
    private Filiere filiere;

    @OneToMany(mappedBy = "matiere")
    private List<Planning> plannings;

    public Matiere() {
    }

    public Matiere(Long id, String nom_matière, Professeur professeur, Filiere filiere, List<Planning> plannings) {
        this.id = id;
        this.nom_matière = nom_matière;
        this.professeur = professeur;
        this.filiere = filiere;
        this.plannings = plannings;
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

    public List<Planning> getPlannings() {
        return plannings;
    }

    public void setPlannings(List<Planning> plannings) {
        this.plannings = plannings;
    }
}
