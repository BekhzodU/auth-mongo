import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/User";
import {
  catchError,
  signToken,
  correctPassword,
  getNewCookieDate,
} from "../utils/helper";
import AppError from "../utils/appError";
import userRepository from "../repositories/userRepository";

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: getNewCookieDate(),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

class Auth {
  signup = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;
      const newUser: IUser = await userRepository.create({
        name,
        email,
        password,
      });

      createSendToken(newUser, 201, res);
    }
  );

  login = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password)
        return next(new AppError("No email or password", 400));

      const user: IUser | null = await userRepository.findOneBy("email", email);
      const isCorrectPassword = await correctPassword(password, user?.password);
      if (!user || !isCorrectPassword)
        return next(new AppError("Incorrect email or password", 401));

      createSendToken(user, 200, res);
    }
  );

  logout = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      res.cookie("jwt", null, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.status(200).json({ status: "success" });
    }
  );
}

export default new Auth();
