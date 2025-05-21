package com.spring.classroom_finder.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "plannings")
public class Planning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlanning;

    @ManyToOne
    @JoinColumn(name = "nomSalle", nullable = false)
    private Salle salle;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private Matiere matiere;

    @ManyToOne
    @JoinColumn(name = "id_horaire", nullable = false)
    private Horaire horaire;

    @ManyToOne
    @JoinColumn(name = "id_professeur", nullable = false)
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "idFiliere", nullable = false)
    private Filiere filiere;

    // Constructors
    public Planning() {
    }

    public Planning(Salle salle, Matiere matiere, Horaire horaire, Professeur professeur, Filiere filiere) {
        this.salle = salle;
        this.matiere = matiere;
        this.horaire = horaire;
        this.professeur = professeur;
        this.filiere = filiere;
    }


    public Salle getSalle() {
        return salle;
    }

    public Long getIdPlanning() {
        return idPlanning;
    }

    public void setIdPlanning(Long idPlanning) {
        this.idPlanning = idPlanning;
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

    // Equals and hashCode methods for conflict validation
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Planning planning = (Planning) o;
        return Objects.equals(idPlanning, planning.idPlanning);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPlanning);
    }

    // Method to check if this planning conflicts with another planning
    public boolean conflictsWith(Planning other) {
        // If it's the same time slot
        if (this.horaire.equals(other.horaire)) {
            // Check if same professor (professor can't be in two places at once)
            if (this.professeur.equals(other.professeur)) {
                return true;
            }

            // Check if same classroom (classroom can't host two classes at once)
            if (this.salle.equals(other.salle)) {
                return true;
            }

            // Check if same filiere at the same time (a major can't have two classes at once)
            if (this.filiere.equals(other.filiere)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public String toString() {
        return "Planning{" +
                "id=" + idPlanning +
                ", salle=" + salle +
                ", matiere=" + matiere +
                ", horaire=" + horaire +
                ", professeur=" + professeur +
                ", filiere=" + filiere +
                '}';
    }

    /**
     * Check if this planning has scheduling conflicts with the provided list of plannings
     *
     * @param existingPlannings List of existing plannings to check against
     * @return true if there's a conflict, false otherwise
     */
    public boolean hasConflictWith(List<Planning> existingPlannings) {
        // Filter out this planning if it has an ID (for update operations)
        return existingPlannings.stream()
                .filter(p -> this.getIdPlanning() == null || !this.getIdPlanning().equals(p.getIdPlanning()))
                .anyMatch(this::conflictsWith);
    }
}