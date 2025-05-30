package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.ProfesseurMatiere;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProfesseurMatiereRepository extends JpaRepository<ProfesseurMatiere, Long> {
    
    @Query("SELECT pm.matiere FROM ProfesseurMatiere pm WHERE pm.professeur = :professeur")
    Set<Matiere> findMatieresByProfesseur(@Param("professeur") Professeur professeur);
    
    @Query("SELECT pm.professeur FROM ProfesseurMatiere pm WHERE pm.matiere = :matiere")
    Set<Professeur> findProfesseursByMatiere(@Param("matiere") Matiere matiere);
    
    Optional<ProfesseurMatiere> findByProfesseurAndMatiere(Professeur professeur, Matiere matiere);
    
    List<ProfesseurMatiere> findByProfesseur(Professeur professeur);
    
    List<ProfesseurMatiere> findByMatiere(Matiere matiere);
    
    boolean existsByProfesseurAndMatiere(Professeur professeur, Matiere matiere);
}
