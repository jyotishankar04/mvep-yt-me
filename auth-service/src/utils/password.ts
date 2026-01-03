import bcryptjs from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
