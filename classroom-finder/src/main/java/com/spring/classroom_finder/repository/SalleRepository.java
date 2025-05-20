package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Integer> {
    List<Salle> findByNomSalleContaining(String nom);
}