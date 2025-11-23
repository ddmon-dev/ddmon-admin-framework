import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from './auth.constants';

/**
 * 비밀번호를 bcrypt로 해시
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
