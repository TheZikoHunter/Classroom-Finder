package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Administrateur;
import com.spring.classroom_finder.repository.AdministrateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/administrateurs")

@CrossOrigin(origins = "http://localhost:4200")
public class AdministrateurController {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    // Get all Administrateurs
    @GetMapping
    public ResponseEntity<List<Administrateur>> getAllAdministrateurs(@RequestParam(required = false) String nom) {
        try {
            List<Administrateur> administrateurs = new ArrayList<>();

            if (nom == null)
                administrateurs.addAll(administrateurRepository.findAll());
            else
                administrateurs.addAll(administrateurRepository.findByNomContaining(nom));

            if (administrateurs.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(administrateurs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get an Administrateur by id
    @GetMapping("/{id}")
    public ResponseEntity<Administrateur> getAdministrateurById(@PathVariable("id") int id) {
        Optional<Administrateur> administrateurData = administrateurRepository.findById(id);

        return administrateurData.map(administrateur ->
                        new ResponseEntity<>(administrateur, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new Administrateur
    @PostMapping
    public ResponseEntity<Administrateur> createAdministrateur(@RequestBody Administrateur administrateur) {
        try {
            Administrateur _administrateur = administrateurRepository.save(administrateur);
            return new ResponseEntity<>(_administrateur, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an Administrateur
    @PutMapping("/{id}")
    public ResponseEntity<Administrateur> updateAdministrateur(@PathVariable("id") int id, @RequestBody Administrateur administrateur) {
        Optional<Administrateur> administrateurData = administrateurRepository.findById(id);

        if (administrateurData.isPresent()) {
            Administrateur _administrateur = administrateurData.get();
            _administrateur.setNom(administrateur.getNom());
            _administrateur.setPrenom(administrateur.getPrenom());
            _administrateur.setEmail(administrateur.getEmail());
            // Update other fields as needed
            return new ResponseEntity<>(administrateurRepository.save(_administrateur), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete an Administrateur
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAdministrateur(@PathVariable("id") int id) {
        try {
            administrateurRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Administrateurs
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllAdministrateurs() {
        try {
            administrateurRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}