package com.spring.classroom_finder.controller;

import java.time.LocalDate;
import java.util.ArrayList;
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
import com.spring.classroom_finder.model.Planning;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Reservation;
import com.spring.classroom_finder.model.Salle;
import com.spring.classroom_finder.repository.FiliereRepository;
import com.spring.classroom_finder.repository.HoraireRepository;
import com.spring.classroom_finder.repository.MatiereRepository;
import com.spring.classroom_finder.repository.PlanningRepository;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import com.spring.classroom_finder.repository.ReservationRepository;
import com.spring.classroom_finder.repository.SalleRepository;

@RestController
@RequestMapping("/api/plannings")
@CrossOrigin(origins = "http://localhost:4200")
public class PlanningController {

    private final PlanningRepository planningRepository;
    private final ReservationRepository reservationRepository;
    private final ProfesseurRepository professeurRepository;
    private final FiliereRepository filiereRepository;
    private final MatiereRepository matiereRepository;
    private final HoraireRepository horaireRepository;
    private final SalleRepository salleRepository;

    @Autowired
    public PlanningController(
            PlanningRepository planningRepository,
            ReservationRepository reservationRepository,
            ProfesseurRepository professeurRepository,
            FiliereRepository filiereRepository,
            MatiereRepository matiereRepository,
            HoraireRepository horaireRepository,
            SalleRepository salleRepository
            ) {
        this.planningRepository = planningRepository;
        this.reservationRepository = reservationRepository;
        this.professeurRepository = professeurRepository;
        this.filiereRepository = filiereRepository;
        this.matiereRepository = matiereRepository;
        this.horaireRepository = horaireRepository;
        this.salleRepository = salleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Planning>> getAllPlannings() {
        List<Planning> plannings = planningRepository.findAll();
        return new ResponseEntity<>(plannings, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Planning> getPlanningById(@PathVariable Long id) {
        Optional<Planning> planning = planningRepository.findById(id);
        return planning.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createPlanning(@RequestBody PlanningCreateRequest request) {
        try {
            // Validate that all required IDs are provided
            if (request.getIdMatiere() == null || request.getIdHoraire() == null || 
                request.getIdProfesseur() == null || request.getIdFiliere() == null ||
                request.getSalleId() == null) {
                return new ResponseEntity<>("All IDs must be provided", HttpStatus.BAD_REQUEST);
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

            // Check if the current user is a professor
            Professeur professeur = professeurOpt.get();
            if (professeur != null) {
                // Create a reservation instead of a planning
                Reservation reservation = new Reservation();
                reservation.setMatiere(matiereOpt.get());
                reservation.setHoraire(horaireOpt.get());
                reservation.setProfesseur(professeur);
                reservation.setFiliere(filiereOpt.get());
                reservation.setSalle(salleOpt.get());
                reservation.setReservationDate(LocalDate.now()); // Set current date

                // Check for conflicts before saving
                validateNoReservationConflicts(reservation);
                
                // Save the reservation
                Reservation savedReservation = reservationRepository.save(reservation);
                return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
            } else {
                // Create new Planning object with found entities
                Planning planning = new Planning();
                planning.setMatiere(matiereOpt.get());
                planning.setHoraire(horaireOpt.get());
                planning.setProfesseur(professeurOpt.get());
                planning.setFiliere(filiereOpt.get());
                planning.setSalle(salleOpt.get());
        
                // Check for conflicts before saving
                validateNoConflicts(planning);
                
                // Save the planning
                Planning savedPlanning = planningRepository.save(planning);
                return new ResponseEntity<>(savedPlanning, HttpStatus.CREATED);
            }
            
        } catch (PlanningConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (ReservationConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating planning/reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Request DTO for creating planning with IDs
    public static class PlanningCreateRequest {
        private Integer idMatiere;
        private Integer idHoraire;
        private Integer idProfesseur;
        private Integer idFiliere;
        private String salleId; // Assuming Salle ID is String based on your previous code
    
        // Default constructor
        public PlanningCreateRequest() {}
    
        // Constructor with all parameters
        public PlanningCreateRequest(Integer idMatiere, Integer idHoraire, Integer idProfesseur, 
                                   Integer idFiliere, String salleId) {
            this.idMatiere = idMatiere;
            this.idHoraire = idHoraire;
            this.idProfesseur = idProfesseur;
            this.idFiliere = idFiliere;
            this.salleId = salleId;
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
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlanning(@PathVariable Long id, @RequestBody Planning planning) {
        try {
            if (!planningRepository.existsById(id)) {
                return new ResponseEntity<>("Planning with id " + id + " not found", HttpStatus.NOT_FOUND);
            }

            planning.setIdPlanning(id);
            validateNoConflicts(planning);
            Planning updatedPlanning = planningRepository.save(planning);
            return new ResponseEntity<>(updatedPlanning, HttpStatus.OK);
        } catch (PlanningConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlanning(@PathVariable Long id) {
        planningRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Search for all majors (filières) taught by a specific professor
     *
     * @param professorId The ID of the professor
     * @return A set of Filiere objects
     */
    @GetMapping("/recherche-filiere-par-prof/{professorId}")
    public ResponseEntity<?> rechercheFiliereParProf(@PathVariable int professorId) {
        Optional<Professeur> professeur = professeurRepository.findById(professorId);

        if (professeur.isEmpty()) {
            return new ResponseEntity<>("Professor not found", HttpStatus.NOT_FOUND);
        }

        Set<Filiere> filieres = planningRepository.findAllFilieresByProfesseur(professeur.get());
        return new ResponseEntity<>(filieres, HttpStatus.OK);
    }

    /**
     * Search for all planning entries for a specific major (filière)
     *
     * @param filiereId The ID of the filière
     * @return A list of Planning objects
     */
    @GetMapping("/recherche-par-filiere/{filiereId}")
    public ResponseEntity<?> rechercheParFiliere(@PathVariable int filiereId) {
        Optional<Filiere> filiere = filiereRepository.findById(filiereId);

        if (filiere.isEmpty()) {
            return new ResponseEntity<>("Major not found", HttpStatus.NOT_FOUND);
        }

        List<Planning> plannings = planningRepository.findByFiliere(filiere.get());
        return new ResponseEntity<>(plannings, HttpStatus.OK);
    }

    /**
     * Validate that there are no conflicts with existing planning entries
     */
    private void validateNoConflicts(Planning planning) throws PlanningConflictException {
        // Check if professor is already scheduled for this time slot
        List<Planning> professorConflicts = planningRepository.findByProfesseurAndHoraire(
                planning.getProfesseur(), planning.getHoraire());

        // Filter out the current planning if it's an update
        professorConflicts.removeIf(p -> p.getIdPlanning() != null && p.getIdPlanning().equals(planning.getIdPlanning()));

        if (!professorConflicts.isEmpty()) {
            throw new PlanningConflictException("Professor is already scheduled for this time slot");
        }

        // Check if classroom is already booked for this time slot
        List<Planning> salleConflicts = planningRepository.findBySalleAndHoraire(
                planning.getSalle(), planning.getHoraire());

        // Filter out the current planning if it's an update
        salleConflicts.removeIf(p -> p.getIdPlanning() != null && p.getIdPlanning().equals(planning.getIdPlanning()));

        if (!salleConflicts.isEmpty()) {
            throw new PlanningConflictException("Classroom is already booked for this time slot");
        }

        // Check if the filiere (major) already has a class scheduled for this time slot
        List<Planning> filiereConflicts = planningRepository.findByFiliereAndHoraire(
                planning.getFiliere(), planning.getHoraire());

        // Filter out the current planning if it's an update
        filiereConflicts.removeIf(p -> p.getIdPlanning() != null && p.getIdPlanning().equals(planning.getIdPlanning()));

        if (!filiereConflicts.isEmpty()) {
            throw new PlanningConflictException("Major already has a class scheduled for this time slot");
        }
    }

    private void validateNoReservationConflicts(Reservation reservation) throws ReservationConflictException {
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

    /**
     * Custom exception for planning conflicts
     */
    public static class PlanningConflictException extends Exception {
        public PlanningConflictException(String message) {
            super(message);
        }
    }

    public static class ReservationConflictException extends Exception {
        public ReservationConflictException(String message) {
            super(message);
        }
    }

    /**
     * Get all available classrooms for a specific time slot (horaire)
     * A classroom is considered available if it's not used in any planning or reservation for the given horaire
     *
     * @param horaireId The ID of the horaire (time slot)
     * @return A list of available Salle objects
     */
    @GetMapping("/available-classrooms/{horaireId}")
    public ResponseEntity<?> getAvailableClassrooms(@PathVariable Integer horaireId) {
        try {
            // First, verify that the horaire exists
            Optional<Horaire> horaireOpt = horaireRepository.findById(horaireId);
            if (horaireOpt.isEmpty()) {
                return new ResponseEntity<>("Time slot not found", HttpStatus.NOT_FOUND);
            }
            Horaire horaire = horaireOpt.get();

            // Get all classrooms
            List<Salle> allClassrooms = salleRepository.findAll();

            // Get classrooms that are used in plannings for this horaire
            List<Planning> plannings = planningRepository.findByHoraire(horaire);
            List<String> occupiedClassroomIds = plannings.stream()
                .map(planning -> planning.getSalle().getNomSalle())
                .toList();

            // Get classrooms that are used in reservations for this horaire and today's date
            List<Reservation> reservations = reservationRepository.findByHoraireAndReservationDate(
                horaire, LocalDate.now());
            List<String> reservedClassroomIds = reservations.stream()
                .map(reservation -> reservation.getSalle().getNomSalle())
                .toList();

            // Combine both lists of occupied classroom IDs
            List<String> allOccupiedClassroomIds = new ArrayList<>(occupiedClassroomIds);
            allOccupiedClassroomIds.addAll(reservedClassroomIds);

            // Filter out occupied classrooms
            List<Salle> availableClassrooms = allClassrooms.stream()
                .filter(classroom -> !allOccupiedClassroomIds.contains(classroom.getNomSalle()))
                .toList();

            return new ResponseEntity<>(availableClassrooms, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting available classrooms: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}