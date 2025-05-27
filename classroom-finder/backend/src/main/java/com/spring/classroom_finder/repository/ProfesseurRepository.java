package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Integer> {
    List<Professeur> findByNomProfesseurContaining(String nom);
    Optional<Professeur> findByEmail(String email);
}