# Angular API Master

## Project Description

Angular API Master is a comprehensive Angular application demonstrating proficiency in working with APIs. This project showcases various aspects of API integration, including data fetching, error handling, authentication, optimization, and environment configuration.

The application interacts with the JSONPlaceholder API (https://jsonplaceholder.typicode.com/) to perform CRUD operations on posts and comments. It implements features such as pagination, caching, lazy loading, and proper error handling to provide a robust user experience.

## Demo
[click here](https://angular-api-master.netlify.app/)

## Key Features

- Comprehensive API client service for interacting with JSONPlaceholder API
- Components for listing posts, viewing individual posts with comments, creating new posts, and editing existing posts
- Error handling with user-friendly error messages and retry logic
- HTTP interceptor for adding mock authentication tokens and logging requests/responses
- Pagination for the posts list with a reusable pagination component
- Simple caching mechanism for GET requests
- Environment-specific configurations (development, staging, production)
- Lazy loading for the post detail module
- Unit tests for API client service and components

## Setup and Run Instructions

1. Clone the repository:
   ```
   git clone https://github.com/happyGikundiro/Angular-API-Master.git
   cd API-Master
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Available npm Scripts

- `npm start`: Start the development server
- `npm run build`: Build the project for production
- `npm run build:staging`: Build the project for staging environment
- `npm test`: Run unit tests
- `npm run e2e`: Run end-to-end tests
- `npm run lint`: Lint the project files
- `npm run format`: Format the project files using Prettier

## Building for Different Environments

- Development: `ng build`
- Staging: `ng build --configuration staging`
- Production: `ng build --configuration production`

## Running Tests

- Run unit tests: `ng run test`
