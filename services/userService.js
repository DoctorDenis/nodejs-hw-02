const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = class userService {
  static async registerUser(body) {
    const encriptionResult = await bcrypt.hash(body.password, saltRounds);
    body.password = encriptionResult;
    const result = await userModel.create(body);
    return result;
  }

  static async loginUser(body) {
    const result = await userModel.findOne({ email: body.email });
    let authResult = null;
    if (result) {
      authResult = await bcrypt.compare(body.password, result.password);
    } else {
      const error = new Error(`User with email ${body.email} not found in db`);
      error.code = 404;
      throw error;
    }

    if (!result || !authResult) {
      throw new Error(`Email or password is wrong`);
    } else {
      return result;
    }
  }

  static async getUserInfoById(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Not found");
    } else {
      return user;
    }
  }

  static async updateSuscription(id, obj) {
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { subscription: obj.subscription },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    if (!user) {
      throw new Error("Not found");
    } else {
      return user;
    }
  }
};