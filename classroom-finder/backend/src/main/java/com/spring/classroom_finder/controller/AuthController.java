package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private ProfesseurRepository professeurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        logger.info("Login attempt for email: {}", email);

        // Check for admin login
        if ("admin".equals(email) && "admin".equals(password)) {
            logger.info("Admin login successful");
            Map<String, Object> response = new HashMap<>();
            response.put("token", "admin-token"); // In production, generate a proper JWT token
            Map<String, Object> user = new HashMap<>();
            user.put("id", 0);
            user.put("username", "admin");
            user.put("email", "admin");
            user.put("role", "ADMIN");
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        // Check for professor login
        Optional<Professeur> professeur = professeurRepository.findByEmail(email);
        logger.info("Professor lookup result: {}", professeur.isPresent() ? "Found" : "Not found");
        
        if (professeur.isPresent()) {
            logger.info("Checking password for professor: {}", professeur.get().getNomProfesseur());
            if (professeur.get().getMot_de_passe().equals(password)) {
                logger.info("Professor login successful");
                Map<String, Object> response = new HashMap<>();
                response.put("token", "professor-token-" + professeur.get().getId_professeur());
                Map<String, Object> user = new HashMap<>();
                user.put("id", professeur.get().getId_professeur());
                user.put("username", professeur.get().getNomProfesseur() + " " + professeur.get().getPrenomProfesseur());
                user.put("email", professeur.get().getEmail());
                user.put("role", "PROFESSOR");
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                logger.info("Invalid password for professor");
            }
        }

        logger.info("Login failed for email: {}", email);
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
} 