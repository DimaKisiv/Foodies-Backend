# Foodies - Backend

This repository contains the server-side REST API for the **Foodies** project. Built with Node.js and Express, it manages data persistence, user authentication, and business logic for the recipe sharing platform.

## 🚀 Overview

The backend is designed to provide a robust API for the frontend client, handling complex queries for recipe filtering, social graph management (followers/following), and secure file uploads. It connects to a PostgreSQL database using an ORM for structured data modeling.

### Key Functionality
* **Authentication & Security:** Implements JWT (JSON Web Tokens) for secure stateless authentication. Passwords are hashed before storage.
* **Recipe Operations:**
    * CRUD operations for recipes.
    * Advanced search logic (by category, area, ingredient).
    * "Popular" recipes calculation based on user favorites.
* **Social Features:** Endpoints to handle user subscriptions (follow/unfollow) and retrieve follower lists.
* **Data Serving:** Provides public endpoints for static resources like Categories, Areas, Ingredients, and Testimonials.
* **File Uploads:** Handles image uploads for user avatars and recipe thumbnails, storing them in the public directory.
* **API Documentation:** Fully documented endpoints using Swagger, accessible via a dedicated route.

## 🛠 Tech Stack & Dependencies

The server is built on **Node.js** and **Express**.

**Core Framework:**
* **Express:** The web framework used for routing and middleware management.
* **Cors:** Middleware to enable Cross-Origin Resource Sharing for the frontend client.
* **Dotenv:** Loads environment variables for configuration.

**Database & Validation:**
* **Sequelize:** A promise-based Node.js ORM for PostgreSQL. It handles models, migrations, and database synchronization.
* **Joi:** Used for validating incoming request data (body, params) to ensure data integrity.

**Authentication & Utilities:**
* **Bcryptjs:** Used for hashing and salting user passwords.
* **Jsonwebtoken (JWT):** Generates and verifies access tokens.
* **Multer:** Middleware for handling `multipart/form-data`, specifically for image uploads.
* **Swagger-ui-express / Swagger-jsdoc:** Generates interactive API documentation at the `/swagger` endpoint.

## 📦 Installation & Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in a `.env` file (Database credentials, JWT secret, PORT, etc.).
4.  **Database Setup:**
    * Ensure your PostgreSQL instance is running.
    * The app utilizes Sequelize to sync models.
    * You can seed the database with initial data (categories, ingredients, etc.) using:
        ```bash
        npm run seed
        ```
5.  Start the server:
    * Development (with hot reload): `npm run dev`
    * Production: `npm start`

## 📖 Documentation

Once the server is running, full API documentation is available at:
`http://localhost:<PORT>/swagger`