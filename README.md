# Advanced Bookstore API
 Develop a RESTful API for a bookstore application. The API will allow users
to perform CRUD operations on books, authors, and genres. Additionally, users should
be able to search for books by title, author, or genre.

## Features
- CRUD operations for books, authors, genres, and users.
- User authentication  with JWT.
- Swagger/OpenAPI documentation.
  
## Requirements
- Node.js with the NestJS framework.
- TypeScript as the programming language.
- PostgreSQL  as the relational database.
- TypeORM  for database interactions.
- Implement authentication  using JWT.
- Caching: Use Redis for caching to optimize data retrieval and improve performance.
- Queuing:
Handle asynchronous tasks, such as sending notifications when a new book is added.
Use Bull or BullMQ with Redis for task queues, and implement a worker to process queued tasks as described in the NestJS [Queues documentation](https://docs.nestjs.com/techniques/queues).
  
## Getting Started
1.Clone the repository:
git clone https://github.com/devabdallahragheb/advanced-bookstoreAPI.git
cd advanced-bookstoreAPI

2.Create a .env file in the root directory based on the .env.example file:
cp .env.example .env

3. Start Docker containers (for PostgreSQL and Redis):
   docker-compose up --build

4. Install dependencies:
     npm install
5. Start the server:
   npm run start:dev
6.Access the application:
API: http://localhost:3000
Swagger: http://localhost:3000/api-docs

## Endpoints
- /api-docs: Interactive Swagger API documentation.
- /api-docs-json: OpenAPI JSON documentation.
## Example cURL Requests
 ### Note: Ensure you have a valid JWT token by registering a new user or logging in.
1. Register a new user:
 curl --location 'http://localhost:3000/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "firstName": "qabdullah11",
  "lastName": "qabdelglil1",
  "email": "qtwest@test11.com",
  "password": "123456789",
  "address": "test",
  "phone": "+201224823098"
}'
2. Create a new genre:
 curl --location 'http://localhost:3000/api/v1/genres' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzgwZjZiYS1jMDlkLTQ0OGUtYjczMS1lZDQ1ZDQzMTdiYWQiLCJpYXQiOjE3MzQyOTMxNzQsImV4cCI6MTczNDM3OTU3NH0.rKZdJYsiETbUa9leMbjlRg5RDgBHJmOv2SMkeNm4El8' \
--data '{
  "name": "action"
}'
3. Add a new author:
 curl --location 'http://localhost:3000/api/v1/authors' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzgwZjZiYS1jMDlkLTQ0OGUtYjczMS1lZDQ1ZDQzMTdiYWQiLCJpYXQiOjE3MzQyOTMxNzQsImV4cCI6MTczNDM3OTU3NH0.rKZdJYsiETbUa9leMbjlRg5RDgBHJmOv2SMkeNm4El8' \
--data '{
  "name": "abdullah",
  "biography": "have certificate",
   "birthDate": "1990-01-20T00:00:00.000Z"
}'
4. Add a new book:
 curl --location 'http://localhost:3000/api/v1/books' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzgwZjZiYS1jMDlkLTQ0OGUtYjczMS1lZDQ1ZDQzMTdiYWQiLCJpYXQiOjE3MzQyOTMxNzQsImV4cCI6MTczNDM3OTU3NH0.rKZdJYsiETbUa9leMbjlRg5RDgBHJmOv2SMkeNm4El8' \
--data '{
  "title": "ahmedq2",
  "description": "ahmedq2",
  "publicationDate": "2024-12-14T06:36:52.542Z",
  "authorId": "acb0e720-da73-42e6-84fd-919d407f8f96",
  "genreId": "76015214-a9b8-4be1-9313-3d1f90542c20"
}'

## Design
    Entity Relationship Diagram (ERD), class diagrams, and requirements are available in the design folder at the root of the repository.
    
##Postman Collection
Access the Postman collection [here](https://orange-satellite-870733.postman.co/workspace/TDRA~912c536b-3f54-49d1-9ac4-014cca31bc3d/collection/27835951-4af1de32-f493-4950-abdc-aa1583f59c9c?action=share&creator=27835951)
 
