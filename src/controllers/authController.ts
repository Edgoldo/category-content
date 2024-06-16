import { Request, Response } from "express";
import { User, UserDocument } from '../models/User';
import { UserRequest } from "../@types";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role }: UserDocument = req.body;
    const user = new User({ username, email, password , role});
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.login = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserDocument = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.getUser = async (req: UserRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req: UserRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

function generateToken(user: UserDocument) {``
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
}
