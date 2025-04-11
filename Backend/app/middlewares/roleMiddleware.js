import ROLES from "../config/roles.js";

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak, Anda tidak memiliki izin" });
    }
    next();
  };
};

export default roleMiddleware;
