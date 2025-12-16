# Eduhub API

A modern educational platform API built with NestJS, featuring course management, AI-powered quiz generation, and user authentication.

## Description

Eduhub API is a comprehensive backend solution for educational platforms. It provides:

- **User Management**: Secure authentication and authorization with JWT
- **Course Management**: Create, update, and manage educational courses with resources
- **AI-Powered Quizzes**: Generate quizzes automatically using Mistral AI
- **Role-Based Access**: Support for different user roles (Student, Teacher, Admin)
- **File Uploads**: Handle course materials and resources

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **AI Integration**: Mistral AI
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL database
- Mistral AI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/eduhub?schema=public"

# JWT Configuration
JWT_SECRET="your-secure-jwt-secret-key-here"

# Mistral AI Configuration
MISTRAL_API_KEY="your-mistral-api-key-here"
```

### Variable Descriptions

- **DATABASE_URL**: PostgreSQL connection string for Prisma ORM
  - Format: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`
  - Example: `postgresql://postgres:password@localhost:5432/eduhub?schema=public`

- **JWT_SECRET**: Secret key used for signing and verifying JWT tokens
  - Should be a long, random string
  - Keep this secret and never commit it to version control
  - Example: Generate with `openssl rand -base64 32`

- **MISTRAL_API_KEY**: API key for Mistral AI service
  - Required for AI-powered quiz generation
  - Get your API key from [Mistral AI Console](https://console.mistral.ai/)

## Project setup

```bash
# Install dependencies
$ pnpm install

# Setup database
$ pnpm prisma migrate dev

# Seed database with initial data
$ pnpm run seed
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode (recommended for development)
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### Main Endpoints

- **Authentication**: `/auth`
  - POST `/auth/register` - Register a new user
  - POST `/auth/sign-in` - Sign in and get JWT token

- **Users**: `/users`
  - GET `/users` - List all users (Admin only)
  - GET `/users/:id` - Get user by ID

- **Courses**: `/courses`
  - GET `/courses` - List all courses
  - POST `/courses` - Create a new course (Teacher/Admin)
  - GET `/courses/:id` - Get course details
  - PATCH `/courses/:id` - Update course (Teacher/Admin)
  - DELETE `/courses/:id` - Delete course (Admin)
  - POST `/courses/:id/ressources` - Add resource to course

- **Quizzes**: `/quizzes`
  - POST `/quizzes/generate` - Generate AI-powered quiz from course content

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production:

1. Set all environment variables in your hosting platform
2. Run database migrations: `pnpm prisma migrate deploy`
3. Build the application: `pnpm run build`
4. Start the production server: `pnpm run start:prod`

For more deployment options, check out the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## Database Management

```bash
# Generate Prisma Client after schema changes
$ pnpm prisma generate

# Create a new migration
$ pnpm prisma migrate dev --name migration_name

# Apply migrations in production
$ pnpm prisma migrate deploy

# Open Prisma Studio (database GUI)
$ pnpm prisma studio

# Reset database (development only)
$ pnpm prisma migrate reset
```

## Project Structure

```
src/
├── auth/           # Authentication & authorization
├── users/          # User management
├── courses/        # Course management
├── quizzes/        # AI-powered quiz generation
├── database/       # Prisma service & database module
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
├── migrations/     # Database migrations
└── seed.ts         # Database seeding script
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Mistral AI Documentation](https://docs.mistral.ai)

## License

This project is [MIT licensed](LICENSE).
