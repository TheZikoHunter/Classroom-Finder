package com.spring.classroom_finder.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.spring.classroom_finder.model.Matiere;
import com.spring.classroom_finder.repository.MatiereRepository;

@RestController
@RequestMapping("/api/matieres")
public class MatiereController {

    @Autowired
    private MatiereRepository matiereRepository;

    // Get all Matieres
    @GetMapping
    public ResponseEntity<List<Matiere>> getAllMatieres(@RequestParam(required = false) String nom) {
        try {
            List<Matiere> matieres = new ArrayList<>();

            if (nom == null)
                matieres.addAll(matiereRepository.findAll());
            else
                matieres.addAll(matiereRepository.findByNomMatiereContaining(nom));

            if (matieres.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(matieres, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<List<Matiere>>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Matiere by id
    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getMatiereById(@PathVariable("id") int id) {
        java.util.Optional<Matiere> matiereData = matiereRepository.findById(id);

        if (matiereData.isPresent()) {
            return new ResponseEntity<>(matiereData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    // Create a new Matiere
    @PostMapping
    public ResponseEntity<Matiere> createMatiere(@RequestBody Matiere matiere) {
        try {
            Matiere _matiere = matiereRepository.save(matiere);
            return new ResponseEntity<>(_matiere, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Delete a Matiere
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMatiere(@PathVariable("id") int id) {
        try {
            matiereRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all Matieres
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllMatieres() {
        try {
            matiereRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    


}