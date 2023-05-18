import { query } from "../db.query.js";

const DATABASE_NAME = "user-service";

class UserRepository {
  static async findByEmail({ email }) {
    const queryString = `SELECT * FROM "${DATABASE_NAME}" WHERE email = '${email}'`;
    const data = await query(queryString);
    return data[0];
  }

  static async findById({ userId }) {
    const queryString = `SELECT * FROM "${DATABASE_NAME}" WHERE id = '${userId}'`;
    const data = await query(queryString);
    return data[0];
  }

  // CREATE
  static async create({ fullName, email, password }) {
    const queryString = {
      text: `
        INSERT INTO "${DATABASE_NAME}" (fullName, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, fullName, email, status, roles, isActive, createdAt, updatedAt
      `,
      values: [fullName, email, password],
    };
    const data = await query(queryString);
    return data[0];
  }
}

export default UserRepository;
