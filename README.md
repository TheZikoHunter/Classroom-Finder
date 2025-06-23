# Classroom Finder

Classroom Finder is a full-stack application designed to help users locate available classrooms. The project is organized into a backend (Java/Maven) and a frontend (Angular).

## Project Structure

- `backend/` - Contains the backend code (Java, Maven).
- `ui/` - Contains the frontend code (Angular).

---

## Backend

The backend is a Java application managed with Maven.

### Getting Started

1. **Navigate to the backend directory:**
    ```bash
    cd classroom-finder/backend
    ```

2. **Build the project:**
    ```bash
    ./mvnw clean install
    ```

3. **Run the backend server:**
    ```bash
    ./mvnw spring-boot:run
    ```

> The backend will typically start on `http://localhost:8080/` (verify in your configuration).

---

## Frontend

The frontend is built with Angular.

### Development Server

1. **Navigate to the UI directory:**
    ```bash
    cd classroom-finder/ui
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    ng serve
    ```

4. Open your browser to [http://localhost:4200/](http://localhost:4200/). The application reloads automatically when you modify source files.

### Building

To build the frontend for production:
```bash
ng build
```
The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

To execute unit tests:
```bash
ng test
```

### Running End-to-End Tests

For end-to-end (e2e) testing:
```bash
ng e2e
```
> Note: Angular CLI does not include an e2e framework by default. Choose one that fits your needs.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

[MIT](LICENSE) (replace with your actual license if different)

---

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

---

*This README is a template. Add project-specific details such as API endpoints, deployment, and contact information as needed.*
