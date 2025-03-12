const authMiddleware = (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access Denied" });
      }
      next();
    };
  };
  
  export default authMiddleware;
  