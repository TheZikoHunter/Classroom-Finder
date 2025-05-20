package com.spring.classroom_finder.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Salle {
    @Id
    private String nomSalle;


    @OneToMany(mappedBy = "salle")
    private List<Planning> plannings; // Entité d'association

    public Salle(String nom_salle, List<Planning> plannings) {
        this.nomSalle = nom_salle;

        this.plannings = plannings;
    }

    public Salle() {
    }

    public String getNomSalle() {
        return nomSalle;
    }

    public void setNomSalle(String nom_salle) {
        this.nomSalle = nom_salle;
    }


    public List<Planning> getPlannings() {
        return plannings;
    }

    public void setPlannings(List<Planning> plannings) {
        this.plannings = plannings;
    }
}
