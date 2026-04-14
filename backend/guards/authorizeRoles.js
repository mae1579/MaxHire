const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Brak danych użytkownika. Wymagane uwierzytelnienie.",
      });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Brak wymaganych uprawnień !." });
    }
  };
};

module.exports = authorizeRoles;
