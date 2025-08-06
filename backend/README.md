# RV Cabs Backend

A modern, scalable backend service for the RV Cabs taxi booking platform, built with Express.js, TypeScript, and Supabase.

## 🏗️ Architecture

This backend follows a clean, modular architecture with clear separation of concerns:

```
src/
├── common/          # Shared utilities and error handlers
├── config/          # Configuration files (Supabase, environment)
├── controllers/     # Route handlers and business logic
├── interfaces/      # TypeScript type definitions
├── middlewares/     # Custom middleware (auth, validation, etc.)
├── models/          # TypeScript interfaces for data models
├── routes/          # Route definitions organized by feature
├── services/        # Business logic and external API calls
├── utils/           # Helper functions and utilities
└── index.ts         # Application entry point
```

### Key Architectural Decisions

1. **Controller-Based Architecture**: Clean separation between routes and business logic
2. **TypeScript Models**: Strongly typed interfaces matching database schema
3. **Modular Routes**: Feature-based route organization for better maintainability
4. **Unified Authentication**: Single middleware handling all auth scenarios
5. **Direct Supabase Integration**: No ORM overhead, direct database operations
6. **Error-First Design**: Comprehensive error handling and logging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Required environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SECRET=your_supabase_secret_key
   JWT_SECRET=your_jwt_secret
   PORT=3000
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses the following main entities:

- **Users**: Customer and driver profiles
- **Bookings**: Trip reservations and ride requests
- **Packages**: Pre-defined tour packages
- **Drivers**: Driver profiles and vehicle information
- **OTP Sessions**: Phone verification and authentication

See `src/models/index.ts` for complete TypeScript interfaces.

## 🔐 Authentication

Authentication is handled through a unified middleware system:

- **Phone-based OTP**: Primary authentication method
- **JWT Tokens**: Session management with refresh token support
- **Role-based Access**: Customer, driver, and admin roles
- **Admin Secret**: Bypass authentication for admin operations

## 📡 API Endpoints

### Health Check
- `GET /health` - Service health status

### Authentication
- `POST /api/v1/auth/send-otp` - Send OTP to phone number
- `POST /api/v1/auth/verify-otp` - Verify OTP and get tokens
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `GET /api/v1/users/:id/bookings` - Get user's booking history
- `GET /api/v1/users` - List all users (admin only)

## 🛠️ Development

### Project Structure

- **Routes**: Organized by feature in `src/routes/`
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Models**: TypeScript interfaces for type safety
- **Middleware**: Authentication, validation, and error handling

### Code Style

- **TypeScript**: Strictly typed for better developer experience
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (run with `npm run format`)

### Testing

```bash
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_KEY` | Supabase anon key | Required |
| `SUPABASE_SECRET` | Supabase secret key | Required |
| `JWT_SECRET` | JWT signing secret | Required |

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `src/scripts/sql/init_schema.sql`
3. Set up Row Level Security with `src/scripts/sql/rls_policies.sql`
4. Configure environment variables

## 📈 Performance & Scaling

- **Direct Database Queries**: Optimized Supabase queries without ORM overhead
- **Connection Pooling**: Built-in Supabase connection management
- **Error Handling**: Comprehensive error logging and monitoring
- **Type Safety**: Runtime error prevention through TypeScript

## 🔒 Security

- **Phone Verification**: OTP-based authentication
- **JWT Tokens**: Secure session management
- **Row Level Security**: Database-level access control
- **Input Validation**: Request validation and sanitization
- **Environment Isolation**: Secure configuration management

## 📚 API Documentation

For detailed API documentation, see the inline JSDoc comments in controllers and services, or use tools like Postman to explore the endpoints.

## 🤝 Contributing

1. Follow the established architecture patterns
2. Maintain TypeScript types for all new code
3. Add appropriate error handling
4. Update documentation for new features
5. Run linting and formatting before commits

## 📄 License

This project is part of the RV Cabs platform.
