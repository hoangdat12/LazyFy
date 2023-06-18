import { OK } from '../core/success.response.js';
import AddressService from '../services/address.service.js';

class AddressController {
  static async addAddress(req, res, next) {
    try {
      const user = req.user;
      const body = req.body;

      return new OK(
        await AddressService.addAddress({
          data: { ...body, user_id: user.id },
        }),
        'Add address success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async defaultAddress(req, res, next) {
    try {
      const user = req.user;
      const { address_id } = req.body;

      return new OK(
        await AddressService.defaultAddress({ userId: user.id, address_id }),
        'Set default address successfully!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async deleteAddress(req, res, next) {
    try {
      const user = req.user;
      const { address_id } = req.body;

      return new OK(
        await AddressService.deleteAddress({ userId: user.id, address_id }),
        'Delete address successfully!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async updateAddress(req, res, next) {
    try {
      const user = req.user;
      const { address_id, updated } = req.body;

      return new OK(
        await AddressService.updateAddress({
          userId: user.id,
          address_id,
          updated,
        }),
        'Update address successfully!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default AddressController;
