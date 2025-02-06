# Laravel + MongoDB + Vite (VueJS) + Nginx Docker Setup

This project demonstrates how to run a Laravel application using MongoDB, Vite (with VueJS), and Nginx in Docker. All Docker-related files are placed in the **Docker/** folder inside your project.

There are two environments provided:
- **Development:** Uses volume mounts so that changes on your machine (using Docker’s Linux containers) are reflected immediately in the containers.
- **Production:** Copies the code into the images during build so that the containers are self-contained.

> **Note:** This setup requires Docker Desktop (or another Docker environment) on Windows running Linux containers.

## Project Structure
project/   
&nbsp;&nbsp;├── app files and folders… <br />
&nbsp;&nbsp;&nbsp;&nbsp;└── Docker/ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Dockerfile.php.dev # PHP dev image (Laravel with ext-mongodb) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Dockerfile.prod # prod image (Laravel with ext-mongodb and Node JS build) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Dockerfile.node.dev # Node/Vite dev image (runs npm install & npm run dev) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── docker-compose.dev.yml # Compose file for development mode <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── docker-compose.prod.yml # Compose file for production mode <br />
&nbsp;&nbsp;&nbsp;&nbsp;└── nginx <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── dev/default.conf # Nginx config for development (with Vite proxy) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── prod/default.conf

# Nginx config for production

## Requirements

- **OS:** Windows (using Docker’s Linux containers)
- **Docker:** Docker Desktop (or equivalent) configured to run Linux containers
- **PHP:** Version 8.4 FPM with the `ext-mongodb` extension installed via PECL
- **Node:** Version 22 (for Vite and VueJS)
- **Nginx:** Latest Alpine-based image
- **MongoDB:** Latest official MongoDB image

## Dockerfiles Overview

### PHP (Laravel)

- **Development (`Dockerfile.php.dev`):**  
  Uses PHP 8.4 FPM, installs required dependencies including `ext-mongodb`, and sets the working directory to `/var/www/html`. In dev mode, your project is mounted into the container so the files are not copied.

- **Production (`Dockerfile.php.prod`):**  
  Copies the entire project (from the parent folder) into the image and runs `composer install` without dev dependencies.

### Node/Vite (VueJS)

- **Development (`Dockerfile.node.dev`):**  
  Uses Node 22, sets the working directory to `/var/www/html`, and automatically runs `npm install` then `npm run dev`. The container uses a bind mount so that any file changes are immediately available.

- **Production (`Dockerfile.node.prod`):**  
  Copies the project files into the image and builds the production assets (`npm run build`).

### Nginx

- **Development (`nginx/dev/default.conf`):**  
  Serves the Laravel `public` folder, forwards PHP requests to the PHP container, and optionally proxies Vite requests (assumed on port 3000).

- **Production (`nginx/prod/default.conf`):**  
  Similar configuration without Vite proxy settings, serving the built assets.

## Docker Compose Files

### Development (`docker-compose.dev.yml`)

- **Build Context:** Set to the parent folder (`../`) so that the project files are available.
- **Volumes:** Mounts the project folder (`../`) into the PHP and Node containers for live updates.
- **Node Service:** Automatically runs `npm install` and then `npm run dev` on container startup.
- **Nginx:** Uses the development configuration file and mounts the project folder.

### Production (`docker-compose.prod.yml`)

- **Build Context:** Set to the parent folder so that all project files are copied during image build.
- **No Volume Mounts:** The PHP and Node containers copy the code into the image.
- **Nginx:** Serves the production build from the built assets (assumed to be in the `public` folder).

## How to Run

### Prerequisites

1. **Install Docker Desktop:** Ensure Docker Desktop is installed on your Windows machine and is configured to run Linux containers.
2. **Clone/Set Up Your Project:** Place your Laravel project (along with VueJS/Vite files) in the project root alongside the **Docker/** folder.

### Running in Development Mode

Open a terminal in the **Docker/** folder and run:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This command builds and starts the containers for PHP, Node (Vite), Nginx, and MongoDB. Since the project folder is mounted into the containers, any changes to your files on your host will immediately reflect inside the containers. The Node container automatically runs npm install before starting the Vite server.

### Running in Production Mode

When ready to deploy or test the production build, open a terminal in the Docker/ folder and run:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

This command builds the production images for PHP and Node (copying the project files and building assets) and starts Nginx to serve your static files. There are no volume mounts in production mode.

## Additional Notes
### PHP ext-mongodb:
The PHP Dockerfiles install the ext-mongodb extension via PECL, which is required for Laravel to connect with MongoDB.

### Volume Mounts on Windows:
Ensure Docker Desktop has file sharing enabled for the drive containing your project for proper volume mounting.

### Customization:
Adjust the Dockerfiles, docker-compose files, and Nginx configurations as needed to suit your project requirements and environment variables.

### Troubleshooting:
Use ```bash docker-compose logs``` to view container logs if you encounter any issues during startup.
