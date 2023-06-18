import {
  ForbiddenRequestError,
  NotFoundError,
} from '../core/error.response.js';
import AddressRepository from '../pg/repository/address.repository.js';
import UserRepository from '../pg/repository/user.repository.js';

class AddressService {
  static async addAddress({ data }) {
    const { user_id, full_name, street_address, state, postal_code, country } =
      data;

    const foundUser = await UserRepository.findById({ userId: user_id });
    if (!foundUser) throw new NotFoundError('User not found!');

    const existAddress = await AddressRepository.findByUserId({
      userId: user_id,
    });
    let defaultAddress = false;
    if (!existAddress) {
      defaultAddress = true;
    }

    return await AddressRepository.addAddress({
      user_id,
      full_name,
      street_address,
      state,
      postal_code,
      country,
      defaultAddress,
    });
  }

  static async defaultAddress({ userId, address_id }) {
    const foundAddress = await AddressRepository.findById({ id: address_id });
    if (!foundAddress) throw new NotFoundError("Uesr's address not found!");

    if (foundAddress.user_id !== userId)
      throw new ForbiddenRequestError('Your not permission!');

    return await AddressRepository.defaultAddress({ address_id });
  }

  static async deleteAddress({ userId, address_id }) {
    const foundAddress = await AddressRepository.findByIdAndUserId({
      user_id: userId,
      address_id,
    });
    if (!foundAddress) throw new NotFoundError("User's address not found!");

    return await AddressRepository.deleteAddress({
      user_id: userId,
      address_id,
    });
  }

  static async updateAddress({ userId, address_id, updated }) {
    const foundAddress = await AddressRepository.findByIdAndUserId({
      user_id: userId,
      address_id,
    });
    if (!foundAddress) throw new NotFoundError("User's address not found!");

    return await AddressRepository.updateAddress({
      userId,
      address_id,
      updated,
    });
  }
}

export default AddressService;
