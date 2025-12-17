import bcrypt from "bcrypt";
const salt = 10;
export class Password {
  static async toHash(password: string) {
    try {
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (err) {
      console.error(err);
    }
  }

  static async compare(password: string, hashedPassword: string) {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
