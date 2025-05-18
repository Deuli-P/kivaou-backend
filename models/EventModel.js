import executeQuery from "../utils/dbReader.js";
import path from "path";

export class EventModel{
    static async createEvent(values) {
        const filePathCreateEvent = path.join("queries/event/createEvent.sql");

        return await executeQuery(filePathCreateEvent, values);
    }

    static async getEvents(values) {
        const filePathGetEvents = path.join("queries/event/getEventsActive.sql");
        return await executeQuery(filePathGetEvents, values);
    }

    static async submitEvent(values) {
        const filePathSubmitEvent = path.join("queries/event/submitEvent.sql");
        return await executeQuery(filePathSubmitEvent, values);
    }

    static async cancelSubmitEvent(values) {
        const filePathCancelSubmitEvent = path.join("queries/event/cancelSubmitEvent.sql");
        return await executeQuery(filePathCancelSubmitEvent, values);
    }

    static async getEventById(values) {
        const filePathGetEvent = path.join("queries/event/getEventById.sql");
        return await executeQuery(filePathGetEvent, values);
    }

    static async cancelEvent(values) {
        const filePathCancelEvent = path.join("queries/event/cancelEvent.sql");
        return await executeQuery(filePathCancelEvent, values);
    }
}
