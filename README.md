# GameOfLife

## Steps to Run the Frontend React App
1. Navigate into the game-app directory
2. Install any packages by running the command *npm i*
3. Run the react app with the command *npm start*
4. To add more players just deploy the react server in a different terminal to localhost:3001, 3002, and so on.

## Steps to Run the Backend Flask App
1. Navigate into flask-app directory
2. Install any libraries by running the command *pip install -r requirements.txt*
3. Run the flask app via the command *python app.py*



# Game of Life Docker Deployment

This repository contains the Docker setup for deploying the Game of Life application, which consists of a Flask backend and a React frontend.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/GameOfLife.git
    cd GameOfLife
    ```

2. Build and run the Docker containers:

    ```bash
    docker-compose up --build
    ```

   This command will build the Docker images and start the containers for the Flask backend and React frontend.

3. Access the applications:

   - Flask Backend: [http://localhost:5000](http://localhost:5000)
   - React Frontend: [http://localhost:3000](http://localhost:3000)

## Important Notes

- **Flask Backend:**
  - The Flask backend is accessible at [http://localhost:5000](http://localhost:5000).
  - The Werkzeug development server is used for simplicity. In a production environment, consider using a production-ready server like Gunicorn.

- **React Frontend:**
  - The React frontend is accessible at [http://localhost:3000](http://localhost:3000).
  - The React app is configured to proxy requests to the Flask backend at [http://localhost:5000](http://localhost:5000).

- **Important:** Ensure that the Flask backend and React frontend containers are on the same network (`app-network`). This is configured in the `docker-compose.yml` file.

## Stopping the Containers

To stop the Docker containers, use the following command:

```bash
docker-compose down

