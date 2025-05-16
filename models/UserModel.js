import executeQuery from "../utils/dbReader.js";
import path from "path";

export class UserModel {

  static async getUserById(values) {
    const filePathGetUserById = path.join("queries/users/getUserById.sql");
    return await executeQuery(filePathGetUserById, values);
  };

  static async getUserByEmail(values) {
    const filePathGetUserByEmail = path.join("queries/users/getUserByEmail.sql");
    return await executeQuery(filePathGetUserByEmail, values);
  };

  static async getUserInfoById(values) {
    const filePathDataUser = path.join("queries/auth/getUserInfoByUserId.sql");
    return await executeQuery(filePathDataUser, values);
  };

  static async updateUserInfo(values) {
    const filePathUpdateUser = path.join("queries/auth/updateUserInfo.sql");
    return await executeQuery(filePathUpdateUser, values);
  };

  static async getUserInfo(values) {
    const filePathGetUser = path.join("queries/auth/getUserInfo.sql");
    return await executeQuery(filePathGetUser, values);
  };

}