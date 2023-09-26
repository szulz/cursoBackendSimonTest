import { UserSchema } from './models/users.model.js';

class UserModel {
  async findOne(username) {
    return await UserSchema.findOne({email:username});
  }

  async create(user) {
    return await UserSchema.create(user);
  }

  async findById(id) {
    return await UserSchema.findById(id);
  }
}

export const userModelLogic = new UserModel();
