package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Planning;
import com.spring.classroom_finder.repository.PlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    @Autowired
    private PlanningRepository planningRepository;

    // Get all Plannings
    @GetMapping
    public ResponseEntity<List<Planning>> getAllPlannings() {
        try {
            List<Planning> plannings = new ArrayList<>(planningRepository.findAll());

            if (plannings.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(plannings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Planning by id
    @GetMapping("/{id}")
    public ResponseEntity<Planning> getPlanningById(@PathVariable("id") int id) {
        Optional<Planning> planningData = planningRepository.findById(id);

        return planningData.map(planning ->
                        new ResponseEntity<>(planning, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new Planning
    @PostMapping
    public ResponseEntity<Planning> createPlanning(@RequestBody Planning planning) {
        try {
            Planning _planning = planningRepository.save(planning);
            return new ResponseEntity<>(_planning, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a Planning
    @PutMapping("/{id}")
    public ResponseEntity<Planning> updatePlanning(@PathVariable("id") int id, @RequestBody Planning planning) {
        Optional<Planning> planningData = planningRepository.findById(id);

        if (planningData.isPresent()) {
            Planning _planning = planningData.get();
            // Update planning fields based on your Planning model
            return new ResponseEntity<>(planningRepository.save(_planning), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a Planning
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePlanning(@PathVariable("id") int id) {
        try {
            planningRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Plannings
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllPlannings() {
        try {
            planningRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Plannings by filiere id
    @GetMapping("/filiere/{filiereId}")
    public ResponseEntity<List<Planning>> getPlanningsByFiliereId(@PathVariable("filiereId") int filiereId) {
        try {
            List<Planning> plannings = planningRepository.findByFiliereId(filiereId);

            if (plannings.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(plannings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Plannings by professor id
    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<Planning>> getPlanningsByProfesseurId(@PathVariable("professeurId") int professeurId) {
        try {
            List<Planning> plannings = planningRepository.findByProfesseurId(professeurId);

            if (plannings.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(plannings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Plannings by salle id
    @GetMapping("/salle/{salleId}")
    public ResponseEntity<List<Planning>> getPlanningsBySalleId(@PathVariable("salleId") int salleId) {
        try {
            List<Planning> plannings = planningRepository.findBySalleId(salleId);

            if (plannings.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(plannings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }}