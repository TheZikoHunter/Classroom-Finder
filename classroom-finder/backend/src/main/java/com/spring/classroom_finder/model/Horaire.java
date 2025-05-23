package com.spring.classroom_finder.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Horaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_horaire;

    private String heure_debut;
    private String heure_fin;
    private String jour;

    public Horaire() {
    }

    public Horaire(String heure_debut, String heure_fin, String jour) {
        this.heure_debut = heure_debut;
        this.heure_fin = heure_fin;
        this.jour = jour;
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

    public String getJour() {
        return jour;
    }

    public void setJour(String jour) {
        this.jour = jour;
    }
}

