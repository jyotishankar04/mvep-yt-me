import {
  InternalServerError,
  ValidationError,
} from "../../../middlewares/error-handler";
import RedisService from "./redis.service";

// Should implement otp_spam_lock, otp_cooldown,otp_lock

class OtpService {
  constructor(private readonly redisService: RedisService) {}

  async generateOtp(email: string) {
    try {
      await this.checkOtpRestrictions(email);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.set(`otp:${email}`, String(otp));
      await this.redisService.expire(`otp:${email}`, 300);
      await this.redisService.set(`otp_cooldown:${email}`, "true");
      await this.redisService.expire(`otp_cooldown:${email}`, 60);
      await this.trackOtpRequests(email);
      return otp;
    } catch (error) {
      return new InternalServerError("Error in OTP generation");
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const storedOtp = await this.redisService.get(`otp:${email}`);
      if (!storedOtp || storedOtp !== otp) {
        return new ValidationError("Invalid OTP");
      }
      await this.redisService.del(`otp:${email}`);
      await this.redisService.del(`otp_cooldown:${email}`);
      await this.redisService.del(`otp_cooldown:${email}`);
      return true;
    } catch (error) {
      return new InternalServerError("Error in OTP verification");
    }
  }
  async checkOtpRestrictions(email: string) {
    // Check otp_spam_lock, otp_cooldown,otp_lock
    if (await this.redisService.get(`otp_spam_lock:${email}`)) {
      return new ValidationError("OTP spamming detected, Wait for 1 hour");
    }
    if (await this.redisService.get(`otp_cooldown:${email}`)) {
      return new ValidationError("OTP cooldown detected Wait for 60 seconds");
    }
    if (await this.redisService.get(`otp_lock:${email}`)) {
      return new ValidationError("OTP lock detected, Wait for 15 minutes");
    }
    return null;
  }
  async resetOtpRestrictions(email: string) {
    await this.redisService.del(`otp_spam_lock:${email}`);
    await this.redisService.del(`otp_cooldown:${email}`);
    await this.redisService.del(`otp_lock:${email}`);
  }
  async trackOtpRequests(email: string) {
    const count = await this.redisService.incr(`otp_attempts:${email}`);
    if (count >= 3) {
      await this.redisService.set(`otp_spam_lock:${email}`, "true");
      await this.redisService.expire(`otp_spam_lock:${email}`, 3600);
      return new ValidationError("OTP spamming detected, Wait for 1 hour");
    }
    await this.redisService.incr(`otp_attempts:${email}`);
    await this.redisService.expire(`otp_attempts:${email}`, 60);
  }
}

export default OtpService;
