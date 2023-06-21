import { query } from '../db.query.js';

const DATABASE_NAME = 'key-token';

class KeyTokenRepository {
  static async updateOrCreate({ userId, publicKey, privateKey, refreshToken }) {
    const queryString = {
      text: `
        INSERT INTO "${DATABASE_NAME}" (user_id, public_key, private_key, refresh_token)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE SET
        public_key = $2,
        private_key = $3,
        refresh_token = $4
        RETURNING public_key
    `,
      values: [userId, publicKey, privateKey, refreshToken],
    };
    const data = await query(queryString);
    return data[0];
  }

  static async updateByUserId({ userId, newRefreshToken, olderRefershToken }) {
    const queryString = `
      UPDATE "${DATABASE_NAME}"
      SET 
        refresh_token = $2,
        refresh_tokens_used = array_append(refresh_tokens_used, $3),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *;
    `;
    const values = [userId, newRefreshToken, olderRefershToken];
    const data = await query({ text: queryString, values });
    return data[0];
  }

  static async findByUserId({ userId }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}"
        WHERE user_id = '${userId}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async findByRefreshTokenUsed({ refreshToken }) {
    const queryString = `
      SELECT * FROM "${DATABASE_NAME}"
      WHERE $1 = ANY (refresh_tokens_used)
    `;
    const values = [refreshToken];
    const data = await query({ text: queryString, values });
    return data[0];
  }

  static async findByRefershToken({ refreshToken }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}"
        WHERE refresh_token = '${refreshToken}' 
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async deleteById({ keyTokenId }) {
    const queryString = `
       DELETE FROM "${DATABASE_NAME}"
       WHERE id = '${keyTokenId}'
       RETURNING (SELECT count(*) > 0); 
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async deleteByUserId({ userId }) {
    const queryString = `
        DELETE FROM "${DATABASE_NAME}" 
        WHERE user_id = '${userId}'
        RETURNING (SELECT count(*) > 0);
    `;
    const data = await query(queryString);
    return data[0];
  }
}

export default KeyTokenRepository;
