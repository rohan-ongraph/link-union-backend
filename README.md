# Link Union

Link Union is a web application designed for managing links from various sources. It allows users to save links along with a name, description, and tags. The application supports user authentication, user profiles, CRUD operations for managing links, contact forms, and more.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
    - [Running Link Union Backend Locally](#running-link-union-backend-locally)
    - [Deploy on Render](#deploy-on-render)
3. [Backend Setup](#backend-setup)
    - [Environment Variables](#environment-variables)
    - [MongoDB Setup](#mongodb-setup)
    - [Middleware](#middleware)
    - [Passport Configuration](#passport-configuration)
4. [Routes](#routes)
    - [Authentication Routes](#authentication-routes)
    - [User Routes](#user-routes)
    - [Link Routes](#link-routes)
5. [Controllers](#controllers)
6. [Models](#models)
7. [Middleware](#middleware-1)
8. [Setting Up Development Environment](#setting-up-development-environment)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [Further Help](#further-help)

## Installation

To install Link Union locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd link-union`
3. Install dependencies: `npm install` or `npm i`

## Usage

### Running Link Union Backend Locally

To run the Link Union backend locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd link-union`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add the necessary environment variables:

```plaintext
MONGO_DB_CLUSTER_URL=<your-mongodb-cluster-url>
TOKEN_SECRET_KEY=<your-secret-key>
```

1. Ensure MongoDB is installed and running locally or provide the URL for MongoDB Atlas cluster in the `.env` file.
2. Start the server using the following command: `npm start`
3. The server will start running locally on port 5000 by default. You can access the endpoints using an API testing tool like Postman or via frontend integration.

### Deploy on Render

Link Union is deployed on Render as a web service. Follow these steps to deploy:

1. Build the Angular application using `ng build`.
2. Navigate to the build directory: `cd dist/link-union`.
3. Create a new file named `render.yaml` and add the following configuration:

   ```yaml
   services:
   - name: link-union
     type: web
     buildCommand: npm install && npm run build
     startCommand: npm start
    ```
Create a new Render account if you haven't already.
Add a new web service on Render and specify the GitHub repository where your Link Union code is hosted.
Deploy the service on Render.

## Backend Setup

1. **Environment Variables**: Create a `.env` file with the necessary environment variables, including MongoDB cluster URL and token secret key.

2. **MongoDB Setup**: Ensure MongoDB Atlas cluster is set up and accessible. The cluster URL should be provided in the `.env` file.

3. **Middleware**: Configure middleware such as CORS, cookie-parser, and express.json for handling requests.

4. **Passport Configuration**: Configure Passport.js for user authentication, including JWT token strategy and Google OAuth2.0 strategy.

## Routes

### Authentication Routes

- `/register`: POST request to register a new user.
- `/login`: POST request to log in a user.
- `/auth/google`: GET request for Google sign-in authentication.
- `/auth/google/callback`: GET request callback route for Google authentication.

### User Routes

- `/:userId`: GET request to fetch user details by ID.
- `/:userId/delete`: DELETE request to delete a user and associated links.
- `/:userId/contact`: POST request to submit a contact form.

### Link Routes

- `/:userId/add-link`: POST request to add a new link for a user.
- `/:userId/links/:linkId`: GET request to fetch a specific link by ID.
- `/:userId/links`: GET request to fetch all links associated with a user.
- `/:userId/delete-link/:linkId`: DELETE request to delete a specific link.
- `/:userId/delete-all-links`: DELETE request to delete all links associated with a user.
- `/:userId/edit-link/:linkId`: PUT request to edit a specific link.

## Controllers

- **AuthController**: Handles user registration, login, and Google OAuth authentication.
- **UserController**: Manages user-related operations such as fetching user details, deleting users, and submitting contact forms.
- **LinkController**: Controls link-related operations including adding, fetching, deleting, and editing links.

## Models

- **UserModel**: Defines the schema for the user collection, including fields for fullname, email, password, and links.
- **LinkModel**: Specifies the schema for the link collection, including fields for name, link, description, and tags.
- **ContactModel**: Defines the schema for the contact form collection, including fields for subject, description, and userId.

## Middleware

- **Authorization Middleware**: `authorize` middleware function to verify JWT tokens and authenticate users.

## Setting Up Development Environment

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file.
4. Run the backend server: `npm start`

## Testing

- Unit tests: `npm test`
- End-to-end tests: `npm run e2e`

## Contributing

Contributions to Link Union are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Create a new pull request.

## Further Help

For more information on using Angular CLI, refer to the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
