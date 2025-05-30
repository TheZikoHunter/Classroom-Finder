package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
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
public ResponseEntity<Professeur> createProfesseur(@RequestBody Professeur professeur) {
    try {
        // Hash the password before saving
        professeur.setMot_de_passe(passwordEncoder.encode(professeur.getMot_de_passe()));
        
        Professeur savedProf = professeurRepository.save(professeur);
        return new ResponseEntity<>(savedProf, HttpStatus.CREATED);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    // Update a Professeur
@PutMapping("/{id}")
public ResponseEntity<Professeur> updateProfesseur(@PathVariable("id") int id, @RequestBody Professeur professeur) {
    Optional<Professeur> profData = professeurRepository.findById(id);

    if (profData.isPresent()) {
        Professeur existingProf = profData.get();
        existingProf.setNomProfesseur(professeur.getNomProfesseur());
        existingProf.setPrenomProfesseur(professeur.getPrenomProfesseur());
        existingProf.setEmail(professeur.getEmail());
        
        // Only hash password if it's being changed
        if (professeur.getMot_de_passe() != null && !professeur.getMot_de_passe().isEmpty()) {
            existingProf.setMot_de_passe(passwordEncoder.encode(professeur.getMot_de_passe()));
        }
        
        return new ResponseEntity<>(professeurRepository.save(existingProf), HttpStatus.OK);
    } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

    // Delete a Professeur
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProfesseur(@PathVariable("id") int id) {
        try {
            professeurRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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