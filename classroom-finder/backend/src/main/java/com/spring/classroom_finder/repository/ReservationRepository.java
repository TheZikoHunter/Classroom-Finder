package com.spring.classroom_finder.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.spring.classroom_finder.model.Filiere;
import com.spring.classroom_finder.model.Horaire;
import com.spring.classroom_finder.model.Matiere;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Reservation;
import com.spring.classroom_finder.model.Salle;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Find all reservations by professor
    List<Reservation> findByProfesseur(Professeur professeur);

    // Find all reservations by filiere (major)
    List<Reservation> findByFiliere(Filiere filiere);

    // Find all reservations by professor, time slot and date
    List<Reservation> findByProfesseurAndHoraireAndReservationDate(
        Professeur professeur, Horaire horaire, LocalDate reservationDate);

    // Find all reservations by classroom, time slot and date
    List<Reservation> findBySalleAndHoraireAndReservationDate(
        Salle salle, Horaire horaire, LocalDate reservationDate);

    // Find all reservations by filiere, time slot and date
    List<Reservation> findByFiliereAndHoraireAndReservationDate(
        Filiere filiere, Horaire horaire, LocalDate reservationDate);

    // Find all reservations by date
    List<Reservation> findByReservationDate(LocalDate reservationDate);

    // Find all reservations by time slot and date
    List<Reservation> findByHoraireAndReservationDate(Horaire horaire, LocalDate reservationDate);

    // Custom query to find all distinct filieres (majors) that a professor has reservations for
    @Query("SELECT DISTINCT r.filiere FROM Reservation r WHERE r.professeur = :professeur")
    Set<Filiere> findAllFilieresByProfesseur(@Param("professeur") Professeur professeur);

    // Custom query to find all distinct subjects (matieres) that a professor has reservations for
    @Query("SELECT DISTINCT r.matiere FROM Reservation r WHERE r.professeur = :professeur")
    Set<Matiere> findAllMatieresByProfesseur(@Param("professeur") Professeur professeur);
} 