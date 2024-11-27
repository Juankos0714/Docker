import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserLogin, IUserRegister } from '../types/user.types';
import { UserService } from '../services/user.service';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password }: IUserLogin = req.body;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  public register = async (req: Request, res: Response) => {
    try {
      const userData: IUserRegister = req.body;

      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await this.userService.create({
        ...userData,
        password: hashedPassword
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}