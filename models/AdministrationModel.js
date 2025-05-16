import executeQuery from "../utils/dbReader.js";
import path from "path";

export class AdministrationModel {

    static async administrationMiddleware(values){
        const filePathMiddlewareAdministration = path.join("queries/middlewares/administrateur.sql");
        return await executeQuery(filePathMiddlewareAdministration, values);
    }

}