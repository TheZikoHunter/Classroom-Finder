package com.spring.classroom_finder.model;
import jakarta.persistence.*;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Horaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_horaire;

    private String heure_debut;
    private String heure_fin;
    private String day;

;

    public Horaire(int id_horaire, String heure_debut, String heure_fin, String day) {
        this.id_horaire = id_horaire;
        this.heure_debut = heure_debut;
        this.heure_fin = heure_fin;
        this.day = day;
    }

    public Horaire() {
    }

    public int getId_horaire() {
        return id_horaire;
    }

    public void setId_horaire(int id_horaire) {
        this.id_horaire = id_horaire;
    }

    public String getHeure_debut() {
        return heure_debut;
    }

    public void setHeure_debut(String heure_debut) {
        this.heure_debut = heure_debut;
    }

    public String getHeure_fin() {
        return heure_fin;
    }

    public void setHeure_fin(String heure_fin) {
        this.heure_fin = heure_fin;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }
}

