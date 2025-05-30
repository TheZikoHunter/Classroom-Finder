package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Filiere;
import com.spring.classroom_finder.repository.FiliereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    @Autowired
    private FiliereRepository filiereRepository;

    // Get all Filieres
    @GetMapping
    public ResponseEntity<List<Filiere>> getAllFilieres(@RequestParam(required = false) String nom) {
        try {
            List<Filiere> filieres = new ArrayList<>();

            if (nom == null)
                filieres.addAll(filiereRepository.findAll());
            else
                filieres.addAll(filiereRepository.findByNomFiliereContaining(nom));

            if (filieres.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(filieres, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Filiere by id
    @GetMapping("/{id}")
    public ResponseEntity<Filiere> getFiliereById(@PathVariable("id") int id) {
        Optional<Filiere> filiereData = filiereRepository.findById(id);

        return filiereData.map(filiere ->
                        new ResponseEntity<>(filiere, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new Filiere
    @PostMapping
    public ResponseEntity<Filiere> createFiliere(@RequestBody Filiere filiere) {
        try {
            Filiere _filiere = filiereRepository.save(filiere);
            return new ResponseEntity<>(_filiere, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a Filiere
    @PutMapping("/{id}")
    public ResponseEntity<Filiere> updateFiliere(@PathVariable("id") int id, @RequestBody Filiere filiere) {
        Optional<Filiere> filiereData = filiereRepository.findById(id);

        if (filiereData.isPresent()) {
            Filiere _filiere = filiereData.get();
            _filiere.setNomFiliere(filiere.getNomFiliere());
            _filiere.setemail_representant(filiere.getemail_representant());
            return new ResponseEntity<>(filiereRepository.save(_filiere), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a Filiere
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteFiliere(@PathVariable("id") int id) {
        try {
            filiereRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Filieres
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllFilieres() {
        try {
            filiereRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
