package com.spring.classroom_finder.model;

import jakarta.persistence.*;

@Entity
public class Salle {
    @Id
    private String nomSalle;




    public Salle(String nom_salle) {
        this.nomSalle = nom_salle;

    }

    public Salle() {
    }

    public String getNomSalle() {
        return nomSalle;
    }

    public void setNomSalle(String nom_salle) {
        this.nomSalle = nom_salle;
    }


}
