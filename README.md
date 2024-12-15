# Advanced Bookstore API
 Develop a RESTful API for a bookstore application. The API will allow users
to perform CRUD operations on books, authors, and genres. Additionally, users should
be able to search for books by title, author, or genre.

## Features
- Book CRUD operations
- Author CRUD operations
- Genre CRUD operations
- User CRUD operations
- Authentication
## Requirements
- Use Node.js with the NestJS framework.
- Use TypeScript as the programming language.
- Utilize a relational database (PostgreSQL or MySQL).
- Use TypeORM or Prisma for database interactions.
- Implement authentication and authorization using JWT
  
## Getting Started
1.Clone the repository:

git clone https://pages.github.com/](https://github.com/devabdallahragheb/advanced-bookstoreAPI.git .  

2. Create .env file like  .env.example in root of app
3. docker-compose up --build for install postgresql and redis if you already install postgres and redis please skip this step
4. Install dependencies:
     npm install
5. Start the server:
   npm run start:dev
6.Access the application at http://localhost:3000.
## Endpoints
- /api-docs   //for swagger
- /api-docs-json  //for openapi
## Example Curl 
 first you must ave vaild token from register new user or login apis 
1. //for register new user  curl --location 'http://localhost:3000/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "firstName": "qabdullah11",
  "lastName": "qabdelglil1",
  "email": "qtwest@test11.com",
  "password": "123456789",
  "address": "test",
  "phone": "+201224823098"
}'
2. // for create new genres curl --location 'http://localhost:3000/api/v1/genres' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzgwZjZiYS1jMDlkLTQ0OGUtYjczMS1lZDQ1ZDQzMTdiYWQiLCJpYXQiOjE3MzQyOTMxNzQsImV4cCI6MTczNDM3OTU3NH0.rKZdJYsiETbUa9leMbjlRg5RDgBHJmOv2SMkeNm4El8' \
--data '{
  "name": "action"
}'
3. // for new authors curl --location 'http://localhost:3000/api/v1/authors' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzgwZjZiYS1jMDlkLTQ0OGUtYjczMS1lZDQ1ZDQzMTdiYWQiLCJpYXQiOjE3MzQyOTMxNzQsImV4cCI6MTczNDM3OTU3NH0.rKZdJYsiETbUa9leMbjlRg5RDgBHJmOv2SMkeNm4El8' \
--data '{
  "name": "abdullah",
  "biography": "have certificate",
   "birthDate": "1990-01-20T00:00:00.000Z"
}'
4. // for new book curl --location 'http://localhost:3000/api/v1/books' \
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
    ERD , Class Digrame ,requirments in desgin folder at root
### this is post man collection [https://orange-satellite-870733.postman.co/workspace/TDRA~912c536b-3f54-49d1-9ac4-014cca31bc3d/collection/27835951-4af1de32-f493-4950-abdc-aa1583f59c9c?action=share&creator=27835951](https://orange-satellite-870733.postman.co/workspace/TDRA~912c536b-3f54-49d1-9ac4-014cca31bc3d/collection/27835951-4af1de32-f493-4950-abdc-aa1583f59c9c?action=share&creator=27835951)
