import jwt from "jsonwebtoken";

// Middleware to verify JWT token

export const isAuth = async (req, res, next) => {

  try {
    // extract token from request cookies
    const token = req.cookies.token;

    // token validation
    if (!token) {
      return res.status(401).json({ message: 'Token is not found', success: false });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request object
    req.id = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};