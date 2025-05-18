import executeQuery from "../utils/dbReader.js";
import path from "path";


export class OrganizationModel {

    static async organizationMiddlewareMember(values) {
        const filePathMiddlewareOrganizations = path.join("queries/middlewares/organization.sql");
        return await executeQuery(filePathMiddlewareOrganizations, values);
    }

    static async organizationMiddlewareOwner(values) {
        const filePathMiddlewareOrganizations = path.join("queries/middlewares/owner.sql");
        return await executeQuery(filePathMiddlewareOrganizations, values);
    }

  static async createOrganization(values) {
    
    const filePathCreateOrganization = path.join("queries/organization/createOrganization.sql");
    return await executeQuery(filePathCreateOrganization, values);

  }

  static async getOrganization(values) {
    const filePathGetOrganizations = path.join("queries/organization/getOrganization.sql");
    return await executeQuery(filePathGetOrganizations, values);
  }


  static async addUserToOrganization(values) {
    const filePathAddUserToOrganization = path.join("queries/organization/addUserToOrganization.sql");
    return await executeQuery(filePathAddUserToOrganization, values);
  }

static async removeUserFromOrganization(values) {
    const filePathRemoveUserFromOrganization = path.join("queries/organization/removeUserFromOrganization.sql");
    return await executeQuery(filePathRemoveUserFromOrganization, values);
}


}