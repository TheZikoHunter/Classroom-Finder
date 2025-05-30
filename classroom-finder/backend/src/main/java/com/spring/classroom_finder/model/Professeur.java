package com.spring.classroom_finder.model;
import jakarta.persistence.*;

@Entity
@Table(name = "professeur")
public class Professeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_professeur")
    private int idProfesseur;

    private String email;
    @Column(name = "mot_de_passe")
    private String motDePasse;
    @Column(name = "nom_professeur")
    private String nomProfesseur;
    @Column(name = "prenom_professeur")
    private String prenomProfesseur;



    public Professeur(int idProfesseur, String email, String motDePasse, String nomProfesseur, String prenomProfesseur) {
        this.idProfesseur = idProfesseur;
        this.email = email;
        this.motDePasse = motDePasse;
        this.nomProfesseur = nomProfesseur;
        this.prenomProfesseur = prenomProfesseur;

    }

    public Professeur() {
    }

    public int getId_professeur() {
        return idProfesseur;
    }

    public void setId_professeur(int idProfesseur) {
        this.idProfesseur = idProfesseur;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMot_de_passe() {
        return motDePasse;
    }

    public void setMot_de_passe(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getNomProfesseur() {
        return nomProfesseur;
    }

    public void setNomProfesseur(String nomProfesseur) {
        this.nomProfesseur = nomProfesseur;
    }

    public String getPrenomProfesseur() {
        return prenomProfesseur;
    }

    public void setPrenomProfesseur(String prenomProfesseur) {
        this.prenomProfesseur = prenomProfesseur;
    }

}
