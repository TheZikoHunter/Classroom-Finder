package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/professeurs")
public class ProfesseurController {

    @Autowired
    private ProfesseurRepository professeurRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // Get all Professeurs
    @GetMapping
    public ResponseEntity<List<Professeur>> getAllProfesseurs(@RequestParam(required = false) String nom) {
        try {
            List<Professeur> professeurs = new ArrayList<>();

            if (nom == null)
                professeurs.addAll(professeurRepository.findAll());
            else
                professeurs.addAll(professeurRepository.findByNomProfesseurContaining(nom));

            if (professeurs.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(professeurs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Professeur by id
    @GetMapping("/{id}")
    public ResponseEntity<Professeur> getProfesseurById(@PathVariable("id") int id) {
        Optional<Professeur> professeurData = professeurRepository.findById(id);

        return professeurData.map(professeur ->
                        new ResponseEntity<>(professeur, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new Professeur
    @PostMapping
public ResponseEntity<?> createProfesseur(@RequestBody Professeur professeur) {
    try {
        System.out.println("Creating professor: " + professeur.getEmail());
        
        // Hash the password before saving
        if (professeur.getMotDePasse() != null && !professeur.getMotDePasse().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(professeur.getMotDePasse());
            professeur.setMotDePasse(hashedPassword);
        }
        
        Professeur savedProf = professeurRepository.save(professeur);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Professor created successfully");
        response.put("data", savedProf);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    } catch (Exception e) {
        System.err.println("Error creating professor: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Error creating professor: " + e.getMessage());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    // Update a Professeur
    @PutMapping("/{id}")
public ResponseEntity<?> updateProfesseur(@PathVariable("id") int id, @RequestBody Professeur professeur) {
    try {
        System.out.println("Updating professor with ID: " + id);
        System.out.println("Update data: " + professeur.getEmail());
        
        Optional<Professeur> profData = professeurRepository.findById(id);

        if (profData.isPresent()) {
            Professeur existingProf = profData.get();
            
            // Update basic info
            existingProf.setNomProfesseur(professeur.getNomProfesseur());
            existingProf.setPrenomProfesseur(professeur.getPrenomProfesseur());
            existingProf.setEmail(professeur.getEmail());
            
            // Only update password if it's provided and not empty
            if (professeur.getMotDePasse() != null && !professeur.getMotDePasse().trim().isEmpty()) {
                System.out.println("Updating password for professor");
                existingProf.setMotDePasse(passwordEncoder.encode(professeur.getMotDePasse()));
            } else {
                System.out.println("Password not provided, keeping existing password");
                // Keep the existing password - don't change it
            }
            
            Professeur updatedProf = professeurRepository.save(existingProf);
            System.out.println("Professor updated successfully with ID: " + updatedProf.getIdProfesseur());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Professor updated successfully");
            response.put("data", updatedProf);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            System.out.println("Professor not found with ID: " + id);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Professor not found with ID: " + id);
            
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    } catch (Exception e) {
        System.err.println("Error updating professor: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Error updating professor: " + e.getMessage());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    // Delete a Professeur
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfesseur(@PathVariable("id") int id) {
        try {
            Optional<Professeur> profData = professeurRepository.findById(id);
            
            if (profData.isPresent()) {
                professeurRepository.deleteById(id);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Professor deleted successfully");
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Professor not found");
                
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting professor: " + e.getMessage());
            
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Professeurs
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllProfesseurs() {
        try {
            professeurRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}