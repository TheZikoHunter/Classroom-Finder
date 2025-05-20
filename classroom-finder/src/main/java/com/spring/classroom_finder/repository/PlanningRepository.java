package com.spring.classroom_finder.repository;

import com.spring.classroom_finder.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Integer> {
    List<Planning> findByFiliereId(int filiereId);
    List<Planning> findByProfesseurId(int professeurId);
    List<Planning> findBySalleId(int salleId);
}