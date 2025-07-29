import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import logger from '../logger/winstonLogger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  if (role === 'Admin') {
    return next(new ApiError('Admin cannot sign up.', ErrorCodes.FORBIDDEN.statusCode));
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError('Email already exists.', ErrorCodes.BAD_REQUEST.statusCode));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword, role });

  const userData = newUser.toJSON();
  delete userData.password;

  logger.info(`User signed up: ${email}`);
  return res.status(201).json({ message: 'User created', user: userData });
};




export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError('User not found.', ErrorCodes.NOT_FOUND.statusCode));
  }

  const isMatch = await bcrypt.compare(password, user.get('password') as string);
  if (!isMatch) {
    return next(new ApiError('Invalid credentials.', ErrorCodes.UNAUTHORIZED.statusCode));
  }

  const token = jwt.sign(
    { id: user.get('id'), role: user.get('role') },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const userData = user.toJSON();
  delete userData.password;

  logger.info(`User logged in: ${email}`);
  return res.json({ token, user: userData });
};



export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude password
    });

    return res.json({ users });
  } catch (error) {
    return next(new ApiError('Failed to fetch users.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};



export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name,email,role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return next(new ApiError('User not found.', ErrorCodes.NOT_FOUND.statusCode));
    }

    if (user.get('role') === 'Admin') {
      return next(new ApiError('Cannot assign Admin role.', ErrorCodes.FORBIDDEN.statusCode));
    }

    await user.update({ name,email,role });

    const updatedUser = user.toJSON(); // include password

  logger.info(`User role updated`, { id, name, email, role });

    return res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    return next(new ApiError('Failed to update user role.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};



export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return next(new ApiError('User not found.', ErrorCodes.NOT_FOUND.statusCode));
  }

  if (user.get('role') === 'Admin') {
    return next(new ApiError('Admin users cannot be deleted.', ErrorCodes.FORBIDDEN.statusCode));
  }

  await user.destroy();

  logger.info(`User deleted: ID ${id}`);
  return res.json({ message: 'User deleted successfully' });
};


export const getDevelopers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const developers = await User.findAll({
      attributes: ['id', 'name'],  // only select id and name
      where: { role: 'Developer' } // filter role = Developer
    });

    return res.json({ developers });
  } catch (error) {
    return next(new ApiError('Failed to fetch developers.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};
