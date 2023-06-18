import { query } from '../db.query';

const DATABASE_NAME = 'address';

class AddressRepository {
  // CREATE
  static async addAddress({
    user_id,
    full_name,
    street_address,
    state,
    postal_code,
    country,
    defaultAddress,
  }) {
    const queryString = {
      text: `
                INSERT INTO "${DATABASE_NAME}" (
                    user_id,
                    full_name,
                    street_address,
                    state,
                    postal_code,
                    country,
                    defaultAddress
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `,
      values: [
        user_id,
        full_name,
        street_address,
        state,
        postal_code,
        country,
        defaultAddress,
      ],
    };

    const data = await query(queryString);
    return data[0];
  }

  // GET
  static async findById({ id }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}"
        WHERE id = '${id}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async findByIdAndUserId({ user_id, address_id }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}"
        WHERE user_id = '${user_id}' and address_id = '${address_id}'
    `;
    const data = await query(queryString);
    return data[0];
  }

  // UPDATE
  static async defaultAddress({ address_id }) {
    const queryString = `
        UPDATE "${DATABASE_NAME}"
        SET default_address = true
        WHERE id = '${address_id}'
        RETURNING *;
    `;
    const data = await query(queryString);
    return data[0];
  }

  static async updateAddress({ userId, address_id, updated }) {
    const { street_address, city, state, country } = updated;
    const queryString = `
        UPDATE "${DATABASE_NAME}"
        SET 
            street_address = '${street_address}',
            city = '${city}'
            state = '${state}'
            country = '${country}'

        WHERE id = '${address_id}' and user_id = '${userId}'
        RETURNING *;
    `;
    const data = await query(queryString);
    return data[0];
  }

  // DELETE
  static async deleteAddress({ user_id, address_id }) {
    const queryString = `
        DELETE FROM "${DATABASE_NAME}"
        WHERE id = '${address_id}' AND user_id = '${user_id}'
    `;
    const data = await query(queryString);
    return data[0];
  }
}

export default AddressRepository;
