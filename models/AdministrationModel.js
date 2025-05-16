import { deleteOrganization } from "../controllers/admin.js";
import executeQuery from "../utils/dbReader.js";
import path from "path";

export class AdministrationModel {

    static async administrationMiddleware(values){
        const filePathMiddlewareAdministration = path.join("queries/middlewares/administrateur.sql");
        return await executeQuery(filePathMiddlewareAdministration, values);
    }

    static async getAll(values){
        const filePathGetAll = path.join("queries/admin/getAdminAll.sql");
        return await executeQuery(filePathGetAll, values);
    }

    static async deleteOrganization(values){
        const filePathDeleteOrganization = path.join("queries/admin/deleteOrganization.sql");
        return await executeQuery(filePathDeleteOrganization, values);
    }

    static async deleteEvent(values){
        const filePathDeleteEvent = path.join("queries/admin/deleteEvent.sql");
        return await executeQuery(filePathDeleteEvent, values);
    }

    static async deleteUser(values){
        const filePathDeleteUser = path.join("queries/admin/deleteUser.sql");
        return await executeQuery(filePathDeleteUser, values);
    }

}