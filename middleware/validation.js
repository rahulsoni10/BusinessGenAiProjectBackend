import { validationResult, body } from 'express-validator';
import { HTTP_STATUS_CODES } from '../constants/roles.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  validate
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const complaintValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  validate
];

// Custom validation for complaint form-data
export const validateComplaintFormData = (req, res, next) => {
  const { orderId, productType, description } = req.body;
  const errors = [];

  if (!orderId || orderId.trim().length < 1) {
    errors.push({
      type: 'field',
      value: orderId || '',
      msg: 'Order ID is required',
      path: 'orderId',
      location: 'body'
    });
  }

  if (!productType || productType.trim().length < 1) {
    errors.push({
      type: 'field',
      value: productType || '',
      msg: 'Product type is required',
      path: 'productType',
      location: 'body'
    });
  }

  if (!description || description.trim().length < 10) {
    errors.push({
      type: 'field',
      value: description || '',
      msg: 'Description must be at least 10 characters long',
      path: 'description',
      location: 'body'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const postValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
  validate
];

// Custom validation for form-data (after multer processes it)
export const validatePostFormData = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5) {
    errors.push({
      type: 'field',
      value: title || '',
      msg: 'Title must be at least 5 characters long',
      path: 'title',
      location: 'body'
    });
  }

  if (!description || description.trim().length < 10) {
    errors.push({
      type: 'field',
      value: description || '',
      msg: 'Description must be at least 10 characters long',
      path: 'description',
      location: 'body'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const commentValidation = [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment content cannot be empty'),
  validate
]; 