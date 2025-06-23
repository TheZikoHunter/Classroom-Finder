# Classroom Finder – Localisation de salles disponibles

Application full-stack développée pour faciliter la recherche de salles libres sur un campus universitaire, en fonction de l'heure, du jour et du bâtiment. Classroom Finder vise à améliorer la gestion des ressources physiques dans les établissements d’enseignement.

---

## Objectifs

- Permettre aux étudiants et enseignants de localiser rapidement une salle libre  
- Optimiser l’utilisation des espaces pédagogiques  
- Fournir une interface rapide, sécurisée et responsive  
- Centraliser les données d’occupation des salles

---

## Fonctionnalités principales

- Recherche de salles par date, heure, bâtiment ou type  
- Authentification des utilisateurs (Spring Security)  
- Visualisation des disponibilités en temps réel  
- Interface web Angular intuitive  
- Accès multi-profils : étudiants, enseignants, staff  

---

## Technologies utilisées

- **Back-end** :
  - Java
  - Spring Boot (REST APIs)
  - Spring Data JPA
  - Spring Security
  - Maven
  - MySQL

- **Front-end** :
  - Angular
  - HTML / CSS / TypeScript
  - Bootstrap

---

## Architecture

- Architecture RESTful  
- Séparation claire entre back-end (API) et front-end  
- Authentification basée sur rôles (JWT ou session selon config)  
- Modèle relationnel stocké dans MySQL

---

## Exécution

### Backend
```bash
cd backend/
mvn spring-boot:run
