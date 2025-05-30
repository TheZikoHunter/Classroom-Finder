package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.ProfesseurMatiere;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.model.Matiere;
import com.spring.classroom_finder.repository.ProfesseurMatiereRepository;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import com.spring.classroom_finder.repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/professor-subjects")
public class ProfesseurMatiereController {

    @Autowired
    private ProfesseurMatiereRepository professeurMatiereRepository;
    
    @Autowired
    private ProfesseurRepository professeurRepository;
    
    @Autowired
    private MatiereRepository matiereRepository;

    /**
     * Get all subjects assigned to a specific professor
     */
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<?> getSubjectsByProfessor(@PathVariable int professorId) {
        try {
            Optional<Professeur> professeur = professeurRepository.findById(professorId);
            
            if (professeur.isEmpty()) {
                return new ResponseEntity<>("Professor not found", HttpStatus.NOT_FOUND);
            }
            
            Set<Matiere> subjects = professeurMatiereRepository.findMatieresByProfesseur(professeur.get());
            return new ResponseEntity<>(subjects, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving subjects: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all professors assigned to a specific subject
     */
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getProfessorsBySubject(@PathVariable int subjectId) {
        try {
            Optional<Matiere> matiere = matiereRepository.findById(subjectId);
            
            if (matiere.isEmpty()) {
                return new ResponseEntity<>("Subject not found", HttpStatus.NOT_FOUND);
            }
            
            Set<Professeur> professors = professeurMatiereRepository.findProfesseursByMatiere(matiere.get());
            return new ResponseEntity<>(professors, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving professors: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Assign a subject to a professor
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignSubjectToProfessor(@RequestBody AssignmentRequest request) {
        try {
            Optional<Professeur> professeur = professeurRepository.findById(request.getProfessorId());
            Optional<Matiere> matiere = matiereRepository.findById(request.getSubjectId());
            
            if (professeur.isEmpty()) {
                return new ResponseEntity<>("Professor not found", HttpStatus.NOT_FOUND);
            }
            
            if (matiere.isEmpty()) {
                return new ResponseEntity<>("Subject not found", HttpStatus.NOT_FOUND);
            }
            
            // Check if assignment already exists
            if (professeurMatiereRepository.existsByProfesseurAndMatiere(professeur.get(), matiere.get())) {
                return new ResponseEntity<>("Subject already assigned to professor", HttpStatus.CONFLICT);
            }
            
            ProfesseurMatiere assignment = new ProfesseurMatiere(professeur.get(), matiere.get());
            professeurMatiereRepository.save(assignment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Subject assigned to professor successfully");
            response.put("data", assignment);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error assigning subject: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove subject assignment from professor
     */
    @DeleteMapping("/unassign")
    public ResponseEntity<?> unassignSubjectFromProfessor(@RequestBody AssignmentRequest request) {
        try {
            Optional<Professeur> professeur = professeurRepository.findById(request.getProfessorId());
            Optional<Matiere> matiere = matiereRepository.findById(request.getSubjectId());
            
            if (professeur.isEmpty()) {
                return new ResponseEntity<>("Professor not found", HttpStatus.NOT_FOUND);
            }
            
            if (matiere.isEmpty()) {
                return new ResponseEntity<>("Subject not found", HttpStatus.NOT_FOUND);
            }
            
            Optional<ProfesseurMatiere> assignmentOpt = professeurMatiereRepository.findByProfesseurAndMatiere(
                professeur.get(), matiere.get());
            
            if (assignmentOpt.isEmpty()) {
                return new ResponseEntity<>("Assignment not found", HttpStatus.NOT_FOUND);
            }
            ProfesseurMatiere assignment = assignmentOpt.get();
            
            professeurMatiereRepository.delete(assignment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Subject unassigned from professor successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error unassigning subject: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all assignments
     */
    @GetMapping("/all")
    public ResponseEntity<List<ProfesseurMatiere>> getAllAssignments() {
        try {
            List<ProfesseurMatiere> assignments = professeurMatiereRepository.findAll();
            return new ResponseEntity<>(assignments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DTO for assignment requests
    public static class AssignmentRequest {
        private int professorId;
        private int subjectId;

        public AssignmentRequest() {}

        public AssignmentRequest(int professorId, int subjectId) {
            this.professorId = professorId;
            this.subjectId = subjectId;
        }

        public int getProfessorId() {
            return professorId;
        }

        public void setProfessorId(int professorId) {
            this.professorId = professorId;
        }

        public int getSubjectId() {
            return subjectId;
        }

        public void setSubjectId(int subjectId) {
            this.subjectId = subjectId;
        }
    }
}
