package com.spring.classroom_finder.model;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Horaire {
    @Id
    private int id_horaire;

    private LocalDateTime heure_debut;
    private LocalDateTime heure_fin;

    @OneToMany(mappedBy = "horaire")
    private List<Planning> plannings;

    public Horaire(int id_horaire, LocalDateTime heure_debut, LocalDateTime heure_fin, List<Planning> plannings) {
        this.id_horaire = id_horaire;
        this.heure_debut = heure_debut;
        this.heure_fin = heure_fin;
        this.plannings = plannings;
    }

    public Horaire() {
    }

    public int getId_horaire() {
        return id_horaire;
    }

    public void setId_horaire(int id_horaire) {
        this.id_horaire = id_horaire;
    }

    public LocalDateTime getHeure_debut() {
        return heure_debut;
    }

    public void setHeure_debut(LocalDateTime heure_debut) {
        this.heure_debut = heure_debut;
    }

    public LocalDateTime getHeure_fin() {
        return heure_fin;
    }

    public void setHeure_fin(LocalDateTime heure_fin) {
        this.heure_fin = heure_fin;
    }

    public List<Planning> getPlannings() {
        return plannings;
    }

    public void setPlannings(List<Planning> plannings) {
        this.plannings = plannings;
    }
}

