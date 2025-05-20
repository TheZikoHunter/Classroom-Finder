package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Salle;
import com.spring.classroom_finder.repository.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salles")
public class SalleController {

    @Autowired
    private SalleRepository salleRepository;

    // Get all Salles
    @GetMapping
    public ResponseEntity<List<Salle>> getAllSalles(@RequestParam(required = false) String nom) {
        try {
            List<Salle> salles = new ArrayList<>();

            if (nom == null)
                salles.addAll(salleRepository.findAll());
            else
                salles.addAll(salleRepository.findByNomSalleContaining(nom));

            if (salles.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(salles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Salle by id
    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(@PathVariable("id") int id) {
        Optional<Salle> salleData = salleRepository.findById(id);

        return salleData.map(salle ->
                        new ResponseEntity<>(salle, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new Salle
    @PostMapping
    public ResponseEntity<Salle> createSalle(@RequestBody Salle salle) {
        try {
            Salle _salle = salleRepository.save(salle);
            return new ResponseEntity<>(_salle, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a Salle
    @PutMapping("/{id}")
    public ResponseEntity<Salle> updateSalle(@PathVariable("id") int id, @RequestBody Salle salle) {
        Optional<Salle> salleData = salleRepository.findById(id);

        if (salleData.isPresent()) {
            Salle _salle = salleData.get();
            _salle.setNomSalle(salle.getNomSalle());
            // Update other fields as needed
            return new ResponseEntity<>(salleRepository.save(_salle), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a Salle
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSalle(@PathVariable("id") int id) {
        try {
            salleRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Salles
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllSalles() {
        try {
            salleRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}