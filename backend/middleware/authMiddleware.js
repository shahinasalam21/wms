import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to Verify JWT and Attach User Role
export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// Role-Based Middleware
export const authMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access Denied" });
    }
    next();
  };
};
