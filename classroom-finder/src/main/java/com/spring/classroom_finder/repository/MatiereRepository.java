package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Integer> {
    List<Matiere> findByNomMatiereContaining(String nom);
    List<Matiere> findByFiliereId(int filiereId);
}