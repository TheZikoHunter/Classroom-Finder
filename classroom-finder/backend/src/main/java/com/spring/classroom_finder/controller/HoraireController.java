package com.spring.classroom_finder.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.classroom_finder.model.Horaire;
import com.spring.classroom_finder.repository.HoraireRepository;

@RestController
@RequestMapping("/api/horaires")
public class HoraireController {

    private final HoraireRepository horaireRepository;

    @Autowired
    public HoraireController(HoraireRepository horaireRepository) {
        this.horaireRepository = horaireRepository;
    }

    /**
     * Get all horaires
     */
    @GetMapping
    public ResponseEntity<List<Horaire>> getAllHoraires() {
        List<Horaire> horaires = horaireRepository.findAll();
        return new ResponseEntity<>(horaires, HttpStatus.OK);
    }

    /**
     * Get horaire by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Horaire> getHoraireById(@PathVariable Integer id) {
        Optional<Horaire> horaire = horaireRepository.findById(id);
        return horaire.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new horaire
     */

    /**
     * Update an existing horaire
     */
   



    /**
     * Delete a horaire
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoraire(@PathVariable Integer id) {
        if (!horaireRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        horaireRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get horaires by day



   





    /**
     * Request DTO for creating/updating horaire
     */
    public static class HoraireRequest {
        private String heureDebut;
        private String heureFin;
        private String jour;

        public HoraireRequest() {}

        public HoraireRequest(String heureDebut, String heureFin, String jour) {
            this.heureDebut = heureDebut;
            this.heureFin = heureFin;
            this.jour = jour;
        }

        public String getHeureDebut() {
            return heureDebut;
        }

        public void setHeureDebut(String heureDebut) {
            this.heureDebut = heureDebut;
        }

        public String getHeureFin() {
            return heureFin;
        }

        public void setHeureFin(String heureFin) {
            this.heureFin = heureFin;
        }

        public String getJour() {
            return jour;
        }

        public void setJour(String jour) {
            this.jour = jour;
        }
    }
}