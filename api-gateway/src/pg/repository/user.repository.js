import { query } from '../db.query.js';

const DATABASE_NAME = 'users';

class UserRepository {
  static async findByEmail({ email, active = 'active' }) {
    const queryString = `
      SELECT * FROM "${DATABASE_NAME}" 
      WHERE email = '${email}' and status = '${active}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async findById({ userId }) {
    const queryString = `
    SELECT * FROM "${DATABASE_NAME}" 
    WHERE id = '${userId}' and status = 'active'
  `;
    const data = await query(queryString);
    return data[0];
  }

  // CREATE
  static async create({ firstName, lastName, email, password }) {
    const queryString = {
      text: `
        INSERT INTO "${DATABASE_NAME}" (firstName, lastName, email, password, phone_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING email;
      `,
      values: [firstName, lastName, email, password, null],
    };
    const data = await query(queryString);
    return data[0];
  }

  // Update
  static async activeAccount({ email }) {
    const queryString = `
      UPDATE "${DATABASE_NAME}"
      SET status = 'active'
      WHERE email = '${email}'
      RETURNING *;
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async changePassword({ email, newPassword }) {
    const queryString = `
        UPDATE "${DATABASE_NAME}"
        SET password = '${newPassword}'
        WHERE email = '${email}'
        RETURNING *;
      `;
    const data = await query(queryString);
    return data[0];
  }

  // DELETE
  static async deleteOlderAccount() {
    const queryString = `
        DELETE FROM "${DATABASE_NAME}"
        WHERE created_at < NOW() - INTERVAL '1 day' and status = 'inactive'
    `;
    const data = await query(queryString);
    return data[0];
  }
}

export default UserRepository;
