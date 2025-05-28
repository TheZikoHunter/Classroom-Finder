package com.spring.classroom_finder.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.classroom_finder.model.Filiere;
import com.spring.classroom_finder.model.Horaire;
import com.spring.classroom_finder.model.Matiere;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Reservation;
import com.spring.classroom_finder.model.Salle;
import com.spring.classroom_finder.repository.FiliereRepository;
import com.spring.classroom_finder.repository.HoraireRepository;
import com.spring.classroom_finder.repository.MatiereRepository;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import com.spring.classroom_finder.repository.ReservationRepository;
import com.spring.classroom_finder.repository.SalleRepository;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ProfesseurRepository professeurRepository;
    private final FiliereRepository filiereRepository;
    private final MatiereRepository matiereRepository;
    private final HoraireRepository horaireRepository;
    private final SalleRepository salleRepository;

    @Autowired
    public ReservationController(
            ReservationRepository reservationRepository,
            ProfesseurRepository professeurRepository,
            FiliereRepository filiereRepository,
            MatiereRepository matiereRepository,
            HoraireRepository horaireRepository,
            SalleRepository salleRepository) {
        this.reservationRepository = reservationRepository;
        this.professeurRepository = professeurRepository;
        this.filiereRepository = filiereRepository;
        this.matiereRepository = matiereRepository;
        this.horaireRepository = horaireRepository;
        this.salleRepository = salleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        return reservation.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationCreateRequest request) {
        try {
            // Validate that all required IDs are provided
            if (request.getIdMatiere() == null || request.getIdHoraire() == null || 
                request.getIdProfesseur() == null || request.getIdFiliere() == null ||
                request.getSalleId() == null || request.getReservationDate() == null) {
                return new ResponseEntity<>("All IDs and reservation date must be provided", HttpStatus.BAD_REQUEST);
            }
    
            // Find entities by their IDs
            Optional<Matiere> matiereOpt = matiereRepository.findById(request.getIdMatiere());
            Optional<Horaire> horaireOpt = horaireRepository.findById(request.getIdHoraire());
            Optional<Professeur> professeurOpt = professeurRepository.findById(request.getIdProfesseur());
            Optional<Filiere> filiereOpt = filiereRepository.findById(request.getIdFiliere());
            Optional<Salle> salleOpt = salleRepository.findById(request.getSalleId());
    
            // Check if all entities exist
            if (matiereOpt.isEmpty()) {
                return new ResponseEntity<>("Matiere with ID " + request.getIdMatiere() + " not found", HttpStatus.NOT_FOUND);
            }
            if (horaireOpt.isEmpty()) {
                return new ResponseEntity<>("Horaire with ID " + request.getIdHoraire() + " not found", HttpStatus.NOT_FOUND);
            }
            if (professeurOpt.isEmpty()) {
                return new ResponseEntity<>("Professeur with ID " + request.getIdProfesseur() + " not found", HttpStatus.NOT_FOUND);
            }
            if (filiereOpt.isEmpty()) {
                return new ResponseEntity<>("Filiere with ID " + request.getIdFiliere() + " not found", HttpStatus.NOT_FOUND);
            }
            if (salleOpt.isEmpty()) {
                return new ResponseEntity<>("Salle with ID " + request.getSalleId() + " not found", HttpStatus.NOT_FOUND);
            }
    
            // Create new Reservation object with found entities
            Reservation reservation = new Reservation();
            reservation.setMatiere(matiereOpt.get());
            reservation.setHoraire(horaireOpt.get());
            reservation.setProfesseur(professeurOpt.get());
            reservation.setFiliere(filiereOpt.get());
            reservation.setSalle(salleOpt.get());
            reservation.setReservationDate(request.getReservationDate());
    
            // Check for conflicts before saving
            validateNoConflicts(reservation);
            
            // Save the reservation
            Reservation savedReservation = reservationRepository.save(reservation);
            return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
            
        } catch (ReservationConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable long id, @RequestBody Reservation reservation) {
        try {
            if (!reservationRepository.existsById(id)) {
                return new ResponseEntity<>("Reservation with id " + id + " not found", HttpStatus.NOT_FOUND);
            }

            reservation.setIdReservation(id);
            validateNoConflicts(reservation);
            Reservation updatedReservation = reservationRepository.save(reservation);
            return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
        } catch (ReservationConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/recherche-filiere-par-prof/{professorId}")
    public ResponseEntity<?> rechercheFiliereParProf(@PathVariable int professorId) {
        Optional<Professeur> professeur = professeurRepository.findById(professorId);

        if (professeur.isEmpty()) {
            return new ResponseEntity<>("Professor not found", HttpStatus.NOT_FOUND);
        }

        Set<Filiere> filieres = reservationRepository.findAllFilieresByProfesseur(professeur.get());
        return new ResponseEntity<>(filieres, HttpStatus.OK);
    }

    @GetMapping("/recherche-par-filiere/{filiereId}")
    public ResponseEntity<?> rechercheParFiliere(@PathVariable int filiereId) {
        Optional<Filiere> filiere = filiereRepository.findById(filiereId);

        if (filiere.isEmpty()) {
            return new ResponseEntity<>("Major not found", HttpStatus.NOT_FOUND);
        }

        List<Reservation> reservations = reservationRepository.findByFiliere(filiere.get());
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping("/recherche-par-date/{date}")
    public ResponseEntity<?> rechercheParDate(@PathVariable String date) {
        try {
            LocalDate reservationDate = LocalDate.parse(date);
            List<Reservation> reservations = reservationRepository.findByReservationDate(reservationDate);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid date format. Use YYYY-MM-DD", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateNoConflicts(Reservation reservation) throws ReservationConflictException {
        // Check if professor is already scheduled for this time slot and date
        List<Reservation> professorConflicts = reservationRepository.findByProfesseurAndHoraireAndReservationDate(
                reservation.getProfesseur(), reservation.getHoraire(), reservation.getReservationDate());

        // Filter out the current reservation if it's an update
        professorConflicts.removeIf(r -> r.getIdReservation() == reservation.getIdReservation());

        if (!professorConflicts.isEmpty()) {
            throw new ReservationConflictException("Professor is already scheduled for this time slot and date");
        }

        // Check if classroom is already booked for this time slot and date
        List<Reservation> salleConflicts = reservationRepository.findBySalleAndHoraireAndReservationDate(
                reservation.getSalle(), reservation.getHoraire(), reservation.getReservationDate());

        // Filter out the current reservation if it's an update
        salleConflicts.removeIf(r -> r.getIdReservation() == reservation.getIdReservation());

        if (!salleConflicts.isEmpty()) {
            throw new ReservationConflictException("Classroom is already booked for this time slot and date");
        }

        // Check if the filiere already has a class scheduled for this time slot and date
        List<Reservation> filiereConflicts = reservationRepository.findByFiliereAndHoraireAndReservationDate(
                reservation.getFiliere(), reservation.getHoraire(), reservation.getReservationDate());

        // Filter out the current reservation if it's an update
        filiereConflicts.removeIf(r -> r.getIdReservation() == reservation.getIdReservation());

        if (!filiereConflicts.isEmpty()) {
            throw new ReservationConflictException("Major already has a class scheduled for this time slot and date");
        }
    }

    // Request DTO for creating reservation with IDs
    public static class ReservationCreateRequest {
        private Integer idMatiere;
        private Integer idHoraire;
        private Integer idProfesseur;
        private Integer idFiliere;
        private String salleId;
        private LocalDate reservationDate;
    
        // Default constructor
        public ReservationCreateRequest() {}
    
        // Constructor with all parameters
        public ReservationCreateRequest(Integer idMatiere, Integer idHoraire, Integer idProfesseur, 
                                      Integer idFiliere, String salleId, LocalDate reservationDate) {
            this.idMatiere = idMatiere;
            this.idHoraire = idHoraire;
            this.idProfesseur = idProfesseur;
            this.idFiliere = idFiliere;
            this.salleId = salleId;
            this.reservationDate = reservationDate;
        }
    
        // Getters and Setters
        public Integer getIdMatiere() {
            return idMatiere;
        }
    
        public void setIdMatiere(Integer idMatiere) {
            this.idMatiere = idMatiere;
        }
    
        public Integer getIdHoraire() {
            return idHoraire;
        }
    
        public void setIdHoraire(Integer idHoraire) {
            this.idHoraire = idHoraire;
        }
    
        public Integer getIdProfesseur() {
            return idProfesseur;
        }
    
        public void setIdProfesseur(Integer idProfesseur) {
            this.idProfesseur = idProfesseur;
        }
    
        public Integer getIdFiliere() {
            return idFiliere;
        }
    
        public void setIdFiliere(Integer idFiliere) {
            this.idFiliere = idFiliere;
        }
    
        public String getSalleId() {
            return salleId;
        }
    
        public void setSalleId(String salleId) {
            this.salleId = salleId;
        }

        public LocalDate getReservationDate() {
            return reservationDate;
        }

        public void setReservationDate(LocalDate reservationDate) {
            this.reservationDate = reservationDate;
        }
    }

    public static class ReservationConflictException extends Exception {
        public ReservationConflictException(String message) {
            super(message);
        }
    }
} 