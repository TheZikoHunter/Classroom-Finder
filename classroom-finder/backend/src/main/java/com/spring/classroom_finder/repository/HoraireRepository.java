package com.spring.classroom_finder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring.classroom_finder.model.Horaire;

@Repository
public interface HoraireRepository extends JpaRepository<Horaire, Integer> {
    
    List<Horaire> findByIdHoraire(int idHoraire);
}