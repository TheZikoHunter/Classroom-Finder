package com.spring.classroom_finder.controller;

import com.spring.classroom_finder.model.Administrateur;
import com.spring.classroom_finder.model.Professeur;
import com.spring.classroom_finder.repository.AdministrateurRepository;
import com.spring.classroom_finder.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private ProfesseurRepository professeurRepository;
    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("motDePasse");

        logger.info("Request body received: {}", credentials);

         // Add null checks
        if (email == null || password == null) {
            logger.error("Email or password is null. Email: {}, Password: {}", email, password);
            return ResponseEntity.badRequest().body("Email and password are required");
        }
        
        logger.info("Login attempt for email: {}", email);
        logger.info("Raw password received: [{}]", password);
        
        Optional<Administrateur> admin = administrateurRepository.findByEmail(email);
        logger.info("Admin search result: {}", admin.isPresent() ? "Found" : "Not found");

    
        if (admin.isPresent()) {
            logger.info("Admin found in database: {}", admin.get().getNom());
            
            String storedHash = admin.get().getMotDePasse();
            logger.info("Stored password hash: [{}]", storedHash);
            logger.info("Stored hash length: {}", storedHash != null ? storedHash.length() : "null");
            logger.info("Password encoder class: {}", passwordEncoder.getClass().getName());
            
            // Use password encoder to verify hashed password
            boolean passwordMatches = passwordEncoder.matches(password, storedHash);
            logger.info("Password matches result: {}", passwordMatches);
            
            if (passwordMatches) {
                logger.info("Admin login successful");
                Map<String, Object> response = new HashMap<>();
                response.put("token", "admin-token-" + admin.get().getIdAdministrateur());
                Map<String, Object> user = new HashMap<>();
                user.put("id", admin.get().getIdAdministrateur());
                user.put("username", admin.get().getNom() + " " + admin.get().getPrenom());
                user.put("email", admin.get().getEmail());
                user.put("role", "ADMIN");
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                logger.info("Invalid password for admin");
            }
        }

// Check for professor login
Optional<Professeur> professeur = professeurRepository.findByEmail(email);
logger.info("Professor lookup result: {}", professeur.isPresent() ? "Found" : "Not found");

if (professeur.isPresent()) {
    logger.info("Checking password for professor: {}", professeur.get().getNomProfesseur());

    String storedHash = professeur.get().getMotDePasse();
    logger.info("Professor stored password hash: [{}]", storedHash);

    // Use password encoder for professors too
    boolean passwordMatches = passwordEncoder.matches(password, storedHash);
    logger.info("Professor password matches: {}", passwordMatches);

    if (passwordMatches) {
        logger.info("Professor login successful");
        Map<String, Object> response = new HashMap<>();
        response.put("token", "professor-token-" + professeur.get().getIdProfesseur());
        Map<String, Object> user = new HashMap<>();
        user.put("id", professeur.get().getIdProfesseur());
        user.put("username", professeur.get().getNomProfesseur() + " " + professeur.get().getPrenomProfesseur());
        user.put("email", professeur.get().getEmail());
        user.put("role", "PROFESSOR");
        response.put("user", user);
        return ResponseEntity.ok(response);
    } else {
        logger.info("Invalid password for professor");
    }
}
// If neither admin nor professor login is successful, return unauthorized
logger.info("Login failed for email: {}", email);
return ResponseEntity.status(401).body("Invalid email or password.");
    }
}