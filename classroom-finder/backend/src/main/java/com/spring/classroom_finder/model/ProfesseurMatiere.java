package com.spring.classroom_finder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "professeur_matiere")
public class ProfesseurMatiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_professeur", nullable = false)
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "id_matiere", nullable = false)
    private Matiere matiere;

    // Constructors
    public ProfesseurMatiere() {}

    public ProfesseurMatiere(Professeur professeur, Matiere matiere) {
        this.professeur = professeur;
        this.matiere = matiere;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Professeur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Professeur professeur) {
        this.professeur = professeur;
    }

    public Matiere getMatiere() {
        return matiere;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfesseurMatiere that = (ProfesseurMatiere) o;
        return professeur.equals(that.professeur) && matiere.equals(that.matiere);
    }

    @Override
    public int hashCode() {
        return professeur.hashCode() + matiere.hashCode();
    }
}
