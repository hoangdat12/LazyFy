import { query } from '../db.query.js';
import crypto from 'crypto';

const DATABASE_NAME = 'otp-token';

class OtpRepository {
  static async createOtp({ email }) {
    const token = crypto.randomBytes(20).toString('hex');
    const secret = crypto.randomBytes(10).toString('hex');
    const queryString = {
      text: `
        INSERT INTO "${DATABASE_NAME}" (email, token, secret)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      values: [email, token, secret],
    };
    const data = await query(queryString);
    return data[0];
  }

  static async findByToken({ token }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}"
        WHERE token = '${token}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async findBySecret({ secret, email }) {
    const queryString = `
    SELECT * FROM "${DATABASE_NAME}"
    WHERE secret = '${secret}' AND email = '${email}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async findByEmail({ email }) {
    const queryString = `
    SELECT * FROM "${DATABASE_NAME}"
    WHERE email = '${email}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async deleteBySecret({ secret }) {
    const queryString = `
      DELETE FROM "${DATABASE_NAME}"
      WHERE secret = '${secret}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async deleteOlderOtp() {
    const queryString = `
      DELETE FROM "otp-token"
      WHERE created_at < NOW() - INTERVAL '1 day' 
    `;
    const data = await query(queryString);
    return data[0];
  }
}

export default OtpRepository;
