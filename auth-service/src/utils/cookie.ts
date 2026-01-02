import { CookieOptions, Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions,
) => {
  res.cookie(name, value, options);
};

export const deleteCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};

export const cookieTypes = {
  registrationToken: "registrationToken",
  resetPasswordToken: "resetPasswordToken",
  forgotPasswordToken: "forgotPasswordToken",
  forgotVerificationToken: "forgotVerificationToken",
  refreshToken: "refreshToken",
  accessToken: "accessToken",
};
