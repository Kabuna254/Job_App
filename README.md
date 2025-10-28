# Job Board API

A full-stack Job Board application that allows Employers to post, update, and delete jobs, while Job Seekers can search and apply for them.

## Features

### Authentication
- Employer and Job Seeker roles
- JWT-based login and registration

### Employer Capabilities
- Register and login
- Create, update, and delete job postings

### Job Seeker Capabilities
- Register and login
- Browse and apply for jobs

## Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- bcrypt for password hashing

### Frontend:
- React
- Axios

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` – Register as an Employer or Seeker
- `POST /login` – Login and receive JWT token

### Job Routes (`/api/jobs`)
- `GET /` – Get list of jobs (public)
- `POST /` – Create job (Employer only)
- `PUT /:id` – Update job (Employer only)
- `DELETE /:id` – Delete job (Employer only)

### Application Routes (`/api/applications`)
- `POST /:jobId` – Apply to a job (Seeker only)
- `GET /` – Get your applications

## Getting Started

### Prerequisites
- Node.js & npm or pnpm
- MongoDB instance (local or cloud)

### Installation

```bash
pnpm install
```

### Environment Variables
Create a `.env` file in the root with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Run Server
```bash
pnpm run dev
```

Server will be running on `http://localhost:5000`

## API Endpoints

### Auth Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/auth/register` | Register user (Employer or Seeker) |
| POST   | `/api/auth/login`    | Login user |

### Job Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/jobs`          | Get all jobs (with pagination) |
| POST   | `/api/jobs`          | Create a job (Employer only) |
| GET    | `/api/jobs/:id`      | Get job details |
| PUT    | `/api/jobs/:id`      | Update job (Employer only) |
| DELETE | `/api/jobs/:id`      | Delete job (Employer only) |

## Screenshots
coming soon


## Live Demo / App URL

Frontend (React/Vite App): [jobboardapp-025.vercel.app](jobboardapp-025.vercel.app)

API Backend (Hosted): *coming soon*

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

- Daniel Kabuna

Feel free to contribute, fork, and improve the project!

