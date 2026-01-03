// import { NextFunction, Request, Response } from "express";
// import { SessionService } from "../services/session.service";
// import { TokenService } from "../services/token.service";

// export const authMiddleware =
//   (tokenService: TokenService, sessionService: SessionService) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const token = req.headers.authorization?.replace("Bearer ", "");

//       if (!token) {
//         throw new Error("Unauthorized");
//       }

//       const payload = tokenService.verifyToken(token, "access");

//       const valid = await sessionService.isSessionValid(
//         payload.sessionId,
//         payload.deviceId,
//       );

//       if (!valid) {
//         throw new Error("Session expired");
//       }

//       req.user = payload;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
