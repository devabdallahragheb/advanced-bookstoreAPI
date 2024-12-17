# Advanced Bookstore API

## Overview
 Develop a RESTful API for *Advanced Bookstore API** The API will allow users
to perform CRUD operations on books, authors, and genres. Additionally, users should
be able to search for books by title, author, or genre.

### Core Functionality
- **Books**: Perform CRUD operations on books and search for books by title, author, or genre.
- **Authors**: Manage author details through CRUD operations.
- **Genres**: Manage genre details through CRUD operations.

### Authentication 
- User registration and login with JWT-based authentication.
- Only authenticated users can perform CRUD operations on books, authors, and genres.

### Validation & Error Handling
- DTO-based validation using `class-validator`.
- Global exception handling for proper error messaging.

### Optional Features (Bonus)
- Implement response caching for book listings and details using Redis to optimize data retrieval and improve performance.
- Implement queue-based notifications for new book additions to handle asynchronous tasks, such as sending notifications when a new book is added. For example, you can log a message like Sending notification: New book "${bookTitle}" added by user ${userId} after a book is created. Use Bull or BullMQ with Redis for task queues, and set up a worker to process queued tasks as described in the NestJS [Queues documentation](https://docs.nestjs.com/techniques/queues).
  
  
## Installation
### 1. Clone the repository:
   ```bash
git clone https://github.com/devabdallahragheb/advanced-bookstoreAPI.git
cd advanced-bookstoreAPI
   ```
### 2. Create a .env file
Create a .env file in the root directory based on the .env.example file:
 ```bash
cp .env.example .env
```
### 3. Run with Docker (Optional)
   
If you do not have PostgreSQL or Redis installed locally, you can run the application with Docker, which will automatically set up PostgreSQL, Redis, and the application container:
 ```bash
docker-compose up --build
```

Note: If you use Docker, skip steps 4 and 5.

### 4. Install dependencies:
     npm install
   
### 5. Start the server:
 ```bash
   npm run start:dev
   ```
### 6. Access the application:

API: http://localhost:3000
Swagger: http://localhost:3000/api-docs
OpenAPI :http://localhost:3000/api-docs-json
##API Documentation
The API documentation is available via Swagger. Once the server is running, navigate to:

## API Endpoints

### **Users**
#### Fetch All Users
- **GET** `/api/v1/users/list`
  - **Query Parameters**:
    - `offset` *(required)*: Pagination offset (e.g., `1`)
    - `limit` *(required)*: Pagination limit (e.g., `20`)
  - **Response**:  
    - `201`: List of users.

#### Delete User by ID
- **DELETE** `/api/v1/users/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the user to delete (e.g., `12345`)
  - **Response**:  
    - `200`: User deleted.

#### Fetch User Profile
- **GET** `/api/v1/users/profile`
  - **Response**:  
    - `200`: User profile object.

#### Update User Profile
- **PATCH** `/api/v1/users/profile`
  - **Request Body** *(JSON)*:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "address": "string"
    }
    ```
  - **Response**:  
    - `200`: Updated user profile object.

---

### **Authentication**
#### Register a New User
- **POST** `/api/v1/auth/register`
  - **Request Body** *(JSON)*:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string",
      "address": "string",
      "phone": "string"
    }
    ```
  - **Response**:  
    - `201`: Registered user object with access tokens.

#### User Login
- **POST** `/api/v1/auth/login`
  - **Request Body** *(JSON)*:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Response**:  
    - `201`: Logged-in user object with access tokens.

#### User Logout
- **POST** `/api/v1/auth/logout`
  - **Response**:  
    - `200`: User logged out successfully.

#### Refresh User Token
- **GET** `/api/v1/auth/refresh`
  - **Response**:  
    - `200`: New access token.

---

### **Authors**
#### Create a New Author
- **POST** `/api/v1/authors`
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "string",
      "biography": "string",
      "birthDate": "string",
      "createdBy": "string"
    }
    ```
  - **Response**:  
    - `201`: Created author object.

#### Get All Authors
- **GET** `/api/v1/authors`
  - **Query Parameters**:
    - `offset` *(required)*: Pagination offset (e.g., `1`)
    - `limit` *(required)*: Pagination limit (e.g., `20`)
  - **Response**:  
    - `200`: List of authors.

#### Get Author by ID
- **GET** `/api/v1/authors/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the author to retrieve (e.g., `12345`)
  - **Response**:  
    - `200`: Author object.

#### Update Author by ID
- **PUT** `/api/v1/authors/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the author to update (e.g., `12345`)
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "string",
      "biography": "string",
      "birthDate": "string"
    }
    ```
  - **Response**:  
    - `200`: Updated author object.

#### Delete Author by ID
- **DELETE** `/api/v1/authors/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the author to delete (e.g., `12345`)
  - **Response**:  
    - `200`: Author deleted.

---

### **Genres**
#### Create a New Genre
- **POST** `/api/v1/genres`
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "string",
      "createdBy": "string"
    }
    ```
  - **Response**:  
    - `201`: Created genre object.

#### Get All Genres
- **GET** `/api/v1/genres`
  - **Query Parameters**:
    - `offset` *(required)*: Pagination offset (e.g., `1`)
    - `limit` *(required)*: Pagination limit (e.g., `20`)
  - **Response**:  
    - `200`: List of genres.

#### Get Genre by ID
- **GET** `/api/v1/genres/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the genre to retrieve (e.g., `12345`)
  - **Response**:  
    - `200`: Genre object.

#### Update Genre by ID
- **PUT** `/api/v1/genres/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the genre to update (e.g., `12345`)
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "string"
    }
    ```
  - **Response**:  
    - `200`: Updated genre object.

#### Delete Genre by ID
- **DELETE** `/api/v1/genres/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the genre to delete (e.g., `12345`)
  - **Response**:  
    - `200`: Genre deleted.

---

### **Books**
#### Create a New Book
- **POST** `/api/v1/books`
  - **Request Body** *(JSON)*:
    ```json
    {
      "title": "string",
      "description": "string",
      "publicationDate": "string",
      "authorId": "string",
      "genreId": "string",
      "createdBy": "string"
    }
    ```
  - **Response**:  
    - `201`: Created book object.

#### Get All Books
- **GET** `/api/v1/books`
  - **Query Parameters**:
    - `offset` *(required)*: Pagination offset (e.g., `1`)
    - `limit` *(required)*: Pagination limit (e.g., `20`)
  - **Response**:  
    - `200`: List of books.

#### Get Book by ID
- **GET** `/api/v1/books/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the book to retrieve (e.g., `12345`)
  - **Response**:  
    - `200`: Book object.

#### Update Book by ID
- **PUT** `/api/v1/books/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the book to update (e.g., `12345`)
  - **Request Body** *(JSON)*:
    ```json
    {
      "title": "string",
      "description": "string",
      "publicationDate": "string"
    }
    ```
  - **Response**:  
    - `200`: Updated book object.

#### Delete Book by ID
- **DELETE** `/api/v1/books/{id}`
  - **Path Parameters**:  
    - `id` *(required)*: The ID of the book to delete (e.g., `12345`)
  - **Response**:  
    - `200`: Book deleted.

POST /auth/login: Log in and obtain a JWT token.

## Design

    Entity Relationship Diagram (ERD), class diagrams, and requirements are available in the design folder at the root of the repository.
    
##Postman Collection

Access the Postman collection [here](https://orange-satellite-870733.postman.co/workspace/TDRA~912c536b-3f54-49d1-9ac4-014cca31bc3d/collection/27835951-4af1de32-f493-4950-abdc-aa1583f59c9c?action=share&creator=27835951)
 
