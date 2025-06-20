package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Integer> {
    List<Administrateur> findByNomContaining(String nom);
    Optional<Administrateur> findByEmail(String email);
}