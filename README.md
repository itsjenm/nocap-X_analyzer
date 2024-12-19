# nocap-X_analyzer

## Table of Contents
1. [Introduction](#introduction)
2. [Setup Backend Server](#setup-backend-server)
3. [Setup Frontend](#setup-frontend)
4. [Running the Application](#running-the-application)

## Introduction
This document provides a step-by-step guide to set up the backend server and frontend for the nocap-X_analyzer web application.

## Setup Backend Server
1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/nocap-X_analyzer.git
    cd nocap-X_analyzer/backend
    ```
2. **Create a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
4. **Configure environment variables:**
    Create a `.env` file in the `backend` directory and add the necessary environment variables from X API Dev Platform
    ```env
    CONSUMER_KEY=
    CONSUMER_SECRET=
    ACCESS_TOKEN=
    ACCESS_TOKEN_SECRET=
    BEARER_TOKEN=
    ```
5. **Run the server:**
    ```sh
    uvicorn app:app --reload
    ```

## Setup Frontend
1. **Navigate to the frontend directory:**
    ```sh
    cd ../nocap-app
    ```
2. **Install dependencies:**
    ```sh
    npm install
    ```
3. **Configure environment variables:**
    Create a `.env` file in the `frontend` directory and add the necessary environment variables.
    ```env
    REACT_APP_API_URL=http://localhost:8000
    ```
4. **Run the frontend:**
    ```sh
    npm start
    ```

## Running the Application
1. Ensure the backend server is running.
2. Ensure the frontend is running.
3. Open your browser and navigate to `http://localhost:3000` to access the web application.