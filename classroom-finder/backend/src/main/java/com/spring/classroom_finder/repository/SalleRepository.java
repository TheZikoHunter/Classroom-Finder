package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalleRepository extends JpaRepository<Salle, String> {
    List<Salle> findByNomSalleContaining(String nom);
    Optional<Salle> findByNomSalle(String nom);

}