import {MessageType} from "./MessageType.ts";

export type ChatLogType = {
    id: number;
    messages: MessageType[];
}