import executeQuery from "../utils/dbReader.js";
import path from "path";

export class DestinationModel {

    static async getDestinations(values) {
        const filePathGetPlaces = path.join("queries/destination/getDestinations.sql");
        return await executeQuery(filePathGetPlaces, values);
    }

    static async createDestination(values) {
        const filePathCreateDestination = path.join("queries/destination/createDestination.sql");
        return await executeQuery(filePathCreateDestination, values);
    }
}