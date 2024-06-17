import { Response, NextFunction } from 'express';
import { UserRequest } from '../@types';
import { User } from '../models/User';
const jwt = require('jsonwebtoken');

exports.authenticate = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });

    // console.log("****TOKEN****", token, process.env.SECRET_KEY);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (err) {
    console.log("****ERROR****", err);
    res.status(401).json({ message: 'Token de autenticación inválido' });
  }
};

exports.authorize = (allowedRoles: [string]) => {
  // console.log("**AUTHORIZE**", allowedRoles);
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};
