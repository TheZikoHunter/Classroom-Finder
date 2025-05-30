package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Integer> {
    List<Matiere> findByNomMatiereContaining(String nom);
    Optional<Matiere> findById(int id);
}