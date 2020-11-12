# Getting Started
This is a simple frontend application to query health provider by their first name
and display related details. 

# Prerequisites
- Git
- nodejs
- docker (optional & recommended way)

# Building and Running application

- Clone the app `git clone https://github.com/Arpitha93/health_provider_search.git`
- `cd health_provider_search`
	- **Steps to run directly (not recommended)**
		- Install dependencies `npm install`
		- Run application `npm start`
	- **Steps to run in Docker (recommended)**
		- Install Docker
		- Build docker image from source folder `docker build -t myApp/healthapp .`
		- Run our built image `docker run -p 3000:3000 -d --name healthapp myApp/healthapp`
- View the http page http://localhost:3000.

