import executeQuery from "../utils/dbReader.js";
import path from "path";

export class AuthModel {

  static async createAuth(values) {
    const filePathCreateUser = path.join("queries/auth/createUser.sql");
    return await executeQuery(filePathCreateUser, values);
  }

  static async getAuthByEmail(values) {
    const filePathGetUser = path.join("queries/auth/getAuthByEmail.sql");
    return await executeQuery(filePathGetUser, values);
  }

  static async getUserInfoByAuthId(values) {
    const filePathGetUserInfo = path.join("queries/auth/getUserInfoByAuthId.sql");
    return await executeQuery(filePathGetUserInfo, values);
  };

}