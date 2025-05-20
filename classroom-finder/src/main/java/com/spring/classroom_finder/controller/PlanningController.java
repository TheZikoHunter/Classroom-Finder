package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Planning;
import com.spring.classroom_finder.model.Filiere;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Horaire;
import com.spring.classroom_finder.model.Salle;
import com.spring.classroom_finder.repository.PlanningRepository;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import com.spring.classroom_finder.repository.FiliereRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.Optional;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    private final PlanningRepository planningRepository;
    private final ProfesseurRepository professeurRepository;
    private final FiliereRepository filiereRepository;

    @Autowired
    public PlanningController(
            PlanningRepository planningRepository,
            ProfesseurRepository professeurRepository,
            FiliereRepository filiereRepository) {
        this.planningRepository = planningRepository;
        this.professeurRepository = professeurRepository;
        this.filiereRepository = filiereRepository;
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
    public ResponseEntity<?> createPlanning(@RequestBody Planning planning) {
        try {
            // Check for conflicts before saving
            validateNoConflicts(planning);
            Planning savedPlanning = planningRepository.save(planning);
            return new ResponseEntity<>(savedPlanning, HttpStatus.CREATED);
        } catch (PlanningConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlanning(@PathVariable Long id, @RequestBody Planning planning) {
        try {
            if (!planningRepository.existsById(id)) {
                return new ResponseEntity<>("Planning with id " + id + " not found", HttpStatus.NOT_FOUND);
            }

            planning.setId(id);
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
        professorConflicts.removeIf(p -> p.getId() != null && p.getId().equals(planning.getId()));

        if (!professorConflicts.isEmpty()) {
            throw new PlanningConflictException("Professor is already scheduled for this time slot");
        }

        // Check if classroom is already booked for this time slot
        List<Planning> salleConflicts = planningRepository.findBySalleAndHoraire(
                planning.getSalle(), planning.getHoraire());

        // Filter out the current planning if it's an update
        salleConflicts.removeIf(p -> p.getId() != null && p.getId().equals(planning.getId()));

        if (!salleConflicts.isEmpty()) {
            throw new PlanningConflictException("Classroom is already booked for this time slot");
        }

        // Check if the filiere (major) already has a class scheduled for this time slot
        List<Planning> filiereConflicts = planningRepository.findByFiliereAndHoraire(
                planning.getFiliere(), planning.getHoraire());

        // Filter out the current planning if it's an update
        filiereConflicts.removeIf(p -> p.getId() != null && p.getId().equals(planning.getId()));

        if (!filiereConflicts.isEmpty()) {
            throw new PlanningConflictException("Major already has a class scheduled for this time slot");
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
}