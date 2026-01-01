import { USER_EVENTS, SELLER_EVENTS } from "./events.constants";
export type SellerEventType = typeof SELLER_EVENTS[keyof typeof SELLER_EVENTS];

export interface SellerEvent {
    eventType: SellerEventType;
    data: {
          id: string;
          role: "SELLER";
          email: string;
          sessionId: string;
          name: string;
    }
}