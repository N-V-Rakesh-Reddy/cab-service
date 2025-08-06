# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- VS Code (recommended) with TypeScript extension

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd cab-service/backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure these variables in `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_anon_key
   SUPABASE_SECRET=your_service_role_key
   JWT_SECRET=your_jwt_secret_minimum_32_chars
   PORT=3000
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   # Run database initialization (optional - using Supabase)
   npm run db:init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
├── src/
│   ├── common/           # Shared utilities
│   │   └── errorHandler.ts
│   ├── config/           # Configuration
│   │   └── supabase.ts
│   ├── controllers/      # HTTP request handlers
│   │   ├── AuthController.ts
│   │   ├── BaseController.ts
│   │   └── UserController.ts
│   ├── interfaces/       # TypeScript definitions
│   │   └── env.d.ts
│   ├── middlewares/      # Express middleware
│   │   ├── auth.ts
│   │   └── unifiedAuth.ts
│   ├── models/           # Data models and types
│   │   └── index.ts
│   ├── routes/           # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── index.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── otpService.ts
│   │   └── userService.ts
│   ├── utils/            # Helper functions
│   │   ├── jwt.ts
│   │   └── logger.ts
│   └── index.ts          # App entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Coding Standards

### TypeScript Guidelines

1. **Strict Type Checking**
   - Always use explicit types for function parameters and return values
   - Avoid `any` type; use proper interfaces or unions
   - Enable strict mode in tsconfig.json

2. **Interface Design**
   ```typescript
   // Good: Extends base interface
   interface User extends BaseEntity {
     phone: string;
     name?: string;
     role: 'customer' | 'admin' | 'driver';
   }
   
   // Good: Use union types for status
   type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
   ```

3. **Error Handling**
   ```typescript
   // Use custom error types
   try {
     const result = await someAsyncOperation();
     return result;
   } catch (error) {
     logger.error('Operation failed:', { error: String(error) });
     throw new CustomError('Operation failed', 500);
   }
   ```

### Code Organization

1. **Controllers**
   - Keep controllers thin - delegate business logic to services
   - Handle HTTP concerns only (request/response)
   - Use proper status codes and response formats

2. **Services**
   - Contain business logic and database operations
   - Should be testable and reusable
   - Use dependency injection patterns where possible

3. **Routes**
   - Group related routes in separate files
   - Use middleware for common functionality
   - Keep route definitions clean and readable

### Database Patterns

1. **Direct Supabase Queries**
   ```typescript
   // Use *WithClient methods for flexibility
   static async getUserProfileWithClient(userId: string, client: any) {
     const { data, error } = await client
       .from('users')
       .select('*')
       .eq('id', userId)
       .single();
     
     if (error) throw error;
     return data;
   }
   ```

2. **Error Handling**
   ```typescript
   // Always handle Supabase errors properly
   if (error) {
     logger.error('Database error:', { error: error.message });
     throw new DatabaseError(error.message);
   }
   ```

## Testing

### Running Tests

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Manual Testing

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Authentication Flow**
   ```bash
   # Send OTP
   curl -X POST http://localhost:3000/api/v1/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone": "+1234567890"}'
   
   # Verify OTP (check your console/database for the actual OTP)
   curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phone": "+1234567890", "otp": "123456"}'
   ```

## Common Development Tasks

### Adding a New Endpoint

1. **Create/Update Route**
   ```typescript
   // In src/routes/userRoutes.ts
   router.post('/profile', userController.updateProfile.bind(userController));
   ```

2. **Add Controller Method**
   ```typescript
   // In src/controllers/UserController.ts
   async updateProfile(req: Request, res: Response) {
     try {
       const userId = req.user?.id;
       const profileData = req.body;
       
       const result = await UserService.updateProfileWithClient(
         userId, 
         profileData, 
         this.supabase
       );
       
       res.json({ success: true, data: result });
     } catch (error) {
       this.handleError(res, error);
     }
   }
   ```

3. **Implement Service Method**
   ```typescript
   // In src/services/userService.ts
   static async updateProfileWithClient(userId: string, data: any, client: any) {
     const { data: result, error } = await client
       .from('users')
       .update(data)
       .eq('id', userId)
       .select()
       .single();
     
     if (error) throw error;
     return result;
   }
   ```

### Adding New Models

1. **Define Interface**
   ```typescript
   // In src/models/index.ts
   export interface NewEntity extends BaseEntity {
     name: string;
     description?: string;
     status: 'active' | 'inactive';
   }
   ```

2. **Add Request/Response Types**
   ```typescript
   export interface CreateNewEntityRequest {
     name: string;
     description?: string;
   }
   ```

## Debugging

### Common Issues

1. **TypeScript Compilation Errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

2. **Database Connection Issues**
   - Verify Supabase credentials in `.env`
   - Check network connectivity
   - Verify RLS policies in Supabase

3. **Authentication Problems**
   - Check JWT secret configuration
   - Verify token format and expiration
   - Check middleware order in routes

### Logging

Use the built-in logger for debugging:

```typescript
import { logger } from '../utils/logger';

logger.info('User login attempt', { userId, timestamp: new Date() });
logger.error('Database error', { error: error.message, query });
logger.debug('Request details', { method, url, headers });
```

## Performance Optimization

### Database Queries

1. **Use Specific Selects**
   ```typescript
   // Good: Select only needed fields
   .select('id, name, email')
   
   // Avoid: Select all fields
   .select('*')
   ```

2. **Implement Pagination**
   ```typescript
   const { data, error } = await client
     .from('users')
     .select('*')
     .range(startIndex, endIndex)
     .limit(limit);
   ```

3. **Use Proper Indexing**
   - Ensure database indexes on frequently queried fields
   - Use Supabase performance insights

### Caching Strategies

For future implementation:
- Redis for session storage
- In-memory caching for frequently accessed data
- CDN for static assets

## Deployment

### Environment-Specific Configurations

1. **Development**
   - Enable debug logging
   - Use development Supabase project
   - Hot reloading enabled

2. **Production**
   - Disable debug logging
   - Use production Supabase project
   - Enable compression and security headers

### Health Checks

The `/health` endpoint provides service status:
```json
{
  "status": "ok",
  "timestamp": "2025-08-06T17:00:00.000Z",
  "version": "1.0.0"
}
```

## Best Practices

1. **Security**
   - Validate all inputs
   - Use parameterized queries
   - Implement proper authentication
   - Follow OWASP guidelines

2. **Error Handling**
   - Use consistent error formats
   - Log errors with context
   - Don't expose sensitive information

3. **Code Quality**
   - Write self-documenting code
   - Use meaningful variable names
   - Keep functions small and focused
   - Follow DRY principles

4. **Documentation**
   - Document public APIs
   - Add JSDoc comments for complex functions
   - Keep README files updated
   - Document deployment procedures
