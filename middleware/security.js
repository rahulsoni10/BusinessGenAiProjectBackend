import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Apply security middleware
export const securityMiddleware = (app) => {
  // Set security headers (includes XSS protection)
  app.use(helmet());
  
  // Rate limiting
  app.use(limiter);
}; 