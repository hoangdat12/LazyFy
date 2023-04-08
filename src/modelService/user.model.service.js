import _User from "../models/user.model.js";

const findUserByEmail = ({
  email,
  select = {
    email: 1,
    fullName: 1,
    password: 2,
    name: 1,
    status: 1,
    role: 1,
    isActive: 1,
  },
}) => {
  return _User.findOne({ email }).select(select).lean();
};

const findUserByUserId = ({ userId }) => {
  return _User.findOne({ _id: userId }).lean();
};

const findOneAndUpdateUser = (
  query,
  update,
  options = { new: true, upset: true }
) => {
  return _User.findOneAndUpdate(query, update, options).lean();
};

const saveUser = (user) => {
  return _User.save(user);
};

export { findUserByEmail, findUserByUserId, findOneAndUpdateUser, saveUser };
