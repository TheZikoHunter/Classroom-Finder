package com.spring.classroom_finder.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.spring.classroom_finder.model.Filiere;
import com.spring.classroom_finder.model.Horaire;
import com.spring.classroom_finder.model.Matiere;
import com.spring.classroom_finder.model.Planning;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Salle;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {

    // Find all plannings by professor
    List<Planning> findByProfesseur(Professeur professeur);

    // Find all plannings by filiere (major)
    List<Planning> findByFiliere(Filiere filiere);

    // Find all plannings by professor and time slot
    List<Planning> findByProfesseurAndHoraire(Professeur professeur, Horaire horaire);

    // Find all plannings by classroom and time slot
    List<Planning> findBySalleAndHoraire(Salle salle, Horaire horaire);

    // Find all plannings by filiere and time slot
    List<Planning> findByFiliereAndHoraire(Filiere filiere, Horaire horaire);

    // Find all plannings by time slot
    List<Planning> findByHoraire(Horaire horaire);

    // Custom query to find all distinct filieres (majors) that a professor teaches
    @Query("SELECT DISTINCT p.filiere FROM Planning p WHERE p.professeur = :professeur")
    Set<Filiere> findAllFilieresByProfesseur(@Param("professeur") Professeur professeur);

    // Custom query to find all distinct subjects (matieres) that a professor teaches
    @Query("SELECT DISTINCT p.matiere FROM Planning p WHERE p.professeur = :professeur")
    Set<Matiere> findAllMatieresByProfesseur(@Param("professeur") Professeur professeur);

}