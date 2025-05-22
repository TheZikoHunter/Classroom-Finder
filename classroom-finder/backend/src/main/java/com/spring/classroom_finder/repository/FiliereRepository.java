package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, Integer> {
    List<Filiere> findByNomFiliereContaining(String nom);
}