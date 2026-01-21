import {
  PrismaClient,
  SellerStatus,
  User,
} from "../../../generated/prisma/client";
import { InternalServerError } from "../../../middlewares/error-handler";
import { hashPassword } from "../utils/password";
import { SellerRegisterSchema } from "../validator";

class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(data: SellerRegisterSchema) {
    try {
      const seller = await this.prisma.seller.create({
        data: {
          email: data.email,
          password: await hashPassword(data.password),
          name: data.name,
          phoneNo: data.phoneNo,
          country: data.country,
          isVerified: false,
          isApproved: false,
          status: "INIT",
        },
      });
      if (!seller) {
        throw new InternalServerError("Error in user creation");
      }
      return seller;
    } catch (error) {
      new InternalServerError("Error in user creation");
      return;
    }
  }

  async changeStatus(id: string, status: SellerStatus) {
    try {
      const seller = await this.prisma.seller.update({
        where: { id },
        data: { status },
      });
      if (!seller) {
        throw new InternalServerError("Error in user status update");
      }
      return seller;
    } catch (error) {
      new InternalServerError("Error in user status update");
      return;
    }
  }

  async getSellerById(id: string) {
    try {
      const seller = await this.prisma.seller.findUnique({
        where: { id },
      });
      return seller;
    } catch (error) {
      new InternalServerError("Error in user retrieval");
      return;
    }
  }
  async getSellerByEmail(email: string) {
    try {
      const seller = await this.prisma.seller.findUnique({
        where: { email },
      });
      return seller;
    } catch (error) {
      new InternalServerError("Error in user retrieval");
      return;
    }
  }
  async verifySeller(id: string) {
    try {
      const seller = await this.prisma.seller.update({
        where: { id },
        data: { isVerified: true, status: SellerStatus.SETUP },
      });
      if (!seller) {
        throw new InternalServerError("Error in user verification");
      }
      return seller;
    } catch (error) {
      new InternalServerError("Error in user verification");
      return;
    }
  }
  async deleteSeller(id: string) {
    try {
      const seller = await this.prisma.seller.delete({
        where: { id },
      });
      if (!seller) {
        throw new InternalServerError("Error in user deletion");
      }
      return seller;
    } catch (error) {
      new InternalServerError("Error in user deletion");
      return;
    }
  }
  async resetPassword(id: string, newPassword: string) {
    try {
      const seller = await this.prisma.seller.update({
        where: { id },
        data: { password: await hashPassword(newPassword) },
      });
      if (!seller) {
        throw new InternalServerError("Error in password reset");
      }
      return seller;
    } catch (error) {
      new InternalServerError("Error in password reset");
      return;
    }
  }
}

export default AuthService;
