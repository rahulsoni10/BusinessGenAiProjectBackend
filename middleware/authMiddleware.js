import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODES, USER_ROLES } from '../constants/roles.js';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Access denied. No token provided. Please login to continue',
    });
  }

  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);
    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Access denied. Invalid token. Please login again',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.userInfo.role !== USER_ROLES.ADMIN) {
    return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

export default authMiddleware;
