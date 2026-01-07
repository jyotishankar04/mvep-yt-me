import { PrismaClient, User } from "../../../generated/prisma/client";
import { InternalServerError } from "../../../middlewares/error-handler";
import { UserRegisterSchema } from "../validator";

class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(data: UserRegisterSchema) {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      if (!user) {
        throw new InternalServerError("Error in user creation");
        return;
      }
      return user;
    } catch (error) {
      new InternalServerError("Error in user creation");
      return;
    }
  }
  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      new InternalServerError("Error in user retrieval");
      return;
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      new InternalServerError("Error in user retrieval");
      return;
    }
  }
  async verifyUser(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isVerified: true },
      });
      if (!user) {
        throw new InternalServerError("Error in user verification");
        return;
      }
      return user;
    } catch (error) {
      new InternalServerError("Error in user verification");
      return;
    }
  }
  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      if (!user) {
        throw new InternalServerError("Error in user deletion");
        return;
      }
      return user;
    } catch (error) {
      new InternalServerError("Error in user deletion");
      return;
    }
  }
}

export default AuthService;
