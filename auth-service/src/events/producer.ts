import { producer } from "../config/kafka";
import { SellerEvent } from "./types";

const sendEvent = async (event: SellerEvent) => {
    await producer.send({
        topic: event.eventType,
        messages: [{ value: JSON.stringify(event) }],
    });
}

export { sendEvent };