package com.spring.classroom_finder.model;
import jakarta.persistence.*;
@Entity
public class Planning {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Salle salle;

    @ManyToOne
    private Matiere matiere;

    @ManyToOne
    private Horaire horaire;

    public Planning() {
    }

    public Planning(Long id, Salle salle, Matiere matiere, Horaire horaire) {
        this.id = id;
        this.salle = salle;
        this.matiere = matiere;
        this.horaire = horaire;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Salle getSalle() {
        return salle;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
    }

    public Matiere getMatiere() {
        return matiere;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    public Horaire getHoraire() {
        return horaire;
    }

    public void setHoraire(Horaire horaire) {
        this.horaire = horaire;
    }
}
