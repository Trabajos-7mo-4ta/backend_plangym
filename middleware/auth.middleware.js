import jwt from 'jsonwebtoken';

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // El token se espera en el formato: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificamos el token con el secreto del archivo .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
      }

      // Guardamos los datos del usuario (id, rol, etc.) en req.user
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).json({ error: 'Error del servidor al verificar el token.' });
  }
};

// Middleware opcional para restringir acceso según el rol
export const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Requiere rol de administrador.' });
  }
  next();
};

export const isTrainer = (req, res, next) => {
  if (req.user.rol !== 'entrenador' && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Requiere rol de entrenador o superior.' });
  }
  next();
};