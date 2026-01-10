export const EMAIL_TYPE = {
  REGISTER: "register",
  VERIFY: "verify",
  RESET: "reset",
  WELCOME: "welcome",
} as const;

export type EmailType = (typeof EMAIL_TYPE)[keyof typeof EMAIL_TYPE];

type RegisterEmailPayload = {
  name: string;
  otp: string;
};

type VerifyEmailPayload = {
  name: string;
};

type ResetPasswordEmailPayload = {
  name: string;
};

type WelcomeEmailPayload = {
  name: string;
};

type ForgotPasswordEmailPayload = {
  name: string;
  otp: string;
};

export type EmailPayload =
  | RegisterEmailPayload
  | VerifyEmailPayload
  | ResetPasswordEmailPayload
  | WelcomeEmailPayload;

const registerEmailTemplate = ({ name, otp }: RegisterEmailPayload) => `
    <div>
      <h1>Welcome to our platform!</h1>
      <p>Dear ${name},</p>
      <p>Your OTP is <b>${otp}</b></p>
      <p>Please use this OTP to verify your email.</p>
      <p>The Team</p>
    </div>
  `;

const verifyEmailTemplate = ({ name }: VerifyEmailPayload) => `
    <div>
      <h1>Email Verified</h1>
      <p>Hi ${name},</p>
      <p>Your email has been successfully verified.</p>
      <p>The Team</p>
    </div>
  `;

const resetPasswordEmailTemplate = ({ name }: ResetPasswordEmailPayload) => `
    <div>
      <h1>Password Reset</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>The Team</p>
    </div>
  `;

const welcomeEmailTemplate = ({ name }: WelcomeEmailPayload) => `
    <div>
      <h1>Welcome 🎉</h1>
      <p>Hi ${name},</p>
      <p>We’re glad to have you on board.</p>
      <p>The Team</p>
    </div>
  `;

const forgotPasswordEmailTemplate = ({
  name,
  otp,
}: ForgotPasswordEmailPayload) => `
    <div>
      <h1>Password Reset</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>Please use this OTP to reset your password:</p>
      <p><b>${otp}</b></p>
      <p>The Team</p>
    </div>
  `;

export {
  registerEmailTemplate,
  verifyEmailTemplate,
  resetPasswordEmailTemplate,
  welcomeEmailTemplate,
  forgotPasswordEmailTemplate,
};
