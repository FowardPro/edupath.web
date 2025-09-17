# EduPath 🚀

[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Empowering students with AI-driven career exploration and intelligent study tools.**

EduPath is a dedicated platform that provides tailored AI assistance to students at every stage of their academic journey, helping them navigate their future careers and master their current studies.

## ✨ Features

### For High School Students
*   **AI-Powered Career Exploration:** Get personalized career recommendations based on your interests, skills, and academic performance.

### For University Students
*   **AI-Generated Quizzes:** Upload your class notes, and our AI instantly creates custom practice quizzes and flashcards.

## 🏗️ Architecture Overview

EduPath is a decoupled web application:
*   **Frontend:** A React.js single-page application (SPA) that handles the user interface.
*   **Backend:** A Django REST Framework (DRF) API that handles business logic, data, and AI processing.
*   **Communication:** The frontend and backend interact via RESTful HTTP requests (JSON).

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher) & npm
*   Python (v3.10 or higher) & pip
*   PostgreSQL

### Installation & Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/edupath.git
    cd edupath
    ```

2.  **Backend (Django) Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create a virtual environment and activate it
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

    # Install Python dependencies
    pip install -r requirements.txt

    # Run database migrations
    python manage.py migrate

    # (Optional) Load initial data
    python manage.py loaddata initial_data

    # Start the development server
    python manage.py runserver
    ```
    The API will be available at `http://localhost:8000`.

3.  **Frontend (React) Setup:**
    ```bash
    # Open a new terminal, navigate to the project root, then to the frontend directory
    cd frontend

    # Install JavaScript dependencies
    npm install

    # Start the development server
    npm start
    ```
    The app will automatically open in your browser at `http://localhost:3000`.

## 📁 Project Structure
